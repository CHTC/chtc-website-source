import { Box } from '@mui/material';

/**
 * The presentations listing and every presentation page share one `<main>`
 * landmark; `flexGrow` pushes the footer to the bottom of short pages.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box component='main' sx={{ flexGrow: 1, pb: 6 }}>
      {children}
    </Box>
  );
}
