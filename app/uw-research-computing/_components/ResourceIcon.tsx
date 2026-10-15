import { GuideIcon, isGuideIconName } from '@/components/GuideSidebar';

/**
 * A learning-resource or portal-card icon: either a named icon (`GitHub`,
 * see `GuideIcon`) or an image path/URL.
 */
const ResourceIcon = ({ icon, size = 24 }: { icon: string; size?: number }) =>
  isGuideIconName(icon) ? (
    <GuideIcon name={icon} sx={{ fontSize: size }} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={icon} alt='' style={{ height: size, width: 'auto' }} />
  );

export default ResourceIcon;
