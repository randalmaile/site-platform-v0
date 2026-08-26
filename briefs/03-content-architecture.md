# 03 — Content Architecture

## Status

**V0 platform brief**

This document defines how generated sites should model, store, access, and present editable content.

It is intentionally **CMS-agnostic**. Keystatic is the default CMS implementation for V0, but the application architecture must not depend on Keystatic-specific APIs outside the content boundary.

---

# 1. Purpose

The platform should provide enough content structure to make sites maintainable and editable without turning every site into a generic page-builder application.

The governing principle is:

> **Model content according to meaning and reuse. Keep page composition in code. Add abstraction only when it solves a real problem.**

The platform must avoid two opposite failures:

1. **Hard-coded editorial content scattered through components**, making updates difficult.
2. **Over-generalized content infrastructure**, where every field, page, and component is forced through unnecessary abstractions.

---

# 2. Core invariants

All generated projects must follow these rules unless a project brief explicitly overrides them.

## 2.1 Pages are code-driven

Routes and page composition remain application code.

A page is responsible for:

- selecting the content it needs
- composing presentation components
- determining layout
- determining responsive behavior
- determining component order
- applying design-system conventions

The CMS must not become a universal page builder.

Avoid generic schemas such as:

```text
Page
 └─ sections[]
      ├─ hero
      ├─ card-grid
      ├─ stats
      ├─ gallery
      └─ cta
```

unless a future project has a demonstrated editorial requirement for such flexibility.

---

## 2.2 Editable editorial content normally belongs in the CMS

Content that a site owner or editor may reasonably need to change should normally be managed through the CMS.

Examples:

- headings
- body copy
- descriptions
- images
- biographies
- event information
- articles/news
- organization contact information
- social links
- SEO descriptions
- resource links

Technical structure remains in code.

Examples:

- routes
- component composition
- design tokens
- feature configuration
- layout rules
- technical constants
- dependency configuration

---

## 2.3 Presentation components receive plain typed data

Presentation components must not know how content is stored.

Preferred:

```tsx
<AboutIntro
  heading={about.heading}
  body={about.body}
/>
```

Avoid:

```tsx
// Presentation component importing CMS/storage APIs directly
import { createReader } from "@keystatic/core/reader";
```

The storage implementation belongs behind the content boundary.

---

## 2.4 Content access abstraction must be purposeful

Do not create a universal repository/service abstraction merely because content comes from a CMS.

Centralized access is most valuable when content:

- is reused by multiple pages or components
- represents a domain entity
- requires sorting/filtering/transformation
- is shared across routes
- needs a stable application-facing type
- may later come from a different source

Examples:

```text
events
people
news
projects
site configuration
```

One-off page content may use a thin page-specific loader.

The rule is:

> **Abstract storage mechanics, not every individual content read.**

---

# 3. Content categories

The platform recognizes several content categories.

## 3.1 Canonical site configuration

Each generated project should have one canonical source for site-wide editable information.

Typical fields may include:

```text
site name
short name
description
contact email
social links
logo references
default SEO title
default SEO description
default social image
```

The exact schema should remain small and project-appropriate.

Do not duplicate site-level information across multiple page schemas.

---

## 3.2 Page singletons

When a route has editable page-specific content, prefer a small explicit singleton for that page.

Example:

```text
content/
  home.json
  about.json
  join.json
```

Each singleton should contain only content that belongs to that page.

Avoid one enormous generic `pages.json` schema intended to represent every current and future page.

Benefits:

- schemas remain understandable
- validation can be specific
- unused fields do not accumulate
- changes remain localized
- page requirements stay explicit

---

## 3.3 Collections

Use collections for repeated entities with independent records.

Examples may include:

```text
people
events
news
projects
resources
locations
services
```

A collection should exist only when the enabled site capabilities require it.

The base platform must not pre-create collections for hypothetical future needs.

---

## 3.4 External data

External APIs or integrations are not CMS content.

When a capability consumes external data, that data should enter the application through the relevant integration/domain boundary.

Examples:

```text
external reviews
scheduling availability
CRM data
commerce data
maps/provider data
```

