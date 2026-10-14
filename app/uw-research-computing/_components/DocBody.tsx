import type { Components } from 'react-markdown';
import MarkdownContainer from '@/components/MarkdownContainer';
import { extractMarkdownImageUrls, recordRemoteImages } from '@/utils/remoteImages';
import { docExcerpt, getDocs } from '../_lib/docs';
import ExcerptTabs from './ExcerptTabs';
import FacilitatorGrid from './FacilitatorGrid';
import GpuTable from './GpuTable';
import UpcomingEvents from './UpcomingEvents';

type Attributes = Record<string, string | undefined>;

/**
 * `<excerpt-tabs flag="software_icon">`: a tab per document carrying the
 * frontmatter flag, in collection order, each showing that document's
 * excerpt (the legacy `where_exp: "x.<flag>"` loop).
 */
const DocExcerptTabs = ({ flag, more }: Attributes) => {
  const docs = getDocs().filter((doc) => flag && (doc.data as unknown as Attributes)[flag]);
  const tabs = docs.map((doc) => ({
    id: doc.slug.join('-'),
    label: doc.data.software ?? doc.data.title,
    icon: doc.data.software_icon ?? doc.data.icon,
    href: more === 'true' ? doc.path : undefined,
  }));
  const panels = docs.map((doc) => (
    // Heading ids kept: the legacy page carried them too (`#quickstart-python`).
    <MarkdownContainer key={doc.path} content={docExcerpt(doc)} variant='docs' />
  ));
  return <ExcerptTabs tabs={tabs} panels={panels} />;
};

/**
 * Renderers for the custom elements `scripts/convert-legacy-docs.mjs` wrote in
 * place of Liquid loops over site data.
 */
const DATA_ELEMENTS = {
  'gpu-table': ({ owner }: Attributes) => <GpuTable owner={owner} />,
  'excerpt-tabs': (props: Attributes) => <DocExcerptTabs {...props} />,
  'facilitator-grid': () => <FacilitatorGrid />,
  'upcoming-events': ({ tag, limit }: Attributes) => <UpcomingEvents tag={tag} limit={limit} />,
} as unknown as Components;

/** A converted document's body, with its remote images declared to the optimizer. */
const DocBody = ({ content }: { content: string }) => {
  recordRemoteImages(extractMarkdownImageUrls(content));
  return <MarkdownContainer content={content} variant='docs' components={DATA_ELEMENTS} />;
};

export default DocBody;
