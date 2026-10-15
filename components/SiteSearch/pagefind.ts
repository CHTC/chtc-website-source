/*
 * The browser side of Pagefind (https://pagefind.app). `postbuild` runs the
 * Pagefind CLI over `out/`, which writes a static index and this script to
 * `out/pagefind/`; the site loads them on first use, so search costs nothing
 * until someone types. In `next dev` there is no index and `loadPagefind`
 * rejects, which the search box reports.
 */

export interface PagefindResultData {
  url: string;
  /** Excerpt of the matching passage, with `<mark>` around the hits. */
  excerpt: string;
  meta: { title?: string; image?: string };
}

export interface PagefindResult {
  id: string;
  data: () => Promise<PagefindResultData>;
}

export interface Pagefind {
  init: () => Promise<void>;
  /** Resolves to `null` when a later call superseded this one. */
  debouncedSearch: (term: string, options?: object, debounceMs?: number) => Promise<{ results: PagefindResult[] } | null>;
}

const SCRIPT = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/pagefind/pagefind.js`;

let instance: Promise<Pagefind> | undefined;

export function loadPagefind(): Promise<Pagefind> {
  instance ??= (async () => {
    // The script is not a module the bundler knows about: it exists only in
    // the export, so both bundlers are told to leave the import alone.
    const pagefind = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ SCRIPT)) as Pagefind;
    await pagefind.init();
    return pagefind;
  })();
  instance.catch(() => {
    instance = undefined;
  });
  return instance;
}

/** True for the Campus Computing guides, which the result list puts first. */
export function isGuide(url: string): boolean {
  return url.replace(process.env.NEXT_PUBLIC_BASE_PATH ?? '', '').startsWith('/uw-research-computing/');
}

/** A page title without the site name Pagefind may have read from `<title>`. */
export function cleanTitle(data: PagefindResultData): string {
  return (data.meta.title || data.url).replace(/\s+[—–-]\s+Center for High Throughput Computing$/, '');
}

/** "Campus Computing", "News", … from a result's path, for the result list. */
export function sectionOf(url: string): string {
  const path = url.replace(process.env.NEXT_PUBLIC_BASE_PATH ?? '', '');
  const [first, second] = path.split('/').filter(Boolean);
  if (!first) return 'Home';
  if (first === 'uw-research-computing') return second === 'staff' ? 'Staff docs' : 'Campus Computing';
  const names: Record<string, string> = {
    news: 'News',
    spotlights: 'Spotlights',
    events: 'Events',
    presentations: 'Presentations',
    people: 'People',
    jobs: 'Open positions',
    fellowships: 'Fellowships',
    research: 'Research',
  };
  return names[first] ?? first.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}
