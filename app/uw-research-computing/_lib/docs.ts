import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { load } from 'js-yaml';
import type { GuideMenu, MenuLink, MenuSection } from '@/components/GuideSidebar';

/**
 * Build-time access to the UW Research Computing documentation.
 *
 * The documents and their menus were ported from the legacy Jekyll
 * `_uw-research-computing` collection by `scripts/convert-legacy-docs.mjs`
 * into `content/uw-research-computing/`. They are markdown strings rendered
 * through `MarkdownContainer` (never MDX), one static page each.
 */
export const SECTION = '/uw-research-computing';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'uw-research-computing');
const DOCS_DIR = path.join(CONTENT_DIR, 'docs');

/** Frontmatter of a converted document (the legacy fields are kept as-is). */
export interface DocFrontmatter {
  title: string;
  /** Legacy Jekyll layout: `guide`, `hpc_layout`, `file_avail`, `markdown-page`, `content`, … */
  layout: string;
  description: string;
  /** Where the page lived on the Jekyll site, e.g. `/uw-research-computing/x.html`. */
  legacy_url: string;
  guide?: {
    category?: string;
    /** `htc`/`hpc` select the sidebar menu. A string is matched as a substring, as Liquid's `contains` did. */
    tag?: string | string[];
    order?: number;
  };
  /** Software quick-start pages: shown as tabs on the software overview. */
  software?: string;
  software_icon?: string;
  /** Basic-scripting pages: shown as tabs on the basic-scripting guide. */
  basic_scripting?: boolean;
  icon?: string;
  excerpt_separator?: string;
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
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

let cache: Doc[] | undefined;

/** Every document, sorted by path (the order Jekyll listed the collection in). */
export function getDocs(): Doc[] {
  if (cache) return cache;
  cache = walk(DOCS_DIR)
    .map((file) => {
      const rel = path.relative(DOCS_DIR, file).split(path.sep).join('/');
      const slug = rel.replace(/\.md$/, '').split('/');
      const { data, content } = matter(fs.readFileSync(file, 'utf8'));
      return {
        slug,
        path: `${SECTION}/${slug.join('/')}/`,
        data: data as DocFrontmatter,
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

/**
 * The text before the document's excerpt separator, or its first paragraph
 * (Jekyll's rule for `page.excerpt`).
 */
export function docExcerpt(doc: Doc): string {
  const separator = doc.data.excerpt_separator;
  if (separator && doc.content.includes(separator)) {
    return doc.content.split(separator)[0].trim();
  }
  return doc.content.trim().split(/\n\s*\n/)[0];
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

function normalizeLinks(links: MenuLink[] | undefined): MenuLink[] | undefined {
  return links?.map((link) => ({
    text: String(link.text).trim(),
    url: normalizeUrl(link.url),
    icon: link.icon || undefined,
    highlight: link.highlight || undefined,
    links: normalizeLinks(link.links ?? undefined),
  }));
}

function loadGuideMenu(file: string): MenuSection[] {
  return readYaml<MenuSection[]>(`menus/${file}`).map((section) => ({
    text: String(section.text).trim(),
    icon: section.icon || undefined,
    links: normalizeLinks(section.links) ?? [],
  }));
}

export const htcGuideMenu = (): MenuSection[] => loadGuideMenu('htc-guide-menu.yml');
export const hpcGuideMenu = (): MenuSection[] => loadGuideMenu('hpc-guide-menu.yml');

/** True when Liquid's `page.guide.tag contains name` was. */
function tagged(tag: string | string[] | undefined, name: string): boolean {
  if (!tag) return false;
  return Array.isArray(tag) ? tag.includes(name) : String(tag).includes(name);
}

const SIDEBAR_LAYOUTS = new Set(['guide', 'hpc_layout', 'file_avail']);

/**
 * The guide menus the legacy sidebar showed for a document: chosen by its
 * `guide.tag` (HTC, HPC or both), and only on the guide layouts.
 */
export function sidebarMenus(doc: Doc): GuideMenu[] {
  if (!SIDEBAR_LAYOUTS.has(doc.data.layout)) return [];
  const tag = doc.data.guide?.tag;
  const menus: GuideMenu[] = [];
  if (tagged(tag, 'htc')) menus.push({ title: 'HTC guides', sections: htcGuideMenu() });
  if (tagged(tag, 'hpc')) menus.push({ title: 'HPC guides', sections: hpcGuideMenu() });
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
