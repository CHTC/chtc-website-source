import { Alert, Box, Container } from '@mui/material';
import { listingMetadata } from '@/utils/metadata';
import { recordStaffImages } from '@/utils/remoteImages';
import MiniBarHeading from '../_components/MiniBarHeading';
import ExportedImage from 'next-image-export-optimizer';
import TeamMarkdown from '../_components/Markdown';
import { getProgramPage, getReportParams } from '../_lib/fellowships';
import { getFellows, reportHref } from '../_lib/team';
import FellowCard from './_components/FellowCard';
import fellowsBanner from '@/public/images/CHTC_Fellows.png';

export const metadata = listingMetadata(
  'CHTC Fellows Program',
  'A paid summer program in which undergraduate and graduate students work with CHTC mentors on research computing, cyberinfrastructure and facilitation projects.',
  '/fellowships/'
);

export default async function Page() {
  const { title, announcement, before, after } = getProgramPage();

  // The legacy page drew one fellow at random on every build (`| sample`);
  // this does the same, so the featured fellow changes with each deploy.
  const fellows = await getFellows();
  const featured = fellows.length
    ? fellows[Math.floor(Math.random() * fellows.length)]
    : undefined;
  if (featured) recordStaffImages([featured]);
  const reports = new Set(
    getReportParams().map(({ year, name }) => `/fellowships/reports/${year}/${name}/`)
  );

  return (
    <>
      {/* A wordmark, not a photo: shown whole at its own aspect ratio. */}
      <Box sx={{ bgcolor: 'grey.100' }}>
        <ExportedImage
          src={fellowsBanner}
          alt='CHTC Fellows'
          priority
          // Never wider than 300px × the 3.74:1 ratio once the height cap applies.
          sizes='(max-width: 1122px) 100vw, 1122px'
          style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 300, objectFit: 'contain' }}
        />
      </Box>

      <Container maxWidth='md'>
        <MiniBarHeading component='h1' variant='h2'>
          {title}
        </MiniBarHeading>
        {announcement && (
          <Alert severity='info' sx={{ mb: 3 }}>
            <strong>{announcement}</strong>
          </Alert>
        )}
        <TeamMarkdown content={before} />
        {featured && (
          <Box sx={{ my: 3 }}>
            <FellowCard member={featured} hasReport={reports.has(reportHref(featured))} />
          </Box>
        )}
        <TeamMarkdown content={after} />
      </Container>
    </>
  );
}
