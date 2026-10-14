import { Box, Button, Link, Paper, Typography } from '@mui/material';
import TeamMarkdown from './Markdown';
import { formatCloseDate, slugify, type Job } from '../_lib/jobs';

/** One open position — the legacy `components/job-card.html`. */
export default function JobCard({ job }: { job: Job }) {
  const href = job.button?.href;

  return (
    <Paper elevation={3} sx={{ p: { xs: 2.5, md: 4 }, mb: 3, borderRadius: 2 }}>
      <Box sx={{ width: '2rem', height: 3, bgcolor: 'primary.main', borderRadius: 2, mb: 1 }} />
      <Typography id={slugify(job.title)} variant='h5' component='h3' sx={{ scrollMarginTop: 96 }}>
        {href ? <Link href={href}>{job.title}</Link> : job.title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 1, mt: 0.5 }}>
        <Typography variant='body2' color='text.secondary'>
          {[job.type, job.institution].filter(Boolean).join(' - ')}
        </Typography>
        {job.close_date != null && (
          <Typography variant='body2'>
            Applications Close: {formatCloseDate(job.close_date)}
          </Typography>
        )}
      </Box>
      {job.header && (
        <Typography variant='h6' component='p' sx={{ pt: 2, fontWeight: 400 }}>
          {job.header}
        </Typography>
      )}
      {job.text && (
        <Box sx={{ mt: 2 }}>
          <TeamMarkdown content={job.text} />
        </Box>
      )}
      {href && (
        <Button variant='contained' href={href}>
          {job.button?.text ?? 'View Posting'}
        </Button>
      )}
    </Paper>
  );
}
