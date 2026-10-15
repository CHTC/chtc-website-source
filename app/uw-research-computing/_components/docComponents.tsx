import type { CSSProperties, ReactNode } from 'react';
import ExportedImage from 'next-image-export-optimizer';
import { Box, Link, Typography } from '@mui/material';
import type { MDXComponents } from 'mdx/types';
import type { DocHeading } from '../_lib/docs';
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
  TableOfContents,
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
 * the rendered size, so an assumed landscape ratio is safe.
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
    return (
      <ExportedImage
        src={src}
        alt={alt ?? ''}
        title={title}
        className={className}
        width={declaredWidth ?? FALLBACK_WIDTH}
        height={declaredHeight ?? FALLBACK_HEIGHT}
        sizes={declaredWidth ? `(max-width: ${declaredWidth}px) 100vw, ${declaredWidth}px` : DOCS_IMAGE_SIZES}
        priority={loading === 'eager'}
        style={{ maxWidth: '100%', width: declaredWidth ? `${declaredWidth}px` : undefined, height: 'auto', ...style }}
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

/** Anchored headings must clear the sticky site header when jumped to. */
const HEADING_SX = { scrollMarginTop: '96px', mt: 4, mb: 1.5 } as const;

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
 * elements restyled with MUI, and the blocks the MDX can use by name.
 * `headings` feeds this page's `<TableOfContents />`.
 */
export function docComponents(headings: DocHeading[]): MDXComponents {
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
    table: ({ children, className, style }) => (
      <Box sx={{ overflowX: 'auto', mb: 2 }}>
        <table className={className} style={style}>
          {children}
        </table>
      </Box>
    ),

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
    TableOfContents: () => <TableOfContents headings={headings} />,

    GpuTable,
    FacilitatorGrid,
    UpcomingEvents,
  };
}
