import fs from 'fs';
import path from 'path';
import ExportedImage from 'next-image-export-optimizer';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Link,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArticleCard } from '@chtc/web-components/content';
import { articleHref, getSiteArticles } from '@/utils/articles';
import { listingMetadata } from '@/utils/metadata';
import PageTitle from './_components/PageTitle';
import { SECTION } from './_lib/docs';

export const metadata = listingMetadata(
  'Campus Computing',
  "Your home for research computing at UW-Madison: CHTC's High Throughput Computing system and High Performance Computing cluster, with consulting, training and support at no cost.",
  `${SECTION}/`
);

const USE_CASES = [
  'RNA/DNA Sequencing Analyses',
  'Machine Learning Workflows',
  'Economic Simulations & Predictions',
  'Weather Modeling Analyses',
  'Chemical Reaction Predictions',
  'Computer Vision',
  'Artificial Intelligence',
  'Modeling & Decision Making',
  'Forestry and Wildlife Analyses',
  'And More!',
];

/** `int_to_small_format` from the legacy `index-v2.js`: 12345 → "12K". */
function smallFormat(value: number): string {
  if (value < 1e3) return value.toFixed(0);
  if (value < 1e6) return `${(value / 1e3).toFixed(0)}K`;
  if (value < 1e9) return `${(value / 1e6).toFixed(0)}M`;
  if (value < 1e12) return `${(value / 1e9).toFixed(0)}B`;
  return value.toFixed(0);
}

/**
 * The yearly totals the legacy page fetched in the browser from
 * `/assets/data/*.json`; the files are static, so they are summed at build.
 */
function statistics() {
  const dir = path.join(process.cwd(), 'public', 'assets', 'data');
  const colleges = JSON.parse(fs.readFileSync(path.join(dir, 'chtc-data-summary.json'), 'utf8')) as {
    NumProj: number;
    HTCYears: number;
    HPCYears: number;
  }[];
  const { InteractionCount } = JSON.parse(
    fs.readFileSync(path.join(dir, 'interaction-count.json'), 'utf8')
  ) as { InteractionCount: number };
  const sum = (key: 'NumProj' | 'HTCYears' | 'HPCYears') =>
    colleges.reduce((total, college) => total + (college[key] ?? 0), 0);
  return [
    { label: 'Facilitator Interactions', value: InteractionCount },
    { label: 'Projects Supported', value: sum('NumProj') },
    { label: 'HTC Core Years', value: sum('HTCYears') },
    { label: 'HPC Core Years', value: sum('HPCYears') },
  ];
}

const FAQS: { question: string; answer: React.ReactNode }[] = [
  {
    question: 'What computing services do you provide?',
    answer: (
      <>
        CHTC provides access to batch computing through both{' '}
        <strong>
          <Link href='/htc/'>High Throughput Computing (HTC)</Link>
        </strong>{' '}
        and <strong>High Performance Computing (HPC)</strong> resources. For CHTC users, we provide
        consulting, training, and software support.
      </>
    ),
  },
  {
    question: 'Am I eligible for a CHTC account?',
    answer:
      'Students, faculty, staff, and other university affiliates who need computing resources for research or approved courses are eligible for a CHTC account.',
  },
  {
    question: 'How do I get an account?',
    answer: (
      <>
        You can get a CHTC account by following the steps found on the{' '}
        <Link href={`${SECTION}/form/`}>account registration page.</Link>
      </>
    ),
  },
  {
    question: 'Do I need to know how to code to use CHTC?',
    answer: (
      <>
        No. In general, you should know how to run your code or program (on your laptop or other
        computers), but coding experience is not required. Bring your code, program, or workflow and
        the <Link href={`${SECTION}/facilitation-team/`}>CHTC Facilitation Team</Link> can guide you
        through running it on our computing systems. Many new users learn the necessary skills as
        they get started. CHTC provides <Link href={`${SECTION}/user-portal/`}>training materials</Link>{' '}
        and <Link href={`${SECTION}/get-help/`}>support</Link> to help users succeed.
      </>
    ),
  },
  {
    question: 'How much does it cost to use CHTC?',
    answer: (
      <>
        CHTC services are available at <strong>no cost</strong> to UW-Madison researchers, their
        projects, and approved collaborators. There is no ceiling to use CHTC shared computing
        resources. For start-up packages, purchasing hardware, or other special needs, see our{' '}
        <Link href='/faculty-resources/'>Faculty Resources</Link>.
      </>
    ),
  },
];

