import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, letting later Tailwind utilities win over earlier ones.
 *
 * `clsx` handles conditionals; `twMerge` resolves conflicts, so a `className`
 * prop can override a component's own defaults instead of losing to whichever
 * class the stylesheet happens to emit last.
 *
 * shadcn/ui primitives import this by convention — `components.json` points its
 * `utils` alias here — so it must exist before `npm run block:add` is useful.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
