# 04 — Design System

**Status:** V0 architectural contract  
**Scope:** `starter/base` and all generated projects  
**Purpose:** Reuse visual-system structure without imposing a recognizable template aesthetic.

## 1. Principle

The platform reuses **behavior, primitives, constraints, and token architecture**.

It does not reuse a finished brand.

A generated site should be able to look radically different from another site built on the same platform.

The base starter is intentionally neutral so that project-specific visual decisions are explicit rather than inherited by accident.

## 2. Ownership model

### Platform owns

- semantic token architecture
- spacing/container primitives
- responsive conventions
- focus behavior
- accessible interaction patterns
- button/form primitives
- basic radius and surface roles
- component ownership rules
- reduced-motion conventions

### Project owns

- brand colors
- typefaces
- typography personality
- logo/wordmark
- photography/illustration direction
- border/shadow treatment
- hero treatment
- decorative graphics
- motion personality
- final page composition

## 3. Source of truth

`src/app/globals.css` is the theme source of truth.

Tailwind utilities should resolve from semantic CSS variables wherever a value is part of the site's visual system.

Do not introduce a parallel theme configuration that duplicates the same values.

Human-readable design rationale belongs in:

```text
docs/design-system/tokens.md
```

## 4. V0 semantic tokens

Start small. Add tokens only when a recurring semantic need appears.

Required roles should cover roughly:

```text
SURFACES
--background
--foreground
--card
--card-foreground
--muted
--muted-foreground
--border

INTERACTION / EMPHASIS
--primary
--primary-foreground
--secondary
--secondary-foreground
--accent
--accent-foreground

STRUCTURE
--radius
--container-max
--section-gap
--section-padding

TYPOGRAPHY
--font-body
--font-display
```

Keep compatibility with the shadcn token model where practical instead of inventing unnecessary parallel names.

## 5. Neutral base theme

The starter must not ship with a strong visual identity.

Use a restrained neutral palette, system/default fonts, conservative radius, and minimal decoration.

The base homepage must not establish a design direction the student/client feels compelled to preserve.

Avoid:

- brand-like gradients
- distinctive illustration systems
- dramatic display fonts
- decorative textures
- elaborate animation
- opinionated hero compositions
- strong accent combinations

## 6. Semantic values, not repeated literals

Brand/system values belong in tokens.

Project-owned components should not repeatedly hard-code:

- brand hex values
- repeated spacing constants
- repeated border radii
- repeated container widths
- font-family declarations

A one-off literal is acceptable when it is truly local and not part of the design language, but arbitrary values should not become the default styling approach.

### Preferred

```tsx
className="bg-primary text-primary-foreground"
```

### Avoid for system styling

```tsx
className="bg-[#0f5bcc] text-white"
```

## 7. Color accessibility

When a project chooses its real palette, every functional pairing must be checked for sufficient contrast.

At minimum:

- normal text: WCAG AA 4.5:1
- large text: WCAG AA 3:1
- meaningful UI boundaries/icons: 3:1 where applicable

Do not assume a brand color is automatically suitable for text merely because it works as a fill.

If one color needs separate semantic roles for fill and readable foreground/text, introduce separate tokens rather than forcing one value to do both jobs.

## 8. Typography

The base defines roles, not a brand-specific pairing.

At minimum:

- `--font-body`
- `--font-display`

Both may initially resolve to neutral/system fonts.

When project typography is selected:

- load fonts centrally;
- expose them through CSS variables;
- keep font-family decisions out of individual components;
- define a coherent heading/body hierarchy;
- prefer a small number of font families and weights;
- verify performance and readability.

Typography is a project design decision, not something the starter should silently choose.

## 9. Layout primitives

The base may provide structural primitives such as `Section`.

A layout primitive may own:

- max-width/container behavior
- standard horizontal gutters
- common section spacing hooks
- semantic HTML element selection

It should not own project-specific backgrounds, images, gradients, or decorative compositions.

### Vertical rhythm

Prefer one coherent system for spacing between page sections.

Avoid each page section inventing unrelated top/bottom padding values.

The exact implementation may use a main-container gap and opt-in interior section padding for sections with distinct backgrounds.

## 10. Responsive behavior

Responsive behavior is part of component quality, not a separate later cleanup phase.

Requirements:

- mobile-first layout decisions
- no fixed desktop-only widths
- no horizontal overflow at common viewport sizes
- touch targets appropriate for mobile
- text wraps naturally
- imagery has deliberate responsive behavior
- navigation remains usable without pointer hover

Do not encode a single desktop screenshot and call it the design system.

## 11. shadcn/ui

shadcn/ui provides low-level primitives.

Treat its components as implementation building blocks, not the visual identity of the site.

Project-specific presentation should be created by composing primitives and normalized sections rather than by forking the whole UI library.

## 12. Shadcnblocks

Shadcnblocks is a **pattern source**, not the site's design authority.

A block should be selected because it solves a content/UX problem.

Bad selection criterion:

> This block looks cool.

Better selection criterion:

> This layout gives the primary message and CTA enough hierarchy while supporting the photography strategy.

Imported block workflow is defined in `02-project-structure.md` and project component rules.

The base should not ship with preselected Hero, Stats, Team, Gallery, or CTA blocks.

## 13. Normalization rules

When a registry block becomes project-owned:

- preserve the useful structural/layout behavior first;
- remove placeholder/demo content;
- rename it by semantic role;
- expose typed content props;
- replace registry-specific styling assumptions with project semantic tokens where appropriate;
- keep CMS concerns out of the component;
- do not gratuitously rewrite a functioning block just to make it look hand-authored.

Normalization is not an excuse to erase the reason the selected block was useful.

## 14. Motion

No animation library is installed in V0.

Use CSS for simple hover/focus transitions.

If a future project adds motion:

- add the smallest appropriate dependency;
- motion must support content hierarchy rather than distract from it;
- all non-essential motion must degrade under `prefers-reduced-motion`;
- do not gate important content or CTAs behind long entrance sequences.

## 15. Images

The design system defines image handling conventions, while the project defines image style.

Baseline rules:

- use `next/image` for site-owned raster imagery where appropriate;
- provide accurate alt text for meaningful images;
- use empty alt text for truly decorative images;
- size/crop intentionally through layout rather than destructively generating many arbitrary crops;
- avoid oversized source assets in production;
- do not use generated placeholder imagery as if it were final client content unless explicitly chosen.

More detailed image-performance rules can be added when the first real project establishes the need.

## 16. Educational/project decision boundary

For the student-organization reference project, the platform must not choose:

- palette
- fonts
- logo direction
- imagery style
- page mood/personality
- Shadcnblocks sections
- hero treatment
- CTA visual treatment

The student owns those decisions.

AI may:

- explain tradeoffs;
- identify accessibility issues;
- compare proposed options;
- implement an approved direction;
- help translate design choices into tokens/components.

AI should not quietly turn the neutral base into its preferred aesthetic.

## 17. Definition of done for the base design system

The V0 base is correct when:

- all fundamental theme roles exist as semantic tokens;
- the site can be completely rebranded primarily by changing centralized tokens/assets and normalized components;
- the starter has no strong brand identity;
- layout primitives work responsively;
- focus/interaction states are visible;
- a future project can select Shadcnblocks without modifying pristine registry copies;
- no project-specific design decisions have been made prematurely.
