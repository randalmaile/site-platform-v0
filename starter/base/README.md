# Site platform — base starter

A neutral Next.js application with the recurring infrastructure already solved,
and none of the product decisions made.

```bash
nvm use            # Node 22 (see .nvmrc)
npm install
npm run dev        # http://localhost:3000
```

Content is edited at [/keystatic](http://localhost:3000/keystatic).

## What you get

Next.js 16 (App Router) · React 19 · strict TypeScript · Tailwind CSS v4 ·
shadcn/ui and Shadcnblocks intake tooling · Keystatic behind a content boundary ·
a route registry with an integrity check · generated sitemap and robots ·
reusable metadata helpers · neutral semantic design tokens · a two-command
quality gate · one CI workflow.

## What you do not get, on purpose

No organisation, audience, site objectives, sitemap beyond the homepage, CTA
strategy, brand, palette, typefaces, logo, imagery or finished page design. No
domain collections — people, events, news, projects, services, gallery. No
analytics, payments, scheduling, CRM, maps, forms or consent tooling. No page
builder, block renderer or component registry.

The homepage is deliberately plain. It is proof the application runs, not a
design direction — replace it.

Those are decisions for whoever owns this site. A starter that arrives looking
finished gets kept by default, and that is the failure this neutrality prevents.

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run verify:fast` | Lint, typecheck, route integrity |
| `npm run verify` | The above plus a production build — the completion gate |
| `npm run block:add -- @shadcnblocks/<name>` | Install a registry block into the right directory |

Cloudflare Workers deployment through vinext passed the base's end-to-end
acceptance test. It is still not the development workflow: `npm run dev` stays
standard Next.js. `npm run build:vinext` and `npm run start:vinext` build and
run the Worker locally; `npm run deploy:vinext` deploys it. Read
[`docs/deployment/status.md`](docs/deployment/status.md) before using any of
them—the Worker reads content from GitHub rather than from disk, and deployed
Keystatic requires a GitHub App plus the documented environment variables.

## Layout

```text
content/                 editorial content, edited at /keystatic
docs/                    architecture, design system, accessibility, workflows
scripts/                 route guard, block installer
src/app/(site)/          public pages
src/app/keystatic/       CMS admin — not public IA, not in the sitemap
src/components/          layout · ui · shadcnblocks · normalized
src/config/              operator configuration
src/lib/content/         the only place Keystatic is imported
src/lib/routes.ts        canonical public URL set
src/lib/navigation.ts    what the chrome links to — a separate decision
```

## Environment

Copy `.env.example` to `.env`. Nothing is required for local development —
`SHADCNBLOCKS_API_KEY` is needed only to install blocks, and the Keystatic
GitHub variables only once a project switches storage modes.

## Where to read next

[`docs/README.md`](docs/README.md) is the map. Start with
[`docs/architecture/overview.md`](docs/architecture/overview.md) for why the
boundaries exist, and [`docs/workflows/`](docs/workflows/) for how to do things.

`CLAUDE.md` and `.claude/rules/` are the same conventions in operational form,
for AI agents.
