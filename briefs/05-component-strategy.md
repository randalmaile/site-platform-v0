# 05 — Component Strategy

## Status

**V0 platform brief**

This document defines how UI components enter the project, where they live, how third-party source is adapted, how reusable components are organized, and how AI should assist with component selection and implementation.

The goal is to preserve design flexibility while preventing the component layer from becoming an unstructured collection of copied code and overly generic abstractions.

---

# 1. Governing principle

> **Reuse primitives and proven source code, but adapt components deliberately to the project instead of forcing the project into a universal component system.**

The component architecture should make it easy to:

- use shadcn/ui primitives
- draw from Shadcnblocks
- preserve third-party source
- create project-specific implementations
- keep dependencies under control
- maintain accessibility and responsive behavior
- keep domain components understandable
- allow design freedom

The architecture must not turn into a universal page-builder or giant component configuration system.

---

# 2. Component categories

The recommended structure is:

```text
src/components/
├── ui/
├── shadcnblocks/
├── normalized/
├── layout/
└── <domain>/
```

Each directory has a distinct responsibility.

---

# 3. `components/ui/`

This directory contains the project's shadcn/ui primitives and other true design-system primitives.

Examples:

```text
button.tsx
dialog.tsx
accordion.tsx
tabs.tsx
input.tsx
select.tsx
```

These components are part of the project's working design-system layer.

Unlike Shadcnblocks source, they may be intentionally customized.

Any customization must:

- preserve accessibility behavior
- use semantic design tokens
- avoid project-specific editorial content
- remain broadly reusable
- avoid unnecessary variants

---

# 4. `components/shadcnblocks/`

This directory contains **pristine imported Shadcnblocks source**.

The source should be preserved as closely as practical to the registry implementation.

It serves as:

- provenance
- reference implementation
- comparison source
- fallback when normalization goes wrong
- documentation of where a production component originated

## Hard rule

> **Do not directly customize Shadcnblocks source for production use.**

Project-specific modifications belong in `components/normalized/` or a project/domain component derived from the imported source.

This separation prevents the original implementation from being lost during iteration.

---

# 5. Shadcnblocks intake workflow

The normal workflow is:

```text
identify design/content problem
        ↓
explore Shadcnblocks
        ↓
select candidate
        ↓
npm run block:add <block>
        ↓
preserve registry source
        ↓
inspect dependencies
        ↓
copy/adapt
        ↓
components/normalized/
        ↓
project implementation
```

The platform should provide tooling such as:

```bash
npm run block:add <block-name>
```

The intake tooling may:

- invoke the registry CLI
- preserve files in the expected directory
- detect unexpected changes to `globals.css`
- surface added dependencies
- normalize import paths when required
- report which files were installed

The tooling should not silently convert registry source into a finished production component.

---

# 6. `components/normalized/`

This directory is for **third-party or registry-derived components that have been adapted to the project**.

Normalization may include:

- replacing hard-coded colors with semantic tokens
- adapting typography
- converting embedded copy into props
- removing demo data
- removing unnecessary dependencies
- improving responsive behavior
- improving semantics
- fixing keyboard behavior
- adding visible focus states
- handling reduced motion
- aligning image behavior with project conventions
- introducing project-specific types
- simplifying implementation
- renaming generic/demo concepts

A component in `normalized/` is no longer pristine source.

It is a production-oriented implementation.

---

# 7. What does NOT belong in `normalized/`

Do not use `normalized/` as the default home for every project component.

Custom components created specifically for the site should normally live under:

```text
components/layout/
```

or:

```text
components/<domain>/
```

depending on their responsibility.

This preserves the meaning of `normalized/`:

> **adapted external source**

rather than:

> **miscellaneous reusable components**

---

# 8. Layout components

True site-wide structural components may live in:

```text
components/layout/
```

Examples:

```text
section.tsx
site-header.tsx
site-footer.tsx
container.tsx
```

These components should remain structurally reusable and visually governed by the design system.

They should not contain project-specific editorial copy that belongs in content.

---

# 9. Domain-oriented organization

Reusable project components should live near their domain.

Preferred:

```text
components/
├── events/
│   ├── event-card.tsx
│   └── event-list.tsx
│
├── people/
│   ├── person-card.tsx
│   └── team-grid.tsx
│
└── projects/
    ├── project-card.tsx
    └── project-gallery.tsx
```

Avoid generic folders such as:

