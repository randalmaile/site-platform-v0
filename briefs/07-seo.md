# 07 — SEO

## Status

**V0 platform brief**

SEO infrastructure is part of the platform foundation. Advanced SEO behavior is capability-driven.

---

# 1. Governing principle

> **Every generated site gets technically sound SEO foundations. Domain-specific SEO is added only when the project requires it.**

---

# 2. Base SEO requirements

Every generated site should include:

- Next.js Metadata API usage
- sensible title and description defaults
- canonical URL support
- Open Graph defaults
- `sitemap.ts`
- `robots.ts`
- clean semantic URLs
- route-registry integration where applicable

---

# 3. No generic structured data in the base

The V0 base should not emit generic Schema.org JSON-LD merely because it can.

Do not assume a universal schema such as:

```text
Organization
WebSite
LocalBusiness
```

for every site.

Structured data should be added by a profile or capability when the site type and content justify a specific schema.

Examples:

```text
student organization
research organization
local business
multi-location business
article
event
product
```

The goal is correct structured data, not maximum structured data.

---

# 4. Metadata defaults

Ordinary content fields should supply SEO defaults.

Example:

```text
title
  ↓
default metadata title

description / summary
  ↓
default metadata description
```

This reduces duplicate editorial work.

---

# 5. Optional SEO overrides

SEO overrides should be added only to pages/content types that genuinely benefit from them.

Possible overrides:

```text
seoTitle
seoDescription
socialImage
```

Do not automatically add SEO override fields to every CMS schema.

The default policy is:

> **automatic metadata first; overrides when needed**

---

# 6. Canonical URLs

Canonical URLs should be derived from:

- project site configuration
- route registry
- content slugs

Do not store internal canonical URLs manually in CMS content unless a project has an exceptional requirement.

---

# 7. Open Graph

The base should provide sensible Open Graph defaults derived from canonical site/page content.

Project-specific social imagery and richer metadata may be added later.

---

# 8. Sitemap

`sitemap.ts` should derive known public routes from the route registry and domain collections where required.

The sitemap should not become a manually maintained duplicate route list.

---

# 9. Robots

`robots.ts` should exist in the base.

Default behavior should be safe and simple.

Environment-specific indexing rules may be added when needed.

---

# 10. Analytics is not SEO foundation

Analytics is a separate optional integration capability.

The SEO brief does not require:

```text
GA4
Plausible
Cloudflare Web Analytics
other analytics providers
```

A generated project should receive analytics only when selected.

---

# 11. Advanced SEO is capability-driven

Examples of non-foundational SEO capabilities:

- local-business structured data
- location pages
- service/location relationships
- article structured data
- event structured data
- product structured data
- advanced social metadata
- programmatic metadata generation
- search-console tooling

These should be introduced by profiles or domain capabilities rather than the base starter.

---

# 12. Definition of done

The base SEO foundation is healthy when:

- every public page has a meaningful title and description
- defaults come from canonical content
- override fields are optional and purposeful
- canonical URLs are deterministic
- sitemap generation follows application routes
- robots configuration exists
- Open Graph defaults exist
- no irrelevant Schema.org graph is emitted
- analytics remains optional

---

# 13. Governing rule

> **Make good SEO automatic. Add specialized SEO only when the domain requires it.**
