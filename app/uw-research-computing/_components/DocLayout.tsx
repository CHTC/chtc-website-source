import { Suspense } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GuideSidebar, { type GuideMenu } from '@/components/GuideSidebar';
import type { DocHeading } from '../_lib/docs';
import { STICKY_TOP } from '../_lib/layout';
import DocSidebar from './DocSidebar';
import PageTitle from './PageTitle';
import TocNav from './TocNav';

const SIDEBAR_WIDTH = '260px';
const TOC_WIDTH = '220px';

/** A sticky side column; both the guide sidebar and the page contents use it. */
const stickySx = {
  position: 'sticky',
  top: STICKY_TOP,
  alignSelf: 'start',
  maxHeight: `calc(100vh - ${STICKY_TOP + 16}px)`,
  overflowY: 'auto',
  pt: 5,
  pb: 2,
} as const;

/**
 * A documentation page: the guide sidebar on the left (for pages that are
 * in one; a guide in both menus shows just one of them when reached with
 * `?compute-type=`, see `DocSidebar`), the title and body in the middle, and
 * the page's own headings on the right. On narrower screens the side
 * columns fold into collapsed panels above the body instead.
 */
const DocLayout = ({
  title,
  width = 'default',
  menus,
  headings,
  children,
}: {
  title: string;
  /** `narrow` is for long-form prose (the legacy `character_optimized` layout). */
  width?: 'default' | 'narrow';
  menus: GuideMenu[];
  headings: DocHeading[];
  children: React.ReactNode;
}) => {
  const hasSidebar = menus.length > 0;
  const hasToc = headings.length > 1;
  const maxWidth = width === 'narrow' ? 760 : 1000;

  const columns = (withToc: boolean) =>
    [hasSidebar && SIDEBAR_WIDTH, 'minmax(0, 1fr)', withToc && hasToc && TOC_WIDTH].filter(Boolean).join(' ');

  return (
    // `xl` rather than the site's usual `lg`: with a sidebar and the page
    // contents beside it, `lg` left the body itself only ~640px wide.
    <Container maxWidth='xl'>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: columns(false), lg: columns(true) },
          gap: { md: 5 },
        }}
      >
        {hasSidebar && (
          <Box component='aside' sx={{ ...stickySx, display: { xs: 'none', md: 'block' } }}>
            <Suspense fallback={<GuideSidebar menus={menus} />}>
              <DocSidebar menus={menus} />
            </Suspense>
          </Box>
        )}
        <Box sx={{ maxWidth, width: '100%', mx: hasSidebar ? 0 : 'auto' }}>
          <PageTitle>{title}</PageTitle>
          {hasSidebar && (
            <Accordion
              disableGutters
              sx={{ display: { xs: 'block', md: 'none' }, mb: 2, '&::before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600 }}>Browse guides</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                <Suspense fallback={<GuideSidebar menus={menus} />}>
                  <DocSidebar menus={menus} />
                </Suspense>
              </AccordionDetails>
            </Accordion>
          )}
          {hasToc && (
            <Accordion
              disableGutters
              sx={{ display: { xs: 'block', lg: 'none' }, mb: 3, '&::before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600 }}>On this page</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                <TocNav headings={headings} />
              </AccordionDetails>
            </Accordion>
          )}
          {children}
        </Box>
        {hasToc && (
          <Box component='aside' sx={{ ...stickySx, display: { xs: 'none', lg: 'block' } }}>
            <TocNav headings={headings} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DocLayout;
