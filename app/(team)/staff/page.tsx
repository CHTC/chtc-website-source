import { Box, Container, Link, Typography } from '@mui/material';
import { listingMetadata } from '@/utils/metadata';
import MiniBarHeading from '../_components/MiniBarHeading';

export const metadata = listingMetadata(
  'CHTC Staff Page',
  'Internal how-to documents for CHTC staff: schedule calendar set-up and adding news articles.',
  '/staff/'
);

export default function Page() {
  return (
    <Container maxWidth='md'>
      <MiniBarHeading component='h1' variant='h2'>
        CHTC Staff Page
      </MiniBarHeading>

      <Typography variant='h4' component='h2' sx={{ mt: 4 }}>
        Docs:
      </Typography>
      <Box component='ul' sx={{ pl: 3, lineHeight: 1.8 }}>
        <li>
          <Link href='/staff/docs/Schedule_Calendar/'>Google Schedule Set Up</Link>
        </li>
        <li>
          <Link href='/staff/docs/Adding_News_Articles/'>Adding News Articles</Link>
        </li>
      </Box>

      <Typography variant='h4' component='h2' sx={{ mt: 4 }}>
        Schedule Calendar
      </Typography>
      <Box component='ul' sx={{ pl: 3, lineHeight: 1.8 }}>
        <li>
          <Link href='https://research.cs.wisc.edu/htcondor/developers/schedules/schedules.pl'>
            Schedules
          </Link>
        </li>
      </Box>
    </Container>
  );
}
