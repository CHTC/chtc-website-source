'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { push } from '@socialgouv/matomo-next';
import { Box, Button, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

/*
 * "Was this page helpful?" at the foot of every guide, reported to Matomo as
 * events in the `Doc feedback` category (Matomo also records the page URL
 * with each event):
 *
 * - a face, sent when it is clicked: action `Helpful` or `Not helpful`, name
 *   the page path, value 1 or 0 (so the event's average value is the share
 *   of readers who found the page helpful);
 * - the optional comment, sent on submit: action `Comment (helpful)` or
 *   `Comment (not helpful)`, name the page path and the comment.
 *
 * Without the Matomo environment variables nothing loads the tracker, and the
 * events only queue up in `window._paq`.
 */

const CATEGORY = 'Doc feedback';
const MAX_COMMENT = 500;

type Rating = 'helpful' | 'not helpful';

const track = (action: string, name: string, value?: number) => {
  try {
    push(value === undefined ? ['trackEvent', CATEGORY, action, name] : ['trackEvent', CATEGORY, action, name, value]);
  } catch {
    console.error('Matomo failed to track doc feedback');
  }
};

function Feedback({ path }: { path: string }) {
  const [rating, setRating] = useState<Rating | null>(null);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  const rate = (value: Rating) => {
    setRating(value);
    track(value === 'helpful' ? 'Helpful' : 'Not helpful', path, value === 'helpful' ? 1 : 0);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = comment.trim();
    if (!rating || !text) return;
    track(`Comment (${rating})`, `${path} | ${text}`);
    setSent(true);
  };

  const face = (value: Rating, label: string, Icon: typeof SentimentSatisfiedAltIcon) => (
    <Tooltip title={label}>
      {/* The span keeps the tooltip working once the button is disabled. */}
      <span>
        <IconButton
          aria-label={label}
          aria-pressed={rating === value}
          disabled={rating !== null}
          onClick={() => rate(value)}
          sx={{
            color: rating === value ? 'primary.main' : 'text.secondary',
            '&.Mui-disabled': { color: rating === value ? 'primary.main' : 'action.disabled' },
          }}
        >
          <Icon fontSize='large' />
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <Box
      component='section'
      aria-labelledby='doc-feedback-title'
      data-pagefind-ignore
      sx={{ mt: 6, mb: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Typography id='doc-feedback-title' component='h2' sx={{ fontWeight: 600, mr: 1 }}>
          Was this page helpful?
        </Typography>
        {face('helpful', 'Yes, this page was helpful', SentimentSatisfiedAltIcon)}
        {face('not helpful', 'No, this page was not helpful', SentimentDissatisfiedIcon)}
      </Box>

      {rating && !sent && (
        <Box component='form' onSubmit={submit} sx={{ mt: 1.5, maxWidth: 640 }}>
          <Typography variant='body2' sx={{ mb: 1.5 }}>
            Thanks for letting us know. Anything to add? (optional)
          </Typography>
          <TextField
            label={rating === 'helpful' ? 'What helped?' : 'What was missing or unclear?'}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            multiline
            minRows={3}
            fullWidth
            slotProps={{ htmlInput: { maxLength: MAX_COMMENT } }}
            helperText={`Please don't include personal information. For help with your account or jobs, email chtc@cs.wisc.edu. ${comment.length}/${MAX_COMMENT}`}
          />
          <Button type='submit' variant='contained' disabled={!comment.trim()} sx={{ mt: 1.5 }}>
            Send feedback
          </Button>
        </Box>
      )}

      {sent && (
        <Typography variant='body2' role='status' sx={{ mt: 1.5 }}>
          Thanks for your feedback!
        </Typography>
      )}
    </Box>
  );
}

/** Starts over on each page, since client-side navigation keeps the layout mounted. */
export default function DocFeedback() {
  const path = usePathname() ?? '';
  return <Feedback key={path} path={path} />;
}
