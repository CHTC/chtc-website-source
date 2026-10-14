/**
 * Convert an arbitrary entity name (project / institution) into a URL-safe
 * slug for use as a static route segment. Names contain spaces, commas, and
 * accented characters that don't survive percent-encoding cleanly across
 * static hosts, so we slugify for the URL and recover the original name from
 * the data list at render time (see ProjectDetail / InstitutionDetail).
 */
export function slugify(name: string): string {
  return (
    name
      .normalize('NFKD') // decompose accented characters
      .replace(/[̀-ͯ]/g, '') // strip the diacritics
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric runs -> single dash
      .replace(/^-+|-+$/g, '') || 'unknown' // trim leading/trailing dashes
  );
}
