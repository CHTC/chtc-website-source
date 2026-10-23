import { isDocFile } from './docFile.mjs';

/** @typedef {{ type: string, name?: string | null, children?: Node[] }} Node The slice of an mdast node this plugin reads. */

/**
 * MDX applies the `components` map to markdown (`![](src)`), not to JSX, so a
 * literal `<img src=…>` in a document bypasses `DocImage` and ships the
 * full-size original. Renaming the element to a capitalized component sends
 * it through the map like any other block.
 */
export default function remarkJsxImages() {
  return (/** @type {Node} */ tree, /** @type {{ path?: string }} */ file) => {
    if (!isDocFile(file)) return;
    const visit = (/** @type {Node} */ node) => {
      if (
        (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
        node.name === 'img'
      ) {
        node.name = 'DocImage';
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
