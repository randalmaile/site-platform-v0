# Architecture rules

Reasoning and diagrams: `docs/architecture/overview.md`.

## Routes

- `src/lib/routes.ts` is the canonical public URL set. Nothing else defines one.
- Adding a public page means, in the same change: create
  `src/app/(site)/<route>/page.tsx`, add the URL to `PUBLIC_ROUTES`, decide
  about `navigation.ts`, run `npm run check:routes`.
- `/keystatic` and `/api/*` are never registered and never appear in the
  sitemap.
- Navigation is a separate decision from route existence. A page can be public
  and deliberately unlinked.
- The route guard understands static routes only. The first dynamic route means
  extending `scripts/check-routes.mjs` — not deleting the check.

## Content

- `src/lib/content/` is the only place Keystatic is imported. `reader.ts` owns
  the reader; one module per domain owns retrieval and normalization.
- Routes and server components read content and pass plain typed props down.
- No CMS import in any component under `src/components/`.
- No adapter/repository/provider/mapper layering. The boundary is thin.

## Configuration

- Editable by an editor → Keystatic. Set by an operator → `src/config/site.ts`
  or an environment variable.
- The canonical origin lives in `src/config/site.ts`. Do not re-derive it
  anywhere else.
- Never duplicate a fact that already has a canonical home.

## Server and client

- Server Components by default. Add `"use client"` only when browser state,
  effects or browser-only APIs require it.
- No application-wide state library without a demonstrated need.

## Deployment

- Standard Next.js application. No provider APIs in content, components,
  routing or domain logic.
- Provider mechanics belong in deployment configuration and thin adapters.
