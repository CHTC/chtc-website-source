import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { MDXComponents } from 'mdx/types';
import { extractMarkdownImageUrls, recordRemoteImages } from '@/utils/remoteImages';
import { docExcerpt, docHeadings, getDocs, type Doc } from '../_lib/docs';
import { docComponents } from './docComponents';
import ExcerptTabs from './ExcerptTabs';

const HIGHLIGHT_OPTIONS = {
  // Fences in the documents name `condor` (submit files: `key = value`
  // lines and `#` comments, which the ini grammar reads well) and
  // `dockerfile`, which is not in the bundled common set.
  aliases: { ini: ['condor'], bash: ['dockerfile', 'console', 'term'] },
  plainText: ['text', 'txt', 'plain'],
};

/** Compile a document's MDX (or part of one) to React. */
async function render(source: string, components: MDXComponents) {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      // The content is this repository's own; expressions such as
      // `limit={2}` and `style={{…}}` must survive.
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeHighlight, HIGHLIGHT_OPTIONS]],
      },
    },
  });
  return content;
}

/**
 * `<ExcerptTabs flag="software_icon" more />`: a tab per document carrying
 * the frontmatter flag, in collection order, each showing that document's
 * excerpt (the legacy `where_exp: "x.<flag>"` loop).
 */
const DocExcerptTabs = async ({ flag, more }: { flag: 'software_icon' | 'basic_scripting'; more?: boolean }) => {
  const docs = getDocs().filter((doc) => doc.data[flag]);
  const tabs = docs.map((doc) => ({
    id: doc.slug.join('-'),
    label: doc.data.software ?? doc.data.title,
    icon: doc.data.software_icon ?? doc.data.icon,
    href: more ? doc.path : undefined,
  }));
  const panels = await Promise.all(
    // Heading ids kept: the legacy page carried them too (`#quickstart-python`).
    docs.map((doc) => render(docExcerpt(doc), docComponents([])))
  );
  return <ExcerptTabs tabs={tabs} panels={panels} />;
};

/** A document's body, with its remote images declared to the optimizer. */
const DocBody = async ({ doc }: { doc: Doc }) => {
  recordRemoteImages(extractMarkdownImageUrls(doc.content));
  const components: MDXComponents = {
    ...docComponents(docHeadings(doc)),
    ExcerptTabs: DocExcerptTabs,
  };
  return <div className='chtc-doc'>{await render(doc.content, components)}</div>;
};

export default DocBody;
