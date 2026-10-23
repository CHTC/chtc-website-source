import type { ReactNode } from 'react';
import ExportedImage from 'next-image-export-optimizer';
import { Box, Typography } from '@mui/material';

type PartnerTileProps = {
  title: string;
  href: string;
  image?: { src: string; width: number; height: number; alt: string };
  /** Drawn in place of `image`, for a logo that is a component (`FabAIDWordmark`). */
  logo?: ReactNode;
  /** Optional blurb under the name; tiles without one are logo-and-name only. */
  children?: ReactNode;
  /** Painted height of the logo, in px. */
  logoHeight?: number;
};

/**
 * A card linking to a partner project or institution: a logo, a name and,
 * optionally, a short description. Descends from the legacy
 * `title-img-card.html` include.
 */
export default function PartnerTile({
  title,
  href,
  image,
  logo,
  children,
  logoHeight = 88,
}: PartnerTileProps) {
  // The widest logos (UW-Madison) are ~3.5:1, so cap the srcset there.
  const sizes = `${Math.round(logoHeight * 3.5)}px`;

  return (
    <Box
      component='a'
      href={href}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: children ? 'flex-start' : 'center',
        gap: 2,
        p: 3,
        textDecoration: 'none',
        color: 'text.primary',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        transition: 'box-shadow .2s ease, transform .2s ease, border-color .2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 32px rgba(31, 39, 51, 0.10)',
          borderColor: 'transparent',
        },
      }}
    >
      <Box sx={{ height: logoHeight, display: 'flex', alignItems: 'center' }}>
        {logo ??
          (image && (
            <ExportedImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes={sizes}
              style={{ height: '100%', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
            />
          ))}
      </Box>
      <Typography variant='h6' component='h3' sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
      {children && (
        <Typography variant='body2' sx={{ textAlign: 'center', lineHeight: 1.6, color: 'text.secondary' }}>
          {children}
        </Typography>
      )}
    </Box>
  );
}
