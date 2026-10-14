import { Box, Container, Grid, Link, Typography } from '@mui/material';
import ExportedImage from 'next-image-export-optimizer';
import {
  EventCard,
  splitEvents,
  type BackendEvent,
} from '@chtc/web-components/content';
import { getSiteEvents } from '@/utils/events';
import { listingMetadata } from '@/utils/metadata';

export const metadata = listingMetadata(
  'Events',
  'Upcoming and past workshops, trainings, information sessions and conferences hosted by or involving the Center for High Throughput Computing.',
  '/events'
);

function EventGrid({ events }: { events: BackendEvent[] }) {
  return (
    <Grid container spacing={2}>
      {events.map((event) => (
        <Grid key={event.slug.join('/')} size={{ xs: 12, sm: 6, lg: 4 }}>
          <EventCard
            href={`/events/${event.slug.join('/')}/`}
            event={event}
            imageComponent={ExportedImage}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default async function Page() {
  const { upcoming, past } = splitEvents(await getSiteEvents());

  return (
    <>
      <Box textAlign='center' py={5}>
        <Typography variant='h2' component='h1'>
          Events
        </Typography>
      </Box>
      <Container maxWidth='xl'>
        {upcoming.length > 0 && (
          <Box mb={4}>
            <Typography variant='h4' component='h2' mb={2}>
              Upcoming Events
            </Typography>
            <EventGrid events={upcoming} />
          </Box>
        )}

        <Typography variant='body1' mb={4}>
          Sign up for our{' '}
          <Link href='/uw-research-computing/email-list/'>
            email list
          </Link>{' '}
          to get notified about upcoming events and trainings!
        </Typography>

        {past.length > 0 && (
          <>
            <Typography
              variant='h4'
              component='h2'
              color='text.secondary'
              mb={2}
            >
              Past Events
            </Typography>
            <EventGrid events={past} />
          </>
        )}
      </Container>
    </>
  );
}
