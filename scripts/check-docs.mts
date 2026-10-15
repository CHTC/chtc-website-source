// Compiles every research-computing document the way the site does, so a
// bad frontmatter field or MDX syntax error is reported for all documents at
// once instead of stopping `next build` at the first one.
//
//   npx tsx scripts/check-docs.mts
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { getDocs } from '../app/uw-research-computing/_lib/docs';

const docs = getDocs(); // throws on invalid frontmatter
let failures = 0;
for (const doc of docs) {
  try {
    await compileMDX({
      source: doc.content,
      options: {
        blockJS: false,
        mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, [rehypeHighlight, {}]] },
      },
    });
  } catch (error) {
    failures += 1;
    const message = error instanceof Error ? error.message : String(error);
    console.log(`${doc.slug.join('/')}.mdx: ${message.split('\n')[1] ?? message.split('\n')[0]}`);
  }
}
console.log(`${docs.length} documents, ${failures} failed to compile`);
process.exit(failures ? 1 : 0);
