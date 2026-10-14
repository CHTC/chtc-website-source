# CHTC Website — Jekyll → Next.js Migration Guide

**Audience: the AI agent(s) performing the migration.** Not a tutorial. Every section is
either a decision already made for you, a file to copy, or a trap to avoid.

This guide is written from the completed OSG migration (this repository). That migration
took ~24 commits, several of which undid earlier work. **The dead ends are documented in
§9 so you skip them.** Where this guide says "do X", X is the end state OSG arrived at
after the rework — go straight there.

---

## 0. Paths and preconditions

| Role | Path |
| --- | --- |
| **Target** — the new CHTC Next.js site. Write here. | `/Users/clock/WebstormProjects/chtc-website-nextjs` |
| **Legacy source** — the CHTC Jekyll site. Read-only. | `/Users/clock/WebstormProjects/chtc-website-source` |
| **Reference implementation** — the finished OSG site. Read-only; copy from it. | `/Users/clock/WebstormProjects/osg-htc.github.io` |
| Shared component library (source, if you need to change it) | `/Users/clock/WebstormProjects/path-web-components` → `CHTC/web-components` |

Before starting, confirm:

```bash
git -C /Users/clock/WebstormProjects/chtc-website-source submodule update --init
node -p "require('/Users/clock/WebstormProjects/chtc-website-nextjs/package.json').dependencies['@chtc/web-components']"
```

The second must print `^2.0.10` or higher. 2.0.10 is the first version with the `Event`
module, the content metadata builders, and the `imageComponent` seam — **all three were
built during the OSG migration specifically so the next site would not have to
re-implement them.** If the version is lower, upgrade before doing anything else.

**Standing constraint from the repository owner:** never push, open PRs, or comment on
PRs/issues unless explicitly told to in the current instruction. Fix locally and report.
Avoid compound shell commands (`a && b`); the owner approves tool calls individually and
a chained command cannot be reviewed step by step.

---

## 1. The finding that determines the whole architecture

`chtc-website-source` keeps its editorial content in **git submodules pointing at the same
shared repositories the OSG Next.js site already fetches from**:

```
_news          → github.com/CHTC/Articles
_events        → github.com/CHTC/Events
_presentations → github.com/CHTC/Presentations
staff-list     → github.com/CHTC/staff-list
```

So **do not migrate this content.** Do not copy markdown into the new repo, do not write
parsers. Fetch it at build time with `@chtc/web-components/content`, filtered to `'chtc'`
instead of `'osg'`. Every frontmatter file carries `publish_on: [chtc|osg|path|htcondor|…]`.

Current scope from that data (verified by parsing the repos):

| Collection | Published on `chtc` |
| --- | --- |
| Articles | **105** — 63 `type: news`, 42 `type: user` |
| Events | fetch with `filterEvents(events, 'chtc')` |
| Presentations | fetch with `filterPresentations(presentations, 'chtc')` |
| Staff | the whole `CHTC/staff-list` repo |

The migration is therefore **three distinct jobs**, and only the third is large:

1. **Content-backed routes** (news, user stories, events, presentations, team) — near-total
   reuse of OSG's code with `'osg'` → `'chtc'`. Fast.
2. **Hand-authored pages** — 26 top-level `.md`/`.html` files. Mechanical.
3. **`_uw-research-computing`** — 105 markdown documents plus three YAML-driven sidebar
   menus. **This has no OSG analogue** and is the bulk of the work. See §8.

---

## 2. What CHTC does *not* need from OSG

Deleting scope early is the highest-value thing you can do. Verified by grepping the
legacy site's own code (`assets/js`, `_includes`, `_layouts`, top-level pages) for
`elastic`/`gracc`/`topology`/`adstash` — the only hits are the words appearing in article
prose inside the `_news` submodule:

- **`utils/adstash.ts` (761 lines) — not needed.** CHTC's legacy site makes no
  Elasticsearch, GRACC, or topology queries. There are no live usage-statistics pages, no
  project/institution explorers, no per-entity generated detail pages.
