import { GuideIcon } from '@/components/GuideSidebar';

/**
 * A learning-resource or portal-card icon: the legacy data gives either a
 * Bootstrap Icons class (`bi bi-github`) or an image path/URL.
 */
const ResourceIcon = ({ icon, size = 24 }: { icon: string; size?: number }) =>
  icon.startsWith('bi ') ? (
    <GuideIcon name={icon} sx={{ fontSize: size }} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={icon} alt='' style={{ height: size, width: 'auto' }} />
  );

export default ResourceIcon;
