import type { MetadataRoute } from "next";

import { absoluteUrl, siteUrl } from "@/config/site";

/**
 * `/robots.txt`, generated at build.
 *
 * A safe, boring default: allow the site, disallow the API prefix, point at the
 * sitemap.
 *
 * `/keystatic` is deliberately NOT disallowed. Blocking a path in robots.txt
 * stops a crawler reading the page — including any `noindex` on it — which can
 * leave a bare URL indexed from an inbound link. It would also publish the CMS
 * admin path in a file anyone can fetch. Keeping search engines out of an admin
 * surface is a `noindex` job, not a robots.txt one.
 *
 * Environment-specific rules — blocking a staging host, say — are a deployment
 * concern and belong to the project that has one.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
