# Maintenance log

Things the platform is **waiting on**.

The briefs record what the architecture *is* — they are contracts. This file
records what has been deliberately deferred, why, and the command that tests
whether the deferral still holds. It is a log, not a contract: entries appear
when a decision is postponed and disappear when it is resolved.

**Why it exists.** `starter/base` is a template. A comment in one generated
repo's `eslint.config.mjs` cannot remind the platform to update the template,
and a deferral that lives only in someone's head becomes folklore in about two
months. Everything here has a trigger and a test, so "is this still right?" is
answerable by running something rather than by remembering.

**What belongs here:** a pinned version we cannot currently take, a capability
deliberately postponed, a decision blocked on evidence we do not have yet.

**What does not:** anything permanent (that is a brief), per-project decisions
(those belong in the project), and general future ideas.

**How to use it.** Walk the open items at each milestone. Run each test. If it
passes, take the upgrade and delete the entry. If it fails, update *Last
checked* and move on — do not weaken a check to close a row.

---

## Open

### 1. ESLint pinned to 9.39.5, which is end-of-life

`starter/base/package.json`

npm warns on every install that the 9.x line is no longer supported. **Do not
bump it to 10.** `eslint-config-next@16.3.3` declares `eslint: >=9.0.0` but
bundles `eslint-plugin-react@^7.37.0`, which still calls the rule-context API
ESLint 10 removed. Every lint run dies with
`contextOrFilename.getFilename is not a function`.

Verified against `eslint-config-next@16.4.0-canary.8` — still `^7.37.0`, so the
fix is not queued in a Next release either.

**The caret matters.** If `eslint-plugin-react` ships 7.38+ with ESLint 10
support, a fresh install picks it up with no Next release at all. This can
unblock silently, which is why it gets retried rather than watched.

**Risk of waiting:** low. This is a dev-only linter running over our own source;
EOL here means no patches, not live exposure. Do not let the npm warning
stampede a change that breaks `verify`.

```bash
cd starter/base && npm i -D eslint@10 && npm run lint   # revert if it dies
```

Rationale is duplicated in `starter/base/eslint.config.mjs` so nobody "fixes"
the pin in a generated repo.

*Last checked: 2026-08-26 — still blocked.*

### 2. TypeScript pinned to 5.9.3 while 7.x is current

`starter/base/package.json`

TypeScript 7.0.2 (the native rewrite) is `latest`. Not adopted for V0: a
foundation is the wrong place to take a rewrite of the compiler, and brief 01 §1
asks for intentionally boring.

Nothing is broken — this is a choice, not a block. But "boring" has a shelf
life, and a foundation still on 5.x once the ecosystem has moved is its own
liability.

**Trigger:** the first profile milestone. The base is small enough that this
either works in one run or does not.

```bash
cd starter/base && npm i -D typescript@7 && npm run verify
```

*Last checked: 2026-08-26 — not attempted, deferred by choice.*

### 3. vinext is proven for the base but remains a beta dependency

`starter/base/docs/deployment/status.md` holds the detail.

vinext 1.0.0-beta.8 builds and deploys the base, serves repository content from
GitHub, and passed the full deployed Keystatic GitHub-mode workflow: OAuth,
content loading, save, GitHub commit and live public rendering. It is the proven
V0 default for this base. The dependency is still a beta and project-specific
features can introduce compatibility gaps that the neutral base does not cover.

**Trigger:** a vinext upgrade, a Next.js upgrade, or a generated project adding
material routes/dependencies. Re-run the compatibility check and full deployed
acceptance test; use OpenNext only if that evidence reveals a critical gap.

```bash
cd starter/base && npm run build:vinext && npm run start:vinext   # then GET /
```

OpenNext remains the documented fallback, but nothing found so far argues for
it: the two expensive failures belong to Workers and to Keystatic, and OpenNext
would hit both identically.

*Last checked: 2026-08-26 — full deployed editing workflow passed.*

### 4. Keystatic's GitHub reader sends no `User-Agent`

`starter/base/src/lib/content/reader.ts`

GitHub's REST API answers `403 Request forbidden by administrative rules` to any
request without a `User-Agent`. `createGitHubReader` sets no such header and
offers no way to add one. Node's `fetch` supplies a default, so this is
invisible in development and in any Node deployment; `workerd`'s does not, so
every content read fails in a Worker.

`reader.ts` wraps `fetch` for `api.github.com` and `raw.githubusercontent.com`
only, filling the header in when absent. It is re-asserted before each read
rather than installed once, because vinext replaces `globalThis.fetch` on the
first request with a wrapper that delegates to the `fetch` it captured at
startup — so a module-scope patch is discarded before it is ever used. That
second half is the part worth remembering: **a userland `globalThis.fetch` patch
does not survive vinext**, whatever it is for.

**Trigger:** either upstream fix closes this. Keystatic sending its own
`User-Agent` removes the need entirely; vinext capturing `globalThis.fetch`
lazily would at least let the wrapper be installed once at module scope.

