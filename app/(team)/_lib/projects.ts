import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';

/** One partner from `content/projects/*.yml` (ported from legacy `_data/projects`). */
export interface Project {
  slug: string;
  title: string;
  /** Site-relative path under `public/`. */
  image?: string;
  /** `MM-DD-YYYY`, when present. */
  date?: string;
  /** HTML (the YAML carries `<br/>` and links). */
  description?: string;
}

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

/**
 * All projects in the legacy page's order.
 *
 * Jekyll sorted on the raw `date` string and reversed it, so dated entries
 * come first in descending *string* order (which puts the December 2021
 * IceCube entry ahead of the 2022 ones) and the undated ones follow in reverse
 * file-name order. The page has been read in that order for years, so it is
 * kept rather than "fixed" to calendar order.
 */
export function getProjects(): Project[] {
  const projects = fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => /\.ya?ml$/.test(file))
    .map((file) => {
      const data = load(fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf8')) as Omit<
        Project,
        'slug'
      >;
      return { ...data, date: data.date ?? undefined, slug: file.replace(/\.ya?ml$/, '') };
    });

  return projects
    .sort((a, b) => {
      const byDate = (a.date ?? '').localeCompare(b.date ?? '');
      return byDate !== 0 ? byDate : a.slug.localeCompare(b.slug);
    })
    .reverse();
}
