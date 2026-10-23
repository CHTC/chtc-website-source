# CHTC Website

The public website of the Center for High Throughput Computing (chtc.cs.wisc.edu), built with Next.js (App Router, static export), Material UI and `@chtc/web-components`.

It replaces the Jekyll site. Editorial content is **not** stored here: news articles, events, presentations and the staff list are fetched at build time from the shared CHTC content repositories (`CHTC/Articles`, `CHTC/Events`, `CHTC/Presentations`, `CHTC/staff-list`) and filtered to entries whose `publish_on` includes `chtc`. The research-computing documentation (`content/uw-research-computing/`), the hand-authored pages under `app/`, and the YAML data under `content/` are local to this repository.

## Develop

```bash
pnpm install
export GITHUB_TOKEN=$(gh auth token)   # avoids GitHub API rate limits during content fetches
pnpm dev
```

`pnpm dev` runs Turbopack on http://localhost:3000.

## Build

```bash
pnpm build
```

`pnpm build` runs, in order: `prebuild` (clears the remote-image manifest shards), `next build` (static export into `out/`), then `postbuild` which validates every remote image the pages recorded, generates the optimised image variants (`next-image-export-optimizer`), writes the sitemap, emits a meta-refresh stub for every legacy URL (`static-redirects.json` + `redirects/*.json` + rules computed from the content repositories), builds the site search index with [Pagefind](https://pagefind.app) (`out/pagefind/`; the header's search box loads it in the browser, so there is nothing to run and search is unavailable in `next dev`), and writes `llms.txt` and `llms-full.txt` (an index and the full Markdown text of the campus computing guides, for LLM consumption; `scripts/llms-full.mjs`).

`npx next build` on its own skips pre/postbuild; use `pnpm build` whenever images, redirects or the sitemap matter.

Content fetched from GitHub is cached in `.next/cache/fetch-cache` for an hour; `rm -rf .next/cache` to force a refresh.

## Checks

```bash
npx tsc --noEmit
pnpm lint
pnpm compare:migration        # coverage of the legacy site's URLs (needs ../chtc-website-source/_site)
python3 scripts/audit-export.py out   # metadata / canonical / image audits over the export
```

## Layout

- `app/` — routes. `page.tsx` is always a server component; client-side pieces live in `view.tsx` or `_components/`.
- `components/` — shared components (Header, Footer, MarkdownContainer, …).
- `content/` — local content: documentation MDX and menus, jobs, fellowships.
- `utils/` — the thin site-specific wrappers over the library's content getters (`'chtc'` filter + remote image recording), metadata helpers.
- `public/` — static assets; `public/images` is the image optimiser's source folder.
- `scripts/` — build-time scripts (redirects, image validation, migration comparison, audits).
- `site.config.ts` — the site's identity (name, description, share image) read by the layout, manifest and metadata helpers.

See `MIGRATION_HANDOFF.md` for the migration's decisions and `.ai/instructions.md` for coding conventions.

## NextJS Transition

The site moved from Jekyll to Next.js in October 2026. The content you used to edit still exists, but it lives in different places and a few rules changed. This section covers the day-to-day tasks people did on the Jekyll repo, ordered by how often they came up.

### Where things moved

| What you edited before | Where it is now |
| --- | --- |
| `_uw-research-computing/<name>.md` | `content/uw-research-computing/docs/<name>.mdx` |
| `_data/htc-guide-menu.yml`, `_data/hpc-guide-menu.yml`, `_data/uw-research-computing-menu.yml` | `content/uw-research-computing/menus/` (same file names, same shape) |
| `_data/user-portal-menu.yaml`, `_data/user-portal-sections.yaml` | `content/uw-research-computing/menus/` |
| `_data/learning-resources.yml`, `_data/gpus.yaml` | `content/uw-research-computing/data/` |
| `images/` | `public/images/` (URLs are still `/images/...`) |
| `fellowships/index.md`, `_data/fellowships/*` | `content/fellowships/program.md`, `content/fellowships/reports/<year>/` |
| `_data/main-menu.yml` | the `pages` array in `app/layout.tsx` |
| Top-level pages (`htc.md`, `talk-to-us.md`, `faculty-resources.md`, …) | `app/<name>/page.mdx` or `app/<name>/page.tsx` |
| `staff/docs/*.md` | `content/uw-research-computing/docs/staff/*.mdx` (internal, `noindex`) |
| `_news`, `_events`, `_presentations`, `staff-list` submodules | gone; fetched at build from `CHTC/Articles`, `CHTC/Events`, `CHTC/Presentations`, `CHTC/staff-list` |
| `_includes/`, `_layouts/`, `_sass/` | React components in `components/` and `app/uw-research-computing/_components/`, theme in `app/theme.ts`, `app/globals.css` |
| `.well-known/` | `public/.well-known/` (unchanged) |
| `_config.yml` | `site.config.ts` |

To preview your change locally, follow **Develop** above. Every pull request against `main` also runs the full build in GitHub Actions, so a broken link or a bad YAML file shows up there before it is merged.

### Editing a guide

Guides are the MDX files in `content/uw-research-computing/docs/`. The file path is the URL: `docs/gpu-jobs.mdx` is `/uw-research-computing/gpu-jobs/` and `docs/htc/foo.mdx` would be `/uw-research-computing/htc/foo/`.

MDX is GitHub-flavored markdown plus components, so:

- **The standard components need no import**: `<Tip>`, `<Terminal>`, `<Columns>` and the rest below are available by name. [Doc components](/uw-research-computing/staff/doc-components/) lists every one with an example. Anything else, from the site or a package, is imported at the top of the file, below the frontmatter: `import Chip from '@mui/material/Chip';`.

- **Links are absolute and end with a slash**: `/uw-research-computing/gpu-jobs/`. Anchors still work: `/uw-research-computing/gpu-jobs/#b-submit-jobs-using-gpus-in-chtc`.
- **Headings** in the body start at `#`. The page title comes from the frontmatter and is the page's only `<h1>`; every heading in the body is rendered one level down, and each gets an `id` generated from its text.
- **Table of contents.** Every page gets an "On this page" list of its top two heading levels beside the body, generated from the headings. Nothing to write or keep in sync.
- **Code blocks** use normal fences and are syntax highlighted. A `condor` fence is highlighted as a submit file. Wrap a fence in `<Terminal>` for a terminal session (dark) or `<File>` for a file's contents (blue rule); plain fences are for everything else.
- **Callouts** are `<Tip header="Note about NetIDs">…</Tip>`; leave out `header` for a plain box.
- **Other blocks**: `<Button href="…">` inside `<ButtonRow>`, `<Columns>` of `<Column>` (`accent` for the red rule, `width="30%"` for a fixed share), `<Cards>` of `<Card icon="…" title="…">`, `<MiniBar>` around a heading, `<CommandTable>` around a command table, `<Footnote>` under a table. Data-driven pieces are `<GpuTable owner="campus" />`, `<UpcomingEvents tag="…" limit={2} />`, `<ExcerptTabs flag="software_icon" more />` and `<FacilitatorGrid />`. The standard set is the map in `app/uw-research-computing/_components/docComponents.tsx`.
- **Leave a blank line** after an opening component tag and before its closing tag; otherwise the markdown inside is treated as inline text.
- **Raw HTML** (`<details>`, `<iframe>`, `<img>`) works but must be valid JSX: `className` not `class`, `style={{ maxWidth: '60%' }}` not a string, `<br />` and `<img … />` self-closed, `{/* comments */}` not `<!-- -->`. A `<` or `{` in prose that is not a tag must be escaped: `\<1 GB`, `\{`.
- **Tables** need a header row and a `|---|---|` separator line. HTML tables with multi-line cells do not compile; use a pipe table with `<br />` instead.
- `npx tsx scripts/check-docs.mts` compiles every guide and reports every error at once, including a component that is neither standard nor imported; `next build` stops at the first.

Frontmatter is validated at build (`app/uw-research-computing/_lib/docs.ts`); an unknown field or a wrong type fails the build with the file name.

| Field | Meaning |
| --- | --- |
| `title` | The page title, rendered as the `<h1>`. |
| `description` | One or two sentences for the meta description and search previews. |
| `sidebar` | `[htc]`, `[hpc]` or `[htc, hpc]`: which guide sidebars the page shows. Leave out for a standalone page. |
| `category`, `order` | Where the guide sits among the guides (informational). |
| `width` | `narrow` for long-form prose. |
| `software`, `software_icon`, `basic_scripting`, `icon`, `alt_title` | Used by the software overview and basic-scripting tabs. |

A page's excerpt (shown on those tabs) is everything before a `{/* more */}` line, or its first paragraph.

The same material, with every block rendered as an example, is on the site at `/uw-research-computing/staff/writing-documentation/` (source: `content/uw-research-computing/docs/staff/writing-documentation.mdx`). Pages under `docs/staff/` are internal: they set `noindex: true`, which keeps them out of search engines, the sitemap and the llms export.

### Adding a guide and placing it in a sidebar

1. Create `content/uw-research-computing/docs/<name>.mdx` with this frontmatter:

   ```yaml
   ---
   title: My New Guide
   description: One or two sentences describing the page.
   sidebar:
     - htc                # `htc`, `hpc`, or both; this picks which sidebar menu is shown
   category: Special use cases
   ---
   ```

   Nothing registers the file. The build finds every `.mdx` under `docs/` and makes a page for it at `/uw-research-computing/<name>/`.

2. Add a link to the sidebar in `content/uw-research-computing/menus/htc-guide-menu.yml` or `hpc-guide-menu.yml`. The entry goes under one of the existing sections (or a new one) and looks like the others:

   ```yaml
   - text: "Submit jobs"
     icon: Send
     links:
       - text: "My New Guide"
         url: "/uw-research-computing/my-new-guide"
   ```

   The same YAML also builds the HTC Guides and HPC Guides index pages, so the guide appears there automatically. `icon` is optional and names a Material icon from the list in `components/GuideSidebar/GuideIcon.tsx` (`RocketLaunch`, `Send`, `MenuBook`, `OpenInNew`, …); an unknown name fails the build. A guide that is in both sidebars gets `?compute-type=` on its menu links so it shows only the sidebar it was reached from.

3. The section's top navigation (Get Started, User Portal, How To's, …) is `menus/uw-research-computing-menu.yml`, unchanged in shape. The site-wide header menu is now the `pages` array in `app/layout.tsx`, which is TypeScript rather than YAML; ask a developer or copy an existing entry.

