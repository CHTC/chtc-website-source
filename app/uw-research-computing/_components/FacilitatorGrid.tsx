import ExportedImage from 'next-image-export-optimizer';
import { Box, Typography } from '@mui/material';
import { getStaff } from '@/utils/staff';
import { recordStaffImages } from '@/utils/remoteImages';

/** Portrait diameter; legacy used 12rem. */
const SIZE = 192;

/**
 * The facilitator portraits on "The Facilitation Team": everyone on the CHTC
 * team flagged `is_facilitator` in CHTC/staff-list, by weight — what the
 * legacy `get/team.liquid` loop selected.
 */
const FacilitatorGrid = async () => {
  const staff = await getStaff('chtc');
  const facilitators = staff
    .filter(
      (person) =>
        person.organizations?.includes('chtc') &&
        String((person as { is_facilitator?: unknown }).is_facilitator) === '1'
    )
    .sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
  recordStaffImages(facilitators);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: 2,
        my: 3,
      }}
    >
      {facilitators.map((person) => (
        <Box component='figure' key={person.name} sx={{ m: 0, p: 1, textAlign: 'center', width: SIZE + 16 }}>
          <ExportedImage
            src={person.image}
            alt={`${person.name}'s headshot`}
            width={SIZE}
            height={SIZE}
            sizes={`${SIZE}px`}
            style={{ objectFit: 'cover', borderRadius: '50%', width: SIZE, height: SIZE }}
          />
          <Typography component='figcaption' variant='body2' sx={{ mt: 1 }}>
            <strong>{person.name}</strong>
            <br />
            {person.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default FacilitatorGrid;
