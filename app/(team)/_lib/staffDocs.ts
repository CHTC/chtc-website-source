import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/** An internal staff how-to from `content/staff/docs/<doc>.md`. */
export interface StaffDoc {
  doc: string;
  title: string;
  body: string;
}

const DOCS_DIR = path.join(process.cwd(), 'content', 'staff', 'docs');

export function getStaffDocParams(): { doc: string }[] {
  return fs
    .readdirSync(DOCS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => ({ doc: file.replace(/\.md$/, '') }));
}

export function getStaffDoc(doc: string): StaffDoc | undefined {
  const file = path.join(DOCS_DIR, `${doc}.md`);
  if (!/^[\w-]+$/.test(doc) || !fs.existsSync(file)) return undefined;

  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const body = content
    // Jekyll resolved these against /staff/docs/<doc>.html; the images are
    // served from the site root here.
    .replace(/\((?:\.\.\/)+images\//g, '(/images/')
    // A page-level <style> block would leak into the whole site once rendered.
    .replace(/<style>[\s\S]*?<\/style>/g, '')
    .trim();

  return { doc, title: String(data.title ?? doc), body };
}
