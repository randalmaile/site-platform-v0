# 10 — Deployment

## Status

**V0 platform brief**

Cloudflare Workers is the default deployment target for Site Platform V0.

The application must remain a normal Next.js application, with Cloudflare-specific mechanics isolated behind a deployment boundary.

For new Next.js projects, **vinext is the preferred Cloudflare candidate**, but it does not become the platform's proven default until the full Keystatic GitHub-mode editing workflow passes the deployment acceptance test.

OpenNext remains the supported fallback when vinext compatibility is insufficient.

---

# 1. Governing principle

> **Build a standard Next.js application first. Treat Cloudflare as a deployment boundary, not as application architecture.**

Domain, content, design, and presentation code should not depend on Cloudflare-specific APIs unless a selected capability explicitly requires a Cloudflare binding.

---

# 2. Default deployment platform

Generated projects should target:

```text
Cloudflare Workers
```

by default.

The platform may support other deployment targets later, but V0 does not need a multi-provider deployment framework.

Cloudflare-specific configuration should remain localized.

---

# 3. Deployment architecture

Conceptually:

```text
STANDARD NEXT.JS APPLICATION
          │
          │ deployment boundary
          ▼
    CLOUDFLARE WORKERS
          │
          ├── vinext
          │     preferred new-project candidate
          │
          └── OpenNext
                fallback when compatibility requires it
```

Do not spread adapter-specific imports through application code.

---

# 4. vinext policy

For new projects, test vinext first.

Before adoption, run the compatibility check:

```bash
npx vinext check
```

If compatibility is acceptable, initialize/configure vinext according to current Cloudflare guidance.

The existing Next.js development workflow must remain usable.

vinext is currently treated as:

> **preferred candidate, pending project compatibility**

not:

> **assumed universally compatible**

---

# 5. OpenNext fallback

OpenNext remains an acceptable fallback when:

- vinext reports a material compatibility gap
- Keystatic GitHub mode does not operate correctly
- a required Next.js feature is unsupported or unreliable
- another demonstrated production issue prevents vinext adoption

Do not choose OpenNext for a new project merely because an older reference project used it.

Do not rewrite a working existing OpenNext application solely to satisfy V0 consistency.

---

# 6. Local development

Normal development should remain:

```bash
npm run dev
```

and should use the standard Next.js development environment.

Deployment adapters may add additional commands such as:

```bash
npm run dev:cloudflare
npm run dev:vinext
```

for runtime-specific verification.

Adapter-specific development must not replace normal Next.js development unless a proven technical requirement makes that necessary.

---

# 7. Standard project scripts

Generated projects should normalize routine deployment operations behind `package.json` scripts.

Recommended conceptual interface:

```bash
npm run dev
npm run build
npm run preview
npm run deploy
```

Adapter-specific commands should be hidden behind these scripts where practical.

A developer should not need to remember provider-specific CLI syntax for normal work.

---

# 8. Preview

Provide:

```bash
npm run preview
```

when the selected Cloudflare adapter supports meaningful local production-runtime preview.

`preview` is a manual/runtime validation tool.

It is **not** part of:

```bash
npm run verify
```

in V0.

This preserves the lightweight everyday quality gate.

---

# 9. Deployment configuration ownership

Each generated repository should contain the configuration necessary to deploy itself.

Depending on the selected adapter, this may include:

```text
wrangler.jsonc / wrangler.toml
vite.config.ts
adapter configuration
deployment scripts
Cloudflare type generation config
```

Do not require generated sites to depend on an external shared deployment package in V0.

Independent repositories should remain independently deployable.

---

# 10. Environment variables

Every generated project should provide:

```text
.env.example
```

with variable names and explanatory comments where useful.

Never commit actual credentials or secrets.

Runtime secrets should live in the appropriate deployment/GitHub secret configuration.

For Keystatic GitHub mode, project documentation should account for values such as:

```text
KEYSTATIC_GITHUB_CLIENT_ID
KEYSTATIC_GITHUB_CLIENT_SECRET
KEYSTATIC_SECRET
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
```

Names must follow the current Keystatic integration requirements.

---

# 11. Keystatic is a deployment acceptance requirement

A successful public homepage is not sufficient to declare a deployment adapter supported.

The deployment must support the complete Keystatic GitHub-mode workflow used by the project.

Conceptually:

