/** The slice of an mdast node this plugin reads. */
type Node = { type: string; name?: string | null; children?: Node[] };

/**
 * A `<Button>` is already a link, but GFM autolinks a bare URL or email in
 * its label (`<Button href="mailto:…">chtc@cs.wisc.edu</Button>`), nesting a
 * second, red `<a>` inside the red button. Links inside a Button are replaced
 * by their text.
 */
export default function remarkUnlinkButtons() {
  return (tree: Node) => {
    const unlink = (node: Node): Node[] =>
      node.type === 'link' ? (node.children ?? []).flatMap(unlink) : [{ ...node, children: node.children?.flatMap(unlink) }];
    const visit = (node: Node) => {
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
