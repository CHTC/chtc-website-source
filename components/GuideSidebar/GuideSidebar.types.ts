/**
 * The guide menus, as in the legacy `_data/htc-guide-menu.yml` and
 * `_data/hpc-guide-menu.yml`: sections of links, where a link may itself hold
 * links (a folder when it has no `url`, a parent page when it has one).
 */
export interface MenuLink {
  text: string;
  /** Site path (trailing slash) or absolute URL; absent on a folder. */
  url?: string;
  /** Bootstrap Icons class from the legacy data, e.g. `bi bi-book`. */
  icon?: string;
  highlight?: boolean;
  links?: MenuLink[];
}

export interface MenuSection {
  text: string;
  icon?: string;
  links: MenuLink[];
}

/** One titled menu ("HTC guides"); a page can show more than one. */
export interface GuideMenu {
  title: string;
  sections: MenuSection[];
}
