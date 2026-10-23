import type { Metadata } from 'next';
import ExportedImage from 'next-image-export-optimizer';
import { Box, Button, Card, Chip, Container, Grid, Link, Paper, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { formatEventDate, formatLongDate, splitEvents } from '@chtc/web-components/content';
import { articleHref, getSiteArticles } from '@/utils/articles';
import { getSiteEvents } from '@/utils/events';
import { listingMetadata } from '@/utils/metadata';
import { siteConfig } from '@/site.config';
import FeatureRow, { FeatureText } from '@/components/FeatureRow';
import MiniBarHeading from '@/components/MiniBarHeading';
import UsageStats from './_components/UsageStats';
import FabAIDWordmark from './_components/FabAIDWordmark';
import PartnerTile from './_components/PartnerTile';

const DESCRIPTION =
  'The Center for High Throughput Computing (CHTC), established in 2006, aims to bring the power of High Throughput Computing to all fields of research, and to allow the future of HTC to be shaped by insight from all fields.';

// The home page is the site itself, so its title is the bare site name rather
// than "Home — Center for High Throughput Computing". Every title field is
// restated so the openGraph and twitter blocks stay complete.
const base = listingMetadata('Home', DESCRIPTION, '/');
export const metadata: Metadata = {
  ...base,
  title: { absolute: siteConfig.name },
  openGraph: { ...base.openGraph, title: siteConfig.name },
  twitter: { ...base.twitter, title: siteConfig.name },
};

/** The OSG Consortium's primary brand orange, from the osg-htc.org theme. */
const OSG_ORANGE = '#f6a32a';

/** The legacy article that the announcement bar points at. */
const ANNOUNCEMENT_ARTICLE = 'behind-nobel-winning-icecube-discoveries';

/**
 * The sections below the hero alternate between the page grey and white
 * bands, with a rule between them, so each reads as its own block.
 */
const SECTION_BAND_SX = {
  py: { xs: 6, md: 8 },
  borderTop: 1,
  borderColor: 'divider',
} as const;


export default async function Home() {
  const articles = (await getSiteArticles()).filter(
    (article) => article.type === 'news' || article.type === 'user'
  );
  const announcement = articles.find((a) => a.slug.at(-1) === ANNOUNCEMENT_ARTICLE);

  const news = articles.filter((a) => a.type === 'news').slice(0, 4);
  // Only `user` articles are user spotlights; the one with a banner leads.
  const spotlights = articles.filter((a) => a.type === 'user');
  const heroStory = spotlights.find((a) => a.banner_src) ?? spotlights[0] ?? null;

  const upcomingEvents = splitEvents(await getSiteEvents()).upcoming.slice(0, 3);

  return (
    <Box component='main'>
      {/* Announcement bar */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 1.25, px: 2 }}>
        <Container
          maxWidth='lg'
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            textAlign: 'center',
          }}
        >
          <EmojiEventsIcon fontSize='small' aria-hidden='true' />
          <Typography variant='body2' component='span' sx={{ fontWeight: 600 }}>
            Francis Halzen awarded the 2026 Nobel Prize, marking the 4th received by HTCondor users!
          </Typography>
          <Button
            href={announcement ? articleHref(announcement) : '/news/'}
            size='small'
            variant='contained'
            sx={{
              bgcolor: 'common.white',
              color: 'primary.main',
              py: 0.25,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Read More
          </Button>
        </Container>
      </Box>

      {/* Hero: the translational-computing graphic. It is an illustration
          with text in it, so it is shown whole at its own aspect ratio (not
          cropped to a box), with a portrait-ish version for phones.

          The optimizer's largest variant is 1200px wide, which is upscaled
          on most desktops and turns the small text to mush, so the hero is
          served `unoptimized` from the full-resolution WebPs beside the PNGs. */}
      <Box component='section' aria-label='Translational computing' sx={{ bgcolor: '#e9eaeb' }}>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <ExportedImage
            src='/images/homepage/TranslationalArrow_Desktop.webp'
            alt='From the laboratory to the community, advancing throughput computing through translational computing: a feedback loop from Laboratory, where innovation and development happen (2–5 years), to Locale, where services are deployed and operated (5–10 years), to Communities, where services enable science (10+ years).'
            width={4063}
            height={1026}
            unoptimized
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Box>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <ExportedImage
            src='/images/homepage/TranslationalArrow_Mobile.webp'
            alt='From the laboratory to the community, advancing throughput computing through translational research: Laboratory, Locale and Communities, joined by a feedback loop.'
            width={1920}
            height={661}
            unoptimized
            loading='eager'
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Box>
      </Box>

      {/* Intro */}
      <Container maxWidth='lg' sx={{ py: { xs: 5, md: 7 } }}>
        <Box sx={{ maxWidth: '80ch', mx: "auto" }}>
          {/* Sized so the name fits on one line in the 80ch column on desktop. */}
          <Typography variant='h1' sx={{ fontSize: { xs: '2.25rem', md: '2.75rem' }, mb: 3 }}>
            Center for High Throughput Computing
          </Typography>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.6, mb: 3 }}>
            The Center for High Throughput Computing (CHTC), established in 2006, aims to bring
            the power of High Throughput Computing to all fields of research, and to allow the
            future of HTC to be shaped by insight from all fields.
          </Typography>
          <Paper
            variant='outlined'
            sx={{
              p: { xs: 2.5, md: 3 },
              mb: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              borderLeft: 4,
              borderLeftColor: 'primary.main',
            }}
          >
            <Typography sx={{ flex: 1, lineHeight: 1.6 }}>
              Are you a UW-Madison researcher or educator looking to increase the impact of
              computing on your teaching or research? Contact us to explore ways to leverage the
              open computing services offered by the CHTC.
            </Typography>
            <Button
              href='/uw-research-computing/meet-with-us/'
              variant='contained'
              size='large'
              sx={{ flexShrink: 0 }}
            >
              Contact Us
            </Button>
          </Paper>
          <Typography paragraph sx={{ lineHeight: 1.7 }}>
            <Link href='/htc/'>High Throughput Computing</Link> is a collection of principles and
            techniques which maximize the effective throughput of computing resources towards a
            given problem. When applied for scientific computing, HTC can result in improved use
            of a computing resource, improved automation, and help drive the scientific problem
            forward.
          </Typography>
          <Typography paragraph sx={{ lineHeight: 1.7, mb: 0 }}>
            The team at CHTC develops technologies and services for HTC. CHTC is the home of
            the <Link href='https://htcondor.org'>HTCondor Software Suite</Link> which has over
            30 years of experience in tackling HTC problems; it manages shared computing
            resources for researchers on the UW-Madison campus; and it leads
            the <Link href='https://osg-htc.org'>OSG Consortium</Link>, a national-scale
            environment for distributed HTC.
          </Typography>
        </Box>
      </Container>

      {/* Hero story / News / Events, over the spotlight's banner image (as on osg-htc.org) */}
      <Box component='section' sx={{ position: 'relative', py: 4, bgcolor: 'background.default' }}>
        {heroStory?.banner_src && (
          // A CSS background-image would bypass the export optimizer, so the
          // banner is an image positioned behind the cards.
          <ExportedImage
            src={heroStory.banner_src}
            alt=''
            fill
            sizes='100vw'
            style={{ objectFit: 'cover' }}
          />
        )}
        <Container maxWidth='lg' sx={{ position: 'relative' }}>
          {/* Centered so there is no gap when the (conditional) columns are absent. */}
          <Grid container spacing={2} justifyContent='center'>
            {heroStory && (
              <Grid size={{ xs: 12, md: 5 }}>
                {/* Frosted panel over the banner. */}
                <Card
                  sx={{
                    height: '100%',
                    minHeight: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    color: 'common.white',
                    border: 'none',
                  }}
                >
                  <Typography variant='subtitle2'>
                    <Link href='/spotlights/' sx={{ color: 'primary.light' }}>
                      Spotlight User
                    </Link>
                  </Typography>
                  <Typography variant='h4' component='h2' gutterBottom>
                    {heroStory.title}
                  </Typography>
                  <Box sx={{ minHeight: 120 }}>
                    <Typography>{heroStory.excerpt}</Typography>
                  </Box>
                  <Button
                    href={articleHref(heroStory)}
                    variant='contained'
                    color='primary'
                    sx={{ mt: 'auto', mr: 'auto' }}
                  >
                    Read About Spotlight User
                  </Button>
                </Card>
              </Grid>
            )}

            {news.length > 0 && (
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ height: '100%', p: 2 }}>
                  <Typography variant='subtitle2' gutterBottom>
                    <Link href='/news/'>News</Link>
                  </Typography>
                  {news.map((article) => (
                    <Link
                      key={article.slug.join('-')}
                      href={articleHref(article)}
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <Box sx={{ my: 1.5, '&:hover': { color: 'primary.main' } }}>
                        <Typography variant='subtitle1' color='text.primary' lineHeight={1.2}>
                          {article.title}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {formatLongDate(article.date)}
                        </Typography>
                      </Box>
                    </Link>
                  ))}
                </Card>
              </Grid>
            )}

            {upcomingEvents.length > 0 && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: '100%', p: 2 }}>
                  <Typography variant='subtitle2' gutterBottom>
                    <Link href='/events/'>Events</Link>
                  </Typography>
                  {upcomingEvents.map((event) => (
                    <Link
                      key={event.slug.join('-')}
                      href={`/events/${event.slug.join('/')}/`}
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <Box sx={{ display: 'flex', mt: 1.5, '&:hover': { color: 'primary.main' } }}>
                        {event.banner?.path && (
                          <Box sx={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                            <ExportedImage
                              src={event.banner.path}
                              alt={event.banner.alt}
                              fill
                              // Banners are wide and cover-cropped into a square, so the
                              // painted width is ~boxHeight × aspect, well past 80px.
                              sizes='384px'
                              style={{ objectFit: 'cover', borderRadius: 4 }}
                            />
                          </Box>
                        )}
                        <Box sx={{ pl: 1 }}>
                          <Typography variant='subtitle1' color='text.primary' lineHeight={1.2}>
                            {event.title}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {formatEventDate(event.start_date, event.end_date)}
                          </Typography>
                        </Box>
                      </Box>
                    </Link>
                  ))}
                </Card>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      <UsageStats />

      {/* Technologies and methodologies */}
      <Box component='section' sx={SECTION_BAND_SX}>
        <Container maxWidth='lg'>
          <MiniBarHeading center sx={{ mb: { xs: 1, md: 2 } }}>
            Technologies and Methodologies
          </MiniBarHeading>
          <FeatureRow
            title='HTCSS'
            image={{ src: '/images/logos/CondorAlpha.png', width: 384, height: 327, alt: 'Hand drawn image of a Condor' }}
            imageFirst
            imageMaxWidth={260}
          >
            <FeatureText>
              The <Link href='https://htcondor.org'>HTCondor Software Suite (HTCSS)</Link> provides
              sites and users with the ability to manage and execute HTC workloads. Whether it’s
              managing a single laptop or 250,000 cores at CERN, HTCondor helps solve computational
              problems through the application of the HTC principles.
            </FeatureText>
          </FeatureRow>
          <FeatureRow
            title='Pelican'
            image={{ src: '/images/logos/Pelican.png', width: 6659, height: 6584, alt: 'Pelican logo' }}
            imageFirst
            imageMaxWidth={260}
          >
            <FeatureText>
              A data transfer service, <Link href='https://pelicanplatform.org'>Pelican</Link>{' '}
              facilitates the ability for researchers to access and transfer data from where it is
              stored to where it needs to run. Inspired by the 2022 White House Office of Science
              and Technology Policy (OSTP) proposition to make all government funded research data
              publicly accessible, Pelican works to efficiently transfer this open data to
              researchers who require it. Pelican provides an open-source software platform for
              federating dataset repositories together and delivering the objects to computing
              capacity such as the <Link href='https://osg-htc.org/ospool'>OSPool</Link>.
            </FeatureText>
          </FeatureRow>
          <FeatureRow
            title='Research Facilitation'
            href='/research-facilitation/'
            image={{
              src: '/images/facilitators_square.jpg',
              width: 1335,
              height: 1335,
              alt: 'A CHTC research computing facilitator working with a researcher at a laptop',
            }}
            imageFirst
            imageMaxWidth={260}
            imageBorderRadius={10}
          >
            <FeatureText>
              CHTC’s Research Facilitation team empowers researchers to utilize computing to achieve
              their goals. The Research Facilitation approach emphasizes teaching users skills and
              methodologies to manage &amp; automate workloads on resources like those at CHTC, the
              campus, or across the world.
            </FeatureText>
          </FeatureRow>
        </Container>
      </Box>

      {/* Local and national services */}
      <Box component='section' sx={{ ...SECTION_BAND_SX, bgcolor: 'background.paper' }}>
        <Container maxWidth='lg'>
          <MiniBarHeading center sx={{ mb: { xs: 1, md: 2 } }}>
            Local and National Services
          </MiniBarHeading>
          <FeatureRow
            title='Campus Computing'
            href='/uw-research-computing/'
            image={{ src: '/images/microscope.svg', width: 291, height: 406, alt: 'Microscope' }}
            imageMaxWidth={200}
          >
            <FeatureText>
              CHTC manages over 20,000 cores and dozens of GPUs for the UW-Madison campus; this
              resource, which is free and shared, aims to advance the mission of the University of
              Wisconsin in support of the Wisconsin Idea. Researchers can place their workloads on
              an access point at CHTC and utilize the resources at CHTC, across the campus, and
              across the nation.
            </FeatureText>
          </FeatureRow>
          <FeatureRow
            title='OSPool'
            href='https://osg-htc.org/services/ospool/'
            image={{ src: '/images/logos/OSPool_Logo.png', width: 3544, height: 3530, alt: 'OSPool logo' }}
            imageMaxWidth={240}
          >
            <FeatureText>
              The <Link href='https://osg-htc.org/services/ospool/'>Open Science Pool (OSPool)</Link>{' '}
              is a source of computing capacity accessible to any researcher affiliated with a US
              academic institution, with no proposal, no allocation and no cost. Operated by CHTC
              as part of the OSG Consortium, the OSPool provides fair-share access to compute and
              storage capacity contributed by university campuses and government-supported
              supercomputing institutions across the nation.
            </FeatureText>
            <Chip
              label='Operated by the CHTC via the OSG Consortium'
              size='small'
              sx={{ mt: 2, bgcolor: OSG_ORANGE, color: 'common.black', fontWeight: 600 }}
            />
          </FeatureRow>
          <FeatureRow
            title='OSDF'
            href='https://osg-htc.org/services/osdf/'
            image={{ src: '/images/logos/OSDF_Logo.png', width: 3504, height: 3502, alt: 'OSDF logo' }}
            imageMaxWidth={240}
          >
            <FeatureText>
              The <Link href='https://osg-htc.org/services/osdf/'>Open Science Data Federation (OSDF)</Link>{' '}
              connects disparate dataset repositories into a single, nation-wide data distribution
              network. Built on Pelican and operated by CHTC, the OSDF lets users and institutions
              share data files and storage capacity, delivering datasets to browsers, Jupyter
              notebooks and HTC environments such as the OSPool.
            </FeatureText>
            <Chip
              label='Operated by the CHTC via the OSG Consortium'
              size='small'
              sx={{ mt: 2, bgcolor: OSG_ORANGE, color: 'common.black', fontWeight: 600 }}
            />
          </FeatureRow>
        </Container>
      </Box>

      {/* Projects and partners */}
      <Box component='section' sx={SECTION_BAND_SX}>
        <Container maxWidth='lg'>
          <Typography variant='h6' component='h2' sx={{ mb: 2, color: 'text.secondary' }}>
            Supporting Institutions
          </Typography>
          <Grid container spacing={2}>
            {INSTITUTIONS.map(({ text, ...institution }) => (
              <Grid key={institution.title} size={{ xs: 12, md: 6 }}>
                <PartnerTile {...institution} logoHeight={64}>
                  {text}
                </PartnerTile>
              </Grid>
            ))}
          </Grid>

          <Typography variant='h6' component='h2' sx={{ mt: { xs: 4, md: 6 }, mb: 2, color: 'text.secondary' }}>
            Projects and Partners
          </Typography>
          <Grid container spacing={2}>
            {PROJECTS.map(({ text, ...project }) => (
              <Grid key={project.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <PartnerTile {...project}>{text}</PartnerTile>
              </Grid>
            ))}
            {PARTNERS.map((partner) => (
              <Grid key={partner.title} size={{ xs: 6, md: 3 }}>
                <PartnerTile {...partner} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

/** The two institutions CHTC sits within, shown as a pair of wide cards. */
const INSTITUTIONS = [
  {
    title: 'University of Wisconsin–Madison',
    href: 'https://www.wisc.edu/',
    image: { src: '/images/logos/UW_Logo.svg', width: 598, height: 201, alt: 'University of Wisconsin–Madison logo' },
    text:
      'CHTC is a research computing center of the University of Wisconsin–Madison, hosted in the College of AI. Its services are free to all UW-Madison researchers, advancing the mission of the University in support of the Wisconsin Idea.',
  },
  {
    title: 'Morgridge Institute for Research',
    href: 'https://morgridge.org/',
    image: { src: '/images/logos/Morgridge_Logo.svg', width: 204, height: 70, alt: 'Morgridge Institute for Research logo' },
    text:
      'The Morgridge Institute for Research is a private, biomedical research institute located on the UW-Madison campus. Morgridge’s Research Computing Theme is a unique partner with CHTC, investing in the vision of HTC and its ability to advance research in other domains.',
  },
];

/** Projects CHTC leads or co-leads, with a short description each. */
const PROJECTS = [
  {
    title: 'PATh',
    href: 'https://path-cc.io/',
    image: { src: '/images/logos/PATh_Logo.png', width: 300, height: 300, alt: 'PATh logo' },
    text:
      'The Partnership to Advance Throughput Computing (PATh) brings together organizations and projects committed to address the needs of the rapidly growing community of faculty and students who are embracing Distributed High Throughput Computing (dHTC) technologies and services to advance their research.',
  },
  {
    title: 'FabAID',
    href: 'https://fabaid.io/',
    logo: <FabAIDWordmark size={64} />,
    text:
      'FabAID is a national fabric of open data services for data-intensive and AI-driven research, operated by CHTC. It builds on the OSDF and Pelican to make research datasets available wherever the computing is.',
  },
  {
    title: 'OSG',
    href: 'https://osg-htc.org/',
    image: { src: '/images/logos/OSG-logo.svg', width: 336, height: 224, alt: 'OSG logo' },
    text:
      'The OSG Consortium brings together research collaborations, campuses, national laboratories and software providers to advance open science through distributed High Throughput Computing. CHTC has been a major force in OSG since its inception in 2005.',
  },
];

/** Further partners, shown as logo-and-name tiles. */
const PARTNERS = [
  {
    title: 'xDD',
    href: 'https://xdd.wisc.edu/',
    image: { src: '/images/logos/xDD_Logo.svg', width: 512, height: 351, alt: 'xDD logo' },
  },
  {
    title: 'IRIS-HEP',
    href: 'https://iris-hep.org/',
    image: { src: '/images/logos/IRIS-HEP_Logo.png', width: 117, height: 117, alt: 'IRIS-HEP logo' },
  },
  {
    title: 'BMRB',
    href: 'https://bmrb.io/',
    image: { src: '/images/logos/BMRB_Logo.svg', width: 964, height: 953, alt: 'BMRB logo' },
  },
  {
    title: 'Pegasus',
    href: 'https://pegasus.isi.edu/',
    image: { src: '/images/logos/Pegasus_Logo.png', width: 294, height: 207, alt: 'Pegasus logo' },
  },
];
