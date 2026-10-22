import { Box, Typography } from '@mui/material';
import ContentPage from '@/components/ContentPage';
import { listingMetadata } from '@/utils/metadata';

export const metadata = listingMetadata(
  'HTC Newsletter',
  'Sign up for the HTC Newsletter: upcoming events, training opportunities and other news about High Throughput Computing.',
  '/newsletter/'
);

export default function Page() {
  return (
    <ContentPage title='HTC Newsletter'>
      <Typography paragraph sx={{ lineHeight: 1.7 }}>
        The HTC Newsletter is an email that includes information about upcoming events, training
        opportunities, and other news about HTC. If you would like to receive the HTC Newsletter,
        please fill out the form below.
      </Typography>
      <Box
        component='iframe'
        src='https://chtc.substack.com/embed'
        title='Subscribe to the HTC Newsletter'
        loading='lazy'
        sx={{
          display: 'block',
          width: '100%',
          height: 320,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'common.white',
          mt: 2,
        }}
      />
    </ContentPage>
  );
}
