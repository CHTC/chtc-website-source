import { Box, Typography } from '@mui/material';

/** The legacy `uw-mini-bar` title: a short red rule above the heading. */
const PageTitle = ({ children, component = 'h1' }: { children: React.ReactNode; component?: 'h1' | 'h2' }) => (
  <Box sx={{ mt: { xs: 3, md: 5 }, mb: 3 }}>
    <Box sx={{ width: '2rem', height: 5, bgcolor: 'primary.main', mb: 1 }} />
    <Typography
      variant={component === 'h1' ? 'h3' : 'h4'}
      component={component}
      sx={{ fontSize: component === 'h1' ? { xs: '2rem', md: '2.5rem' } : undefined }}
    >
      {children}
    </Typography>
  </Box>
);

export default PageTitle;
