# site-platform — platform repository

You are maintaining the **generation system**, not a website.

A different `CLAUDE.md` lives inside `starter/base/`. That one governs work on a *generated site*.
Do not conflate the two roles: here you change what every future site inherits.

## What is here

```text
briefs/        durable architectural contracts — authoritative
prompts/       temporary handoffs for unfinished milestone work
starter/base/  the neutral base application every generated site starts from
MAINTENANCE.md what the platform is waiting on — deferred decisions and pins
```

## Rules

- **The briefs win.** `briefs/01`–`11` are contracts, not suggestions. If a prompt, a reference
  project, or a framework convention disagrees with a brief, the brief is right. If a brief is
  wrong, say so and change the brief — do not quietly diverge in code.
- **The starter is executable evidence.** A mismatch between a brief and `starter/base` is a defect,
  not permission to pick the convenient source. Decide which side is wrong, update it explicitly,
  and verify the result. See `briefs/README.md` for source ownership.
- **Prompts expire.** They are implementation handoffs, never architecture or documentation. Remove
  a completed prompt from the active `prompts/` directory; Git history is the archive.
- **`starter/base` is a template, not a site.** It must contain no organization, audience, sitemap,
  brand, palette, typeface, imagery, CTA, or finished page design. Those are decisions the eventual
  project owner makes. See `briefs/01-platform-foundation.md` §14 for the exclusion list.
- **Dependency discipline is the point.** Nothing enters `starter/base` because a future project
  might want it. See `briefs/01-platform-foundation.md` §7.
- **Changing an invariant is a brief change.** Route registry, content boundary, component ownership,
  token architecture, verification gate, deployment boundary — altering any of these means updating
  the brief in the same change, not just the code.
- **Deferring something is a `MAINTENANCE.md` entry.** A version we cannot take, a capability
  postponed, a decision blocked on evidence — record it with its trigger and the command that tests
  it. A deferral that lives only in a code comment cannot reach the template. Walk the open items at
  each milestone.
- **Verify inside the starter.** `cd starter/base && npm run verify` is the gate. Run it before
  calling platform work complete.

## Reference implementation

`~/Projects/leroch-lab` is a mature production site built on the same patterns. Learn from its
route guard, block wrapper, and registry configuration. Do **not** inherit its content, routes,
design system, motion stack, test suite, or deployment configuration.
