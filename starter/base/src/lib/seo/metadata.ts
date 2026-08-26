import type { Metadata } from "next";

import { absoluteUrl } from "@/config/site";
import type { Site } from "@/types/content";

/**
 * Build a page's metadata from content that already exists.
 *
 * The policy is automatic defaults with deliberate overrides
 * (briefs/07-seo.md §5): a page passes only what makes it different, and the
 * site singleton supplies the rest. Nobody re-types the site description once
 * per route.
 *
 * This helper carries no marketing strategy, keywords or structured data. It
 * takes site configuration as an argument rather than reaching for a canonical
 * copy of its own — SEO infrastructure must not become a second place the
 * site's identity is written down (briefs/02-project-structure.md §9).
 */
type BuildMetadataOptions = {
  site: Site;
  /** Page title. Omit to use the site's default. */
  title?: string;
  /** Page description. Omit to use the site's default. */
  description?: string;
  /** Registered route path, e.g. "/". Sets the canonical URL. */
  path: string;
};

export function buildMetadata({
  site,
  title,
  description,
  path,
}: BuildMetadataOptions): Metadata {
  const resolvedTitle = title ?? site.defaultSeoTitle;
  const resolvedDescription = description ?? site.defaultSeoDescription;
  const url = absoluteUrl(path);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: resolvedTitle,
      description: resolvedDescription,
    },
  };
}
