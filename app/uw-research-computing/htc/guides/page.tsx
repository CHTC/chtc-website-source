import { listingMetadata } from '@/utils/metadata';
import GuidesIndex from '../../_components/GuidesIndex';
import { htcGuideMenu, SECTION } from '../../_lib/docs';

export const metadata = listingMetadata(
  'HTC Computing Guides',
  "Guides for CHTC's High Throughput Computing (HTC) system: getting started, submitting jobs, managing data, software, workflows and troubleshooting.",
  `${SECTION}/htc/guides/`
);

export default function Page() {
  return <GuidesIndex title='HTC Computing Guides' sections={htcGuideMenu()} />;
}
