// Track how long each external link has been failing, and report the ones
// that have failed on every check for at least a week.
//
//   node scripts/external-link-history.mjs <lychee.json> <history.json> <report.md>
//
// External sites go down, rate-limit, and time out for an afternoon often
// enough that failing on any single bad check would be noise. So each run
// records when a link first failed, forgets it the moment it succeeds again,
// and only links whose first failure is more than a week old are reported.
// The history file lives in the Actions cache between runs; a missing or
// unreadable one starts the clock over.
//
// Exits 1 when there is something to report, so the job fails.
import fs from 'node:fs/promises';

const THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

const [reportPath, historyPath, outPath] = process.argv.slice(2);
if (!reportPath || !historyPath || !outPath) {
  console.error(
    'usage: external-link-history.mjs <lychee.json> <history.json> <report.md>'
  );
  process.exit(2);
}

const report = JSON.parse(await fs.readFile(reportPath, 'utf-8'));

/** @type {Record<string, { firstFailed: string }>} */
let history = {};
try {
  history = JSON.parse(await fs.readFile(historyPath, 'utf-8'));
} catch {
  console.warn('external-link-history: no previous history, starting fresh');
}

function statusText(status) {
  if (typeof status === 'string') return status;
  return status?.details ?? status?.text ?? 'unknown error';
}

// lychee reports failures per page; this wants them per URL. A URL on several
// pages is only fetched once, and the repeats say "Error (cached)" rather than
// why, so the real reason wins whichever page it was reported against.
const CACHED = 'Error (cached)';
/** @type {Map<string, { status: string, pages: Set<string> }>} */
const failing = new Map();
for (const [page, entries] of Object.entries(report.error_map ?? {})) {
  for (const entry of entries) {
    const status = statusText(entry.status);
    const failure = failing.get(entry.url) ?? { status, pages: new Set() };
    if (failure.status === CACHED) failure.status = status;
    failure.pages.add(page);
    failing.set(entry.url, failure);
  }
}

// Anything absent from this run either succeeded or is no longer linked;
// either way its clock stops.
const now = new Date();
const nextHistory = {};
for (const url of [...failing.keys()].sort()) {
  nextHistory[url] = { firstFailed: history[url]?.firstFailed ?? now.toISOString() };
}
await fs.writeFile(historyPath, JSON.stringify(nextHistory, null, 2) + '\n');

const broken = [...failing]
  .filter(([url]) => now - new Date(nextHistory[url].firstFailed) >= THRESHOLD_MS)
  .sort(([a], [b]) => a.localeCompare(b));

const days = (url) =>
  Math.floor((now - new Date(nextHistory[url].firstFailed)) / (24 * 60 * 60 * 1000));

// The page paths are lychee's input paths on the runner; strip everything up
// to the extracted site directory so they read as site paths.
const sitePath = (page) =>
  page.replace(/^.*?\/_site\//, '/').replace(/(^|\/)index\.html$/, '$1');

let body = '## External links\n\n';
body +=
  `${failing.size} external link${failing.size === 1 ? '' : 's'} failed this run; ` +
  `${broken.length} ha${broken.length === 1 ? 's' : 've'} been failing for at least a week.\n\n`;
for (const [url, { status, pages }] of broken) {
  body += `- ${url} (${days(url)} days): ${status}\n`;
  for (const page of [...pages].sort()) body += `  - ${sitePath(page)}\n`;
}

await fs.writeFile(outPath, body);
console.log(body);
process.exit(broken.length > 0 ? 1 : 0);
