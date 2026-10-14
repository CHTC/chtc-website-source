import type { Staff } from '@chtc/web-components/content';
import { getStaff } from '@/utils/staff';
import { slugify } from './jobs';

/** The fellowship block some staff-list entries carry. */
export interface Fellowship {
  year: number | string;
  name: string;
  /** Markdown. */
  description?: string;
  mentor?: string;
}

/**
 * A CHTC team member. Fellows carry a `fellowship` block the library type
 * does not declare. Note that the staff-list also uses a status the library's
 * `StaffStatus` omits (`Leadership`); compare statuses with `hasStatus`.
 */
export type TeamMember = Staff & { fellowship?: Fellowship };

/** Status check that admits values outside the library's `StaffStatus`. */
export function hasStatus(member: TeamMember, status: string): boolean {
  return (member.status as string) === status;
}

/** Everyone the staff-list puts on the CHTC team, current and past. */
export async function getTeam(): Promise<TeamMember[]> {
  return (await getStaff('chtc')).filter((member) =>
    member.organizations?.includes('chtc')
  ) as TeamMember[];
}

/** Liquid's `sort: "name"` — plain code-point order. */
export function byName(a: TeamMember, b: TeamMember): number {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

/** Team members who were CHTC Fellows, by name. */
export async function getFellows(): Promise<(TeamMember & { fellowship: Fellowship })[]> {
  return (await getTeam())
    .filter((member): member is TeamMember & { fellowship: Fellowship } =>
      Boolean(member.fellowship)
    )
    .sort(byName);
}

/** Where a fellow's final report lives (legacy `reports/<year>/<name|slugify>`). */
export function reportHref(member: TeamMember & { fellowship: Fellowship }): string {
  return `/fellowships/reports/${member.fellowship.year}/${slugify(member.name)}/`;
}
