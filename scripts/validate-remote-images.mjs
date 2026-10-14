// Merge the per-process remote-image shards into `.remote-images.json`, and
// drop anything next-image-export-optimizer would choke on.
//
// The list is built from the CHTC/Articles and CHTC/events repositories,
// which this site does not control. A bad image URL used to show as one
// missing picture; now that the build downloads every image it renders, the
// optimizer aborts on the first failure and the whole deploy fails. A URL
// the optimizer cannot fetch is a content bug, not a build bug, so it is
// reported and skipped — `ExportedImage` falls back to the original URL,
// which is what the page did before any of this.
import fs from 'node:fs/promises';
import path from 'node:path';

const SHARD_DIR = path.join(process.cwd(), '.remote-images');
const MANIFEST = path.join(process.cwd(), '.remote-images.json');
const CONCURRENCY = 20;
const TIMEOUT_MS = 20_000;

/** Every URL the build recorded, across all of its worker processes. */
async function readShards() {
  let names;
  try {
    names = await fs.readdir(SHARD_DIR);
  } catch {
    // No shards at all. `remoteOptimizedImages.js` explains this case better
    // than a stack trace from here would.
    return null;
  }

  const urls = new Set();
  for (const name of names) {
    if (!name.endsWith('.json')) continue;
    try {
      const parsed = JSON.parse(
        await fs.readFile(path.join(SHARD_DIR, name), 'utf-8')
      );
      if (Array.isArray(parsed)) for (const url of parsed) urls.add(url);
    } catch {
      console.warn(`validate-remote-images: skipping unreadable shard ${name}`);
    }
  }
  return [...urls].sort();
}

/**
 * Whether the optimizer will manage to download this URL.
 *
 * Deliberately stricter than a plain `fetch`. The optimizer downloads with
 * `https.get`, which does not follow redirects, and rejects anything that is
 * not a 200 carrying an image content type. So a URL that only resolves after
 * a redirect — `github.com/<org>/<repo>/raw/...`, which is the idiom most
 * people reach for, and any `http://` that upgrades — would sail past a
 * redirect-following check and then abort the build.
 */
async function check(url) {
  // HEAD first; some hosts refuse it, hence the one-byte GET fallback.
  for (const init of [{ method: 'HEAD' }, { headers: { range: 'bytes=0-0' } }]) {
    let response;
    try {
      response = await fetch(url, {
        ...init,
        redirect: 'manual',
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      // A network error here is not evidence about the URL itself.
      return { ok: true };
    }

    // Always release the connection: a ranged GET against a host that
    // ignores `Range` is sending the entire image.
    await response.body?.cancel().catch(() => {});

    const { status } = response;
    if (status >= 300 && status < 400) {
      const target = response.headers.get('location') ?? 'elsewhere';
      return { ok: false, why: `redirects to ${target}, which the optimizer will not follow` };
    }
    // Server-side trouble is usually transient; leave it in and let the
    // optimizer report it if it is still failing moments later.
    if (status >= 500) return { ok: true };
    if (status === 403 || status === 405) continue; // retry with the GET
    if (status >= 400) return { ok: false, why: `HTTP ${status}` };

    const type = response.headers.get('content-type') ?? '';
    if (
      type &&
      !type.startsWith('image/') &&
      !type.startsWith('application/octet-stream')
    ) {
      return { ok: false, why: `content type ${type} is not an image` };
    }
    return { ok: true };
  }
  return { ok: false, why: 'rejected both HEAD and a ranged GET' };
}

async function main() {
  const urls = await readShards();
  if (urls === null) {
    console.warn(
      'validate-remote-images: no manifest shards found; leaving any existing ' +
        `${path.basename(MANIFEST)} alone.`
    );
    return;
  }

  const usable = [];
  const rejected = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(check));
    batch.forEach((url, index) => {
      if (results[index].ok) usable.push(url);
      else rejected.push([url, results[index].why]);
    });
  }

  await fs.writeFile(MANIFEST, JSON.stringify(usable, null, 2));

  if (rejected.length === 0) {
    console.log(
      `validate-remote-images: all ${usable.length} remote images are fetchable.`
    );
    return;
  }

  console.warn(
    `validate-remote-images: dropping ${rejected.length} of ${urls.length} ` +
      'image(s). Fix the URL in the content repository:'
  );
  for (const [url, why] of rejected) console.warn(`  ${url}\n    ${why}`);
}

await main();
