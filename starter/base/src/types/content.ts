/**
 * Application-facing content types.
 *
 * These are the shapes presentation code works with. They are declared
 * separately from the Keystatic schema so the CMS's own field types never reach
 * a component — that is the boundary
 * (briefs/03-content-architecture.md §13).
 *
 * Keep this file small. A type belongs here when more than one module shares
 * it; anything local belongs next to the code that owns it. This is not a
 * dumping ground for every type in the project.
 */

/** Site-wide editable identity. One canonical record, edited at /keystatic. */
export type Site = {
  name: string;
  shortName: string;
  description: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
};
