import { Box } from '@mui/material';
import SectionNav from './_components/SectionNav';
import { sectionNav } from './_lib/docs';

/**
 * Every UW Research Computing page — the section home, the user portal and
 * the documentation — carries the section's own navigation under the global
 * header, as the legacy site did with its second navbar.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SectionNav items={sectionNav()} />
      <Box component='main' id='main' sx={{ flexGrow: 1, pb: 6 }}>
        {children}
      </Box>
    </>
  );
}
