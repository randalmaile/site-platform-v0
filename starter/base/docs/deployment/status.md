# Deployment status

**No deployment adapter is configured.** This is a standard Next.js application.

That is deliberate. Cloudflare Workers is the intended default target, but the
adapter is chosen per project by demonstrated compatibility — not inherited. The
compatibility check below has been run; the acceptance test has not, because it
needs real credentials.

## Current state

| | |
| --- | --- |
| Adapter | none |
| `npm run dev` | standard Next.js |
| `npm run build` | standard Next.js, passing |
| `npm run preview` / `npm run deploy` | not present — they arrive with an adapter |
| Provider APIs in application code | none |
| Keystatic storage | `local` |

## vinext compatibility check

`npx vinext@1.0.0-beta.8 check`, run against this application on 25 August 2026:

```text
vinext compatibility report
========================================

Imports: 2/2 fully supported
  ✓  next/link (2 files)
  ✓  server-only (1 file)

Libraries: 1/1 compatible
  ✓  tailwindcss

Project structure:
  ✓  App Router (src/app/)
  ✓  2 page(s)
  ✓  2 layout(s)
  ✓  1 route handler(s)
  ✓  1 not-found page(s)
  ✗  Missing "type": "module" in package.json — required for Vite —
     vinext init will add it automatically
  ~  PostCSS string-form plugins (postcss.config.mjs) — string-form PostCSS
     plugins need resolution — vinext handles this automatically

Overall: 85% compatible (8 supported, 1 partial, 1 issues)
```

### Reading it

Both findings are mechanical and both are fixed by `vinext init`. Nothing in the
application's own architecture is reported as incompatible.

**But this is a weaker signal than it looks.** The checker scans imports,
libraries and file structure. It does not exercise the Keystatic admin bundle,
which is by far the largest runtime risk here and the thing brief 10 makes the
deciding factor. An 85% structural score says the base is a reasonable candidate
for vinext. It does not say vinext works for this project.

The base is also nearly empty. This score will change as a project adds real
routes, images and dependencies, so re-run the check before adopting an adapter.

## Choosing an adapter

Per `briefs/10-deployment.md` §19:

1. Run `npx vinext check` against the *project*, not this base.
2. If compatibility is acceptable, configure vinext per current Cloudflare
   guidance. Keep `npm run dev` on standard Next.js.
3. Expose routine operations as `npm run preview` and `npm run deploy` so nobody
   has to remember provider CLI syntax.
4. Run the acceptance test below **in full**.
5. If a critical step fails because of the adapter or runtime, OpenNext is the
   documented fallback. Choose it on demonstrated need, not on habit.

Keep adapter configuration isolated. `npm run verify` must stay free of
deployment, credentials and network access.

## Acceptance test — not yet run

A working homepage does not make an adapter supported. The editing workflow is
what has to be proven, end to end
(`briefs/10-deployment.md` §12, `briefs/06-keystatic.md` §22):

```text
□ npm run dev works normally
□ npm run build works
□ vinext compatibility check reviewed
□ Cloudflare Worker deploy succeeds
□ public site renders correctly
□ /keystatic loads in production
□ GitHub login succeeds
□ authorized editor can open content
□ structured content can be edited
□ Markdown content can be edited        (when enabled)
□ image upload works                    (when enabled)
□ save creates/updates repository content
□ commit reaches GitHub
□ deployment rebuild occurs
□ updated content appears publicly
```

Every box is unticked. Steps 4 onward need Cloudflare credentials and a
configured Keystatic GitHub App, so they are a human acceptance test. Do not
record a result that was not observed.

## Switching Keystatic to GitHub mode

Required for the workflow above. Replace the storage block in
`keystatic.config.ts`:

```ts
storage: {
  kind: "github",
  repo: { owner: "your-org", name: "your-repo" },
},
```

Then set the variables documented in `.env.example`:

```text
KEYSTATIC_GITHUB_CLIENT_ID
KEYSTATIC_GITHUB_CLIENT_SECRET
KEYSTATIC_SECRET
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
```

They belong in Cloudflare's secret configuration for the deployed environment —
never in the repository. Editors need write access to the content repository;
that is the intentional V0 tradeoff of Git-backed content.
