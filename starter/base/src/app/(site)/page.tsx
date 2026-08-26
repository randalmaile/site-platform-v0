import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { getSite } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Proof of life, and nothing more.
 *
 * This page exists to demonstrate that the application runs, that content
 * reaches a route through the boundary, and that the tokens resolve. It is
 * deliberately plain: no hero, no cards, no columns, no imagery, no call to
 * action. A starter that arrives looking designed gets kept by default, and the
 * homepage is exactly where the project owner's first real decisions belong
 * (briefs/04-design-system.md §5).
 *
 * Replace it. That is what it is for.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return buildMetadata({ site, path: "/" });
}

export default async function HomePage() {
  const site = await getSite();

  return (
    <Section>
      <h1 className="text-3xl font-semibold tracking-tight">{site.name}</h1>

      <p className="mt-4 max-w-prose">{site.description}</p>

      <p className="text-muted-foreground mt-6 max-w-prose">
        This is the platform base starter. The application is running, but no
        product, content or design decisions have been made yet — there is no
        audience, no sitemap, no brand and no page design here on purpose. Those
        belong to the project this starter becomes.
      </p>

      <h2 className="mt-10 text-lg font-medium">Where to go next</h2>

      <ul className="text-muted-foreground mt-3 max-w-prose space-y-2">
        <li>
          Edit this text at <code>/keystatic</code> — it is read from{" "}
          <code>content/site.json</code> through the content boundary.
        </li>
        <li>
          Read <code>docs/README.md</code> for the architecture, the workflows
          and the design-token philosophy.
        </li>
        <li>
          Add a page with <code>docs/workflows/add-page.md</code>, then run{" "}
          <code>npm run verify</code>.
        </li>
      </ul>
    </Section>
  );
}
