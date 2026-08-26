import { config, fields, singleton } from "@keystatic/core";

/**
 * Keystatic configuration — schema and storage, nothing else.
 *
 * STORAGE
 * The base ships with `local`, so a fresh clone gets a working `/keystatic`
 * with no GitHub App, no credentials and no setup. It writes straight to
 * `content/` on disk.
 *
 * GitHub mode is the intended *deployed* editing workflow
 * (briefs/06-keystatic.md §2): content is committed to the repository, reviewed
 * in pull requests, and picked up by the normal deployment. A project switches
 * by replacing the storage block below with its own repository and setting the
 * four KEYSTATIC_* variables listed in `.env.example`:
 *
 *   storage: {
 *     kind: "github",
 *     repo: { owner: "your-org", name: "your-repo" },
 *   },
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
  storage: {
    kind: "local",
  },

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
