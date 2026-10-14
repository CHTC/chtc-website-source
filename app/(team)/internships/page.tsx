import ExportedImage from 'next-image-export-optimizer';
import { Box, Button, Container, Grid, Link, Paper, Typography } from '@mui/material';
import { listingMetadata } from '@/utils/metadata';
import JobCard from '../_components/JobCard';
import MiniBarHeading from '../_components/MiniBarHeading';
import { getOpenJobs, slugify } from '../_lib/jobs';
import bannerSmall from '@/public/images/chtc-internship-banner.jpg';
import bannerLarge from '@/public/images/chtc-internship-banner-lg.jpg';

export const metadata = listingMetadata(
  'The Path to Internship and Fellowship Opportunities',
  'Internships, student hourly positions and summer fellowships for undergraduate and graduate students at the Center for High Throughput Computing.',
  '/internships/'
);

const Lead = ({ children }: { children: React.ReactNode }) => (
  <Typography paragraph sx={{ fontSize: '1.25rem', lineHeight: 1.6 }}>
    {children}
  </Typography>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <Typography paragraph sx={{ lineHeight: 1.7 }}>
    {children}
  </Typography>
);

const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <Typography id={id} variant='h4' component='h2' sx={{ mt: 4, mb: 1, scrollMarginTop: 96 }}>
    {children}
  </Typography>
);

/**
 * The collage banner: a 2:1 crop for phones and tablets, the 3.2:1 one from
 * `lg` up, each painted the full viewport width in a box up to 400px tall.
 */
function Banner() {
  return (
    <Box component='figure' sx={{ m: 0, position: 'relative', width: '100%', height: { xs: 260, sm: 400 } }}>
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <ExportedImage
          src={bannerSmall}
          alt='Collage photos of current and previous CHTC interns.'
          fill
          priority
          sizes='(max-width: 600px) 600px, (max-width: 1200px) 100vw, 1px'
          style={{ objectFit: 'cover' }}
        />
      </Box>
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <ExportedImage
          src={bannerLarge}
          alt='Collage photos of current and previous CHTC interns.'
          fill
          sizes='(max-width: 1200px) 1px, 100vw'
          style={{ objectFit: 'cover' }}
        />
      </Box>
    </Box>
  );
}

export default function Page() {
  const student = getOpenJobs().filter((job) => job.type === 'Internship');

  return (
    <>
      <Banner />

      <Container maxWidth='xl'>
        <Grid container spacing={6} justifyContent='center'>
          <Grid size={{ xs: 12, sm: 10, lg: 8 }}>
            <MiniBarHeading component='h1' variant='h2'>
              The Path to Internship and Fellowship Opportunities
            </MiniBarHeading>
            <Lead>
              Want to make a difference and see your work directly impact science across the
              globe?
            </Lead>
            <Lead>
              The Center for High Throughput Computing offers internship and summer fellowship
              opportunities for undergraduate and graduate students.
            </Lead>

            <H2>The Mission</H2>
            <P>
              CHTC is a research computing organization located within the University of
              Wisconsin-Madison CS Department and at the Morgridge Institute for Research. CHTC is
              an internationally recognized leader in high throughput computing and provides access
              to free large-scale computing capacity for research. CHTC advances the field of
              research computing through innovative software and services, leading distributed
              computing projects across the campus and the nation.
            </P>

            <H2>The CHTC Fellows Program</H2>
            <P>
              Our Fellows Program provides undergraduate and graduate students with learning
              opportunities in research computing, system administration, and facilitation. Working
              with engineers and dedicated mentors, fellows will have the opportunity to learn from
              leaders in their field and access state of the art computing facilities. Fellows can
              also attend workshops, lectures and social and recreational events with CHTC team
              members.
            </P>
            <Button variant='contained' href='/fellowships/'>
              Learn About CHTC Fellows Program
            </Button>

            <H2>We Value Diversity</H2>
            <P>
              CHTC and Morgridge are committed to increasing diversity among interns and staff. We
              believe that advancing throughput computing and scientific research is enhanced by a
              wide range of backgrounds and perspectives.
            </P>

            {student.length > 0 && (
              <>
                <H2 id='student-hourly-positions-undergrad-and-grad'>
                  Student Hourly Positions (Undergrad and Grad)
                </H2>
                <P>
                  We&apos;re always looking for smart motivated students to partner with software
                  developer and system administrator mentors. We expect students to work between 10
                  and 20 hours a week, with 10 of those being during business hours, with some
                  flexibility on remaining hours. During the summer and breaks, it is possible to
                  work up to 29 hours per week.
                </P>
                {student.map((job) => (
                  <JobCard key={job.slug} job={job} />
                ))}
              </>
            )}

            <Typography textAlign='center' sx={{ mt: 5 }}>
              Questions:{' '}
              <Link href='mailto:chtc-jobs@g-groups.wisc.edu'>chtc-jobs@g-groups.wisc.edu</Link>
            </Typography>
          </Grid>

          {student.length > 0 && (
            <Grid size={{ lg: 4 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Paper variant='outlined' sx={{ position: 'sticky', top: 96, mt: 10, p: 3 }}>
                <Typography variant='h6' component='h2'>
                  Open Positions
                </Typography>
                <Box component='ul' sx={{ pl: 2.5, mt: 0.5 }}>
                  {student.map((job) => (
                    <li key={job.slug}>
                      <Link href={`#${slugify(job.title)}`}>{job.title}</Link>
                    </li>
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
