'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import ResourceIcon from '../_components/ResourceIcon';
import type { LearningResource } from '../_lib/learningResources';

const PAGE_SIZE = 12;

type Sort = 'featured' | 'updated-desc' | 'updated-asc' | 'title-asc' | 'title-desc';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'featured', label: 'Featured first' },
  { value: 'updated-desc', label: 'Recently updated' },
  { value: 'updated-asc', label: 'Least recently updated' },
  { value: 'title-asc', label: 'Title (A–Z)' },
  { value: 'title-desc', label: 'Title (Z–A)' },
];

const byTitle = (a: LearningResource, b: LearningResource) =>
  a.text.toLowerCase().localeCompare(b.text.toLowerCase());

/** Undated resources sort last whichever way the dates run. */
const byDate = (a: LearningResource, b: LearningResource) => {
  if (a.updated === b.updated) return byTitle(a, b);
  if (!a.updated) return 1;
  if (!b.updated) return -1;
  return a.updated < b.updated ? -1 : 1;
};

function sortResources(list: LearningResource[], sort: Sort): LearningResource[] {
  const compare = {
    featured: (a: LearningResource, b: LearningResource) =>
      a.featured !== b.featured ? (a.featured ? -1 : 1) : byDate(b, a),
    'updated-desc': (a: LearningResource, b: LearningResource) => byDate(b, a),
    'updated-asc': byDate,
    'title-asc': byTitle,
    'title-desc': (a: LearningResource, b: LearningResource) => byTitle(b, a),
  }[sort];
  return [...list].sort(compare);
}

/**
 * The learning-resources browser (legacy `assets/js/pages/learning-materials.js`):
 * tag filters (a resource matches if it has any selected tag), keyword search,
 * sorting and pagination, all client side over the list rendered at build.
 */
export default function View({ resources }: { resources: LearningResource[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<Sort>('featured');
  const [page, setPage] = useState(1);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of resources) for (const t of r.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort(([a], [b]) =>
      a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true })
    );
  }, [resources]);

  const matching = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = resources.filter((r) => {
      if (selected.size > 0 && !r.tags.some((t) => selected.has(t))) return false;
      if (!term) return true;
      return `${r.text} ${r.description} ${r.tags.join(' ')}`.toLowerCase().includes(term);
    });
    return sortResources(filtered, sort);
  }, [resources, selected, search, sort]);

  const pageCount = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const shown = matching.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const toggleTag = (tag: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
    setPage(1);
  };

  const reset = () => {
    setSelected(new Set());
    setSearch('');
    setPage(1);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: '240px minmax(0, 1fr)' },
        gap: 4,
      }}
    >
      <Paper variant='outlined' sx={{ p: 2, alignSelf: 'start' }} component='aside'>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography component='h2' variant='subtitle1' sx={{ fontWeight: 700 }}>
            Tags
          </Typography>
          {selected.size > 0 && (
            <Button size='small' onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          )}
        </Stack>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', lg: 'column' },
            flexWrap: 'wrap',
          }}
        >
          {tags.map(([tag, count]) => (
            <FormControlLabel
              key={tag}
              control={
                <Checkbox size='small' checked={selected.has(tag)} onChange={() => toggleTag(tag)} />
              }
              label={
                <Box component='span' sx={{ fontSize: '0.9rem' }}>
                  {tag}{' '}
                  <Box
                    component='span'
                    sx={{ color: 'text.secondary' }}
                    aria-label={`${count} ${count === 1 ? 'guide' : 'guides'}`}
                  >
                    ({count})
                  </Box>
                </Box>
              }
            />
          ))}
        </Box>
      </Paper>

      <Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            type='search'
            size='small'
            fullWidth
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder='Search titles, descriptions, and tags'
            slotProps={{
              htmlInput: { 'aria-label': 'Search learning materials' },
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon fontSize='small' />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl size='small' sx={{ minWidth: 220 }}>
            <InputLabel id='lm-sort-label'>Sort by</InputLabel>
            <Select
              labelId='lm-sort-label'
              label='Sort by'
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as Sort);
                setPage(1);
              }}
            >
              {SORTS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Typography color='text.secondary' sx={{ mb: 2 }} aria-live='polite'>
          {matching.length <= PAGE_SIZE
            ? `Showing ${matching.length} of ${resources.length} guides`
            : `Showing ${(current - 1) * PAGE_SIZE + 1}–${Math.min(current * PAGE_SIZE, matching.length)} of ${matching.length} guides`}
        </Typography>

        {matching.length === 0 ? (
          <Paper variant='outlined' sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>No learning materials match your filters.</Typography>
            <Button variant='outlined' size='small' onClick={reset}>
              Clear all filters
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {shown.map((resource) => (
              <Card
                key={resource.url}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderColor: resource.featured ? 'primary.main' : undefined,
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
                  {resource.featured && (
                    <Chip
                      icon={<StarIcon />}
                      label='Featured'
                      size='small'
                      color='primary'
                      sx={{ alignSelf: 'flex-start' }}
                    />
                  )}
                  <Typography component='h3' variant='h6' sx={{ lineHeight: 1.3 }}>
                    <Link href={resource.url} underline='hover' color='inherit'>
                      {resource.text}
                    </Link>
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ flexGrow: 1 }}>
                    {resource.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {resource.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size='small'
                        variant={selected.has(tag) ? 'filled' : 'outlined'}
                        color={selected.has(tag) ? 'primary' : 'default'}
                        onClick={() => toggleTag(tag)}
                      />
                    ))}
                  </Box>
                  <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ color: 'text.secondary' }}>
                    <ResourceIcon icon={resource.icon} size={20} />
                    {resource.updatedLabel && (
                      <Typography variant='caption'>Updated {resource.updatedLabel}</Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {pageCount > 1 && (
          <Stack alignItems='center' sx={{ mt: 3 }} spacing={1}>
            <Pagination count={pageCount} page={current} onChange={(_, value) => setPage(value)} color='primary' />
            <Typography variant='caption' color='text.secondary'>
              Page {current} of {pageCount} ({matching.length} guides)
            </Typography>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
