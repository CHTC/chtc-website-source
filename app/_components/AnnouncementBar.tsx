import type { ReactNode } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import TriangleField from './TriangleField';

type AnnouncementBarProps = {
  /** Decorative icon shown before the message; it is hidden from screen readers. */
  icon: ReactNode;
  children: ReactNode;
  href: string;
  linkLabel: string;
};

/**
 * A soft halo that fades in and out around the call to action. MUI's
 * `keyframes()` only runs in client components, so it is declared in `sx`.
 */
const GLOW_KEYFRAMES = {
  '@keyframes announcement-glow': {
    '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)' },
    '50%': { boxShadow: '0 0 0 6px rgba(255, 255, 255, 0.35)' },
  },
} as const;

/**
 * Site-wide announcement strip for the top of the home page. On load a field
 * of triangles morphs behind it and fades out, then the button glows a few
 * times to draw the eye. Both stay still for visitors who ask for reduced motion.
 */
export default function AnnouncementBar({ icon, children, href, linkLabel }: AnnouncementBarProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        py: 1.25,
        px: 2,
      }}
    >
      <TriangleField />

      <Container
        maxWidth='lg'
        sx={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          textAlign: 'center',
        }}
      >
        <Box component='span' aria-hidden='true' sx={{ display: 'inline-flex' }}>
          {icon}
        </Box>
        <Typography variant='body2' component='span' sx={{ fontWeight: 600 }}>
          {children}
        </Typography>
        <Button
          href={href}
          size='small'
          variant='contained'
          sx={{
            bgcolor: 'common.white',
            color: 'primary.main',
            py: 0.25,
            '&:hover': { bgcolor: 'grey.100' },
            // Starts as the triangles fade, pulses three times, then rests.
            ...GLOW_KEYFRAMES,
            animation: 'announcement-glow 2s ease-in-out 4s 3',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          {linkLabel}
        </Button>
      </Container>
    </Box>
  );
}
