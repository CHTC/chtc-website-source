import { Box } from '@mui/material';

/**
 * The news listing and every article page share one `<main>` landmark; the
 * root layout renders the header and footer around it, and `flexGrow`
 * pushes the footer to the bottom of short pages.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box component='main' sx={{ flexGrow: 1, pb: 6 }}>
      {children}
    </Box>
  );
}
