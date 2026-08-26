import { config, fields, singleton } from "@keystatic/core";

const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO;
const githubPathPrefix =
  process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_PATH_PREFIX;

function getStorage() {
  if (!githubRepo) {
    return { kind: "local" } as const;
  }

  const parts = githubRepo.split("/");

  if (parts.length !== 2 || !parts[0]?.trim() || !parts[1]?.trim()) {
    throw new Error(
      'NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO must use the format "owner/repository".',
    );
  }

  return {
    kind: "github",
    repo: { owner: parts[0], name: parts[1] },
    ...(githubPathPrefix ? { pathPrefix: githubPathPrefix } : {}),
  } as const;
}

/**
 * Keystatic configuration — schema and storage, nothing else.
 *
 * STORAGE
 * The base defaults to `local`, so a fresh clone gets a working `/keystatic`
 * with no GitHub App, credentials or setup. It writes straight to `content/`
 * on disk.
 *
 * GitHub mode is the intended *deployed* editing workflow
 * (briefs/06-keystatic.md §2): content is committed to the repository, reviewed
 * in pull requests, and picked up by the normal deployment. A project switches
 * by setting `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=owner/repository` and the GitHub
 * App variables listed in `.env.example`.
 *
 * SCHEMA
 * One singleton, five fields. The base proves the boundary works; it does not
 * model a site. Collections — people, events, news, projects — belong to
 * profiles and arrive when a project actually needs them
 * (briefs/03-content-architecture.md §19). Adding one here would give every
 * generated site a content model it never asked for.
 *
 * Every field is required, because the homepage cannot render without it.
 * Optional means "genuinely optional content", not "flexible".
 */
export default config({
  storage: getStorage(),

  ui: {
    brand: { name: "Site content" },
  },

  singletons: {
    site: singleton({
      label: "Site",
      path: "content/site",
      format: { data: "json" },
      schema: {
        name: fields.text({
          label: "Site name",
          description: "The full name, used in the header and page titles",
          validation: { isRequired: true },
        }),
        shortName: fields.text({
          label: "Short name",
          description: "A compact form for tight spaces",
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: "Description",
          description: "One or two sentences describing the site",
          multiline: true,
          validation: { isRequired: true },
        }),
        defaultSeoTitle: fields.text({
          label: "Default SEO title",
          description: "Used when a page does not set its own title",
          validation: { isRequired: true },
        }),
        defaultSeoDescription: fields.text({
          label: "Default SEO description",
          description: "Used when a page does not set its own description",
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
  },
});
