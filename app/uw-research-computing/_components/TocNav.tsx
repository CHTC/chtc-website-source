'use client';

import { useEffect, useState } from 'react';
import { Box, Link, List, ListItem, Typography } from '@mui/material';
import type { DocHeading } from '../_lib/docs';
import { SCROLL_MARGIN } from '../_lib/layout';

/** Headings above this line (px from the top) count as read. */
const READ_LINE = SCROLL_MARGIN + 8;

/**
 * "On this page": a document's headings as a jump list, the section the
 * reader is in highlighted. Shown beside the body on wide screens and in a
 * collapsible panel above it on narrow ones (see `DocLayout`).
 */
export default function TocNav({ headings }: { headings: DocHeading[] }) {
  const [active, setActive] = useState<string | undefined>(headings[0]?.id);
  const top = headings[0]?.depth ?? 2;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = headings[0]?.id;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= READ_LINE) current = heading.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <Box component='nav' aria-label='On this page'>
      <Typography
        component='h2'
        variant='overline'
        sx={{ display: 'block', px: 2, color: 'text.secondary', fontWeight: 700 }}
      >
        On this page
      </Typography>
      <List dense disablePadding>
        {headings.map((heading) => {
          const isActive = heading.id === active;
          return (
            <ListItem key={heading.id} disablePadding>
              {/* A plain anchor, not next/link: the router ignores a click on
                  the hash already in the URL, so a second click on the same
                  entry would not scroll back to it. */}
              <Link
                component='a'
                href={`#${heading.id}`}
                underline='none'
                aria-current={isActive ? 'location' : undefined}
                sx={{
                  display: 'block',
                  width: '100%',
                  py: 0.5,
                  pl: heading.depth > top ? 4 : 2,
                  pr: 1,
                  fontSize: '0.85rem',
                  lineHeight: 1.35,
                  borderLeft: '3px solid',
                  borderColor: isActive ? 'primary.main' : 'divider',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive ? 700 : 400,
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {heading.text}
              </Link>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
