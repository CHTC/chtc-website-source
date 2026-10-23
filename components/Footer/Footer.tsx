import { Footer as UWFooter } from '@chtc/web-components';

/**
 * The site footer is the shared UW-branded footer from `@chtc/web-components`
 * (crest, link columns, contact card, privacy/copyright line); this module
 * only supplies CHTC's links and contact details.
 */
const MENU = [
  {
    label: 'Campus Computing',
    items: [
      { label: 'Services', href: '/uw-research-computing/' },
      { label: 'Get Started', href: '/uw-research-computing/form/' },
      { label: 'User Portal', href: '/uw-research-computing/user-portal/' },
      { label: 'HTC Guides', href: '/uw-research-computing/htc/guides/' },
      { label: 'HPC Guides', href: '/uw-research-computing/hpc/guides/' },
      { label: 'Get Help', href: '/uw-research-computing/get-help/' },
      { label: 'Office Hours', href: '/uw-research-computing/get-help/#office-hours' },
    ],
  },
  {
    label: 'Community',
    items: [
      { label: 'News', href: '/news/' },
      { label: 'Spotlights', href: '/spotlights/' },
      { label: 'Events', href: '/events/' },
      { label: 'Presentations', href: '/presentations/' },
      { label: 'Newsletter', href: '/newsletter/' },
      { label: 'Community Forum', href: 'https://community.chtc.wisc.edu/' },
    ],
  },
  {
    label: 'About',
    items: [
      { label: 'Our Approach', href: '/approach/' },
      { label: 'Staff', href: '/people/' },
      { label: 'Fellowships', href: '/fellowships/' },
      { label: 'Open Positions', href: '/jobs/' },
      { label: 'Research', href: '/research/' },
      { label: 'Talk To Us', href: '/talk-to-us/' },
    ],
  },
];

export default function Footer() {
  return (
    <UWFooter
      menu={MENU}
      contact={{
        email: 'chtc@cs.wisc.edu',
        social: {
          x: 'https://twitter.com/CHTC_UW',
          linkedin: 'https://www.linkedin.com/company/center-for-high-throughput-computing/',
          github: 'https://github.com/CHTC',
        },
      }}
      accessibilityEmail='chtc@cs.wisc.edu'
    />
  );
}
