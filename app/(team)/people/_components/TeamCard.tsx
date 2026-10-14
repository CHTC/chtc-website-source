import Link from 'next/link';
import { Box, Card, CardContent, Typography } from '@mui/material';
import Portrait from '../../_components/Portrait';
import type { TeamMember } from '../../_lib/team';

/** The name, linked to the person's website when they have one. */
function Name({ member }: { member: TeamMember }) {
  return member.website ? (
    <Link href={member.website} style={{ color: 'inherit', textDecoration: 'underline' }}>
      {member.name}
    </Link>
  ) : (
    <>{member.name}</>
  );
}

function MiniBar() {
  return <Box sx={{ width: '2rem', height: 3, bgcolor: 'primary.main', borderRadius: 2, mb: 1 }} />;
}

/** Grid widths below are xs 6 / sm 4 / md 3 / xl 2 of a `xl` container. */
const CARD_SIZES =
  '(max-width: 600px) 50vw, (max-width: 900px) 33vw, (max-width: 1536px) 25vw, 260px';
/** Leadership portrait column: ~40% of a half-width card on large screens. */
const LEADER_SIZES = '(max-width: 600px) 42vw, (max-width: 1200px) 30vw, 260px';

/**
 * A team member: portrait on top, then name, title and institution — the
 * legacy `team-card.html`.
 */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Portrait name={member.name} image={member.image} sizes={CARD_SIZES} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2 }}>
        <MiniBar />
        <Typography variant='subtitle1' component='h3' fontWeight={700} lineHeight={1.3}>
          <Name member={member} />
        </Typography>
        <Typography variant='body2' sx={{ mt: 0.5 }}>
          {member.title}
        </Typography>
        {member.institution && (
          <Typography variant='caption' color='text.secondary' sx={{ mt: 'auto', pt: 1.5 }}>
            {member.institution}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * A leadership card: portrait beside the text, two to a row on large screens
 * — the legacy `team-card-promoted.html`.
 */
export function LeaderCard({ member }: { member: TeamMember }) {
  return (
    <Card sx={{ height: '100%', display: 'flex' }}>
      <Box sx={{ width: { xs: '42%', sm: '33%', lg: '40%' }, flexShrink: 0 }}>
        <Portrait
          name={member.name}
          image={member.image}
          sizes={LEADER_SIZES}
          initialsSize='3rem'
        />
      </Box>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', p: { xs: 2, md: 3 } }}>
        <MiniBar />
        <Typography variant='h5' component='h3' fontWeight={700}>
          <Name member={member} />
        </Typography>
        <Typography sx={{ mt: 1 }}>{member.title}</Typography>
        {member.institution && (
          <Typography variant='body2' color='text.secondary' sx={{ mt: 'auto', pt: 2 }}>
            {member.institution}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
