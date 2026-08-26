/**
 * Technical site configuration — the things an operator sets, not the things an
 * editor writes.
 *
 * The split is deliberate (briefs/02-project-structure.md §6):
 *
 *   editors change it   → Keystatic  (src/lib/content/)
 *   operators change it → here
 *
 * Site name, description and SEO defaults are editorial and live in
 * `content/site.json`. Do not mirror them here — one canonical source per fact.
 */

/**
 * The canonical origin, with no trailing slash. Every consumer appends a
 * pathname that begins with one.
 *
 * Set `NEXT_PUBLIC_SITE_URL` for any deployed environment. The localhost
 * fallback is correct for `npm run dev` and wrong everywhere else, which is why
 * it is a visible default rather than a silent one.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Absolute URL for a registered route path. */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${path}`;
}
