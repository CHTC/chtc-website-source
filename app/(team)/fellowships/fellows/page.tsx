import { Box, Container, Grid, Link, Typography } from '@mui/material';
import { listingMetadata } from '@/utils/metadata';
import { recordStaffImages } from '@/utils/remoteImages';
import MiniBarHeading from '../../_components/MiniBarHeading';
import { getReportParams } from '../../_lib/fellowships';
import { getFellows, reportHref } from '../../_lib/team';
import FellowCard from '../_components/FellowCard';

export const metadata = listingMetadata(
  'CHTC Fellows',
  'Past CHTC Fellows, their mentors, the projects they delivered and their final reports.',
  '/fellowships/fellows/'
);

export default async function Page() {
  const fellows = await getFellows();
  recordStaffImages(fellows);

  const reports = new Set(
    getReportParams().map(({ year, name }) => `/fellowships/reports/${year}/${name}/`)
  );

  return (
    <Box sx={{ bgcolor: 'grey.100', pt: 1, pb: 4 }}>
      <Container maxWidth='xl'>
        <MiniBarHeading component='h1' variant='h2'>
          CHTC Fellows
        </MiniBarHeading>
        <Typography paragraph sx={{ maxWidth: 'md' }}>
          Fellows work with CHTC mentors over the summer on a project that makes an impact on the
          nation’s science. Learn more about the{' '}
          <Link href='/fellowships/'>CHTC Fellows Program</Link>
          .
        </Typography>
        <Grid container spacing={2}>
          {fellows.map((member) => (
            <Grid key={member.name} size={{ xs: 12, lg: 6 }}>
              <FellowCard member={member} hasReport={reports.has(reportHref(member))} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
