#!/usr/bin/env node
/**
 * Registry-aware wrapper around `shadcn add`.
 *
 *   npm run block:add -- @shadcnblocks/hero12
 *   npm run block:add -- @shadcn/button
 *   npm run block:add -- --dry-run @shadcnblocks/hero12
 *
 * WHY THIS EXISTS
 * The shadcn CLI writes every non-`registry:ui` item to `aliases.components`
 * (→ `src/components/` root) and every `registry:ui` item to `aliases.ui`
 * (→ `src/components/ui/`). Those aliases are GLOBAL — there is no per-registry
 * output path. This project files components by ownership instead:
 *
 *   src/components/ui/            shadcn/ui primitives — upstream-managed
 *   src/components/shadcnblocks/  pristine registry source — never edited
 *   src/components/normalized/    project-owned adaptations — where edits go
 *
 * So: run the CLI, see what appeared, move it to the directory its registry
 * implies, and repair every import that pointed at the old path.
 * See `.claude/rules/components.md`.
 *
 * ALSO: the CLI can overwrite `globals.css` during an install. That file is the
 * theme source of truth, so this hashes it and shouts if it changed.
 *
 * REGISTRIES: only the two V0 actually uses. Adding another means adding it to
 * `components.json` and to DESTINATIONS below — deliberately, not by default.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const COMPONENTS = join(ROOT, "src/components");
const UI = join(COMPONENTS, "ui");
const GLOBALS = join(ROOT, "src/app/globals.css");

/** Where each registry namespace files its output. */
const DESTINATIONS = {
  // The built-in shadcn/ui registry. Its primitives already land in ui/, so
  // this entry exists to let a prefixed `@shadcn/<name>` past the
  // unprefixed-name guard below — the move loop then leaves it where it is.
  "@shadcn": "ui",
  "@shadcnblocks": "shadcnblocks",
};

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(`
${c.bold("Usage:")} npm run block:add -- @<registry>/<item> [more items…] [--dry-run]

${c.bold("Examples:")}
  npm run block:add -- @shadcnblocks/hero12
  npm run block:add -- @shadcn/button @shadcn/dialog
  npm run block:add -- --dry-run @shadcnblocks/blog1

${c.bold("Note:")} every item needs its own @registry/ prefix. A bare name after
a prefixed one falls through to the default shadcn registry and 404s.

${c.bold("Shadcnblocks")} needs SHADCNBLOCKS_API_KEY in your environment.
`);
  process.exit(1);
}

const dryRun = args.includes("--dry-run");

// ── Validate item names ─────────────────────────────────────────────────
const items = args.filter((a) => !a.startsWith("-"));
const bare = items.filter((i) => !i.startsWith("@"));
if (bare.length) {
  console.error(
    c.red(`\n✗ These items are missing a @registry/ prefix: ${bare.join(", ")}`),
  );
  console.error(
    c.dim(
      "  Unprefixed names resolve against the default shadcn registry and 404.\n",
    ),
  );
  process.exit(1);
}

/** item spec → { registry, name } */
const requested = items.map((spec) => {
  const [registry, ...rest] = spec.split("/");
  return { registry, name: rest.join("/"), spec };
});

const unknown = requested.filter((r) => !(r.registry in DESTINATIONS));
if (unknown.length) {
  console.error(
    c.red(
      `\n✗ Unknown registry: ${[...new Set(unknown.map((u) => u.registry))].join(", ")}`,
    ),
  );
  console.error(
    c.dim(
      `  Known: ${Object.keys(DESTINATIONS).join(", ")}.\n` +
        `  Adding one means adding it to components.json AND to DESTINATIONS in this script.\n`,
    ),
  );
  process.exit(1);
}

// ── Snapshot ────────────────────────────────────────────────────────────
const tsxIn = (dir) =>
  existsSync(dir)
    ? new Set(
        readdirSync(dir).filter(
          (f) => f.endsWith(".tsx") && statSync(join(dir, f)).isFile(),
        ),
      )
    : new Set();

const hash = (p) =>
  existsSync(p)
    ? createHash("sha1").update(readFileSync(p)).digest("hex")
    : null;

const before = { root: tsxIn(COMPONENTS), ui: tsxIn(UI) };
const globalsBefore = hash(GLOBALS);

// ── Run the CLI ─────────────────────────────────────────────────────────
// Prefer the pinned devDependency over `shadcn@latest`: npx would fetch a
// different version and prompt for it, which is slower and a silent version
// drift in a file the project is supposed to control.
const localCli = join(ROOT, "node_modules/.bin/shadcn");
const useLocal = existsSync(localCli);
const bin = useLocal ? localCli : "npx";
const argv = useLocal ? ["add", ...args] : ["shadcn@latest", "add", ...args];

console.log(
  c.dim(
    `\n→ ${useLocal ? "shadcn (local)" : "npx shadcn@latest"} add ${args.join(" ")}\n`,
  ),
);
if (!useLocal) {
  console.log(
    c.yellow("  ! shadcn is not installed locally — falling back to npx.\n"),
  );
}
try {
  execFileSync(bin, argv, { stdio: "inherit" });
} catch {
  console.error(c.red("\n✗ shadcn add failed — nothing to tidy.\n"));
  process.exit(1);
}

