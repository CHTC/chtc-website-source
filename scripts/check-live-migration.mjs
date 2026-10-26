#!/usr/bin/env node
/**
 * Live migration check: requests every file of the legacy Jekyll build from a
 * deployed copy of this site and reports the ones that are neither served nor
 * redirected somewhere that is.
 *
 * compare-migration.mjs answers the same question against the local export;
 * this one asks the real host, so it also catches what only shows up once
 * deployed (a path the host resolves differently, a stub that did not ship, a
 * redirect into another site that has since moved).
 *
 * Usage:
 *   pnpm check:live-migration [baseUrl] [legacySiteDir] [options]
 *
 * Options:
 *   --ignore <glob>      Skip legacy paths matching the glob (repeatable).
 *                        A single star stays within a path segment, a double
 *                        star crosses slashes. e.g. --ignore '/tmp/**'
 *   --concurrency <n>    Requests in flight at once (default 8).
 *   --out <file>         Write the failures here (default
 *                        live-migration-missing.txt).
 *   --json <file>        Also write every result, passes included, as JSON.
 *
 * Defaults:
 *   baseUrl       = https://chtc-nextjs.demo.chtc.io/
 *   legacySiteDir = ../chtc-website-source/_site
 *
 * Each legacy file is requested at the URL the old site served it from: its
 * own path, except that `a/index.html` is requested as `/a/`. A URL passes when
 * it answers 2xx, or redirects, by HTTP or by one of the stub pages
 * generate-redirects.mjs writes, to something that answers 2xx. Redirects are
 * followed off-site too, because legacy-only articles redirect to osg-htc.org.
 *
 * Exits 1 when anything failed.
 */

import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MAX_HOPS = 10;
const TIMEOUT_MS = 30_000;
const RETRIES = 2;

// --- arguments ---------------------------------------------------------------
const ignoreGlobs = [];
const positional = [];
let concurrency = 8;
let outArg = null;
let jsonArg = null;
{
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--ignore' || arg === '-i') ignoreGlobs.push(args[++i]);
    else if (arg.startsWith('--ignore=')) ignoreGlobs.push(arg.slice(9));
    else if (arg === '--concurrency' || arg === '-c') concurrency = Number(args[++i]);
    else if (arg.startsWith('--concurrency=')) concurrency = Number(arg.slice(14));
    else if (arg === '--out' || arg === '-o') outArg = args[++i];
    else if (arg.startsWith('--out=')) outArg = arg.slice(6);
    else if (arg === '--json') jsonArg = args[++i];
    else if (arg.startsWith('--json=')) jsonArg = arg.slice(7);
    else positional.push(arg);
  }
}

const BASE_URL = new URL(positional[0] ?? 'https://chtc-nextjs.demo.chtc.io/');
const LEGACY_DIR = path.resolve(
  positional[1] ?? '/Users/clock/WebstormProjects/chtc-website-source/_site'
);
const OUT_FILE = path.resolve(process.cwd(), outArg || 'live-migration-missing.txt');

if (!Number.isInteger(concurrency) || concurrency < 1) {
  console.error('check-live-migration: --concurrency must be a positive integer');
  process.exit(2);
}

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

const ignoreRes = ignoreGlobs.filter(Boolean).map(globToRegExp);
const ignored = (p) => ignoreRes.some((re) => re.test(p));

