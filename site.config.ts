import type { SiteMetadata } from '@chtc/web-components/content';

/**
 * What this site is.
 *
 * The name, the one-line description and the share image live here and
 * `app/layout.tsx`, `app/manifest.ts` and the metadata helpers read from
 * this module, so changing any of them is a one-place edit.
 *
 * Server-side only: `HOSTNAME` is a plain build variable, not a
 * `NEXT_PUBLIC_` one, so a client component importing this would read
 * `undefined` for {@link siteConfig.url}. Everything that uses it today is a
 * server component or a route handler.
 */
export const siteConfig = {
  name: 'Center for High Throughput Computing',
  shortName: 'CHTC',
  description:
    'UW-Madison team established to bring the power of High Throughput Computing to all fields of research.',
  locale: 'en_US',
  /** Set per deployment; the sitemap and robots.txt need it absolute. */
  url: `https://${process.env.HOSTNAME}`,
  /**
   * The site-wide share image.
   *
   * `app/opengraph-image.jpg` already covers every page that does not define
   * its own `openGraph` block. A page that does define one has to name an
   * image explicitly, because Next replaces the inherited block wholesale
   * rather than merging it — this is that same file.
   */
  shareImage: {
    url: '/opengraph-image.jpg',
    width: 1203,
    height: 630,
    alt: 'Center for High Throughput Computing — UW-Madison',
  },
} as const;

/**
 * The same identity in the shape `@chtc/web-components`' metadata builders
 * take. They are handed a site per call rather than reading the environment,
 * so this is the one place the site names itself to them.
 */
export const CHTC_SITE: SiteMetadata = {
  siteName: siteConfig.name,
  locale: siteConfig.locale,
  fallbackImage: { ...siteConfig.shareImage },
};
