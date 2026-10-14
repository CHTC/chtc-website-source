import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/** A fellow's final report, from `content/fellowships/reports/<year>/<name>.md`. */
export interface FellowshipReport {
  year: string;
  name: string;
  /** The document's own `# heading`. */
  title: string;
  /** From the `#### Fellow: …` line, when present. */
  fellow?: string;
  /** Markdown with the title heading removed (the page renders it as h1). */
  body: string;
}

const REPORTS_DIR = path.join(process.cwd(), 'content', 'fellowships', 'reports');

export function getReportParams(): { year: string; name: string }[] {
  return fs
    .readdirSync(REPORTS_DIR)
    .filter((year) => /^\d{4}$/.test(year))
    .flatMap((year) =>
      fs
        .readdirSync(path.join(REPORTS_DIR, year))
        .filter((file) => file.endsWith('.md'))
        .map((file) => ({ year, name: file.replace(/\.md$/, '') }))
    );
}

export function getReport(year: string, name: string): FellowshipReport | undefined {
  const file = path.join(REPORTS_DIR, year, `${name}.md`);
  if (!/^\d{4}$/.test(year) || !/^[\w-]+$/.test(name) || !fs.existsSync(file)) {
    return undefined;
  }

  // The front matter only selects a Jekyll layout; the title is the first
  // heading of the document itself.
  const { content } = matter(fs.readFileSync(file, 'utf8'));
  const titleMatch = content.match(/^#\s+(.+?)\s*$/m);
  const fellowMatch = content.match(/^#+\s*Fellow:\s*(.+?)\s*$/m);

  return {
    year,
    name,
    title: titleMatch?.[1] ?? name,
    fellow: fellowMatch?.[1],
    body: titleMatch ? content.replace(titleMatch[0], '').trim() : content.trim(),
  };
}

/** Where the program page's featured-fellow card goes in its markdown. */
const FEATURED_MARKER = '<!-- featured-fellow -->';

/**
 * The program page copy from `content/fellowships/program.md`, split around
 * the featured-fellow marker so the page can render the card in between.
 */
export function getProgramPage(): {
  title: string;
  announcement?: string;
  before: string;
  after: string;
} {
  const file = path.join(process.cwd(), 'content', 'fellowships', 'program.md');
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const [before, after = ''] = content.split(FEATURED_MARKER);
  return {
    title: String(data.title),
    announcement: data.announcement ? String(data.announcement) : undefined,
    before: before.trim(),
    after: after.trim(),
  };
}
