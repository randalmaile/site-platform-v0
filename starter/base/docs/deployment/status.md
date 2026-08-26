# Deployment status

**vinext is the V0 base's proven Cloudflare adapter.** On 26 August 2026 the
base passed the full deployed Keystatic GitHub-mode editing flow. `npm run dev`,
`npm run build` and `npm run verify` remain standard Next.js and are unaffected
by the deployment adapter.

## Current state

| | |
| --- | --- |
| Adapter | vinext 1.0.0-beta.8 — end-to-end validation passed |
| `npm run dev` | standard Next.js, filesystem content |
| `npm run build` / `npm run verify` | standard Next.js, passing |
| `npm run build:vinext` | passing |
| `npm run start:vinext` | local Worker, `GET /` returns 200 |
| Provider APIs in application code | none |
| Keystatic storage | local by default; GitHub when configured for deployment |

## Scripts

| | |
| --- | --- |
| `npm run build:vinext` | Build the Worker bundle into `dist/` |
| `npm run start:vinext` | Run the built Worker locally through Wrangler |
| `npm run deploy:vinext` | Deploy the built Worker to Cloudflare |
| `npm run dev:vinext` | vinext's own dev server — a debugging aid, not the dev workflow |

`npm run dev` stays the development workflow. `dev:vinext` exists to reproduce a
Worker-specific problem, not to replace Next's dev server.

## What vinext required

`vinext init` added these, and all of them are load-bearing:

| | Why |
| --- | --- |
| `vinext`, `@vinext/cloudflare` | the adapter itself |
| `vite`, `@vitejs/plugin-react`, `@vitejs/plugin-rsc` | vinext builds through Vite, not Next's compiler |
| `@cloudflare/vite-plugin`, `wrangler` | Worker output and the local runtime |
| `react-server-dom-webpack` | RSC payload encoding the build expects |
| `"type": "module"` in `package.json` | required by Vite; the compatibility check flagged its absence |
| `@babel/plugin-transform-runtime` (dev) | pinned to break an npm resolution failure during `vinext init` — see `MAINTENANCE.md` |

`vite.config.ts` and `wrangler.jsonc` contain the adapter configuration.
`next.config.ts` additionally allows `127.0.0.1` during development because the
Keystatic GitHub App setup callback uses that host.

`dist/` is the Vite build directory. ESLint's defaults ignore `.next/` but not
`dist/`, so `eslint.config.mjs` ignores it explicitly — without that,
`npm run lint` reports thousands of findings in bundled third-party code.

**The two builds share `.next/types/` and disagree about it.** `vinext build`
writes its own `routes.d.ts` there, which does not satisfy the `validator.ts`
that `next build` generated, so the next `npm run verify` fails with
`Module './routes.js' has no exported member 'AppRoutes'` — a confusing error
that has nothing to do with the code being checked. `build:vinext` therefore
removes `.next/types/` after itself (`npm run clean:next-types`); `next build`
and `next dev` regenerate it. Run `npm run clean:next-types` by hand if
`dev:vinext` leaves the same wreckage behind.

## Runtime content: why the Worker needs GitHub

A Cloudflare Worker has no repository filesystem. The filesystem reader resolves
paths against `process.cwd()`, finds nothing, and `reader.singletons.site.read()`
returns `null` — so `getSite()` throws and the homepage 500s. This is not a
vinext defect; any filesystem-free runtime behaves the same way.

The application therefore reads content over the GitHub API when
`CONTENT_SOURCE=github`. The variables are documented in `.env.example`.

### How variables reach a local Worker

Not through `.env.local`. The chain is:

```text
.dev.vars  →  @cloudflare/vite-plugin (at build time)  →  dist/server/.dev.vars  →  wrangler dev
```

Two consequences worth knowing before debugging this:

- **`.dev.vars` is read at build time, not run time.** Changing it requires
  `npm run build:vinext` again; restarting the Worker alone changes nothing.
- **`.dev.vars` takes precedence over `.env*` entirely.** When it exists,
  variables that live only in `.env.local` are not forwarded to the Worker.

Keeping Worker variables in `.dev.vars` rather than `.env.local` is deliberate:
Next.js does not read `.dev.vars`, so `npm run dev` keeps using filesystem
content while the Worker uses GitHub. Both files are gitignored.

For a real deployment these are Cloudflare secrets (`wrangler secret put`), not
files. Never put a token in `wrangler.jsonc` — it is committed.

Note that `dist/server/.dev.vars` contains real secret values after a build.
`dist/` is gitignored; do not copy a build output anywhere it would be
published.

### The `User-Agent` workaround

Keystatic's GitHub reader issues `fetch` calls with no `User-Agent` header, and
GitHub's REST API answers `403 Request forbidden by administrative rules` to any
request without one. Node's `fetch` supplies a default, which is why this never
appears in development; `workerd`'s does not.

`reader.ts` therefore wraps `fetch` for `api.github.com` and
`raw.githubusercontent.com` only, filling in the header when it is absent. The
wrapper is re-asserted before each read rather than installed once, because
vinext replaces `globalThis.fetch` with its own caching wrapper on the first
request and that wrapper delegates to the `fetch` it captured at startup — so
anything installed at module scope is discarded before it is ever used.

