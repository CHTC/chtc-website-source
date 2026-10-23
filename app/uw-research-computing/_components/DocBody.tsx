import type { MDXContent } from 'mdx/types';
import { extractMarkdownImageUrls, recordRemoteImages } from '@/utils/remoteImages';
import type { Doc } from '../_lib/docs';
import DocExcerptTabs from './DocExcerptTabs';
import { docComponents } from './docComponents';

/** A document's body, with its remote images declared to the optimizer. */
const DocBody = ({ doc, Content }: { doc: Doc; Content: MDXContent }) => {
  recordRemoteImages(extractMarkdownImageUrls(doc.content));
  return (
    <div className='chtc-doc'>
      <Content components={{ ...docComponents(), ExcerptTabs: DocExcerptTabs }} />
    </div>
  );
};

export default DocBody;
