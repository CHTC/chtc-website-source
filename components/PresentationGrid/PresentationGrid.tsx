'use client';

import {
  PresentationCard,
  type BackendPresentation,
} from '@chtc/web-components/content';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

/** Every keyword in use, alphabetically. */
function getAllKeywords(presentations: BackendPresentation[]): string[] {
  return [...new Set(presentations.flatMap((p) => p.keywords ?? []))].sort();
}

/** Every event a presentation was given at, alphabetically. */
function getAllEvents(presentations: BackendPresentation[]): string[] {
  return [
    ...new Set(
      presentations.flatMap((p) => (p.event ? [p.event] : []))
    ),
  ].sort();
}

/**
 * The presentations listing with its event and keyword filters, ported from
 * the legacy `presentations-list.js`: one event at a time, any of several
 * keywords, and a reset. Adapted from the OSG site's component.
 */
export function PresentationGrid({
  presentations,
}: {
  presentations: BackendPresentation[];
}) {
  const [eventFilter, setEventFilter] = useState<string>('');
  const [keywordFilter, setKeywordFilter] = useState<string[]>([]);

  const allEvents = useMemo(() => getAllEvents(presentations), [presentations]);
  const allKeywords = useMemo(
    () => getAllKeywords(presentations),
    [presentations]
  );

  // Seed the filters from the query string so other pages can deep-link into a
  // pre-filtered view, e.g. /presentations?keyword=Facilitation. `keyword` is
  // repeatable or comma-separated; `event` takes a single value. Values that
  // match nothing in the current data are ignored.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const keywords = params
      .getAll('keyword')
      .flatMap((value) => value.split(','))
      .map((value) => value.trim())
      .filter((value) => allKeywords.includes(value));
    if (keywords.length > 0) {
      setKeywordFilter(keywords);
    }

    const event = params.get('event');
    if (event && allEvents.includes(event)) {
      setEventFilter(event);
    }
    // Read once on mount; afterwards the controls own the filter state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPresentations = useMemo(
    () =>
      presentations
        .filter((presentation) => {
          const matchesEvent =
            eventFilter === '' || presentation.event === eventFilter;
          const matchesKeywords =
            keywordFilter.length === 0 ||
            keywordFilter.some(
              (keyword) => presentation.keywords?.includes(keyword) ?? false
            );
          return matchesEvent && matchesKeywords;
        })
        // Newest first.
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [eventFilter, keywordFilter, presentations]
  );

  return (
    <Box>
      <Box display='flex' flexDirection='row' flexWrap='wrap' gap={2}>
        <FormControl sx={{ minWidth: 180, maxWidth: '100%' }} size='small'>
          <InputLabel id='event-select-label'>Event</InputLabel>
          <Select
            labelId='event-select-label'
            value={eventFilter}
            label='Event'
            onChange={(e) => setEventFilter(e.target.value)}
          >
            {allEvents.map((event) => (
              <MenuItem key={event} value={event}>
                {event}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 220, maxWidth: '100%' }} size='small'>
          <InputLabel id='keyword-select-label'>Keywords</InputLabel>
          <Select
            labelId='keyword-select-label'
            id='keyword-select'
            multiple
            value={keywordFilter}
            label='Keywords'
            onChange={(e) =>
              setKeywordFilter(
                typeof e.target.value === 'string'
                  ? e.target.value.split(',')
                  : e.target.value
              )
            }
            input={<OutlinedInput label='Keywords' />}
            renderValue={(selected) => selected.join(', ')}
          >
            {allKeywords.map((keyword) => (
              <MenuItem key={keyword} value={keyword} sx={{ p: 0, pr: 2 }}>
                <Checkbox checked={keywordFilter.includes(keyword)} />
                <ListItemText primary={keyword} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(eventFilter !== '' || keywordFilter.length !== 0) && (
          <Button
            variant='outlined'
            onClick={() => {
              setEventFilter('');
              setKeywordFilter([]);
            }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      <Grid container spacing={2} mt={3}>
        {filteredPresentations.map((presentation) => (
          <Grid
            key={presentation.slug.join('/')}
            size={{ xs: 12, md: 6, lg: 4 }}
          >
            <PresentationCard
              href={`/presentations/${presentation.slug.join('/')}/`}
              presentation={presentation}
              cardSx={{ width: '100%', height: '100%' }}
              maxDescriptionHeight={'4.5em'}
            />
          </Grid>
        ))}
      </Grid>

      {filteredPresentations.length === 0 && (
        <Typography variant='body1' color='text.secondary' textAlign='center' py={5}>
          No presentations found.
        </Typography>
      )}
    </Box>
  );
}
