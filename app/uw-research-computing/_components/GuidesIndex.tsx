import { Box, Container, Link, List, ListItem, Paper, Typography } from '@mui/material';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { GuideIcon, type MenuLink, type MenuSection } from '@/components/GuideSidebar';
import { SCROLL_MARGIN, STICKY_TOP } from '../_lib/layout';
import PageTitle from './PageTitle';

/** Jekyll's `slugify`: the section anchors the legacy pages linked to. */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const Links = ({ links, depth = 0 }: { links: MenuLink[]; depth?: number }) => (
  <List disablePadding sx={{ ml: depth ? 3 : 0, borderLeft: depth ? 1 : 0, borderColor: 'divider' }}>
    {links.map((link, index) => (
      <ListItem key={`${link.text}-${index}`} disablePadding sx={{ display: 'block' }}>
        {link.url ? (
          <Link
            href={link.url}
            underline='hover'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {link.icon && <GuideIcon name={link.icon} fontSize='small' color='action' />}
            {link.text}
          </Link>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              bgcolor: 'action.selected',
              fontWeight: 600,
            }}
          >
            <FolderOutlinedIcon fontSize='small' />
            {link.text}
          </Box>
        )}
        {link.links && <Links links={link.links} depth={depth + 1} />}
      </ListItem>
    ))}
  </List>
);

/**
 * `/uw-research-computing/htc/guides/` and `/hpc/guides/`: every section of a
 * guide menu as a card of links, with a sticky jump list beside them on wide
 * screens (legacy `htc/guides.html`, `components/guide-section.liquid`).
 */
const GuidesIndex = ({ title, sections }: { title: string; sections: MenuSection[] }) => (
  <Container maxWidth='lg'>
    <PageTitle>{title}</PageTitle>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
        gap: 4,
      }}
    >
      <Box>
        {sections.map((section) => (
          <Paper key={section.text} variant='outlined' sx={{ mb: 4, overflow: 'hidden' }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', px: 2, py: 1.5 }}>
              <Typography
                component='h2'
                variant='h5'
                id={slugify(section.text)}
                sx={{ display: 'flex', alignItems: 'center', gap: 1, m: 0, scrollMarginTop: `${SCROLL_MARGIN}px` }}
              >
                <GuideIcon name={section.icon} />
                {section.text}
              </Typography>
            </Box>
            <Links links={section.links} />
          </Paper>
        ))}
      </Box>
      <Box data-pagefind-ignore sx={{ display: { xs: 'none', lg: 'block' } }}>
        <Box sx={{ position: 'sticky', top: STICKY_TOP }}>
          <Typography component='h2' variant='h6' sx={{ mb: 1 }}>
            Guide Sections
          </Typography>
          <List disablePadding sx={{ borderLeft: 1, borderColor: 'divider' }}>
            {sections.map((section) => (
              <ListItem key={section.text} disablePadding>
                <Link
                  href={`#${slugify(section.text)}`}
                  underline='hover'
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.75, color: 'text.primary' }}
                >
                  <GuideIcon name={section.icon} fontSize='small' color='action' />
                  {section.text}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  </Container>
);

export default GuidesIndex;
