import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
import { load } from 'js-yaml';
import { z } from 'zod';
import { isGuideIconName, type GuideMenu, type MenuLink, type MenuSection } from '@/components/GuideSidebar';
import { COMPUTE_TYPE_PARAM, COMPUTE_TYPES, type ComputeType } from './computeType';

/**
 * Build-time access to the UW Research Computing documentation.
 *
 * The documents live in `content/uw-research-computing/docs/` as MDX with
 * the frontmatter below; `DocBody` compiles each one with the components in
 * `docComponents.tsx`, one static page each. The menus beside them are YAML.
 */

export const SECTION = '/uw-research-computing';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'uw-research-computing');
const DOCS_DIR = path.join(CONTENT_DIR, 'docs');

/** A document's frontmatter. Unknown fields are a build error. */
const Frontmatter = z.strictObject({
  title: z.string().min(1),
  /** A sentence or two for the meta description and search previews. */
  description: z.string().min(1),
  /** Which guide sidebars the page appears in; none for a standalone page. */
  sidebar: z.array(z.enum(['htc', 'hpc', 'staff'])).optional(),
  /** Keep the page out of search engines, the sitemap and the llms export (internal docs). */
  noindex: z.boolean().optional(),
  /** Section of the guides the page belongs to, e.g. `Get started`. */
  category: z.string().optional(),
  order: z.number().optional(),
  /** `narrow` for long-form prose. */
  width: z.enum(['narrow']).optional(),
  alt_title: z.string().optional(),
  /** Software quick-start pages: shown as tabs on the software overview. */
  software: z.string().optional(),
  software_icon: z.string().optional(),
  /** Basic-scripting pages: shown as tabs on the basic-scripting guide. */
  basic_scripting: z.boolean().optional(),
  icon: z.string().optional(),
});

export type DocFrontmatter = z.infer<typeof Frontmatter>;

function parseFrontmatter(data: unknown, file: string): DocFrontmatter {
  const result = Frontmatter.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid frontmatter in docs/${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export interface Doc {
  /** Path segments below `/uw-research-computing/`. */
  slug: string[];
  /** Site path with trailing slash. */
  path: string;
  data: DocFrontmatter;
  content: string;
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.mdx') ? [full] : [];
  });
}

declare global {
  // Augmenting @types/node's `Require` has to go through its namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Require {
      /** Bundler API (webpack and Turbopack), not Node's. */
      context(directory: string, recursive: boolean, filter: RegExp): unknown;
    }
  }
}

if (process.env.NODE_ENV === 'development') {
  // The documents are read with `fs`, which the dev server does not watch.
  // Referencing them here makes a save refresh the open page.
  require.context('../../../content/uw-research-computing/docs', true, /\.mdx$/);
}

let cache: Doc[] | undefined;

/** Every document, sorted by path (the order Jekyll listed the collection in). */
export function getDocs(): Doc[] {
  // `next dev` keeps this module loaded, so caching there would serve the
  // first read of every file until the server restarts.
  if (cache && process.env.NODE_ENV === 'production') return cache;
  cache = walk(DOCS_DIR)
    .map((file) => {
      const rel = path.relative(DOCS_DIR, file).split(path.sep).join('/');
      // `staff/index.mdx` is the page for `/staff/` itself.
      const slug = rel.replace(/\.mdx$/, '').replace(/(^|\/)index$/, '').split('/').filter(Boolean);
      const { data, content } = matter(fs.readFileSync(file, 'utf8'));
      return {
        slug,
        path: `${SECTION}/${slug.join('/')}/`,
        data: parseFrontmatter(data, rel),
        content,
      };
    })
    .sort((a, b) => a.slug.join('/').localeCompare(b.slug.join('/')));
  return cache;
}

export function getDoc(slug: string[]): Doc | undefined {
  const key = slug.map((s) => decodeURIComponent(s)).join('/');
  return getDocs().find((doc) => doc.slug.join('/') === key);
}

/** Marks where a document's excerpt ends. */
const EXCERPT_SEPARATOR = '{/* more */}';

/**
 * The text before the document's excerpt marker, or its first paragraph
 * (Jekyll's rule for `page.excerpt`).
 */
export function docExcerpt(doc: Doc): string {
  if (doc.content.includes(EXCERPT_SEPARATOR)) {
    return doc.content.split(EXCERPT_SEPARATOR)[0].trim();
  }
  return doc.content.trim().split(/\n\s*\n/)[0];
}

/* Headings ------------------------------------------------------------------- */

export interface DocHeading {
  /** Markdown depth (`##` is 2). */
  depth: number;
  text: string;
  /** The id rehype-slug gives the rendered heading. */
  id: string;
}

/** Heading text as rehype-slug sees it: markdown and tags stripped. */
const plainText = (markdown: string) =>
  markdown
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/(\*\*|__|\*|_)(.+?)\1/g, '$2')
    .replace(/\\(.)/g, '$1')
    .trim();

/**
 * The headings a document's `<TableOfContents />` lists: its top two levels,
 * with the same ids rehype-slug assigns when the body is rendered. Fenced
 * code is skipped; raw `<h2 id="…">` tags count too.
 */
