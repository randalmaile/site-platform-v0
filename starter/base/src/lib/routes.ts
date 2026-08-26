/**
 * The site's public URL set — written once, here.
 *
 * WHAT READS IT
 *   src/app/sitemap.ts        turns these into the sitemap
 *   scripts/check-routes.mjs  fails `verify:fast` when this list and the
 *                             filesystem disagree
 *
 * WHY IT IS EXPLICIT rather than crawled at build time: a page can exist on
 * disk and still be a mistake, and a URL can be registered before its page is
 * written. Listing them by hand makes the disagreement itself the finding —
 * that is the whole job of the route guard.
 *
 * WHAT IS DELIBERATELY ABSENT: `/keystatic` and `/api/*`. They are real routes
 * but they are not part of the public site, so they never reach the sitemap
 * (briefs/02-project-structure.md §3).
 *
 * NAVIGATION IS NOT DEFINED HERE. See `src/lib/navigation.ts`. A route may be
 * public and deliberately unlinked; conflating the two lists is what makes
 * "add a page" quietly mean "add a nav item".
 *
 * The canonical origin is not here either — that is operator configuration and
 * lives in `src/config/site.ts`. These are paths.
 *
 * ADDING A PAGE: docs/workflows/add-page.md
 */
export const PUBLIC_ROUTES = ["/"] as const;

export type PublicRoute = (typeof PUBLIC_ROUTES)[number];
