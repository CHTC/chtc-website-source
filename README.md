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
