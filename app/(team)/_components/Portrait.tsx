import ExportedImage from 'next-image-export-optimizer';
import { Box, Typography } from '@mui/material';

/** First letters of the first and last name, for the placeholder. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/**
 * A square staff headshot. The page that renders it must record the URL with
 * `recordStaffImages` so the export optimizer generates its variants.
 *
 * The initials sit behind the photo rather than being swapped in on error, so
 * a staff entry pointing at a missing image still shows something.
 *
 * `sizes` is the box width: the staff-list headshots are portrait or
 * near-square (the widest is 3:2), so `objectFit: cover` paints them at most
 * a little wider than the box and the next variant up covers it.
 */
export default function Portrait({
  name,
  image,
  sizes,
  initialsSize = '2.25rem',
}: {
  name: string;
  image?: string;
  sizes: string;
  initialsSize?: string;
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: 1,
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'grey.200',
        overflow: 'hidden',
      }}
    >
      <Typography
        aria-hidden
        sx={{ fontSize: initialsSize, fontWeight: 700, color: 'grey.500', userSelect: 'none' }}
      >
        {initials(name)}
      </Typography>
      {image && (
        <ExportedImage
          src={image}
          alt={`Headshot for ${name}`}
          fill
          sizes={sizes}
          style={{ objectFit: 'cover', objectPosition: 'top' }}
        />
      )}
    </Box>
  );
}
