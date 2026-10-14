import { Box, Container, Divider, Link } from '@mui/material';
import { listingMetadata } from '@/utils/metadata';
import MiniBarHeading from '../_components/MiniBarHeading';
import Publications from './_components/Publications';

export const metadata = listingMetadata(
  'Research Publications and Technical Information',
  'Publications by the HTCondor and CHTC team since 1988: matchmaking, workflows, checkpointing, grid computing, scheduling and PhD dissertations, with PDFs and BibTeX.',
  '/research/'
);

/** The section index at the top of the legacy page; ids are in the list. */
const SECTIONS: [id: string, label: string][] = [
  ['overview', 'Overview'],
  ['match', 'Matchmaking and ClassAds'],
  ['workflow', 'Workflow and DAGMan'],
  ['resource', 'Resource Management'],
  ['checkpoint', 'Checkpointing'],
  ['data_intensive', 'Data Intensive Computing'],
  ['grid', 'Grid Computing'],
  ['mw', 'Master-Worker'],
  ['java', 'Java'],
  ['remote', 'Remote Execution and Interposition Agents'],
  ['security', 'Security'],
  ['scalability', 'Scalability and Performance'],
  ['experience', 'Experience'],
  ['science', 'Scientific Applications'],
  ['scheduling', 'Scheduling'],
  ['background', 'Background Work'],
  ['miscellaneous', 'Miscellaneous'],
  ['nmi', 'NMI Build & Test'],
  ['dissertations', 'PhD Dissertations'],
];

export default function Page() {
  return (
    <Container maxWidth='md'>
      <MiniBarHeading component='h1' variant='h2'>
        Research Publications and Technical Information
      </MiniBarHeading>
      <Divider />
      <Box
        component='nav'
        aria-label='Publication topics'
        sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2.5, rowGap: 0.5, py: 2 }}
      >
        {SECTIONS.map(([id, label]) => (
          <Link key={id} href={`#${id}`} variant='body2'>
            {label}
          </Link>
        ))}
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          '& span[id]': { display: 'block', scrollMarginTop: 96 },
          '& li': { mb: 1.5 },
          '& em': { fontStyle: 'italic' },
        }}
      >
        <Publications />
      </Box>
    </Container>
  );
}