**Risk of waiting:** low, but the wrapper is a global mutation and that is
exactly the kind of thing that rots quietly. It is narrow — two hosts, one
absent header, delegating to whatever `fetch` is current — and it is confined to
the file that already owns Keystatic's mechanics.

```bash
grep -n "user-agent" starter/base/node_modules/@keystatic/core/dist/keystatic-core-reader-github.worker.js
```

*Last checked: 2026-08-26 — absent in `@keystatic/core@0.6.9`.*

### 5. `@babel/plugin-transform-runtime` pinned without proven need

`starter/base/package.json`

Added during `vinext init` to break an npm dependency-resolution failure.
Nothing in the tree depends on it (`npm ls` shows it as a leaf), and with the
current lockfile it can be removed and `npm run build:vinext` still passes.

That is not the case it was added for. The failure was resolution *from
scratch*, and re-testing that means installing with no lockfile, which could not
be completed on 2026-08-26 — the attempt died on a registry network error, not
on a dependency conflict. Kept rather than removed: inconclusive evidence is not
grounds for dropping a deliberate pin.

**Risk of waiting:** low. One unused dev-only package. But brief 01 §7 says
nothing sits in the template speculatively, so it either earns its place or it
goes.

```bash
mkdir /tmp/babel-pin && cp starter/base/package.json /tmp/babel-pin/
# remove @babel/plugin-transform-runtime from the copy, then:
cd /tmp/babel-pin && npm install     # resolves? the pin can go
```

*Last checked: 2026-08-26 — test inconclusive (network).*

### 6. Route guard handles static routes only

`starter/base/scripts/check-routes.mjs`

It fails loudly on a `[slug]` rather than ignoring one, so the gap cannot pass
silently. Deliberate: the base has no dynamic routes, and the reference
implementation's dynamic-route logic was site-specific.

**Trigger:** the first project that adds a dynamic route. Extend the script to
verify the registry covers the segment, then fold the improvement back into the
starter. Do not delete the check to make the error go away.

If more than one project writes the same extension, it belongs in the template.

*Last checked: 2026-08-26 — no dynamic routes exist yet.*

### 7. `block:add` answers the shadcn overwrite prompt through stdin

`starter/base/scripts/add-block.mjs`

The wrapper never lets an install rewrite a file the project owns. It snapshots
the protected set, runs the CLI, and restores anything that changed — that pass
is the guarantee. The awkward part is the prompt: shadcn 4.19.0 has no "no to
all" flag. `--overwrite` is yes-to-all, and its absence means one interactive
confirm per conflicting file. So the child gets a stdin of bare newlines and
each confirm takes its default, which is no.

Closing stdin instead does not work: the aborted prompt takes the rest of the
install with it and the requested block never lands. Verified 2026-08-26 against
4.19.0.

**Trigger:** a released flag meaning non-interactive or no-overwrite writes. The
CLI already has the code path — `updateFiles()` skips conflicts outright when
its internal `interactive` option is false, it is just not reachable from the
command line. When it is, drop the stdin feed and keep the restore pass.

**Risk of waiting:** low. The feed only matters if the confirm's default ever
flips to yes, and protected files are restored either way.

```bash
cd starter/base && npx shadcn add --help   # a no-overwrite flag yet?
```

*Last checked: 2026-08-26 — no such flag in 4.19.0.*

---

## Current pins

Brief 01 §2 requires pinning rather than floating on `latest`, and treats
upgrades as deliberate platform maintenance. This is what `starter/base` is on.

| | Pinned | Upstream latest | Note |
| --- | --- | --- | --- |
| Node | 22.18.0 (`.nvmrc`) | — | `engines: >=22.15 <23` |
| `next` | 16.3.3 | 16.3.3 | current |
| `react` / `react-dom` | 19.2.8 | 19.2.8 | current |
| `typescript` | 5.9.3 | 7.0.2 | open item 2 |
| `eslint` | 9.39.5 | 10.9.1 | open item 1 |
| `eslint-config-next` | 16.3.3 | 16.3.3 | current; gates item 1 |
| `tailwindcss` | 4.3.3 | 4.3.3 | current |
| `@keystatic/core` | 0.6.9 | 0.6.9 | current |
| `@keystatic/next` | 5.0.5 | 5.0.5 | current |
| `shadcn` | 4.19.0 | 4.19.0 | current; pinned so `block:add` cannot drift |
| `vinext` | ^1.0.0-beta.8 | 1.0.0-beta.8 | under validation — open item 3; caret, not pinned |
| `wrangler` | ^4.126.0 | 4.126.0 | adapter tooling, not application code |

*Table verified 2026-08-26. It goes stale on its own — re-run
`npm view <pkg> version` rather than trusting it.*

---

## Resolved

Nothing yet. Move an entry here with the date and what unblocked it, then delete
it once the next milestone has passed and nobody needs the history.