- **`components/services/**` explorers, `PieChart`, `FacilityExplorer`, chart.js — not
  needed** unless a CHTC page turns out to need a chart.
- **Pelican file browser / `scripts/copy-pelican-sw.mjs` / `public/downloadServiceWorker.js`
  — not needed.** That is an OSDF feature.
- **`public/data/valid-namespaces.json`, `alphafold-caching.json`, `utils/dataRepositories.ts`
  — not needed.**

If you find a CHTC page that genuinely needs live data, add it deliberately and give the
fetch **retry-with-backoff** (see §9, dead end 1).

## 3. What CHTC needs that OSG never had

- **Site-wide search.** `_includes/head.html` and `_includes/navbar/navbar.html` load
  `assets/js/lunr.js` + `assets/js/search_bar.js`. OSG has no equivalent. Decide with the
  owner: a client-side index built at build time, or drop the feature. Do not port lunr.
- **A documentation collection** (`_uw-research-computing`, §8).
- **`_events_legacy`** — 29 events on the old permalink shape `/events/:year/:month/:title`
  (no day). These need redirect entries; they are not in the `CHTC/Events` submodule.
- **`_data/` YAML** that is genuinely local: `gpus.yaml`, `learning-resources.yml`,
  `fellowships/`, `jobs/`, `projects/`, and the menu files. `_data/team/` (130 files) is the
  legacy local copy of the staff list — **use the `staff-list` submodule instead**, and
  diff the two once to confirm nothing is lost.

---

## 4. Phase plan

Each phase ends with a verification gate. **Do not start the next phase on a red gate.**
Phases 3–6 are independent of each other and can run in parallel across agents; 1, 2 and 7
are serial.

| # | Phase | Gate |
| --- | --- | --- |
| 1 | Foundation: config, theme, layout, header/footer, redirect system | `pnpm build` green, homepage renders |
| 2 | Data layer: `utils/` content getters filtered to `'chtc'` | a script prints 105 articles, N events, N presentations, full staff |
| 3 | News + user stories (listing + detail) | pages exist for all 105 |
| 4 | Events + presentations | listing + detail render |
| 5 | Team, hand-authored pages, MDX content pages | each route renders |
| 6 | `_uw-research-computing` docs (§8) | all 105 docs reachable, sidebar works |
| 7 | Parity, redirects, images, metadata, CI (§5–7, §10) | `compare:migration` clean, audits pass |

Run after every phase:

```bash
npx tsc --noEmit
pnpm build
```

`npx next build` skips `prebuild`/`postbuild`. Use `pnpm build` whenever images,
redirects, or the sitemap matter.

---

## 5. Files to copy verbatim from the OSG repo

These are finished and debugged. Copy them, change the constants named, do not rewrite.

| Copy | To | Change |
| --- | --- | --- |
| `utils/remoteImages.ts` | same | nothing |
| `scripts/validate-remote-images.mjs` | same | nothing |
| `scripts/reset-remote-images.mjs` | same | nothing |
| `remoteOptimizedImages.js` | same | nothing |
| `patches/next-image-export-optimizer@1.20.1.patch` | same | nothing (see §9 dead end 4) |
| `scripts/generate-redirects.mjs` | same | nothing |
| `scripts/content-redirects.mjs` | same | `'osg'` → `'chtc'`; legacy URL shapes are CHTC's |
| `scripts/compare-migration.mjs` | same | **line ~65 hardcodes an absolute OSG path as the default `LEGACY_DIR`** — repoint it at `chtc-website-source/_site` |
| `.github/workflows/nextjs.yml` | same | drop the AlphaFold refresh step |
| `utils/articles.ts`, `utils/events.ts` | same | `'osg'` → `'chtc'`, repo constants |
| `site.config.ts` | same | CHTC name, description, share image |
| `utils/metadata.ts` | same | nothing |
| `utils/slug.ts` | same | nothing |

