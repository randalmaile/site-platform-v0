import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/site";
import { PUBLIC_ROUTES } from "@/lib/routes";

/**
 * `/sitemap.xml`, generated at build from the route registry.
 *
 * Register a page in `src/lib/routes.ts` and it appears here; nothing in this
 * file changes. `scripts/check-routes.mjs` is what stops the registry and the
 * filesystem drifting apart, which is what would otherwise make this file lie.
 *
 * NO `lastModified`: the only value available at build time is `new Date()`,
 * which stamps every URL as changed on every deploy. A field that is wrong for
 * every page except the one actually edited teaches crawlers to ignore it.
 * Omitting it is more truthful than fabricating it.
 *
 * NO `changeFrequency` either — Google ignores it outright.
 *
 * `/keystatic` and `/api/*` are absent because they are not in the registry.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
  }));
}
