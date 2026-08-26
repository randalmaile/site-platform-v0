/**
 * Fails when the filesystem and `src/lib/routes.ts` disagree.
 *
 * A page added under `src/app/(site)` without a matching entry in the registry
 * is invisible to `sitemap.ts` — the page ships and nothing ever points a
 * crawler at it. A registry entry with no page is the opposite failure: the
 * sitemap advertises a 404. Neither is caught by lint, types or the build, so
 * this runs in `verify:fast` and in CI.
 *
 * Two assertions, both directions:
 *
 *   every page.tsx under (site)  →  must appear in PUBLIC_ROUTES
 *   every PUBLIC_ROUTES entry    →  must have a page.tsx
 *
 * DYNAMIC ROUTES ARE NOT SUPPORTED YET, and that is a deliberate omission
 * rather than a gap to paper over. The base has none. When a project adds its
 * first `[slug]`, extend this script to check that the registry covers the
 * segment — do not delete the guard below to make the error go away.
 *
 * Run: `npm run check:routes`
 *
 * WHY THE RESOLVER HOOK: this imports `routes.ts` directly so the registry
 * stays the single source of truth instead of being re-parsed and re-guessed
 * here. Node strips the types, but resolves neither the `@/` alias nor a
 * `.ts` extension the way a bundler would. Ten lines of resolver beat a build
 * step for one script.
 */
import { readdirSync } from "node:fs";
import { registerHooks } from "node:module";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const SITE_DIR = join(ROOT, "src", "app", "(site)");
const SRC_URL = pathToFileURL(join(ROOT, "src") + sep).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    // `@/lib/routes` → src/lib/routes.ts
    if (specifier.startsWith("@/")) {
      return nextResolve(`${SRC_URL}${specifier.slice(2)}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});

const { PUBLIC_ROUTES } = await import("../src/lib/routes.ts");

/** Every `page.tsx` under `src/app/(site)`, as a URL pathname. */
function findPages(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findPages(full));
    else if (entry.name === "page.tsx") out.push(toPathname(full));
  }
  return out;
}

/** `src/app/(site)/about/page.tsx` → `/about` */
function toPathname(file) {
  const segments = relative(join(ROOT, "src", "app"), file)
    .split(sep)
    .slice(0, -1) // drop page.tsx
    .filter((s) => !(s.startsWith("(") && s.endsWith(")"))); // drop route groups
  return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

const pages = findPages(SITE_DIR);
const errors = [];

for (const page of pages.filter((p) => p.includes("["))) {
  errors.push(
    `dynamic route found: ${page}\n` +
      `    This guard only understands static routes. Extend it to check that\n` +
      `    the registry covers this segment — see the header of this file.`,
  );
}

for (const page of pages.filter((p) => !p.includes("["))) {
  if (!PUBLIC_ROUTES.includes(page)) {
    errors.push(`missing from PUBLIC_ROUTES: ${page}  (page.tsx exists)`);
  }
}

for (const route of PUBLIC_ROUTES) {
  if (!pages.includes(route)) {
    errors.push(`extra in PUBLIC_ROUTES:   ${route}  (no page.tsx)`);
  }
}

if (errors.length > 0) {
  console.error(
    "check:routes — src/lib/routes.ts and the filesystem disagree\n",
  );
  for (const error of errors) console.error(`  ${error}`);
  console.error(`\n${errors.length} problem(s). Edit src/lib/routes.ts.`);
  process.exit(1);
}

console.log(
  `check:routes — OK. ${pages.length} page(s), ${PUBLIC_ROUTES.length} URL(s) in the sitemap.`,
);
