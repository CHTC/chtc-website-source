import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { load } from 'js-yaml';
import type { MDXContent } from 'mdx/types';
import type { Toc } from '@stefanprobst/rehype-extract-toc';
import { z } from 'zod';
import { isGuideIconName, type GuideMenu, type MenuLink, type MenuSection } from '@/components/GuideSidebar';
import { COMPUTE_TYPE_PARAM, COMPUTE_TYPES, type ComputeType } from './computeType';

/**
 * Build-time access to the UW Research Computing documentation.
 *
 * The documents live in `content/uw-research-computing/docs/` as MDX with
 * the frontmatter below, one static page each. `@next/mdx` compiles every
 * document into a module (`importDoc`). The standard components in
 * `docComponents.tsx` are available by name; anything else a document
 * imports, like any other module. The frontmatter is also read here with
 * gray-matter, because the menus and listings need every document's without
 * rendering any. The menus beside them are YAML.
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
  /** Path below the docs directory, without `.mdx`. */
  file: string;
  data: DocFrontmatter;
  /** The MDX body, for scanning (remote images); rendering goes through `importDoc`. */
  content: string;
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.mdx') ? [full] : [];
  });
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
        file: rel.replace(/\.mdx$/, ''),
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

/** What `@next/mdx` compiles a document into. */
export interface DocModule {
  default: MDXContent;
  frontmatter: DocFrontmatter;
  tableOfContents: Toc;
}

/**
 * The compiled document. The template literal is what lets the bundler find
 * every file under `docs/` and compile each one.
 */
export function importDoc(doc: Doc): Promise<DocModule> {
  return import(`@/content/uw-research-computing/docs/${doc.file}.mdx`);
}

/* Headings ------------------------------------------------------------------- */

export interface DocHeading {
  /** Markdown depth (`##` is 2). */
  depth: number;
  text: string;
  /** The id rehype-slug gives the rendered heading. */
  id: string;
}

/**
 * The headings a document's `<TableOfContents />` lists: the top two of its
 * first three levels, from the `tableOfContents` the document exports.
 */
export function docHeadings(toc: Toc): DocHeading[] {
  const found: DocHeading[] = [];
  const walk = (entries: Toc) => {
    for (const entry of entries) {
      if (entry.depth <= 3 && entry.id) found.push({ depth: entry.depth, text: entry.value, id: entry.id });
      if (entry.children) walk(entry.children);
    }
  };
  walk(toc);
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
