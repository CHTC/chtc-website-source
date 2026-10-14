import type { ElementType, ReactNode } from 'react';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';

type MiniBarHeadingProps = {
  children: ReactNode;
  component?: ElementType;
  variant?: 'h2' | 'h3' | 'h4' | 'h5';
  /** Centre the bar and the text (section headings) instead of left-aligning. */
  center?: boolean;
  sx?: SxProps<Theme>;
};

/**
 * A heading with the short brand-red bar above it — the legacy site's
 * `uw-mini-bar` class, which marked every section and page title.
 */
export default function MiniBarHeading({
  children,
  component = 'h2',
  variant = 'h4',
  center = false,
  sx,
}: MiniBarHeadingProps) {
  return (
    <Box
      sx={[
        { mb: 3, textAlign: center ? 'center' : 'left' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          width: '2.5rem',
          height: 4,
          borderRadius: 2,
          bgcolor: 'primary.main',
          mb: 1.5,
          mx: center ? 'auto' : 0,
        }}
      />
      <Typography variant={variant} component={component}>
        {children}
      </Typography>
    </Box>
  );
}