/** Recursively collect every file under `dir` (absolute paths). */
async function walkFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walkFiles(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/** The URL path the legacy site served a file from. */
function legacyUrlPath(file) {
  const rel = '/' + path.relative(LEGACY_DIR, file).split(path.sep).join('/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
}

/** Encode each segment, so names with spaces or `#` survive as one path. */
const encodePath = (p) => p.split('/').map(encodeURIComponent).join('/');

// The stubs generate-redirects.mjs writes: a 200 page whose only job is a
// `<meta http-equiv="refresh">`. Matching only that tag keeps a real page that
// happens to mention a URL from being read as a redirect.
const META_REFRESH =
  /<meta\s+http-equiv=["']?refresh["']?\s+content=["']\s*\d+\s*;\s*url=([^"']+)["']/i;

const NAMED_ENTITIES = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };

/** Decode the character references an attribute value may hold, as a browser would. */
const decodeEntities = (s) =>
  s.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (whole, ref) => {
    if (ref[0] !== '#') return NAMED_ENTITIES[ref.toLowerCase()] ?? whole;
    const hex = ref[1] === 'x' || ref[1] === 'X';
    return String.fromCodePoint(parseInt(ref.slice(hex ? 2 : 1), hex ? 16 : 10));
  });

/** fetch with a timeout, retrying network errors (not HTTP errors). */
async function request(url) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetch(url, {
        redirect: 'manual',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { 'user-agent': 'chtc-migration-check' },
      });
    } catch (error) {
      if (attempt >= RETRIES) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
}

/**
 * Follow a URL through HTTP redirects and redirect stubs.
 * @returns {Promise<{ ok: boolean, status: number | string, hops: string[] }>}
 */
async function resolve(start) {
  const hops = [start.href];
  let url = start;
  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    let res;
    try {
      res = await request(url);
    } catch (error) {
      return { ok: false, status: error.cause?.code ?? error.name, hops };
    }

    let next = null;
    if (res.status >= 300 && res.status < 400 && res.headers.has('location')) {
      next = new URL(res.headers.get('location'), url);
      await res.body?.cancel();
    } else if (res.ok && res.headers.get('content-type')?.includes('text/html')) {
      const match = (await res.text()).match(META_REFRESH);
      if (match) next = new URL(decodeEntities(match[1].trim()), url);
    } else {
      await res.body?.cancel();
    }

    if (!next) return { ok: res.ok, status: res.status, hops };
    if (hops.includes(next.href)) return { ok: false, status: 'redirect loop', hops };
    hops.push(next.href);
    url = next;
  }
  return { ok: false, status: `more than ${MAX_HOPS} redirects`, hops };
}

/** Run `fn` over `items` with at most `limit` in flight. */
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  let done = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
      done++;
      if (process.stderr.isTTY) process.stderr.write(`\r${done}/${items.length}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  if (process.stderr.isTTY) process.stderr.write('\n');
  return results;
}

// --- run ---------------------------------------------------------------------
const paths = [
  ...new Set((await walkFiles(LEGACY_DIR)).map(legacyUrlPath)),
].sort();
const toCheck = paths.filter((p) => !ignored(p));

console.log(
  `Checking ${toCheck.length} legacy URLs against ${BASE_URL.origin}` +
    (paths.length > toCheck.length ? ` (${paths.length - toCheck.length} ignored)` : '')
);

const results = await mapLimit(toCheck, concurrency, async (p) => ({
  path: p,
  ...(await resolve(new URL(encodePath(p).slice(1), BASE_URL))),
}));

const served = results.filter((r) => r.ok && r.hops.length === 1);
const redirected = results.filter((r) => r.ok && r.hops.length > 1);
const failed = results.filter((r) => !r.ok);

let report = '';
for (const { path: p, status, hops } of failed) {
  report += `${p}  (${status})\n`;
  for (const hop of hops.slice(1)) report += `  -> ${hop}\n`;
}
await writeFile(OUT_FILE, report);
if (jsonArg) {
  const json = { baseUrl: BASE_URL.href, checkedAt: new Date().toISOString(), results };
  await writeFile(path.resolve(process.cwd(), jsonArg), JSON.stringify(json, null, 2) + '\n');
}

console.log(`Served:     ${served.length}`);
console.log(`Redirected: ${redirected.length}`);
console.log(`Failed:     ${failed.length}`);
if (failed.length > 0) {
  console.log(`\nFailures written to ${path.relative(process.cwd(), OUT_FILE)}`);
  process.exit(1);
}