Removing or renaming a guide changes its URL. Add an entry to `redirects/docs.json` so existing links keep working; the build emits a redirect page for every entry:

```json
{
  "source": "/uw-research-computing/old-name/",
  "destination": "/uw-research-computing/new-name/",
  "text": "My New Guide"
}
```

### Editing the User Portal

The User Portal page is built entirely from YAML in `content/uw-research-computing/menus/`:

- `user-portal-sections.yaml` is the card grid. Each section has a `name`, optional `large: true`, and `links` with `text`, `url`, `icon` and a markdown `description`. The "Featured learning resources" section has `source: learning-resources` instead of links and is filled from the learning resources file.
- `user-portal-menu.yaml` is the link column beside the cards: a list of `name` groups, each with `text`/`url` links.

The learning resources themselves are in `content/uw-research-computing/data/learning-resources.yml`; the comment block at the top of that file documents every field. `featured: true` puts a resource on the portal. The GPU table shown in the GPU guide is `content/uw-research-computing/data/gpus.yaml`.

URLs in all of these files can be written as `/uw-research-computing/foo`, `/uw-research-computing/foo.html`, or relative like `htc/guides.html`; the build normalizes them to the trailing-slash form.

### Adding an image

Put the file in `public/images/` and reference it as `/images/<file>` from a guide, exactly as before:

