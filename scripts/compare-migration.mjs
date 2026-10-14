#!/usr/bin/env node
/**
 * Migration coverage report: compares the legacy Jekyll build output against
 * this site's static export and reports what hasn't been converted yet.
 *
 * Usage:
 *   pnpm compare:migration [legacySiteDir] [newOutDir] [options]
 *   npx tsx scripts/compare-migration.mjs [legacySiteDir] [newOutDir] [options]
 *   (pass options directly after the script name — no `--` separator)
 *
 * Options:
 *   --ignore <glob>   Ignore paths matching the glob (repeatable). Matched
 *                     against the full path; a single star stays within a path
 *                     segment, a double star crosses slashes.
 *                     e.g. --ignore '/assets/**'  --ignore '/news/**'
 *   --out <file>      Write the full sorted missing list here
 *                     (default: migration-missing.txt).
 *
 * Defaults:
 *   legacySiteDir = ../chtc-website-source/_site   (Jekyll build output)
 *   newOutDir     = ./out                        (next build static export)
 *
 * Also verifies that every `.well-known` file (OIDC / Pelican discovery
 * metadata) survived the move byte-for-byte, since those are fetched by
 * exact path and parsed strictly, and that every redirect stub actually lands
 * somewhere — no loops, no 404s.
 *
 * A legacy URL counts as "covered" when resolving it against the export the way
 * the static host does lands on a real page or a redirect stub. That resolution
 * is deliberately literal, because GitHub Pages is:
 *
 *   /a/b.html   → the file `a/b.html`, and nothing else. A stub written to
 *                 `a/b/index.html` does NOT make this URL work.
 *   /a/b        → prefers `a/b.html` over `a/b/index.html`.
 *   /a/b/       → `a/b/index.html` only.
 *
 * Matching on a canonicalized form instead (stripping `.html`) would call
 * `/spotlights/x.html` covered because `/spotlights/x/` exists, which is how a
 * site-wide break in the legacy article URLs went unnoticed. `canonical()`
 * survives only for loosely pairing a legacy URL with its new counterpart.
 */

import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// --- argument parsing (positionals + repeatable --ignore + --out) -----------
const ignoreGlobs = [];
const positional = [];
let outArg = null;
{
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--ignore' || arg === '-i') ignoreGlobs.push(args[++i]);
    else if (arg.startsWith('--ignore=')) ignoreGlobs.push(arg.slice(9));
    else if (arg === '--out' || arg === '-o') outArg = args[++i];
    else if (arg.startsWith('--out=')) outArg = arg.slice(6);
    else positional.push(arg);
  }
}

const LEGACY_DIR = positional[0]
  ? path.resolve(positional[0])
  : path.resolve('/Users/clock/WebstormProjects/chtc-website-source/_site');
const NEW_DIR = positional[1]
  ? path.resolve(positional[1])
  : path.resolve(process.cwd(), 'out');
const REDIRECTS_FILE = path.resolve(process.cwd(), 'static-redirects.json');
const REDIRECTS_DIR = path.resolve(process.cwd(), 'redirects');
const OUT_FILE = path.resolve(process.cwd(), outArg || 'migration-missing.txt');

