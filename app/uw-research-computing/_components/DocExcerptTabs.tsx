import { getDocs, importDoc } from '../_lib/docs';
import { docComponents } from './docComponents';
import ExcerptTabs from './ExcerptTabs';

/** Given as `DocMore`, cuts a document down to its excerpt (`remarkDocExcerpt`). */
const Hidden = () => null;

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
    docs.map(async (doc) => {
      const { default: Excerpt } = await importDoc(doc);
      return <Excerpt key={doc.path} components={{ ...docComponents(), DocMore: Hidden }} />;
    })
  );
  return <ExcerptTabs tabs={tabs} panels={panels} />;
};

export default DocExcerptTabs;