export function docHeadings(doc: Doc): DocHeading[] {
  const slugger = new GithubSlugger();
  const found: DocHeading[] = [];
  let inFence = false;
  for (const line of doc.content.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const md = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (md) {
      const text = plainText(md[2]);
      found.push({ depth: md[1].length, text, id: slugger.slug(text) });
      continue;
    }
    const html = /^\s*<h([1-3])\b[^>]*\bid="([^"]+)"[^>]*>(.*?)<\/h\1>/.exec(line);
    if (html) found.push({ depth: Number(html[1]), text: plainText(html[3]), id: html[2] });
  }
  if (found.length === 0) return [];
  const top = Math.min(...found.map((h) => h.depth));
  return found.filter((h) => h.depth <= top + 1);
}

/* ------------------------------------------------------------------------ */
/* Menus and data                                                           */
/* ------------------------------------------------------------------------ */

export function readYaml<T>(relative: string): T {
  return load(fs.readFileSync(path.join(CONTENT_DIR, relative), 'utf8')) as T;
}

/**
 * Legacy menu URLs come as `/x.html`, `/x`, or relative (`htc/guides.html`
 * from the user portal). Routes here end in a slash.
 */
export function normalizeUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//') || url.startsWith('#')) {
    return url;
  }
  const [pathPart, hash] = url.split('#');
  let p = pathPart.startsWith('/') ? pathPart : `${SECTION}/${pathPart}`;
  p = p.replace(/\.html$/, '').replace(/\/index$/, '/');
  if (!p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p.split('/').pop() ?? '')) p += '/';
  return hash ? `${p}#${hash}` : p;
}

/** An `icon:` in the menus must name an icon `GuideIcon` can draw. */
function checkIcon(icon: unknown, context: string): string | undefined {
  if (!icon) return undefined;
  if (!isGuideIconName(icon)) throw new Error(`Unknown icon "${icon}" on ${context}`);
  return icon;
}

function normalizeLinks(links: MenuLink[] | undefined): MenuLink[] | undefined {
  return links?.map((link) => ({
    text: String(link.text).trim(),
    url: normalizeUrl(link.url),
    icon: checkIcon(link.icon, `menu link "${link.text}"`),
    highlight: link.highlight || undefined,
    links: normalizeLinks(link.links ?? undefined),
  }));
}

let docsByPath: Map<string, Doc> | undefined;

/** The document at a site path (query and fragment ignored), if any. */
function docAt(url: string): Doc | undefined {
  docsByPath ??= new Map(getDocs().map((doc) => [doc.path, doc]));
  const bare = url.split(/[?#]/)[0];
  return docsByPath.get(bare.endsWith('/') ? bare : `${bare}/`);
}

/** True when a guide appears in more than one sidebar. */
function isShared(doc: Doc): boolean {
  return COMPUTE_TYPES.filter((type) => doc.data.sidebar?.includes(type)).length > 1;
}

/** Add `?compute-type=` to this menu's links to guides that are also in the other menu. */
function markSharedLinks(links: MenuLink[] | undefined, type: ComputeType): MenuLink[] | undefined {
  return links?.map((link) => {
    let url = link.url;
    if (url && !/^[a-z][a-z0-9+.-]*:/i.test(url) && !url.includes('?')) {
      const doc = docAt(url);
      if (doc && isShared(doc)) {
        const [pathPart, hash] = url.split('#');
        url = `${pathPart}?${COMPUTE_TYPE_PARAM}=${type}${hash ? `#${hash}` : ''}`;
      }
    }
    return { ...link, url, links: markSharedLinks(link.links, type) };
  });
}

function loadGuideMenu(file: string, type: ComputeType | 'staff'): MenuSection[] {
  return readYaml<MenuSection[]>(`menus/${file}`).map((section) => ({
    text: String(section.text).trim(),
    icon: checkIcon(section.icon, `menu section "${section.text}"`),
    links: (type === 'staff' ? normalizeLinks(section.links) : markSharedLinks(normalizeLinks(section.links), type)) ?? [],
  }));
}

export const htcGuideMenu = (): MenuSection[] => loadGuideMenu('htc-guide-menu.yml', 'htc');
export const hpcGuideMenu = (): MenuSection[] => loadGuideMenu('hpc-guide-menu.yml', 'hpc');
/** Internal how-tos for CHTC staff; nothing in it is shared with the other menus. */
export const staffGuideMenu = (): MenuSection[] => loadGuideMenu('staff-guide-menu.yml', 'staff');

/** The guide menus shown beside a document, per its `sidebar` frontmatter. */
export function sidebarMenus(doc: Doc): GuideMenu[] {
  const sidebar = doc.data.sidebar ?? [];
  const menus: GuideMenu[] = [];
  if (sidebar.includes('htc')) menus.push({ id: 'htc', title: 'HTC guides', sections: htcGuideMenu() });
  if (sidebar.includes('hpc')) menus.push({ id: 'hpc', title: 'HPC guides', sections: hpcGuideMenu() });
  if (sidebar.includes('staff')) menus.push({ id: 'staff', title: 'Staff docs', sections: staffGuideMenu() });
  return menus;
}

/* Section navigation (`_data/uw-research-computing-menu.yml`). */

export interface SectionNavItem {
  label: string;
  path: string;
  children?: SectionNavItem[];
}

interface RawNavItem {
  name: string;
  url: string;
  sub_menu?: RawNavItem[];
}

export function sectionNav(): SectionNavItem[] {
  const { nav_items } = readYaml<{ nav_items: RawNavItem[] }>(
    'menus/uw-research-computing-menu.yml'
  );
  const convert = (item: RawNavItem): SectionNavItem => ({
    label: item.name,
    path: normalizeUrl(item.url) ?? '#',
    children: item.sub_menu?.map(convert),
  });
  return nav_items.map(convert);
}
