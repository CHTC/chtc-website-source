import type { SvgIconProps } from '@mui/material';
import AccountTree from '@mui/icons-material/AccountTreeOutlined';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedInOutlined';
import Computer from '@mui/icons-material/ComputerOutlined';
import Description from '@mui/icons-material/DescriptionOutlined';
import Folder from '@mui/icons-material/FolderOutlined';
import GitHub from '@mui/icons-material/GitHub';
import HelpOutline from '@mui/icons-material/HelpOutline';
import Link from '@mui/icons-material/Link';
import Memory from '@mui/icons-material/MemoryOutlined';
import MenuBook from '@mui/icons-material/MenuBookOutlined';
import OpenInNew from '@mui/icons-material/OpenInNew';
import RocketLaunch from '@mui/icons-material/RocketLaunchOutlined';
import Send from '@mui/icons-material/SendOutlined';
import Star from '@mui/icons-material/StarOutline';

/**
 * The icons the menus and data files can name (`icon: Send`). Add a Material
 * icon here to make it available; the name is what the YAML uses.
 */
const ICONS = {
  AccountTree,
  AssignmentTurnedIn,
  Computer,
  Description,
  Folder,
  GitHub,
  HelpOutline,
  Link,
  Memory,
  MenuBook,
  OpenInNew,
  RocketLaunch,
  Send,
  Star,
} as const;

export type GuideIconName = keyof typeof ICONS;

export const GUIDE_ICON_NAMES = Object.keys(ICONS) as GuideIconName[];

/** Whether `name` is an icon this module can draw. */
export function isGuideIconName(name: unknown): name is GuideIconName {
  return typeof name === 'string' && name in ICONS;
}

/** Draw a named icon (nothing if unknown). */
const GuideIcon = ({ name, ...props }: { name?: string } & SvgIconProps) => {
  if (!isGuideIconName(name)) return null;
  const Icon = ICONS[name];
  return <Icon {...props} />;
};

export default GuideIcon;