Do not mirror external data into the CMS unless a real product requirement justifies doing so.

---

# 4. Singleton vs collection decision rule

Use a **singleton** when:

- there is one canonical instance
- the content belongs to a specific route or global configuration
- editors should not create arbitrary additional records

Use a **collection** when:

- there are multiple independent records
- records may be added or removed over time
- records may be sorted, filtered, grouped, or individually addressed
- the content represents a domain entity

Do not choose a collection merely because the CMS makes collections convenient.

---

# 5. Content vs presentation

CMS schemas should describe **what content means**, not how a specific component renders it.

Good fields:

```text
title
summary
description
date
status
category
image
alt text
body
external URL
featured
```

A field such as `featured` is acceptable when it represents a genuine editorial/content state.

Avoid presentation-heavy fields such as:

```text
heroVariant
cardColumns
headingColor
sectionPadding
imagePosition
backgroundStyle
```

unless editors have a demonstrated requirement to control those choices.

The default rule is:

> **CMS models meaning. Components model presentation.**

---

# 6. Schema discipline

Schemas should be intentionally strict and minimal.

## 6.1 Required by default when the UI depends on the field

If a UI cannot render correctly or meaningfully without a field, make the field required.

Examples:

```text
event title
event date
person name
article title
page heading
```

Optional fields should represent genuinely optional content states.

Do not make fields optional merely to make the schema feel flexible.

---

## 6.2 Every field needs a reason to exist

Before adding a schema field, identify:

1. what the field means
2. who edits it
3. where it is consumed
4. whether it is required
5. whether the information already exists elsewhere

Avoid speculative fields added because they “might be useful later.”

If a future capability requires a new field, add it when that capability is implemented.

---

## 6.3 Do not duplicate canonical data

Information with one canonical meaning must have one canonical source.

Examples:

```text
organization name
contact email
social profile URL
default SEO description
```

Pages and components should consume the canonical value rather than maintaining copies.

---

## 6.4 Avoid manual fields when behavior can be derived reliably

Prefer deterministic behavior when an editor-maintained field would merely duplicate information already present.

Examples:

- derive default metadata from page title/description
- derive URLs from route/domain configuration
- derive ordering from date when date is the real ordering rule
- derive labels from canonical entities when appropriate

Add manual override fields only when editors genuinely need to override the derived behavior.

---

# 7. SEO content

SEO metadata should normally be generated from ordinary content fields.

Default behavior:

```text
page/content title
        ↓
default SEO title

page/content description
        ↓
default meta description
```

Optional overrides may be provided when required:

```text
seoTitle
seoDescription
socialImage
```

Do not require editors to enter duplicate SEO content for every page.

The platform should favor:

> **automatic defaults + deliberate overrides**

---

# 8. Slugs and URLs

For collections with individually addressable records, use stable content slugs.

The content system should normally derive the slug from a canonical field such as the record title/name.

Example:

```text
Project title
    ↓
project slug
```

The CMS should not store arbitrary internal application URLs when the route/domain layer can construct them.

Route structure belongs to the application.

External URLs may be stored when they are actual editorial content.

---

# 9. Images and media

Editorial images should normally be selectable/manageable through the CMS.

Examples:

```text
page photography
person headshots
event images
project images
news images
```

Image schemas should include meaningful accessibility metadata when the image conveys information.

Structural assets may remain outside the CMS.

Examples:

```text
application icons
decorative SVGs
technical UI assets
certain brand assets
```

The exact division may vary by project, but editorial media should not require code changes to update.

---

# 10. Rich text

Rich-text infrastructure is **not** part of the permanent platform foundation.

Use simple structured fields when they are sufficient.

Examples:

```text
heading
summary
paragraphs
lists
links
```

Introduce Markdown/rich-content fields only when a real content requirement needs them, such as:

- long-form articles
- complex editorial pages
- documentation/resources
- content requiring inline formatting

Do not add Markdoc or another rich-content rendering layer simply because the CMS supports it.

The platform should prefer the simplest content representation that adequately serves the content.

---

# 11. Relationships

Relationships between content entities are **capability-driven**, not foundational.

Do not create a general relationship model in the base starter.

