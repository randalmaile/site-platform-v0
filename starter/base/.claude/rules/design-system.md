# Design-system rules

Token reference and rebranding procedure: `docs/design-system/tokens.md`.

## Source of truth

`src/app/globals.css`. One place. No parallel theme config duplicating the same
values.

## Use tokens, not literals

```tsx
className="bg-primary text-primary-foreground"   // yes
className="bg-[#0f5bcc] text-white"              // no
```

Never hard-code, and never repeat, a brand colour, spacing constant, radius,
container width or `font-family` in a component. A genuinely local one-off
literal is fine; arbitrary values as the default styling approach are not.

## Adding a token

Add one when a semantic role genuinely recurs across the site. Decide first
whether the need is project-specific or architectural. Do not add a token per
component, and do not add a shade ramp in advance.

## Contrast

When the project picks its real palette, check every functional pairing: 4.5:1
for normal text, 3:1 for large text and meaningful UI boundaries. A colour that
works as a fill is not automatically readable as text — if one value needs both
jobs, that is two tokens.

## Typography

`--font-body` and `--font-display` are the roles. Load fonts centrally in
`src/app/layout.tsx` with `next/font` and point the variables at them.
Components never declare a font-family.

## Layout

- `Section` owns container width, gutters and vertical rhythm. It does not own
  backgrounds, imagery or decoration.
- One spacing system for the whole site. Sections do not invent their own
  padding values.
- Mobile-first. No fixed desktop widths, no horizontal overflow, touch targets
  sized for fingers, navigation usable without hover.

## Motion

No animation library is installed. CSS transitions for hover and focus. If
motion is ever added, it needs a `prefers-reduced-motion` strategy in the same
change, and it must not gate content or CTAs behind an entrance sequence.

## Not yours to choose

Palette, typefaces, logo, imagery style, page mood, block selection, hero and
CTA treatment belong to the project owner. Explain tradeoffs, flag accessibility
problems, compare options, implement an approved direction — but do not quietly
turn the neutral base into a preferred aesthetic.