/** Convert a glob (`*`, `**`, `?`) into an anchored RegExp over a path. */
function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const ch = glob[i];
    if (ch === '*') {
      if (glob[i + 1] === '*') {
        re += '.*';
        i++;
      } else {
        re += '[^/]*';
      }
    } else if (ch === '?') {
      re += '[^/]';
    } else {
      re += ch.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${re}$`);
}

const userIgnoreRes = ignoreGlobs.filter(Boolean).map(globToRegExp);
/** True when a path matches any user-supplied --ignore glob. */
const userIgnored = (p) => userIgnoreRes.some((re) => re.test(p));

// Non-content pages to ignore on both sides.
const IGNORE = [
  /^\/404(\.html)?$/,
  /^\/500(\.html)?$/,
  /^\/google[0-9a-z]+$/i, // search-console verification files
  /^\/sitemap/,
  /^\/robots/,
  /\/feed$/,
  /^\/assets\//,
  /^\/_/, // _next, etc.
];

/** Recursively collect every file under `dir` (absolute paths). */
async function walkFiles(dir) {
  const out = [];
  async function recurse(current) {
    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await recurse(full);
      } else if (entry.isFile()) {
        out.push(full);
      }
    }
  }
  await recurse(dir);
  return out;
}

const ASSET_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'avif',
  'css', 'js', 'mjs', 'map', 'woff', 'woff2', 'ttf', 'eot', 'otf',
]);

/** Lowercased file extension of a URL path, or "(no-ext)". */
function extensionOf(urlPath) {
  const match = urlPath.match(/\.([A-Za-z0-9]+)$/);
  return match ? match[1].toLowerCase() : '(no-ext)';
}

/** Build-pipeline asset (image/font/css/js) vs. a content/config file. */
function isAsset(urlPath) {
  return (
    urlPath.startsWith('/assets/') ||
    urlPath.startsWith('/_next/') ||
    ASSET_EXTENSIONS.has(extensionOf(urlPath))
  );
}

/** File path → URL path, e.g. `<root>/about/index.html` → `/about/index.html`. */
function toUrl(root, file) {
  return '/' + path.relative(root, file).split(path.sep).join('/');
}

/**
 * Canonicalize a URL so the legacy and new URL styles line up:
 * strip `index.html`, strip `.html`, drop the trailing slash, lowercase.
 *
 * This answers "is this content somewhere in the new site", NOT "does this URL
 * work" — `/spotlights/x.html` and `/spotlights/x/` share a canonical form but
 * are different files to a static host. Use `resolveOnPages` for reachability;
 * canonical is only for loosely pairing a legacy URL with its new counterpart.
 */
function canonical(url) {
  let u = url.toLowerCase();
  u = u.replace(/\/index\.html$/, '/');
  u = u.replace(/\.html$/, '');
  if (u.length > 1) u = u.replace(/\/+$/, '');
  return u || '/';
}

/** The URL a file in the export is actually served at. */
function servedUrl(root, file) {
  const url = toUrl(root, file);
  return url.replace(/\/index\.html$/, '/').replace(/^\/index\.html$/, '/');
}

/**
 * Resolve a URL the way GitHub Pages does, against a set of file paths.
 * Returns the file that would be served, or null for a 404.
 *
 * The rules that matter here:
 *  - `/a/b.html` resolves to the literal file and nothing else. A stub written
 *    to `/a/b/index.html` does NOT rescue it.
 *  - `/a/b` prefers the sibling `b.html` over the directory index `b/index.html`.
 *  - `/a/b/` is the directory index only.
 */
function resolveOnPages(url, fileSet) {
  const p = url.split('?')[0].split('#')[0];
  if (p === '/' || p.endsWith('/')) {
    const index = `${p}index.html`;
    return fileSet.has(index) ? index : null;
  }
  if (fileSet.has(p)) return p;
  if (p.endsWith('.html')) return null;
  for (const candidate of [`${p}.html`, `${p}/index.html`]) {
    if (fileSet.has(candidate)) return candidate;
  }
  return null;
}

const ignored = (url) => IGNORE.some((re) => re.test(url)) || userIgnored(url);

/** Reverse the HTML escaping the redirect generator applies to URLs. */
function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** A redirect stub is a meta-refresh page emitted by generate-redirects.mjs. */
function isRedirectStub(html) {
  return /http-equiv=["']?refresh/i.test(html);
}

/**
 * A lowercased copy of a file set, for spotting paths that differ only in case.
 *
 * macOS is case-insensitive by default, so two exports whose names differ only
 * in case collapse onto one file locally while remaining distinct on the
 * case-sensitive Linux host that actually builds and serves the site. Reporting
 * those as missing would be wrong; they get their own bucket.
 */
function lowercaseSet(fileSet) {
  return new Set([...fileSet].map((p) => p.toLowerCase()));
}

/** The site's own origins — a destination naming one is an internal link. */
const SELF_ORIGINS = ['https://chtc.cs.wisc.edu', 'http://chtc.cs.wisc.edu'];

/**
 * A redirect destination as a site-relative path, or null if it really is
 * off-site. Several rules spell an internal destination as a full
 * `https://chtc.cs.wisc.edu/...` URL, and those must still be checked.
 */
function toInternalPath(destination) {
  if (!destination) return null;
  for (const origin of SELF_ORIGINS) {
    if (destination.toLowerCase().startsWith(origin)) {
      return destination.slice(origin.length) || '/';
    }
  }
  return /^(https?:)?\/\//i.test(destination) ? null : destination;
}

/** Group canonical URLs by their first path segment. */
function bySection(urls) {
  const sections = new Map();
  for (const url of urls) {
    const seg = url.split('/')[1] || '';
    const key = seg ? `/${seg}` : '(top-level)';
    sections.set(key, (sections.get(key) ?? 0) + 1);
  }
  return [...sections.entries()].sort((a, b) => b[1] - a[1]);
}

async function main() {
  const legacyAllFiles = await walkFiles(LEGACY_DIR);
  const newAllFiles = await walkFiles(NEW_DIR);
  const legacyFiles = legacyAllFiles.filter((f) => f.endsWith('.html'));
  const newFiles = newAllFiles.filter((f) => f.endsWith('.html'));

  if (legacyFiles.length === 0) {
    console.error(
      `No legacy HTML found in ${LEGACY_DIR}. Build the Jekyll site (\`bundle exec jekyll build\`) or pass the correct path as the first argument.`
    );
    process.exitCode = 1;
    return;
  }

  // Every URL the legacy site serves, deduplicated. `/about/index.html` is the
  // URL `/about/`, so compare on the served form, not the file path.
  const legacy = new Map();
  for (const file of legacyFiles) {
    const url = servedUrl(LEGACY_DIR, file);
    if (ignored(canonical(url))) continue;
    if (!legacy.has(url)) legacy.set(url, url);
  }

  // The export's files, as a set of URL paths, plus what each HTML file is:
  // a real page or a redirect stub (and where the stub points).
  const newFileSet = new Set(newAllFiles.map((f) => toUrl(NEW_DIR, f)));
  const stubs = new Map(); // file URL path -> destination
  const pageFiles = new Set();
  for (const file of newFiles) {
    const url = toUrl(NEW_DIR, file);
    const html = await readFile(file, 'utf8');
    if (isRedirectStub(html)) {
      const match = html.match(/url=([^"'\s>]+)/i);
      stubs.set(url, match ? decodeEntities(match[1]) : '');
    } else {
      pageFiles.add(url);
    }
  }

  // Rules that exist in static-redirects.json but have no file in out/ yet —
  // i.e. `next build` ran without the postbuild redirect step. Reported apart
  // so a half-built export doesn't look like missing content.
  const ruleSources = new Set();
  try {
    const rules = JSON.parse(await readFile(REDIRECTS_FILE, 'utf8'));
    for (const rule of rules) if (rule?.source) ruleSources.add(rule.source);
  } catch {
    // No static-redirects.json — fall back to whatever is in out/.
  }
  try {
    for (const file of (await readdir(REDIRECTS_DIR)).filter((f) => f.endsWith('.json'))) {
      const rules = JSON.parse(await readFile(path.join(REDIRECTS_DIR, file), 'utf8'));
      for (const rule of rules) if (rule?.source) ruleSources.add(rule.source);
    }
  } catch {
    // No redirects/ directory.
  }

  // Classify every legacy URL by resolving it the way the host would.
  const coveredAsPage = [];
  const coveredAsRedirect = [];
  const ruleNotEmitted = [];
  const missing = [];
  for (const url of legacy.keys()) {
    const file = resolveOnPages(url, newFileSet);
    if (file === null) {
      if (ruleSources.has(url)) ruleNotEmitted.push(url);
      else missing.push(url);
    } else if (stubs.has(file)) {
      coveredAsRedirect.push(url);
    } else {
      coveredAsPage.push(url);
    }
  }

  // New pages with no legacy counterpart (added during the rebuild).
  const legacyCanonical = new Set([...legacy.keys()].map(canonical));
  const added = [...pageFiles]
    .map((f) => f.replace(/\/index\.html$/, '/'))
    .filter((url) => !ignored(canonical(url)) && !legacyCanonical.has(canonical(url)));

  const total = legacy.size;
  const pct = (n) => `${((n / total) * 100).toFixed(1)}%`;

  console.log('\n=== CHTC migration coverage report ===');
  console.log(`legacy:  ${LEGACY_DIR}`);
  console.log(`new:     ${NEW_DIR}\n`);

  console.log('Counts');
  console.log(`  legacy pages (unique URLs):   ${total}`);
  console.log(`  new real pages:               ${pageFiles.size}`);
  console.log(`  new redirect stubs:           ${stubs.size}\n`);

  console.log('Legacy coverage  (resolved as the static host serves files)');
  console.log(`  ✓ covered by a page:          ${coveredAsPage.length} (${pct(coveredAsPage.length)})`);
  console.log(`  ↪ covered by a redirect:      ${coveredAsRedirect.length} (${pct(coveredAsRedirect.length)})`);
  console.log(`  ⧗ rule exists, stub not built:${String(ruleNotEmitted.length).padStart(4)} (${pct(ruleNotEmitted.length)})`);
  console.log(`  ✗ missing / not converted:    ${missing.length} (${pct(missing.length)})\n`);

  if (ruleNotEmitted.length) {
    console.log(
      `  ${ruleNotEmitted.length} legacy URL(s) have a static-redirects.json rule but no file in out/.\n` +
        `  Run a full \`pnpm build\` (the postbuild step emits them).\n`
    );
  }

  console.log('Missing pages by section (top 15)');
  for (const [section, count] of bySection(missing).slice(0, 15)) {
    console.log(`  ${count.toString().padStart(4)}  ${section}`);
  }

  // The actionable count: missing pages that are NOT live content collections.
  const COLLECTIONS = new Set(['spotlights', 'news', 'events', 'presentations']);
  const actionable = missing
    .filter((url) => !COLLECTIONS.has(url.split('/')[1]))
    .sort();
  console.log(
    `\nMissing excluding content collections (the real to-convert list): ${actionable.length}`
  );
  for (const url of actionable) console.log(`  ${url}`);

  // The sample skips sections that have their own dedicated redirect check
  // below (spotlights via the article check, events via the event check).
  const HANDLED_IN_CHECK = new Set(['spotlights', 'events']);
  const sampleSource = missing.filter(
    (url) => !HANDLED_IN_CHECK.has(url.split('/')[1])
  );
  const sample = sampleSource.slice().sort().slice(0, 30);
  console.log(
    `\nSample missing pages — excluding spotlights/events handled by the checks below (${Math.min(30, sampleSource.length)} of ${sampleSource.length})`
  );
  for (const url of sample) console.log(`  ${url}`);

  // Non-HTML files (config, data, assets) in legacy that aren't at the same
  // path in the new export. Exact-path comparison (no canonicalization).
  const newNonHtml = new Set(
    newAllFiles.filter((f) => !f.endsWith('.html')).map((f) => toUrl(NEW_DIR, f))
  );
  const missingNonHtml = legacyAllFiles
    .filter((f) => !f.endsWith('.html'))
    .map((f) => toUrl(LEGACY_DIR, f))
    .filter((p) => !newNonHtml.has(p) && !userIgnored(p));

  const extCounts = new Map();
  for (const p of missingNonHtml) {
    extCounts.set(extensionOf(p), (extCounts.get(extensionOf(p)) ?? 0) + 1);
  }
  const configFiles = missingNonHtml.filter((p) => !isAsset(p)).sort();

  console.log(`\n=== Non-HTML files in legacy not in the new export: ${missingNonHtml.length} ===`);
  console.log('By extension:');
  for (const [ext, count] of [...extCounts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${count.toString().padStart(4)}  ${ext}`);
  }
  console.log(`\nLikely config / data files to migrate (non-asset, ${configFiles.length}):`);
  for (const p of configFiles.slice(0, 80)) console.log(`  ${p}`);
  if (configFiles.length > 80) console.log(`  … and ${configFiles.length - 80} more`);

  // Write the full missing list (pages + non-HTML files), sorted alphabetically.
  const allMissing = [...missing, ...missingNonHtml].sort((a, b) =>
    a.localeCompare(b)
  );
  const fileHeader =
    `# CHTC migration — missing files (legacy URLs / files not covered in the new export)\n` +
    `# legacy: ${LEGACY_DIR}\n` +
    `# new:    ${NEW_DIR}\n` +
    `# missing pages: ${missing.length}  ·  missing non-HTML files: ${missingNonHtml.length}  ·  total: ${allMissing.length}\n` +
    `# ignore globs: ${ignoreGlobs.length ? ignoreGlobs.join('  ') : '(none)'}\n\n`;
  await writeFile(OUT_FILE, fileHeader + allMissing.join('\n') + '\n');
  console.log(
    `\nWrote ${allMissing.length} missing entries (sorted) to ${path.relative(process.cwd(), OUT_FILE)}`
  );

  console.log(`\nNew pages added in the rebuild (no legacy URL): ${added.length}`);
  for (const [section, count] of bySection(added).slice(0, 8)) {
    console.log(`  ${count.toString().padStart(4)}  ${section}`);
  }

  console.log('\nNotes for interpreting "missing":');
  console.log('  • Content collections (spotlights / news / events / presentations)');
  console.log('    are sourced live from the CHTC GitHub repos and filtered to CHTC-');
  console.log('    published items, with new date-based permalinks. Legacy URLs in');
  console.log('    those sections mostly reflect a different/larger source + URL');
  console.log('    scheme, not unconverted templates.');
  console.log('  • One-off legacy landing pages (events promos, award pages, zoom');
  console.log('    links) may be intentionally retired.');
  console.log('  • Focus conversion effort on non-collection clusters that have no');
  console.log('    page and no redirect.\n');

  await checkWellKnown(legacyAllFiles, newAllFiles);
  const legacyFileSet = new Set(legacyAllFiles.map((f) => toUrl(LEGACY_DIR, f)));
  checkRedirectChains(stubs, newFileSet, legacyFileSet);
  await checkContentRedirects(stubs, newFileSet);
}

/**
 * Follows every redirect stub to where it actually lands.
 *
 * A stub whose destination omits the trailing slash is the dangerous case: the
 * host prefers the sibling `<path>.html` — the stub itself — over the directory
 * index, so the stub serves itself and the browser refreshes forever. This
 * walks each chain to a real page, an off-site URL, a 404, or a repeat.
 */
function checkRedirectChains(stubs, fileSet, legacyFileSet) {
  const loops = [];
  const dead = [];
  const notBuiltHere = [];
  let landed = 0;
  let offsite = 0;

  for (const [file, target] of stubs) {
    const start = file.replace(/\/index\.html$/, '/');
    let current = toInternalPath(target);
    const seen = new Set();
    for (;;) {
      if (!current) {
        offsite += 1;
        break;
      }
      if (seen.has(current)) {
        loops.push({ start, at: current });
        break;
      }
      seen.add(current);
      const resolved = resolveOnPages(current, fileSet);
      if (resolved === null) {
        // osg-htc.org also hosts separately-deployed sub-sites (/docs,
        // /campus-docs, /security, ...). A destination that is in neither
        // build was never this repo's to serve, so it is not a regression —
        // only a path the legacy build had and this one lost is.
        if (resolveOnPages(current, legacyFileSet) === null) {
          notBuiltHere.push({ start, at: current });
        } else {
          dead.push({ start, at: current });
        }
        break;
      }
      if (!stubs.has(resolved)) {
        landed += 1;
        break;
      }
      current = toInternalPath(stubs.get(resolved));
    }
  }

  console.log('=== Redirect stub check (where each stub actually lands) ===');
  console.log(`  stubs in the export:           ${stubs.size}`);
  console.log(`  ✓ land on a real page:         ${landed}`);
  console.log(`  → point off-site:              ${offsite}`);
  console.log(`  ~ point at a sub-site:         ${notBuiltHere.length}`);
  console.log(`  ↻ REDIRECT LOOP:               ${loops.length}`);
  console.log(`  ✗ land on a 404:               ${dead.length}\n`);

  if (notBuiltHere.length) {
    console.log(
      `  Same-origin destinations this repo does not build (${notBuiltHere.length}) —\n` +
        `  separately-deployed sub-sites; verify them against the live site:`
    );
    for (const item of notBuiltHere.slice(0, 10)) {
      console.log(`    ${item.start}  →  ${item.at}`);
    }
    console.log('');
  }

  for (const [label, items] of [
    ['Redirect loops', loops],
    ['Stubs landing on a 404', dead],
  ]) {
    if (!items.length) continue;
    console.log(`  ${label} (${items.length}):`);
    for (const item of items.slice(0, 20)) {
      console.log(`    ${item.start}  →  ${item.at}`);
    }
    if (items.length > 20) console.log(`    … and ${items.length - 20} more`);
    console.log('');
  }

  if (!loops.length && !dead.length) {
    console.log('  Every redirect stub resolves to a real destination. ✓\n');
  }
}

/**
 * Verifies every source the generator computes really is reachable in the
 * export, and points where it claims to. Each source is resolved the way the
 * host serves files, so a stub at the wrong path (`/spotlights/x/index.html`
 * for the legacy URL `/spotlights/x.html`) is reported as missing rather than
 * passing on a canonical-form match.
 *
 * Uses the shared content-redirects helper (real getArticles/getEvents), so it
 * only runs under a TypeScript loader — invoke via `pnpm compare:migration`
 * (tsx). Under plain `node` it degrades to a note. The stubs are emitted at
 * build time by generate-redirects.mjs, so this passes after a full build.
 */
async function checkContentRedirects(stubs, fileSet) {
  let helper;
  try {
    helper = await import('./content-redirects.mjs');
  } catch {
    console.log(
      '=== Content redirect check (articles + events + presentations) ===\n  Skipped — run `pnpm compare:migration` (tsx) to enable (needs network).\n'
    );
    return;
  }

  const checks = [
    ['Article', '/<page-name>.html', helper.articleRedirects],
    ['Event', '/events/<y>/<m>/<d>/<page-name>.html', helper.eventRedirects],
    ['Presentation', '/presentations/<y>/<m>/<d>/<page-name>.html', helper.presentationRedirects],
  ];

  for (const [label, legacyForm, getRedirects] of checks) {
    let pairs;
    try {
      pairs = await getRedirects();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`=== ${label} redirect check ===\n  Skipped — could not fetch (${message}).\n`);
      continue;
    }

    // Dedup by source, mirroring the generator (first occurrence wins).
    const bySource = new Map();
    for (const pair of pairs) if (!bySource.has(pair.source)) bySource.set(pair.source, pair);

    const missing = [];
    const caseOnly = [];
    const wrongDestination = [];
    const lowerFileSet = lowercaseSet(fileSet);
    let okCount = 0;

    for (const { source, destination } of bySource.values()) {
      const file = resolveOnPages(source, fileSet);
      const got = file === null ? null : stubs.get(file);
      if (got === undefined || got === null) {
        // Either nothing is served there, or what is served is a real page
        // rather than a redirect (which the generator leaves alone by design).
        if (file !== null) {
          okCount += 1;
        } else if (resolveOnPages(source.toLowerCase(), lowerFileSet) !== null) {
          caseOnly.push({ source, destination });
        } else {
          missing.push({ source, destination });
        }
      } else if (canonical(got) !== canonical(destination)) {
        wrongDestination.push({ source, got, destination });
      } else {
        okCount += 1;
      }
    }

    console.log(`=== ${label} redirect check (legacy ${legacyForm} → new path) ===`);
    console.log(`  CHTC ${label.toLowerCase()}s:                  ${bySource.size}`);
    console.log(`  ✓ correct redirect present:    ${okCount}`);
    console.log(`  ⚠ redirect points elsewhere:   ${wrongDestination.length}`);
    console.log(`  ≈ case-only collision locally: ${caseOnly.length}`);
    console.log(`  ✗ missing redirect:            ${missing.length}\n`);

    if (caseOnly.length) {
      console.log(
        `  Present only under a different case (${caseOnly.length}). On this\n` +
          `  case-insensitive filesystem two such names are one file, so the\n` +
          `  generator wrote one and skipped the rest. The deploy host builds on\n` +
          `  case-sensitive Linux, where both exist — not a production problem,\n` +
          `  but a local export is incomplete here:`
      );
      for (const item of caseOnly.slice(0, 10)) {
        console.log(`    ${item.source}  →  ${item.destination}`);
      }
      console.log('');
    }

    if (wrongDestination.length) {
      console.log(`  Redirects pointing to the wrong destination (${wrongDestination.length}):`);
      for (const item of wrongDestination.slice(0, 30)) {
        console.log(`    ${item.source}  →  got ${item.got}  (expected ${item.destination})`);
      }
      console.log('');
    }

    if (missing.length) {
      console.log(`  Missing redirects (showing ${Math.min(30, missing.length)} of ${missing.length}):`);
      for (const item of missing.slice(0, 30)) {
        console.log(`    ${item.source}  →  ${item.destination}`);
      }
      if (missing.length > 30) console.log(`    … and ${missing.length - 30} more`);
      console.log('  These generate dynamically — run a full `pnpm build` to emit them into out/.\n');
    } else {
      console.log(`  All CHTC ${label.toLowerCase()}s have a correct legacy → new redirect. ✓\n`);
    }
  }
}

/**
 * Every file under a `.well-known/` directory, keyed by its URL path
 * (`/osdf/caida/.well-known/openid-configuration`).
 */
function wellKnownFiles(root, files) {
  const map = new Map();
  for (const file of files) {
    const url = toUrl(root, file);
    if (url.split('/').includes('.well-known')) map.set(url, file);
  }
  return map;
}

/** Short content digest, for reporting which side differs. */
function digest(buffer) {
  return createHash('sha256').update(buffer).digest('hex').slice(0, 12);
}

/**
 * `.well-known` files are federation metadata (OIDC issuer discovery, Pelican
 * namespace discovery), not pages: clients fetch them by exact path and parse
 * them strictly, so "a page exists there" is not good enough — the bytes have
 * to survive the migration unchanged. The main non-HTML comparison only checks
 * that the path exists, so this verifies content as well.
 */
async function checkWellKnown(legacyAllFiles, newAllFiles) {
  const legacy = wellKnownFiles(LEGACY_DIR, legacyAllFiles);
  const current = wellKnownFiles(NEW_DIR, newAllFiles);

  console.log('=== .well-known check (byte-for-byte) ===');
  console.log(`  legacy files:                  ${legacy.size}`);
  console.log(`  new files:                     ${current.size}`);

  if (legacy.size === 0 && current.size === 0) {
    console.log('  No .well-known files on either side — nothing to compare.\n');
    return;
  }

  const identical = [];
  const differing = [];
  const missing = [];

  for (const [url, legacyFile] of legacy) {
    const newFile = current.get(url);
    if (!newFile) {
      missing.push(url);
      continue;
    }
    const [a, b] = await Promise.all([readFile(legacyFile), readFile(newFile)]);
    if (a.equals(b)) identical.push(url);
    else differing.push({ url, legacy: a, current: b });
  }

  // Present in the new export but with no legacy counterpart — not a failure,
  // but worth surfacing (a new namespace, or a path that moved).
  const added = [...current.keys()].filter((url) => !legacy.has(url));

  console.log(`  ✓ byte-identical:              ${identical.length}`);
  console.log(`  ⚠ present but different:       ${differing.length}`);
  console.log(`  ✗ missing from the new export: ${missing.length}`);
  console.log(`  + new, no legacy counterpart:  ${added.length}\n`);

  if (missing.length) {
    console.log(`  Missing from the new export (${missing.length}):`);
    for (const url of missing.sort()) console.log(`    ${url}`);
    console.log('');
  }

  if (differing.length) {
    console.log(`  Contents differ (${differing.length}):`);
    for (const { url, legacy: a, current: b } of differing) {
      console.log(`    ${url}`);
      console.log(`      legacy: ${a.length} bytes  sha256:${digest(a)}`);
      console.log(`      new:    ${b.length} bytes  sha256:${digest(b)}`);
      for (const line of firstTextDifference(a, b)) console.log(`      ${line}`);
    }
    console.log('');
  }

  if (added.length) {
    console.log(`  New files with no legacy counterpart (${added.length}):`);
    for (const url of added.sort()) console.log(`    ${url}`);
    console.log('');
  }

  if (!differing.length && !missing.length) {
    console.log('  Every legacy .well-known file is present and byte-identical. ✓\n');
  }
}

/**
 * The first line that differs between two text files, for a readable report.
 * Returns an empty array for binary content or when the files differ only in
 * length.
 */
function firstTextDifference(a, b) {
  const decoder = new TextDecoder('utf8', { fatal: true });
  let left;
  let right;
  try {
    left = decoder.decode(a).split('\n');
    right = decoder.decode(b).split('\n');
  } catch {
    return []; // not UTF-8 text — the digests above are the whole story
  }
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    if (left[i] === right[i]) continue;
    return [
      `line ${i + 1}:`,
      `  legacy: ${left[i] === undefined ? '(end of file)' : truncate(left[i])}`,
      `  new:    ${right[i] === undefined ? '(end of file)' : truncate(right[i])}`,
    ];
  }
  return [];
}

/** Clip a line so one long JSON blob can't flood the report. */
function truncate(line, max = 160) {
  return line.length > max ? `${line.slice(0, max)}…` : line;
}

await main();
