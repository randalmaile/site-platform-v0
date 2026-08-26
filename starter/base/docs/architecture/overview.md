# Architecture overview

A standard Next.js 16 App Router application with four boundaries that are worth
defending. Everything else is ordinary React.

## What this base is

Infrastructure that every site needs, solved once: routing integrity, a content
boundary, design tokens, an SEO baseline, accessibility conventions, and a
quality gate small enough that people actually run it.

## What it deliberately is not

It makes no product decisions. There is no audience, no site objective, no
sitemap beyond the homepage, no CTA strategy, no brand, no palette, no
typefaces, no imagery and no finished page design. There are no domain
collections — no people, events, news or projects. There is no analytics,
payments, scheduling, CRM, maps, forms or consent tooling.

None of that is an oversight. A starter that arrives looking finished gets kept
by default, and those decisions belong to whoever owns this site.

---

## Boundary 1 — the route registry

`src/lib/routes.ts` is the canonical set of public URLs. The sitemap is
generated from it, and `scripts/check-routes.mjs` fails the build when it and
the filesystem disagree.

**Why it exists.** A page added under `src/app/(site)` without a registry entry
is invisible to the sitemap: it ships, and nothing ever points a crawler at it.
A registry entry with no page is the mirror failure — the sitemap advertises a 404. Neither is caught by lint, types or the build.

The list is explicit rather than crawled, because a page existing on disk is not
the same as a page being intended. Writing both down makes the disagreement
itself the finding.

**Navigation is separate.** `src/lib/navigation.ts` decides what the chrome
links to. A page can be public and deliberately unlinked; merging the two lists
would make "add a page" silently mean "add a nav item".

`/keystatic` and `/api/*` are real routes that are deliberately unregistered —
they are framework surface, not public information architecture.

---

## Boundary 2 — content

React owns the website; Keystatic owns editable content. src/lib/content is the narrow doorway between them.

```text
route / server component
        ↓
   src/lib/content/          ← the boundary
        ↓
   Keystatic reader
        ↓
      content/
```

`src/lib/content/reader.ts` is the only file that imports Keystatic. It is
marked `server-only`, so importing it from a client component is a build error
rather than something a reviewer has to catch.

Components receive plain typed props and never learn where the data came from.
That is what makes the CMS replaceable, and it is why a component importing
`@keystatic/core/reader` is a defect no matter how convenient it is.

**The boundary is thin on purpose.** A reader, one module per domain, and the
application-facing types in `src/types/content.ts`. No adapter, repository,
service, provider or mapper layer — those solve a complexity this project does
not have.

**The CMS is not the application.** Pages are code: the route chooses what
content it needs and how to compose it. Keystatic models meaning — title,
description, date, status — not presentation. There is no page-builder schema,
and adding one is an architectural decision, not a feature.

**V0 content model.** One site singleton, five fields. Collections arrive with
the capabilities that need them.

**Two storage backends, one boundary.** `reader.ts` chooses at startup from
`CONTENT_SOURCE`: unset or `local` reads `content/` from disk, `github` fetches
from the GitHub API at request time. Nothing above the boundary changes — the
domain modules call the same reader and callers still receive plain typed
values. The GitHub reader exists because a Cloudflare Worker has no repository
filesystem, so `process.cwd()` resolves to nothing readable and every read
returns `null`. See [`../deployment/status.md`](../deployment/status.md) for the
variables and how they reach a Worker.

---

## Boundary 3 — component ownership

```text
src/components/ui/            shadcn/ui primitives — upstream-managed
src/components/shadcnblocks/  pristine registry source — never edited
src/components/normalized/    registry source adapted for this project
src/components/layout/        structural site components
src/components/<domain>/      components tied to a domain concept
```

The split between `shadcnblocks/` and `normalized/` is the useful one: keeping
an untouched copy of what the registry actually shipped means an adaptation can
always be compared against its origin. `npm run block:add` only ever adds — it
will not rewrite a file that already exists, so refreshing registry source is a
deliberate delete-and-reinstall rather than something an unrelated install does
to project work.

`normalized/` means _adapted external source_, not _miscellaneous components_.

Nothing lives loose at the root of `src/components/`.

---

## Boundary 4 — deployment

This is a standard Next.js application. Cloudflare Workers is the intended
target, and vinext has been validated far enough to serve the base from a local
Worker, but no adapter is adopted yet and no provider API appears in content,
components, routing or domain logic. Changing deployment provider should be a
change to configuration, not to the app.

The one place the runtime shows through is `CONTENT_SOURCE`, and it shows
through as an environment variable rather than an import: `reader.ts` knows that
*some* runtimes cannot read the repository from disk, not that Cloudflare is
one of them.

See [`../deployment/status.md`](../deployment/status.md).

---

## Configuration vs content

| Who changes it           | Where it lives                           |
| ------------------------ | ---------------------------------------- |
| An editor                | Keystatic → `content/`                   |
| An operator or developer | `src/config/` or an environment variable |

Site name, description and SEO defaults are editorial. The canonical origin is
operational. Neither is written down twice.

## SEO

`src/lib/seo/metadata.ts` builds page metadata from content that already exists:
a page passes what makes it different, the site singleton supplies the rest.
Canonical URLs are derived from `src/config/site.ts` and the route path.

No structured data ships in the base. Correct JSON-LD depends on what kind of
site this becomes, and emitting a generic `Organization` graph for every site
would mostly be emitting a wrong one.
