# 06 — Keystatic

## Status

**V0 platform brief**

Keystatic is the default CMS for Site Platform V0.

This brief defines how generated sites should use Keystatic without allowing Keystatic to become the application architecture.

It implements the rules defined in `03-content-architecture.md`.

---

# 1. Governing principle

> **Keystatic is the default editorial interface and storage implementation. It is not the domain model, page builder, or presentation layer.**

The application should remain understandable even if Keystatic were replaced later.

---

# 2. Standard storage mode

## Production and normal project operation

Use **GitHub mode** as the standard platform choice.

Conceptually:

```text
Keystatic Admin
      ↓
GitHub authentication
      ↓
repository content
      ↓
commit
      ↓
runtime content refresh or deployment pipeline
```

Editors using GitHub mode require appropriate write access to the repository.

The deployed editor must be configured with both the repository and, when the
application is not at the repository root, the application path prefix. A save
that reaches the wrong same-named path is a failed integration even if GitHub
accepted the commit.

This is an intentional V0 tradeoff because the platform is aimed initially at developer-managed sites and small organizations where Git-backed content provides a simple, inspectable source of truth.

## Local development

The base defaults to local mode under `npm run dev`, where Keystatic reads and
writes the checked-out `content/` directory. Local development must not require
production GitHub or Cloudflare credentials.

However, generated projects should be configured and documented with **GitHub mode as the intended deployed editing workflow**.

Do not introduce Keystatic Cloud as a default V0 dependency.

A future profile or client requirement may choose a different storage strategy.

---

# 3. Content storage formats

Use the simplest format appropriate to the content.

## Structured content

Use **JSON by default** for structured singletons and collections that do not require long-form rich content.

Examples:

```text
content/
  site.json
  about.json
  people/
  events/
```

Structured fields may include:

```text
title
description
date
status
email
URL
image path
SEO override
```

## Long-form content

Use **Markdown-capable Keystatic fields** when content genuinely benefits from authorable long-form formatting.

Examples:

```text
news article
project write-up
resource page
long-form About content
documentation
```

AI-generated Markdown is a desirable workflow and should be easy to paste into or generate for editable content.

Keystatic's Markdoc or MDX field may be configured to use `.md` files when the project needs Markdown-backed long-form content.

Prefer Markdown semantics over rich custom component blocks.

---

# 4. Rich-content policy

Markdown is supported intentionally.

This does **not** mean every text field should become a Markdown document.

Use ordinary structured fields for simple content:

```text
title
subtitle
summary
short description
button label
date
location
```

Use Markdown for content that benefits from:

```text
multiple paragraphs
headings
lists
links
emphasis
code
long-form AI-generated content
```

Avoid introducing:

```text
embedded arbitrary React components
layout blocks
page-builder controls
complex custom Markdoc tags
```

unless a specific content requirement earns that complexity.

The default should be:

> **Markdown for editorial richness; React for layout and presentation.**

---

# 5. Markdown implementation

When Keystatic rich content is needed, prefer a restrained Markdoc/Markdown configuration.

Example conceptual schema:

```ts
body: fields.markdoc({
  label: "Body",
  extension: "md",
})
```

or another supported Keystatic Markdown-capable configuration appropriate to the project.

The goal is that long-form content is stored as readable source files rather than opaque serialized data.

A typical long-form collection may conceptually store:

```text
content/news/
  science-fair-results/
    index.md
```

with metadata represented as frontmatter when appropriate.

Do not require Markdoc/Markdown dependencies in a project that has no long-form content capability.

---

# 6. Git-friendly content

The repository is the source of truth.

Content should remain:

- readable in Git
- reviewable in pull requests
- diffable
- recoverable through Git history
- editable by AI tooling
- editable through Keystatic
- deployable through the normal repository workflow

This is one of the primary reasons GitHub-mode Keystatic is the V0 default.

---

# 7. Content directories

Use predictable content organization.

Example:

```text
content/
├── site.json
├── home.json
├── about.json
│
├── events/
├── people/
├── news/
└── projects/
```

