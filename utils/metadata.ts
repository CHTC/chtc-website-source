import type { Metadata } from 'next';
import {
  openGraphDefaults,
  pageTitle,
  shareImages,
  twitterDefaults,
} from '@chtc/web-components/content';
import { CHTC_SITE } from '@/site.config';

/**
 * Metadata for a listing page: title, description, and its own canonical URL.
 *
 * The library builds metadata from a piece of content; a listing page has
 * none, so this assembles the same shape from the two lines of copy a list
 * page does have. It emits a complete `openGraph` block for the reason given
 * in `openGraphDefaults`: Next replaces the inherited one rather than
 * merging it.
 */
export function listingMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const full = pageTitle(title, CHTC_SITE);
  return {
    title: full,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphDefaults(CHTC_SITE),
      type: 'website',
      title: full,
      description,
      url: path,
      images: shareImages(undefined, undefined, CHTC_SITE),
    },
    twitter: { ...twitterDefaults, title: full, description },
  };
}
