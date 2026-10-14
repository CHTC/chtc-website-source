import ExportedImage from 'next-image-export-optimizer';
import { Box, Typography } from '@mui/material';
import { EventCard, splitEvents } from '@chtc/web-components/content';
import { getSiteEvents } from '@/utils/events';

/**
 * Upcoming CHTC events carrying `tag`, soonest first — the legacy
 * `get/future_events.liquid` + `where: "tags"` loop on the Bioinformatics
 * Café page.
 */
const UpcomingEvents = async ({ tag, limit = 2 }: { tag?: string; limit?: number | string }) => {
  const { upcoming } = splitEvents(await getSiteEvents());
  const events = upcoming
    .filter((event) => !tag || event.tags?.includes(tag))
    .slice(0, Number(limit) || 2);

  if (events.length === 0) {
    return (
      <Typography variant='body2' color='text.secondary' sx={{ my: 2 }}>
        No upcoming sessions are scheduled yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'grid', gap: 2, my: 2 }}>
      {events.map((event) => (
        <EventCard
          key={event.slug.join('/')}
          href={`/events/${event.slug.join('/')}/`}
          event={event}
          imageComponent={ExportedImage}
        />
      ))}
    </Box>
  );
};

export default UpcomingEvents;
