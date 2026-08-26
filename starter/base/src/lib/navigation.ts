import type { PublicRoute } from "@/lib/routes";

/**
 * What the site chrome links to, and in what order.
 *
 * Separate from `src/lib/routes.ts` on purpose (briefs/02-project-structure.md
 * §8). The registry answers "does this URL exist?"; this file answers "should a
 * visitor be offered it, and what do we call it?" Those are different
 * questions, and a page can legitimately be public without appearing here.
 *
 * `href` is typed as `PublicRoute`, so a nav item pointing at an unregistered
 * URL is a type error rather than a broken link found in production.
 *
 * Labels are interface language, not editorial content — they stay in code.
 * Information architecture is a project decision: the base links only the one
 * page it actually has.
 */
export type NavItem = {
  href: PublicRoute;
  label: string;
};

export const primaryNav: readonly NavItem[] = [
  { href: "/", label: "Home" },
] as const;
