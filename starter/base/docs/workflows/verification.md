# Verification

Two commands. That is the entire quality gate.

```bash
npm run verify:fast    # while you work
npm run verify         # before you are done
```

| Command | Runs | Takes |
| --- | --- | --- |
| `verify:fast` | ESLint → TypeScript → route integrity | seconds |
| `verify` | `verify:fast` + production build | ~a minute |

Individually:

```bash
npm run lint
npm run typecheck
npm run check:routes
npm run build
```

## What each one catches

**`lint`** — ESLint with Next's flat config. `next lint` was removed in Next 16
and nothing lints during the build, so this is the only thing running ESLint.

**`typecheck`** — `tsc --noEmit` in strict mode.

One failure here is not yours to fix in code: errors in `.next/types/validator.ts`
about missing `AppRoutes` / `LayoutRoutes` / `ParamMap` mean a vinext build left
its own `routes.d.ts` in `.next/types/`. Run `npm run clean:next-types` and
verify again — `docs/deployment/status.md` explains why the two builds collide.

**`check:routes`** — compares every `page.tsx` under `src/app/(site)` with
`PUBLIC_ROUTES` in `src/lib/routes.ts`, in both directions. A page with no
registry entry never reaches the sitemap; a registry entry with no page puts a
404 in it. Nothing else catches either.

**`build`** — a real production build. Catches what only appears when the
framework compiles: server/client boundary violations, unsupported imports,
prerender failures, bad metadata.

## When it fails

Fix the code. Never the check.

Not acceptable: a broad `any`, a `@ts-ignore`, a disabled lint rule, deleting a
route from the registry so the guard passes, weakening a schema, commenting out
the failing code, or removing a step from `verify`.

If a failure genuinely needs an architectural exception, say so explicitly and
agree it — do not bury it in a config file.

## CI

GitHub Actions runs `npm ci` and `npm run verify` on every push and pull
request. It is the same gate, deliberately: if it passes locally it passes in
CI, and CI never enforces a standard you cannot reproduce.

Deployment is separate. Nothing in `verify` touches a provider, needs
credentials, or talks to the network.

## What is not installed

No Vitest or Jest, no Playwright, no axe, no Lighthouse, no visual regression,
no Husky or lint-staged.

That is a starting point, not a ceiling. Testing should grow with real risk:

```text
now              lint, types, routes, build
interactive UI   + browser smoke tests
a11y maturity    + axe automation
business logic   + unit tests
higher risk      + cross-browser, visual regression, performance budgets
```

Add a framework when the project has behaviour worth protecting — not because a
mature repository usually has one.
