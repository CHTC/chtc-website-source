// One-off: convert content/uw-research-computing/docs/**/*.md (the output of
// convert-legacy-docs.mjs: GitHub markdown with kramdown wrapper <div>s and
// Jekyll frontmatter) into MDX with real components and a plain schema.
//
//   node scripts/convert-docs-to-mdx.mjs            # convert, delete the .md
//   node scripts/convert-docs-to-mdx.mjs --dry-run  # report only
//
// Frontmatter: `layout` + `guide.tag` become `sidebar: [htc, hpc]`, the
// `character_optimized` layout becomes `width: narrow`, `guide.category` and
// `guide.order` move to the top level, `legacy_url` and `excerpt_separator`
// go (the separator is always `{/* more */}` now).
//
// Body: kramdown wrappers become <Tip>, <Terminal>, <File>, <CommandTable>,
// <MiniBar>, <Footnote>; the hand-written TOC box becomes <TableOfContents />;
// Bootstrap button rows become <ButtonRow>/<Button>; the data elements
// become <GpuTable />, <ExcerptTabs />, <FacilitatorGrid />, <UpcomingEvents />;
// everything else that is HTML is made JSX-safe (className, style objects,
// self-closed void tags, {/* comments */}, escaped braces and autolinks).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { dump } from 'js-yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'content', 'uw-research-computing', 'docs');
const DRY = process.argv.includes('--dry-run');

const SIDEBAR_LAYOUTS = new Set(['guide', 'hpc_layout', 'file_avail']);
const report = [];
const kept = new Set();
const note = (file, msg) => report.push(`${path.relative(DOCS, file)}: ${msg}`);

/* ------------------------------------------------------------------------ */
/* Frontmatter                                                              */
/* ------------------------------------------------------------------------ */

function convertFrontmatter(data, file) {
  const tags = data.guide?.tag;
  const tagList = Array.isArray(tags) ? tags : tags ? [String(tags)] : [];
  const sidebar = SIDEBAR_LAYOUTS.has(data.layout)
    ? ['htc', 'hpc'].filter((t) => tagList.some((tag) => String(tag).includes(t)))
    : [];

  const out = { title: data.title, description: data.description };
  if (sidebar.length) out.sidebar = sidebar;
  if (data.guide?.category ?? data.category) out.category = data.guide?.category ?? data.category;
  if (data.guide?.order !== undefined) out.order = data.guide.order;
  if (data.layout === 'character_optimized') out.width = 'narrow';
  for (const key of ['alt_title', 'software', 'software_icon', 'basic_scripting', 'icon']) {
    if (data[key] !== undefined) out[key] = data[key];
  }

  const known = new Set(['title', 'description', 'layout', 'legacy_url', 'guide', 'alt_title', 'software',
    'software_icon', 'basic_scripting', 'icon', 'excerpt_separator', 'highlighter', 'published']);
  for (const key of Object.keys(data)) {
    if (!known.has(key)) note(file, `unknown frontmatter field dropped: ${key}`);
  }
  if (data.excerpt_separator && data.excerpt_separator !== '<!--more-->') {
    note(file, `excerpt_separator was ${data.excerpt_separator}`);
  }
  return out;
}

/* ------------------------------------------------------------------------ */
/* Code protection                                                          */
/* ------------------------------------------------------------------------ */

/**
 * Split the body into text and code segments so the HTML rewrites never
 * touch fenced blocks or inline code.
 */
