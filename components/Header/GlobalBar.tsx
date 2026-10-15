'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Button, Container, Link } from '@mui/material';

/**
 * The thin red bar above the navigation, as on the legacy site: the two
 * parent organisations on the left; on the right a link to the User Portal
 * (outside the Campus Computing section, which has its own navigation) and
 * the Request Account button.
 */
const SECTION = '/uw-research-computing';

const linkSx = {
  color: 'primary.contrastText',
  fontSize: '0.825rem',
  fontWeight: 600,
  lineHeight: '2.2rem',
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
} as const;

export default function GlobalBar() {
  const pathname = usePathname() ?? '/';
  const inSection = pathname.startsWith(SECTION);

  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
      {/* As tall as the Campus Computing section bar, so the two red bars match. */}
      <Container
        maxWidth='lg'
        sx={{ minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link href='https://cai.wisc.edu/' sx={linkSx} aria-label='UW-Madison College of Computing, Data & Information Sciences'>
            UW-Madison CAI
          </Link>
          <Link href='https://morgridge.org/' sx={linkSx} aria-label='Morgridge Institute for Research'>
            Morgridge Institute
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {!inSection && (
            <Link component={NextLink} href={`${SECTION}/user-portal/`} sx={{ ...linkSx, display: { xs: 'none', sm: 'inline' } }}>
              Go to User Portal
            </Link>
          )}
          <Button
            component={NextLink}
            href={`${SECTION}/form/`}
            size='small'
            sx={{
              bgcolor: 'common.white',
              color: 'text.primary',
              fontSize: '0.8rem',
              px: 1.25,
              py: 0.25,
              my: 0.5,
              borderRadius: 1,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Request Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
