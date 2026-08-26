# Platform briefs

The briefs are the durable architectural contracts for Site Platform V0. They
describe what every generated project must preserve and why. They are not build
logs, deployment runbooks, or task prompts.

## Authority

When sources disagree, use this order:

1. **Briefs** define intentional platform invariants and exclusions.
2. **`starter/base` plus verification** is the executable implementation of
   those contracts.
3. **Starter documentation** explains how to operate that implementation.
4. **`MAINTENANCE.md`** records unresolved pins, deferrals, and retest triggers.
5. **Prompts** are temporary handoffs for unfinished milestones and are never
   authoritative.

A mismatch between a brief and the starter is a defect to resolve explicitly.
Do not silently declare either side correct: decide whether the contract or the
implementation is wrong, update the appropriate source, and verify the result.

## What belongs in a brief

- durable boundaries and ownership rules
- required or forbidden architectural behavior
- capability and dependency policy
- acceptance thresholds
- intentional exclusions
- the rationale needed to make future changes safely

Operational commands, credentials, current deployment IDs, debugging history,
and step-by-step setup belong in `starter/base/docs/`. Temporary uncertainty
belongs in `MAINTENANCE.md`.

## Index

| Brief | Contract |
| --- | --- |
| [01 — Platform Foundation](01-platform-foundation.md) | Base technology, invariants, exclusions, and completion gate |
| [02 — Project Structure](02-project-structure.md) | File ownership, placement, and forbidden coupling |
| [03 — Content Architecture](03-content-architecture.md) | Content modeling and the application-facing boundary |
| [04 — Design System](04-design-system.md) | Neutral token architecture and visual-system ownership |
| [05 — Component Strategy](05-component-strategy.md) | Component intake, provenance, and normalization |
| [06 — Keystatic](06-keystatic.md) | CMS role, storage policy, schema rules, and editing acceptance |
| [07 — SEO](07-seo.md) | Metadata, canonical URLs, sitemap, and capability limits |
| [08 — Accessibility](08-accessibility.md) | Accessibility invariants and completion expectations |
| [09 — Testing and Verification](09-testing.md) | Fast and completion gates, CI, and test scope |
| [10 — Deployment](10-deployment.md) | Cloudflare boundary, vinext policy, and deployed acceptance |
| [11 — AI Governance](11-ai-governance.md) | Rules for AI-assisted platform and project work |

## Contract enforcement

| Contract | Primary enforcement |
| --- | --- |
| Content access stays behind `src/lib/content/` | Project structure, lint/review, `npm run verify` |
| Public routes match the registry | `npm run check:routes` |
| Project-owned code remains typed | `npm run typecheck` |
| Application remains buildable | `npm run verify` |
| Worker bundle remains compatible | `npm run build:vinext` |
| Deployed editing works end to end | Deployment acceptance runbook in `starter/base/docs/deployment/status.md` |
| Starter remains neutral | Brief review and final diff review |

Not every contract can or should become an automated test. Negative product and
design constraints still require deliberate review.

## Lifecycle

These files describe the accepted V0 architecture. Update a brief in the same
change that intentionally alters one of its invariants. Record a deferred
decision in `MAINTENANCE.md` instead of weakening a contract with speculative
language.

Task prompts may cite the briefs but must not repeat them wholesale. Once a
milestone is complete, remove its prompt from the active `prompts/` directory;
Git history is the archive.
