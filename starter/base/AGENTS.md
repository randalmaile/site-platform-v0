# AGENTS.md

Project rules for AI agents live in [CLAUDE.md](CLAUDE.md). Read that first.

This file exists to host the managed block below, which `next dev` rewrites on
every run. Keeping it here means `CLAUDE.md` stays hand-authored and stable
instead of changing on its own each time someone starts the dev server.

Do not merge the two files. `CLAUDE.md` is the project's, this one is Next's.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
