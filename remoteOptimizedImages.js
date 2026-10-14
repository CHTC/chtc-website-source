// Remote images next-image-export-optimizer should download and generate
// variants for. It `require()`s this file (CommonJS) after `next build`, via
// the `postbuild` script.
//
// The list is the manifest that `utils/remoteImages.ts` writes while the
// pages render — staff portraits, article art and event art — so it is
// exactly what the build asked for. The ordering matters: `next build` has to
// run first, which `postbuild` ensures.
const fs = require('fs');
const path = require('path');

const MANIFEST = path.join(__dirname, '.remote-images.json');

if (!fs.existsSync(MANIFEST)) {
  throw new Error(
    `remoteOptimizedImages.js: ${MANIFEST} is missing. It is written during ` +
      '`next build`; run the build before the image optimizer.'
  );
}

const urls = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));

if (!Array.isArray(urls) || urls.length === 0) {
  throw new Error(
    `remoteOptimizedImages.js: ${MANIFEST} is empty. The remote content ` +
      'failed to load during the build, and every portrait, article image ' +
      'and event image would fall back to the unoptimized original.'
  );
}

module.exports = urls;
