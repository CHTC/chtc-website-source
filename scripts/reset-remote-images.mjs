// Clear the remote-image manifest before a build.
//
// The shards are written per worker process and never read back, so a shard
// left behind by an earlier build — with a different set of pages, or from a
// run that was interrupted — would otherwise be merged in as though this
// build had asked for it.
import fs from 'node:fs/promises';
import path from 'node:path';

for (const target of ['.remote-images', '.remote-images.json']) {
  await fs.rm(path.join(process.cwd(), target), {
    recursive: true,
    force: true,
  });
}