```markdown
![CHTC Globus endpoints](/images/guides-globus-endpoints.png)
```

or with an HTML tag when you need sizing:

```html
<p style="text-align:center"><img src="/images/checkpointing-exit-driven.jpg" alt="Exit-driven checkpointing" width="950"></p>
```

What is different: every `.jpg`, `.png`, `.webp` and `.avif` under `public/images/` gets a set of resized variants generated during the build, and the result is cached between CI runs. A handful of screenshots is fine. Very large originals (many-megapixel photos, multi-MB PNGs) slow every build, so size them for the web before committing. SVGs and GIFs are served as-is.

### Editing a top-level page (MDX)

The hand-written pages that used to be markdown at the repo root (`htc.md`, `approach.md`, `talk-to-us.md`, `faculty-resources.md`, `research-facilitation.md`, `icon_credits.md`) are now `app/<name>/page.mdx`. MDX is markdown that can also contain React components, and this is the biggest change in editing experience.

Looking at `app/htc/page.mdx`:

```mdx
import Figure from '@/components/Figure';
import { listingMetadata } from '@/utils/metadata';

export const metadata = listingMetadata(
  'What is High Throughput Computing?',
  'One-sentence description used for the page metadata.',
  '/htc/'
);

# What is High Throughput Computing?

Ordinary **markdown** follows. Links are absolute with a trailing slash: [our guides](/uw-research-computing/).

<Figure src='/images/htc-workflow.webp' alt='…' width={1467} height={936} caption='…' />
```

Rules that differ from plain markdown:

- There is no frontmatter. The title and description are the `export const metadata` block at the top; keep the path argument matching the page's URL.
- `<` and `{` are JSX syntax. Write `&lt;` and `\{` when you mean the literal characters in prose (for example `memory &lt; 4GB`). Inside code fences they are fine.
- Raw HTML attributes use JSX names: `class` becomes `className`, `style` takes an object rather than a string. Prefer plain markdown where possible.
- Images use the `Figure` component or a markdown image. Markdown images render as plain `<img>`.
- Pages that were `.html` in Jekyll (`events.html`, the research page, the home page) are now `page.tsx` React components and need a developer.

Run `pnpm dev` and open the page to check it; an MDX syntax error shows as a build error in the terminal with the line number.

### News, events, presentations and staff

These are no longer in this repository at all. The Jekyll site pulled them in as git submodules (`_news`, `_events`, `_presentations`, `staff-list`); the Next.js site fetches them straight from GitHub during the build. There are no submodules to update and nothing to bump here.

Keep editing them where they live: `CHTC/Articles`, `CHTC/Events`, `CHTC/Presentations` and `CHTC/staff-list`. An entry appears on this site when its `publish_on` list includes `chtc`. News articles are the ones with `type: news`; `type: user` articles are shown under `/spotlights/`.

Because the site is static, a change in those repositories does not appear until the next build. GitHub Actions rebuilds and deploys the site three times a day (06:00, 12:00 and 18:00 UTC) and on every push to `main`; to publish sooner, run the "Deploy Next.js site to Pages" workflow by hand from the Actions tab. Locally, the fetched content is cached for an hour (`rm -rf .next/cache` to refresh).
