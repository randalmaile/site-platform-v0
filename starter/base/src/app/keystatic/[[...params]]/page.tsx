"use client";

import { makePage } from "@keystatic/next/ui/app";

import keystaticConfig from "../../../../keystatic.config";

/**
 * The Keystatic admin UI at `/keystatic`.
 *
 * Deliberately outside the `(site)` route group: the CMS is not part of the
 * public information architecture, so it inherits no site header, footer or
 * navigation, appears in no sitemap, and is registered in no route list
 * (briefs/02-project-structure.md §3).
 *
 * Client component because the editor runs in the browser.
 */
export default makePage(keystaticConfig);
