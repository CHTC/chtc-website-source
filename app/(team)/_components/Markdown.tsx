import ExportedImage from 'next-image-export-optimizer';
import { Box, Link, Typography } from '@mui/material';
import type { ComponentProps, ReactNode } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

/*
 * Markdown (and raw HTML) for the fellowship reports, staff docs, job and
 * fellowship descriptions and the research list.
 *
 * `components/MarkdownContainer` is the site-wide renderer, but it has no
 * GitHub-flavoured tables and drops heading ids, and these documents rely on
 * both: the reports carry pipe tables, the staff docs link to their own
 * headings from a table of contents. Rather than change the shared component
 * this is a superset of it for this route group.
 */

/** Assumed image box when an `<img>` declares no size; CSS scales it. */
const FALLBACK_IMAGE_WIDTH = 1200;
const FALLBACK_IMAGE_HEIGHT = 800;
/** These documents sit in an `md` container at most. */
const BODY_IMAGE_SIZES = '(max-width: 900px) 100vw, 850px';

const toPixels = (value: unknown): number | undefined => {
  const parsed =
    typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

type HeadingProps = { id?: string; children?: ReactNode };

/** A heading that keeps the `id` rehype-slug gave it, so `#anchors` work. */
function heading(
  component: 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  variant: ComponentProps<typeof Typography>['variant'],
  mt: number
) {
  function Heading({ id, children }: HeadingProps) {
    return (
      <Typography
        id={id}
        variant={variant}
        component={component}
        gutterBottom
        sx={{ mt, scrollMarginTop: 96 }}
      >
        {children}
      </Typography>
    );
  }
  return Heading;
}

const linkSx = {
  color: '#b45309',
  fontWeight: 600,
  textUnderlineOffset: '0.15em',
  overflowWrap: 'anywhere',
  '&:hover': { color: 'primary.main', textDecoration: 'underline' },
} as const;

export default function TeamMarkdown({ content }: { content: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
      components={{
        // Pages render their own `<h1>`, so a document's top heading is an h2.
        h1: heading('h2', 'h4', 4),
        h2: heading('h2', 'h4', 4),
        h3: heading('h3', 'h5', 3),
        h4: heading('h4', 'h6', 2),
        h5: heading('h5', 'subtitle1', 2),
        h6: heading('h6', 'subtitle2', 2),
        p: ({ children }) => (
          <Typography paragraph sx={{ lineHeight: 1.7 }}>
            {children}
          </Typography>
        ),
        a: ({ href, children, id }) => (
          <Link id={id} href={href ?? '#'} sx={linkSx}>
            {children}
          </Link>
        ),
        ul: ({ children }) => (
          <Box component='ul' sx={{ pl: 3, mb: 2, lineHeight: 1.7, '& li': { mb: 0.75 } }}>
            {children}
          </Box>
        ),
        ol: ({ children }) => (
          <Box component='ol' sx={{ pl: 3, mb: 2, lineHeight: 1.7, '& li': { mb: 0.75 } }}>
            {children}
          </Box>
        ),
        blockquote: ({ children }) => (
          <Box
            component='blockquote'
            sx={{ borderLeft: 4, borderColor: 'primary.main', pl: 2, ml: 0, color: 'text.secondary' }}
          >
            {children}
          </Box>
        ),
        hr: () => (
          <Box component='hr' sx={{ my: 4, border: 0, borderTop: 1, borderColor: 'divider' }} />
        ),
        code: ({ children, className }) => (
          <Box
            component='code'
            className={className}
            sx={{
              bgcolor: 'grey.100',
              px: 0.5,
              borderRadius: 0.5,
              fontSize: '0.875em',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            }}
          >
            {children}
          </Box>
        ),
        pre: ({ children }) => (
          <Box
            component='pre'
            sx={{
              bgcolor: 'grey.100',
              p: 2,
              my: 2,
              borderRadius: 1,
              overflowX: 'auto',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              '& code': { bgcolor: 'transparent', p: 0 },
            }}
          >
            {children}
          </Box>
        ),
        table: ({ children }) => (
          <Box sx={{ overflowX: 'auto', my: 3 }}>
            <Box
              component='table'
              sx={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
                '& th, & td': { border: 1, borderColor: 'divider', p: 1, textAlign: 'left', verticalAlign: 'top' },
                '& thead th': { bgcolor: 'grey.100', fontWeight: 700 },
              }}
            >
              {children}
            </Box>
          </Box>
        ),
        img: ({ src, alt, width, height }) => {
          if (typeof src !== 'string' || src === '') return null;
          const declaredWidth = toPixels(width);
          return (
            <ExportedImage
              // The optimizer names variants after the file on disk, so a
              // percent-encoded space has to be decoded to match.
              src={src.startsWith('/') ? decodeURI(src) : src}
              alt={alt ?? ''}
              width={declaredWidth ?? FALLBACK_IMAGE_WIDTH}
              height={toPixels(height) ?? FALLBACK_IMAGE_HEIGHT}
              sizes={declaredWidth ? `${declaredWidth}px` : BODY_IMAGE_SIZES}
              style={{
                display: 'block',
                maxWidth: '100%',
                width: declaredWidth ? `${declaredWidth}px` : undefined,
                height: 'auto',
                margin: '1rem 0',
                border: '1px solid rgba(17,24,39,0.10)',
                borderRadius: 8,
              }}
            />
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
}
