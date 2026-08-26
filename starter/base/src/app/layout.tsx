import type { Metadata } from "next";
import type { ReactNode } from "react";

import { siteUrl } from "@/config/site";

import "./globals.css";

/**
 * The root document. `<html>`, `<body>`, the stylesheet — nothing else.
 *
 * Site chrome lives in `(site)/layout.tsx` instead, so `/keystatic` renders
 * without a header and footer wrapped around the CMS.
 *
 * NO FONTS ARE LOADED HERE. `--font-body` and `--font-display` resolve to
 * system stacks until a project chooses typefaces; when it does, load them with
 * `next/font` in this file and point those two variables at them
 * (briefs/04-design-system.md §8).
 */
export const metadata: Metadata = {
  // Resolves every relative metadata URL — canonical links, OG URLs — against
  // the canonical origin rather than against localhost.
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
