import { notFound } from 'next/navigation';
import { Container, Link, Typography } from '@mui/material';
import { listingMetadata } from '@/utils/metadata';
import MiniBarHeading from '../../../../_components/MiniBarHeading';
import TeamMarkdown from '../../../../_components/Markdown';
import { getReport, getReportParams } from '../../../../_lib/fellowships';

type Params = { year: string; name: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getReportParams();
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { year, name } = await params;
  const report = getReport(year, name);
  if (!report) return {};
  const by = report.fellow ? ` by ${report.fellow}` : '';
  return listingMetadata(
    report.title,
    `Final report${by} from the ${year} CHTC Fellows Program.`,
    `/fellowships/reports/${year}/${name}/`
  );
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { year, name } = await params;
  const report = getReport(year, name);
  if (!report) notFound();

  return (
    <Container maxWidth='md'>
      <Typography variant='body2' sx={{ mt: 4 }}>
        <Link href='/fellowships/fellows/'>CHTC Fellows</Link> · {year} final report
      </Typography>
      <MiniBarHeading component='h1' variant='h3' sx={{ mt: 2 }}>
        {report.title}
      </MiniBarHeading>
      <TeamMarkdown content={report.body} />
    </Container>
  );
}
