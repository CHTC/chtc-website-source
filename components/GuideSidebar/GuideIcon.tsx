import type { SvgIconProps } from '@mui/material';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LinkIcon from '@mui/icons-material/Link';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import type { ComponentType } from 'react';

/**
 * The legacy menus and data name Bootstrap Icons (`bi bi-rocket-takeoff`);
 * these are their closest Material equivalents.
 */
const ICONS: Record<string, ComponentType<SvgIconProps>> = {
  'bi-rocket-takeoff': RocketLaunchOutlinedIcon,
  'bi-send': SendOutlinedIcon,
  'bi-file-earmark-text': DescriptionOutlinedIcon,
  'bi-pc-display': ComputerOutlinedIcon,
  'bi-diagram-2': AccountTreeOutlinedIcon,
  'bi-cpu': MemoryOutlinedIcon,
  'bi-question-circle': HelpOutlineIcon,
  'bi-box-arrow-up-right': OpenInNewIcon,
  'bi-book': MenuBookOutlinedIcon,
  'bi-clipboard-check': AssignmentTurnedInOutlinedIcon,
  'bi-folder': FolderOutlinedIcon,
  'bi-link-45deg': LinkIcon,
  'bi-star-fill': StarOutlineIcon,
  'bi-github': GitHubIcon,
};

/** Whether `name` is a Bootstrap Icons class this module can draw. */
export function hasGuideIcon(name: string | undefined): boolean {
  return !!name && name.split(/\s+/).some((part) => part in ICONS);
}

/** Render a legacy `bi bi-*` class as a Material icon (nothing if unknown). */
const GuideIcon = ({ name, ...props }: { name?: string } & SvgIconProps) => {
  const key = name?.split(/\s+/).find((part) => part in ICONS);
  if (!key) return null;
  const Icon = ICONS[key];
  return <Icon {...props} />;
};

export default GuideIcon;
