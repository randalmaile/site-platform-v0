# Design tokens

`src/app/globals.css` is the theme source of truth. Change the values there and
the whole site follows.

## The philosophy

The platform reuses **token architecture, primitives, constraints and
accessible behaviour**. It does not reuse a brand. Two sites built on this base
should be able to look nothing alike.

That is why the base ships greys, system fonts and a conservative radius. It is
not an unfinished palette waiting to be tidied — it is a deliberate absence, so
that the first real visual decision is made on purpose rather than inherited by
accident.

## The tokens

Defined on `:root` (and overridden in `.dark`), then mapped to Tailwind
utilities in the `@theme inline` block above them. The mapping is what makes
`bg-background` and `text-muted-foreground` exist.

### Surfaces

| Token | Role |
| --- | --- |
| `--background` / `--foreground` | Page ground and default text |
| `--card` / `--card-foreground` | Raised surface and its text |
| `--muted` / `--muted-foreground` | Recessed surface and secondary text |
| `--border` | Dividers and outlines |
| `--input` | Form control borders |
| `--ring` | Focus ring |

### Interaction and emphasis

| Token | Role |
| --- | --- |
| `--primary` / `--primary-foreground` | Main emphasis — primary buttons, key actions |
| `--secondary` / `--secondary-foreground` | Lower-emphasis actions |
| `--accent` / `--accent-foreground` | Hover and highlight states |

`--primary` is a dark neutral in the base. It is a working emphasis role, not a
brand colour — picking one here is exactly what would make every generated site
look related.

### Structure

| Token | Role |
| --- | --- |
| `--radius` | Corner radius; `--radius-sm/md/lg` derive from it |
| `--container-max` | Content max width, read by `Section` |
| `--section-gap` | Space between stacked sections |
| `--section-padding` | Standard vertical padding inside a section |

One spacing system for the whole site. A section that invents its own padding
values is how vertical rhythm dies.

### Typography

| Token | Role |
| --- | --- |
| `--font-body` | Body text |
| `--font-display` | Headings and display type |

Both resolve to a system stack in the base, and both are mapped onto Tailwind's
`font-sans` / `font-serif`, so utilities and any shadcn/ui primitive installed
later resolve to the project's fonts rather than to a competing definition.

## Rebranding this site

1. **Colour.** Replace the oklch values on `:root` and `.dark`. Check every
   functional pairing for contrast — 4.5:1 for normal text, 3:1 for large text
   and meaningful UI boundaries. A colour that works as a fill is not
   automatically readable as text; if one value needs both jobs, that is two
   tokens, not one compromise.
2. **Typography.** Load typefaces with `next/font` in `src/app/layout.tsx`,
   expose them as CSS variables, and point `--font-body` / `--font-display` at
   them. Keep the family count small. No component ever declares a font-family.
3. **Structure.** Adjust `--radius`, `--container-max` and the spacing tokens to
   taste. These are three edits, not a sweep through every component.
4. **Components.** Anything still hard-coding a colour or a spacing constant is
   a bug — that is the value the rebrand just failed to reach.

If a rebrand requires editing many components, the tokens were not doing their
job.

## Rules

**Use semantic tokens for anything that is part of the visual system.**

```tsx
className="bg-primary text-primary-foreground"   // yes
className="bg-[#0f5bcc] text-white"              // no
```

A genuinely local one-off literal is acceptable. Arbitrary values as the default
styling approach are not.

**Add a token when a semantic role recurs** — not one per component, and not a
shade ramp in advance. Ask first whether the need is project-specific or
architectural.

**Responsive is part of the component, not a later cleanup.** Mobile-first, no
fixed desktop widths, no horizontal overflow, touch-sized targets, navigation
usable without hover.

**No motion library is installed.** CSS transitions cover hover and focus. If
motion is ever added, `prefers-reduced-motion` handling ships in the same change.

**Images:** `next/image` for site-owned raster imagery, accurate alt text for
meaningful images, empty alt for decorative ones, deliberate responsive sizing
rather than many arbitrary crops.
