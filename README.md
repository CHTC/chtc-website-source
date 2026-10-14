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

`pnpm build` runs, in order: `prebuild` (clears the remote-image manifest shards), `next build` (static export into `out/`), then `postbuild` which validates every remote image the pages recorded, generates the optimised image variants (`next-image-export-optimizer`), writes the sitemap, and emits a meta-refresh stub for every legacy URL (`static-redirects.json` + `redirects/*.json` + rules computed from the content repositories).

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
- `content/` — local content: documentation markdown and menus, jobs, projects, fellowships.
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
| `_uw-research-computing/<name>.md` | `content/uw-research-computing/docs/<name>.md` |
| `_data/htc-guide-menu.yml`, `_data/hpc-guide-menu.yml`, `_data/uw-research-computing-menu.yml` | `content/uw-research-computing/menus/` (same file names, same shape) |
| `_data/user-portal-menu.yaml`, `_data/user-portal-sections.yaml` | `content/uw-research-computing/menus/` |
| `_data/learning-resources.yml`, `_data/gpus.yaml` | `content/uw-research-computing/data/` |
| `images/` | `public/images/` (URLs are still `/images/...`) |
| `fellowships/index.md`, `_data/fellowships/*` | `content/fellowships/program.md`, `content/fellowships/reports/<year>/` |
| `_data/main-menu.yml` | the `pages` array in `app/layout.tsx` |
| Top-level pages (`htc.md`, `talk-to-us.md`, `faculty-resources.md`, …) | `app/<name>/page.mdx` or `app/<name>/page.tsx` |
| `_news`, `_events`, `_presentations`, `staff-list` submodules | gone; fetched at build from `CHTC/Articles`, `CHTC/Events`, `CHTC/Presentations`, `CHTC/staff-list` |
| `_includes/`, `_layouts/`, `_sass/` | React components in `components/` and `app/uw-research-computing/_components/`, theme in `app/theme.ts`, `app/globals.css` |
| `.well-known/` | `public/.well-known/` (unchanged) |
| `_config.yml` | `site.config.ts` |

To preview your change locally, follow **Develop** above. Every pull request against `main` also runs the full build in GitHub Actions, so a broken link or a bad YAML file shows up there before it is merged.

### Editing a guide

Guides are the markdown files in `content/uw-research-computing/docs/`. The file path is the URL: `docs/gpu-jobs.md` is `/uw-research-computing/gpu-jobs/` and `docs/htc/foo.md` would be `/uw-research-computing/htc/foo/`.

The files are GitHub-flavored markdown and are no longer run through Jekyll, so:

- **No Liquid.** `{% include %}`, `{% capture %}`, `{{ site.… }}` and `{% comment %}` are not processed and will appear as literal text.
- **Links are absolute and end with a slash**: `/uw-research-computing/gpu-jobs/`, not `gpu-jobs.html` or `{{ '/uw-research-computing/gpu-jobs' | relative_url }}`. Anchors still work: `/uw-research-computing/gpu-jobs/#b-submit-jobs-using-gpus-in-chtc`.
- **Headings** in the body start at `#`. The page title comes from the frontmatter and is the page's only `<h1>`; every heading in the body is rendered one level down, and each gets an `id` generated from its text, so the old empty `<span name="…">` anchors are not needed.
- **Table of contents.** The Liquid TOC block became a plain HTML wrapper with a markdown list inside. Copy this, or leave it out:

  ```html
  <div class="uw-toc">
  <p class="uw-toc-title">Table of Contents</p>

  - [Available CHTC GPUs](#a-available-chtc-gpus)
  - [Submit jobs using GPUs](#b-submit-jobs-using-gpus-in-chtc)

  </div>
  ```

- **Code blocks** use normal fences and are syntax highlighted. A `condor` fence is highlighted as a submit file.
- **Tables** need a header row and a `|---|---|` separator line (kramdown was forgiving about this; GitHub markdown is not).
- **kramdown attribute syntax** (`{: .class}`, `{:target="_blank"}`) does not work. Use an HTML tag instead.
- Raw HTML (`<details>`, `<iframe>`, `<table>`, tip boxes like `<div class="md-tip">`) works as before. Leave a blank line after an opening block tag before writing markdown inside it, otherwise the markdown is treated as HTML text.
- `<script>` tags are stripped.

Frontmatter is mostly what it was. `title`, `layout` and `guide` are still used; `highlighter` and `published` are ignored. One field is new and worth filling in: `description`, a sentence or two used as the page's meta description and in search-engine previews. (The migration generated one from each guide's first paragraph.) `legacy_url` records where the page lived on the Jekyll site and is informational only.

### Adding a guide and placing it in a sidebar

1. Create `content/uw-research-computing/docs/<name>.md` with this frontmatter:

   ```yaml
   ---
   layout: guide          # `guide` for HTC pages, `hpc_layout` for HPC pages
   title: My New Guide
   description: One or two sentences describing the page.
   guide:
     category: Special use cases
     tag:
       - htc              # `htc`, `hpc`, or both; this picks which sidebar menu is shown
   ---
   ```

   Nothing registers the file. The build finds every `.md` under `docs/` and makes a page for it at `/uw-research-computing/<name>/`.

2. Add a link to the sidebar in `content/uw-research-computing/menus/htc-guide-menu.yml` or `hpc-guide-menu.yml`. The entry goes under one of the existing sections (or a new one) and looks like the others:

   ```yaml
   - text: "Submit jobs"
     icon: "bi bi-send"
     links:
       - text: "My New Guide"
         url: "/uw-research-computing/my-new-guide"
         icon: ""
   ```

   The same YAML also builds the HTC Guides and HPC Guides index pages, so the guide appears there automatically. Icons are Bootstrap Icons class names, as before; the common ones are mapped to equivalent icons at build.

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
