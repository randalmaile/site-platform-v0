import "server-only";

import { createReader } from "@keystatic/core/reader";

import keystaticConfig from "../../../keystatic.config";

/**
 * The one place Keystatic is imported.
 *
 * Everything above this file works with plain typed values; everything below it
 * is CMS mechanics. Swapping Keystatic for something else should be a change to
 * this file and its siblings, not a change to components
 * (briefs/06-keystatic.md §11).
 *
 * `server-only` makes the boundary enforceable rather than merely documented:
 * importing this from a client component is a build error, not a code-review
 * catch.
 *
 * The reader is filesystem-backed and reads from `process.cwd()`, so content is
 * resolved at build time for static pages.
 */
export const reader = createReader(process.cwd(), keystaticConfig);
