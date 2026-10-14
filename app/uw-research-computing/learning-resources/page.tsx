import { Container, Link, Typography } from '@mui/material';
import { listingMetadata } from '@/utils/metadata';
import PageTitle from '../_components/PageTitle';
import { SECTION } from '../_lib/docs';
import { learningResources } from '../_lib/learningResources';
import View from './view';

export const metadata = listingMetadata(
  'Learning Resources',
  'A collection of tutorials, workshops, and example repositories for learning high throughput and high performance computing.',
  `${SECTION}/learning-resources/`
);

export default function Page() {
  return (
    <Container maxWidth='lg'>
      <PageTitle>Learning Resources</PageTitle>
      <Typography sx={{ mb: 3, maxWidth: 800 }}>
        Tutorials, workshop resources, and examples for learning how to run your research
        computing work at scale. Filter by topic using the tags or search for a keyword. Have a
        resource to contribute?{' '}
        <Link href='https://uwmadison.co1.qualtrics.com/jfe/form/SV_42AO08VKRLP6lVA'>
          Fill out our contribution form.
        </Link>
      </Typography>
      <View resources={learningResources()} />
    </Container>
  );
}