function segments(body) {
  const out = [];
  const fence = /^([ \t]*(?:>[ \t]?)*)(```|~~~)[^\n]*\n[\s\S]*?\n\1\2[ \t]*$/gm;
  let last = 0;
  for (const m of body.matchAll(fence)) {
    pushText(out, body.slice(last, m.index) + m[1]);
    out.push({ code: true, text: m[0].slice(m[1].length) });
    last = m.index + m[0].length;
  }
  pushText(out, body.slice(last));
  return out;
}

function pushText(out, text) {
  // Inline code spans are protected the same way.
  const span = /(`+)[^`\n][\s\S]*?\1/g;
  let last = 0;
  for (const m of text.matchAll(span)) {
    if (m.index > last) out.push({ code: false, text: text.slice(last, m.index) });
    out.push({ code: true, text: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ code: false, text: text.slice(last) });
}

/* ------------------------------------------------------------------------ */
/* HTML → JSX                                                               */
/* ------------------------------------------------------------------------ */

const VOID = new Set(['br', 'hr', 'img', 'meta', 'link', 'input', 'source', 'wbr']);
const KNOWN = new Set(['a', 'b', 'blockquote', 'br', 'caption', 'code', 'dd', 'details', 'div', 'dl',
  'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'iframe', 'img', 'input', 'li', 'link',
  'meta', 'ol', 'p', 'pre', 'script', 'small', 'span', 'strong', 'sub', 'summary', 'sup', 'table',
  'tbody', 'td', 'th', 'thead', 'tr', 'u', 'ul', 'var', 'wbr', 'time', 'source']);
const RENAME = {
  class: 'className', frameborder: 'frameBorder', allowfullscreen: 'allowFullScreen',
  referrerpolicy: 'referrerPolicy', marginheight: 'marginHeight', marginwidth: 'marginWidth',
  colspan: 'colSpan', rowspan: 'rowSpan', tabindex: 'tabIndex', 'http-equiv': 'httpEquiv',
  allowtransparency: 'allowTransparency', srcset: 'srcSet', autoplay: 'autoPlay',
  cellpadding: 'cellPadding', cellspacing: 'cellSpacing', for: 'htmlFor', maxlength: 'maxLength',
};

function styleObject(css) {
  const props = css.split(';').map((s) => s.trim()).filter(Boolean).map((decl) => {
    const i = decl.indexOf(':');
    const name = decl.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const value = decl.slice(i + 1).trim().replace(/'/g, "\\'");
    return `${name}: '${value}'`;
  });
  return `style={{ ${props.join(', ')} }}`;
}

/** Rewrite one HTML start tag's attributes as JSX. */
function jsxTag(tag, attrs, selfClosing) {
  const parts = [];
  const re = /([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>"']+)))?/g;
  for (const m of attrs.matchAll(re)) {
    let name = m[1];
    const value = m[2] ?? m[3] ?? m[4];
    if (name === '/') continue;
    const lower = name.toLowerCase();
    name = RENAME[lower] ?? (lower.startsWith('data-') || lower.startsWith('aria-') ? lower : name);
    if (value === undefined) parts.push(name);
    else if (name === 'style') parts.push(styleObject(value));
    else parts.push(`${name}="${value.replace(/"/g, '&quot;')}"`);
  }
  const attrText = parts.length ? ` ${parts.join(' ')}` : '';
  return `<${tag}${attrText}${selfClosing || VOID.has(tag) ? ' />' : '>'}`;
}

function convertTags(text, file) {
  return text.replace(/<([a-zA-Z][\w-]*)((?:\s+[^<>]*?)?)\s*(\/?)>/g, (whole, tag, attrs, slash) => {
    if (/^[A-Z]/.test(tag)) return whole; // already a component
    if (!KNOWN.has(tag)) {
      // `<variable>`, `<link>`: a placeholder in prose, not a tag.
      note(file, `escaped placeholder ${whole}`);
      return `\\<${tag}${attrs}\\>`;
    }
    return jsxTag(tag, attrs, slash === '/');
  });
}

/* ------------------------------------------------------------------------ */
/* Wrapper divs                                                             */
/* ------------------------------------------------------------------------ */

/** Trim blank lines from both ends without touching the first line's indent. */
const trimBlank = (s) => s.replace(/^(?:[ \t]*\n)+/, '').replace(/\s+$/, '');

/** The protected code segments of the file being converted; see convertFile. */
let codeStore = [];

/** Strip a blockquote's `> ` prefixes (the kramdown tip bodies are quotes), inside code too. */
const unquote = (s) =>
  s
    .replace(/\u0001(\d+)\u0001/g, (m, i) => {
      codeStore[Number(i)] = codeStore[Number(i)].replace(/^([ \t]*)>[ \t]?/gm, '$1');
      return m;
    })
    .replace(/^([ \t]*)>[ \t]?/gm, '$1');

/** The text of a tip header: `> ### Title` → `Title`. */
function headerText(inner, file) {
  const lines = unquote(inner).split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length !== 1) note(file, `tip header with ${lines.length} lines joined: ${lines.join(' / ')}`);
  return lines.join(' ').replace(/^#+\s*/, '').replace(/"/g, '&quot;');
}

/** Index of the `</div>` closing the div whose content starts at `from`. */
function findDivClose(text, from) {
  const re = /<div\b[^>]*>|<\/div>/g;
  re.lastIndex = from;
  let depth = 1;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return m.index;
  }
  return -1;
}

/**
 * Replace the legacy `<div class="…">` wrappers. Matched by depth so a
 * wrapper's own closing tag is found even with divs nested inside.
 */
