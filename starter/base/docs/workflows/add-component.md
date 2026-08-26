# Adding a component

Three routes in, depending on what you need.

| Need | Do this |
| --- | --- |
| A primitive — button, dialog, tabs | Install from shadcn/ui |
| A section pattern — hero, feature grid, FAQ | Install from Shadcnblocks, then normalize |
| Something the registries do not do well | Write it |

Writing it is a first-class option. Do not distort a design to reuse a block.

---

## Installing

```bash
npm run block:add -- @shadcn/button
npm run block:add -- @shadcnblocks/hero12
npm run block:add -- --dry-run @shadcnblocks/hero12
```

Every item needs its registry prefix — a bare name falls through to the default
registry and 404s. Shadcnblocks is a paid registry and needs
`SHADCNBLOCKS_API_KEY` in your environment.

The wrapper runs the pinned local shadcn CLI, files each item by the registry it
came from, and repairs imports that pointed at the old path.

**It only ever adds.** Registry items ship their own `utils.ts`, their own
theme, their own `components.json`, and the CLI will write all three given the
chance. These are snapshotted before the install and put back byte-for-byte
after it:

```text
src/lib/utils.ts        src/app/globals.css     components.json
keystatic.config.ts     CLAUDE.md               AGENTS.md
```

Every file **already** in `src/components/ui/` is protected the same way — a
primitive that is missing still installs normally, one that exists is never
rewritten. `--overwrite` is refused outright.

So an install can bring in a new block, a missing primitive and its
dependencies, and cannot quietly replace a decision the project already made.
Two things follow from that:

- A `skipped` line in the CLI's output for one of those files is the guard
  working. Its suggestion to rerun with `--overwrite` does not apply here.
- The CLI may still ask `The file utils.ts already exists. Would you like to
  overwrite?` — it has no flag for "no to all". The answer is submitted for you
  and it is always no; nothing waits for input.

**Install only what something needs now.** No preinstalled catalog.

---

## Updating a protected file

Taking a registry's version of `utils.ts`, the theme, or a primitive that is
already installed is maintenance, not an install. It changes something the whole
project depends on, so it is a deliberate change of its own — not a side effect
of adding a hero section.

```bash
npx shadcn add --diff @shadcn/<item>     # what would the registry write?
```

Read the diff, apply the parts you actually want by hand, run `npm run verify`,
and commit that change on its own. If you genuinely want the registry's file
wholesale, delete the local one first and install it — a missing file is not
protected.

There is no flag for this. `--overwrite` is refused, and adding one back would
put the theme and the utils helper one keystroke away from a silent rewrite.

---

## Normalizing a block

Registry source lands in `src/components/shadcnblocks/`. It is never edited: the
untouched copy is what an adaptation gets compared against, and edits made there
are invisible to the project — nothing renders from that directory. `block:add`
will not overwrite a file already in it, so refreshing a block means deleting
that file and reinstalling.

```text
select a block for a content/UX reason
        ↓
npm run block:add
        ↓
run it unchanged, see what it does
        ↓
copy into src/components/normalized/
        ↓
strip demo content → rename semantically → typed props
        ↓
tokens, accessibility, responsive
        ↓
connect content once the props have settled
```

### The work

- **Remove demo content.** Sample headings, lorem text, placeholder images and
  fake logos all go.
- **Rename by role.** `HeroEditorial`, not `Hero12`. Registry numbering is
  provenance, and provenance stays in the pristine copy.
- **Typed props.** Editorial copy arrives from the route. Interface labels —
  Menu, Close, Next — stay in the component.
- **Tokens.** Replace hard-coded colours, spacing and radii with semantic
  tokens.
- **Accessibility.** Registry source is not accessible by default. Check
  semantics, keyboard operation, focus visibility, accessible names, heading
  order, alt text, touch targets, reduced motion.
  → `../accessibility/conventions.md`
- **Responsive.** The block was built for someone else's breakpoints and content
  density. Review mobile deliberately.
- **Dependencies.** A block may drag in a carousel library, an icon pack, a
  motion library. None of them are automatically accepted. Keep one only when
  its value exceeds what it costs — and say so out loud before keeping a large
  one.

Preserve the structural behaviour that made the block worth choosing.
Normalization is not an excuse to rewrite a working layout so it looks
hand-authored.

---

## Choosing where it lives

```text
src/components/ui/            shadcn/ui primitives — upstream-managed
src/components/shadcnblocks/  pristine registry source — never edited
src/components/normalized/    registry source adapted for this project
src/components/layout/        structural site components
src/components/<domain>/      components tied to a domain concept
```

`normalized/` means *adapted external source*. A component you wrote yourself
goes in `layout/` or a domain folder — `components/events/event-card.tsx`, not
`components/cards/card-variant-two.tsx`. Domain naming says what data a
component expects.

Nothing lives loose at the root of `src/components/`.

---

## API shape

Prefer focused components over one component with many presentation flags:

```tsx
<HeroSplit />  <HeroEditorial />      // yes
<Hero variant="split" align="center" background="dark" overlay />   // no
```

They can share primitives internally where behaviour genuinely overlaps.

Variants are right when the concept stays the same and differences are
predictable — button size, card density. They are not a substitute for a
separate component when the design is substantially different.

Extract a component for a real boundary: reuse, a meaningful UI or domain
concept, hidden interaction state, its own responsive or accessibility
behaviour. Not because the JSX got long.

---

## Done when

Its role is clear, it lives in the right directory, provenance is preserved,
demo content is gone, content arrives through props, dependencies were reviewed,
tokens are used, keyboard and focus work, mobile was checked, the API is no more
generic than the design requires, and `npm run verify` passes.
