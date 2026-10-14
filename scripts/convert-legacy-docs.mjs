#!/usr/bin/env node
/**
 * One-off (but re-runnable) port of the legacy Jekyll `_uw-research-computing`
 * collection into `content/uw-research-computing/`.
 *
 *   node scripts/convert-legacy-docs.mjs [path/to/chtc-website-source]
 *
 * The legacy repository does not exist at CI time, so everything the docs
 * routes read at build time is written into this repository:
 *
 *   content/uw-research-computing/docs/<path>.md   one per published document
 *   content/uw-research-computing/menus/*.yml      sidebar / section menus
 *   content/uw-research-computing/data/*.yml       gpus, learning resources
 *   redirects/docs.json                            legacy `.html` → new route
 *   public/uw-research-computing/campus_map.html   static folium map (iframed)
 *   public/images/uw-research-computing/…          images that sat beside docs
 *
 * The documents stay markdown strings rendered by `react-markdown` (never MDX:
 * shell snippets full of `<` and `{` would not survive it). What this script
 * removes is everything Jekyll-specific:
 *
 *   - Liquid: `{% capture %}…{% include directory.html %}` becomes a
 *     `<div class="uw-toc">` box, `{% include markdown-container.html %}`
 *     wrappers are unwrapped, `install_docker.md` is inlined, comments and
 *     `relative_url` filters are evaluated, and the few loops over `site.*`
 *     data become custom elements (`<gpu-table>`, `<excerpt-tabs>`,
 *     `<facilitator-grid>`, `<upcoming-events>`) that the docs route renders
 *     from data at build time.
 *   - kramdown block IALs (`{:.term}`, `{:.tip}`, …) become a wrapping
 *     `<div class="md-<class>">` so the styling survives.
 *   - Links: every relative link is resolved against the page's legacy URL
 *     (new routes end in a slash, so a relative `form.html` would otherwise
 *     resolve one directory too deep), `.html` is dropped and a trailing
 *     slash added, and links to retired documents go to their replacement.
 *
 * The script fails if any `{%`/`{{` is left in its output.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LEGACY = path.resolve(
  process.argv[2] || path.join(ROOT, '..', 'chtc-website-source')
);
const SRC = path.join(LEGACY, '_uw-research-computing');

const OUT_CONTENT = path.join(ROOT, 'content', 'uw-research-computing');
const OUT_DOCS = path.join(OUT_CONTENT, 'docs');
const OUT_REDIRECTS = path.join(ROOT, 'redirects', 'docs.json');
const SECTION = '/uw-research-computing';

if (!fs.existsSync(SRC)) {
  console.error(`[convert-docs] legacy collection not found at ${SRC}`);
  process.exit(1);
}

/* ------------------------------------------------------------------------ */
/* Data files                                                               */
/* ------------------------------------------------------------------------ */

const DATA_FILES = {
  menus: [
    'htc-guide-menu.yml',
    'hpc-guide-menu.yml',
    'uw-research-computing-menu.yml',
    'user-portal-menu.yaml',
    'user-portal-sections.yaml',
  ],
  data: ['learning-resources.yml', 'gpus.yaml'],
};

for (const [dir, files] of Object.entries(DATA_FILES)) {
  fs.mkdirSync(path.join(OUT_CONTENT, dir), { recursive: true });
  for (const file of files) {
    fs.copyFileSync(
      path.join(LEGACY, '_data', file),
      path.join(OUT_CONTENT, dir, file)
    );
  }
}

/** Static files that sat inside the collection and are referenced by pages. */
const STATIC_COPIES = [
  // A self-contained folium/leaflet page, iframed by the section home page.
  ['campus_map.html', path.join('public', 'uw-research-computing', 'campus_map.html')],
  // Under public/images so the export optimizer generates variants for it.
  [
    path.join('htc', 'dagman-talk-screenshot.png'),
    path.join('public', 'images', 'uw-research-computing', 'dagman-talk-screenshot.png'),
  ],
];
for (const [from, to] of STATIC_COPIES) {
  fs.mkdirSync(path.dirname(path.join(ROOT, to)), { recursive: true });
  fs.copyFileSync(path.join(SRC, from), path.join(ROOT, to));
}

