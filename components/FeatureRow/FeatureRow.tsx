import type { ReactNode } from 'react';
import ExportedImage from 'next-image-export-optimizer';
import { Box, Link, Typography } from '@mui/material';
import MiniBarHeading from '@/components/MiniBarHeading';

type FeatureRowProps = {
  title: string;
  /** Links the title and the image (the legacy partner rows did this). */
  href?: string;
  image: { src: string; width: number; height: number; alt: string };
  /** Put the image on the left on wide screens instead of the right. */
  imageFirst?: boolean;
  /** Cap on the image's painted width, in px. */
  imageMaxWidth?: number;
  children: ReactNode;
};

/**
 * A heading and a paragraph or two beside an illustration or logo.
 *
 * The React form of the legacy `title-desc-img-card.html` and
 * `sub-title-desc-img-card.html` includes. On phones the image sits small
 * above the text rather than being hidden, as the legacy markup did.
 */
export default function FeatureRow({
  title,
  href,
  image,
  imageFirst = false,
  imageMaxWidth = 280,
  children,
}: FeatureRowProps) {
  const picture = (
    <ExportedImage
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={`${imageMaxWidth}px`}
      style={{ width: '100%', height: 'auto', maxWidth: imageMaxWidth, display: 'block', margin: '0 auto' }}
    />
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: imageFirst ? 'row-reverse' : 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        gap: { xs: 3, md: 8 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ flex: '1 1 0', minWidth: 0, order: { xs: 2, md: 0 } }}>
        <MiniBarHeading sx={{ mb: 2 }}>
          {href ? (
            <Link href={href} color='inherit' underline='hover'>
              {title}
            </Link>
          ) : (
            title
          )}
        </MiniBarHeading>
        <Box
          sx={{
            '& p': { lineHeight: 1.7, mb: 1.5 },
            '& p:last-child': { mb: 0 },
            '& a': { fontWeight: 600 },
          }}
        >
          {children}
        </Box>
      </Box>
      <Box
        sx={{
          flex: { md: '0 0 32%' },
          maxWidth: { xs: Math.min(imageMaxWidth, 180), md: 'none' },
          mx: { xs: 'auto', md: 0 },
          order: { xs: 1, md: 0 },
        }}
      >
        {href ? (
          <Link href={href} aria-label={title} sx={{ display: 'block' }}>
            {picture}
          </Link>
        ) : (
          picture
        )}
      </Box>
    </Box>
  );
}

/** A paragraph in a FeatureRow body. */
export function FeatureText({ children }: { children: ReactNode }) {
  return <Typography component='p'>{children}</Typography>;
}