Only create directories required by enabled capabilities.

Do not create empty domain directories merely to advertise future capabilities.

Page-specific singleton content should remain explicit rather than living in a universal pages collection.

---

# 8. Editorial images

Editorial images should normally be managed through Keystatic.

Use explicit predictable directories.

Convention:

```text
public/images/<domain>/
```

Examples:

```text
public/images/site/
public/images/pages/
public/images/people/
public/images/events/
public/images/projects/
public/images/news/
```

Configure both `directory` and `publicPath` explicitly.

Conceptually:

```ts
fields.image({
  label: "Image",
  directory: "public/images/events",
  publicPath: "/images/events/",
})
```

Do not rely on implicit image-storage behavior when a stable application path can be defined explicitly.

---

# 9. Uploaded files

Editable downloadable files should use a similarly predictable convention:

```text
public/files/<domain>/
```

Examples:

```text
public/files/resources/
public/files/forms/
public/files/documents/
```

Only introduce uploaded-file infrastructure when the site actually needs downloadable editorial assets.

---

# 10. Structural assets

Not every asset belongs in Keystatic.

Structural and application assets may remain code-managed.

Examples:

```text
UI icons
decorative SVGs
technical assets
application-specific graphics
```

Brand assets may be CMS-managed or code-managed depending on whether editors are expected to replace them.

Do not force an asset into Keystatic solely because Keystatic can store it.

---

# 11. Reader boundary

Keystatic reader creation must be centralized.

Recommended structure:

```text
src/lib/content/
├── reader.ts
├── site.ts
└── <domain>.ts
```

Conceptually:

```text
keystatic.config.ts
        ↓
reader.ts
        ↓
site.ts / events.ts / people.ts
        ↓
pages
        ↓
presentation components
```

`reader.ts` owns Keystatic reader mechanics.

Domain content modules own retrieval, sorting, filtering, and normalization when required.

Presentation components receive plain typed values and must not import Keystatic.

---

# 12. Do not over-abstract the reader

The reader boundary should stay thin.

Do not create layers such as:

```text
Keystatic
  ↓
Adapter
  ↓
Repository
  ↓
Service
  ↓
Provider
  ↓
Mapper
  ↓
Component
```

unless real complexity later justifies them.

For simple page singleton content:

```text
page
 ↓
small content loader
 ↓
reader
```

is sufficient.

For reusable domain collections:

```text
page/component
      ↓
domain content module
      ↓
reader
```

is appropriate.

---

# 13. Schema organization

Start simple.

## Small project

Keep schemas in:

```text
keystatic.config.ts
```

when the file remains easy to understand.

This is the V0 default.

## Extract only when complexity earns it

If the configuration becomes difficult to navigate, extract domain schemas.

Possible future structure:

```text
src/cms/
└── schemas/
    ├── event.ts
    ├── person.ts
    └── project.ts
```

Then:

```text
keystatic.config.ts
→ storage + configuration + schema composition
```

Do not create a modular schema hierarchy in the base starter merely because a future large project might eventually need one.

---

# 14. Schema strictness

Schemas should be fairly strict.

If the application requires a value to render meaningful UI, require it in the schema.

Examples:

```text
title
name
date
page heading
```

Optional fields should represent real optional content states.

Avoid excessive editor flexibility that pushes validation problems into presentation code.

---

# 15. Slugs

Use Keystatic slug fields for individually addressable collection entries where appropriate.

Conceptually:

```text
title/name
    ↓
stable slug
    ↓
application route construction
```

The CMS should not store arbitrary internal route URLs when the application can derive them from the slug and route registry.

External URLs remain valid editable content when they are genuinely external references.

---

# 16. SEO

Keystatic should not require duplicate SEO entry for every piece of content.

Normal content fields provide metadata defaults.

Example:

```text
title
  ↓
default SEO title

description / summary
  ↓
default meta description
```

Optional overrides may include:

```text
seoTitle
seoDescription
socialImage
```

