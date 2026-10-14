import type { Metadata } from 'next';
import ExportedImage from 'next-image-export-optimizer';
import { Box, Button, Container, Grid, Link, Paper, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
  ArticleCard,
  EventCard,
  splitEvents,
} from '@chtc/web-components/content';
import { articleHref, getSiteArticles } from '@/utils/articles';
import { getSiteEvents } from '@/utils/events';
import { listingMetadata } from '@/utils/metadata';
import { siteConfig } from '@/site.config';
import FeatureRow, { FeatureText } from '@/components/FeatureRow';
import MiniBarHeading from '@/components/MiniBarHeading';
import UsageStats from './_components/UsageStats';
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

/** The legacy article that the announcement bar points at. */
const ANNOUNCEMENT_ARTICLE = 'behind-nobel-winning-icecube-discoveries';


export default async function Home() {
  const articles = (await getSiteArticles()).filter(
    (article) => article.type === 'news' || article.type === 'user'
  );
  const latest = articles.slice(0, 3);
  const announcement = articles.find((a) => a.slug.at(-1) === ANNOUNCEMENT_ARTICLE);

  const nextEvent = splitEvents(await getSiteEvents()).upcoming[0];

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
          cropped to a box), with a portrait-ish version for phones. */}
      <Box component='section' aria-label='Translational computing' sx={{ bgcolor: '#e9eaeb' }}>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <ExportedImage
            src='/images/homepage/TranslationalArrow_Desktop.png'
            alt='From the laboratory to the community, advancing throughput computing through translational computing: a feedback loop from Laboratory, where innovation and development happen (2–5 years), to Locale, where services are deployed and operated (5–10 years), to Communities, where services enable science (10+ years).'
            width={4063}
            height={1026}
            sizes='100vw'
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Box>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <ExportedImage
            src='/images/homepage/TranslationalArrow_Mobile.png'
            alt='From the laboratory to the community, advancing throughput computing through translational research: Laboratory, Locale and Communities, joined by a feedback loop.'
            width={1920}
            height={661}
            sizes='100vw'
            loading='eager'
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Box>
      </Box>

      {/* Intro + upcoming event */}
      <Container maxWidth='lg' sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={{ xs: 12, md: nextEvent ? 8 : 12 }}>
            <Typography variant='h1' sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, mb: 3 }}>
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
          </Grid>
          {nextEvent && (
            // Top-aligned so the card keeps its own height instead of
            // stretching to the intro column's.
            <Grid size={{ xs: 12, md: 4 }} sx={{ alignSelf: 'flex-start' }}>
              <MiniBarHeading variant='h5'>Upcoming Events</MiniBarHeading>
              <EventCard
                href={`/events/${nextEvent.slug.join('/')}/`}
                event={nextEvent}
                imageComponent={ExportedImage}
              />
            </Grid>
          )}
        </Grid>
      </Container>

      {/* News */}
      {latest.length > 0 && (
        <Box component='section' sx={{ bgcolor: 'grey.100', py: { xs: 5, md: 7 } }}>
          <Container maxWidth='lg'>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                mb: 1,
              }}
            >
              <MiniBarHeading>News</MiniBarHeading>
              <Button href='/news/' variant='outlined' sx={{ mb: 3 }}>
                All news
              </Button>
            </Box>
            <Grid container spacing={3}>
              {latest.map((article) => (
                <Grid key={article.slug.join('/')} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ArticleCard
                    href={articleHref(article)}
                    article={article}
                    imageComponent={ExportedImage}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      <UsageStats />

      {/* Technologies and services */}
      <Container maxWidth='lg' sx={{ pb: { xs: 4, md: 6 } }}>
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
          title='Services'
          image={{ src: '/images/microscope.svg', width: 291, height: 406, alt: 'Microscope' }}
          imageMaxWidth={200}
        >
          <Typography variant='h6' component='h3' sx={{ mb: 1 }}>
            <Link href='/uw-research-computing/'>UW Research Computing</Link>
          </Typography>
          <FeatureText>
            CHTC manages over 20,000 cores and dozens of GPUs for the UW-Madison campus; this
            resource, which is free and shared, aims to advance the mission of the University of
            Wisconsin in support of the Wisconsin Idea. Researchers can place their workloads on
            an access point at CHTC and utilize the resources at CHTC, across the campus, and
            across the nation.
          </FeatureText>
          <Typography variant='h6' component='h3' sx={{ mt: 3, mb: 1 }}>
            <Link href='/research-facilitation/'>Research Facilitation</Link>
          </Typography>
          <FeatureText>
            CHTC’s Research Facilitation team empowers researchers to utilize computing to achieve
            their goals. The Research Facilitation approach emphasizes teaching users skills and
            methodologies to manage &amp; automate workloads on resources like those at CHTC, the
            campus, or across the world.
          </FeatureText>
        </FeatureRow>
      </Container>

      {/* Projects and partners */}
      <Box component='section' sx={{ bgcolor: 'grey.100', py: { xs: 6, md: 8 } }}>
        <Container maxWidth='lg'>
          <Typography
            variant='h5'
            component='h2'
            sx={{ textAlign: 'center', maxWidth: '50ch', mx: 'auto', mb: { xs: 2, md: 4 } }}
          >
            As part of its many services to UW-Madison and beyond, the CHTC is home to or supports
            the following Research Projects and Partners.
          </Typography>
          <FeatureRow
            title='Morgridge Institute for Research'
            href='https://morgridge.org/'
            image={{ src: '/images/logos/Morgridge_Logo.svg', width: 204, height: 70, alt: 'Morgridge Logo' }}
          >
            <FeatureText>
              The Morgridge Institute for Research is a private, biomedical research institute
              located on the UW-Madison campus. Morgridge’s Research Computing Theme is a unique
              partner with CHTC, investing in the vision of HTC and its ability to advance basic
              research.
            </FeatureText>
          </FeatureRow>
          <FeatureRow
            title='PATh'
            href='https://path-cc.io/'
            image={{ src: '/images/logos/PATh_Logo.png', width: 300, height: 300, alt: 'PATh Logo' }}
            imageFirst
            imageMaxWidth={192}
          >
            <FeatureText>
              The Partnership to Advance Throughput Computing (PATh) is a partnership between CHTC
              and OSG to advance throughput computing. Funded through a major investment from NSF,
              PATh helps advance HTC at a national level through support for HTCSS and provides a
              fabric of services for the NSF science and engineering community to access
              resources across the nation.
            </FeatureText>
          </FeatureRow>
          <FeatureRow
            title='OSG'
            href='https://osg-htc.org'
            image={{ src: '/images/logos/OSG-logo.svg', width: 336, height: 224, alt: 'OSG Logo' }}
            imageMaxWidth={240}
          >
            <FeatureText>
              The OSG is a consortium of research collaborations, campuses, national laboratories
              and software providers dedicated to the advancement of all of open science via the
              practice of distributed High Throughput Computing (dHTC), and the advancement of its
              state of the art. The OSG operates a fabric of dHTC services for the national
              science and engineering community and CHTC has been a major force in OSG since its
              inception in 2005.
            </FeatureText>
          </FeatureRow>
          <Grid container spacing={2} sx={{ mt: 2 }}>
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
