import { listingMetadata } from '@/utils/metadata';
import GuidesIndex from '../../_components/GuidesIndex';
import { hpcGuideMenu, SECTION } from '../../_lib/docs';

export const metadata = listingMetadata(
  'HPC Computing Guides',
  "Guides for CHTC's High Performance Computing (HPC) cluster: getting started, submitting jobs with Slurm, managing data, software and troubleshooting.",
  `${SECTION}/hpc/guides/`
);

export default function Page() {
  return <GuidesIndex title='HPC Computing Guides' sections={hpcGuideMenu()} />;
}
