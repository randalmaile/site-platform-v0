import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Horizontal container and vertical rhythm for a band of page content.
 *
 * WHAT IT OWNS: max width, gutters, and the standard vertical padding — all
 * read from the structure tokens in `globals.css`, so spacing is one decision
 * for the whole site rather than a number each section picks for itself
 * (briefs/04-design-system.md §9).
 *
 * WHAT IT DOES NOT OWN: backgrounds, imagery, gradients, decoration. Those are
 * project design decisions and belong to the component being laid out, not to
 * the primitive laying it out.
 *
 * `as` selects the semantic element. Default `section`; use `div` when the
 * content is not a distinct region, so the landmark structure stays honest.
 */
type SectionProps = {
  as?: ElementType;
  /** Drop the standard vertical padding — for a section flush against another. */
  flush?: boolean;
  className?: string;
  children: ReactNode;
};

export function Section({
  as: Component = "section",
  flush = false,
  className,
  children,
}: SectionProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-(--container-max) px-4 sm:px-6 lg:px-8",
        !flush && "py-(--section-padding)",
        className,
      )}
    >
      {children}
    </Component>
  );
}
