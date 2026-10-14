import { Box, Typography } from '@mui/material';
import type { ComponentProps, ReactNode } from 'react';

/**
 * A heading with the short red rule above it — the legacy site's
 * `uw-mini-bar`, which marked every section and card title on these pages.
 */
export default function MiniBarHeading({
  children,
  component = 'h2',
  variant = 'h4',
  id,
  sx,
}: {
  children: ReactNode;
  component?: 'h1' | 'h2' | 'h3';
  variant?: ComponentProps<typeof Typography>['variant'];
  id?: string;
  sx?: ComponentProps<typeof Box>['sx'];
}) {
  return (
    <Box id={id} sx={{ mt: 5, mb: 2, scrollMarginTop: 96, ...sx }}>
      <Box
        sx={{ width: '2.5rem', height: 4, bgcolor: 'primary.main', borderRadius: 2, mb: 1 }}
      />
      <Typography variant={variant} component={component}>
        {children}
      </Typography>
    </Box>
  );
}
