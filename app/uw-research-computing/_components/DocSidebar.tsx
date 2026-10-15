'use client';

import { useSearchParams } from 'next/navigation';
import GuideSidebar, { type GuideMenu } from '@/components/GuideSidebar';
import { COMPUTE_TYPE_PARAM } from '../_lib/computeType';

/**
 * The guide sidebar for a document, narrowed to one menu when the page was
 * reached with `?compute-type=htc|hpc` (the menus put it on their links to
 * guides tagged with both types). The site is statically exported, so the
 * query string is only known in the browser: render inside a `Suspense`
 * whose fallback shows every menu, which is also what the static HTML holds.
 */
export default function DocSidebar({ menus }: { menus: GuideMenu[] }) {
  const requested = useSearchParams().get(COMPUTE_TYPE_PARAM);
  const narrowed = requested ? menus.filter((menu) => menu.id === requested) : [];
  return <GuideSidebar menus={narrowed.length > 0 ? narrowed : menus} />;
}
