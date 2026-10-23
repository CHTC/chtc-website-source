// Compiles every research-computing document the way the site does, so a
// bad frontmatter field, MDX syntax error or unknown component (neither a
// standard one nor imported) is reported for all documents at once instead of
// stopping `next build` at the first one.
//
//   npx tsx scripts/check-docs.mts
import fs from 'fs';
import path from 'path';
import { compile, createProcessor, type CompileOptions } from '@mdx-js/mdx';
import { VFile } from 'vfile';
import { mdxOptions } from '../mdx-options.mjs';
import { getDocs } from '../app/uw-research-computing/_lib/docs';
import { docComponents } from '../app/uw-research-computing/_components/docComponents';

type PluginSpec = string | [string, unknown];
type Pluggable = NonNullable<CompileOptions['remarkPlugins']>[number];

/** The config names plugins by module (for Turbopack); load them as `@next/mdx` does. */
const load = (specs: PluginSpec[]): Promise<Pluggable[]> =>
  Promise.all(
    specs.map(async (spec) => {
      const [name, options] = Array.isArray(spec) ? spec : [spec];
      const { default: plugin } = await import(name);
      return (options === undefined ? plugin : [plugin, options]) as Pluggable;
    })
  );

const remarkPlugins = await load(mdxOptions.remarkPlugins as PluginSpec[]);
const rehypePlugins = await load(mdxOptions.rehypePlugins as PluginSpec[]);

type Node = { type: string; name?: string | null; value?: string; children?: Node[] };

/** Available without an import; `DocBody` adds `ExcerptTabs`. */
const STANDARD = [...Object.keys(docComponents()), 'ExcerptTabs'];

/**
 * Components the document uses as tags that are neither standard nor
 * imported. MDX only notices when the page renders, as "Expected component
 * `Tipp` to be defined".
 */
const parser = createProcessor({ remarkPlugins });
function unknownComponents(value: string): string[] {
  const used = new Set<string>();
  const bound = new Set<string>(STANDARD);
  const visit = (node: Node) => {
    if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name && /^[A-Z]/.test(node.name)) {
      used.add(node.name.split('.')[0]);
    }
    if (node.type === 'mdxjsEsm' && node.value) {
      for (const match of node.value.matchAll(/\b[A-Za-z_$][\w$]*\b/g)) bound.add(match[0]);
    }
    node.children?.forEach(visit);
  };
  visit(parser.parse(value) as Node);
  return [...used].filter((name) => !bound.has(name)).sort();
}

const docs = getDocs(); // throws on invalid frontmatter
const docsDir = path.join(process.cwd(), 'content', 'uw-research-computing', 'docs');
let failures = 0;
for (const doc of docs) {
  const file = path.join(docsDir, `${doc.file}.mdx`);
  const value = fs.readFileSync(file, 'utf8');
  try {
    const unknown = unknownComponents(value);
    if (unknown.length) {
      failures += 1;
      console.log(`${doc.file}.mdx: unknown component (not standard, not imported): ${unknown.join(', ')}`);
      continue;
    }
    // The path matters: the repository's own plugins only rewrite documents.
    await compile(new VFile({ path: file, value }), { remarkPlugins, rehypePlugins });
  } catch (error) {
    failures += 1;
    const message = error instanceof Error ? error.message : String(error);
    console.log(`${doc.file}.mdx: ${message.split('\n')[0]}`);
  }
}
console.log(`${docs.length} documents, ${failures} failed to compile`);
process.exit(failures ? 1 : 0);
