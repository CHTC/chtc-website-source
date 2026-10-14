// Computes the dynamic legacy → new redirects for the content collections
// (articles, events, presentations) from the live GitHub sources. This imports
// the app's TypeScript data utilities, so it only runs under a TS loader (tsx):
// it is used by generate-redirects.mjs (postbuild) and, opportunistically, by
// compare-migration.mjs.

// Runs under tsx (see package.json `postbuild`), which resolves the
// library's ESM `content` entry with its named exports intact.
import { getArticles } from '@chtc/web-components/content';
import { getSiteEvents } from '../utils/events';
import { getSitePresentations } from '../utils/presentations';

/** @typedef {{ source: string, destination: string, text?: string }} Redirect */

/**
 * Legacy article URLs → their new paths. The Jekyll site set
 * `permalink: :title.html` for the news collection, so every shared article
 * (news and user story alike) was published at the site root as
 * `/<name>.html`; now news lives at `/news/<y>/<m>/<d>/<name>` and user
 * stories at `/spotlights/<y>/<m>/<d>/<name>` (see `articleHref`).
 *
 * The `.html` suffix matters. The site is served by GitHub Pages, where a
 * request for `/x.html` resolves to that literal file and nothing else — a
 * stub written to `/x/index.html` does not rescue it. Since `.html` is the
 * form in the old sitemap, in search results and in anyone's bookmarks, it is
 * the one that has to be emitted. The extension-less form is emitted too:
 * Pages served it via its own `.html` fallback, so it is also a URL people
 * may hold.
 * @returns {Promise<Redirect[]>}
 */
export async function articleRedirects() {
  const articles = await getArticles('CHTC', 'Articles', 'main');
  return articles
    .filter(
      (article) =>
        Array.isArray(article.publish_on) && article.publish_on.includes('chtc')
    )
    .flatMap((article) => {
      const pageName = article.slug[3] ?? article.slug.slice(3).join('-');
      const base = article.type === 'user' ? '/spotlights' : '/news';
      // The trailing slash is required, not cosmetic. `trailingSlash: true`
      // puts every page at `<path>/index.html`, and once a stub exists at
      // `<path>.html` GitHub Pages prefers that file over the directory index
      // for a slash-less request — so a stub pointing at `<path>` would serve
      // itself and refresh forever. `<path>/` can only mean the real page.
      const destination = `${base}/${article.slug.join('/')}/`;

      const sources = [`/${pageName}.html`, `/${pageName}`];

      return sources.map((source) => ({
        source,
        destination,
        text: article.title,
      }));
    });
}

/**
 * Legacy event URLs (`/events/<y>/<m>/<d>/<name>.html`, the Jekyll
 * `permalink: /events/:year/:month/:day/:title` output) → the same path with
 * a trailing slash, which is where the exported page lives. getSiteEvents
 * already filters to CHTC-published.
 * @returns {Promise<Redirect[]>}
 */
export async function eventRedirects() {
  const events = await getSiteEvents();
  return events.map((event) => ({
    source: `/events/${event.slug.join('/')}.html`,
    // Trailing slash for the same reason as the article destinations above.
    destination: `/events/${event.slug.join('/')}/`,
    text: event.title,
  }));
}

/**
 * Legacy presentation URLs (`/presentations/<y>/<m>/<d>/<name>.html`) → the
 * exported page at the same path with a trailing slash.
 * @returns {Promise<Redirect[]>}
 */
export async function presentationRedirects() {
  const presentations = await getSitePresentations();
  return presentations.map((presentation) => ({
    source: `/presentations/${presentation.slug.join('/')}.html`,
    destination: `/presentations/${presentation.slug.join('/')}/`,
    text: presentation.title,
  }));
}

/**
 * Legacy URLs of articles the Jekyll site built but that were never
 * published on CHTC (Jekyll rendered the whole shared `_news` collection, so
 * `/<name>.html` existed for every article). Ones published on OSG go to the
 * OSG site's page for them; the rest (HTCondor-only announcements and tech
 * blog posts) go to the news listing.
 * @returns {Promise<Redirect[]>}
 */
export async function otherSiteArticleRedirects() {
  const articles = await getArticles('CHTC', 'Articles', 'main');
  return articles
    .filter(
      (article) =>
        !(Array.isArray(article.publish_on) && article.publish_on.includes('chtc'))
    )
    .flatMap((article) => {
      const pageName = article.slug[3] ?? article.slug.slice(3).join('-');
      const onOsg = Array.isArray(article.publish_on) && article.publish_on.includes('osg');
      const destination = onOsg
        ? `https://osg-htc.org/${article.type === 'news' ? 'news' : 'spotlights'}/${article.slug.join('/')}/`
        : '/news/';
      return [`/${pageName}.html`, `/${pageName}`].map((source) => ({
        source,
        destination,
        text: article.title,
      }));
    });
}
