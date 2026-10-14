import {
  filterArticles,
  getArticle,
  getArticles,
  sortArticles,
  type ArticleType,
  type BackendArticle,
} from '@chtc/web-components/content';
import {
  extractMarkdownImageUrls,
  recordRemoteImages,
} from '@/utils/remoteImages';

const ORGANIZATION = 'CHTC';
const REPOSITORY = 'Articles';
const BRANCH = 'main';

/**
 * The article types this site renders, all at `/news` (news and user
 * stories alike). The shared repository also carries `tech-blog` and feature
 * articles that never get a page here, and their images should not be
 * downloaded and re-encoded for an export that will not reference them.
 */
const PUBLISHED_TYPES: ArticleType[] = ['news', 'user'];

/**
 * Declare an article's art for the export image optimizer; see
 * remoteImages.ts. Covers the card image, the wide banner the home page
 * renders behind its hero story, and every image in the body — all of which
 * the list fetch already has in hand, so the detail pages need no separate
 * pass.
 */
function recordArticleImages(articles: BackendArticle[]): void {
  recordRemoteImages(
    articles.flatMap((article) => [
      article.image?.path,
      article.banner_src,
      ...extractMarkdownImageUrls(article.content, article.excerpt),
    ])
  );
}

/**
 * The CHTC articles, newest first, optionally narrowed to one type.
 *
 * `getArticles` is memoized for the revalidate window, so the several pages
 * that call this during a build share one fetch of the repository.
 */
export async function getSiteArticles(
  type?: ArticleType
): Promise<BackendArticle[]> {
  const onChtc = filterArticles(
    await getArticles(ORGANIZATION, REPOSITORY, BRANCH),
    'chtc'
  );

  recordArticleImages(
    onChtc.filter((article) => PUBLISHED_TYPES.includes(article.type))
  );

  return sortArticles(
    type ? onChtc.filter((article) => article.type === type) : onChtc
  );
}

/** One article by the slug its page was generated for. */
export async function getSiteArticle(
  slug: string[]
): Promise<BackendArticle> {
  return getArticle(
    ORGANIZATION,
    REPOSITORY,
    `${slug.join('-')}.md`,
    BRANCH
  );
}

/**
 * Where an article's page lives: news under `/news`, user stories under
 * `/spotlights`. Every link to an article goes through this so the two
 * sections cannot drift apart. Trailing slash to match `trailingSlash`.
 */
export function articleHref(article: Pick<BackendArticle, 'slug' | 'type'>): string {
  const base = article.type === 'user' ? '/spotlights' : '/news';
  return `${base}/${article.slug.join('/')}/`;
}
