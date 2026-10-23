import { isDocFile } from './docFile.mjs';

/** @typedef {{ type: string, name?: string, value?: string, attributes?: unknown[], children?: Node[] }} Node */

/** Top-level nodes that are not content: frontmatter, imports and exports. */
const META = new Set(['yaml', 'toml', 'mdxjsEsm']);

/**
 * A document's excerpt is everything above its `{/* more *\/}` line, or its
 * first block (Jekyll's rule for `page.excerpt`). Everything after it is
 * wrapped in `<DocMore>`, so the same compiled document renders whole, or as
 * its excerpt when `DocMore` is given as a component that renders nothing
 * (`<ExcerptTabs />`).
 */
export default function remarkDocExcerpt() {
  return (/** @type {Node} */ tree, /** @type {{ path?: string }} */ file) => {
    if (!isDocFile(file)) return;
    const children = tree.children ?? [];
    const marker = children.findIndex(
      (node) => node.type === 'mdxFlowExpression' && node.value?.trim() === '/* more */'
    );
    const start = marker >= 0 ? marker + 1 : children.findIndex((node) => !META.has(node.type)) + 1;
    if (start <= 0) return;
    const rest = children.slice(start);
    const more = rest.filter((node) => !META.has(node.type));
    if (more.length === 0) return;
    tree.children = [
      ...children.slice(0, start),
      // Imports and exports must stay at the top level.
      ...rest.filter((node) => META.has(node.type)),
      { type: 'mdxJsxFlowElement', name: 'DocMore', attributes: [], children: more },
    ];
  };
}
