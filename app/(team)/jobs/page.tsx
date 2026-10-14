import { Box, Button, Container, Divider, Grid, Link, Paper, Typography } from '@mui/material';
import { listingMetadata } from '@/utils/metadata';
import JobCard from '../_components/JobCard';
import MiniBarHeading from '../_components/MiniBarHeading';
import PageHero from '../_components/PageHero';
import { getOpenJobs, slugify } from '../_lib/jobs';
import emileWorking from '@/public/images/Emile_Working.jpg';

export const metadata = listingMetadata(
  'Available Positions',
  'Full-time positions, student hourly jobs, fellowships and internships with the Center for High Throughput Computing at UW–Madison.',
  '/jobs/'
);

const P = ({ children }: { children: React.ReactNode }) => (
  <Typography paragraph sx={{ lineHeight: 1.7 }}>
    {children}
  </Typography>
);

export default function Page() {
  const jobs = getOpenJobs();
  const fullTime = jobs.filter((job) => job.type === 'Full Time');
  const student = jobs.filter((job) => job.type === 'Internship');

  return (
    <>
      <PageHero
        src={emileWorking}
        alt='IT Professional, Emile, working in the Discovery Server Rooms'
        height={{ xs: 220, sm: 400 }}
        caption='Photo: Morgridge Institute for Research'
      />

      <Container maxWidth='xl'>
        <Grid container spacing={6} justifyContent='center'>
          <Grid size={{ xs: 12, sm: 10, lg: 8 }}>
            <MiniBarHeading component='h1' variant='h2'>
              Available Positions
            </MiniBarHeading>
            <P>
              If advancing the state of the art of distributed computing in an academic
              environment interests you, the Center for High Throughput Computing (CHTC) at the
              University of Wisconsin-Madison (UW) offers a unique working environment. Our
              project’s home is in the UW Department of Computer Sciences, an internationally
              recognized department consistently ranked in the top ten across the USA.
            </P>
            <P>
              A position with CHTC will provide you the opportunity to interact with both
              department faculty and students to translate novel ideas into real-world solutions.
              The software and infrastructure you will be working on is used by scientists and
              engineers at hundreds of institutions, from universities to national laboratories
              and from large high tech corporations to small animation teams.
            </P>

            <Typography id='internships' variant='h4' component='h2' sx={{ mt: 4, mb: 1 }}>
              Fellowships &amp; Internships
            </Typography>
            <P>
              Our student programs provides undergraduate and graduate students with learning
              opportunities in research computing, system administration, web development, and
              communication.
            </P>
            <Button variant='contained' color='secondary' href='/internships/'>
              Discover Active Fellowships and Internships
            </Button>

            {fullTime.length > 0 && (
              <>
                <Typography id='full-time-positions' variant='h4' component='h2' sx={{ mt: 5, mb: 1 }}>
                  Full Time Positions
                </Typography>
                <P>
                  Details about our open full-time positions are typically provided below.
                  Positions pertaining to &quot;HTCondor&quot; and &quot;CHTC&quot; search terms can
                  also be found on the{' '}
                  <Link href='https://jobs.wisc.edu/jobs/search?page=1&query=chtc'>
                    University&apos;s Position Vacancy List (PVL)
                  </Link>
                  .
                </P>
                {fullTime.map((job) => (
                  <JobCard key={job.slug} job={job} />
                ))}
              </>
            )}

            {student.length > 0 && (
              <>
                <Typography
                  id='student-hourly-positions-undergrad-and-grad'
                  variant='h4'
                  component='h2'
                  sx={{ mt: 5, mb: 1 }}
                >
                  Student Hourly Positions (Undergrad and Grad)
                </Typography>
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

            <Divider sx={{ my: 4 }} />
            <Typography id='benefits' variant='h4' component='h2' sx={{ mb: 1 }}>
              Benefits
            </Typography>
            <P>
              The University of Wisconsin-Madison is a great place to work. You can{' '}
              <Link href='https://hr.wisc.edu/benefits/'>
                read about the benefits in detail elsewhere
              </Link>
              . In short, we have five weeks of vacation/personal time per year, very good health
              insurance (and cost effective for entire families), and a good retirement plan.
              Please note that the minimum salary in our job listings are just that - the minimum.
              Compensation will increase with experience.
            </P>
            <P>In addition to the official benefits, there are many side benefits:</P>
            <Box component='ol' sx={{ pl: 3, lineHeight: 1.7, '& li': { mb: 0.75 } }}>
              <li>
                You will work with the CHTC team. We are world leaders in solving interesting
                distributed computing problems!
              </li>
              <li>You can attend interesting talks in the department</li>
              <li>Relatively flexible working hours — we value work-life balance.</li>
              <li>A Discounted Bus Pass!</li>
              <li>
                You get staff access to <Link href='http://www.union.wisc.edu/'>the Union</Link>,{' '}
                <Link href='http://www.recsports.wisc.edu/'>the UW athletic facilities</Link>, and{' '}
                <Link href='http://www.library.wisc.edu/'>the UW library system</Link>.
              </li>
              <li>
                We&apos;re in a lively neighborhood with great restaurants in easy walking distance.
              </li>
            </Box>

            <Divider sx={{ my: 4 }} />
            <P>
              If you are interested in a position with CHTC, explore the job listings below! If you
              would like to apply, send your resume and cover letter to{' '}
              <Link href='mailto:chtc-jobs@g-groups.wisc.edu'>chtc-jobs@g-groups.wisc.edu</Link>,
              and indicate which job you would like to apply for.
            </P>
            <P>
              <strong>Please note:</strong>
            </P>
            <Box component='ul' sx={{ pl: 3, lineHeight: 1.7, '& li': { mb: 0.75 } }}>
              <li>A criminal background check will be conducted prior to hiring.</li>
              <li>A period of evaluation will be required.</li>
              <li>
                UW-Madison is an equal opportunity/affirmative action employer. We promote
                excellence through diversity and encourage all qualified individuals to apply.
              </li>
            </Box>
          </Grid>

          <Grid size={{ lg: 4 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Paper
              variant='outlined'
              sx={{ position: 'sticky', top: 96, mt: 10, p: 3, '& ul': { pl: 2.5, mt: 0.5 } }}
            >
              {fullTime.length > 0 && (
                <>
                  <Typography variant='h6' component='h2'>
                    Full-Time Positions
                  </Typography>
                  <ul>
                    {fullTime.map((job) => (
                      <li key={job.slug}>
                        <Link href={`#${slugify(job.title)}`}>{job.title}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <Typography variant='h6' component='h2'>
                Fellowships
              </Typography>
              <ul>
                <li>
                  <Link href='/fellowships/'>View Fellowships</Link>
                </li>
              </ul>
              <Typography variant='h6' component='h2'>
                Internships
              </Typography>
              <ul>
                <li>
                  <Link href='/internships/'>View Internships</Link>
                </li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
