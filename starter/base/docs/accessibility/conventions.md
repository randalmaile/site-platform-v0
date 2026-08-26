# Accessibility conventions

Target: **WCAG 2.2 AA**.

No automated accessibility tooling is installed — no axe, no Playwright. That is
a decision about *testing*, not about *standards*. Nothing here is optional
because no tool is watching.

> Do not complete a component with a known accessibility defect on the grounds
> that nothing automated would catch it.

## What the base already provides

- A skip link, first in the tab order on every page, visually hidden until
  focused.
- A `<main id="main">` landmark and `lang="en"` on `<html>`.
- A visible focus ring on every focusable element, applied globally in
  `globals.css` via `:focus-visible` and the `--ring` token. A component has to
  go out of its way to become keyboard-invisible.

## Checklist for a component

Before it is done:

- [ ] **Semantic elements.** A thing that navigates is an `<a>`; a thing that
      acts is a `<button>`. Never a clickable `<div>`.
- [ ] **Keyboard.** Every control reachable and operable by keyboard, in an
      order that matches the visual one.
- [ ] **Focus visible.** Do not remove the outline. If a custom style is needed,
      it must be at least as visible.
- [ ] **Headings in order.** One `<h1>` per page, no levels skipped. Heading
      level is structure; size is a separate styling decision.
- [ ] **Accessible names.** Icon-only controls get a label. Multiple `<nav>`
      elements get distinguishing `aria-label`s.
- [ ] **Images.** Meaningful images get alt text describing their purpose.
      Decorative images get `alt=""` — do not mechanically require prose for an
      asset that carries no information.
- [ ] **Contrast.** 4.5:1 for normal text, 3:1 for large text and for meaningful
      UI boundaries and icons.
- [ ] **Mobile.** Readable at 320px with no horizontal overflow. Touch targets
      sized for fingers, not cursors. Nothing that only works on hover.
- [ ] **Motion.** Any non-essential animation degrades under
      `prefers-reduced-motion`.
- [ ] **Meaning is not carried by styling alone.** Colour, position or weight
      must never be the only signal.

## Forms

None exist in the base. When one arrives it needs explicit labels, correct input
types, keyboard operability, validation a screen reader can perceive, errors
associated with their fields, and sensible focus movement on submit and on
error.

## Third-party components

Registry source is not accessible because it came from a reputable registry.
Normalization is where semantics, keyboard behaviour, focus, labels, heading
levels, alt text, touch targets and motion get reviewed — and the fixes go in
`normalized/`, never in the pristine copy.

## What is not here

There is no public `/accessibility` statement page. Publishing one is a project
decision, not something the starter should assume.

Automated checks — Playwright plus axe — are a reasonable later addition once
the site has real interactive behaviour worth protecting. They supplement this
checklist; they do not replace it.