```text
components/
├── cards/
├── grids/
├── lists/
└── sections/
```

when the component is really tied to a domain concept.

Prefer:

```text
EventCard
ProjectCard
PersonCard
```

over:

```text
CardVariantOne
CardVariantTwo
MediaCardThree
```

Domain-oriented naming communicates intent and expected data.

---

# 10. Component extraction

Do not extract a component merely because a page contains a large amount of JSX.

Extract a component when doing so provides a meaningful boundary.

Useful reasons include:

- reused in more than one place
- represents a meaningful UI/domain concept
- accepts meaningful props
- hides interaction/state complexity
- can be reasoned about independently
- materially improves page readability
- needs its own responsive/accessibility behavior

Simple one-off composition may remain directly in a page.

The rule is:

> **Componentization should improve clarity, not maximize file count.**

---

# 11. Content and props

Production components should generally receive editorial/site content through props.

Preferred:

```tsx
<JoinCta
  title={content.title}
  description={content.description}
  href={routes.join.path}
/>
```

Avoid embedding project-specific editable copy directly inside reusable components.

Structural UI language may remain inside components where appropriate.

Examples:

```text
Menu
Close
Next
Previous
Open
```

Do not move trivial interface labels into the CMS merely to eliminate every string literal.

---

# 12. Avoid universal configurable components

Do not attempt to collapse substantially different visual concepts into one giant component with many flags.

Avoid:

```tsx
<Hero
  variant="split"
  imagePosition="left"
  alignment="center"
  background="dark"
  compact
  overlay
  contentWidth="wide"
/>
```

when the different experiences are meaningfully distinct.

Prefer focused components such as:

```text
HeroSplit
HeroEditorial
HeroImageOverlay
HeroCentered
```

These may share lower-level primitives internally where genuine behavior or structure overlaps.

The platform should reuse:

- primitives
- interaction patterns
- layout helpers
- design tokens
- accessibility behavior

without requiring all finished designs to share one component.

---

# 13. Variants

Variants are appropriate when:

- the component remains conceptually the same
- differences are limited and predictable
- reuse materially reduces duplication
- the API remains easy to understand

Examples:

```text
Button size
Button emphasis
Badge style
Card density
```

Variants are not a substitute for creating a distinct component when the visual/structural concept is substantially different.

---

# 14. Dependency discipline

Third-party blocks may introduce dependencies.

Examples:

```text
motion/framer-motion
carousel libraries
form libraries
additional icon packages
utility packages
```

Imported dependencies are not automatically accepted as permanent project dependencies.

The normalization workflow must include:

```text
install/import block
      ↓
inspect dependencies
      ↓
identify what is genuinely needed
      ↓
remove/replace unnecessary dependencies
      ↓
retain justified dependencies
```

A dependency should remain only when its value exceeds the complexity it adds.

This is especially important in the base starter and Basic profiles.

---

# 15. Accessibility and production readiness

Third-party source is not assumed to be production-ready simply because it came from a reputable registry.

Normalization must review:

- semantic HTML
- correct interactive elements
- keyboard navigation
- visible focus states
- accessible names
- heading hierarchy
- meaningful image alt text
- responsive behavior
- mobile layout
- touch targets
- reduced-motion behavior when animation is present

Example:

A visually useful gallery block may still require changes if:

- clickable items are non-semantic `div` elements
- focus states are missing
- mobile layout breaks
- images lack appropriate alt text
- animation ignores `prefers-reduced-motion`

These fixes belong in the normalized/project implementation while pristine source remains untouched.

---

# 16. Responsive responsibility

Every production component must work at the project's supported responsive widths.

A selected desktop block is not complete until its mobile behavior has been intentionally reviewed.

Do not assume the registry implementation matches the project's:

- breakpoints
- container widths
- typography scale
- content density
- imagery
- navigation behavior

Normalization includes responsive adaptation.

---

# 17. Design-system responsibility

Normalized and custom project components must use the project's semantic design system.

Avoid copying registry-specific hard-coded styling into production without review.

Where appropriate, normalize:

```text
colors
typography
radius
borders
spacing
surface treatment
focus treatment
```

to project tokens and conventions.

The goal is not to make every component visually identical.

The goal is to ensure components participate coherently in the site's visual system.

---

# 18. Custom components are first-class

Shadcnblocks is a source of useful patterns, not a requirement that every visual problem be solved from the registry.

When a design requires something not represented well by available blocks:

```text
design need
    ↓
custom component
```

