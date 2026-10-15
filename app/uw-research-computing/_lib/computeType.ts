/**
 * Query parameter naming which guide menu a shared page should show. The
 * guide menus add it to their links to guides tagged with both compute
 * types, so a guide reached from the HPC menu shows only the HPC sidebar.
 *
 * Kept apart from `docs.ts`, which reads the filesystem, so the client-side
 * sidebar can import it.
 */
export const COMPUTE_TYPE_PARAM = 'compute-type';

export type ComputeType = 'htc' | 'hpc';

export const COMPUTE_TYPES: ComputeType[] = ['htc', 'hpc'];
