import type { Site } from "@/types/content";

import { reader } from "./reader";

/**
 * The site singleton, as a plain object.
 *
 * The cast to `Site` is the boundary doing its job: Keystatic's reader returns
 * its own field types, and this is where they stop. Callers get `Site` and
 * never learn where it came from.
 *
 * Throwing on a missing record is deliberate. `content/site.json` is required
 * for the site to mean anything, so a silent default here would turn a content
 * mistake into a page that renders empty headings — the build should fail
 * instead.
 */
export async function getSite(): Promise<Site> {
  const site = await reader.singletons.site.read();

  if (!site) {
    throw new Error(
      "content/site.json is missing or unreadable. Edit it at /keystatic, or restore it from Git.",
    );
  }

  return {
    name: site.name,
    shortName: site.shortName,
    description: site.description,
    defaultSeoTitle: site.defaultSeoTitle,
    defaultSeoDescription: site.defaultSeoDescription,
  };
}
