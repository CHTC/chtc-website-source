import ExportedImage from 'next-image-export-optimizer';
import { Box, Typography } from '@mui/material';

type FigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** Largest width the image is shown at, in px. Defaults to the md content column. */
  maxWidth?: number;
  /** For animated images, which the optimizer would flatten to one frame. */
  unoptimized?: boolean;
  priority?: boolean;
};

/**
 * A local image in a prose page, at its own aspect ratio, optionally
 * captioned. For `page.mdx` files, whose markdown `![]()` images render as a
 * plain unoptimized `<img>`.
 */
export default function Figure({
  src,
  alt,
  width,
  height,
  caption,
  maxWidth = 852,
  unoptimized,
  priority,
}: FigureProps) {
  return (
    <Box component='figure' sx={{ my: 4, mx: 0 }}>
      <Box sx={{ maxWidth, mx: 'auto' }}>
        <ExportedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={`(max-width: ${maxWidth + 48}px) 100vw, ${maxWidth}px`}
          unoptimized={unoptimized}
          priority={priority}
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 10 }}
        />
      </Box>
      {caption && (
        <Typography
          component='figcaption'
          variant='body2'
          color='text.secondary'
          sx={{ mt: 1.5, fontStyle: 'italic', textAlign: 'center' }}
        >
          {caption}
        </Typography>
      )}
    </Box>
  );
}
