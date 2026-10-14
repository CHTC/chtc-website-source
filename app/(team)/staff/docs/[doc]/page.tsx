import { notFound } from 'next/navigation';
import { Container, Link, Typography } from '@mui/material';
import { listingMetadata } from '@/utils/metadata';
import MiniBarHeading from '../../../_components/MiniBarHeading';
import TeamMarkdown from '../../../_components/Markdown';
import { getStaffDoc, getStaffDocParams } from '../../../_lib/staffDocs';

type Params = { doc: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getStaffDocParams();
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { doc } = await params;
  const page = getStaffDoc(doc);
  if (!page) return {};
  return listingMetadata(
    page.title,
    `CHTC staff documentation: ${page.title}.`,
    `/staff/docs/${doc}/`
  );
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { doc } = await params;
  const page = getStaffDoc(doc);
  if (!page) notFound();

  return (
    <Container maxWidth='md'>
      <Typography variant='body2' sx={{ mt: 4 }}>
        <Link href='/staff/'>CHTC Staff Page</Link>
      </Typography>
      <MiniBarHeading component='h1' variant='h2' sx={{ mt: 2 }}>
        {page.title}
      </MiniBarHeading>
      <TeamMarkdown content={page.body} />
    </Container>
  );
}
