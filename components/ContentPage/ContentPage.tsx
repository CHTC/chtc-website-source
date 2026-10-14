import type { ReactNode } from 'react';
import { Container, type Breakpoint } from '@mui/material';
import MiniBarHeading from '@/components/MiniBarHeading';

type ContentPageProps = {
  title: string;
  /** `md` keeps prose near the optimal line length (the legacy `character_optimized` layout). */
  maxWidth?: Breakpoint;
  children: ReactNode;
};

/** Page shell for hand-authored TSX pages: a titled, readable-width column. */
export default function ContentPage({ title, maxWidth = 'md', children }: ContentPageProps) {
  return (
    <Container maxWidth={maxWidth} sx={{ py: { xs: 5, md: 8 } }}>
      <MiniBarHeading component='h1' variant='h2' sx={{ mb: 4 }}>
        {title}
      </MiniBarHeading>
      {children}
    </Container>
  );
}
