import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';

/** One position from `content/jobs/*.yaml` (ported from legacy `_data/jobs`). */
export interface Job {
  /** File name without extension. */
  slug: string;
  title: string;
  /** Markdown. */
  text?: string;
  type?: 'Full Time' | 'Internship' | string;
  institution?: string;
  header?: string;
  /** Unix seconds. Positions whose close date has passed are not listed. */
  close_date?: number;
  button?: { href?: string; text?: string };
}

const JOBS_DIR = path.join(process.cwd(), 'content', 'jobs');

/**
 * The positions that are still open at build time, in file-name order (the
 * order Jekyll iterated `site.data.jobs`). A job with no `close_date` stays
 * open; the YAML marks a closed posting with a small number such as `0`.
 */
export function getOpenJobs(now: Date = new Date()): Job[] {
  const nowSeconds = now.getTime() / 1000;

  return fs
    .readdirSync(JOBS_DIR)
    .filter((file) => /\.ya?ml$/.test(file))
    .sort()
    .map((file) => {
      const data = load(fs.readFileSync(path.join(JOBS_DIR, file), 'utf8')) as Omit<Job, 'slug'>;
      return { ...data, slug: file.replace(/\.ya?ml$/, '') };
    })
    .filter((job) => job.close_date == null || job.close_date > nowSeconds);
}

/** Jekyll's `slugify`, used for the in-page anchors of each job card. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** "2026-06-08 11:59 PM", the legacy format, in Madison's time zone. */
export function formatCloseDate(seconds: number): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(new Date(seconds * 1000));
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')} ${get('dayPeriod')}`;
}