/** The UW Research Computing home page (legacy `_uw-research-computing/index.html`). */
export default async function Page() {
  // Newest first; only the types that have a page under /news.
  const stories = (await getSiteArticles())
    .filter((article) => article.type === 'news' || article.type === 'user')
    .slice(0, 2);

  return (
    <>
      {/* Banner */}
      <Box sx={{ position: 'relative', height: { xs: 280, md: 500 }, overflow: 'hidden' }}>
        <ExportedImage
          src='/images/Emile_Working.jpg'
          alt='Emile working in the server room'
          fill
          priority
          sizes='100vw'
          style={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <Typography
            component='h1'
            sx={{
              color: 'common.white',
              textAlign: 'center',
              fontWeight: 400,
              fontSize: 'calc(1.5rem + 2vw)',
              lineHeight: 1.15,
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              px: 2,
            }}
          >
            Your Home for
            <br />
            Campus Computing
          </Typography>
        </Box>
      </Box>

      <Container maxWidth='md'>
        <PageTitle component='h2'>
          Join Hundreds of UW-Madison Researchers using CHTC Resources to Complete:
        </PageTitle>
        <Box
          component='ul'
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1,
            listStyle: 'none',
            p: 0,
            m: 0,
          }}
        >
          {USE_CASES.map((useCase) => (
            <Box component='li' key={useCase} sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '1.25rem' }}>
              <CheckIcon color='primary' />
              {useCase}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <Button href={`${SECTION}/form/`} variant='contained' size='large' sx={{ fontSize: '1.4rem' }}>
            Request Account
          </Button>
        </Box>
      </Container>

      {/* Stats */}
      <Container maxWidth='md'>
        <PageTitle component='h2'>Research Transformed Annually</PageTitle>
      </Container>
      <Box sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', py: 5 }}>
        <Container maxWidth='md'>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 3,
              textAlign: 'center',
            }}
          >
            {statistics().map((stat) => (
              <Box key={stat.label}>
                <Typography component='p' sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, fontWeight: 700, lineHeight: 1 }}>
                  {smallFormat(stat.value)}
                </Typography>
                <Typography component='p' variant='h6' sx={{ mt: 1 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth='md'>
        <PageTitle component='h2'>Who We Are</PageTitle>
        <Typography paragraph sx={{ lineHeight: 1.7 }}>
          We are the University of Wisconsin-Madison&apos;s core computational service provider for
          large scale computing. CHTC services are open to UW-Madison staff, students, faculty, and
          external collaborators.
        </Typography>
        <Typography paragraph sx={{ lineHeight: 1.7 }}>
          We offer both a High Throughput Computing system and a High Performance Computing cluster.
          Access to CPUs/GPUs, high-memory servers, data storage capacity, as well as personalized
          consultations and classroom support, are provided at no-cost.
        </Typography>

        <PageTitle component='h2'>Frequently Asked Questions</PageTitle>
        {FAQS.map((faq) => (
          <Accordion key={faq.question} disableGutters variant='outlined'>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ lineHeight: 1.7 }}>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <PageTitle component='h2'>Departments with Researchers using CHTC Services</PageTitle>
        <Box
          component='iframe'
          src={`${SECTION}/campus_map.html`}
          title='Interactive Campus Map'
          loading='lazy'
          sx={{ width: '100%', height: 400, border: 0, borderRadius: 2 }}
        />

        <PageTitle component='h2'>Impact Stories</PageTitle>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {stories.map((article) => (
            <ArticleCard
              key={article.slug.join('/')}
              href={articleHref(article)}
              article={article}
              imageComponent={ExportedImage}
            />
          ))}
        </Box>
      </Container>
    </>
  );
}
