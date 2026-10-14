import { listingMetadata } from '@/utils/metadata';
import LinkList from '../_components/LinkList';
import { SECTION } from '../_lib/docs';

export const metadata = listingMetadata(
  "How To's",
  'Guides for using CHTC research computing services: getting help, requesting an account, HTC and HPC guides, and citing CHTC.',
  `${SECTION}/how-tos/`
);

export default function Page() {
  return (
    <LinkList
      title="How To's"
      links={[
        { text: 'Get Help', url: `${SECTION}/get-help/` },
        // Legacy pointed at `account-details.html`, which no longer exists;
        // the account request page replaced it.
        { text: 'Get an Account', url: `${SECTION}/form/` },
        { text: 'HTC Guides', url: `${SECTION}/htc/guides/` },
        { text: 'HPC Guides', url: `${SECTION}/hpc/guides/` },
        { text: 'Cite CHTC Resources', url: `${SECTION}/cite-chtc/` },
      ]}
    />
  );
}
