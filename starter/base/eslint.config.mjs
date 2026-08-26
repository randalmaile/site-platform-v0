import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/*
 * Flat config, Next 16.
 *
 * `next lint` was removed in Next 16 and nothing lints during `next build` any
 * more, so `npm run lint` is the only thing that runs ESLint. It is part of
 * `verify:fast`.
 *
 * ESLINT IS PINNED TO THE 9.x LINE, and npm will warn that 9.x is past its
 * support window. Do not "fix" that by bumping to 10: `eslint-config-next`
 * declares `eslint: >=9.0.0` but bundles an `eslint-plugin-react` that still
 * calls the legacy rule-context API ESLint 10 removed, so every lint run dies
 * with `contextOrFilename.getFilename is not a function`. Verified against
 * eslint-config-next@16.3.3. Revisit when Next ships a config that supports 10.
 */
export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,

  // Node scripts: not React, not browser.
  {
    files: ["scripts/**/*.mjs", "*.config.mjs"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },

  /*
   * Pristine registry source. Files under `shadcnblocks/` are never edited —
   * `block:add` overwrites them on update, so any fix made there is thrown away
   * (see `.claude/rules/components.md`). Linting them would produce findings
   * nobody is allowed to act on.
   *
   * `no-img-element` stays ON deliberately: a block using a raw <img> is a real
   * thing to fix during normalization, and the warning is how it gets noticed.
   */
  {
    files: ["src/components/shadcnblocks/**"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]);
