/**
 * The remark plugins in this folder run in `@next/mdx`'s loader for every MDX
 * file in the site, the `app/**\/page.mdx` pages included. They only rewrite
 * the documentation, which this tells apart by its path.
 *
 * @param {{ path?: string }} file The vfile being compiled.
 */
export const isDocFile = (file) =>
  /[\\/]content[\\/]uw-research-computing[\\/]docs[\\/]/.test(file.path ?? '');
