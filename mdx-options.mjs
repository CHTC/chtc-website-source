import { fileURLToPath } from 'node:url';

/**
 * The remark and rehype plugins every MDX file is compiled with: the
 * `app/**\/page.mdx` pages and the research-computing documents. Shared by
 * `next.config.mjs` and `scripts/check-docs.mts`.
 *
 * Turbopack cannot take plugin functions from the config, only module names
 * and serializable options, so the repository's own plugins are named by
 * absolute path (a relative one would resolve from each MDX file).
 */

const local = (file) => fileURLToPath(new URL(`./app/uw-research-computing/_lib/${file}`, import.meta.url));

const HIGHLIGHT_OPTIONS = {
  // Fences in the documents name `condor` (submit files: `key = value`
  // lines and `#` comments, which the ini grammar reads well) and
  // `dockerfile`, which is not in the bundled common set.
  aliases: { ini: ['condor'], bash: ['dockerfile', 'console', 'term'] },
  plainText: ['text', 'txt', 'plain'],
};

export const mdxOptions = {
  remarkPlugins: [
    // `export const frontmatter`, read from the module like any other export.
    'remark-frontmatter',
    'remark-mdx-frontmatter',
    'remark-gfm',
    local('remarkJsxHeadings.mjs'),
    local('remarkJsxImages.mjs'),
    local('remarkUnlinkButtons.mjs'),
    local('remarkDocExcerpt.mjs'),
  ],
  rehypePlugins: [
    'rehype-slug',
    ['rehype-highlight', HIGHLIGHT_OPTIONS],
    // `export const tableOfContents`, with the ids rehype-slug gave the headings.
    '@stefanprobst/rehype-extract-toc',
    '@stefanprobst/rehype-extract-toc/mdx',
  ],
};
