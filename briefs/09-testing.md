# 09 — Testing and Verification

## Status

**V0 platform brief**

The V0 verification system should be deliberately lightweight.

The goal is to create a reliable engineering habit without burdening simple projects with unnecessary test infrastructure.

---

# 1. Governing principle

> **Verify the things every site must get right. Add deeper testing only when project behavior justifies it.**

---

# 2. Base verification commands

The base starter should provide two verification levels.

## Fast verification

```bash
npm run verify:fast
```

Runs:

```text
ESLint
TypeScript
route integrity
```

## Completion / CI verification

```bash
npm run verify
```

Runs:

```text
verify:fast
+
Next.js production build
```

That is the entire V0 quality gate.

---

# 3. Required base scripts

Conceptually:

```text
lint
typecheck
routes:check
verify:fast
verify
build
```

Exact command syntax may vary with framework tooling.

---

# 4. No unit-test framework in the base

Do not install Jest or Vitest simply because mature repositories often contain unit tests.

Introduce unit testing when a project contains logic worth testing independently.

Examples:

- transformation logic
- validation logic
- pricing/business rules
- complex utility behavior
- integration adapters

A mostly static informational site may legitimately have no unit-test framework.

---

# 5. No Playwright in the base

Playwright is not foundational in V0.

Introduce it when the project develops meaningful browser-level behavior worth protecting.

Examples:

- navigation flows
- interactive UI
- forms
- CMS-connected routes
- multi-step experiences
- important regressions
- responsive smoke checks

This also creates a better educational progression for student projects.

---

# 6. No axe automation in the base

Automated accessibility testing should normally arrive with browser testing later.

Possible future capability:

```text
Playwright
+
axe-core
```

Accessibility implementation rules remain mandatory even before automated tooling is introduced.

---

# 7. Route integrity

Route integrity belongs in the base because the route registry is a platform invariant.

The verification system should detect drift between:

- registered application routes
- actual filesystem routes

The exact implementation should remain lightweight.

---

# 8. Production build

`npm run verify` must include a production Next.js build.

This catches:

- TypeScript/framework build failures
- route issues
- rendering issues
- unsupported imports
- build-time configuration failures

The normal developer loop may use `verify:fast` to remain quick.

---

# 9. GitHub Actions

The base should include a minimal CI workflow.

Conceptually:

```yaml
npm ci
npm run verify
```

The goal is to teach and enforce:

> **The same quality gate that passes locally must pass in GitHub.**

Do not add a complex matrix, browser farm, coverage reporting, or deployment pipeline to the V0 verification workflow.

---

# 10. Git hooks

Do not require Husky or other Git hooks in the base.

Developers should initially understand and run verification explicitly.

Git hooks may be added later if repeated workflow problems demonstrate their value.

---

# 11. Testing growth model

Testing should grow with actual project risk.

Conceptually:

```text
BASE
lint
types
routes
build

        ↓

INTERACTIVE SITE
+ browser smoke tests

        ↓

ACCESSIBILITY MATURITY
+ axe automation

        ↓

BUSINESS LOGIC
+ unit tests

        ↓

HIGHER-RISK PROJECT
+ cross-browser
+ visual regression
+ performance budgets
+ production-runtime smoke tests
```

This is progressive complexity applied to quality engineering.

---

# 12. AI responsibilities

Claude Code should:

- run `verify:fast` during implementation when appropriate
- run `verify` before declaring milestone work complete
- fix failures rather than bypass checks
- explain any verification failure it cannot resolve
- avoid adding testing frameworks without a demonstrated requirement

Claude Code must not:

- disable lint/type rules merely to make verification pass
- remove route checks because they fail
- introduce broad `any` or ignore directives as shortcuts
- install heavyweight testing infrastructure by default

---

# 13. Definition of done

The V0 verification system is complete when:

```text
npm run verify:fast
npm run verify
```

both work reliably and CI runs the same completion gate.

The base must not require:

```text
Vitest
Jest
Playwright
axe
visual regression
Lighthouse
cross-browser matrices
```

unless a later profile/project explicitly adds them.

---

# 14. Governing rule

> **Keep the everyday quality gate fast enough to use and strong enough to trust.**
