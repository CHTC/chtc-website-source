import ExportedImage from 'next-image-export-optimizer';
import { Box, Container, Grid, Typography } from '@mui/material';
import { ArticleCard, HorizontalArticleCard } from '@chtc/web-components/content';
import { articleHref, getSiteArticles } from '@/utils/articles';
import { listingMetadata } from '@/utils/metadata';

export const metadata = listingMetadata(
  'Spotlights',
  'Stories from the researchers using CHTC’s computing and facilitation to do their science.',
  '/spotlights'
);

export default async function Page() {
  const stories = await getSiteArticles('user');
  const [latest, ...rest] = stories;

  return (
    <>
      <Container maxWidth='md' sx={{ py: 5 }}>
        <Typography variant='h2' component='h1' gutterBottom>
          Spotlights
        </Typography>
        <Typography>
          Researchers across UW-Madison and beyond use CHTC’s computing capacity
          and facilitation to take on questions that would not fit on a laptop
          or a lab cluster. These stories, written with the researchers
          themselves, show what that work looks like and what it has made
          possible.
        </Typography>
      </Container>

      {latest && (
        <Container maxWidth='xl' sx={{ mb: 5 }}>
          <HorizontalArticleCard
            href={articleHref(latest)}
            article={latest}
            imageComponent={ExportedImage}
          />
        </Container>
      )}

      <Container maxWidth='xl'>
        <Box component='h2' sx={{ typography: 'h4', mt: 0, mb: 2 }}>
          All stories
        </Box>
        <Grid container spacing={2}>
          {rest.map((article) => (
            <Grid key={article.slug.join('-')} size={{ xs: 12, sm: 6, lg: 4 }}>
              <ArticleCard
                href={articleHref(article)}
                article={article}
                imageComponent={ExportedImage}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
