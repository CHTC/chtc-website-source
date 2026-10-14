import type { Metadata } from 'next';
import ExportedImage from 'next-image-export-optimizer';
import { Box, Container, Grid, Typography } from '@mui/material';
import {
  eventMetadata,
  formatEventDate,
  isUpcoming,
  type BackendEvent,
} from '@chtc/web-components/content';
import MarkdownContainer from '@/components/MarkdownContainer';
import { getSiteEvents } from '@/utils/events';
import { CHTC_SITE } from '@/site.config';

type Params = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  const events = await getSiteEvents();
  return events.map((event) => ({ slug: event.slug }));
}

/**
 * Params can arrive percent-encoded (one event file name contains a space),
 * so both sides are compared decoded.
 */
const slugKey = (slug: string[]) =>
  slug.map((part) => decodeURIComponent(part)).join('/');

async function getEventBySlug(slug: string[]): Promise<BackendEvent | undefined> {
  const key = slugKey(slug);
  return (await getSiteEvents()).find((event) => slugKey(event.slug) === key);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Event Not Found' };
  return eventMetadata(event, {
    path: `/events/${event.slug.join('/')}`,
    site: CHTC_SITE,
  });
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return (
      <Container>
        <Box textAlign='center' pt={6}>
          <Typography variant='h3' component='h1'>
            Event Not Found
          </Typography>
        </Box>
      </Container>
    );
  }

  const dateLabel = `${isUpcoming(event) ? 'Upcoming Event' : 'Past Event'} | ${formatEventDate(event.start_date, event.end_date)}`;

  return (
    <Container maxWidth='lg' sx={{ pt: 4 }}>
      <Typography
        variant='h6'
        component='p'
        color='text.secondary'
        textAlign='right'
      >
        {dateLabel}
      </Typography>

      {event.banner && (
        <Box mt={2}>
          {/*
            Banners range from wide event artwork to ordinary photos, so the
            image keeps its own aspect ratio up to a height cap instead of
            being forced into one crop.
          */}
          <ExportedImage
            src={event.banner.path}
            alt={event.banner.alt}
            width={1200}
            height={400}
            // Full width of the `lg` container.
            sizes='(max-width: 1200px) 100vw, 1152px'
            priority
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              maxHeight: 480,
              objectFit: 'cover',
            }}
          />
          {event.banner.credit && (
            <Box sx={{ bgcolor: 'grey.100', px: 1, py: 0.5 }}>
              <Typography variant='caption' color='text.secondary'>
                {event.banner.credit}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      <Typography variant='h3' component='h1' mt={3} mb={3}>
        {event.title}
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: event.sidebar ? 8 : 12 }}>
          <MarkdownContainer content={event.content} />
        </Grid>
        {event.sidebar && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ bgcolor: 'grey.100', borderRadius: 1, p: 3 }}>
              <MarkdownContainer content={event.sidebar} />
            </Box>
          </Grid>
        )}
        {event.endblock && (
          <Grid size={{ xs: 12 }}>
            <MarkdownContainer content={event.endblock} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