```text
/keystatic
    ↓
GitHub authentication
    ↓
editor loads repository content
    ↓
editor changes content
    ↓
save writes repository content
    ↓
GitHub commit/update
    ↓
deployment rebuild
    ↓
updated public site
```

The platform should not claim an adapter is proven until this path works end-to-end.

---

# 12. Keystatic deployment acceptance test

For the first reference project, verify:

```text
□ npm run dev works normally

□ npm run build works

□ vinext compatibility check has been reviewed

□ Cloudflare Worker deploy succeeds

□ public site renders correctly

□ /keystatic loads

□ GitHub login succeeds

□ authorized editor can access content

□ structured content can be edited

□ Markdown content can be edited when enabled

□ image upload works when enabled

□ save creates/updates repository content

□ content reaches GitHub

□ deployment rebuild occurs

□ updated content appears publicly
```

If any critical GitHub-mode editing step fails because of the adapter/runtime, vinext must not be declared the platform default for that configuration.

---

# 13. GitHub Actions vs deployment

Keep verification and deployment separate in V0.

GitHub Actions should run:

```text
npm ci
npm run verify
```

Cloudflare should handle deployment through its normal project/Git integration or selected deployment workflow.

Do not build a custom GitHub deployment pipeline merely for architectural symmetry.

---

# 14. Preview deployments

Pull-request preview environments are not a base requirement.

They may be introduced later when:

- client review benefits from them
- multiple developers need them
- QA workflow requires them
- a project has enough deployment complexity to justify them

A simple student or informational site should not inherit this infrastructure by default.

---

# 15. Cloudflare bindings

Cloudflare bindings such as:

```text
KV
R2
D1
Durable Objects
Workers AI
Queues
```

are not part of the base deployment layer.

Introduce them only when a selected capability needs them.

When used, provider-specific access should remain in an integration/server boundary rather than presentation components.

---

# 16. Cloudflare Pages

Cloudflare Pages/static export is not the default Next.js deployment path for Site Platform V0.

The platform targets full-stack Next.js behavior and Keystatic GitHub mode, so Cloudflare Workers is the normal Cloudflare target.

Static export may be considered for a project that explicitly does not require server-side behavior.

---

# 17. Deployment and application code

Ordinary application code must not:

- import Wrangler configuration
- depend on deployment CLI mechanics
- construct business/domain behavior around Cloudflare internals
- contain deployment secrets
- assume Workers bindings exist unless a capability explicitly adds them

A future change in deployment adapter should primarily affect deployment/configuration code.

---

# 18. Deployment documentation

Every generated project should document:

- normal local development command
- build command
- preview command when available
- deployment command
- required environment variables
- Cloudflare project setup
- Keystatic GitHub App setup
- production editing expectations
- adapter used
- known compatibility limitations

Keep operational instructions specific and current.

---

# 19. V0 selection algorithm

For a new generated project:

```text
Start with standard Next.js application
        ↓
Run vinext compatibility check
        ↓
Is compatibility acceptable?
        │
       yes
        ↓
Configure vinext
        ↓
Run deployment + Keystatic acceptance test
        ↓
Does full workflow pass?
     │             │
    yes            no
     │             │
     ▼             ▼
 use vinext    evaluate OpenNext
```

OpenNext becomes the fallback based on demonstrated compatibility need, not preference inherited from an older project.

---

# 20. Verification boundary

The base quality gate remains:

```text
lint
TypeScript
route integrity
Next.js build
```

Deployment-runtime testing is separate.

Do not put:

```text
Cloudflare preview
Workers deploy
Keystatic live authentication
```

inside `npm run verify`.

This keeps verification fast and deterministic.

---

# 21. Definition of done

Deployment architecture is healthy when:

- the app remains a standard Next.js project
- `npm run dev` works without requiring the production adapter
- provider-specific files are isolated
- standard scripts hide routine provider syntax
- `.env.example` documents required variables without secrets
- Cloudflare Workers is the default target
- vinext is tested rather than assumed
- OpenNext remains a fallback
- Keystatic GitHub mode is verified end-to-end
- deployment is separate from lightweight CI verification
- the project is independently deployable

---

# 22. Governing rule

> **Choose the Cloudflare adapter by demonstrated compatibility, keep provider mechanics at the edge of the repository, and prove the editing workflow—not just the homepage.**