Use overrides only when needed.

---

# 17. Relationships

Do not add generalized relationship infrastructure to the base Keystatic configuration.

Add relationships only when an enabled capability needs them.

Examples:

```text
Person ↔ Project
Person ↔ Location
Service ↔ Location
```

The profile or project content brief should explain why the relationship exists.

---

# 18. Presentation controls

Keystatic must not become a design editor.

Avoid fields such as:

```text
heroLayout
backgroundColor
cardColumns
sectionSpacing
fontSize
componentVariant
```

unless a specific project explicitly requires editorial control over them.

Appropriate editorial state fields may include:

```text
featured
published
status
category
```

when those fields have content meaning.

---

# 19. V0 base schema

The base starter should prove the CMS boundary with one small site singleton.

Recommended fields:

```text
Site
├── name
├── shortName
├── description
├── defaultSeoTitle
└── defaultSeoDescription
```

No generic page collection.

No domain collections.

No relationship framework.

No long-form Markdown field in the base unless the base actually needs long-form content.

Markdown support is a standard platform capability that profiles/projects may enable.

---

# 20. AI and Markdown

Markdown is intentionally a first-class editorial workflow because it works well with AI-assisted development and content creation.

Claude or other AI tools may:

- draft Markdown content
- revise Markdown content
- create structured outlines
- edit frontmatter where permitted
- help migrate prose into Markdown

AI-generated Markdown must still follow the project's content strategy and should not independently determine product, audience, CTA, information architecture, or visual-design decisions when those decisions belong to the student/client.

The CMS should make AI-generated content easy to inspect and edit rather than hiding it in proprietary formats.

---

# 21. GitHub-mode operational requirements

A project using GitHub mode must document:

- editor repository and path-prefix configuration
- runtime content-reader repository, ref, and path-prefix configuration
- which values are public build configuration and which are runtime secrets
- Keystatic authentication setup
- editor repository permissions
- local development expectations
- production `/keystatic` route expectations
- deployment compatibility
- content commit behavior

These operational details belong in project/deployment documentation and must not leak into presentation components.

The public content reader and Keystatic GitHub storage are separate
integrations. They may use different credentials and configuration paths;
proving one does not prove the other.

---

# 22. Deployment acceptance criteria

Before a deployment adapter is declared supported for the platform, verify the complete Keystatic workflow:

```text
□ application deploys
□ /keystatic loads
□ GitHub authentication succeeds
□ authorized editor can open content
□ editor opens the intended repository path
□ content can be changed
□ image/file upload works when enabled
□ save creates/updates repository content
□ commit reaches the intended GitHub path
□ runtime content refresh or deployment sees the change
□ public site renders the updated content
```

This is especially important when adopting or changing the Cloudflare adapter.

---

# 23. Explicitly forbidden patterns

Do not:

- import Keystatic APIs inside presentation components
- use Keystatic as a universal page builder
- add schemas for disabled capabilities
- make all text rich content
- add arbitrary layout controls to content schemas
- duplicate canonical site configuration
- introduce relationship fields without a domain requirement
- store internal URLs when routes can be derived
- create schema abstraction layers before they are needed
- make Keystatic storage mechanics part of domain/presentation code

---

# 24. Definition of done

A generated project's Keystatic architecture is healthy when:

- GitHub mode is the intended editing workflow
- structured content is simple and Git-readable
- JSON is used where appropriate
- Markdown is easy to introduce for genuine long-form content
- AI-generated Markdown can be incorporated cleanly
- images use predictable domain directories
- Keystatic reader mechanics live in one boundary
- components remain Keystatic-agnostic
- schemas are strict and understandable
- `keystatic.config.ts` remains simple until extraction is justified
- only enabled capabilities have schemas
- page composition remains code-driven
- the repository remains the inspectable source of truth

---

# 25. Governing rule

> **Use Keystatic to make content easy to edit. Use Git to keep content transparent. Use Markdown when prose needs richness. Keep application architecture in the application.**
