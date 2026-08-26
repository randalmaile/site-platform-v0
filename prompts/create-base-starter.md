# Claude Code Handoff — Build V0 Base Starter

Use this prompt from the root of the `site-platform` repository after the specification files have been added.

---

You are implementing **Milestone 1: the neutral V0 base starter** for a reusable website-generation platform.

## First: read the specification

Before writing code, read these files completely:

1. `briefs/01-platform-foundation.md`
2. `briefs/02-project-structure.md`
3. `briefs/04-design-system.md`
4. root `CLAUDE.md` if present

Treat the briefs as architectural requirements, not suggestions.

## Reference implementation

A mature Le Roch Lab repository may be available separately as a reference.

Use it to learn from proven patterns such as:

- route registry + route-integrity verification;
- `npm run block:add` wrapper behavior;
- separation of `shadcnblocks/` pristine source from `normalized/` project components;
- strict TypeScript;
- Keystatic content boundary;
- CSS-variable design tokens;
- concise Claude governance;
- lightweight local/CI verification.

**Do not copy the Le Roch application wholesale.**

Do not inherit its lab-specific content, routes, styling, motion, image systems, complex dependencies, Playwright suite, accessibility automation, Cloudflare/OpenNext implementation, or domain models unless this prompt/spec explicitly requires them.

## Goal

Create a working application at:

```text
starter/base/
```

It must be a complete Next.js application that can run independently.

Required commands:

```bash
cd starter/base
npm install
npm run dev
npm run verify:fast
npm run verify
```

## Required foundation

Implement:

- Next.js 16 App Router
- React 19
- strict TypeScript
- Tailwind CSS v4
- shadcn/ui configuration
- Shadcnblocks paid registry configuration via `SHADCNBLOCKS_API_KEY`
- `scripts/add-block.mjs` adapted from the proven Le Roch wrapper concept
- Keystatic
- minimal site singleton only
- content access boundary under `src/lib/content/`
- public site route group `(site)`
- explicit route registry at `src/lib/routes.ts`
- separate `src/lib/navigation.ts`
- filesystem/registry route check
- sitemap generated from registered public routes
- robots baseline
- reusable metadata helper
- neutral semantic design tokens
- minimal `Section`, `SiteHeader`, and `SiteFooter`
- lightweight verification scripts
- one GitHub Actions verification workflow
- pinned Node runtime
- concise generated-site `CLAUDE.md`
- scoped `.claude/rules/`
- minimal project documentation structure described in the briefs

## Very important scope boundaries

The base must remain intentionally neutral.

Do **not** create:

- a fictional student organization
- an About page
- Events
- Team/People
- News/Blog
- Projects
- Gallery
- Contact form
- Services
- finished navigation IA
- CTA strategy
- a strong color palette
- custom brand fonts
- a logo
- hero imagery
- a polished marketing homepage
- analytics
- payments
- scheduling
- CRM
- maps
- ecommerce
- consent tooling
- a generic page builder
- a universal block renderer
- a universal component registry
- capability flags for infrastructure that does not exist

Do not install dependencies for hypothetical future features.

## Homepage

Create only a deliberately plain proof-of-life homepage.

It should communicate that the starter is running and that product/design discovery has not happened yet.

Keep the presentation neutral and accessible.

Do not introduce a design direction.

## Keystatic

Implement only the minimal site singleton described in the platform brief.

Presentation components must never import Keystatic.

Read content through `src/lib/content/` from a server route/component and pass plain typed data downward.

Avoid a generic CMS-provider abstraction. Establish the boundary without overengineering it.

## Routes

Initially register only the public routes that actually exist.

Admin/API routes must not appear in the sitemap.

Navigation must remain separate from the public route registry.

Adapt the Le Roch route-check pattern, but simplify it for this base rather than copying site-specific dynamic-route logic that is not yet needed.

## Components

Implement these ownership rules:

```text
src/components/ui/             upstream/registry-linked primitives
src/components/shadcnblocks/   pristine Shadcnblocks source
src/components/normalized/     project-owned normalized sections
src/components/layout/         structural site components
```

Nothing should live loose in `src/components/`.

The block wrapper must preserve the core Le Roch protections relevant to Shadcnblocks:

- require explicit registry prefixes;
- run the pinned local shadcn CLI when available;
- place Shadcnblocks source in `src/components/shadcnblocks/`;
- preserve shadcn/ui primitives in `src/components/ui/`;
- repair imports when files are moved;
- detect and warn if `src/app/globals.css` changes unexpectedly;
- remind the developer that Shadcnblocks source must be copied into `normalized/` before editing.

Only support registries actually required by V0. Do not carry Magic UI/Aceternity support merely because the reference project had it.

## Design system

Use neutral semantic variables in `globals.css`.

Do not copy Le Roch colors, fonts, specimen accents, or brand-specific tokens.

Start with the small semantic set in `briefs/04-design-system.md` and add nothing without a concrete need.

