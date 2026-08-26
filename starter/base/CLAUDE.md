# CLAUDE.md

You are implementing a **website** built on the site platform.

## Before non-trivial work

Read `.claude/rules/` for the area you are touching, and the matching document
in `docs/`. Repository conventions beat generic framework conventions — where
they differ, this project is right.

## The invariants

Nine rules. Breaking one is an architectural change, not an implementation
detail: say so and get agreement before you do it.

1. **Stay in scope.** Implement what was asked. Report adjacent problems; do not
   silently fix them, and do not add capabilities nobody requested.
2. **Every public page is registered.** Create the route, add its URL to
   `src/lib/routes.ts`, decide explicitly whether it belongs in
   `src/lib/navigation.ts`. `npm run check:routes` fails otherwise.
   → `docs/workflows/add-page.md`
3. **Keystatic stops at `src/lib/content/`.** A presentation component that
   imports a CMS API is a defect. Routes and server components read content;
   components receive plain typed props.
4. **Style with semantic tokens.** `bg-primary`, not `bg-[#0f5bcc]`. Colours,
   spacing, radius and fonts are defined once in `src/app/globals.css`.
   → `docs/design-system/tokens.md`
5. **Never edit `src/components/shadcnblocks/`.** That is pristine registry
   source. Copy into `src/components/normalized/` before changing anything.
   → `docs/workflows/add-component.md`
6. **No speculative dependencies or abstractions.** If the app works without a
   package, do not install it. No universal block renderer, no page-builder
   schema, no repository layer, no content model for a capability that does not
   exist. Present the tradeoff before adding anything non-obvious.
7. **Build accessibly.** Semantic elements, keyboard operability, visible focus,
   logical headings, real alt text, mobile-usable. No automated a11y tooling is
   installed; that does not license a known defect.
   → `docs/accessibility/conventions.md`
8. **Deployment stays at the edge.** No provider APIs in content, components,
   routing or domain logic.
9. **Verify before you call it done.** `npm run verify:fast` while working,
   `npm run verify` before completion. Fix failures — never silence them with
   `any`, `@ts-ignore`, a disabled rule, or a weakened check.
   → `docs/workflows/verification.md`

## Where things live

```text
src/app/(site)/        public pages
src/app/keystatic/     CMS admin — not public IA, not in the sitemap
src/lib/routes.ts      canonical public URL set
src/lib/navigation.ts  what the chrome links to — a separate decision
src/lib/content/       the only place Keystatic is imported
src/config/site.ts     operator configuration (canonical origin)
src/components/layout/       structural site components
src/components/ui/           shadcn/ui primitives — upstream-managed
src/components/shadcnblocks/ pristine registry source — never edited
src/components/normalized/   project-owned adaptations — edits go here
content/               editorial content, edited at /keystatic
docs/                  the reasoning behind all of the above
```

Nothing lives loose in `src/components/`.

## Editorial content vs configuration

Editors change it → Keystatic. Developers and operators change it → `src/config/`
or the environment. Never both.

## Explaining your work

When the project gains something — a dependency, a component, a content model —
say what entered the repository and what it now requires. The person you are
working with should be able to understand how their project is growing.