Introduce relationships when a specific project/profile requires them.

Examples:

```text
Person ↔ Project
Person ↔ Location
Service ↔ Location
Person ↔ Service
```

A relationship must represent a genuine domain relationship, not merely make querying convenient.

---

# 12. Content access layer

The application should expose content through `src/lib/content/`.

Typical structure:

```text
src/lib/content/
  index.ts
  site.ts
  <domain>.ts
```

The exact number of files should grow with actual capabilities.

Possible responsibilities include:

- reading content
- converting CMS/storage values into application-facing values
- sorting
- filtering
- resolving relationships
- supplying derived values
- normalizing optional fields
- enforcing application-facing types

Avoid building a generic repository framework before one is needed.

A page-specific singleton may use a thin dedicated loader.

---

# 13. Application-facing types

Presentation components should consume plain TypeScript values.

CMS-specific field types should not leak throughout the application.

When useful, define application-facing domain types such as:

```ts
type Event = {
  slug: string;
  title: string;
  date: string;
  description: string;
};
```

Do not duplicate types unnecessarily when TypeScript inference already provides a clean and stable boundary.

Type abstraction should improve clarity, not add ceremony.

---

# 14. Capability-driven schemas

Content schemas must follow enabled project capabilities.

Example:

```text
Base
  site singleton

Student organization
  + events, if required
  + people, if required
  + projects, if required
  + news, if required

Business
  + services, if required
  + testimonials, if required
  + staff, if required
```

A project that does not use a capability must not receive its content model merely for completeness.

---

# 15. Explicitly forbidden architecture

The following patterns are not part of V0.

## Universal page builder

Do not create:

```text
pages
  → arbitrary sections
      → arbitrary block variants
```

## Giant generic content schema

Do not combine unrelated pages and entities into one schema because it is technically possible.

## CMS inside presentation components

Presentation components may not directly depend on CMS APIs.

## CMS-controlled design system

Do not allow editorial content to become the source of truth for typography, spacing, color systems, or component architecture.

## Speculative relationships

Do not add entity relationships until the domain requires them.

## Rich-text everywhere

Do not default all editable text to a rich-document field.

## Premature repository abstraction

Do not introduce repository/service/provider layers for simple one-off content access without a demonstrated reason.

---

# 16. Example page flow

A code-driven About page may look conceptually like:

```text
app/about/page.tsx
       ↓
getAboutContent()
       ↓
CMS boundary
       ↓
about singleton

page.tsx
       ↓
AboutIntro props
MissionSection props
CTA props
```

The page determines composition.

The content system provides editable values.

The presentation components remain storage-agnostic.

---

# 17. Example collection flow

A reusable Events domain may look conceptually like:

```text
content/events/*
       ↓
CMS reader
       ↓
src/lib/content/events.ts
       ↓
sort/filter/normalize
       ↓
Event[]
       ↓
page/component props
```

The additional abstraction is justified because Events is a reusable domain collection rather than a one-off page field.

---

# 18. Definition of done

A project's content architecture is healthy when:

- editable editorial content can be changed without editing presentation code
- page composition remains explicit in React
- presentation components do not import CMS APIs
- site-wide information has one canonical source
- schemas contain only fields with a clear purpose
- required fields match real UI requirements
- page-specific editable content uses explicit singletons
- repeated domain entities use collections
- SEO metadata has sensible automatic defaults
- internal URLs are controlled by the route/domain layer
- editorial images are CMS-manageable
- rich text appears only where needed
- entity relationships appear only where needed
- disabled capabilities do not leave unused schemas behind
- the content layer is understandable without a generic framework

---

# 19. V0 base requirements

The V0 base starter should initially contain only the minimum content architecture required to prove the boundary.

Recommended initial content model:

```text
Site singleton
  name
  shortName
  description
  defaultSeoTitle
  defaultSeoDescription
```

No page-builder schema.

No generic page collection.

No domain collections.

No entity relationships.

No rich-text framework.

Profiles and project decisions add these later.

---

# 20. Governing principle

> **Content architecture should make editing easy and application code clear without making the CMS the application architecture.**
