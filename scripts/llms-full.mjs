// Generates out/llms.txt (an index) and out/llms-full.txt (the full text) for
// the Campus Computing documentation, from the static export.
//
// Why work from `out/**/index.html` instead of the source MDX: the rendered
// HTML holds everything pulled in at build time (components, data tables,
// excerpt tabs) that the raw MDX would miss. Only the guides under
// content/uw-research-computing/docs/ are included, in the order of the HTC
// and HPC guide menus, then anything not in a menu alphabetically.
//
// Runs in `postbuild`, after `next build` has produced `out/`.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.resolve(ROOT, process.argv[2] || 'out');
const CONTENT_DIR = path.join(ROOT, 'content', 'uw-research-computing');
const DOCS_DIR = path.join(CONTENT_DIR, 'docs');
const SECTION = '/uw-research-computing';
const BASE_URL = (
  process.env.LLMS_BASE_URL || (process.env.HOSTNAME ? `https://${process.env.HOSTNAME}` : 'https://chtc.cs.wisc.edu')
).replace(/\/$/, '');

/* HTML -> Markdown ---------------------------------------------------------- */

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});
turndown.use(gfm);
turndown.remove(['script', 'style', 'button', 'nav', 'aside', 'svg']);

// Highlighted code is `<pre><code class="hljs language-x"><span>…</span></code></pre>`;
// emit a fence straight from the text so the highlight spans collapse.
turndown.addRule('fencedCode', {
  filter: (node) => node.nodeName === 'PRE',
  replacement: (_content, node) => {
    const code = node.querySelector('code') || node;
    const lang = /language-([\w-]+)/.exec(code.getAttribute('class') || '')?.[1] ?? '';
    const text = code.textContent.replace(/\n+$/, '');
    return `\n\n\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
  },
});

/** The guide body of a built page as Markdown, with its title and description. */
function pageToMarkdown(html) {
  const root = parse(html, { comment: false });
  const body = root.querySelector('.chtc-doc');
  if (!body) return null;
  // Internal pages (`noindex` in the frontmatter) stay out of the export too.
  if (/noindex/.test(root.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '')) return null;

  // Permalink and icon-only anchors.
  for (const a of body.querySelectorAll('a')) {
    if (!a.text || a.text.trim() === '') a.remove();
  }

  const title = root.querySelector('h1')?.text.trim();
  const description = root.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();
  const md = turndown
    .turndown(body.toString())
    .replace(/\n{3,}/g, '\n\n')
    // Site-relative links become absolute, since the text is read away from the site.
    .replace(/\]\((\/[^)\s]*)\)/g, `](${BASE_URL}$1)`)
    .trim();
  return { title, description, md };
}

/* Page order ---------------------------------------------------------------- */

/** Slugs of every document, from the content folder. */
function docSlugs() {
  const slugs = [];
  const walk = (dir, rel) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name), rel ? `${rel}/${entry.name}` : entry.name);
      else if (entry.name.endsWith('.mdx')) {
        // `staff/index.mdx` is the page for `staff/` itself, as in docs.ts.
        const name = entry.name.replace(/\.mdx$/, '');
        slugs.push(name === 'index' ? rel : (rel ? `${rel}/` : '') + name);
      }
    }
  };
  walk(DOCS_DIR, '');
  return slugs.sort();
}

/** The slug a menu URL points at, or undefined for an external or non-doc link. */
function slugFromUrl(url) {
  if (!url || /^[a-z]+:/i.test(url)) return undefined;
  let p = url.split(/[?#]/)[0];
  if (!p.startsWith('/')) p = `${SECTION}/${p}`;
  p = p.replace(/\.html$/, '').replace(/\/$/, '');
  return p.startsWith(`${SECTION}/`) ? p.slice(SECTION.length + 1) : undefined;
}

/** Document slugs in the order a guide menu lists them. */
function menuSlugs(file) {
  const sections = load(fs.readFileSync(path.join(CONTENT_DIR, 'menus', file), 'utf8'));
  const slugs = [];
  const walkLinks = (links = []) => {
    for (const link of links) {
      const slug = slugFromUrl(link.url);
      if (slug) slugs.push(slug);
      walkLinks(link.links);
    }
  };
  for (const section of sections) walkLinks(section.links);
  return slugs;
}

/* Build --------------------------------------------------------------------- */

function main() {
  if (!fs.existsSync(path.join(OUT_DIR, 'uw-research-computing'))) {
    console.error('[llms] out/uw-research-computing not found — run `next build` first.');
    process.exit(1);
  }

  const all = new Set(docSlugs());
  const groups = [
    { heading: 'HTC guides', slugs: menuSlugs('htc-guide-menu.yml') },
    { heading: 'HPC guides', slugs: menuSlugs('hpc-guide-menu.yml') },
  ];
  const listed = new Set();
  for (const group of groups) {
    group.slugs = group.slugs.filter((slug) => all.has(slug) && !listed.has(slug) && listed.add(slug));
  }
  groups.push({ heading: 'Other pages', slugs: [...all].filter((slug) => !listed.has(slug)) });

  const sections = [];
  const index = [];
  let pages = 0;

  for (const group of groups) {
    if (group.slugs.length === 0) continue;
    index.push(`\n## ${group.heading}\n`);
    for (const slug of group.slugs) {
      const file = path.join(OUT_DIR, 'uw-research-computing', slug, 'index.html');
      if (!fs.existsSync(file)) {
        console.warn(`[llms] no built page for ${slug}, skipping`);
        continue;
      }
      const page = pageToMarkdown(fs.readFileSync(file, 'utf8'));
      if (!page?.md) {
        if (page !== null) console.warn(`[llms] no guide body in ${slug}, skipping`);
        continue;
      }
      const title = page.title || slug;
      const url = `${BASE_URL}${SECTION}/${slug}/`;
      sections.push(`Source: ${url}\n\n# ${title}\n\n${page.md}`);
      index.push(`- [${title}](${url})${page.description ? `: ${page.description}` : ''}`);
      pages += 1;
    }
  }

  const header =
    `# CHTC Campus Computing Documentation — Full Text\n\n` +
    `> Concatenated, Markdown-converted content of the Center for High Throughput Computing's ` +
    `guides for its UW-Madison campus computing services (HTC and HPC), generated from the built site for LLM consumption.\n` +
    `> Source: ${BASE_URL}${SECTION}/\n`;
  const full = `${header}\n${sections.join('\n\n---\n\n')}\n`;
  fs.writeFileSync(path.join(OUT_DIR, 'llms-full.txt'), full);

  const llmsTxt =
    `# CHTC Campus Computing Documentation\n\n` +
    `> Guides for using the Center for High Throughput Computing's UW-Madison campus computing services: ` +
    `the High Throughput Computing (HTC) system and the High Performance Computing (HPC) cluster.\n\n` +
    `Full text of every guide: ${BASE_URL}/llms-full.txt\n` +
    `${index.join('\n')}\n`;
  fs.writeFileSync(path.join(OUT_DIR, 'llms.txt'), llmsTxt);

  console.log(`[llms] wrote out/llms-full.txt (${pages} pages, ${(full.length / 1024).toFixed(0)} KB) and out/llms.txt`);
}

main();
