import ExportedImage from 'next-image-export-optimizer';
import { Box, Grid, Link, Stack, Typography } from '@mui/material';
import ContentPage from '@/components/ContentPage';
import { listingMetadata } from '@/utils/metadata';

export const metadata = listingMetadata(
  'CHTC Branding',
  'CHTC brand colors and downloadable logo files.',
  '/branding/'
);

const COLORS = [
  { name: 'CHTC Red', hex: '#B61F24' },
  { name: 'CHTC Black', hex: '#000000' },
];

const LOGOS = [
  { label: 'CHTC Logo W/Text', src: '/images/logos/CHTC_Logo_Full_Color_W_Text.svg', width: 1210, height: 216, dark: false },
  { label: 'CHTC Logo', src: '/images/logos/CHTC_Logo_Full_Color.svg', width: 704, height: 216, dark: false },
  { label: 'White CHTC Logo W/Text', src: '/images/logos/CHTC_Logo_White_W_Text.svg', width: 1210, height: 216, dark: true },
  { label: 'White CHTC Logo', src: '/images/logos/CHTC_Logo_White.svg', width: 704, height: 216, dark: true },
];

export default function Page() {
  return (
    <ContentPage title='CHTC Branding'>
      <Typography variant='h4' component='h2' gutterBottom>
        Colors
      </Typography>
      <Stack spacing={1.5} sx={{ mb: 6 }}>
        {COLORS.map((color) => (
          <Box key={color.hex} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: color.hex, flexShrink: 0 }}
              aria-hidden='true'
            />
            <Typography>
              {color.name}: <code>{color.hex}</code>
            </Typography>
          </Box>
        ))}
      </Stack>

      <Typography variant='h4' component='h2' gutterBottom>
        Logos
      </Typography>
      <Typography paragraph>Select a logo to open the SVG file.</Typography>
      <Grid container spacing={3}>
        {LOGOS.map((logo) => (
          <Grid key={logo.src} size={{ xs: 12, sm: 6 }}>
            <Link
              href={logo.src}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                height: '100%',
                fontWeight: 600,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  minHeight: 140,
                  borderRadius: 3,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: logo.dark ? 'secondary.main' : 'background.paper',
                }}
              >
                <ExportedImage
                  src={logo.src}
                  alt={logo.label}
                  width={logo.width}
                  height={logo.height}
                  style={{ width: '100%', height: 'auto', maxHeight: 80, objectFit: 'contain' }}
                />
              </Box>
              {logo.label}
            </Link>
          </Grid>
        ))}
      </Grid>
    </ContentPage>
  );
}
