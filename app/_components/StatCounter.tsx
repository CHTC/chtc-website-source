'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

/** 100,000 → "100K"; the legacy `int_to_small_format`. */
function compact(value: number): string {
  if (value < 1e3) return value.toFixed(0);
  if (value < 1e6) return `${(value / 1e3).toFixed(0)}K`;
  if (value < 1e9) return `${(value / 1e6).toFixed(0)}M`;
  return `${(value / 1e9).toFixed(0)}B`;
}

const STEPS = 10;
const STEP_MS = 50;

/**
 * A big number that counts up once it scrolls into view, as the legacy home
 * page's statistics row did. The final value is what the server renders, so
 * the figure is correct without JavaScript and for crawlers; the count-up
 * only starts after hydration, and is skipped under reduced motion.
 */
export default function StatCounter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(STEPS);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        setStep(0);
        // Derive the step from elapsed time rather than counting ticks, so a
        // throttled timer (background tab) still lands on the final value.
        const start = performance.now();
        timer = setInterval(() => {
          const next = Math.min(STEPS, Math.floor((performance.now() - start) / STEP_MS));
          setStep(next);
          if (next >= STEPS) clearInterval(timer);
        }, STEP_MS);
      },
      { rootMargin: '-100px' }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, []);

  // Square-root easing, as the legacy counter used: fast start, slow finish.
  const shown = Math.floor(value * Math.sqrt(step / STEPS));

  return (
    <Box ref={ref} sx={{ textAlign: 'center' }}>
      <Typography
        component='p'
        aria-hidden='true'
        sx={{
          fontSize: { xs: '3rem', md: '4.5rem' },
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: 'primary.main',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {compact(shown)}
      </Typography>
      <Typography component='p' variant='h6' sx={{ mt: 1 }}>
        <Box component='span' sx={visuallyHidden}>
          {value.toLocaleString('en-US')}{' '}
        </Box>
        {label}
      </Typography>
    </Box>
  );
}

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;
