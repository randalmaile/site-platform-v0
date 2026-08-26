import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSite } from "@/lib/content";

/**
 * Chrome for the public site: header, main landmark, footer.
 *
 * This is where content enters the tree. The layout is a server component, it
 * reads through the content boundary, and it hands plain strings to the
 * presentation components below it — which is the flow every route should
 * follow (briefs/01-platform-foundation.md §4).
 *
 * The skip link is first in the tab order so a keyboard user can get past the
 * navigation on every page. It is visually hidden until focused
 * (briefs/08-accessibility.md §3).
 */
export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const site = await getSite();

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="bg-background sr-only rounded-md border px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
      >
        Skip to content
      </a>

      <SiteHeader siteName={site.shortName} />

      <main id="main" className="flex-1">
        {children}
      </main>

      <SiteFooter siteName={site.name} />
    </div>
  );
}
