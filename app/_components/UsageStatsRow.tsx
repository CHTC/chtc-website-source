import ExportedImage from 'next-image-export-optimizer';
import { Box, Container, Grid } from '@mui/material';
import colleges from '@/public/assets/data/chtc-data-summary.json';
import interactions from '@/public/assets/data/interaction-count.json';
import StatCounter from './StatCounter';

type College = (typeof colleges)[number];

/** A column of `chtc-data-summary.json`, summed over the colleges. */
export const sumColleges = (key: 'NumProj' | 'HTCYears' | 'HPCYears') =>
  colleges.reduce((total, college: College) => total + college[key], 0);

/**
 * The four headline numbers from the last year, counting up over the
 * circuit-board art: on the home page under "Last Year Serving UW-Madison",
 * and on the Campus Computing page. Read at build time from the same JSON
 * files the legacy pages fetched in the browser.
 */
export default function UsageStatsRow() {
  const stats = [
    { label: 'Facilitator Interactions', value: interactions.InteractionCount },
    { label: 'Projects Supported', value: sumColleges('NumProj') },
    { label: 'HTC Core Years', value: sumColleges('HTCYears') },
    { label: 'HPC Core Years', value: sumColleges('HPCYears') },
  ];

  return (
    // The circuit-board art is decoration behind the numbers.
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
  );
}
