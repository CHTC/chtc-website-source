import { Box, Grid, Link, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentPage from '@/components/ContentPage';
import { listingMetadata } from '@/utils/metadata';

export const metadata = listingMetadata(
  'About',
  'CHTC develops technologies and services for High Throughput Computing: home of the HTCondor Software Suite, shared computing for UW-Madison researchers, and a leader of the OSG Consortium.',
  '/about/'
);

/** The legacy page's side navigation. */
const SECTIONS = [
  { label: 'Our Approach', href: '/approach/' },
  { label: 'What is HTC?', href: '/htc/' },
  { label: 'Our Customers', href: '/projects/' },
  { label: 'Staff', href: '/people/' },
  { label: 'Open Positions', href: '/jobs/' },
  { label: 'Internships', href: '/internships/' },
];

export default function Page() {
  return (
    <ContentPage title='About'>
      <Typography paragraph sx={{ lineHeight: 1.7 }}>
        <Link href='/htc/'>High Throughput Computing</Link> is a collection of principles and
        techniques which maximize the effective throughput of computing resources towards a given
        problem. When applied for scientific computing, HTC can result in improved use of a
        computing resource, improved automation, and help drive the scientific problem forward.
      </Typography>
      <Typography paragraph sx={{ lineHeight: 1.7 }}>
        The team at CHTC develops technologies and services for HTC. CHTC is the home of
        the <Link href='https://htcondor.org'>HTCondor Software Suite</Link> which has over 30
        years of experience in tackling HTC problems; it manages shared computing resources for
        researchers on the UW-Madison campus; and it leads
        the <Link href='https://osg-htc.org'>OSG Consortium</Link>, a national-scale environment
        for distributed HTC.
      </Typography>

      <Box component='nav' aria-label='About CHTC' sx={{ mt: 5 }}>
        <Grid container spacing={2} component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {SECTIONS.map((section) => (
            <Grid key={section.href} size={{ xs: 12, sm: 6 }} component='li'>
              <Box
                component='a'
                href={section.href}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2.5,
                  py: 2,
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'border-color .15s ease, color .15s ease',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                }}
              >
                {section.label}
                <ArrowForwardIcon fontSize='small' aria-hidden='true' />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ContentPage>
  );
}
