import { Section } from "@/components/layout/section";

/**
 * The site's footer.
 *
 * Name in, one line out. No contact block, no social links, no legal links, no
 * secondary navigation — every one of those is a content and IA decision the
 * project owner has not made yet.
 *
 * The year is computed at render. For a static page that means build time,
 * which is accurate enough for a copyright line and avoids shipping a client
 * component to print a number.
 */
type SiteFooterProps = {
  siteName: string;
};

export function SiteFooter({ siteName }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t">
      <Section as="div" flush className="py-6">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} {siteName}
        </p>
      </Section>
    </footer>
  );
}
