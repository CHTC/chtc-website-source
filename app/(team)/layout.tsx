import { Box } from '@mui/material';

/**
 * The people, jobs, fellowships and research pages share
 * one `<main>` landmark; the root layout renders the header and footer around
 * it, and `flexGrow` pushes the footer to the bottom of short pages. The
 * `(team)` group only collects them so they can share `_components` and
 * `_lib`; it adds nothing to their URLs.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box component='main' sx={{ flexGrow: 1, pb: 6 }}>
      {children}
    </Box>
  );
}
