import { Box, Link, Typography } from '@mui/material';
import ContentPage from '@/components/ContentPage';
import Figure from '@/components/Figure';
import { listingMetadata } from '@/utils/metadata';

export const metadata = listingMetadata(
  'HTCondor Team Pictures',
  'Group photos of the HTCondor and CHTC team, from 1998 to today.',
  '/past_team_pictures/'
);

type Photo = { file: string; width: number; height: number; alt: string };
type Year = {
  year: string;
  /** The event the photo was taken at, if any. */
  event?: { prefix: string; name: string; href: string; suffix?: string };
  note?: string;
  photos: Photo[];
};

const photo = (file: string, width: number, height: number, alt: string): Photo => ({
  file: `/images/team/team_photos/${file}`,
  width,
  height,
  alt,
});

const YEARS: Year[] = [
  { year: '2025', event: { prefix: 'The CHTC Team at', name: 'Throughput Computing 2025', href: 'https://agenda.hep.wisc.edu/event/2297/' }, photos: [photo('team-2025.jpg', 1932, 855, 'HTCondor Team June 2025')] },
  { year: '2024', event: { prefix: 'The CHTC Team at', name: 'Throughput Computing 2024', href: 'https://agenda.hep.wisc.edu/event/1579/' }, photos: [photo('team-2024.jpg', 1920, 682, 'HTCondor Team May 2024')] },
  { year: '2023', event: { prefix: 'The CHTC Team at', name: 'Throughput Computing 2023', href: 'https://agenda.hep.wisc.edu/event/1579/' }, photos: [photo('team-2023.jpg', 1920, 659, 'HTCondor Team May 2023')] },
  { year: '2022', event: { prefix: 'The CHTC Team at', name: 'HTCondor Week 2022', href: 'https://agenda.hep.wisc.edu/event/1579/' }, photos: [photo('team-2022.jpg', 1920, 727, 'HTCondor Team May 2022')] },
  { year: '2021', event: { prefix: 'The HTCondor Team at', name: 'HTCondor Week 2021', href: 'https://agenda.hep.wisc.edu/event/1579/', suffix: ', May 2021.' }, photos: [photo('team-2021.jpg', 800, 550, 'HTCondor Team May 2021')] },
  { year: '2020', event: { prefix: 'The HTCondor Team at', name: 'HTCondor Week 2020', href: 'https://agenda.hep.wisc.edu/event/1440/', suffix: ', May 2020.' }, photos: [photo('team-2020.jpg', 1000, 563, 'HTCondor Team May 2020')] },
  { year: '2019', event: { prefix: 'The HTCondor Team at', name: 'HTCondor Week 2019', href: 'https://agenda.hep.wisc.edu/event/1325/', suffix: ', May 2019.' }, photos: [photo('team-2019.jpg', 4000, 2250, 'HTCondor Team May 2019')] },
  { year: '2018', event: { prefix: 'The HTCondor Team at', name: 'HTCondor Week 2018', href: 'https://agenda.hep.wisc.edu/event/1201/', suffix: ', May 2018.' }, photos: [photo('team-2018.jpg', 1600, 1067, 'HTCondor Team May 2018')] },
  { year: '2017', event: { prefix: 'The HTCondor Team at', name: 'HTCondor Week 2017', href: 'https://research.cs.wisc.edu/htcondor/HTCondorWeek2017/', suffix: ', May 2017 (but photo is missing Miron Livny!).' }, photos: [photo('team-2017.jpg', 4928, 3264, 'HTCondor Team May 2017')] },
  { year: '2016', event: { prefix: 'The HTCondor Team at', name: 'HTCondor Week 2016', href: 'https://research.cs.wisc.edu/htcondor/HTCondorWeek2016/', suffix: ', May 2016.' }, photos: [photo('team-2016.jpg', 3008, 2000, 'HTCondor Team May 2016')] },
  { year: '2015', event: { prefix: 'The HTCondor Team at', name: 'HTCondor Week 2015', href: 'https://research.cs.wisc.edu/htcondor/HTCondorWeek2015/', suffix: ', May 2015.' }, photos: [photo('team-2015.jpg', 740, 295, 'HTCondor Team May 2015')] },
  { year: '2014', event: { prefix: 'The HTCondor Team at', name: 'HTCondor Week 2014', href: 'https://research.cs.wisc.edu/htcondor/HTCondorWeek2014/', suffix: ', May 2014.' }, photos: [photo('team-2014.jpg', 740, 353, 'HTCondor Team May 2014')] },
  { year: '2013', event: { prefix: 'The HTCondor Team at', name: 'HTCondor Week 2013', href: 'https://research.cs.wisc.edu/htcondor/HTCondorWeek2013/', suffix: ', May 2013.' }, photos: [photo('team-2013.jpg', 740, 360, 'HTCondor Team May 2013')] },
  { year: '2012', event: { prefix: 'The HTCondor Team at', name: 'Condor Week 2012', href: 'https://research.cs.wisc.edu/htcondor/CondorWeek2012/', suffix: ', May 2012.' }, photos: [photo('team-2012.jpg', 740, 307, 'HTCondor Team May 2012')] },
  { year: '2011', event: { prefix: 'The HTCondor Team at', name: 'Condor Week 2011', href: 'https://research.cs.wisc.edu/htcondor/CondorWeek2011/', suffix: ', May 2011.' }, photos: [photo('team-2011.jpg', 700, 303, 'HTCondor Team May 2011')] },
  { year: '2010', event: { prefix: 'The HTCondor Team at', name: 'Condor Week 2010', href: 'https://research.cs.wisc.edu/htcondor/CondorWeek2010/', suffix: ', May 2010.' }, photos: [photo('team-2010.jpg', 770, 362, 'HTCondor Team May 2010')] },
  { year: '2009', event: { prefix: 'The HTCondor Team at', name: 'Condor Week 2009', href: 'https://research.cs.wisc.edu/htcondor/CondorWeek2009/', suffix: ', May 2009.' }, photos: [photo('team-2009.jpg', 654, 432, 'HTCondor Team May 2009')] },
  { year: '2008', event: { prefix: 'The HTCondor Team at', name: 'Condor Week 2008', href: 'https://research.cs.wisc.edu/htcondor/CondorWeek2008/', suffix: ', May 2008.' }, photos: [photo('team-2008-05.jpg', 768, 512, 'HTCondor Team May 2008')] },
  { year: '2007', event: { prefix: 'The HTCondor Team at', name: 'Condor Week 2007', href: 'https://research.cs.wisc.edu/htcondor/CondorWeek2007/', suffix: ', May 2007.' }, photos: [photo('team-2007-05.jpg', 800, 343, 'HTCondor Team May 2007')] },
  { year: '2006', event: { prefix: 'The HTCondor Team at', name: 'Condor Week 2006', href: 'https://research.cs.wisc.edu/htcondor/CondorWeek2006/', suffix: ', April 2006.' }, photos: [photo('team-2006-04.jpg', 800, 357, 'HTCondor Team April 2006')] },
  { year: '2003', photos: [photo('team-2003a.jpg', 800, 497, 'HTCondor Team October 2003'), photo('team-2003b.jpg', 800, 600, 'HTCondor Team 2003')] },
  { year: '2002', note: 'Taken in October.', photos: [photo('team-2002-10.jpg', 800, 473, 'HTCondor Team October 2002')] },
  { year: '1999', photos: [photo('team-1999.jpg', 600, 463, 'HTCondor Team 1999')] },
  { year: '1998', photos: [photo('team-1998.jpg', 696, 476, 'HTCondor Team 1998')] },
];

export default function Page() {
  return (
    <ContentPage title='HTCondor Team Pictures'>
      {YEARS.map(({ year, event, note, photos }) => (
        <Box component='section' key={year} sx={{ mb: 6 }}>
          <Typography variant='h4' component='h2' gutterBottom>
            {year}
          </Typography>
          {event && (
            <Typography sx={{ mb: -2 }}>
              {event.prefix} <Link href={event.href}>{event.name}</Link>
              {event.suffix}
            </Typography>
          )}
          {note && <Typography sx={{ mb: -2 }}>{note}</Typography>}
          {photos.map((p) => (
            <Figure key={p.file} src={p.file} alt={p.alt} width={p.width} height={p.height} maxWidth={Math.min(p.width, 852)} />
          ))}
        </Box>
      ))}
    </ContentPage>
  );
}
