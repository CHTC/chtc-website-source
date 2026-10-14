import { Box, Container, Typography } from '@mui/material';
import { PresentationGrid } from '@/components/PresentationGrid';
import { getSitePresentations } from '@/utils/presentations';
import { listingMetadata } from '@/utils/metadata';
import { siteConfig } from '@/site.config';

export const metadata = listingMetadata(
  'Presentations',
  'Slides, recordings, and talks from the Center for High Throughput Computing and the wider high throughput computing community.',
  '/presentations'
);

export default async function Page() {
  // The card falls back to a YouTube thumbnail, which for a talk with no
  // recording is a broken image; give those the site's share image instead.
  const presentations = (await getSitePresentations()).map((presentation) =>
    presentation.thumbnail || presentation.youtubeId
      ? presentation
      : {
          ...presentation,
          thumbnail: {
            src: siteConfig.shareImage.url,
            alt: siteConfig.shareImage.alt,
          },
        }
  );

  return (
    <>
      <Box textAlign='center' py={5}>
        <Typography variant='h2' component='h1'>
          Presentations
        </Typography>
      </Box>
      <Container maxWidth='xl'>
        <PresentationGrid presentations={presentations} />
      </Container>
    </>
  );
}
