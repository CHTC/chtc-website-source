import type { ReactNode } from 'react';
import { Box, Button as MuiButton, Paper, Typography } from '@mui/material';

/*
 * The building blocks the documentation MDX is written with. They replace
 * the kramdown wrapper classes (`{:.term}`, `{:.tip}`, …) and the Bootstrap
 * grid markup the Jekyll site used; each is a plain server component.
 */

const ACCENT = '#b70101';
const TIP_BG = '#f9e6e7';

/** A callout box, optionally with a title bar. */
export const Tip = ({ header, children }: { header?: string; children: ReactNode }) => (
  <Box
    component='aside'
    sx={{
      my: 2.5,
      border: 2,
      borderColor: ACCENT,
      borderRadius: 1,
      overflow: 'hidden',
      bgcolor: 'background.paper',
    }}
  >
    {header && (
      <Typography
        component='div'
        sx={{ px: 2, py: 1, bgcolor: TIP_BG, color: ACCENT, fontWeight: 700, fontSize: '1.05rem' }}
      >
        {header}
      </Typography>
    )}
    <Box sx={{ px: 2, py: 1.5, '& > :last-child': { mb: 0 } }}>{children}</Box>
  </Box>
);

/** A code block showing a terminal session: dark, no left rule. */
export const Terminal = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      '& pre': { bgcolor: '#484848', color: '#f0f0f0', borderLeft: 0, borderRadius: 1 },
      '& pre code': { color: '#f0f0f0' },
      '& .hljs-keyword, & .hljs-built_in': { color: '#ffab70' },
      '& .hljs-string, & .hljs-regexp': { color: '#9ecbff' },
      '& .hljs-variable, & .hljs-number, & .hljs-literal, & .hljs-attr': { color: '#79b8ff' },
      '& .hljs-comment': { color: '#b0b8c1' },
    }}
  >
    {children}
  </Box>
);

/** A code block showing a file's contents: blue left rule. */
export const File = ({ children }: { children: ReactNode }) => (
  <Box sx={{ '& pre': { borderLeftColor: '#0d4f8b' } }}>{children}</Box>
);

/** A command reference table: the first two columns get room. */
export const CommandTable = ({ children }: { children: ReactNode }) => (
  <Box sx={{ '& td:nth-of-type(1)': { minWidth: '33%' }, '& td:nth-of-type(2)': { minWidth: '40%' } }}>
    {children}
  </Box>
);

/** The UW-style short red bar above the heading inside. */
export const MiniBar = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      '& > :is(h2, h3, h4, h5)::before': {
        content: '""',
        display: 'block',
        width: '2rem',
        height: 5,
        mb: 1,
        bgcolor: 'primary.main',
      },
    }}
  >
    {children}
  </Box>
);

/** A note beneath a table. */
export const Footnote = ({ children }: { children: ReactNode }) => (
  <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1, mb: 3 }}>
    {children}
  </Typography>
);

/** A call-to-action link. */
export const Button = ({ href, children }: { href: string; children: ReactNode }) => (
  <MuiButton href={href} variant='contained' color='primary' sx={{ m: 0.5 }}>
    {children}
  </MuiButton>
);

/** Centred row of Buttons. */
export const ButtonRow = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, my: 3 }}>
    {children}
  </Box>
);

/** Side-by-side columns that stack on phones. */
export const Columns = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, my: 2 }}>{children}</Box>
);

export const Column = ({
  accent,
  width,
  align,
  children,
}: {
  /** A red rule down the left side. */
  accent?: boolean;
  /** Fixed share of the row, e.g. `30%`; otherwise the columns share it equally. */
  width?: string;
  align?: 'center';
  children: ReactNode;
}) => (
  <Box
    sx={{
      flex: width ? { xs: '1 1 100%', sm: `0 0 calc(${width} - 12px)` } : '1 1 16rem',
      minWidth: 0,
      pl: accent ? 2.5 : 0,
      borderLeft: accent ? 5 : 0,
      borderLeftStyle: 'solid',
      borderColor: 'primary.main',
      textAlign: align,
      '& > :first-child': { mt: 0 },
    }}
  >
    {children}
  </Box>
);

/** A grid of Cards. */
export const Cards = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(auto-fit, minmax(14rem, 1fr))' },
      gap: 2,
      my: 3,
    }}
  >
    {children}
  </Box>
);

/** An icon, a titled heading and some copy. */
export const Card = ({ icon, title, children }: { icon?: string; title: string; children: ReactNode }) => (
  <Paper variant='outlined' sx={{ p: 2.5, borderRadius: 1, textAlign: 'center', height: '100%' }}>
    {icon && (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={icon} alt='' style={{ maxHeight: 120, width: 'auto', display: 'block', margin: '0 auto 0.75rem' }} />
    )}
    <MiniBar>
      <Typography component='h3' variant='h6' sx={{ mb: 1 }}>
        {title}
      </Typography>
    </MiniBar>
    <Box sx={{ textAlign: 'left', '& > :last-child': { mb: 0 } }}>{children}</Box>
  </Paper>
);
