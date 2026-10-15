/**
 * The guide menus, as in the legacy `_data/htc-guide-menu.yml` and
 * `_data/hpc-guide-menu.yml`: sections of links, where a link may itself hold
 * links (a folder when it has no `url`, a parent page when it has one).
 */
export interface MenuLink {
  text: string;
  /** Site path (trailing slash) or absolute URL; absent on a folder. */
  url?: string;
  /** A named icon, e.g. `MenuBook`; see `GuideIcon`. */
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
  /**
   * Which compute type the menu is for (`htc`, `hpc`). A page that shows
   * several menus can be asked for just one through the `compute-type`
   * query parameter.
   */
  id?: string;
  sections: MenuSection[];
}
