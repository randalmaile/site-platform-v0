# 02 — Project Structure

**Status:** V0 architectural contract  
**Scope:** generated site repository  
**Purpose:** Make file placement, ownership, and coupling predictable for humans and AI agents.

## 1. Principle

Directory structure is part of the architecture.

Every major concern should have an obvious home, and each folder should have a small, explicit responsibility.

The system favors clear local code over premature abstraction.

Do not build generic infrastructure merely because multiple future sites may someday need it.

## 2. Canonical V0 structure

```text
starter/base/
│
├── .github/
│   └── workflows/
│       └── verify.yml
│
├── .claude/
│   └── rules/
│       ├── architecture.md
│       ├── components.md
│       ├── content.md
│       ├── design-system.md
│       └── scope.md
│
├── content/
│   └── site.json
│
├── docs/
│   ├── README.md
│   ├── architecture/
│   │   └── overview.md
│   ├── design-system/
│   │   └── tokens.md
│   ├── accessibility/
│   │   └── conventions.md
│   ├── workflows/
│   │   ├── add-page.md
│   │   ├── add-component.md
│   │   └── verification.md
│   └── deployment/
│       └── status.md
│
├── public/
│
├── scripts/
│   ├── add-block.mjs
│   └── check-routes.mjs
│
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   └── keystatic/
│   │   │       └── [...params]/
│   │   │           └── route.ts
│   │   ├── keystatic/
│   │   │   └── [[...params]]/
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── section.tsx
│   │   │   ├── site-header.tsx
│   │   │   └── site-footer.tsx
│   │   ├── normalized/
│   │   ├── shadcnblocks/
│   │   └── ui/
│   │
│   ├── config/
│   │   └── site.ts
│   │
│   ├── lib/
│   │   ├── content/
│   │   │   ├── index.ts
│   │   │   ├── reader.ts
│   │   │   └── site.ts
│   │   ├── seo/
│   │   │   └── metadata.ts
│   │   ├── navigation.ts
│   │   ├── routes.ts
│   │   └── utils.ts
│   │
│   └── types/
│       └── content.ts
│
├── .env.example
├── .gitignore
├── .nvmrc
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── components.json
├── eslint.config.mjs
├── keystatic.config.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

Provider-specific deployment files may be added once the Cloudflare adapter is selected.

## 3. `src/app/`

Owns routing and route-level integration.

### `src/app/(site)/`

Public website routes only.

Responsibilities:

- route entry points
- route-specific metadata
- server-side content reads
- composition of normalized/layout components

A route may map CMS data into component props, but should avoid becoming a giant presentation component.

### `src/app/api/`

Server/API routes only.

Do not put business/domain helpers here simply because they are server-side.

### `src/app/keystatic/`

Keystatic admin surface only.

It is not part of the public site information architecture and must not appear in the sitemap/navigation.

## 4. `src/components/`

Nothing lives loose at the root of `components/`.

### `layout/`

Site-level structural primitives.

Examples:

- `Section`
- `SiteHeader`
- `SiteFooter`

These components should remain visually restrained and structurally reusable.

### `ui/`

shadcn/ui registry-linked primitives.

Rule: treat as upstream-managed. Prefer composition/wrapping from project-owned code over casual direct modification.

### `shadcnblocks/`

Pristine registry-source blocks.

Rules:

- installed through `npm run block:add`;
- never customize in place;
- preserve as upstream reference;
- copy into `normalized/` before project-specific transformation.

### `normalized/`

Project-owned presentation sections.

A normalized block should:

1. have a semantic name;
2. remove registry demo/sample content;
3. expose typed content props;
4. use project design tokens;
5. remain independent of Keystatic;
6. own presentation/layout behavior;
7. receive content from the route/server integration layer.

Do not create a universal block renderer or page-builder registry in V0.

## 5. `src/lib/content/`

Owns the application-facing content interface.

The rest of the site should not need to know whether content currently comes from Keystatic, JSON files, or another CMS implementation.

### `reader.ts`

Contains the Keystatic reader setup.

### `site.ts`

Reads and returns the site singleton in an application-friendly typed shape.

### `index.ts`

Public exports for the content boundary.

Future domain capabilities may add focused files such as:

```text
content/events.ts
content/people.ts
content/news.ts
```

Do not pre-create them in the base.

## 6. `src/config/`

Owns technical/project configuration that is not editorial content.

Examples:

- environment-derived canonical origin
- non-secret technical defaults
- capability configuration when such a capability actually exists

Do not duplicate editable site identity between `src/config/site.ts` and Keystatic.

Rule of thumb:

- editors should change it → content/CMS;
- developers/operators should change it → config/environment.

## 7. `src/lib/routes.ts`

Owns the canonical public URL set.

It must not become a second navigation definition.

Route metadata may include stable routing concerns, but do not overload it with arbitrary page content or design configuration.

## 8. `src/lib/navigation.ts`

Owns visible navigation composition.

Navigation can reference registered routes but remains a separate concern.

A route may be:

- public and navigated;
- public and intentionally not in primary navigation;
- excluded from public routing surfaces such as admin/API routes.

## 9. `src/lib/seo/`

Owns reusable metadata/SEO helpers.

It must not contain project-specific marketing strategy disguised as infrastructure.

Avoid duplicating canonical site information across helpers.

## 10. `src/types/`

Use for types genuinely shared across multiple modules.

Prefer colocating a type with the code that owns it when it is local.

Do not create a giant `types.ts` dumping ground.

## 11. `content/`

Keystatic-managed editorial data.

The base contains only its minimal site singleton.

Generated capability collections later live here in clearly named directories.

Do not commit secrets or operational configuration to `content/`.

## 12. `docs/`

`docs/` is the single home for durable project documentation.

### `docs/README.md`

Acts as the documentation map.

### `docs/architecture/`

Explains architectural choices and boundaries.

### `docs/design-system/`

Documents the design-system implementation and project-level design decisions.

### `docs/accessibility/`

Documents accessibility conventions and later testing procedures.

### `docs/workflows/`

Short operational instructions for recurring development tasks.

### `docs/deployment/`

Records the selected adapter, the environment it requires, and the acceptance
steps still outstanding. Required by `10-deployment.md` §18.

The base ships `status.md` with no adapter configured — the compatibility
evidence and the unticked acceptance checklist. A project fills it in when it
selects an adapter.

Do not duplicate the same policy in several docs. Prefer one canonical document plus links/references.

## 13. `.claude/rules/`

Contains short scoped implementation rules.

Rules should be operational and concise.

Long explanations belong in `docs/`; Claude rules should point to them rather than copy them wholesale.

V0 files:

- `architecture.md`
- `components.md`
- `content.md`
- `design-system.md`
- `scope.md`

This matches the set in `11-ai-governance.md` §24. The content boundary is a
platform invariant, so it gets its own rule file rather than being folded into
`architecture.md`.

## 14. `scripts/`

Automation exists only for recurring, error-prone tasks that have already earned automation.

V0 includes:

### `check-routes.mjs`

Detect filesystem/route-registry drift.

### `add-block.mjs`

Wrap shadcn CLI behavior so Shadcnblocks source lands in the correct location and accidental global-theme changes are surfaced.

Do not create a general-purpose generator engine inside `starter/base`.

## 15. Forbidden coupling

The following couplings are forbidden in V0:

```text
normalized component → Keystatic
normalized component → Cloudflare APIs
layout component     → CMS implementation
route registry       → page content
navigation           → hard-coded duplicate site URLs
SEO helper           → duplicated site identity
UI primitive         → site-specific content
content model        → presentation-specific Tailwind classes
```

## 16. Adding a page

A new page should normally require:

1. create `src/app/(site)/<route>/page.tsx`;
2. add its URL to `src/lib/routes.ts`;
3. decide explicitly whether it belongs in `navigation.ts`;
4. add/read content through the content boundary if necessary;
5. compose existing or normalized components;
6. run `npm run verify:fast` during implementation;
7. run `npm run verify` before completion.

## 17. Adding a component/block

Preferred workflow:

```text
identify content/UX need
        ↓
review available block patterns
        ↓
install via npm run block:add
        ↓
run registry source unchanged
        ↓
copy to normalized/
        ↓
remove demo content
        ↓
rename semantically
        ↓
define typed props
        ↓
test with inline data
        ↓
connect CMS only after props settle
```

The block is a starting implementation, not the source of the site's product decisions.

## 18. Definition of structural health

A generated project is structurally healthy when a developer or AI agent can answer these questions immediately:

- Where do public routes live?
- Where is the canonical URL registry?
- Where is navigation defined?
- Where is editable content read?
- Where does Keystatic stop and presentation begin?
- Which components may be edited?
- Which registry components are pristine?
- Where are design tokens defined?
- What command proves the project is healthy?
- Where is the architectural rationale documented?
