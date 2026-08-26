# Content rules

Reasoning: `docs/architecture/overview.md` → Content boundary.

## The boundary

```text
route / server component  →  src/lib/content/  →  reader  →  content/
```

Presentation components receive plain typed values and never learn where they
came from. A CMS import outside `src/lib/content/` is a defect.

## Modelling

- The CMS models **meaning**; components model **presentation**. No
  `heroVariant`, `cardColumns`, `sectionPadding` or `headingColor` fields unless
  an editor has a demonstrated need to control them.
- Pages are code. No page-builder schema, no generic `sections[]`, no universal
  `pages` collection.
- **Singleton** for one canonical instance — site configuration, a specific
  page's content. **Collection** for repeated independent records.
- One singleton per page that needs editable content. Not one giant schema for
  every page.

## Schema discipline

- Every field needs a reason: what it means, who edits it, where it is consumed.
  No speculative fields.
- Required by default when the UI cannot render meaningfully without it.
  Optional means genuinely optional content, not "flexible".
- Never duplicate a canonical fact across schemas.
- Derive rather than ask: metadata defaults from title and description, URLs
  from the route layer and a slug, ordering from a real date field. Add a manual
  override only when an editor genuinely needs one.

## Growth

- Add a collection when an enabled capability needs it — never for
  completeness, never "for later".
- Add Markdown (`fields.markdoc`, `extension: "md"`) only for genuine long-form
  content. Simple fields stay simple fields.
- No entity relationships until a domain requires one.
- Editorial images go through Keystatic with explicit `directory` and
  `publicPath` under `public/images/<domain>/`. Structural and UI assets stay in
  code.
