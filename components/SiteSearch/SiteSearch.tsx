'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import NextLink from 'next/link';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  Paper,
  Popper,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { cleanTitle, isGuide, loadPagefind, sectionOf, type PagefindResultData } from './pagefind';

const MAX_RESULTS = 8;
/** How many of Pagefind's ranked results to fetch before the guides are moved up. */
const CANDIDATES = 16;

type Status = 'idle' | 'searching' | 'done' | 'unavailable';

/** Runs a Pagefind query as the term changes. */
function useSearch(term: string) {
  const [results, setResults] = useState<PagefindResultData[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const query = term.trim();
    if (query.length < 2) {
      setResults([]);
      setStatus('idle');
      return;
    }
    let cancelled = false;
    setStatus('searching');
    (async () => {
      try {
        const pagefind = await loadPagefind();
        const search = await pagefind.debouncedSearch(query, {}, 200);
        if (!search || cancelled) return; // superseded by a newer term
        const data = await Promise.all(search.results.slice(0, CANDIDATES).map((r) => r.data()));
        if (cancelled) return;
        // Guides first, each group in Pagefind's own ranking order.
        setResults([...data.filter((d) => isGuide(d.url)), ...data.filter((d) => !isGuide(d.url))].slice(0, MAX_RESULTS));
        setStatus('done');
      } catch {
        if (!cancelled) setStatus('unavailable');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [term]);

  return { results, status };
}

const ResultList = ({
  results,
  status,
  term,
  listboxId,
  onPick,
}: {
  results: PagefindResultData[];
  status: Status;
  term: string;
  listboxId: string;
  onPick: () => void;
}) => {
  if (status === 'idle') return null;
  if (status === 'unavailable') {
    return (
      <Typography variant='body2' sx={{ p: 2, color: 'text.secondary' }}>
        Search is built with the site and is not available in development. Run <code>pnpm build</code>.
      </Typography>
    );
  }
  if (status === 'searching' && results.length === 0) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={20} />
      </Box>
    );
  }
  if (results.length === 0) {
    return (
      <Typography variant='body2' sx={{ p: 2, color: 'text.secondary' }}>
        No pages match “{term.trim()}”.
      </Typography>
    );
  }
  return (
    <List id={listboxId} role='listbox' dense disablePadding sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
      {results.map((result) => (
        <ListItemButton
          key={result.url}
          component={NextLink}
          href={result.url}
          role='option'
          onClick={onPick}
          sx={{ display: 'block', px: 2, py: 1.25, borderBottom: 1, borderColor: 'divider', '&:last-child': { border: 0 } }}
        >
          <Typography variant='caption' sx={{ color: 'primary.main', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {sectionOf(result.url)}
          </Typography>
          <Typography sx={{ fontWeight: 600, lineHeight: 1.3, color: 'text.primary' }}>{cleanTitle(result)}</Typography>
          <Typography
            variant='body2'
            component='p'
            sx={{ color: 'text.secondary', lineHeight: 1.45, mt: 0.25, '& mark': { bgcolor: 'rgba(197, 5, 12, 0.14)', color: 'inherit', borderRadius: 0.5, px: 0.25 } }}
            // Pagefind's excerpt is our own page text with <mark> around the hits.
            dangerouslySetInnerHTML={{ __html: result.excerpt }}
          />
        </ListItemButton>
      ))}
    </List>
  );
};

/**
 * Site-wide search, as the legacy navbar's search bar: on wide screens a
 * field in the header whose results drop down beneath it; on phones a button
 * that opens the same thing in a dialog. Ctrl/⌘+K focuses it from anywhere.
 */
export default function SiteSearch({ variant }: { variant: 'inline' | 'dialog' }) {
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const { results, status } = useSearch(term);

  const close = useCallback(() => {
    setOpen(false);
    setTerm('');
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const field = (
    <TextField
      inputRef={inputRef}
      value={term}
      onChange={(event) => {
        setTerm(event.target.value);
        setOpen(true);
      }}
      onFocus={() => setOpen(true)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') close();
      }}
      placeholder='Search the site'
      size='small'
      fullWidth
      autoComplete='off'
      slotProps={{
        // The ARIA combobox attributes belong on the <input> itself.
        htmlInput: {
          'aria-label': 'Search the site',
          'aria-controls': listboxId,
          'aria-expanded': open && status !== 'idle',
          role: 'combobox',
        },
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon fontSize='small' />
            </InputAdornment>
          ),
          sx: { bgcolor: 'background.paper', fontSize: '0.9rem' },
        },
      }}
    />
  );

  const list = <ResultList results={results} status={status} term={term} listboxId={listboxId} onPick={close} />;

  if (variant === 'dialog') {
    return (
      <>
        <IconButton aria-label='Search the site' onClick={() => setOpen(true)} sx={{ color: 'text.primary' }}>
          <SearchIcon />
        </IconButton>
        <Dialog open={open} onClose={close} fullWidth maxWidth='sm' slotProps={{ transition: { onEntered: () => inputRef.current?.focus() } }}>
          <DialogContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {field}
              <IconButton aria-label='Close search' onClick={close}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ mt: 1 }}>{list}</Box>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Box ref={anchorRef} sx={{ width: { md: 200, lg: 260 } }} onBlur={(event) => {
      // Close when focus leaves the field and its results together.
      if (!anchorRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}>
      {field}
      <Popper
        open={open && status !== 'idle'}
        anchorEl={anchorRef.current}
        placement='bottom-end'
        sx={{ zIndex: (theme) => theme.zIndex.modal }}
      >
        <Paper
          elevation={6}
          // Keep focus in the field while a result is clicked: the Popper is
          // portalled, so a blur would otherwise close it before the click lands.
          onMouseDown={(event) => event.preventDefault()}
          sx={{ mt: 0.5, width: 420, maxWidth: 'calc(100vw - 32px)', borderRadius: 1, overflow: 'hidden' }}
        >
          {list}
        </Paper>
      </Popper>
    </Box>
  );
}
