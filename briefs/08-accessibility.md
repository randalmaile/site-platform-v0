# 08 — Accessibility

## Status

**V0 platform brief**

Accessibility is a platform invariant.

Automated accessibility testing is not required in the V0 base, but implementation must still target accessible production behavior.

---

# 1. Governing principle

> **Accessibility is a development requirement, not a testing feature.**

The absence of axe or Playwright in the base does not permit knowingly inaccessible implementation.

---

# 2. Target

Generated sites should target **WCAG 2.2 AA** where applicable.

This is the default design and implementation standard.

---

# 3. Base implementation requirements

Developers and AI agents must consider:

- semantic HTML
- keyboard access
- visible focus states
- logical heading hierarchy
- accessible labels
- meaningful alternative text
- sufficient color contrast
- touch target sizing
- responsive readability
- form errors when forms exist
- reduced-motion preferences
- skip/navigation behavior where appropriate

---

# 4. Hard implementation rule

Claude or a developer should not knowingly complete a component with an obvious accessibility defect merely because automated testing is not installed.

Examples include:

- clickable `div` elements instead of buttons/links
- missing form labels
- keyboard-inaccessible controls
- invisible focus states
- broken heading order
- insufficient contrast
- meaningful images with missing alt text

Fix the implementation before considering the component complete.

---

# 5. Documentation

Every generated site should include:

```text
docs/accessibility/conventions.md
```

This document should describe the project's implementation expectations.

The base does **not** automatically create a public `/accessibility` page.

A public accessibility statement/page is a project decision.

---

# 6. Motion

Nonessential animation must respect:

```text
prefers-reduced-motion
```

Motion libraries are not part of the base starter.

They should enter a project only when the approved design requires motion.

Any introduced motion system must include a reduced-motion strategy.

---

# 7. Third-party components

Imported UI is not assumed to be accessible.

Normalization must review:

- semantics
- keyboard behavior
- focus treatment
- labels
- mobile behavior
- touch targets
- animation behavior

Accessibility fixes belong in the normalized/project implementation.

---

# 8. Images

Editorial image workflows should support meaningful alternative text when the image conveys information.

Decorative images may use empty alt text where appropriate.

Avoid mechanically requiring descriptive alt text for purely decorative assets.

---

# 9. Forms

When forms are introduced, they must include:

- explicit labels or equivalent accessible names
- keyboard operability
- understandable validation
- accessible error reporting
- correct input types
- sensible focus behavior

Forms are not part of the base unless a project capability requires them.

---

# 10. Responsive accessibility

Accessibility includes mobile usability.

Production UI must be reviewed for:

- readable text
- appropriate spacing
- touch targets
- content order
- horizontal overflow
- navigation behavior

Desktop-only correctness is insufficient.

---

# 11. Automated testing

Automated accessibility testing is optional in V0 and should be introduced when project complexity justifies it.

A later testing capability may add:

```text
Playwright
axe-core
```

The tooling supplements human implementation judgment; it does not replace it.

---

# 12. Definition of done

A component/page is ready when:

- semantics are appropriate
- keyboard interaction works
- focus is visible
- headings are logical
- images are handled correctly
- contrast is acceptable
- mobile interaction is usable
- motion respects reduced-motion preferences
- obvious accessibility defects are not deferred merely because no automated tool detects them

---

# 13. Governing rule

> **Build accessibly first. Automate accessibility checks later when they provide additional value.**
