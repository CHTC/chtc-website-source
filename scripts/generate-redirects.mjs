// Generates a static redirect page for every entry in redirects.json.
//
// Because this site is built with `output: "export"`, Next.js cannot serve
// `next.config` redirects() at runtime. Instead we write a small meta-refresh
// HTML file at each legacy source path directly into the export output, so the
// old URLs keep working and forward visitors to their new destination.
//
// Run automatically in `postbuild` (after `next build` has produced `out/`).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { articleRedirects, eventRedirects, presentationRedirects, otherSiteArticleRedirects } from './content-redirects.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const OUT_DIR = path.resolve(ROOT, process.argv[2] || 'out');
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @typedef {{ source: string, destination: string, text?: string }} Redirect */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Resolve the on-disk file for a source path (preserving `.html` URLs). */
function targetFile(source) {
  const clean = source.replace(/^\/+/, '');
  const hasExtension = path.extname(clean) !== '';
  const relative = hasExtension ? clean : path.join(clean, 'index.html');
  return path.join(OUT_DIR, relative);
}

const isOffSite = (destination) => /^https?:\/\//i.test(destination) || destination.startsWith('//');

/**
 * This site's own page for a legacy `<path>.html` or `<path>` URL, if the
 * export has one. Only meaningful before any stubs are written, since a stub
 * at `<path>/index.html` would look like a page.
 */
function localPage(source) {
  const page = source.replace(/\.html$/, '').replace(/\/+$/, '');
  if (!page) return null;
  return fs.existsSync(path.join(OUT_DIR, page.replace(/^\/+/, ''), 'index.html')) ? `${page}/` : null;
}

/** A destination may be an absolute URL or a site-relative path. */
function resolveDestination(destination) {
  if (isOffSite(destination)) {
    return destination;
  }
  return `${BASE_PATH}${destination.startsWith('/') ? '' : '/'}${destination}`;
}

function redirectHtml({ destination, text }) {
  const url = resolveDestination(destination);
  const safeUrl = escapeHtml(url);
  const jsUrl = JSON.stringify(url);
  const label = escapeHtml(text || `Continue to ${url}`);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Redirecting…</title>
<link rel="canonical" href="${safeUrl}">
<meta http-equiv="refresh" content="0; url=${safeUrl}">
<script>window.location.replace(${jsUrl});</script>
<style>
  body { font-family: system-ui, sans-serif; display: flex; min-height: 100vh; margin: 0; }
  .box { margin: auto; max-width: 32rem; padding: 2rem; text-align: center; }
  a { color: #1a5b8a; }
</style>
</head>
<body>
<div class="box">
  <p>Redirecting you to a new location…</p>
  <p>If you are not redirected automatically, <a href="${safeUrl}">${label}</a>.</p>
</div>
</body>
</html>
`;
}

async function main() {
  // Hand-written rules: the root file plus one file per site area in
  // `redirects/`, so the areas can be maintained (and were migrated)
  // independently without editing one shared list.
  const redirectsPath = path.resolve(ROOT, 'static-redirects.json');
  /** @type {Redirect[]} */
  const staticRedirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf-8'));
  const redirectsDir = path.resolve(ROOT, 'redirects');
  if (fs.existsSync(redirectsDir)) {
    for (const file of fs.readdirSync(redirectsDir).filter((f) => f.endsWith('.json')).sort()) {
      staticRedirects.push(...JSON.parse(fs.readFileSync(path.join(redirectsDir, file), 'utf-8')));
    }
  }

  if (!fs.existsSync(OUT_DIR)) {
    console.error(
      `[redirects] Output directory not found: ${OUT_DIR}\n` +
        `[redirects] Run \`next build\` first, or pass the export dir as an argument.`
    );
    process.exit(1);
  }

  // Dynamic redirects derived from the live content sources (articles, events, presentations).
  // Best-effort: a fetch failure here shouldn't fail an otherwise-good build.
  const dynamic = [];
  for (const [label, fn] of [
    ['article', articleRedirects],
    ['event', eventRedirects],
    ['presentation', presentationRedirects],
    ['other-site article', otherSiteArticleRedirects],
  ]) {
    try {
      const computed = await fn();
      dynamic.push(...computed);
      console.log(`[redirects] Computed ${computed.length} ${label} redirect(s) from content sources.`);
    } catch (error) {
      console.warn(
        `[redirects] Skipped ${label} redirects — ${error instanceof Error ? error.message : error}`
      );
    }
  }

  // The off-site rules (mostly to osg-htc.org) are for content this site does
  // not publish. When it does, because the content was since published here
  // too or a hand-written rule predates it, the visitor belongs on this site's
  // page. Decided before any stub is written; see localPage.
  const keptLocal = [];
  const redirects = [...staticRedirects, ...dynamic].map((entry) => {
    if (!entry.source || !entry.destination || !isOffSite(entry.destination)) return entry;
    const local = localPage(entry.source);
    if (!local) return entry;
    keptLocal.push(`${entry.source} (was ${entry.destination})`);
    return { ...entry, destination: local };
  });

  let written = 0;
  const skipped = [];
  const seen = new Set();

  for (const entry of redirects) {
    if (!entry.source || !entry.destination) {
      console.warn(`[redirects] Skipping malformed entry: ${JSON.stringify(entry)}`);
      continue;
    }
    if (seen.has(entry.source)) {
      console.warn(`[redirects] Duplicate source, skipping: ${entry.source}`);
      continue;
    }
    seen.add(entry.source);

    const file = targetFile(entry.source);

    // Never clobber a real generated page — that path is owned by the app.
    if (fs.existsSync(file)) {
      skipped.push(entry.source);
      continue;
    }

    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, redirectHtml(entry));
    written++;
  }

  console.log(`[redirects] Generated ${written} redirect page(s) in ${path.relative(ROOT, OUT_DIR)}/`);
  if (keptLocal.length) {
    console.log(
      `[redirects] Kept ${keptLocal.length} off-site redirect(s) on this site, which has the page:\n` +
        keptLocal.map((s) => `  - ${s}`).join('\n')
    );
  }
  if (skipped.length) {
    console.warn(
      `[redirects] Skipped ${skipped.length} source(s) that collide with an existing page (showing up to 20):\n` +
        skipped.slice(0, 20).map((s) => `  - ${s}`).join('\n')
    );
  }
}

main().catch((error) => {
  console.error(`[redirects] ${error instanceof Error ? error.stack : error}`);
  process.exit(1);
});