function convertWrappers(text, file) {
  const tokens = [...text.matchAll(/<div\b([^>]*)>|<\/div>/g)];
  const stack = [];
  const edits = []; // {start, end, replacement}
  for (const t of tokens) {
    if (t[0] === '</div>') {
      if (t.consumed) continue;
      const open = stack.pop();
      if (!open) continue;
      const cls = /class="([^"]*)"/.exec(open[1])?.[1] ?? '';
      const indent = /(^|\n)([ \t]*(?:>[ \t]?)*)$/.exec(text.slice(0, open.index))?.[2] ?? '';
      const blank = indent.includes('>') ? `\n${indent.trimEnd()}\n` : '\n\n';
      const innerStart = open.index + open[0].length;
      const inner = text.slice(innerStart, t.index);
      const wrap = (name, props = '', body = inner) =>
        edits.push({ start: open.index, end: t.index + t[0].length,
          replacement: `<${name}${props}>${blank}${trimBlank(body)}${blank}${indent}</${name}>` });
      const unwrap = () => edits.push({ start: open.index, end: t.index + t[0].length, replacement: trimBlank(inner) });
      if (cls === 'uw-toc') {
        edits.push({ start: open.index, end: t.index + t[0].length, replacement: '<TableOfContents />' });
      } else if (cls === 'md-tip-header') {
        // Pair with the following md-tip.
        const afterHeader = t.index + t[0].length;
        const next = /^\s*(<div class="md-tip">|<blockquote class="tip">)/.exec(text.slice(afterHeader));
        const bodyStart = next ? afterHeader + next.index + next[0].length : -1;
        const isDiv = next?.[1].startsWith('<div');
        const closeTag = isDiv ? '</div>' : '</blockquote>';
        const closeAt = !next ? -1 : isDiv ? findDivClose(text, bodyStart) : text.indexOf(closeTag, bodyStart);
        if (closeAt >= 0) {
          const tipBody = isDiv ? unquote(text.slice(bodyStart, closeAt)) : text.slice(bodyStart, closeAt);
          const consumedEnd = closeAt + closeTag.length;
          edits.push({ start: open.index, end: consumedEnd,
            replacement: `<Tip header="${headerText(inner, file)}">${blank}${trimBlank(tipBody)}${blank}${indent}</Tip>` });
          // The tip's own tokens are spoken for.
          for (const u of tokens) if (u.index > t.index && u.index < consumedEnd) u.consumed = true;
        } else {
          note(file, 'md-tip-header without md-tip');
          wrap('Tip', '', unquote(inner));
        }
      } else if (cls === 'md-tip') {
        if (open.consumed) continue;
        wrap('Tip', '', unquote(inner));
      } else if (cls === 'md-term') wrap('Terminal');
      else if (cls === 'md-file') wrap('File');
      else if (cls === 'md-command-table') wrap('CommandTable');
      else if (cls === 'md-uw-mini-bar') wrap('MiniBar');
      else if (cls === 'd-flex mb-3') wrap('ButtonRow');
      else if (['md-sub', 'md-other', 'md-gtable', 'p-3 m-auto'].includes(cls)) unwrap();
      else if (cls && !kept.has(file)) { kept.add(file); note(file, `has Bootstrap layout markup to convert by hand (${cls}, …)`); }
    } else if (!t.consumed) {
      stack.push(t);
    }
  }
  if (stack.length) note(file, `${stack.length} unclosed <div>`);
  // Apply innermost-first so outer edits see the original indices; edits never overlap
  // except an outer wrapper containing inner ones, so apply from the end and drop nested.
  edits.sort((a, b) => b.start - a.start);
  let result = text;
  let floor = Infinity;
  for (const e of edits) {
    if (e.end > floor) {
      // Nested inside an already-applied outer edit: re-run on the result later.
      continue;
    }
    result = result.slice(0, e.start) + e.replacement + result.slice(e.end);
    floor = e.start;
  }
  return result;
}

/* ------------------------------------------------------------------------ */
/* Text segment conversion                                                  */
/* ------------------------------------------------------------------------ */

const unescapeHtml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