is a valid and often preferable outcome.

Do not distort the design simply to reuse a block.

---

# 19. Student design ownership

For the student-organization project, component selection is part of the student's design work.

Claude Code must not silently choose Shadcnblocks or final component directions on the student's behalf.

The student should ideally:

1. identify the content/UX problem
2. explore possible visual approaches
3. review inspiration
4. shortlist patterns/components
5. explain why the selected direction fits
6. ask Claude Code to implement or normalize it

This reinforces product and design reasoning rather than turning the site into an AI-selected template.

---

# 20. AI-assisted inspiration is allowed

Student ownership does **not** mean the student must work without AI design assistance.

Claude Cowork, Claude Design, or similar tools may help with:

- visual exploration
- alternative compositions
- layout ideas
- critique
- interaction ideas
- responsive ideas
- identifying useful UI patterns
- suggesting whether a Shadcnblock or custom component might fit

A productive workflow may be:

```text
student defines problem
        ↓
student + AI explore directions
        ↓
visual direction emerges
        ↓
identify necessary UI patterns
        ↓
Shadcnblocks or custom component
        ↓
student chooses direction
        ↓
Claude Code implements
        ↓
normalize + review + verify
```

The governing educational principle is:

> **AI may inspire and assist. The student remains responsible for the final design decision.**

---

# 21. Claude Code responsibilities

Claude Code may:

- import selected blocks
- inspect block dependencies
- preserve pristine source
- create normalized implementations
- convert embedded demo content to props
- integrate project content
- improve accessibility
- improve responsive behavior
- replace hard-coded visual values with tokens
- remove unnecessary dependencies
- create custom components from an approved design direction
- explain implementation tradeoffs

Claude Code should not:

- independently choose the site's visual direction
- independently select the final Shadcnblock
- create giant configurable components without justification
- silently add large dependencies
- modify pristine registry source as the production implementation
- hard-code project content inside reusable components

---

# 22. Base starter requirements

The V0 base starter should include:

```text
components/
├── ui/
├── shadcnblocks/
├── normalized/
└── layout/
```

The base may include only minimal layout primitives required to prove the architecture.

It must not include a catalog of speculative finished sections such as:

```text
Hero
Team
Stats
Gallery
Testimonials
Pricing
FAQ
```

Those components should enter a generated project when real design/content requirements justify them.

---

# 23. Shadcn/ui installation policy

Do not preinstall the entire shadcn/ui catalog.

Install only:

- primitives required by the base itself
- primitives required by enabled capabilities
- primitives required by selected project components

This keeps dependencies and source surface area small.

---

# 24. Naming

Names should communicate purpose.

Preferred:

```text
EventCard
TeamGrid
ProjectGallery
HeroEditorial
SiteHeader
```

Avoid meaningless implementation/history names:

```text
Component1
Block17
NewHero
HeroFinal
CardV3
```

Do not preserve registry block numbers as the production component's conceptual identity unless they remain useful provenance inside the pristine source directory.

---

# 25. Composition over hierarchy

Prefer direct React composition to complex inheritance-like component APIs.

Pages may compose:

```tsx
<HeroEditorial />
<ProjectGrid />
<UpcomingEvents />
<JoinCta />
```

Each component remains focused.

Avoid creating a generalized site-section runtime solely to orchestrate normal React composition.

---

# 26. Definition of done

A production component is ready when:

- its role is clear
- its directory matches its responsibility
- third-party provenance is preserved when applicable
- embedded demo content has been removed
- project content arrives through appropriate props/data
- dependencies have been reviewed
- semantic design tokens are used appropriately
- keyboard and focus behavior are correct
- mobile behavior has been reviewed
- accessibility issues have been addressed
- the component API is understandable
- the component is not more generic than the actual design requires
- `npm run verify` passes

---

# 27. Explicitly forbidden patterns

Do not:

- directly customize pristine Shadcnblocks source for production
- use `normalized/` as a miscellaneous component directory
- create components solely because JSX is long
- build universal mega-components with dozens of presentation flags
- organize domain components only by visual primitive type
- retain every dependency imported by a third-party block without review
- assume registry source is automatically accessible or responsive
- force every design to use an existing block
- let CMS content define component/layout architecture
- let AI silently choose final design solutions for the student

---

# 28. Governing rule

> **Preserve source, normalize deliberately, organize by meaning, keep APIs focused, and let design requirements drive component selection—not the other way around.**