**`utils/staff.ts` — copy it and read its comment first.** It deliberately duplicates
`getStaff` from the library because the library matches staff files with
`path.endsWith('.yml')` and **five people in `CHTC/staff-list` are filed as `.yaml`**, so
the library silently renders an incomplete team page. CHTC's team page shows everyone, so
this bites harder there than it did on OSG. Either copy the fork or fix
`src/Staff/utils/getStaff.ts` upstream in `path-web-components` and release — the upstream
fix is better and is maybe five lines.

---

## 6. Configuration: exact values

### `next.config.mjs`

The scaffold currently ships Next's **default** image size lists. Replace them:

```js
images: {
  loader: "custom",
  // Every entry is another generated file per source image. These four
  // widths produce 2,030 variants on OSG; the scaffold's default lists are
  // 16 widths, so expect several times that in generated files and CI time.
  imageSizes: [96, 384],
  deviceSizes: [640, 1200],
},
```

Also set `nextImageExportOptimizer_remoteImageCacheTTL: "864000"` (10 days). The scaffold
has `"0"`, which re-downloads every remote image on every CI run.

Keep `output: "export"`, `trailingSlash: true`, `pageExtensions` including `md`/`mdx`.

### `package.json`

- Rename from `badger-hub-website`.
- Add `"packageManager": "pnpm@11.5.0"` (see §9 dead end 5).
- Scripts, in this exact order — the ordering is load-bearing:

```json
"prebuild":  "node scripts/reset-remote-images.mjs",
"build":     "next build",
"postbuild": "node scripts/validate-remote-images.mjs && next-image-export-optimizer && next-sitemap && tsx scripts/generate-redirects.mjs",
"lint":      "eslint .",
"compare:migration": "tsx scripts/compare-migration.mjs"
```

### Theme

```tsx
import { chtcTheme, chtcFonts } from '@chtc/web-components/themes';
```

Both already exist in 2.0.10. **Extend, don't replace**: `createTheme(chtcTheme, {…})` in
`app/theme.ts`. `ThemeProvider` must wrap `CssBaseline` *and* the body element, or the
body resolves against MUI's default theme instead of the brand one.

### `.ai/instructions.md`

Already present in the target repo and more current than OSG's (it has the
`page.tsx`/`view.tsx` split convention). **Follow it; do not overwrite it with OSG's.**

---

## 7. The two subsystems that cost the most time on OSG

### 7.1 Images

Problem: most photography is **absolute URLs** on `raw.githubusercontent.com`, not files in
`public/`. `next-image-export-optimizer` only generates variants for images declared up
front, and a URL it was not told about silently falls back to the full-size original.

The working design — copy it whole:

1. Pages record the remote URLs they render via `recordRemoteImages()` into
   **per-process shards** at `.remote-images/<pid>.json`.
2. `postbuild` merges the shards, probes each URL, and writes `.remote-images.json`.
3. `remoteOptimizedImages.js` reads that file and throws if it is missing or empty.

Non-obvious requirements, each of which was a bug first:

- **Shards, not one shared file.** `next build` renders in a worker pool (3–6 processes on
  OSG, confirmed empirically). A read-modify-write of one manifest loses entries.
- **The validator must use `redirect: 'manual'`.** The optimizer downloads with
  `https.get`, which does **not** follow redirects and rejects non-200/non-image. A plain
  `fetch` check follows the redirect, says "fine", and then the optimizer aborts the whole
  deploy. `github.com/<org>/<repo>/raw/…` — the URL form people naturally write — is
  exactly this case.
- **Record every image, including banners.** An unrecorded image 404s its variant and
  falls back silently. Grep your page code for every `ExportedImage src=` that takes a
  remote URL and make sure a `recordRemoteImages` call covers it.
- **`.gitignore` must list `/.remote-images.json` and `/.remote-images/`.**

**`sizes` must describe the width the image is *painted* at, not the width of its box.**
With `objectFit: 'cover'`, a 2:1 image in a square 80×80 box is painted ~164px wide and
cropped. `sizes='80px'` makes a 1× display fetch the 96px variant and upscale it 1.7× —
visibly blurry. This shipped to OSG production. Compute: `paintedWidth ≈ boxHeight ×
imageAspectRatio` when the box is proportionally narrower than the image.

