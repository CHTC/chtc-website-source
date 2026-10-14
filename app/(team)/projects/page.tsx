import ExportedImage from 'next-image-export-optimizer';
import { Box, Container, Grid, Typography } from '@mui/material';
import { listingMetadata } from '@/utils/metadata';
import MiniBarHeading from '../_components/MiniBarHeading';
import TeamMarkdown from '../_components/Markdown';
import { getProjects } from '../_lib/projects';

export const metadata = listingMetadata(
  'CHTC Partners Using CHTC Technologies and Services',
  'Research groups and experiments, from IceCube to CMS, that use CHTC computing capacity and facilitation to advance their science.',
  '/projects/'
);

/** The image column is a quarter of an `xl` container from `md` up. */
const IMAGE_SIZES = '(max-width: 900px) 100vw, 340px';

export default function Page() {
  const projects = getProjects();

  return (
    <>
      <Container maxWidth='xl'>
        <MiniBarHeading component='h1' variant='h2'>
          CHTC Partners Using CHTC Technologies and Services
        </MiniBarHeading>
      </Container>

      <Box sx={{ bgcolor: 'grey.100', py: 3 }}>
        <Container maxWidth='xl'>
          {projects.map((project) => (
            <Grid
              key={project.slug}
              container
              spacing={{ xs: 2, md: 6 }}
              sx={{ py: 3, borderBottom: 1, borderColor: 'divider', '&:last-of-type': { borderBottom: 0 } }}
            >
              <Grid size={{ xs: 12, md: 8 }} order={{ xs: 2, md: 1 }}>
                <Typography variant='h4' component='h2' gutterBottom>
                  {project.title}
                </Typography>
                {project.description && <TeamMarkdown content={project.description} />}
              </Grid>
              {project.image && (
                <Grid size={{ xs: 12, md: 3 }} order={{ xs: 1, md: 2 }}>
                  {/* Logos and portraits of mixed shapes: contain, at most 200px tall. */}
                  <Box sx={{ position: 'relative', width: '100%', height: 200, mt: { md: 6 } }}>
                    <ExportedImage
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes={IMAGE_SIZES}
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          ))}
        </Container>
      </Box>
    </>
  );
}
