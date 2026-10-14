import { Box, Container, Grid, Link, Typography } from '@mui/material';
import { listingMetadata } from '@/utils/metadata';
import { recordStaffImages } from '@/utils/remoteImages';
import MiniBarHeading from '../_components/MiniBarHeading';
import PageHero from '../_components/PageHero';
import { byName, getTeam, hasStatus, type TeamMember } from '../_lib/team';
import { LeaderCard, TeamCard } from './_components/TeamCard';
import teamPhoto from '@/public/images/team/team_photos/team-2025.jpg';

export const metadata = listingMetadata(
  'Our Staff',
  'Meet the leadership, staff, students and past members of the Center for High Throughput Computing.',
  '/people/'
);

/** The legacy page's sections after Leadership, keyed on the staff-list `status`. */
const SECTIONS = [
  { status: 'Staff', title: 'Staff' },
  { status: 'Student', title: 'Students' },
  { status: 'Past', title: 'Previous Staff' },
] as const;

function MemberGrid({ members }: { members: TeamMember[] }) {
  return (
    <Grid container spacing={2}>
      {members.map((member, index) => (
        // Names are not unique: one person can hold two staff-list entries.
        <Grid key={`${member.name}-${index}`} size={{ xs: 6, sm: 4, md: 3, xl: 2 }}>
          <TeamCard member={member} />
        </Grid>
      ))}
    </Grid>
  );
}

export default async function Page() {
  const team = await getTeam();
  // Declare the portraits for the export image optimizer; see remoteImages.ts.
  recordStaffImages(team);

  const withStatus = (status: string) =>
    team.filter((member) => hasStatus(member, status)).sort(byName);

  return (
    <>
      <PageHero
        src={teamPhoto}
        alt='2025 CHTC Team Photo'
        height={{ xs: 240, sm: 400, md: 600 }}
        caption={
          <>
            2025 CHTC Team Picture.{' '}
            <Link href='/past_team_pictures/'>View old team photos</Link>
          </>
        }
      />

      <Box sx={{ bgcolor: 'grey.100', pt: 1, pb: 4 }}>
        <Container maxWidth='xl'>
          <Typography variant='h1' sx={{ mt: 4 }}>
            Our Staff
          </Typography>

          <MiniBarHeading>Leadership</MiniBarHeading>
          <Grid container spacing={2}>
            {withStatus('Leadership').map((member) => (
              <Grid key={member.name} size={{ xs: 12, lg: 6 }}>
                <LeaderCard member={member} />
              </Grid>
            ))}
          </Grid>

          {SECTIONS.map(({ status, title }) => (
            <Box key={status}>
              <MiniBarHeading>{title}</MiniBarHeading>
              <MemberGrid members={withStatus(status)} />
            </Box>
          ))}
        </Container>
      </Box>
    </>
  );
}
