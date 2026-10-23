import { isDocFile } from './docFile.mjs';

/** @typedef {{ type: string, name?: string | null, children?: Node[] }} Node The slice of an mdast node this plugin reads. */

/**
 * A `<Button>` is already a link, but GFM autolinks a bare URL or email in
 * its label (`<Button href="mailto:…">chtc@cs.wisc.edu</Button>`), nesting a
 * second, red `<a>` inside the red button. Links inside a Button are replaced
 * by their text.
 */
export default function remarkUnlinkButtons() {
  return (/** @type {Node} */ tree, /** @type {{ path?: string }} */ file) => {
    if (!isDocFile(file)) return;
    /** @type {(node: Node) => Node[]} */
    const unlink = (node) =>
      node.type === 'link' ? (node.children ?? []).flatMap(unlink) : [{ ...node, children: node.children?.flatMap(unlink) }];
    const visit = (/** @type {Node} */ node) => {
      if (
        (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
        node.name === 'Button'
      ) {
        node.children = node.children?.flatMap(unlink);
        return;
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
