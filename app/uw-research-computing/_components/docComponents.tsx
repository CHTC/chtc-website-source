import fs from 'fs';
import path from 'path';
import type { CSSProperties, ReactNode } from 'react';
import { imageSize } from 'image-size';
import ExportedImage from 'next-image-export-optimizer';
import { Box, Link, Typography } from '@mui/material';
import type { MDXComponents } from 'mdx/types';
import { SCROLL_MARGIN } from '../_lib/layout';
import {
  Button,
  ButtonRow,
  Card,
  Cards,
  Column,
  Columns,
  CommandTable,
  File,
  Footnote,
  MiniBar,
  Terminal,
  Tip,
} from './DocBlocks';
import FacilitatorGrid from './FacilitatorGrid';
import GpuTable from './GpuTable';
import UpcomingEvents from './UpcomingEvents';

/* Images -------------------------------------------------------------------- */

/** next-image-export-optimizer can only re-encode these. */
const OPTIMIZABLE_LOCAL = /^\/images\/.+\.(jpe?g|png|webp|avif)$/i;
const OPTIMIZABLE_REMOTE = /^https?:\/\/.+\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i;

/*
 * Doc images rarely declare dimensions. `ExportedImage` needs both — for the
 * placeholder's aspect ratio and to cap the srcset — while the CSS decides
 * the rendered size. Files under `public/` are measured at build time;
 * remote images get an assumed landscape ratio, which is safe because the
 * CSS keeps `height: auto`.
 */
const FALLBACK_WIDTH = 1200;
const FALLBACK_HEIGHT = 800;
/** The docs column is at most ~900px wide beside the guide sidebar. */
const DOCS_IMAGE_SIZES = '(max-width: 900px) 100vw, 900px';

