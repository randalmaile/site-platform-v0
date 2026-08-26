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
 * ALSO: registry items ship their own `utils.ts`, their own theme, their own
 * `components.json` — and the CLI will happily write all of them. This wrapper
 * only ever ADDS. Every path in PROTECTED_FILES / PROTECTED_TREES below is
 * snapshotted before the run and put back byte-for-byte after it, so an install
 * can bring in new blocks, missing ui/ primitives and dependencies but can never
 * replace a decision the project already made. `--overwrite` is refused for the
 * same reason.
 *
 * REGISTRIES: only the two V0 actually uses. Adding another means adding it to
 * `components.json` and to DESTINATIONS below — deliberately, not by default.
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const COMPONENTS = join(ROOT, "src/components");
const UI = join(COMPONENTS, "ui");
const GLOBALS = join(ROOT, "src/app/globals.css");

/**
 * Files this script never lets an install rewrite. Each one is a project
 * decision a registry has its own opinion about: the utils helper, the theme,
 * the CLI's own config, the CMS schema, the agent instructions.
 */
const PROTECTED_FILES = [
  "src/lib/utils.ts",
  "src/app/globals.css",
  "components.json",
  "keystatic.config.ts",
  "CLAUDE.md",
  "AGENTS.md",
];

/**
 * Everything that ALREADY exists under these is protected too. A ui/ primitive
 * is upstream-managed but locally patched often enough that a silent rewrite
 * loses work; a missing one still installs normally.
 */
const PROTECTED_TREES = ["src/components/ui"];

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

${c.bold("Adds only.")} Existing platform files and existing ui/ primitives are never
rewritten, and --overwrite is refused. New files install normally.

