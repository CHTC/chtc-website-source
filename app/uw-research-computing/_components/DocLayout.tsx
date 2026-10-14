import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GuideSidebar, { type GuideMenu } from '@/components/GuideSidebar';
import PageTitle from './PageTitle';

/** Content width per legacy layout (`mw-1000` ≈ 1000px, `character_optimized` narrower). */
const MAX_WIDTH: Record<string, number> = {
  character_optimized: 760,
};

/**
 * A documentation page: the title, the body, and — for the legacy `guide`
 * and `hpc_layout` documents tagged `htc`/`hpc` — the guide sidebar. On a
 * phone the sidebar folds into a collapsed "Browse guides" panel above the
 * body instead.
 */
const DocLayout = ({
  title,
  layout,
  menus,
  children,
}: {
  title: string;
  layout: string;
  menus: GuideMenu[];
  children: React.ReactNode;
}) => {
  const hasSidebar = menus.length > 0;
  const width = MAX_WIDTH[layout] ?? 1000;

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
            <GuideSidebar menus={menus} />
          </Box>
        )}
        <Box sx={{ maxWidth: width, width: '100%', mx: hasSidebar ? 0 : 'auto' }}>
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
                <GuideSidebar menus={menus} />
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
