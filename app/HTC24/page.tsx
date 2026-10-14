import ExportedImage from 'next-image-export-optimizer';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import MarkdownContainer from '@/components/MarkdownContainer';
import { listingMetadata } from '@/utils/metadata';

const TITLE = 'Save the Dates for Throughput Computing 2024';

export const metadata = listingMetadata(
  TITLE,
  "Don't miss this opportunity to reconnect with colleagues and learn about more about HTC.",
  '/HTC24/'
);

/** The event's last day; the page reads "Past Event" once the build is later. */
const END_DATE = '2024-07-12';

const MAIN = `
**Don't miss this opportunity to reconnect with colleagues and learn more about HTC.**

Join us for the second annual integrated Throughput Computing event — which combines HTCondor’s former annual event “HTCondor Week” and the OSG’s “All-Hands Meeting” — from July 8-12 to be held at the University of Wisconsin-Madison’s [Fluno Center](https://fluno.com/). HTC24 is sponsored by the OSG Consortium, the HTCondor team and the UW-Madison Center for High Throughput Computing.

Registration will open in March. This will primarily be an in-person event, but remote participation (via Zoom) for the many plenary events will also be offered.
If you register for the in-person event at the University of Wisconsin–Madison, you can attend plenary and non-plenary sessions, mingle with colleagues, and have planned or ad hoc meetings. Evening events are also planned throughout the week.

### The Agenda

All the topics typically covered by HTCondor Week and the OSG All-Hands Meeting will be included:

- Science Enabled by the OSPool and the HTCondor Software Suite (HTCSS)
- OSG Technology
- HTCondor Technology
- HTCondor and OSG Tutorials
- State of the OSG
- Campus  Services and Perspectives

### Questions and Resources

For questions about attending, speaking, accommodations, and other concerns please contact us at [htc@path-cc.io](mailto:htc@path-cc.io).

To learn about this event in more detail, view last year’s schedules for HTC23:

- [HTC23 Schedule](https://agenda.hep.wisc.edu/event/2014/timetable/#all.detailed)
`;

const SIDEBAR = `
### Dates

Monday, July 8 through Friday, July 12, 2024.

### Who

Organizations, researchers, campuses, facilitators and administrators interested in the [HTCondor Software Suite](https://htcondor.org) and high throughput computing or the [OSG Consortium](https://osg-htc.org/) resources or services (including the [OSPool](https://osg-htc.org/services/ospool/), the [Open Science Data Federation](https://osg-htc.org/services/osdf/), the [Pelican Platform](https://pelicanplatform.org/), or the [PATh Facility](https://path-cc.io/facility/).)

### Where

[Fluno Center](https://fluno.com/) on the University of Wisconsin-Madison campus and Online via Zoom.

### Registration

Registration for Throughput Computing 2024 will open in March.

### Questions?

Please email [htc@path-cc.io](mailto:htc@path-cc.io) with any questions.
`;

/**
 * A one-off event page that predates the shared Events repository (legacy
 * `layout: events`). Kept at its old address because it was linked from
 * announcements.
 */
export default function Page() {
  const past = new Date().toISOString().slice(0, 10) > END_DATE;

  return (
    <Container maxWidth='lg' sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant='subtitle1' component='p' color='text.secondary' sx={{ fontWeight: 700, mb: 1.5 }}>
        {past ? 'Past Event' : 'Upcoming Event'} | July 8–12, 2024
      </Typography>
      <Box sx={{ borderRadius: 4, overflow: 'hidden', mb: 3 }}>
        <ExportedImage
          src='/images/events/Throughput-Computing-2024-BannerCHTC.jpg'
          alt='Throughput Computing 2024'
          width={1920}
          height={641}
          sizes='(max-width: 1200px) 100vw, 1152px'
          priority
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </Box>
      <Typography variant='h2' component='h1' sx={{ mb: 4, fontSize: { xs: '2rem', md: '2.75rem' } }}>
        {TITLE}
      </Typography>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <MarkdownContainer content={MAIN} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant='outlined' sx={{ p: 3, bgcolor: 'grey.50' }}>
            <MarkdownContainer content={SIDEBAR} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
