import { Box, Button, Typography } from '@mui/material';
import ContentPage from '@/components/ContentPage';
import { listingMetadata } from '@/utils/metadata';

export const metadata = listingMetadata(
  'Services',
  'CHTC’s computing and research facilitation services for the UW-Madison campus.',
  '/services/'
);

/**
 * The legacy page was only a side navigation with one entry, UW Research
 * Computing; the sentence here is the home page's description of that
 * service.
 */
export default function Page() {
  return (
    <ContentPage title='Services'>
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant='h5' component='h2' gutterBottom>
          Campus Computing
        </Typography>
        <Typography paragraph sx={{ lineHeight: 1.7 }}>
          CHTC manages over 20,000 cores and dozens of GPUs for the UW-Madison campus; this
          resource, which is free and shared, aims to advance the mission of the University of
          Wisconsin in support of the Wisconsin Idea.
        </Typography>
        <Button href='/uw-research-computing/' variant='contained'>
          Campus Computing
        </Button>
      </Box>
    </ContentPage>
  );
}
