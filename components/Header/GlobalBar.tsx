// A client component because the buttons pass `NextLink` (a function) to MUI's
// `component` prop, which a server component cannot hand to a client one.
'use client';

import NextLink from 'next/link';
import { Box, Button, Container, Link } from '@mui/material';

/**
 * The thin red bar above the navigation, as on the legacy site: the two
 * parent organisations on the left; on the right the Talk to Us and Request
 * Account buttons.
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

const buttonSx = {
  bgcolor: 'common.white',
  color: 'text.primary',
  fontSize: '0.8rem',
  px: 1.25,
  py: 0.25,
  my: 0.5,
  borderRadius: 1,
  whiteSpace: 'nowrap',
  '&:hover': { bgcolor: 'grey.100' },
} as const;

export default function GlobalBar() {
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
          {/* Hidden on phones, where it would crowd the bar; the menu has it under About. */}
          <Button
            component={NextLink}
            href='/talk-to-us/'
            size='small'
            sx={{ ...buttonSx, display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Talk to Us
          </Button>
          <Button component={NextLink} href={`${SECTION}/form/`} size='small' sx={buttonSx}>
            Request Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
