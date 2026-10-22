import ExportedImage from 'next-image-export-optimizer';
import { Box, Link, Typography } from '@mui/material';
import Markdown, { type Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';

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

/** Parse an HTML dimension attribute, which arrives as a string. */
const toPixels = (value: unknown): number | undefined => {
  const parsed =
    typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export interface MarkdownContainerProps {
  content: string;
  /** Extra element renderers, merged over the defaults. */
  components?: Components;
}

/**
 * Markdown from the shared content repositories (event bodies, fellowship
 * reports): GitHub-flavored text with raw HTML allowed, restyled with MUI.
 * The research-computing documentation is MDX and does not come through
 * here; see `app/uw-research-computing/_components/DocBody.tsx`.
 */
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
          borderRadius: 10,
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

const MarkdownContainer = ({ content, components }: MarkdownContainerProps) => (
  <Markdown rehypePlugins={[rehypeRaw]} components={{ ...defaultComponents, ...components }}>
    {content}
  </Markdown>
);

export default MarkdownContainer;
