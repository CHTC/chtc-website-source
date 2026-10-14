import type { CSSProperties, ReactNode } from 'react';
import ExportedImage from 'next-image-export-optimizer';
import { Box, Button, Link, Typography } from '@mui/material';
import Markdown, { type Components } from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

/*
 * Event bodies are raw HTML from the content repository, and their `<img>`
 * tags rarely declare dimensions. `ExportedImage` needs both — it uses them
 * for the placeholder's aspect ratio and to cap the srcset, while the CSS
 * below decides the rendered size — so an assumed landscape ratio is safe.
 */
const FALLBACK_IMAGE_WIDTH = 1200;
const FALLBACK_IMAGE_HEIGHT = 800;
/** The body column is two thirds of a default `md` container at most. */
const BODY_IMAGE_SIZES = '(max-width: 900px) 100vw, 600px';
/** The docs column is at most ~900px wide beside the guide sidebar. */
const DOCS_IMAGE_SIZES = '(max-width: 900px) 100vw, 900px';

/** Parse an HTML dimension attribute, which arrives as a string. */
const toPixels = (value: unknown): number | undefined => {
  const parsed =
    typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

/**
 * `default` is the long-standing look used for event bodies and fellowship
 * reports. `docs` is the UW Research Computing documentation: GFM tables,
 * heading ids (the documents' tables of contents link to them), syntax
 * highlighting, and raw HTML attributes (`class`, `id`, `style`) kept, since
 * the converted documents carry kramdown classes such as `md-term` and
 * `md-tip` as wrapper `<div>`s.
 */
export type MarkdownVariant = 'default' | 'docs';

export interface MarkdownContainerProps {
  content: string;
  /** Rendering profile; defaults to `default`. */
  variant?: MarkdownVariant;
  /**
   * Extra element renderers, merged over the variant's own. Custom tag names
   * written into the markdown as raw HTML (`<gpu-table>`) can be mapped here.
   */
  components?: Components;
}

/* ------------------------------------------------------------------------ */
/* default variant — unchanged                                              */
/* ------------------------------------------------------------------------ */

const defaultComponents: Components = {
  h1: ({ children }) => (
    <Typography variant='h4' component={'h2'} gutterBottom>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography variant='h5' component={'h3'} gutterBottom>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography variant='h6' component={'h4'} gutterBottom>
      {children}
    </Typography>
  ),
  h4: ({ children }) => (
    <Typography variant='subtitle1' pb={2} gutterBottom>
      {children}
    </Typography>
  ),
  h5: ({ children }) => (
    <Typography variant='subtitle2' pb={2} gutterBottom>
      {children}
    </Typography>
  ),
  h6: ({ children }) => <Typography variant='caption'>{children}</Typography>,
  p: ({ children }) => (
    <Typography variant='body1' paragraph sx={{ lineHeight: 1.7 }}>
      {children}
    </Typography>
  ),
  li: ({ children }) => <li>{children}</li>,
  ul: ({ children }) => (
    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>{children}</ul>
  ),
  a: ({ children, href }) => (
    <Link
      href={href ?? '#'}
      sx={{
        color: '#b45309',
        fontWeight: 600,
        textUnderlineOffset: '0.15em',
        '&:hover': { color: 'primary.main', textDecoration: 'underline' },
      }}
    >
      {children}
    </Link>
  ),
  img: ({ src, alt, width, height }) => {
    if (typeof src !== 'string' || src === '') return null;

    const declaredWidth = toPixels(width);

    return (
      <ExportedImage
        src={src}
        alt={alt ?? ''}
        width={declaredWidth ?? FALLBACK_IMAGE_WIDTH}
        height={toPixels(height) ?? FALLBACK_IMAGE_HEIGHT}
        // A declared width is what the image renders at — `maxWidth`
        // only ever shrinks it — so it beats the page-level hint.
        sizes={declaredWidth ? `${declaredWidth}px` : BODY_IMAGE_SIZES}
        style={{
          maxWidth: '100%',
          width: declaredWidth ? `${declaredWidth}px` : undefined,
          height: 'auto',
          borderRadius: 12,
          margin: '1rem 0',
        }}
      />
    );
  },
  strong: ({ children }) => (
    <Box component='span' display='inline' fontWeight='bold'>
      {children}
    </Box>
  ),
  div: ({ children }) => <Box>{children}</Box>,
};

/* ------------------------------------------------------------------------ */
/* docs variant                                                             */
/* ------------------------------------------------------------------------ */

/** Anchored headings must clear the sticky site header when jumped to. */
const HEADING_SX = { scrollMarginTop: '96px', mt: 4, mb: 1.5 } as const;

/**
 * Documents use `#` for their top sections while the layout already renders
 * the page title as the one `<h1>`, so every level moves down one; the
 * visual scale follows the element.
 */
const docsHeading =
  (component: 'h2' | 'h3' | 'h4' | 'h5' | 'h6', variant: 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2') =>
  // eslint-disable-next-line react/display-name
  ({ children, id, className, style }: { children?: ReactNode; id?: string; className?: string; style?: CSSProperties }) => (
    <Typography
      component={component}
      variant={variant}
      id={id}
      className={className}
      style={style}
      sx={{ ...HEADING_SX, ...(variant.startsWith('subtitle') ? { fontWeight: 700 } : {}) }}
    >
      {children}
    </Typography>
  );

/** next-image-export-optimizer can only re-encode these. */
const OPTIMIZABLE_LOCAL = /^\/images\/.+\.(jpe?g|png|webp|avif)$/i;
const OPTIMIZABLE_REMOTE = /^https?:\/\/.+\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i;

const docsComponents: Components = {
  h1: docsHeading('h2', 'h4'),
  h2: docsHeading('h3', 'h5'),
  h3: docsHeading('h4', 'h6'),
  h4: docsHeading('h5', 'subtitle1'),
  h5: docsHeading('h6', 'subtitle2'),
  h6: docsHeading('h6', 'subtitle2'),
  p: ({ children, className, style, id }) => (
    <Typography
      variant='body1'
      component='p'
      id={id}
      className={className}
      style={style}
      sx={{ lineHeight: 1.7, mb: 2 }}
    >
      {children}
    </Typography>
  ),
  a: ({ children, href, className, id, title, target }) => {
    // Legacy Bootstrap call-to-action links (`class="btn btn-primary"`).
    if (className?.split(/\s+/).includes('btn')) {
      const outlined = className.includes('btn-outline');
      return (
        <Button
          href={href ?? '#'}
          variant={outlined ? 'outlined' : 'contained'}
          color='primary'
          id={id}
          sx={{ m: 0.5 }}
        >
          {children}
        </Button>
      );
    }
    return (
      <Link href={href ?? '#'} className={className} id={id} title={title} target={target}>
        {children}
      </Link>
    );
  },
  img: ({ src, alt, width, height, style, className, title }) => {
    if (typeof src !== 'string' || src === '') return null;
    const declaredWidth = toPixels(width);
    const declaredHeight = toPixels(height);

    if (OPTIMIZABLE_LOCAL.test(src) || OPTIMIZABLE_REMOTE.test(src)) {
      return (
        <ExportedImage
          src={src}
          alt={alt ?? ''}
          title={title}
          className={className}
          width={declaredWidth ?? FALLBACK_IMAGE_WIDTH}
          height={declaredHeight ?? FALLBACK_IMAGE_HEIGHT}
          sizes={declaredWidth ? `(max-width: ${declaredWidth}px) 100vw, ${declaredWidth}px` : DOCS_IMAGE_SIZES}
          style={{
            maxWidth: '100%',
            width: declaredWidth ? `${declaredWidth}px` : undefined,
            height: 'auto',
            ...style,
          }}
        />
      );
    }

    // Icons and SVGs (guide-icons, logos) are served as they are.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ''}
        title={title}
        className={className}
        width={declaredWidth}
        height={declaredHeight}
        style={{ maxWidth: '100%', ...style }}
      />
    );
  },
  table: ({ children, className, style }) => (
    <Box className='md-table-scroll' sx={{ overflowX: 'auto', mb: 2 }}>
      <table className={className} style={style}>
        {children}
      </table>
    </Box>
  ),
  div: ({ children, className, id, style, title }) => (
    <div className={className} id={id} style={style} title={title}>
      {children}
    </div>
  ),
};

const DOCS_HIGHLIGHT_OPTIONS = {
  // Fences in the documents name `condor` (submit files: `key = value`
  // lines and `#` comments, which the ini grammar reads well) and
  // `dockerfile`, which is not in the bundled common set.
  aliases: { ini: ['condor'], bash: ['dockerfile', 'console', 'term'] },
  plainText: ['text', 'txt', 'plain'],
};

const MarkdownContainer = ({
  content,
  variant = 'default',
  components,
}: MarkdownContainerProps) => {
  if (variant === 'docs') {
    return (
      <div className='chtc-doc'>
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeHighlight, DOCS_HIGHLIGHT_OPTIONS]]}
          components={{ ...docsComponents, ...components }}
        >
          {content}
        </Markdown>
      </div>
    );
  }

  return (
    <Markdown
      rehypePlugins={[rehypeRaw]}
      components={{ ...defaultComponents, ...components }}
    >
      {content}
    </Markdown>
  );
};

export default MarkdownContainer;