### 7.2 Metadata

**The rule that was gotten wrong twice:** Next.js **replaces** a parent's `openGraph` object
when a child defines one — it does not merge field by field, and the image inherited from
`app/opengraph-image.png` goes with it. The same applies to `twitter`: set `twitter.title`
without restating `card` and the card degrades to small `summary`.

Therefore **every page that sets any Open Graph field must emit a complete block.** The
library does this for you:

```ts
import { articleMetadata, eventMetadata } from '@chtc/web-components/content';
import { CHTC_SITE } from '@/site.config';

export async function generateMetadata({ params }) {
  const article = await getSiteArticle((await params).slug);
  return articleMetadata(article, { path: `/news/${slug.join('/')}`, site: CHTC_SITE });
}
```

Other settled points:

- Site identity lives in **`site.config.ts` at the repo root**, not in `utils/`. It is
  configuration. `layout.tsx`, `app/manifest.ts` and `app/robots.ts` read from it. Do not
  create a root `metadata.ts` — Next reserves metadata-ish filenames as file conventions
  (`app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`) and the name misleads.
- `app/manifest.ts` needs `export const dynamic = 'force-static'` under `output: export`.
- `app/not-found.tsx` should set `robots: { index: false, follow: true }` and no canonical — one page answers for every address that does not exist.
- **A canonical whose last path segment contains a dot needs an explicit trailing slash.**
  Next treats a dotted final segment as a file and skips `trailingSlash`.
- `canonical_url` in article frontmatter points at wherever the authoritative copy lives,
  which may be another site. Honour it. `og:url` stays the page's own address.

---

## 8. `_uw-research-computing` — the one genuinely large piece

105 markdown documents at `chtc-website-source/_uw-research-computing/`, served at
`/uw-research-computing/:path`, with three sidebar menus in `_data/`:
`htc-guide-menu.yml`, `hpc-guide-menu.yml`, `uw-research-computing-menu.yml`.

Decide with the repository owner before building, because the OSG precedent **does not
settle this one**:

- OSG's rule was *content collections are explicit `page.mdx` files, never a dynamic
  `[...slug]` route*. That rule was set for ~20 hand-tailored pages.
- 105 technical documents with a generated sidebar is a different problem. A
  `app/uw-research-computing/[...slug]/page.tsx` rendering markdown through
  `MarkdownContainer` with `generateStaticParams` is likely correct here, and is how the
  news/event detail pages already work.

Either way: the menu YAML is the navigation source of truth, the docs contain code blocks
(check syntax highlighting), and many cross-link each other with Jekyll-relative URLs that
must be rewritten.

**Do not convert these to MDX.** MDX parses `<` as JSX and `{` as an expression; technical
docs full of shell snippets and angle brackets will fight you on every file. Render them
as markdown *strings* via `react-markdown` (`components/MarkdownContainer` in the OSG
repo), which tolerates raw HTML.

---

## 9. Dead ends — do not repeat these

Each of these is a thing the OSG migration did, then undid.

1. **Build-time fetches without retry.** CI flaked on single timeouts among hundreds of
   queries. Fixed in `2fb8a9b` by adding retry-with-backoff. If you add any build-time
   fetch beyond the library's, give it retries from the start.
2. **Hand-rolled content getters.** OSG originally wrote `utils/github.tsx`,
   `utils/presentations.ts`, `utils/articles.ts` and `utils/staff.ts` from scratch — then
   deleted ~420 lines of them in `949e963` to use `@chtc/web-components/content`. **Start
   from the library.** Only keep a local wrapper for what is genuinely site-specific: the
   `'chtc'` filter and the `recordRemoteImages` call.
3. **Hand-rolled metadata helpers.** OSG wrote its own `summarize`, `firstParagraph`,
   `isoDate`, `pageTitle`, `shareImage`, `articleMetadata` and `eventMetadata`, then
   deleted all of them in `42a1e5b` once the same functions were released in the library.
   **Import them; do not write them.**
