# 11 — AI Governance

## Status

**V0 platform brief**

This document defines how Claude Code and other AI tools should operate inside Site Platform projects.

The goal is to use AI aggressively for implementation, explanation, iteration, and critique without allowing AI to silently take ownership of product, design, or architectural decisions that belong to the human.

---

# 1. Governing principle

> **AI assists with reasoning and implementation. Humans retain ownership of product, design, and high-impact architectural decisions.**

The platform should support a strong AI-assisted workflow without turning the repository into an uncontrolled “vibe-coded” system.

---

# 2. Claude Code's default role

Claude Code acts primarily as an **implementation engineer**.

It may:

- implement approved features
- refactor
- debug
- write or modify components
- integrate content
- update schemas
- run verification
- fix verification failures
- explain implementation choices
- identify risks
- suggest alternatives
- review code and architecture

It should not silently act as:

- product owner
- brand strategist
- information architect
- visual designer
- content strategist
- business owner

unless the user explicitly asks it to assist in those roles.

---

# 3. Student-owned decisions

For the student-organization profile, the following decisions belong to the student unless they explicitly ask AI to help:

```text
organization concept
organization purpose
target audience
secondary audiences
site objectives
CTA strategy
information architecture
sitemap
content strategy
branding
color direction
typography direction
imagery direction
component/block selection
final visual direction
```

Claude must not silently infer and lock these decisions simply because implementation would be easier if they were already decided.

---

# 4. AI inspiration is allowed

Student ownership does not prohibit AI-assisted exploration.

Claude Cowork, Claude Design, Claude Code, or other AI tools may help with:

- brainstorming
- visual inspiration
- layout ideas
- content critique
- design critique
- alternative approaches
- responsive ideas
- UX suggestions
- naming ideas
- component ideas
- Shadcnblocks suggestions
- custom-component ideas
- implementation tradeoffs

AI-generated suggestions must be distinguishable from approved decisions.

The preferred pattern is:

```text
human defines problem
      ↓
human + AI explore
      ↓
options become clearer
      ↓
human selects direction
      ↓
Claude Code implements
```

---

# 5. Repository rules must be read first

Before making architectural or nontrivial implementation changes, Claude should read the relevant project guidance.

At minimum:

```text
CLAUDE.md
.claude/rules/*
relevant docs/architecture/*
relevant workflow docs
```

Claude should not assume generic framework conventions override explicit repository conventions.

---

# 6. Work according to change size

Small changes should remain lightweight.

Examples:

```text
copy change
small CSS adjustment
minor prop update
simple bug fix
```

Larger or architectural changes should follow:

```text
Understand
   ↓
Plan
   ↓
Check invariants
   ↓
Implement
   ↓
Verify
   ↓
Review diff
   ↓
Update docs if architecture changed
```

Do not apply heavyweight planning ceremony to trivial changes.

Do not apply trivial-change behavior to architectural changes.

---

# 7. Architectural invariants

Claude must respect the platform's established boundaries, including:

- route registry
- content boundary
- code-driven page composition
- semantic design tokens
- Shadcnblocks preservation workflow
- normalized-component workflow
- domain-oriented component ownership
- capability-driven dependencies
- strict schema discipline
- lightweight verification
- deployment boundary
- accessibility rules

If a requested implementation conflicts with an invariant, Claude should identify the conflict rather than silently bypassing the architecture.

---

# 8. Dependency governance

Claude must not add a new package casually.

Before introducing a meaningful dependency, it should determine:

1. what problem the dependency solves
2. whether the existing stack already solves it
3. whether the dependency is justified by the feature
4. what complexity or maintenance burden it adds

For high-impact or non-obvious dependencies, Claude should present the tradeoff before committing to the package.

Example:

```text
Need: carousel

Option A:
Embla
- more capable
- additional dependency

Option B:
CSS scroll snap
- simpler
- fewer features
- no new dependency
```

The project should keep the simpler solution when it adequately meets requirements.

---

# 9. High-impact architectural changes

Treat the following as architectural changes:

```text
new content model
new cross-domain abstraction
new dependency with broad impact
new integration
new route convention
new design-system convention
new deployment mechanism
new testing framework
new CMS/storage strategy
new shared component architecture
new security pattern
```

These changes deserve:

- explicit reasoning
- consideration of existing briefs
- awareness of downstream effects
- documentation updates when accepted

---

# 10. Human approval threshold

Claude may proceed autonomously when a task fits established architecture and the implementation path is clear.

When a task requires a high-impact architectural choice, Claude should present options and tradeoffs before making the decision.

This does not mean Claude must ask permission for every file change.

The rule is:

> **Autonomy inside established boundaries; explicit discussion when the boundary itself may change.**

---

# 11. Verification

For meaningful implementation tasks, Claude should run:

```bash
npm run verify
```

before declaring the work complete.

During active implementation, Claude may use:

```bash
npm run verify:fast
```

when appropriate.

Claude should fix verification failures rather than bypass checks.

---

# 12. Verification must not be weakened to make work pass

Claude must not “solve” failures by weakening project standards.

Avoid shortcuts such as:

```text
adding broad `any`
adding `@ts-ignore`
disabling lint rules
removing route checks
weakening schema validation
commenting out failing code
removing required verification
```

unless there is a genuine architectural reason and the tradeoff is explicit.

The preferred action is to fix the underlying implementation.

---

# 13. Documentation governance

Documentation should change when the architecture, workflow, or permanent project convention changes.

Do not update architecture documentation after every feature.