Avoid arbitrary repeated Tailwind values for design-system concerns.

## Verification

Provide:

```text
npm run lint
npm run typecheck
npm run check:routes
npm run verify:fast
npm run verify
```

Where:

```text
verify:fast = lint + typecheck + check:routes
verify      = verify:fast + next build
```

Do not install Playwright, axe, Lighthouse, Husky, or lint-staged in V0.

## CI

Create one small GitHub Actions workflow that:

1. checks out the repository;
2. installs the pinned Node version;
3. runs `npm ci` inside `starter/base`;
4. runs `npm run verify` inside `starter/base`.

Keep CI understandable and aligned with local verification.

## Cloudflare

Cloudflare is the intended default deployment target, but the exact adapter is not part of this implementation yet.

Do not copy the Le Roch OpenNext deployment config into the base.

Do not introduce Cloudflare APIs into application code.

Leave the project as a standard Next.js application ready for the deployment brief to add a provider-specific adapter later.

## Documentation

Create concise starter documentation explaining:

- what this base is;
- what it deliberately does not provide;
- folder ownership;
- add-page workflow;
- add-component/Shadcnblocks workflow;
- verification workflow;
- design-token philosophy;
- accessibility coding conventions.

Avoid duplicating policies word-for-word across `CLAUDE.md`, `.claude/rules/`, and `docs/`.

## AI rules

The generated `starter/base/CLAUDE.md` should tell future AI agents to:

- stay within requested scope;
- preserve architecture boundaries;
- use the route registry;
- keep CMS imports out of presentation components;
- use semantic design tokens;
- follow the block normalization workflow;
- avoid speculative dependencies/abstractions;
- run verification before completion.

Do not yet add the student-specific educational rules. Those belong to the student-organization profile layer.

## Implementation process

Work in this order:

1. inspect the repository and briefs;
2. write a concise implementation plan;
3. scaffold `starter/base`;
4. implement foundation architecture;
5. implement documentation/AI rules;
6. run `npm install` if needed;
7. run `npm run verify:fast`;
8. fix all failures;
9. run `npm run verify`;
10. inspect the final dependency list and remove anything not justified by the briefs;
11. inspect the final diff for accidental project-specific design/content decisions.

## Completion report

When finished, report:

1. the resulting directory structure;
2. dependencies added and why each non-framework dependency exists;
3. verification results;
4. any decisions you had to make that were not explicitly covered by the briefs;
5. anything deliberately deferred to later briefs/profiles.

Do not begin implementing student-organization capabilities.


---

# V0 SPECIFICATION STATUS

The following briefs are authoritative and should all be read before implementation:

```text
briefs/01-platform-foundation.md
briefs/02-project-structure.md
briefs/03-content-architecture.md
briefs/04-design-system.md
briefs/05-component-strategy.md
briefs/06-keystatic.md
briefs/07-seo.md
briefs/08-accessibility.md
briefs/09-testing.md
briefs/10-deployment.md
briefs/11-ai-governance.md
```

If this prompt conflicts with a newer brief, the brief wins.

---

# DEPLOYMENT IMPLEMENTATION REQUIREMENTS

Build `starter/base` first as a standard Next.js application.

Do not copy deployment configuration from Le Roch Lab merely because it is known to work there.

After the standard base is working:

1. Run the current vinext compatibility check.
2. Review reported issues.
3. If acceptable, configure vinext for Cloudflare Workers using current official guidance.
4. Preserve normal `npm run dev` behavior.
5. Expose routine provider operations through project scripts such as:
   - `npm run preview`
   - `npm run deploy`
6. Keep deployment-specific code/configuration isolated.
7. Document the exact adapter and environment requirements.

Do not silently switch to OpenNext.

If vinext compatibility is materially insufficient, stop the deployment-adapter step, report the issue clearly, and identify OpenNext as the documented fallback.

Do not claim Keystatic GitHub-mode compatibility merely because the site builds or deploys.

The full acceptance test includes:

```text
/keystatic loads
GitHub authentication succeeds
authorized content can be opened
content can be edited
content reaches GitHub
deployment rebuilds
updated content appears publicly
```

Some of these steps require real deployment credentials/GitHub App configuration and therefore may require a human acceptance test. When credentials are unavailable, prepare the repository and exact validation checklist without inventing successful results.

---

# MILESTONE 1 COMPLETION REQUIREMENTS

Before declaring the base implementation complete:

```bash
npm install
npm run dev
npm run verify
```

must be valid workflows.

The repository must contain the agreed platform foundation but must NOT invent:

```text
student organization concept
audience
site objectives
CTA strategy
sitemap beyond the minimal base
brand
fonts
colors beyond neutral tokens
finished page design
domain collections
speculative integrations
```

Report:

1. files created/changed
2. dependencies added and why
3. verification results
4. deployment-adapter result
5. any manual Keystatic/Cloudflare acceptance steps still required
6. any deviation from the briefs