function convertText(text, file) {
  let s = text;

  // <pre class="term"><code>…</code></pre> → a fenced block in a Terminal.
  s = s.replace(/^([ \t]*)<pre class="term"><code>([\s\S]*?)<\/code><\/pre>/gm,
    (_, indent, code) => `${indent}<Terminal>\n\n${indent}\`\`\`\n${unescapeHtml(code).split('\n').map((l) => indent + l).join('\n')}\n${indent}\`\`\`\n\n${indent}</Terminal>`);

  // Comments become JSX comments; parked so the brace escaping below skips them.
  const comments = [];
  s = s.replace(/<!--([\s\S]*?)-->/g, (_, c) =>
    `\u0002${comments.push(`{/*${c.replace(/\*\//g, '* /')}*/}`) - 1}\u0002`);

  // Braces are expressions in MDX; escape the ones in prose now, before any
  // JSX (style objects, numeric props) is written.
  s = s.replace(/(?<!\\)[{}]/g, (c) => `\\${c}`);

  // Repeat the wrapper pass until stable (nested wrappers).
  for (let i = 0; i < 4; i++) {
    const next = convertWrappers(s, file);
    if (next === s) break;
    s = next;
  }

  // Buttons and footnotes.
  s = s.replace(/<a class="btn[^"]*"([^>]*)>([\s\S]*?)<\/a>/g, (_, attrs, body) => {
    const href = /href="([^"]*)"/.exec(attrs)?.[1] ?? '#';
    return `<Button href="${href}">${body.trim()}</Button>`;
  });
  s = s.replace(/<p class="table-footnote">([\s\S]*?)<\/p>/g, '<Footnote>$1</Footnote>');
  s = s.replace(/<blockquote class="tip">([\s\S]*?)<\/blockquote>/g, '<Tip>\n\n$1\n\n</Tip>');

  // Data elements.
  s = s.replace(/<gpu-table owner="([^"]*)"><\/gpu-table>/g, '<GpuTable owner="$1" />');
  s = s.replace(/<excerpt-tabs flag="([^"]*)"( more="true")?><\/excerpt-tabs>/g,
    (_, flag, more) => `<ExcerptTabs flag="${flag}"${more ? ' more' : ''} />`);
  s = s.replace(/<facilitator-grid><\/facilitator-grid>/g, '<FacilitatorGrid />');
  s = s.replace(/<upcoming-events tag="([^"]*)" limit="(\d+)"><\/upcoming-events>/g,
    '<UpcomingEvents tag="$1" limit={$2} />');

  // Autolinks: MDX has no `<https://…>` syntax.
  s = s.replace(/<(https?:\/\/[^\s>]+)>/g, '[$1]($1)');
  s = s.replace(/<([\w.+-]+@[\w.-]+\.\w+)>/g, '[$1](mailto:$1)');

  // A `<` that cannot start a tag (`<1 GB`, `<~10 hours`, `"<"`) is text.
  s = s.replace(/(?<!\\)<(?=[0-9~"=' \t\n.,;:!?(>\-])/g, '\\<').replace(/\\<>/g, '\\<\\>');

  // Remaining HTML.
  s = convertTags(s, file);

  s = s.replace(/\u0002(\d+)\u0002/g, (_, i) => comments[Number(i)]);
  return s;
}

/* ------------------------------------------------------------------------ */

function convertFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data;
  // The legacy documents mix tabs and spaces for indentation, which breaks
  // fence matching inside lists; MDX reads a tab as four columns anyway.
  const content = parsed.content.replace(/^[ \t]+/gm, (ws) => ws.replace(/\t/g, '    '));
  const front = convertFrontmatter(data, file);

  // Code is swapped for placeholder tokens so the rewrites see the body whole
  // (a wrapper's open and close tags with inline code between them) but
  // never touch what is inside a fence or a code span.
  const code = [];
  codeStore = code;
  const protectedBody = segments(content)
    .map((seg) => (seg.code ? `\u0001${code.push(seg.text) - 1}\u0001` : seg.text))
    .join('');
  let body = convertText(protectedBody, file).replace(/\u0001(\d+)\u0001/g, (_, i) => code[Number(i)]);
  body = body.replace(/\{\/\*more\*\/\}/g, '{/* more */}');
  // Collapse runs of blank lines the wrapper rewrites may have produced.
  body = body.replace(/\n{4,}/g, '\n\n\n').trim();

  const yaml = dump(front, { lineWidth: 1000, quotingType: '"' }).trimEnd();
  const out = `---\n${yaml}\n---\n\n${body}\n`;
  const target = file.replace(/\.md$/, '.mdx');
  if (!DRY) {
    fs.writeFileSync(target, out);
    fs.unlinkSync(file);
  }
  return target;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : e.name.endsWith('.md') ? [full] : [];
  });
}

const files = walk(DOCS);
for (const file of files) convertFile(file);
console.log(`${DRY ? 'would convert' : 'converted'} ${files.length} documents`);
if (report.length) {
  console.log('\nReview:');
  for (const line of report) console.log('  ' + line);
}
