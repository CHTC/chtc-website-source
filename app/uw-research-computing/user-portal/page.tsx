import { Box, Button, Container, Link, List, ListItem, Paper, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { listingMetadata } from '@/utils/metadata';
import PageTitle from '../_components/PageTitle';
import ResourceIcon from '../_components/ResourceIcon';
import { normalizeUrl, readYaml, SECTION } from '../_lib/docs';
import { learningResources } from '../_lib/learningResources';

export const metadata = listingMetadata(
  'User Portal',
  'Everything CHTC users need in one place: HTC and HPC guides, featured learning resources, interactive computing, support, events and policies.',
  `${SECTION}/user-portal/`
);

interface PortalLink {
  text: string;
  url: string;
  icon?: string;
  description?: string;
}

interface PortalSection {
  name: string;
  large?: boolean;
  links?: PortalLink[];
  /** `learning-resources`: cards come from the featured learning resources. */
  source?: string;
  limit?: number;
  more?: { text: string; url: string };
}

/** Cards for one section, as the legacy Liquid loop chose them. */
function sectionLinks(section: PortalSection): PortalLink[] {
  if (section.source === 'learning-resources') {
    const all = learningResources();
    const featured = all.filter((r) => r.featured);
    // Featured first; if nothing is featured, the most recently updated.
    const pool = featured.length > 0 ? featured : all;
    return pool.slice(0, section.limit ?? 3).map((r) => ({
      text: r.text,
      url: r.url,
      icon: r.icon,
      description: r.description,
    }));
  }
  return section.links ?? [];
}

const PortalCard = ({ link }: { link: PortalLink }) => (
  <Paper
    variant='outlined'
    component='a'
    href={normalizeUrl(link.url)}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 1,
      p: 3,
      height: '100%',
      textDecoration: 'none',
      color: 'text.primary',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      '&:hover': { borderColor: 'primary.main', boxShadow: '0 8px 24px rgba(31, 39, 51, 0.08)' },
    }}
  >
    <ResourceIcon icon={link.icon ?? 'Link'} size={26} />
    <Typography component='span' sx={{ fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.3 }}>
      {link.text}
    </Typography>
    {link.description && (
      <Typography variant='body2' color='text.secondary'>
        {link.description}
      </Typography>
    )}
  </Paper>
);

/**
 * The CHTC User Portal (legacy `user-portal.html`): card sections from
 * `menus/user-portal-sections.yaml` — one of them filled from the featured
 * learning resources — beside a link column from `menus/user-portal-menu.yaml`.
 */
export default function Page() {
  const sections = readYaml<PortalSection[]>('menus/user-portal-sections.yaml');
  const menu = readYaml<{ name: string; links: { text: string; url: string }[] }[]>(
    'menus/user-portal-menu.yaml'
  );

  return (
    <Container maxWidth='lg'>
      <PageTitle>User Portal</PageTitle>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
          gap: 4,
        }}
      >
        <Box>
          {sections.map((section) => (
            <Box component='section' key={section.name} sx={{ mb: 5 }}>
              <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', px: 2, py: 1.25, borderRadius: 2 }}>
                <Typography component='h2' variant='h5' sx={{ m: 0 }}>
                  {section.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'minmax(0, 1fr)',
                    sm: section.large ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
                  },
                  gap: 2,
                  mt: 2,
                }}
              >
                {sectionLinks(section).map((link) => (
                  <PortalCard key={link.text} link={link} />
                ))}
              </Box>
              {section.more && (
                <Button
                  href={normalizeUrl(section.more.url) ?? '#'}
                  variant='outlined'
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mt: 2 }}
                >
                  {section.more.text}
                </Button>
              )}
            </Box>
          ))}
        </Box>

        <Box component='aside'>
          {menu.map((group) => (
            <Box key={group.name} sx={{ mb: 4 }}>
              <Typography component='h2' variant='h6' sx={{ mb: 1 }}>
                {group.name}
              </Typography>
              <Paper variant='outlined'>
                <List disablePadding>
                  {group.links.map((link, index) => (
                    <ListItem key={link.url} disablePadding divider={index < group.links.length - 1}>
                      <Link
                        href={normalizeUrl(link.url)}
                        underline='none'
                        sx={{
                          display: 'block',
                          width: '100%',
                          px: 2,
                          py: 1.25,
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
                        }}
                      >
                        {link.text}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
