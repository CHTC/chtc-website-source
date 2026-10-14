import fs from 'fs';
import path from 'path';
import type { Staff } from '@chtc/web-components/content';

/**
 * Directory of per-process shards naming the remote images the build
 * rendered. `scripts/validate-remote-images.mjs` merges them into
 * `.remote-images.json`, which `remoteOptimizedImages.js` reads once the
 * build has finished.
 *
 * next-image-export-optimizer only generates variants for images declared up
 * front, and most of this site's photography is absolute URLs — staff
 * headshots on chtc.github.io, article and event art on
 * raw.githubusercontent.com — rather than files under `public/`. Anything
 * missing from the list renders at full size straight from the origin, so the
 * pages that show remote images record the URLs they used instead of us
 * maintaining a second hand-written list.
 *
 * One file per process rather than one shared file: `next build` renders
 * pages in a pool of workers (three of them on this site today), and a
 * read-modify-write of a single manifest drops whatever a sibling wrote
 * between the read and the write. Each process only ever writes its own
 * shard, so there is nothing to race over.
 */
export const REMOTE_IMAGE_DIR = path.join(process.cwd(), '.remote-images');

/**
 * Everything this process has recorded. Keeping it in memory is what lets the
 * shard be written whole each time instead of read back and merged.
 */
const recorded = new Set<string>();

/**
 * next-image-export-optimizer passes every URL through `new URL()` and keys
 * the generated file on the extension, so anything it cannot parse or cannot
 * re-encode would only add a download and a broken variant.
 */
const OPTIMIZABLE = /^https?:\/\/.+\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i;

/** Add these URLs to this process's shard. */
export function recordRemoteImages(
  candidates: Iterable<string | undefined | null>
): void {
  const before = recorded.size;

  for (const candidate of candidates) {
    if (candidate && OPTIMIZABLE.test(candidate)) {
      recorded.add(candidate);
    }
  }

  // Most pages after the first contribute nothing new.
  if (recorded.size === before) return;

  fs.mkdirSync(REMOTE_IMAGE_DIR, { recursive: true });
  const shard = path.join(REMOTE_IMAGE_DIR, `${process.pid}.json`);
  const tmp = `${shard}.tmp`;
  // Written through a temporary file so the merge step never reads a shard
  // that is half-written.
  fs.writeFileSync(tmp, JSON.stringify([...recorded].sort(), null, 2));
  fs.renameSync(tmp, shard);
}

/** Add these people's portraits to the manifest. */
export function recordStaffImages(staff: Staff[]): void {
  recordRemoteImages(staff.map((member) => member.image));
}

/**
 * Absolute image URLs referenced from a markdown body.
 *
 * Article and event bodies carry both markdown `![](url)` images and raw HTML
 * `<img src="url">` tags, so this matches the URL itself rather than either
 * syntax. A trailing query string is part of the URL: the optimizer and the
 * runtime loader both hash the whole string, so recording `x.png` for a page
 * that renders `x.png?raw=true` would generate the variant under one name and
 * request it under another.
 */
const MARKDOWN_IMAGE_URL =
  /https?:\/\/[^\s"'()<>\\]+\.(?:jpe?g|png|gif|webp|avif)(?:\?[^\s"'()<>\\]*)?/gi;

/**
 * A quoted `src` attribute in raw HTML may hold characters the bare-URL scan
 * stops at (spaces, parentheses — `images/Greg htc26.jpg` is a real case), so
 * those are matched by their quotes instead.
 */
const HTML_IMAGE_SRC = /<img\b[^>]*?\bsrc\s*=\s*(["'])(https?:\/\/[^"']+?)\1/gi;

export function extractMarkdownImageUrls(
  ...bodies: (string | undefined | null)[]
): string[] {
  const urls: string[] = [];
  for (const body of bodies) {
    if (!body) continue;
    urls.push(...(body.match(MARKDOWN_IMAGE_URL) ?? []));
    for (const match of body.matchAll(HTML_IMAGE_SRC)) urls.push(match[2]);
  }
  return urls;
}
