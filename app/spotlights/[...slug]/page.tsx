import type { Metadata } from 'next';
import ExportedImage from 'next-image-export-optimizer';
import {
  Article,
  articleMetadata,
  type BackendArticle,
} from '@chtc/web-components/content';
import { getSiteArticle, getSiteArticles } from '@/utils/articles';
import { CHTC_SITE } from '@/site.config';

/** User stories live here; news has its own section at `/news`. */
const PAGE_TYPES: BackendArticle['type'][] = ['user'];

/** Hosts that are this site; a canonical naming one of them means "this page". */
const OWN_HOSTS = new Set(['chtc.cs.wisc.edu', 'www.chtc.cs.wisc.edu']);

/**
 * The article's `canonical_url`, unless it names this site.
 *
 * Most CHTC-originated articles carry a `canonical_url` of
 * `https://chtc.cs.wisc.edu/<name>.html` — the legacy address of this very
 * page, which is now a redirect stub (and is sometimes a name that never
 * existed, e.g. `nrao-story.html` for the `nrao` article). Pointing the
 * canonical at it would tell search engines the authoritative copy is a
 * redirect, so those fall back to the page's own path. Syndicated articles
 * (osg-htc.org, morgridge.org, htcondor.org, …) keep their off-site
 * canonical. A few values are wrapped in parentheses or padded with
 * whitespace; those are cleaned up, and anything still unparseable is
 * dropped.
 */
function offSiteCanonical(raw: string | undefined): string | undefined {
  const cleaned = raw?.trim().replace(/^\((.*)\)$/, '$1').trim();
  if (!cleaned) return undefined;
  try {
    const url = new URL(cleaned);
    return OWN_HOSTS.has(url.hostname) ? undefined : url.href;
  } catch {
    return undefined;
  }
}

export async function generateStaticParams() {
  const articles = await getSiteArticles();
  return articles
    .filter((article) => PAGE_TYPES.includes(article.type))
    .map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const article = await getSiteArticle(slug);
  return articleMetadata(
    { ...article, canonical_url: offSiteCanonical(article.canonical_url) },
    {
      // Explicit trailing slash: a dotted last segment would otherwise be
      // treated as a file name and skip `trailingSlash`.
      path: `/spotlights/${slug.join('/')}/`,
      site: CHTC_SITE,
    }
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = (await params).slug;
  const article = await getSiteArticle(slug);

  return <Article article={article} imageComponent={ExportedImage} />;
}
