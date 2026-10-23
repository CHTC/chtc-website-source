import { load } from 'js-yaml';
import { getRawFile, getRepoPaths } from '@chtc/web-components/github';
import type { Staff } from '@chtc/web-components/content';
import type { Website } from '@chtc/web-components/content';

const ORGANIZATION = 'chtc';
const REPO = 'staff-list';
const BRANCH = 'init-staff-list';
const IMAGE_BASE_URL = 'https://chtc.github.io/staff-list/';

/**
 * Every person in the shared CHTC/staff-list repository, with the overrides for
 * `website` applied and image paths made absolute.
 *
 * This duplicates `getStaff` from `@chtc/web-components/content` for one
 * reason: the package matches staff files with `path.endsWith('.yml')`, and
 * five people in the repository are filed as `.yaml` instead, so the package
 * silently renders an incomplete team page. Jekyll's `site.data` reads both
 * extensions, which is why the legacy site never surfaced the discrepancy.
 *
 * Once the package accepts both extensions (or the repository renames those
 * files), this can go back to re-exporting the package's version.
 */
export async function getStaff(website: Website): Promise<Staff[]> {
  const paths = await getRepoPaths(ORGANIZATION, REPO, BRANCH);

  return Promise.all(
    paths
      .filter(
        (path) =>
          (path.endsWith('.yml') || path.endsWith('.yaml')) &&
          !path.includes('/')
      )
      .map((path) => getStaffMember(path, website))
  );
}

/**
 * A personal link written without its scheme (`www.linkedin.com/in/…`) would
 * be read as a path on this site, so it gets `https://`.
 */
function absoluteUrl(url: string | undefined): string | undefined {
  if (!url || /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('/')) return url;
  return `https://${url}`;
}

async function getStaffMember(path: string, website: Website): Promise<Staff> {
  const text = await getRawFile(ORGANIZATION, REPO, path, BRANCH);
  const data = load(text) as Staff;
  const merged = {
    ...data,
    // The per-site block (`chtc:`) overrides the shared fields, so a person can
    // carry a different title, weight or promoted flag on each team page.
    ...data?.[website],
  };

  return {
    ...merged,
    website: absoluteUrl(merged.website),
    image: new URL(data.image, IMAGE_BASE_URL).toString(),
  };
}

export default getStaff;
