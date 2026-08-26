# 01 — Platform Foundation

**Status:** V0 architectural contract  
**Scope:** `starter/base`  
**Purpose:** Define the technical foundation every generated site inherits.

## 1. Principle

The platform foundation must be intentionally boring, stable, and small.

It exists to solve recurring engineering concerns once:

- application framework
- type safety
- routing integrity
- content boundary
- design-token infrastructure
- SEO baseline
- accessibility conventions
- dependency discipline
- verification
- CI
- AI-development governance

It must **not** decide the product, audience, information architecture, content strategy, visual identity, or page composition of a generated site.

A simple site must remain genuinely simple. Optional capabilities are added only when a project needs them.

## 2. Required technology

The V0 base uses:

- Next.js 16 App Router
- React 19
- TypeScript in strict mode
- Tailwind CSS v4
- shadcn/ui
- Shadcnblocks integration through the project wrapper
- Keystatic as the default CMS implementation
- Git / GitHub
- GitHub Actions for lightweight verification
- Cloudflare as the default deployment target, behind a deployment boundary

Pin framework/runtime versions in the starter rather than floating on `latest`.

### Node

- Pin a supported Node 22 release in `.nvmrc`.
- `package.json#engines` must express the compatible major range.
- Runtime upgrades are deliberate platform maintenance tasks, not incidental project changes.

## 3. Framework invariants

### Next.js

- Use the App Router.
- Site-facing routes live under `src/app/(site)/`.
- Framework/admin routes such as Keystatic and API handlers live outside `(site)`.
- Prefer Server Components by default.
- Add `"use client"` only when browser state, effects, or client-only APIs require it.
- Do not introduce an application-wide state library without a demonstrated need.

### TypeScript

- `strict: true`.
- No `any` in project-owned code unless unavoidable and documented.
- No `@ts-ignore` as a routine escape hatch.
- No JavaScript application files when TypeScript is appropriate.
- Use `@/*` as the `src/*` path alias.

## 4. Content architecture invariant

The site must depend on a **content access boundary**, not directly on Keystatic throughout the component tree.

Preferred flow:

```text
Route / server component
        ↓
  src/lib/content
        ↓
 Keystatic reader
        ↓
    content/
```

Presentation components receive plain typed props.

Forbidden flow:

```text
UI component
    ↓
Keystatic import
```

### V0 CMS scope

The base contains only a minimal site singleton, sufficient to prove the CMS boundary and admin UI work.

Suggested editable fields:

- site name
- short name
- description
- default SEO title
- default SEO description

Do **not** add domain collections such as people, events, news, projects, services, testimonials, or locations to the base.

Those belong to profiles/capabilities.

## 5. Route registry invariant

The filesystem and the public URL registry must not drift.

`src/lib/routes.ts` is the explicit source of truth for public site URLs.

It feeds:

- sitemap generation
- route-integrity verification
- other route-aware platform utilities

Navigation is deliberately separate from the route registry. A route can exist without appearing in the primary navigation.

### Base state

The base initially registers only the routes it actually contains. It must not invent future pages such as About, Events, Team, or Contact.

### Verification

`scripts/check-routes.mjs` compares `src/app/(site)/**/page.tsx` with the route registry and fails when they disagree.

Adding a public page therefore requires, in the same change:

1. create the route;
2. register the URL;
3. run route verification.

## 6. Component-source invariant

The project distinguishes three component ownership classes:

### `src/components/ui/`

Registry-linked shadcn/ui primitives.

- imported by application code;
- treated as upstream-managed;
- do not casually edit.

### `src/components/shadcnblocks/`

Pristine Shadcnblocks source/reference copies.

- never customize directly;
- retain as the clean upstream baseline;
- copy a selected block into `normalized/` before project-specific modification.

### `src/components/normalized/`

Project-owned components and normalized registry blocks.

- strip demo content;
- rename by semantic role;
- define typed props;
- adapt to project tokens and content;
- this is where project-specific edits happen.

The V0 base does **not** preinstall a library of finished Shadcnblocks sections.

It provides the intake workflow, not a predetermined design.

## 7. Dependency discipline

The base must contain only dependencies needed by the foundation.

Do not copy all dependencies from a mature reference project.

Specifically absent from V0 unless required later:

- Motion / Framer Motion
- Lenis
- Three.js / React Three Fiber
- Magic UI
- image-zoom libraries
- analytics SDKs
- scheduling SDKs
- payment SDKs
- CRM SDKs
- map SDKs
- Playwright
- axe
- Lighthouse tooling

Rule:

> If the base application can function correctly without a dependency, do not install it merely because a future project might use it.

## 8. SEO baseline

The base includes:

- metadata infrastructure
- canonical metadata base support
- `sitemap.ts`
- `robots.ts`
- Open Graph-ready metadata helpers

It does not invent project-specific keywords, structured data, organization details, or marketing copy.

SEO helpers should accept site/content configuration rather than hard-coded brand data.

## 9. Accessibility baseline

Accessibility is a coding invariant even when automated accessibility testing is not yet installed.

Required conventions:

- semantic HTML
- logical heading hierarchy
- keyboard-operable controls
- visible focus styles
- explicit form labels
- meaningful image alternative text
- sufficient contrast
- reduced-motion support when motion is later added
- do not use visual styling as the only carrier of meaning

Automated axe/Playwright accessibility testing is intentionally deferred from the V0 base.

## 10. Quality gate

The everyday quality system must be easy enough that a learner understands and uses it.

### `npm run verify:fast`

Runs:

1. ESLint
2. TypeScript typecheck
3. route-integrity check

### `npm run verify`

Runs:

1. `verify:fast`
2. production Next.js build

This is the V0 completion gate.

No E2E, visual-regression, Lighthouse, or production-runtime suite is required in the base.

## 11. CI

A single GitHub Actions workflow runs on pushes and pull requests:

```text
npm ci
npm run verify
```

CI should reproduce the local quality gate rather than introduce a separate hidden standard.

## 12. Deployment boundary

Cloudflare is the default target, but application/domain code must not assume Cloudflare APIs.

Provider-specific concerns belong in deployment configuration and thin adapters only.

The exact V0 Cloudflare adapter is defined in `10-deployment.md` after compatibility is validated with:

- Next.js 16
- Keystatic admin
- Keystatic write/publish workflow
- image behavior
- production deployment

Do not spread Workers-specific APIs into content, components, routing, or domain logic.

## 13. AI-governance baseline

The starter includes a concise `CLAUDE.md` and scoped `.claude/rules/` files.

Claude must:

- read the relevant project docs before architectural work;
- preserve established boundaries;
- use the route registry;
- use semantic design tokens;
- follow the Shadcnblocks normalization workflow;
- avoid unnecessary dependencies;
- run the appropriate verification command before declaring work complete;
- report adjacent problems rather than silently expanding scope.

Project/profile rules may add stronger educational constraints.

## 14. Explicit V0 exclusions

The foundation does not include:

- finished site navigation
- finished visual identity
- site-specific fonts
- site-specific colors
- page-specific imagery
- audience definition
- site objectives
- CTA strategy
- non-root content pages
- people/team collection
- events collection
- news/blog collection
- projects collection
- gallery collection
- services collection
- forms integration
- analytics
- consent management
- scheduling
- payments
- CRM
- ecommerce
- multi-location infrastructure

## 15. Definition of done

A clean base clone must support:

```bash
npm install
npm run dev
npm run verify:fast
npm run verify
```

The site must load, Keystatic must be architecturally wired through the content boundary, the route guard must pass, and the UI must remain intentionally neutral.
