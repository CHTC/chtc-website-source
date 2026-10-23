import { isDocFile } from './docFile.mjs';

/**
 * @typedef {{ type: string, value?: unknown, properties?: { key: { name?: string, value?: unknown }, value: { type: string, value?: unknown } }[] }} Estree
 * @typedef {{ type: string, name?: string, value?: string | null | { type: string, data?: { estree?: { body: { expression: Estree }[] } } } }} Attribute
 * @typedef {{ type: string, name?: string | null, attributes?: Attribute[], children?: Node[], depth?: number, data?: object }} Node
 */

const HEADING = /^h([1-6])$/;

/** `{{ color: '#c5050c' }}` as `color:#c5050c`; anything but string and number literals is `undefined`. */
function styleString(/** @type {Estree | undefined} */ object) {
  if (object?.type !== 'ObjectExpression') return undefined;
  const declarations = [];
  for (const property of object.properties ?? []) {
    const key = property.key.name ?? property.key.value;
    if (typeof key !== 'string' || property.value.type !== 'Literal') return undefined;
    const name = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    declarations.push(`${name}:${property.value.value}`);
  }
  return declarations.join(';');
}

/** The element's attributes as hast properties, or `undefined` if one is an expression we cannot read. */
function properties(/** @type {Attribute[]} */ attributes) {
  /** @type {Record<string, string | boolean>} */
  const props = {};
  for (const attribute of attributes) {
    if (attribute.type !== 'mdxJsxAttribute' || !attribute.name) return undefined;
    const { name, value } = attribute;
    if (value === null || value === undefined) props[name] = true;
    else if (typeof value === 'string') props[name] = value;
    else if (name === 'style') {
      const style = styleString(value.data?.estree?.body[0]?.expression);
      if (style === undefined) return undefined;
      props.style = style;
    } else return undefined;
  }
  return props;
}

/**
 * A literal `<h3 id="…" style={…}>` in a document is JSX, which neither the
 * `components` map nor the table-of-contents plugin sees. Turning it into a
 * markdown heading that keeps its attributes lets both treat it like `###`.
 */
export default function remarkJsxHeadings() {
  return (/** @type {Node} */ tree, /** @type {{ path?: string }} */ file) => {
    if (!isDocFile(file)) return;
    const visit = (/** @type {Node} */ node) => {
      node.children?.forEach((child, index) => {
        const level = child.type === 'mdxJsxFlowElement' ? HEADING.exec(child.name ?? '') : null;
        const hProperties = level ? properties(child.attributes ?? []) : undefined;
        if (!level || !hProperties) {
          visit(child);
          return;
        }
        // Flow JSX wraps its inline content in a paragraph.
        const content = child.children ?? [];
        const phrasing = content.length === 1 && content[0].type === 'paragraph' ? (content[0].children ?? []) : content;
        /** @type {Node[]} */ (node.children)[index] = {
          type: 'heading',
          depth: Number(level[1]),
          children: phrasing,
          data: { hProperties },
        };
      });
    };
    visit(tree);
  };
}