It is contained in `reader.ts` on purpose: this is a CMS mechanic, and the
boundary is where CMS mechanics stop. Tracked for removal in `MAINTENANCE.md`.

### Prerendering

`vite.config.ts` sets `prerender: { routes: "*" }`, but vinext classifies `/` as
dynamic and renders it per request. That is the safe outcome while content comes
from GitHub — a prerendered homepage would freeze content at build time and
would need the GitHub variables available to the build as well.

## Keystatic storage in a Worker

The base defaults to local storage so `npm run dev` edits the checked-out
`content/` directory without credentials. A deployed Worker must set
`NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO`; `keystatic.config.ts` then switches the
admin to GitHub storage.

**`wrangler dev` makes this look like it works.** Local mode reads
`process.cwd()`, which under `wrangler dev` resolves to `dist/server/` — so
`/api/keystatic/tree` returns a directory listing of the *build output*. It is a
convincing-looking response to a request that cannot succeed in production.

GitHub mode needs a GitHub App, the four GitHub App variables documented in
`.env.example`, and an OAuth callback on the deployed origin. If the application
lives below the repository root, also set
`NEXT_PUBLIC_KEYSTATIC_GITHUB_PATH_PREFIX`. Without that prefix Keystatic reads
and writes the same-looking path at the repository root; the acceptance test
first exposed this by creating `content/site.json` instead of updating
`starter/base/content/site.json`.

Note that Keystatic's GitHub *storage* (editing, OAuth, commits) and the GitHub
*reader* (`CONTENT_SOURCE`) are separate mechanisms with separate credentials.
Configuring one does not configure the other.

## Acceptance test — passed 26 August 2026

A working homepage does not make an adapter supported. The editing workflow is
what has to be proven, end to end (`briefs/10-deployment.md` §12,
`briefs/06-keystatic.md` §22):

```text
✔ npm run dev works normally
✔ npm run build works
✔ vinext compatibility check reviewed
✔ vinext build succeeds
✔ local Worker serves GET / as 200
✔ homepage renders real repository content through the GitHub reader
✔ local Keystatic filesystem editing still works in npm run dev
✔ Cloudflare Worker deploy succeeds
✔ public site renders correctly
✔ /keystatic loads in production
✔ GitHub login succeeds
✔ authorized editor can open content
✔ structured content can be edited
— Markdown editing is not enabled in the neutral base
— image upload is not enabled in the neutral base
✔ save updates starter/base/content/site.json
✔ commit reaches GitHub
— no rebuild is required; the Worker reader fetches GitHub content per request
✔ updated content appears publicly
✔ temporary validation content was restored
```

The deployed validation used `site-platform-base.randalmaile.workers.dev` and a
GitHub App restricted to `randalmaile/site-platform-v0`. Project-specific
routes, content types and dependencies still require their own compatibility
and acceptance pass.

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

Both findings were mechanical and both were fixed by `vinext init`. The score
was a weaker signal than it looked: it is static analysis over imports and file
structure, and it predicted none of the three runtime failures found since —
filesystem content, the missing `User-Agent`, or the admin's filesystem
dependency. Treat a compatibility score as a reason to try an adapter, never as
evidence that one works.

The base is also nearly empty, so the score will move as a project adds real
routes, images and dependencies. Re-run the check before adopting.

## Choosing an adapter

Per `briefs/10-deployment.md` §19:

1. Run `npx vinext check` against the *project*, not this base.
2. If compatibility is acceptable, configure vinext per current Cloudflare
   guidance. Keep `npm run dev` on standard Next.js.
3. Expose routine operations as npm scripts so nobody has to remember provider
   CLI syntax.
4. Run the acceptance test above **in full**.
5. If a critical step fails because of the adapter or runtime, OpenNext is the
   documented fallback. Choose it on demonstrated need, not on habit.

Nothing found so far argues for OpenNext. The two runtime failures that cost the
most time — filesystem content and the missing `User-Agent` — are properties of
Workers and of Keystatic, and OpenNext would hit both identically. Only the
`globalThis.fetch` interaction is vinext's own, and it has a contained fix.

Keep adapter configuration isolated. `npm run verify` must stay free of
deployment, credentials and network access.

## Configuring Keystatic GitHub mode

`keystatic.config.ts` switches automatically when the variables documented in
`.env.example` are present:

```text
NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO
NEXT_PUBLIC_KEYSTATIC_GITHUB_PATH_PREFIX  # when the app is in a subdirectory
KEYSTATIC_GITHUB_CLIENT_ID
KEYSTATIC_GITHUB_CLIENT_SECRET
KEYSTATIC_SECRET
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
```

The repository, path prefix and App slug are build-time public configuration.
The client secret and `KEYSTATIC_SECRET` belong in Cloudflare's encrypted
secret configuration—never in the repository. Editors need write access to the
content repository; that is the intentional V0 tradeoff of Git-backed content.
