import ExportedImage from 'next-image-export-optimizer';
import { Box, Container, Grid, Typography } from '@mui/material';
import { ArticleCard, type BackendArticle } from '@chtc/web-components/content';
import { articleHref, getSiteArticles } from '@/utils/articles';
import { listingMetadata } from '@/utils/metadata';

export const metadata = listingMetadata(
  'News',
  'How CHTC is making an impact: news and announcements from the Center for High Throughput Computing.',
  '/news'
);


function isFeatured(article: BackendArticle): boolean {
  return article.tag?.includes('chtc_featured_article') ?? false;
}

function ArticleGrid({ articles }: { articles: BackendArticle[] }) {
  return (
    <Grid container spacing={2}>
      {articles.map((article) => (
        <Grid key={article.slug.join('-')} size={{ xs: 12, sm: 6, lg: 4 }}>
          <ArticleCard
            href={articleHref(article)}
            article={article}
            imageComponent={ExportedImage}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default async function Page() {
  // News only; user stories have their own listing at `/spotlights`.
  const articles = await getSiteArticles('news');
  const featured = articles.filter(isFeatured);
  const rest = articles.filter((article) => !isFeatured(article));

  return (
    <>
      <Container maxWidth='md' sx={{ py: 5 }}>
        <Typography variant='h2' component='h1' gutterBottom>
          News: How CHTC is Making An Impact
        </Typography>
        <Typography>
          CHTC’s computing pioneering continues to advance science and society
          in new ways. Located at the heart of UW-Madison’s School for Computer,
          Data &amp; Information Sciences (CDIS), CHTC offers exceptional
          computing capabilities and experienced facilitation support to campus
          researchers and international scientists alike. Working in
          collaboration with projects across all areas of study, CHTC helps
          innovate solutions that otherwise might not have been possible, while
          at the same time evolving the field of distributed computing.
        </Typography>
      </Container>

      {featured.length > 0 && (
        <Box sx={{ bgcolor: 'grey.200', py: 5 }}>
          <Container maxWidth='xl'>
            <Typography variant='h3' component='h2' textAlign='center' gutterBottom>
              Featured News
            </Typography>
            <ArticleGrid articles={featured} />
          </Container>
        </Box>
      )}

      <Container maxWidth='xl' sx={{ pt: 5 }}>
        <Typography variant='h4' component='h2' gutterBottom>
          Read about some of CHTC’s latest news and projects:
        </Typography>
        <ArticleGrid articles={rest} />
      </Container>
    </>
  );
}
