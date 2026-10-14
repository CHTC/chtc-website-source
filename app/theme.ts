'use client';

import NextLink from 'next/link';
import { createTheme, type Theme } from '@mui/material/styles';
import { chtcTheme as baseTheme } from '@chtc/web-components/themes';

/**
 * The UW brand red the legacy site used for its primary surfaces, and the
 * near-black it paired with it. Both are already the brand theme's primary
 * and secondary; they are restated here so page code can reference them by
 * name instead of re-typing hex literals.
 */
export const BRAND_RED = '#B61F24';
export const BRAND_DARK = '#1f2733';

/**
 * Presentation layer built on top of the CHTC brand theme
 * (`@chtc/web-components/themes`). The palette, fonts and the
 * `LinkComponent: NextLink` default come from the base; this layer adds a
 * contemporary type scale, softer surfaces and rounded shapes so every MUI
 * component site-wide picks them up. Extend, never replace: the base theme is
 * what the shared content components (article, event, staff cards) are
 * styled against.
 */
const theme = createTheme(baseTheme, {
  shape: { borderRadius: 12 },
  palette: {
    primary: { contrastText: '#ffffff' },
    background: {
      default: '#f7f8fa',
      paper: '#ffffff',
    },
    divider: 'rgba(31, 39, 51, 0.10)',
  },
  typography: {
    h1: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.08 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.12 },
    h3: { fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.18 },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700, letterSpacing: '0.01em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiLink: {
      // Underline only on hover (not persistently) so links read cleanly.
      defaultProps: { underline: 'hover' },
    },
    MuiButtonBase: {
      // Route any `<Button href>` / `<IconButton href>` / clickable
      // ButtonBase through next/link so internal links navigate client-side.
      // Set via the theme (not a per-call `component` prop) so it also works
      // from Server Components without passing a function across the RSC
      // boundary. External/mailto hrefs fall back to a normal anchor.
      defaultProps: { LinkComponent: NextLink },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: '1.15rem' },
        sizeLarge: { paddingInline: '1.6rem', paddingBlock: '0.7rem' },
        containedPrimary: ({ theme }: { theme: Theme }) => ({
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }),
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          borderRadius: 16,
          border: `1px solid ${theme.palette.divider}`,
          transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 32px rgba(31, 39, 51, 0.10)',
            borderColor: 'transparent',
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 16 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: '0.8rem', borderRadius: 8, paddingInline: '0.6rem' },
      },
    },
  },
});

export default theme;
