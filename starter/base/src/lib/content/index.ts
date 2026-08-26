/**
 * The content boundary's public surface.
 *
 * Routes and server components import from `@/lib/content`. They do not import
 * `./reader` — that is the CMS-facing half and stays private to this directory.
 *
 * As capabilities arrive, this grows one focused module at a time
 * (`events.ts`, `people.ts`, …) and re-exports them here. It does not grow a
 * generic repository layer (briefs/06-keystatic.md §12).
 */
export { getSite } from "./site";
export type { Site } from "@/types/content";
