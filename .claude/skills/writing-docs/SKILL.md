---
name: writing-docs
description: Write, edit or audit the Campus Computing guides (the MDX files in content/uw-research-computing/docs/), and add or audit the components those guides use (app/uw-research-computing/_components/). Use whenever someone asks to write a new guide, change or restructure an existing one, review or "audit" a guide for best practices, add a component for the docs, or check a new doc component against the repository's code standards.
---

# Writing and auditing the Campus Computing guides

The rules for the guides live in the guides themselves, so they stay current. Read them before
doing anything else; do not work from memory of an earlier version.

## Read first

Read these in full every time:

1. `content/uw-research-computing/docs/staff/writing-documentation.mdx`: where files live, the
   frontmatter, Markdown conventions, using components and what MDX is strict about.
2. `content/uw-research-computing/docs/staff/doc-components.mdx`: every component, its options,
   one example of each, building on MUI and how to add a component.
3. The "Editing a guide" section of `README.md`.

When the work touches a component, also read:

4. `.ai/instructions.md`: the code standards for this repository (server and client
   components, naming, props, MUI and the `sx` prop, accessibility).
5. `app/uw-research-computing/_components/docComponents.tsx` (the standard set) and
   `DocBlocks.tsx`, to match how the existing components are written.

The frontmatter schema is enforced by `app/uw-research-computing/_lib/docs.ts` (`Frontmatter`);
read it when a field is in question.

## Writing or editing a guide

Follow the "Adding a guide" steps in `writing-documentation.mdx`. In particular:

- Use the standard components by name; do not import them. Import anything else (an MUI
  component, a component for this guide only) at the top of the file, below the frontmatter.
- Prefer a standard component to raw HTML or a new component. Prefer an MUI component
  imported directly to a new component used by one guide.
- Add the guide to a sidebar menu in `content/uw-research-computing/menus/`, and add a redirect
  in `redirects/docs.json` when a guide is renamed or removed.
- Match the voice of the surrounding guides: plain, direct, second person, short sentences.

## Auditing a guide

When asked to audit or review a guide, check it against the pages read above and report
findings. Do not change the file unless asked to fix them.

Check at least:

- **Frontmatter**: `title` and `description` present; `description` is one or two sentences
  that describe the page; `sidebar` set and the guide listed in that menu; staff pages have
  `noindex: true`; `software`, `software_icon` and `basic_scripting` guides have a
  `{/* more */}` excerpt marker that ends a sensible excerpt.
- **Components and imports**: standard components are used by name, not imported; every other
  component is imported below the frontmatter, and every import is used.
- **Headings**: the body starts at `#` or `##`, no level is skipped, and headings are Markdown,
  not raw `<h2>` tags (raw tags are converted, but Markdown is the convention).
- **Links**: internal links are absolute and end with a slash (`/uw-research-computing/x/`);
  anchors exist on the target page; link text says where it goes (not "here").
- **Images**: under `public/images/`, referenced as `/images/...`, with alt text that
  describes the image.
- **Code**: every fence names a language; `<Terminal>` for a session at the prompt, `<File>` for
  a file's contents; command placeholders are in backticks.
- **Components**: used as documented in `doc-components.mdx`, with blank lines inside every
  block component; no raw HTML where a component exists (`<div>` layouts, `<a class="btn">`).
- **MDX**: `className` not `class`, object `style={{ … }}`, self-closed tags, `{/* */}` comments,
  `\<` and `\{` escaped in prose.
- **Content**: accurate for the current systems, no stale dates or "coming soon", no private
  information (these pages are public, including staff pages).

Then run `npx tsx scripts/check-docs.mts` and include anything it reports.

Report findings most important first, each with `path:line`, what is wrong and the fix, for
example:

```
content/uw-research-computing/docs/gpu-jobs.mdx:42  Link to /uw-research-computing/gpu-lab has no
trailing slash. Use /uw-research-computing/gpu-lab/.
```

End with a one-line verdict. If nothing is wrong, say so plainly.

## Adding a component

Follow "Adding your own component" in `doc-components.mdx`, and write the component to the
standards in `.ai/instructions.md`:

- A server component unless it needs state, event handlers or browser APIs; then `'use client'`
  as the first line, with the interactive part kept as small as possible.
- A `PascalCase` file named after the component, default-exported, with its props typed inline
  at the top of the file.
- Built from MUI components and styled with the `sx` prop, using theme values
  (`primary.main`, spacing units, breakpoints) rather than hard-coded colors and pixel sizes.
- Semantic HTML and accessible: real headings, links and buttons, alt text, labels.
- If several guides will use it, added to the standard set in `docComponents.tsx` and given a
  section with an example in `doc-components.mdx` (kept in alphabetical order, and added to
  the table at the top of the components list). A component for one guide is imported by that
  guide instead.

## Auditing a component

When asked to audit a new or changed component, check it against `.ai/instructions.md` and the
list above, and against the existing components for consistency. Also check that:

- a standard component is in the `docComponents()` map and documented in `doc-components.mdx`
  with a working example; a one-guide component is imported by that guide;
- its props are optional where a sensible default exists, and the documentation lists them;
- it renders Markdown children correctly (blank lines inside the tags in the example);
- it does not duplicate an existing component or an MUI component that would do as well.

Report findings in the same format as a guide audit.

## Verify

After writing or changing anything, run:

```shell
npx tsx scripts/check-docs.mts   # every guide compiles; no unknown components
npx tsc --noEmit                 # types, when a component changed
npx eslint app/uw-research-computing
```

A full `pnpm build` is the final check before a pull request. Report the results as they are;
if a check fails, say so with its output.