/* ------------------------------------------------------------------------ */
/* Routes and link normalisation                                            */
/* ------------------------------------------------------------------------ */

/**
 * Pages in the collection that are hand-built `page.tsx` routes rather than
 * converted documents (legacy `.html` pages with layouts and Liquid loops).
 */
const HAND_PAGES = {
  'index.html': { path: `${SECTION}/`, title: 'UW Research Computing Home' },
  'how-tos.html': { path: `${SECTION}/how-tos/`, title: "How To's" },
  'htc/guides.html': { path: `${SECTION}/htc/guides/`, title: 'HTC Computing Guides' },
  'hpc/guides.html': { path: `${SECTION}/hpc/guides/`, title: 'HPC Computing Guides' },
  'user-portal.html': { path: `${SECTION}/user-portal/`, title: 'CHTC User Portal' },
  'learning-resources.html': { path: `${SECTION}/learning-resources/`, title: 'Learning Resources' },
  'other-resources.html': { path: `${SECTION}/other-resources/`, title: 'Other Resources' },
};

/**
 * Legacy addresses (extension dropped) that are redirects, not documents.
 * Collected from the collection's own `layout: redirect` files below and from
 * the `_redirects` collection entries whose permalinks sit in this section.
 */
const ALIASES = new Map([
  [`${SECTION}/index`, `${SECTION}/`],
  [`${SECTION}/archived/software-overview-htc`, `${SECTION}/software-overview-htc/`],
]);

/** `_redirects` entries with a permalink inside this section. */
function legacyRedirectCollection() {
  const dir = path.join(LEGACY, '_redirects');
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const file of fs.readdirSync(dir)) {
    const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (!data.permalink || !data.redirect_url) continue;
    const permalink = String(data.permalink).startsWith('/')
      ? String(data.permalink)
      : `/${data.permalink}`;
    if (!permalink.startsWith(`${SECTION}/`)) continue;
    out.push({ permalink, target: String(data.redirect_url), title: data.title });
  }
  return out;
}

const OWN_ORIGIN = /^https?:\/\/(www\.)?chtc\.cs\.wisc\.edu(?=\/|$)/i;

/**
 * Rewrite one href/src found in a document whose legacy URL is `baseUrl`.
 * External URLs, fragments and Liquid-free absolute URLs to files are kept.
 */
function normalizeHref(raw, baseUrl) {
  const href = raw.trim();
  if (!href || href.startsWith('#')) return href;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) {
    // Links to this site written as absolute URLs stay absolute: they are
    // correct as written and keep working through the redirect stubs.
    return href;
  }
  let url;
  try {
    url = new URL(href, `https://legacy.invalid${baseUrl}`);
  } catch {
    return href;
  }
  let p = decodeURI(url.pathname);
  p = p.replace(/\.s?html$/i, '');
  if (p.endsWith('/index')) p = p.slice(0, -'index'.length);
  const alias = ALIASES.get(p.replace(/\/$/, ''));
  if (alias) {
    const [aliasPath, aliasHash] = alias.split('#');
    return aliasPath + (url.hash || (aliasHash ? `#${aliasHash}` : ''));
  }
  const last = p.split('/').pop() ?? '';
  if (!last.includes('.') && !p.endsWith('/')) p += '/';
  return encodeURI(p) + url.search + url.hash;
}

/* ------------------------------------------------------------------------ */
/* Body transforms                                                          */
/* ------------------------------------------------------------------------ */

const INSTALL_DOCKER = fs
  .readFileSync(path.join(LEGACY, '_includes', 'install_docker.md'), 'utf8')
  .trim();

