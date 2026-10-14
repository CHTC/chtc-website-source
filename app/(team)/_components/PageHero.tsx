import ExportedImage from 'next-image-export-optimizer';
import { Box, Typography } from '@mui/material';
import type { StaticImageData } from 'next/image';

/**
 * A full-width banner photo with an optional caption — the legacy
 * `<figure><img class="w-100" style="object-fit: cover; max-height: …">`
 * that opens several of these pages.
 */
export default function PageHero({
  src,
  alt,
  height,
  caption,
}: {
  src: StaticImageData;
  alt: string;
  /** Box height per breakpoint; the photo is cropped to fill it. */
  height: { xs: number; sm?: number; md?: number };
  caption?: React.ReactNode;
}) {
  // With `cover`, a short box on a narrow screen paints the photo wider than
  // the viewport (height × aspect ratio), so `sizes` names whichever is wider
  // at the top of each breakpoint (guide §7.1).
  const ratio = src.width / src.height;
  const painted = (viewport: number, boxHeight: number) =>
    Math.round(Math.max(viewport, boxHeight * ratio));
  const sm = height.sm ?? height.xs;
  const md = height.md ?? sm;
  const sizes = [
    `(max-width: 600px) ${painted(600, height.xs)}px`,
    `(max-width: 900px) ${painted(900, sm)}px`,
    `(max-width: 1200px) ${painted(1200, md)}px`,
    '100vw',
  ].join(', ');

  return (
    <Box component='figure' sx={{ m: 0 }}>
      <Box sx={{ position: 'relative', width: '100%', height }}>
        <ExportedImage
          src={src}
          alt={alt}
          fill
          priority
          sizes={sizes}
          style={{ objectFit: 'cover' }}
        />
      </Box>
      {caption && (
        <Typography
          component='figcaption'
          variant='body2'
          sx={{ px: 2, py: 0.75, bgcolor: 'grey.100' }}
        >
          {caption}
        </Typography>
      )}
    </Box>
  );
}