4. **A local `EventCard`.** Deleted in favour of the library's, which takes an
   `imageComponent` prop. Use `<EventCard href={…} event={event} imageComponent={ExportedImage} />`.
5. **Letting CI pick its own pnpm.** pnpm 10 and 11 write **incompatible
   `patchedDependencies` shapes** into the lockfile (10: `{hash, path}`; 11: a scalar
   hash), and the mismatch fails `pnpm install --frozen-lockfile`. Pin via
   `"packageManager"` in `package.json` and let `pnpm/action-setup@v4` read it — do not
   pass `version:` in the workflow.
6. **CSS `background-image: url(…)` for a photographic banner.** `url()` bypasses the
   optimizer entirely; OSG shipped a 918 KB raw JPEG this way. Use an `ExportedImage` with
   `fill` + `objectFit: cover` instead — 268 KB at 1200w, and you get a blur placeholder.
7. **`priority` on below-the-fold images.** It preloads them at high priority and competes
   with the real LCP element. `priority` is for above-the-fold only.
8. **Trusting a green build as visual verification.** Large parts of OSG's styling were
   marked "build-verified only" and shipped with defects. A build passing is not a page
   looking right.

---

## 10. Gotchas that will bite regardless

- **`component={Link}` from a Server Component breaks the static export** —
  "Functions cannot be passed directly to Client Components". Wrap the child in `next/link`
  or use the MUI component's own `href`. This recurred on nearly every OSG page.
- **MDX escaping:** literal `<` → `&lt;`, `{`/`}` → `\{`/`\}`. `react-markdown` tolerates
  raw HTML; MDX does not.
- **Unquoted YAML dates** (`start_date: 2024-08-05`) parse to a JS `Date` and drift by
  timezone. Normalize through UTC. The library's getters already do.
- **Empty YAML fields parse to `null`**, which defeats a component's `= []` default.
  Coalesce with `?? undefined`.
- **`generateStaticParams` must return param objects** (`{ slug }`), not full data objects.
- **`next build` wipes `out/`**, so rebuild before `compare:migration`.
- **Content changes appear stale for up to an hour.** `raw.githubusercontent.com` sends
  `max-age=300`, and Next caches fetches in `.next/cache/fetch-cache` with a 1-hour
  revalidate. After pushing content, `rm -rf .next/cache` or wait. In CI the 6-hourly cron
  clears it; bump the `nextjs-` cache key for an immediate refresh.
- **The CI cache key must miss every run.** `actions/cache` skips the save on an exact key
  hit, which would throw away the refreshed fetch cache. Hence `${{ github.run_id }}` in
  the key with `restore-keys` supplying the previous run.
- **`@chtc/web-components` ESM uses extensionless directory imports.** Plain `node` cannot
  resolve it (`ERR_UNSUPPORTED_DIR_IMPORT`). Scripts that import it must run under `tsx`
  and use a default import: `import content from '@chtc/web-components/content'`.
- **Set `GITHUB_TOKEN`** in the build environment to avoid API rate limits.

---

## 11. Definition of done

`pnpm compare:migration` is the scorecard — it resolves legacy URLs the way GitHub Pages
does (`/a/b.html` is a file, not a directory index) and counts a URL covered only if a real
page or redirect stub lands there. Run it, do not guess.

Then port these audits from the OSG session (they live in that repo's history, and are
~20 lines of Python each over `out/`):

| Audit | Passing on OSG |
| --- | --- |
| Pages missing `description` / `og:image` / `og:site_name` / `twitter:card` | 0 of 833 |
| Canonicals: self-referencing / intentionally external / **wrong** | 773 / 57 / **0** |
| Optimized image references with no generated file | 3, all one dead content URL |

A useful extra check, since production is live: fetch the legacy page and diff its `<meta>`
set against the new build's. On the OSG metadata refactor this proved byte-identical output
across five page types, which no amount of reasoning would have.

---

## 12. Reporting

Report at each gate with: what built, what the audits said, what you changed, and what you
could not verify. State failures with their output. Do not report a phase complete on a
build that was not run.
