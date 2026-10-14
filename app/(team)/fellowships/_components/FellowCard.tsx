import Link from 'next/link';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import Portrait from '../../_components/Portrait';
import TeamMarkdown from '../../_components/Markdown';
import { reportHref, type Fellowship, type TeamMember } from '../../_lib/team';
import { slugify } from '../../_lib/jobs';

/** The portrait column is a quarter of a card that is at most ~600px wide. */
const PORTRAIT_SIZES = '(max-width: 600px) 25vw, 160px';

/**
 * A fellow, their mentors, the project and a link to the final report — the
 * legacy `components/fellow-card.html`.
 */
export default function FellowCard({
  member,
  hasReport,
}: {
  member: TeamMember & { fellowship: Fellowship };
  hasReport: boolean;
}) {
  const { fellowship } = member;

  return (
    <Card id={slugify(member.name)} sx={{ height: '100%', scrollMarginTop: 96 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
          <Box sx={{ width: '25%', flexShrink: 0 }}>
            <Portrait name={member.name} image={member.image} sizes={PORTRAIT_SIZES} />
          </Box>
          <Box sx={{ pt: 1 }}>
            <Box sx={{ width: '2rem', height: 3, bgcolor: 'primary.main', borderRadius: 2, mb: 1 }} />
            <Typography variant='h5' component='h3' fontWeight={700}>
              {member.website ? (
                <Link href={member.website} style={{ color: 'inherit', textDecoration: 'underline' }}>
                  {member.name}
                </Link>
              ) : (
                member.name
              )}
            </Typography>
            {fellowship.mentor && (
              <Typography variant='body2' sx={{ mt: 1 }}>
                <strong>Mentor(s):</strong> {fellowship.mentor}
              </Typography>
            )}
            <Typography variant='body2' color='text.secondary'>
              {fellowship.year} Fellow
            </Typography>
          </Box>
        </Box>
        <Typography variant='h6' component='h4' sx={{ mt: 3, mb: 1 }}>
          {fellowship.name}
        </Typography>
        {fellowship.description && <TeamMarkdown content={fellowship.description} />}
        {hasReport && (
          <Button variant='contained' href={reportHref(member)}>
            Read Final Report
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
