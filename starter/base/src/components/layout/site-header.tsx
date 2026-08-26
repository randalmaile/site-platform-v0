import Link from "next/link";

import { Section } from "@/components/layout/section";
import { primaryNav } from "@/lib/navigation";

/**
 * The site's masthead.
 *
 * Takes its name as a prop — the route reads content and passes it down, so
 * this component stays storage-agnostic (briefs/03-content-architecture.md
 * §2.3). No logo, no wordmark, no CTA: all three are project design decisions.
 *
 * Nav is a plain list with one item today. When the site grows past what fits
 * on a phone, that is the moment to add a disclosure — built as its own
 * component, keyboard-operable, not a hover menu
 * (briefs/04-design-system.md §10).
 */
type SiteHeaderProps = {
  siteName: string;
};

export function SiteHeader({ siteName }: SiteHeaderProps) {
  return (
    <header className="border-b">
      <Section as="div" flush className="flex items-center gap-6 py-4">
        <Link href="/" className="font-medium">
          {siteName}
        </Link>

        <nav aria-label="Primary" className="ml-auto">
          <ul className="flex items-center gap-4">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>
    </header>
  );
}
