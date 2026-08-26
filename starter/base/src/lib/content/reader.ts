import "server-only";

import { createReader } from "@keystatic/core/reader";
import { createGitHubReader } from "@keystatic/core/reader/github";

import keystaticConfig from "../../../keystatic.config";

/**
 * Central content-storage boundary.
 *
 * Normal application code should not know whether content is coming from:
 *
 * - the local repository filesystem, or
 * - GitHub at runtime.
 *
 * Pages, layouts and domain content modules should consume plain typed data
 * through `src/lib/content/*` and should not import Keystatic directly.
 *
 * `server-only` enforces that this module cannot be imported by Client
 * Components.
 */

/**
 * Local development defaults to filesystem-backed content.
 *
 * Deployed environments that cannot read the repository filesystem at runtime
 * should set:
 *
 *   CONTENT_SOURCE=github
 *
 * and provide:
 *
 *   GITHUB_CONTENT_REPO=owner/repository
 *   GITHUB_CONTENT_TOKEN=<server-side GitHub token>
 *
 * Two optional variables cover repositories where the application is not the
 * repository root and branches other than the default one:
 *
 *   GITHUB_CONTENT_REF=<branch, tag or commit>   defaults to HEAD
 *   GITHUB_CONTENT_PATH_PREFIX=<directory>       defaults to the repository root
 *
 * `GITHUB_CONTENT_PATH_PREFIX` is what a generated site leaves unset: its
 * `content/` directory sits at the repository root, so Keystatic's configured
 * paths already resolve. It exists because the platform repository itself keeps
 * the application under `starter/base/`, and a reader that could not express
 * that would be untestable in the repository that owns it.
 *
 * We use an explicit CONTENT_SOURCE switch rather than inferring behavior from
 * the presence of credentials. That makes deployment mistakes fail loudly
 * instead of silently falling back to filesystem access.
 */
const contentSource = process.env.CONTENT_SOURCE ?? "local";

/**
 * GitHub's REST API rejects any request that arrives without a `User-Agent`
 * header, with `403 Request forbidden by administrative rules`.
 *
 * Keystatic's GitHub reader calls `fetch` directly and offers no way to add a
 * header. Node's `fetch` supplies a default `User-Agent`, so this never appears
 * in development or in a Node deployment; `workerd`'s `fetch` does not, so
 * every content read fails inside a Cloudflare Worker.
 *
 * The wrapper is deliberately narrow: it applies only to the two GitHub hosts
 * Keystatic talks to, only fills in a header that is absent, and delegates to
 * whatever `fetch` is currently installed, so framework-level fetch caching
 * still applies. It lives here because this file already owns Keystatic's
 * mechanics — the workaround must not leak into application code.
 *
 * It is re-asserted before each read rather than installed once, because
 * vinext replaces `globalThis.fetch` with its own caching wrapper on the first
 * request — after application modules have evaluated — and that wrapper
 * delegates to the `fetch` it captured at startup. Anything installed at module
 * scope is therefore discarded before it is ever used.
 *
 * Remove it when Keystatic sends a `User-Agent` of its own; see
 * `MAINTENANCE.md`.
 */
const GITHUB_HOSTS = new Set(["api.github.com", "raw.githubusercontent.com"]);

const userAgentMarker = Symbol.for("site-platform.github-user-agent");

type MarkedFetch = typeof fetch & { [userAgentMarker]?: true };

function ensureGitHubUserAgent() {
  const currentFetch = globalThis.fetch as MarkedFetch;

  if (currentFetch[userAgentMarker]) {
    return;
  }

  const withUserAgent: MarkedFetch = function fetchWithGitHubUserAgent(
    input,
    init,
  ) {
    const url = input instanceof Request ? input.url : String(input);

    let host: string;

    try {
      host = new URL(url).host;
    } catch {
      return currentFetch(input, init);
    }

    if (!GITHUB_HOSTS.has(host)) {
      return currentFetch(input, init);
    }

    const headers = new Headers(
      init?.headers ?? (input instanceof Request ? input.headers : undefined),
    );

    if (!headers.has("user-agent")) {
      headers.set("user-agent", "site-platform-content-reader");
    }

    return currentFetch(input, { ...init, headers });
  };

  withUserAgent[userAgentMarker] = true;
  globalThis.fetch = withUserAgent;
}

function createContentReader() {
  /**
   * GitHub-backed runtime reader.
   *
   * This is intended for deployed runtimes such as Cloudflare Workers, where
   * `process.cwd()` does not provide access to the repository's `content/`
   * directory.
   */
  if (contentSource === "github") {
    const repo = process.env.GITHUB_CONTENT_REPO;
    const token = process.env.GITHUB_CONTENT_TOKEN;
    const ref = process.env.GITHUB_CONTENT_REF;
    const pathPrefix = process.env.GITHUB_CONTENT_PATH_PREFIX;

    if (!repo || !token) {
      throw new Error(
        "CONTENT_SOURCE=github requires GITHUB_CONTENT_REPO and GITHUB_CONTENT_TOKEN.",
      );
    }

    /**
     * Keystatic expects repositories in the exact `owner/repository` shape.
     *
     * Validate the runtime string before narrowing its TypeScript type.
     */
    const parts = repo.split("/");

    if (parts.length !== 2 || !parts[0]?.trim() || !parts[1]?.trim()) {
      throw new Error(
        'GITHUB_CONTENT_REPO must use the format "owner/repository".',
      );
    }

    const githubRepo = repo as `${string}/${string}`;

    const githubReader = createGitHubReader(keystaticConfig, {
      repo: githubRepo,
      token,
      ...(ref ? { ref } : {}),
      ...(pathPrefix ? { pathPrefix } : {}),
    });

    /**
     * Every route into the reader goes through a property access, so this is
     * the one place that reliably runs before Keystatic issues a request.
     */
    return new Proxy(githubReader, {
      get(target, property, receiver) {
        ensureGitHubUserAgent();
        return Reflect.get(target, property, receiver);
      },
    });
  }

  /**
   * Local filesystem reader.
   *
   * This remains the default for normal `npm run dev` development. Keystatic
   * reads directly from the working tree, so edits made through `/keystatic`
   * update the local `content/` files immediately.
   */
  return createReader(process.cwd(), keystaticConfig);
}

/**
 * Shared Keystatic reader used by the content-domain modules.
 *
 * Example:
 *
 *   site.ts
 *   events.ts
 *   people.ts
 *
 * Application routes should import functions from `@/lib/content`, not import
 * this reader directly.
 */
export const reader = createContentReader();
