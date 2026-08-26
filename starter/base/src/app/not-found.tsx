import Link from "next/link";

import { Section } from "@/components/layout/section";

/**
 * The 404 page.
 *
 * At the app root rather than inside `(site)`, so it also catches unmatched
 * paths outside the public route group. It therefore renders without the site
 * header and footer — that is the tradeoff Next.js imposes on a root
 * `not-found`, and a plain, working 404 beats a styled one that misses half the
 * URLs.
 */
export default function NotFound() {
  return (
    <Section>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>

      <p className="text-muted-foreground mt-4 max-w-prose">
        That page does not exist, or it has moved.
      </p>

      <p className="mt-6">
        <Link href="/" className="underline underline-offset-4">
          Go to the homepage
        </Link>
      </p>
    </Section>
  );
}
