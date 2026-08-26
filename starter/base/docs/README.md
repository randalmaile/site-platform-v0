# Documentation

The durable reasoning behind this project. Operational instructions live in
`workflows/`; everything else explains *why* a boundary exists so it survives
contact with the next change.

## Map

| Document | What it answers |
| --- | --- |
| [`architecture/overview.md`](architecture/overview.md) | Where do routes, content and configuration live, and why are they separated? |
| [`design-system/tokens.md`](design-system/tokens.md) | What are the tokens, and how do I rebrand this site? |
| [`accessibility/conventions.md`](accessibility/conventions.md) | What must be true before a component is done? |
| [`workflows/add-page.md`](workflows/add-page.md) | How do I add a public page? |
| [`workflows/add-component.md`](workflows/add-component.md) | How do I bring in a Shadcnblocks block, or write a component? |
| [`workflows/verification.md`](workflows/verification.md) | What proves the project is healthy? |
| [`deployment/status.md`](deployment/status.md) | Which Cloudflare adapter, and what still needs verifying? |

`../CLAUDE.md` and `../.claude/rules/` are the short operational form of these
documents, for AI agents. They point here rather than restating — one canonical
explanation per rule.

## Conventions

- One home per policy. If something is written in two places, one of them is
  about to go stale.
- Update these documents when a permanent convention changes — not after every
  feature.
