import { Link, Typography } from '@mui/material';
import ContentPage from '@/components/ContentPage';
import FeatureRow, { FeatureText } from '@/components/FeatureRow';
import { listingMetadata } from '@/utils/metadata';

export const metadata = listingMetadata(
  'Technologies',
  'The open-source software CHTC develops for High Throughput Computing: the HTCondor Software Suite and the Pelican data federation platform.',
  '/technologies/'
);

export default function Page() {
  return (
    <ContentPage title='Technologies' maxWidth='lg'>
      <Typography sx={{ fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '70ch' }}>
        The CHTC offers a suite of open-source software tools that manage HTC workloads and enable
        organizations to form distributed HTC pools. They have been adopted by academic and
        commercial entities in support of their HTC workloads worldwide.
      </Typography>
      <FeatureRow
        title='HTCSS'
        href='https://htcondor.org'
        image={{ src: '/images/logos/CondorAlpha.png', width: 384, height: 327, alt: 'Hand drawn image of a Condor' }}
        imageFirst
        imageMaxWidth={260}
      >
        <FeatureText>
          The <Link href='https://htcondor.org'>HTCondor Software Suite (HTCSS)</Link> provides
          sites and users with the ability to manage and execute HTC workloads. Whether it’s
          managing a single laptop or 250,000 cores at CERN, HTCondor helps solve computational
          problems through the application of the HTC principles.
        </FeatureText>
      </FeatureRow>
      <FeatureRow
        title='Pelican'
        href='https://pelicanplatform.org'
        image={{ src: '/images/logos/Pelican.png', width: 6659, height: 6584, alt: 'Pelican logo' }}
        imageFirst
        imageMaxWidth={260}
      >
        <FeatureText>
          A data transfer service, <Link href='https://pelicanplatform.org'>Pelican</Link>{' '}
          facilitates the ability for researchers to access and transfer data from where it is
          stored to where it needs to run. Inspired by the 2022 White House Office of Science and
          Technology Policy (OSTP) proposition to make all government funded research data
          publicly accessible, Pelican works to efficiently transfer this open data to
          researchers who require it. Pelican provides an open-source software platform for
          federating dataset repositories together and delivering the objects to computing
          capacity such as the <Link href='https://osg-htc.org/ospool'>OSPool</Link>.
        </FeatureText>
      </FeatureRow>
    </ContentPage>
  );
}
