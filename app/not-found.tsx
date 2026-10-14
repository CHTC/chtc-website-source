import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Typography } from '@mui/material';

export const metadata: Metadata = {
  title: '404 Not Found — CHTC',
  description:
    'The page you were looking for was not found on the CHTC website.',
  // Nothing here is worth a search result, and it has no canonical URL of its
  // own: the same page answers for every address that does not exist.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container maxWidth='md' sx={{ py: 5 }}>
      <Typography variant='h2' component='h1' gutterBottom>
        404 Page Not Found
      </Typography>
      <Typography paragraph>
        The page you were looking for was not found. If you believe this was in
        error, please contact{' '}
        <Link href='mailto:chtc@cs.wisc.edu'>chtc@cs.wisc.edu</Link>.
      </Typography>
      <Typography paragraph>
        For other ways to get in touch, see{' '}
        <Link href='/uw-research-computing/get-help'>
          Get Help from CHTC
        </Link>
        .
      </Typography>
    </Container>
  );
}