${c.bold("Shadcnblocks")} needs SHADCNBLOCKS_API_KEY in your environment.
`);
  process.exit(1);
}

const dryRun = args.includes("--dry-run");

// ── Refuse --overwrite ──────────────────────────────────────────────────
// `--overwrite` is the CLI's "yes to every file", which is precisely the thing
// this wrapper exists to prevent. Catches the long form, `-o`, and short
// clusters like `-yo`.
const isOverwriteFlag = (a) =>
  /^--overwrite(=.*)?$/.test(a) || /^-[a-zA-Z]*o[a-zA-Z]*$/.test(a);

if (args.some(isOverwriteFlag)) {
  console.error(c.red("\n✗ --overwrite is not available in block:add."));
  console.error(
    c.dim(
      "\n  block:add adds files. It does not replace them. These stay as the\n" +
        "  project wrote them, and so does every file already in src/components/ui/:\n",
    ),
  );
  PROTECTED_FILES.forEach((f) => console.error(c.dim(`    ${f}`)));
  console.error(
    c.dim(
      "\n  Taking a registry's version of one of these is maintenance, not an\n" +
        "  install — it changes something the whole project depends on. Do it\n" +
        "  deliberately:\n",
    ) +
      "    1. see what the registry would write:\n" +
      c.dim("       npx shadcn add --diff <item>\n") +
      "    2. apply the parts you actually want by hand\n" +
      "    3. npm run verify, then commit that change on its own\n" +
      c.dim("\n  → docs/workflows/add-component.md#updating-a-protected-file\n"),
  );
  process.exit(1);
}

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

const before = { root: tsxIn(COMPONENTS), ui: tsxIn(UI) };

// ── Snapshot the protected files ────────────────────────────────────────
const filesUnder = (dir, out = []) => {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) filesUnder(p, out);
    else out.push(p);
  }
  return out;
};

// Only what exists now: a protected path that is missing is a file the install
// is allowed to create.
const guarded = [
  ...new Set([
    ...PROTECTED_FILES.map((rel) => join(ROOT, rel)),
    ...PROTECTED_TREES.flatMap((rel) => filesUnder(join(ROOT, rel))),
  ]),
]
  .filter(existsSync)
  .map((path) => ({ path, content: readFileSync(path) }));

/** Put back anything the install changed. Returns the paths it restored. */
const restoreProtected = () => {
  const restored = [];
  for (const { path, content } of guarded) {
    if (existsSync(path) && readFileSync(path).equals(content)) continue;
    writeFileSync(path, content);
    restored.push(relative(ROOT, path));
  }
  return restored;
};

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

// The child's stdin is a run of bare newlines, one per question the CLI might
// ask. It asks "The file X already exists. Would you like to overwrite?" once
// per file it wants to replace, and there is no "no to all" flag — `--overwrite`
// is yes to all. A confirm submitted empty keeps its default, which is no, so
// every one of those answers itself and the install carries on adding what is
// genuinely new. Closing stdin instead does NOT work: the aborted prompt takes
// the rest of the install with it and the block never lands.
//
// This is convenience, not the guarantee — restoreProtected() below is. Only a
// conflict can raise a prompt, so budgeting one per guarded file plus slack
// covers any real install; exhausting it would stop the CLI at a prompt, which
// the restore pass still survives.
const answers = "\n".repeat(guarded.length + 64);

try {
  execFileSync(bin, argv, {
    stdio: ["pipe", "inherit", "inherit"],
    input: answers,
  });
} catch {
  const rescued = restoreProtected();
  if (rescued.length) {
    console.error(
      c.yellow(`\n  Restored ${rescued.length} protected file(s) it had changed:`),
    );
    rescued.forEach((f) => console.error(`    ${f}`));
  }
  console.error(c.red("\n✗ shadcn add failed — nothing to tidy.\n"));
  process.exit(1);
}

const restored = restoreProtected();

if (dryRun) {
  console.log(c.bold("\n── protected ──"));
  console.log(
    c.dim(
      "\n  block:add never rewrites these. Anything the plan above marks\n" +
        "  \"overwrite\" for one of them is skipped:\n",
    ),
  );
  guarded.forEach(({ path }) =>
    console.log(c.dim(`    ${relative(ROOT, path)}`)),
  );
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
const alreadyThere = [];
const conflicted = [];

const moveInto = (folder, file, fromDir, oldAlias) => {
  const destDir = join(COMPONENTS, folder);
  mkdirSync(destDir, { recursive: true });
  const dest = join(destDir, file);
  const from = join(fromDir, file);
  // Same rule as the protected set: what is already filed stays. An identical
  // fresh copy is worth nothing, so it goes rather than sitting loose at the
  // components root; a differing one is left there to be looked at.
  if (existsSync(dest)) {
    if (readFileSync(from).equals(readFileSync(dest))) {
      rmSync(from);
      alreadyThere.push(`src/components/${folder}/${file}`);
      return;
    }
    console.log(
      c.yellow(
        `  ! ${folder}/${file} already exists and the registry's copy differs.\n` +
          `    Yours is untouched; the new one is at ${relative(ROOT, from)}.\n` +
          `    To take the update, diff the two, delete the old file, reinstall.`,
      ),
    );
    conflicted.push(relative(ROOT, from));
    return;
  }
  renameSync(from, dest);
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
} else if (!alreadyThere.length && !conflicted.length) {
  console.log(
    c.dim("\n  Nothing to move — everything landed in the right place."),
  );
}
if (conflicted.length) {
  console.log(
    c.yellow(`\n  Left at the components root — nothing was overwritten:`),
  );
  conflicted.forEach((f) => console.log(`    ${f}`));
}
if (alreadyThere.length) {
  console.log(c.dim(`\n  Already filed, unchanged:`));
  alreadyThere.forEach((f) => console.log(c.dim(`    ${f}`)));
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

if (restored.length) {
  const plural = restored.length === 1 ? "" : "s";
  console.log(c.yellow(`\n  Preserved ${restored.length} protected file${plural}:`));
  restored.forEach((f) => console.log(`    ${f}`));
  console.log(
    c.dim(
      "\n    The install tried to rewrite these; the project's copies are back\n" +
        "    in place — nothing to undo. Wanting a registry's version of one of\n" +
        "    them is a maintenance change:\n" +
        "    docs/workflows/add-component.md#updating-a-protected-file",
    ),
  );
  if (restored.includes(relative(ROOT, GLOBALS))) {
    console.log(
      c.dim(
        "\n    globals.css is the theme source of truth. If this block needs\n" +
          "    tokens, add them deliberately: docs/design-system/tokens.md",
      ),
    );
  }
} else {
  console.log(
    c.dim(
      "\n  Protected files untouched ✓ (globals.css, utils.ts, ui/ primitives…)",
    ),
  );
}
console.log(
  c.dim(
    "\n  A \"skipped\" line above for one of those files is this guard working.\n" +
      "  The CLI's suggestion to rerun with --overwrite does not apply here.",
  ),
);

console.log(
  c.dim(
    "\n  Reminder: files under shadcnblocks/ are registry source — copy them\n" +
      "  into normalized/ before editing. See docs/workflows/add-component.md\n",
  ),
);
