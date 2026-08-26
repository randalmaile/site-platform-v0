import { makeRouteHandler } from "@keystatic/next/route-handler";

import keystaticConfig from "../../../../../keystatic.config";

/**
 * Keystatic's server endpoints — content reads/writes and, in GitHub mode, the
 * OAuth exchange.
 *
 * Outside the `(site)` route group on purpose: this is framework surface, not a
 * page. It is absent from `src/lib/routes.ts` and disallowed in `robots.ts`.
 */
export const { POST, GET } = makeRouteHandler({
  config: keystaticConfig,
});
