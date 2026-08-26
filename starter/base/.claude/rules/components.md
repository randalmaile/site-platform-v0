# Component rules

Full workflow: `docs/workflows/add-component.md`.

## Where a component goes

```text
src/components/ui/            shadcn/ui primitives — upstream-managed
src/components/shadcnblocks/  pristine registry source — NEVER edited
src/components/normalized/    registry source adapted for this project
src/components/layout/        structural site components
src/components/<domain>/      components tied to a domain concept
```

Nothing lives loose at the root of `src/components/`.

`normalized/` means *adapted external source*. It is not the folder for
miscellaneous project components — those go in `layout/` or a domain folder.

## Installing

- Use `npm run block:add -- @shadcnblocks/<name>` or `@shadcn/<name>`. Every
  item needs its registry prefix.
- Install only primitives something actually needs. Do not preinstall a catalog.
- `block:add` only adds. `src/lib/utils.ts`, `src/app/globals.css`,
  `components.json`, `keystatic.config.ts`, `CLAUDE.md`, `AGENTS.md` and every
  primitive already in `src/components/ui/` are never rewritten by an install,
  and `--overwrite` is refused. Taking a registry's version of one of them is a
  deliberate maintenance change of its own — see the workflow.
- Review what a block dragged in with it. A dependency stays only when its value
  exceeds the complexity it adds — say so explicitly before keeping a large one.

## Normalizing

Copy from `shadcnblocks/` into `normalized/` first, then: remove demo content,
rename by semantic role, expose typed props, replace hard-coded styling with
semantic tokens, fix accessibility and responsive behaviour.

Preserve the structural behaviour that made the block worth selecting. Do not
rewrite a working block to make it look hand-authored.

## API shape

- Focused components over one mega-component with a dozen presentation flags.
  `HeroSplit` and `HeroEditorial`, not `<Hero variant… align… background…>`.
- Variants are for the same concept differing predictably — button size, card
  density — not for substantially different designs.
- Editorial copy arrives through props. Interface labels — Menu, Close, Next —
  stay in the component.
- Extract a component for a real boundary, not because the JSX got long.

## Not in this project

No universal block renderer. No component registry. No page-builder runtime.
Pages compose components directly.