/** Parse an HTML dimension attribute (`800`, `800px`). */
const toPixels = (value: unknown): number | undefined => {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

/** A CSS length in pixels (`300`, `'300px'`); anything relative is `undefined`. */
const cssPixels = (value: unknown): number | undefined => {
  if (typeof value === 'number') return value > 0 ? value : undefined;
  const match = /^\s*(\d+(?:\.\d+)?)px\s*$/.exec(String(value ?? ''));
  return match ? Number(match[1]) : undefined;
};

/**
 * Intrinsic size of an image served from `public/`. Without it a small
 * picture would be stretched to the column: the srcset's `w` descriptors make
 * the browser size the image to `sizes`, not to its pixels.
 */
const localDimensions = (src: string): { width: number; height: number } | undefined => {
  if (!src.startsWith('/')) return undefined;
  try {
    const file = path.join(process.cwd(), 'public', decodeURI(src.split(/[?#]/)[0]));
    const { width, height } = imageSize(fs.readFileSync(file));
    return width && height ? { width, height } : undefined;
  } catch {
    return undefined;
  }
};

type ImgProps = {
  src?: string;
  alt?: string;
  title?: string;
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
  className?: string;
  loading?: 'eager' | 'lazy';
};

const DocImage = ({ src, alt, title, width, height, style, className, loading }: ImgProps) => {
  if (!src) return null;
  const declaredWidth = toPixels(width);
  const declaredHeight = toPixels(height);

  if (OPTIMIZABLE_LOCAL.test(src) || OPTIMIZABLE_REMOTE.test(src)) {
    const intrinsic = localDimensions(src);
    // A declared width is what the image renders at; otherwise a local file
    // renders at its own width. `maxWidth` only ever shrinks either.
    const renderWidth = declaredWidth ?? intrinsic?.width;
    const imageWidth = renderWidth ?? FALLBACK_WIDTH;
    const imageHeight =
      declaredHeight ??
      (intrinsic ? Math.round((intrinsic.height * imageWidth) / intrinsic.width) : FALLBACK_HEIGHT);
    // With a fixed width, `maxWidth` and a document's `maxHeight` would clamp
    // each side separately and squash the image, so a pixel `maxHeight` is
    // folded into the width up front. `width: auto` is no way out: the
    // optimizer never upscales, so the srcset's `w` descriptors overstate
    // small images and the browser would shrink them.
    const maxHeight = cssPixels(style?.maxHeight);
    const fitWidth =
      renderWidth && maxHeight
        ? Math.min(renderWidth, Math.round((maxHeight * imageWidth) / imageHeight))
        : renderWidth;
    return (
      <ExportedImage
        src={src}
        alt={alt ?? ''}
        title={title}
        className={className}
        width={imageWidth}
        height={imageHeight}
        // Narrower than the column, the image's own width is the better hint.
        sizes={
          renderWidth && renderWidth < 900
            ? `(max-width: ${renderWidth}px) 100vw, ${renderWidth}px`
            : DOCS_IMAGE_SIZES
        }
        priority={loading === 'eager'}
        style={{
          maxWidth: '100%',
          width: fitWidth ? `${fitWidth}px` : undefined,
          height: 'auto',
          // Not a pixel cap, so it cannot be folded into the width: letterbox
          // rather than squash.
          ...(style?.maxHeight && !maxHeight ? { objectFit: 'contain' as const } : {}),
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
};

/* Headings ------------------------------------------------------------------ */

/** Anchored headings must clear the sticky bars when jumped to. */
const HEADING_SX = { scrollMarginTop: `${SCROLL_MARGIN}px`, mt: 4, mb: 1.5 } as const;

type HeadingProps = { children?: ReactNode; id?: string; className?: string; style?: CSSProperties };

/**
 * Documents use `#` for their top sections while the layout already renders
 * the page title as the one `<h1>`, so every level moves down one; the
 * visual scale follows the element.
 */
const heading =
  (component: 'h2' | 'h3' | 'h4' | 'h5' | 'h6', variant: 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2') =>
  // eslint-disable-next-line react/display-name
  ({ children, id, className, style }: HeadingProps) => (
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

/* The map --------------------------------------------------------------------- */

/**
 * The components a documentation page is rendered with: the markdown
 * elements restyled with MUI, the two names the remark plugins write, and
 * the standard blocks, which a document uses by name without an import.
 * `DocBody` adds `ExcerptTabs`, which renders documents itself.
 */
export function docComponents(): MDXComponents {
  return {
    h1: heading('h2', 'h4'),
    h2: heading('h3', 'h5'),
    h3: heading('h4', 'h6'),
    h4: heading('h5', 'subtitle1'),
    h5: heading('h6', 'subtitle2'),
    h6: heading('h6', 'subtitle2'),
    p: ({ children, className, style, id }) => (
      <Typography variant='body1' component='p' id={id} className={className} style={style} sx={{ lineHeight: 1.7, mb: 2 }}>
        {children}
      </Typography>
    ),
    a: ({ children, href, className, id, title, target }) => (
      <Link href={href ?? '#'} className={className} id={id} title={title} target={target}>
        {children}
      </Link>
    ),
    img: (props) => <DocImage {...(props as ImgProps)} />,
    // Literal `<img>` tags, renamed by `remarkJsxImages`.
    DocImage: (props: ImgProps) => <DocImage {...props} />,
    table: ({ children, className, style }) => (
      <Box sx={{ overflowX: 'auto', mb: 2 }}>
        <table className={className} style={style}>
          {children}
        </table>
      </Box>
    ),
    // `mdx-components.tsx` restyles these (and wraps the page in a Container)
    // for the `page.mdx` pages; documents style them through `.chtc-doc` in
    // globals.css, so they render as the plain elements.
    wrapper: ({ children }) => <>{children}</>,
    ul: (props) => <ul {...props} />,
    ol: (props) => <ol {...props} />,
    li: (props) => <li {...props} />,
    blockquote: (props) => <blockquote {...props} />,
    code: (props) => <code {...props} />,
    pre: (props) => <pre {...props} />,
    hr: (props) => <hr {...props} />,
    // Everything after the excerpt (`remarkDocExcerpt`).
    DocMore: ({ children }: { children?: ReactNode }) => <>{children}</>,

    Tip,
    Terminal,
    File,
    CommandTable,
    MiniBar,
    Footnote,
    Button,
    ButtonRow,
    Columns,
    Column,
    Cards,
    Card,

    GpuTable,
    FacilitatorGrid,
    UpcomingEvents,
  };
}
