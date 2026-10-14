import ExportedImage from 'next-image-export-optimizer';
import {
  Box,
  Container,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import MiniBarHeading from '@/components/MiniBarHeading';
import colleges from '@/public/assets/data/chtc-data-summary.json';
import interactions from '@/public/assets/data/interaction-count.json';
import StatCounter from './StatCounter';

type College = (typeof colleges)[number];

const sum = (key: 'NumProj' | 'HTCYears' | 'HPCYears') =>
  colleges.reduce((total, college: College) => total + college[key], 0);

const cell = (value: number) => (value === 0 ? '–' : value.toLocaleString('en-US'));

/**
 * "Last Year Serving UW-Madison": the headline numbers and the per-college
 * table.
 *
 * The legacy page fetched the same two JSON files in the browser; they are
 * read at build time here, so the figures are in the HTML. They still live in
 * `public/assets/data/` so anything that updates or links to them keeps
 * working, and a change to them lands with the next build.
 */
export default function UsageStats() {
  const stats = [
    { label: 'Facilitator Interactions', value: interactions.InteractionCount },
    { label: 'Projects Supported', value: sum('NumProj') },
    { label: 'HTC Core Years', value: sum('HTCYears') },
    { label: 'HPC Core Years', value: sum('HPCYears') },
  ];

  return (
    <Box component='section' aria-labelledby='usage-heading' sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth='lg'>
        <MiniBarHeading center>
          <span id='usage-heading'>Last Year Serving UW-Madison</span>
        </MiniBarHeading>
      </Container>

      {/* The circuit-board art is decoration behind the numbers. */}
      <Box sx={{ position: 'relative', overflow: 'hidden', py: { xs: 5, md: 7 } }}>
        <ExportedImage
          src='/images/circuit_board_light.svg'
          alt=''
          fill
          sizes='100vw'
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0, opacity: 0.9 }}
        />
        <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 4, md: 2 }}>
            {stats.map((stat) => (
              <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                <StatCounter value={stat.value} label={stat.label} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth='md' sx={{ mt: 4 }}>
        <TableContainer
          sx={{ border: 1, borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}
        >
          <Table size='small' aria-label='CHTC usage by college over the last year'>
            <TableHead>
              <TableRow>
                <TableCell>College</TableCell>
                <TableCell align='right'>Projects Supported</TableCell>
                <TableCell align='right'>HTC Core Years</TableCell>
                <TableCell align='right'>HPC Core Years</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {colleges.map((college) => (
                <TableRow key={college.College}>
                  <TableCell>
                    {college.CollegeURL ? (
                      <Link href={college.CollegeURL}>{college.College}</Link>
                    ) : (
                      college.College
                    )}
                  </TableCell>
                  <TableCell align='right'>{cell(college.NumProj)}</TableCell>
                  <TableCell align='right'>{cell(college.HTCYears)}</TableCell>
                  <TableCell align='right'>{cell(college.HPCYears)}</TableCell>
                </TableRow>
              ))}
              <TableRow
                sx={{
                  bgcolor: 'secondary.main',
                  '& td': { color: 'secondary.contrastText', fontWeight: 700, borderBottom: 0 },
                }}
              >
                <TableCell>Total</TableCell>
                <TableCell align='right'>{cell(sum('NumProj'))}</TableCell>
                <TableCell align='right'>{cell(sum('HTCYears'))}</TableCell>
                <TableCell align='right'>{cell(sum('HPCYears'))}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
