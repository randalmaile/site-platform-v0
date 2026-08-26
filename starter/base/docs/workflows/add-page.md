# Adding a page

Six steps. Steps 1 and 2 must happen in the same change — that is what the route
guard enforces.

## 1. Create the route

```text
src/app/(site)/<route>/page.tsx
```

Inside `(site)`, so it inherits the site header, footer and `<main>` landmark.
Route groups contribute nothing to the URL, so this is `/<route>`.

## 2. Register the URL

Add it to `PUBLIC_ROUTES` in `src/lib/routes.ts`. This is what puts the page in
the sitemap. Skipping it means shipping a page nothing ever links a crawler to —
`npm run check:routes` fails rather than letting that happen.

## 3. Decide about navigation

Add it to `primaryNav` in `src/lib/navigation.ts`, or decide deliberately not
to. A page can be public and unlinked — a policy page, a landing page reached
from elsewhere. Registry and navigation are separate decisions on purpose.

## 4. Content, if the page has editable copy

Add a singleton to `keystatic.config.ts` scoped to this page, a loader in
`src/lib/content/`, and read it from the page — a server component. Pass plain
props to presentation components. Do not import Keystatic anywhere else.

Skip this entirely if the page has no editable content.

## 5. Compose

Wrap content in `Section`. Use existing components, or normalize a block
(`add-component.md`), or write a custom one. Set metadata with `buildMetadata`:

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return buildMetadata({ site, title: "About", path: "/about" });
}
```

Pass only what differs from the site defaults.

## 6. Verify

`npm run verify:fast` while working. `npm run verify` before you are done.

---

## Example

```tsx
// src/app/(site)/about/page.tsx
import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { getSite } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return buildMetadata({ site, title: "About", path: "/about" });
}

export default function AboutPage() {
  return (
    <Section>
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
    </Section>
  );
}
```

```ts
// src/lib/routes.ts
export const PUBLIC_ROUTES = ["/", "/about"] as const;
```

## Dynamic routes

`scripts/check-routes.mjs` understands static routes only, and fails loudly when
it meets a `[slug]`. The first dynamic route in a project means extending that
script so it verifies the registry covers the segment. Do not delete the check
to make the error go away.
