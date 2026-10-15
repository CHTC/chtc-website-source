import { Suspense } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GuideSidebar, { type GuideMenu } from '@/components/GuideSidebar';
import DocSidebar from './DocSidebar';
import PageTitle from './PageTitle';


/**
 * A documentation page: the title, the body, and — for the legacy `guide`
 * and `hpc_layout` documents tagged `htc`/`hpc` — the guide sidebar. On a
 * phone the sidebar folds into a collapsed "Browse guides" panel above the
 * body instead. A guide in both menus shows just one of them when reached
 * with `?compute-type=`; see `DocSidebar`.
 */
const DocLayout = ({
  title,
  width = 'default',
  menus,
  children,
}: {
  title: string;
  /** `narrow` is for long-form prose (the legacy `character_optimized` layout). */
  width?: 'default' | 'narrow';
  menus: GuideMenu[];
  children: React.ReactNode;
}) => {
  const hasSidebar = menus.length > 0;
  const maxWidth = width === 'narrow' ? 760 : 1000;

  return (
    <Container maxWidth='lg'>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: hasSidebar ? '260px minmax(0, 1fr)' : 'minmax(0, 1fr)' },
          gap: { md: 5 },
        }}
      >
        {hasSidebar && (
          <Box
            component='aside'
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'sticky',
              top: 80,
              alignSelf: 'start',
              maxHeight: 'calc(100vh - 96px)',
              overflowY: 'auto',
              pt: 5,
              pb: 2,
            }}
          >
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
              sx={{ display: { xs: 'block', md: 'none' }, mb: 3, '&::before': { display: 'none' } }}
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
          {children}
        </Box>
      </Box>
    </Container>
  );
};

export default DocLayout;
