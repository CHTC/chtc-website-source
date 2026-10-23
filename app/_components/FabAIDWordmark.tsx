import { Red_Hat_Display } from 'next/font/google';
import ExportedImage from 'next-image-export-optimizer';
import { Box } from '@mui/material';

/* The wordmark from fabaid.io's header: the fabric mark beside "Fab" and a red "AID". */

const display = Red_Hat_Display({ subsets: ['latin'], weight: '700' });

const INK = '#17140F';
const RED = '#B61F24';

type FabAIDWordmarkProps = {
  /** Height of the mark, in px; the text scales with it. */
  size?: number;
};

export default function FabAIDWordmark({ size = 38 }: FabAIDWordmarkProps) {
  return (
    <Box
      component='span'
      role='img'
      aria-label='FabAID logo'
      sx={{ display: 'flex', alignItems: 'center', gap: `${(size * 10) / 38}px` }}
    >
      <ExportedImage
        src='/images/logos/FabAID_Mark.svg'
        alt=''
        aria-hidden='true'
        width={size}
        height={size}
        style={{ display: 'block', flex: 'none' }}
      />
      <Box
        component='span'
        aria-hidden='true'
        className={display.className}
        sx={{
          // 1.5rem beside the 38px mark on fabaid.io.
          fontSize: `${(size * 24) / 38}px`,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: INK,
        }}
      >
        Fab
        <Box component='b' sx={{ color: RED }}>
          AID
        </Box>
      </Box>
    </Box>
  );
}
