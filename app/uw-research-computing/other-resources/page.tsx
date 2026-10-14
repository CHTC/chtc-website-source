import { listingMetadata } from '@/utils/metadata';
import LinkList from '../_components/LinkList';
import { SECTION } from '../_lib/docs';

export const metadata = listingMetadata(
  'Other Resources',
  'Other research computing resources related to CHTC: the CHTC GPU Lab, the HTCondor Project, NEOS, the OSG Consortium and WID.',
  `${SECTION}/other-resources/`
);

export default function Page() {
  return (
    <LinkList
      title='Other Resources'
      links={[
        { text: 'CHTC GPU Lab', url: `${SECTION}/gpu-lab/` },
        { text: 'HTCondor Project', url: 'https://htcondor.org' },
        { text: 'NEOS Optimization Service', url: 'http://www.neos-server.org/' },
        { text: 'OSG Consortium', url: 'http://www.osg-htc.org/' },
        { text: 'WID (Wisconsin Institute for Discovery)', url: 'http://wid.wisc.edu/' },
      ]}
    />
  );
}
