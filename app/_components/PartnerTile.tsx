import ExportedImage from 'next-image-export-optimizer';
import { Box, Typography } from '@mui/material';

/**
 * A logo-and-name tile linking to a partner project; the legacy
 * `title-img-card.html` include.
 */
export default function PartnerTile({
  title,
  href,
  image,
}: {
  title: string;
  href: string;
  image: { src: string; width: number; height: number; alt: string };
}) {
  return (
    <Box
      component='a'
      href={href}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
        textDecoration: 'none',
        color: 'text.primary',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 4,
        transition: 'box-shadow .2s ease, transform .2s ease, border-color .2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 32px rgba(31, 39, 51, 0.10)',
          borderColor: 'transparent',
        },
      }}
    >
      <Box sx={{ height: 88, display: 'flex', alignItems: 'center' }}>
        <ExportedImage
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          // Painted 88px tall, so the widest of these (xDD, ~1.5:1) is ~130px.
          sizes='130px'
          style={{ height: '100%', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
        />
      </Box>
      <Typography variant='h6' component='h3'>
        {title}
      </Typography>
    </Box>
  );
}
