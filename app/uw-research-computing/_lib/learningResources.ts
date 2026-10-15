import { readYaml } from './docs';

interface RawResource {
  text: string;
  url: string;
  icon?: string;
  description?: string;
  tags?: string[] | null;
  'last updated'?: string | Date;
  last_updated?: string | Date;
  featured?: boolean;
}

/** One entry of `content/uw-research-computing/data/learning-resources.yml`. */
export interface LearningResource {
  text: string;
  url: string;
  /** A named icon (`GitHub`, see `GuideIcon`) or an image path/URL. */
  icon: string;
  description: string;
  tags: string[];
  /** `YYYY-MM-DD`, or empty when undated. */
  updated: string;
  /** `updated` for display ("Mar 10, 2026"). */
  updatedLabel: string;
  featured: boolean;
}

/** YAML gives unquoted dates as `Date`s at UTC midnight; keep the calendar day. */
const isoDay = (value: string | Date | undefined): string => {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
};

/**
 * The learning resources, featured first and then the rest, each group most
 * recently updated first — the legacy page's default order.
 */
export function learningResources(): LearningResource[] {
  const all = readYaml<RawResource[]>('data/learning-resources.yml').map((raw) => ({
    text: raw.text,
    url: raw.url,
    icon: raw.icon || 'GitHub',
    description: (raw.description ?? '').trim(),
    tags: raw.tags ?? [],
    updated: isoDay(raw.last_updated ?? raw['last updated']),
    updatedLabel: formatDay(isoDay(raw.last_updated ?? raw['last updated'])),
    featured: raw.featured === true,
  }));
  const byDate = [...all].sort((a, b) => b.updated.localeCompare(a.updated));
  return [...byDate.filter((r) => r.featured), ...byDate.filter((r) => !r.featured)];
}

/** "Mar 10, 2026" for a `YYYY-MM-DD` day. */
export function formatDay(day: string): string {
  if (!day) return '';
  return new Date(`${day}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
