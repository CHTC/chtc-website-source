import type { Metadata } from 'next';
import { Box, Container, Typography } from '@mui/material';
import {
  Presentation,
  isoDate,
  openGraphDefaults,
  pageTitle,
  shareImages,
  summarize,
  twitterDefaults,
} from '@chtc/web-components/content';
import { getSitePresentation, getSitePresentations } from '@/utils/presentations';
import { CHTC_SITE } from '@/site.config';

type Params = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  const presentations = await getSitePresentations();
  return presentations.map((presentation) => ({ slug: presentation.slug }));
}

/**
 * The library has no `presentationMetadata` builder yet, so this assembles
 * the same complete shape `articleMetadata` emits (see `listingMetadata` for
 * why the `openGraph` block must be complete).
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const presentation = await getSitePresentation(slug);
  if (!presentation) return { title: 'Presentation Not Found' };

  const path = `/presentations/${slug.join('/')}`;
  const title = pageTitle(presentation.title, CHTC_SITE);
  // Frontmatter rarely carries a description, so fall back to the facts the
  // listing itself shows: who gave the talk, and where.
  const attribution = [
    presentation.presenter && `Presented by ${presentation.presenter}`,
    presentation.event,
  ]
    .filter(Boolean)
    .join(' at ');
  const description =
    summarize(presentation.description) ?? (attribution || undefined);
  // The recording's YouTube still is what the listing card shows, so it is
  // the natural link-preview image when the talk names no thumbnail.
  const images = shareImages(
    presentation.thumbnail?.src ??
      (presentation.youtubeId
        ? `https://img.youtube.com/vi/${presentation.youtubeId}/hqdefault.jpg`
        : undefined),
    presentation.thumbnail?.alt ?? presentation.title,
    CHTC_SITE
  );

  return {
    title,
    description,
    authors: presentation.presenter
      ? [{ name: presentation.presenter }]
      : undefined,
    keywords: presentation.keywords,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphDefaults(CHTC_SITE),
      type: 'article',
      title,
      description,
      url: path,
      publishedTime: isoDate(presentation.date),
      authors: presentation.presenter ? [presentation.presenter] : undefined,
      images,
    },
    twitter: { ...twitterDefaults, title, description, images },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const presentation = await getSitePresentation(slug);

  if (!presentation) {
    return (
      <Container>
        <Box textAlign='center' pt={6}>
          <Typography variant='h3' component='h1'>
            Presentation Not Found
          </Typography>
        </Box>
      </Container>
    );
  }

  return <Presentation {...presentation} />;
}
