# Site Platform V0

This repository is the generation system for small, independently owned
websites. It contains the platform contracts and the neutral application that
future projects inherit; it is not itself a finished website.

## Current state

Milestone 1 is complete:

- the neutral Next.js base lives in [`starter/base/`](starter/base/);
- the eleven V0 architecture briefs are accepted;
- Cloudflare Workers deployment through vinext has passed the base's full
  Keystatic GitHub-mode editing acceptance test;
- no product profile, audience, sitemap, brand, or finished page design has
  been added.

Start with [`starter/base/README.md`](starter/base/README.md) to run or extend
the application.

## Repository map

| Path | Purpose |
| --- | --- |
| [`briefs/`](briefs/) | Durable platform contracts and their source-of-truth rules |
| [`starter/base/`](starter/base/) | Executable neutral template inherited by generated sites |
| [`prompts/`](prompts/) | Temporary handoffs for unfinished milestones; currently none |
| [`MAINTENANCE.md`](MAINTENANCE.md) | Open pins, deferrals, and evidence-based retest triggers |

The briefs define intent, the starter and its verification commands provide
executable evidence, starter documentation explains operation, and prompts
expire when their milestone is complete. See [`briefs/README.md`](briefs/README.md)
for the full hierarchy.

## Verify the base

```bash
cd starter/base
npm install
npm run verify
```

Cloudflare runtime verification is intentionally separate from the normal
Next.js completion gate. Its commands and environment requirements are in
[`starter/base/docs/deployment/status.md`](starter/base/docs/deployment/status.md).

## Next platform work

Add a profile or project-creation workflow only when its product requirements
are known. Do not add speculative capabilities to the base in anticipation of
future sites.