if (dryRun) {
  console.log(c.dim("\n(dry run — no files written, nothing to tidy)\n"));
  process.exit(0);
}

// ── What appeared? ──────────────────────────────────────────────────────
const after = { root: tsxIn(COMPONENTS), ui: tsxIn(UI) };
const newIn = (k) => [...after[k]].filter((f) => !before[k].has(f));

/** Which registry did we ask this file's basename from? */
const registryFor = (file) => {
  const stem = file.replace(/\.tsx$/, "");
  // Shadcnblocks uses nested slugs (`image-zoom/image-zoom-standard-1`), but
  // the file that lands is the last segment only. Match either form.
  return (
    requested.find((r) => r.name === stem || r.name.split("/").pop() === stem)
      ?.registry ?? null
  );
};

/** [oldImportPath, newImportPath] pairs, for the repo-wide fix-up. */
const rewrites = [];
const moved = [];
const leftAlone = [];

const moveInto = (folder, file, fromDir, oldAlias) => {
  const destDir = join(COMPONENTS, folder);
  mkdirSync(destDir, { recursive: true });
  const dest = join(destDir, file);
  if (existsSync(dest)) {
    console.log(
      c.yellow(
        `  ! ${folder}/${file} already exists — leaving the new copy at ${relative(ROOT, fromDir)}/${file}`,
      ),
    );
    return;
  }
  renameSync(join(fromDir, file), dest);
  const stem = file.replace(/\.tsx$/, "");
  rewrites.push([`${oldAlias}/${stem}`, `@/components/${folder}/${stem}`]);
  moved.push(
    `${relative(ROOT, fromDir)}/${file} → src/components/${folder}/${file}`,
  );
};

// Blocks land at the components root. Everything there belongs to a registry.
for (const file of newIn("root")) {
  const registry = registryFor(file);
  const folder = registry
    ? DESTINATIONS[registry]
    : DESTINATIONS["@shadcnblocks"];
  if (!registry) {
    console.log(
      c.yellow(
        `  ! ${file} wasn't one of the items you asked for (a dependency?) — filing it under ${folder}/`,
      ),
    );
  }
  moveInto(folder, file, COMPONENTS, "@/components");
}

// ui/ gets shadcn primitives (correct — leave them) AND anything from a
// registry whose output belongs elsewhere.
for (const file of newIn("ui")) {
  const registry = registryFor(file);
  const folder = registry ? DESTINATIONS[registry] : null;
  if (!folder || folder === "ui") {
    leftAlone.push(`src/components/ui/${file}`);
    continue;
  }
  moveInto(folder, file, UI, "@/components/ui");
}

// ── Repair imports repo-wide ────────────────────────────────────────────
const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.(tsx?|css)$/.test(entry.name)) out.push(p);
  }
  return out;
};

// Escape regex metacharacters. Kept out of any template literal on purpose:
// the `${` in the character class would start an interpolation.
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let patched = 0;
if (rewrites.length) {
  const searchRoot = join(ROOT, "src");
  for (const file of existsSync(searchRoot) ? walk(searchRoot) : []) {
    const original = readFileSync(file, "utf8");
    let next = original;
    for (const [from, to] of rewrites) {
      // Only match a complete specifier: followed by a quote or a slash, so
      // `@/components/blog1` never matches inside `@/components/blog11`.
      next = next.replaceAll(new RegExp(escapeRe(from) + "(?=[\"'/])", "g"), to);
    }
    if (next !== original) {
      writeFileSync(file, next);
      patched++;
    }
  }
}

// ── Report ──────────────────────────────────────────────────────────────
console.log(c.bold("\n── tidy ──"));
if (moved.length) {
  console.log(c.green(`\n  Moved ${moved.length}:`));
  moved.forEach((m) => console.log(`    ${m}`));
} else {
  console.log(
    c.dim("\n  Nothing to move — everything landed in the right place."),
  );
}
if (leftAlone.length) {
  console.log(c.dim(`\n  Left in ui/ (shadcn primitives):`));
  leftAlone.forEach((f) => console.log(c.dim(`    ${f}`)));
}
if (rewrites.length) {
  console.log(
    patched
      ? c.green(
          `\n  Repaired imports in ${patched} file${patched === 1 ? "" : "s"}.`,
        )
      : c.dim("\n  No imports needed repairing (nothing referenced them yet)."),
  );
}

if (globalsBefore && hash(GLOBALS) !== globalsBefore) {
  console.log(
    c.red("\n  ⚠ globals.css CHANGED during this install.") +
      c.dim("\n    It is the theme source of truth. Check what happened:") +
      "\n    git diff src/app/globals.css\n",
  );
} else {
  console.log(c.dim("\n  globals.css unchanged ✓"));
}

console.log(
  c.dim(
    "\n  Reminder: files under shadcnblocks/ are registry source — copy them\n" +
      "  into normalized/ before editing. See docs/workflows/add-component.md\n",
  ),
);