/** Fenced code blocks, as [openLine, closeLine] index pairs. */
function fenceRanges(lines) {
  const ranges = [];
  let open = -1;
  let marker = '';
  lines.forEach((line, i) => {
    // Fences may sit inside blockquotes (`> ````).
    const m = line.match(/^(?:\s*>)*\s*(`{3,}|~{3,})/);
    if (!m) return;
    if (open < 0) {
      open = i;
      marker = m[1];
    } else if (
      m[1][0] === marker[0] &&
      m[1].length >= marker.length &&
      unquote(line).trim() === m[1]
    ) {
      ranges.push([open, i]);
      open = -1;
    }
  });
  if (open >= 0) ranges.push([open, lines.length - 1]);
  return ranges;
}

/** Apply `fn` to the parts of `body` outside fenced code blocks. */
function outsideFences(body, fn) {
  const lines = body.split('\n');
  const ranges = fenceRanges(lines);
  const out = [];
  let cursor = 0;
  for (const [a, b] of ranges) {
    out.push(fn(lines.slice(cursor, a).join('\n')));
    out.push(lines.slice(a, b + 1).join('\n'));
    cursor = b + 1;
  }
  out.push(fn(lines.slice(cursor).join('\n')));
  return out.join('\n');
}

/** The Table-of-Contents box the legacy `components/directory.html` drew. */
function tocBox(inner, title) {
  return [
    '',
    '<div class="uw-toc">',
    title ? `<p class="uw-toc-title">${title}</p>` : '',
    '',
    inner.trim(),
    '',
    '</div>',
    '',
  ].join('\n');
}

const IAL = /^((?:\s*>)*\s*)\{:\s*\.([\w-]+)\s*\}\s*$/;

/** A line without its blockquote markers. */
function unquote(line) {
  return line.replace(/^(?:\s*>)+ ?/, '');
}

/**
 * kramdown block IALs: `{:.x}` on the line after a block (or before one,
 * after a blank line) gives that block class `x`. CommonMark has no such
 * thing, so the block is wrapped in `<div class="md-x">` instead.
 */
function applyIals(body) {
  const lines = body.split('\n');
  const fences = fenceRanges(lines);
  const fenceOf = new Map();
  for (const [a, b] of fences) {
    fenceOf.set(a, [a, b]);
    fenceOf.set(b, [a, b]);
  }
  const inFence = (i) => fences.some(([a, b]) => i > a && i < b);
  /** Blockquote depth of a line (`> > x` is 2). */
  const depth = (line) => (line.match(/^(?:\s*>)*/)[0].match(/>/g) ?? []).length;
  /**
   * Whether line `i` separates blocks at quote depth `d`: a blank line at
   * that depth (`>` alone counts inside a quote, not outside one), or another IAL.
   */
  const isBoundary = (i, d) => {
    if (i < 0 || i >= lines.length) return true;
    if (IAL.test(lines[i])) return depth(lines[i]) <= d;
    if (lines[i].trim() === '') return true;
    return depth(lines[i]) >= d && d > 0 && unquote(lines[i]).trim() === '';
  };
  /** A fence that is the whole block only if it sits at the IAL's own depth. */
  const fenceAt = (i, d, side) =>
    fenceOf.has(i) && fenceOf.get(i)[side] === i && depth(lines[i]) === d ? fenceOf.get(i) : undefined;

  const before = new Map();
  const after = new Map();
  const drop = new Set();
  const push = (map, i, items) => map.set(i, [...(map.get(i) ?? []), ...items]);

  lines.forEach((line, i) => {
    if (inFence(i)) return;
    const m = line.match(IAL);
    if (!m) return;
    drop.add(i);
    const d = depth(line);
    let start;
    let end;
    if (!isBoundary(i - 1, d)) {
      end = i - 1;
      const fence = fenceAt(end, d, 1);
      if (fence) {
        start = fence[0];
      } else {
        start = end;
        while (!isBoundary(start - 1, d) || inFence(start - 1)) start--;
      }
    } else if (!isBoundary(i + 1, d)) {
      start = i + 1;
      const fence = fenceAt(start, d, 0);
      if (fence) {
        end = fence[1];
      } else {
        end = start;
        while (!isBoundary(end + 1, d) || inFence(end + 1)) end++;
      }
    } else {
      return; // a stray IAL; just drop it
    }
    // The IAL's own prefix says where the block is: `> {:.term}` styles a
    // code block inside a quote, a bare `{:.tip}` after `> …` lines styles
    // the whole quote. Inside a quote the wrapper and its blank lines keep
    // the `>`.
    const indent = m[1];
    const blank = indent.replace(/\s+$/, '');
    push(before, start, [blank, `${indent}<div class="md-${m[2]}">`, blank]);
    push(after, end, [blank, `${indent}</div>`, blank]);
  });

  const out = [];
  lines.forEach((line, i) => {
    out.push(...(before.get(i) ?? []));
    if (!drop.has(i)) out.push(line);
    out.push(...(after.get(i) ?? []));
  });
  return out.join('\n');
}

/** CommonMark "type 6" HTML block tags: such a line starts a raw HTML block. */
const BLOCK_TAGS =
  'address|article|aside|blockquote|center|details|dialog|div|dl|fieldset|figcaption|figure|footer|form|h[1-6]|header|hr|iframe|li|main|nav|ol|p|section|summary|table|ul';
const ONE_LINE_BLOCK = new RegExp(
  // a whole block element on one line, or a lone `<br>` (an HTML block too)
  `^((?:\\s{0,3}>)*\\s*)(?:<(${BLOCK_TAGS})\\b[^>]*>.*<\\/\\2>|<br\\s*\\/?>)\\s*$`,
  'i'
);

/**
 * A line holding a whole block-level element (`<iframe …></iframe>`,
 * `<p style="…"><img …></p>`) starts a raw HTML block in CommonMark, which
 * runs to the next blank line and so swallows the markdown on the lines
 * after it as literal text. kramdown ends the element at its closing tag.
 * A blank line (keeping any blockquote `>` prefix) restores that.
 */
function separateHtmlLines(body) {
  const lines = body.split('\n');
  const inFence = new Set();
  for (const [a, b] of fenceRanges(lines)) for (let i = a; i <= b; i++) inFence.add(i);
  const out = [];
  lines.forEach((line, i) => {
    out.push(line);
    if (inFence.has(i)) return;
    const m = line.match(ONE_LINE_BLOCK);
    const next = lines[i + 1];
    if (!m || next === undefined) return;
    const prefix = m[1];
    const quote = prefix.replace(/\s+$/, '');
    if (!next.startsWith(quote)) return;
    const rest = next.slice(quote.length);
    // Only when the next line sits at the same level as the element (a
    // deeper one would become an indented code block once separated).
    const own = indentWidth(line.slice(quote.length).replace(/^ /, ''));
    if (rest.trim() === '' || rest.trim().startsWith('<') || indentWidth(rest.replace(/^ /, '')) > own) return;
    out.push(quote);
  });
  return out.join('\n');
}

/** Visual width of leading whitespace (tab stops of 4). */
function indentWidth(line) {
  let width = 0;
  for (const ch of line) {
    if (ch === ' ') width += 1;
    else if (ch === '\t') width += 4 - (width % 4);
    else break;
  }
  return width;
}

/**
 * kramdown keeps an indented fence's body verbatim even when its lines sit
 * at column 0 (common inside list items). CommonMark ends the list item at
 * the first under-indented line, which splits the code block and turns
 * `+GPUJobLength = …` into a list. Indent such lines to the fence's level;
 * CommonMark strips exactly that much again, so the code is unchanged.
 */
function reindentFences(body) {
  const lines = body.split('\n');
  for (const [a, b] of fenceRanges(lines)) {
    const fenceIndent = lines[a].match(/^\s*/)[0];
    const width = indentWidth(lines[a]);
    if (width === 0) continue;
    for (let i = a + 1; i < b; i++) {
      if (lines[i].trim() !== '' && indentWidth(lines[i]) < width) {
        lines[i] = fenceIndent + lines[i];
      }
    }
  }
  return lines.join('\n');
}

/** Count the cells of a pipe-table row. */
function cells(row) {
  const trimmed = row.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split(/(?<!\\)\|/).length;
}

/**
 * kramdown is lenient about pipe tables where GFM is not, and GFM renders a
 * table it rejects as a paragraph of pipes:
 *   - the separator row must have exactly as many cells as the header
 *     (`| --- |` under three columns, or four under three, both occur);
 *   - a table must have a header. kramdown renders a block of `| a | b |`
 *     rows with no separator as a header-less table; here it gets an empty
 *     header row (hidden by the docs CSS).
 */
function fixTables(body) {
  const lines = body.split('\n');
  const DELIM = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
  const isRow = (line) => line !== undefined && /^\s*\|/.test(line);
  const inFence = new Set();
  for (const [a, b] of fenceRanges(lines)) for (let i = a; i <= b; i++) inFence.add(i);

  // `a || b` inside a code span in a cell: GFM splits cells on every
  // unescaped pipe, code spans included; kramdown did not.
  const escapeCodePipes = (row) =>
    row.replace(/(`+)([^`]+?)\1/g, (span, ticks, code) =>
      `${ticks}${code.replace(/(?<!\\)\|/g, '\\|')}${ticks}`
    );
  for (let i = 0; i < lines.length; i++) {
    if (isRow(lines[i]) && !inFence.has(i)) lines[i] = escapeCodePipes(lines[i]);
  }

  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const startsBlock = isRow(line) && !inFence.has(i) && !isRow(lines[i - 1]);
    if (!startsBlock) {
      out.push(line);
      continue;
    }
    const indent = line.match(/^\s*/)[0];
    // kramdown sizes a table by its widest row; GFM by its header and drops
    // the extra cells, so the header is padded to the widest row.
    let end = i;
    while (isRow(lines[end + 1]) && !inFence.has(end + 1)) end++;
    const width = Math.max(
      ...lines.slice(i, end + 1).filter((l) => !DELIM.test(l)).map(cells)
    );
    const pad = (row) => row.replace(/\s*$/, '') + '  |'.repeat(Math.max(0, width - cells(row)));
    const separator = `${indent}|${' --- |'.repeat(width)}`;
    if (DELIM.test(line)) {
      out.push(line); // a stray separator; leave it
    } else if (isRow(lines[i + 1]) && DELIM.test(lines[i + 1])) {
      out.push(pad(line), separator); // header + (normalised) separator
      i++;
    } else {
      out.push(`${indent}|${'  |'.repeat(width)}`, separator, line); // no header
    }
  }
  return out.join('\n');
}

/** Roughly GitHub's heading slug; only used to recognise a missing `#`. */
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>|[`*_]/g, '')
    .replace(/[^\w\- ]/g, '')
    .trim()
    .replace(/ /g, '-');

/**
 * `<span name="x"></span>` lines precede most headings as TOC targets. `name`
 * on a span is not a fragment target, so on the legacy site the TOC links
 * worked only where the heading's own generated id happened to match. Each
 * becomes an empty `<div id>` block (a span would sit in an empty paragraph
 * and add a gap), or is dropped when the next heading already carries that id.
 */
function namedAnchors(body) {
  const lines = body.split('\n');
  const out = [];
  lines.forEach((line, i) => {
    const m = line.match(/^(\s*)<(?:span|a) name="([^"]+)">\s*<\/(?:span|a)>\s*$/);
    if (!m) {
      out.push(line);
      return;
    }
    const next = lines.slice(i + 1).find((l) => l.trim() !== '') ?? '';
    const heading = next.match(/^\s*#{1,6}\s+(.+)$/);
    if (heading && slugify(heading[1]) === m[2]) return;
    out.push(`${m[1]}<div id="${m[2]}"></div>`, '');
  });
  return out.join('\n');
}

/** Rewrite every link and image address outside code. */
function rewriteLinks(body, baseUrl, report) {
  // A few links name a heading on the same page but forgot the `#`
  // (`[Example](4-example-using-…)`); the legacy site 404ed on them.
  const anchors = new Set([
    ...[...body.matchAll(/^\s*#{1,6}\s+(.+)$/gm)].map((m) => slugify(m[1])),
    ...[...body.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]),
  ]);
  const fix = (href) => {
    if (/^[\w-]+$/.test(href) && href.includes('-') && anchors.has(href)) return `#${href}`;
    const out = normalizeHref(href, baseUrl);
    if (out.startsWith(`${SECTION}/`)) report.internal.add(out.split('#')[0]);
    return out;
  };
  return outsideFences(body, (text) =>
    text
      // markdown inline links and images: [text](url "title")
      .replace(/(\]\()(\s*<?)([^)\s>]+)(>?[^)]*\))/g, (_, a, b, href, rest) => a + b + fix(href) + rest)
      // reference definitions: [id]: url
      .replace(/^(\s*\[[^\]]+\]:\s*)(\S+)/gm, (_, a, href) => a + fix(href))
      // raw HTML attributes
      .replace(/\b(href|src)=(["'])(.*?)\2/g, (_, attr, q, href) => `${attr}=${q}${fix(href)}${q}`)
      // unquoted attributes (`src=foo.png`)
      .replace(/\b(href|src)=([^\s"'>]+)/g, (_, attr, href) => `${attr}="${fix(href)}"`)
  );
}

/** Plain text of the first prose paragraph, for the meta description. */
function describe(body, title) {
  const blocks = body
    .replace(/<div class="uw-toc">[\s\S]*?<\/div>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  for (const block of blocks) {
    if (/^(#|<(?!a |b>|strong|em|i>|code)|\||`|~|>|\{|\d+\.|[-*+] |!\[)/.test(block)) continue;
    const text = block
      .replace(/<[^>]+>/g, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/\\(.)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length < 40) continue;
    if (text.length <= 200) return text;
    return `${text.slice(0, 197).replace(/\s+\S*$/, '')}…`;
  }
  return `${title} — CHTC research computing documentation.`;
}

/** Collection-specific Liquid that loops over site data. */
function replaceDataLoops(body, rel) {
  let out = body;

  // gpu-jobs.md: the GPU Lab hardware table is generated from _data/gpus.yaml.
  out = out.replace(
    /<table class="gtable">(?:(?!<\/table>)[\s\S])*?site\.data\.gpus[\s\S]*?<\/table>/,
    '\n<gpu-table owner="campus"></gpu-table>\n'
  );

  // software-overview-htc.md / htc-basic-scripting.md: tabs that show the
  // excerpt of every document carrying a given frontmatter flag.
  out = out.replace(
    /<div class="shadow p-3 border rounded">[\s\S]*?where_exp: "x", "x\.(\w+)(?:\.size > 0)?"[\s\S]*?\{% endfor %\}[\s\S]*?\{% endfor %\}\s*<\/div>\s*<\/div>/,
    (_, flag) =>
      `\n<excerpt-tabs flag="${flag}"${flag === 'software_icon' ? ' more="true"' : ''}></excerpt-tabs>\n`
  );

  // facilitation-team.md: a portrait grid of everyone flagged a facilitator.
  out = out.replace(
    /<div class="row justify-content-around[^"]*">\s*\{% include get\/team\.liquid %\}[\s\S]*?\{% endfor %\}\s*<\/div>/,
    '\n<facilitator-grid></facilitator-grid>\n'
  );

  // bioinformatics-cafe.md: the next two events tagged for the café.
  out = out.replace(
    /\{% include get\/future_events\.liquid %\}[\s\S]*?where: "tags", "([\w-]+)"[\s\S]*?limit:(\d+)[\s\S]*?\{% endfor %\}/,
    // No blank lines: this sits inside an indented HTML block, and a blank
    // line would turn the rest of it into an indented code block.
    (_, tag, limit) => `<upcoming-events tag="${tag}" limit="${limit}"></upcoming-events>`
  );

  if (/\{%\s*(for|if|assign)\b/.test(out)) {
    throw new Error(`${rel}: unhandled Liquid control flow`);
  }
  return out;
}

/** Document-level transforms, in order. */
function convertBody(body, { rel, title, layout, baseUrl, report }) {
  let out = body.replace(/\r\n/g, '\n');

  out = out.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '');
  out = out.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  out = out.replace(/\{%\s*include\s+install_docker\.md\s*%\}/g, INSTALL_DOCKER);

  out = out.replace(
    /\{%\s*capture content\s*%\}([\s\S]*?)\{%\s*endcapture\s*%\}\s*\{%\s*include\s+\/?components\/directory\.html(?:\s+title="([^"]*)")?\s*%\}/g,
    (_, inner, tocTitle) => tocBox(inner, tocTitle)
  );
  out = out.replace(
    /\{%\s*capture content\s*%\}([\s\S]*?)\{%\s*endcapture\s*%\}\s*\{%\s*include\s+\/?components\/markdown-container\.html\s*%\}/g,
    (_, inner) => `\n${inner.trim()}\n`
  );

  out = replaceDataLoops(out, rel);

  out = out.replace(/\{\{\s*(['"])(.*?)\1\s*\|\s*relative_url\s*\}\}/g, '$2');
  out = out.replace(/\{\{\s*site\.baseurl\s*\}\}/g, '');

  // file_avail layout: a fixed "which option is best" table above the body.
  if (layout === 'file_avail') out = `${FILE_AVAIL_TABLE}\n\n${out}`;

  out = namedAnchors(out);

  out = reindentFences(out);
  out = separateHtmlLines(out);
  out = applyIals(out);
  out = fixTables(out);
  out = rewriteLinks(out, baseUrl, report);

  // The page title is rendered by the layout; a leading `# Title` would be a
  // second copy of it.
  out = out.replace(/^\s*#\s+(.+)\n/, (whole, heading) =>
    heading.trim().toLowerCase() === String(title).trim().toLowerCase() ? '' : whole
  );

  return `${out.trim()}\n`;
}

/** `_layouts/file_avail.html`'s table, minus its commented-out rows. */
const FILE_AVAIL_TABLE = (() => {
  const html = fs.readFileSync(path.join(LEGACY, '_layouts', 'file_avail.html'), 'utf8');
  const body = html
    .replace(/^---[\s\S]*?---/, '')
    .replace('{{ content }}', '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace('<td</td>', '<td></td>')
    // `<caption>` outside a table is invalid; it was a footnote paragraph.
    .replace(/<caption>/, '<p class="table-footnote">')
    .replace(/<\/caption>/, '</p>')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
  // An HTML block ends at a blank line, so the whole fragment is kept on
  // consecutive lines; `<h2>` stays raw HTML (it is a heading either way).
  return body;
})();

/* ------------------------------------------------------------------------ */
/* Walk the collection                                                      */
/* ------------------------------------------------------------------------ */

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(md|shtml)$/.test(entry.name) ? [full] : [];
  });
}

const redirects = [];
const skipped = [];
const report = { internal: new Set() };
const written = new Set();
const titles = new Map();

// Redirect-only documents first, so links to them resolve to the target.
const sources = walk(SRC).sort();
const parsed = sources.map((file) => {
  const rel = path.relative(SRC, file).split(path.sep).join('/');
  const raw = fs.readFileSync(file, 'utf8');
  return { file, rel, raw, hasFrontmatter: matter.test(raw), ...matter(raw) };
});

for (const doc of parsed) {
  if (doc.data.layout !== 'redirect') continue;
  const permalink = String(doc.data.permalink).replace(/\.html$/, '');
  const target = normalizeHref(String(doc.data.redirect_url), `${SECTION}/`);
  ALIASES.set(permalink, target);
}
for (const entry of legacyRedirectCollection()) {
  const permalink = entry.permalink.replace(/\.html$/, '').replace(/\/$/, '');
  const target = normalizeHref(entry.target.replace(OWN_ORIGIN, ''), `${SECTION}/`);
  ALIASES.set(permalink, target);
}

fs.rmSync(OUT_DOCS, { recursive: true, force: true });

for (const doc of parsed) {
  const { rel, data } = doc;
  const stem = rel.replace(/\.(md|shtml)$/, '');
  if (rel === 'README.md') continue;
  if (!doc.hasFrontmatter) {
    // Jekyll copies frontmatter-less files through verbatim as static `.md`
    // files; they were never pages.
    skipped.push(`${rel} (no frontmatter: served raw, not a page)`);
    continue;
  }
  if (data.published === false) {
    skipped.push(`${rel} (published: false)`);
    continue;
  }
  if (data.layout === 'redirect') continue;

  const baseUrl = `${SECTION}/${stem}.html`;
  const newPath = `${SECTION}/${stem}/`;
  const title = String(data.title ?? stem);
  const body = convertBody(doc.content, {
    rel,
    title,
    layout: data.layout,
    baseUrl,
    report,
  });

  const leftover = body.match(/\{%|\{\{/);
  if (leftover) {
    const at = body.indexOf(leftover[0]);
    throw new Error(`${rel}: Liquid left in output: ${body.slice(at, at + 80)}`);
  }

  const keep = { ...data };
  delete keep.highlighter;
  delete keep.published;
  const frontmatter = {
    ...keep,
    title,
    layout: data.layout ?? 'default',
    description: data.description ?? describe(body, title),
    legacy_url: baseUrl,
  };

  const outFile = path.join(OUT_DOCS, `${stem}.md`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, matter.stringify(body, frontmatter));
  written.add(newPath);
  titles.set(newPath, title);

  redirects.push({ source: baseUrl, destination: newPath, text: title });
}

/* ------------------------------------------------------------------------ */
/* Redirects                                                                */
/* ------------------------------------------------------------------------ */

for (const [file, page] of Object.entries(HAND_PAGES)) {
  const source = `${SECTION}/${file}`;
  redirects.push({ source, destination: page.path, text: page.title });
}
for (const [from, to] of ALIASES) {
  if (from === `${SECTION}/index`) continue; // covered by HAND_PAGES
  const text = titles.get(to.split('#')[0]) ?? 'UW Research Computing';
  redirects.push({ source: `${from}.html`, destination: to, text });
  // The extensionless form was linked too (menus use it); GitHub Pages
  // served it from the `.html` file, so it needs its own stub here.
  redirects.push({ source: `${from}/`, destination: to, text });
}

const seen = new Set();
const unique = redirects.filter((r) => !seen.has(r.source) && seen.add(r.source));
fs.mkdirSync(path.dirname(OUT_REDIRECTS), { recursive: true });
fs.writeFileSync(OUT_REDIRECTS, `${JSON.stringify(unique, null, 2)}\n`);

/* ------------------------------------------------------------------------ */
/* Report                                                                   */
/* ------------------------------------------------------------------------ */

const known = new Set([
  ...written,
  ...Object.values(HAND_PAGES).map((p) => p.path),
]);
const unresolved = [...report.internal]
  .filter((p) => !known.has(p) && !/\.[a-z0-9]+$/i.test(p))
  .sort();

console.log(`[convert-docs] wrote ${written.size} documents to ${path.relative(ROOT, OUT_DOCS)}/`);
console.log(`[convert-docs] wrote ${unique.length} redirects to ${path.relative(ROOT, OUT_REDIRECTS)}`);
console.log(`[convert-docs] skipped ${skipped.length}:\n  ${skipped.join('\n  ')}`);
if (unresolved.length) {
  console.log(
    `[convert-docs] links to section paths with no page (check these):\n  ${unresolved.join('\n  ')}`
  );
}
