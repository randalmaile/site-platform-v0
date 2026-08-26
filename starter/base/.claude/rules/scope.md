# Scope rules

## Do what was asked

Implement the request. Report adjacent problems you notice — do not silently fix
them, and do not widen the work because something nearby looks improvable.

Match effort to change size. A copy edit does not need a plan; a new content
model, integration, route convention or shared abstraction does.

## Dependencies

Before adding a package, answer: what problem does it solve, does the existing
stack already solve it, is it justified by this feature, what does it cost to
maintain? Present the tradeoff for anything non-obvious before installing it.

If the application works without it, do not install it.

## Architectural changes need agreement

Treat these as decisions to raise, not implement: a new content model, a new
cross-domain abstraction, a broad new dependency, a new integration, a new route
or design-system convention, a new deployment mechanism, a new testing
framework, a new CMS or storage strategy.

If a request conflicts with an invariant in `CLAUDE.md`, name the conflict.
Do not route around the architecture.

## Verification is not negotiable

Run `npm run verify` before calling meaningful work done. Fix what fails.

Never make a check pass by weakening it: no broad `any`, no `@ts-ignore`, no
disabled lint rule, no removed route check, no relaxed schema, no commented-out
code. If a failure genuinely needs an architectural exception, say so explicitly
rather than burying it.

## Documentation

Update `docs/` when a permanent convention, boundary or workflow changes. Not
after every feature — a new component that follows existing rules, a content
edit or a styling fix documents nothing new.

## Product and design ownership

Purpose, audience, objectives, information architecture, content strategy,
branding, colour, typography, imagery and final visual direction belong to the
project owner. Explore, suggest and critique freely; do not decide silently, and
do not manufacture an organisation's identity because implementation would be
easier if it already existed.
