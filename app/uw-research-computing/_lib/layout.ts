/**
 * Heights of the bars that stay fixed at the top of every Campus Computing
 * page, so sticky columns and anchor targets can clear them.
 */

/**
 * The site header scrolls away with the page (its `AppBar` is sticky only
 * within the `<header>` that wraps it), so nothing above the section bar
 * stays on screen.
 */
export const HEADER_HEIGHT = 0;

/** The section's own sticky navigation bar (`SectionNav`). */
export const SECTION_NAV_HEIGHT = 48;

/** Where a sticky column should sit: under both bars, with a little air. */
export const STICKY_TOP = HEADER_HEIGHT + SECTION_NAV_HEIGHT + 16;

/** Anchor targets scroll to just below the bars. */
export const SCROLL_MARGIN = HEADER_HEIGHT + SECTION_NAV_HEIGHT + 24;