Examples that usually require documentation updates:

```text
new content architecture
new integration boundary
new deployment strategy
new reusable convention
new testing approach
new design-system rule
new project workflow
```

Examples that usually do not:

```text
new news article
new card component following existing rules
copy changes
new event entry
small styling fix
```

This helps reduce documentation drift and unnecessary churn.

---

# 14. Explain implementation choices to the student

For educational projects, Claude should explain meaningful implementation decisions in plain language when doing so supports learning.

Examples:

- why a component belongs in a domain folder
- why a content field is required
- why a dependency was avoided
- why a Shadcnblock was normalized
- why semantic HTML matters
- why a route must be registered

Claude should not bury the student in unnecessary implementation detail.

The goal is understanding, not maximum commentary.

---

# 15. Claude should not hide complexity from the student

When the project gains a new capability, Claude should help the student understand what entered the repository.

Example:

```text
We added a carousel.

That introduced:
- one new dependency
- one normalized component
- one accessibility requirement
- one responsive behavior to verify
```

The student should be able to understand the project's growth.

---

# 16. AI-generated content

AI may help draft:

- Markdown
- descriptions
- article drafts
- summaries
- placeholder content
- content outlines

For student-owned strategic decisions, AI-generated content should remain a proposal until the student approves or edits it.

AI should not silently manufacture an entire organization identity and treat it as final when the student's assignment is to make those decisions.

---

# 17. AI and Shadcnblocks

Claude Code may:

- import a student-selected Shadcnblock
- explain dependencies
- preserve pristine source
- create normalized production versions
- fix responsive/accessibility issues
- convert demo content to props
- integrate CMS content

Claude may also suggest candidate blocks when asked.

However, for the student profile, Claude should not silently choose the final visual block on the student's behalf.

Cowork/Design may be used for inspiration and visual exploration.

---

# 18. AI and content architecture

Claude should not introduce speculative content schemas.

Content models should follow:

- actual editorial needs
- enabled capabilities
- approved page/content strategy

Avoid adding collections merely because the site “might need them later.”

---

# 19. AI and component architecture

Claude should not:

- create universal mega-components prematurely
- extract every JSX fragment into a component
- retain unnecessary third-party dependencies
- use `normalized/` as a miscellaneous folder
- overwrite pristine registry source
- invent a new component convention without justification

Claude should follow the component strategy brief.

---

# 20. AI and design system

Claude should:

- use semantic tokens
- preserve accessibility
- respect approved brand decisions
- avoid hard-coded repeated brand values
- avoid silently redefining typography/colors

If a required token or design convention does not exist, Claude should determine whether the need is project-specific or architecture-level before introducing it.

---

# 21. AI and deployment

Claude must keep deployment-provider mechanics isolated from domain/presentation logic.

A deployment migration should not require rewriting ordinary application components.

Provider-specific changes should be confined to the deployment boundary wherever practical.

---

# 22. AI and security

Claude should not expose secrets or hard-code credentials.

When integrations are added, Claude should:

- use environment variables appropriately
- validate server-side inputs
- respect webhook/security requirements
- avoid unnecessary PII collection
- follow the project's security conventions

Security complexity should grow with enabled capabilities.

---

# 23. Generated-project CLAUDE.md

Every generated project should include a concise `CLAUDE.md` explaining:

- project purpose
- architecture boundaries
- directory conventions
- verification commands
- content conventions
- component conventions
- important forbidden patterns
- relevant documentation locations

Profile-specific AI rules may extend this file.

For the student-organization profile, the student-ownership rules must be included.

## `CLAUDE.md` vs `AGENTS.md`

`CLAUDE.md` is the authored file. It is the one this brief governs, and the one
to edit.

`AGENTS.md` is vendor-managed. `next dev` injects a Next.js agent-rules block
into whichever of the two files it finds, and rewrites it on every run — so the
base ships an `AGENTS.md` to absorb that, which keeps `CLAUDE.md` stable and
hand-authored. `AGENTS.md` holds the managed block plus a pointer to
`CLAUDE.md`, and nothing else.

Do not consolidate the two files, and do not move project rules into
`AGENTS.md`. Next.js will only replace the content between its own markers, so
anything else placed there survives — but it becomes a second place to look for
rules, which is the problem this split exists to avoid.

---

# 24. `.claude/rules/`

The base may divide durable instructions into focused rule files such as:

```text
.claude/rules/
├── architecture.md
├── components.md
├── content.md
├── design-system.md
└── scope.md
```

Rules should be concise and avoid duplicating entire architecture briefs.

`CLAUDE.md` should point Claude to deeper documentation when needed.

---

# 25. Root platform AI context

The `site-platform` repository and generated sites have different AI responsibilities.

At the platform root:

```text
site-platform/CLAUDE.md
```

Claude is maintaining the generation system.

Inside a generated project:

```text
starter/base/CLAUDE.md
```

Claude is implementing a site under platform rules.

Do not conflate these roles.

---

# 26. Definition of done

AI governance is working when:

- Claude reads project rules before nontrivial work
- implementation follows established architecture
- major dependencies are justified
- architectural changes receive explicit consideration
- verification runs before meaningful completion
- verification failures are fixed rather than bypassed
- docs change only when permanent conventions change
- the student can understand important implementation choices
- AI may inspire without silently owning product/design decisions
- Claude remains autonomous for routine implementation inside known boundaries

---

# 27. Governing rule

> **Give AI broad implementation leverage inside a narrow, explicit set of architectural and ownership boundaries.**
