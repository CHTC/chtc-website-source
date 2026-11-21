import fs from 'fs';
import path from 'path';
import { FAILSAFE_SCHEMA, load } from 'js-yaml';

/** One framework build: a version compiled against one CUDA toolkit. */
export interface CompatBuild {
  /** As in the data: `12.6`, `12.5.1`, or major alone for JAX: `13`. */
  cudaToolkit: string;
  /** The compute capabilities it supports: `7.5 to 9.0, except 8.9`. */
  capabilityRange: string;
  /** The `gpus_*` submit file lines. */
  submitLines: string;
  /** The GPU models it ran on, newest first. */
  gpuModels: string[];
  /** How many GPUs in the pool it can run on. */
  gpuCount: number;
  /** What we tested: an official image, or one built from a base image with pip. */
  tested: { image: string } | { baseImage: string; pipInstall: string };
  /** Caveats for readers. */
  notes: string[];
}

export interface CompatVersion {
  /**
   * `2.14.x` when the results cover every patch release of 2.14, or an exact
   * release such as JAX `0.4.38` when only that release was tested.
   */
  version: string;
  builds: CompatBuild[];
  /** The build that matches the most GPUs. */
  defaultCudaToolkit: string;
}

export interface CompatFramework {
  id: string;
  label: string;
  versions: CompatVersion[];
}

export interface GpuCompat {
  lastUpdated: string;
  /** Every GPU model in the data, newest first. */
  gpuModels: string[];
  frameworks: CompatFramework[];
}

interface RawBuild {
  tested_image: string;
  build_recipe: { base_image: string; pip_install: string } | string;
  compute_capability: { min: string; max: string; excluded?: string[] };
  n_compatible_gpus: string;
  chip_names: string[];
  condor_requirements: string;
  notes: string[];
}

interface RawCompat {
  last_updated: string;
  /** Framework, then version (`2.14.X` or an exact JAX `0.4.38`), then CUDA toolkit. */
  frameworks: Record<string, Record<string, Record<string, RawBuild>>>;
}

const FRAMEWORK_LABELS: Record<string, string> = {
  pytorch: 'PyTorch',
  tensorflow: 'TensorFlow',
  jax: 'JAX',
};

/**
 * When NVIDIA announced each GPU model (year-month), only to list them newest
 * first so each generation sits together. A model missing here is listed
 * first, as it is most likely new; add it when it appears in the data.
 */
const GPU_RELEASED: Record<string, string> = {
  'RTX PRO 6000 Blackwell Server Edition': '2025-03',
  H200: '2023-11',
  L40S: '2023-08',
  L40: '2022-09',
  H100: '2022-03',
  A100: '2020-05',
  'RTX 2080 Ti': '2018-08-20',
  'RTX 8000': '2018-08-13',
  P100: '2016-04',
};

const byReleaseNewestFirst = (a: string, b: string): number =>
  (GPU_RELEASED[b] ?? '9999').localeCompare(GPU_RELEASED[a] ?? '9999') || a.localeCompare(b);

/** `2.14.X` (every patch release) becomes `2.14.x`; exact versions such as `0.4.38` stay as they are. */
const displayVersion = (version: string): string => version.replace(/\.X$/i, '.x');

/** The numeric parts: `2.14.x` is `[2, 14]`. */
const versionParts = (version: string): number[] =>
  version.replace(/\.x$/i, '').split('.').map(Number);

/** Newest first: `2.10.x` sorts before `2.9.x`. */
const compareVersionsDescending = (a: string, b: string): number => {
  const left = versionParts(a);
  const right = versionParts(b);
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const difference = (right[i] ?? 0) - (left[i] ?? 0);
    if (difference) return difference;
  }
  return 0;
};

const capabilityRange = ({ min, max, excluded = [] }: RawBuild['compute_capability']): string =>
  `${min} to ${max}` + (excluded.length ? `, except ${excluded.join(', ')}` : '');

const toBuild = (cudaToolkit: string, build: RawBuild): CompatBuild => ({
  cudaToolkit,
  capabilityRange: capabilityRange(build.compute_capability),
  submitLines: build.condor_requirements
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n'),
  gpuModels: [...(build.chip_names ?? [])].sort(byReleaseNewestFirst),
  gpuCount: Number(build.n_compatible_gpus),
  // The failsafe schema reads `null` as the string 'null', so test for an object.
  tested:
    typeof build.build_recipe === 'object' && build.build_recipe
      ? { baseImage: build.build_recipe.base_image, pipInstall: build.build_recipe.pip_install }
      : { image: build.tested_image ?? '' },
  notes: build.notes ?? [],
});

/**
 * `content/uw-research-computing/data/compat.yaml`: the GPUs each framework
 * version and CUDA toolkit can run on, as submit file lines. Read with the
 * failsafe schema so every value stays a string; the default schema would
 * read a version key such as `2.10` as the number 2.1.
 */
export function loadGpuCompat(): GpuCompat {
  const file = path.join(process.cwd(), 'content', 'uw-research-computing', 'data', 'compat.yaml');
  const raw = load(fs.readFileSync(file, 'utf8'), { schema: FAILSAFE_SCHEMA }) as RawCompat;

  const frameworks = Object.entries(raw.frameworks).map(([id, versions]) => ({
    id,
    label: FRAMEWORK_LABELS[id] ?? id,
    versions: Object.entries(versions)
      .map(([version, toolkits]) => {
        const builds = Object.entries(toolkits)
          .map(([toolkit, build]) => toBuild(toolkit, build))
          .sort((a, b) => compareVersionsDescending(a.cudaToolkit, b.cudaToolkit));
        // Most GPUs wins; on a tie, the newer toolkit (builds are newest first).
        const broadest = builds.reduce((best, build) => (build.gpuCount > best.gpuCount ? build : best));
        return { version: displayVersion(version), builds, defaultCudaToolkit: broadest.cudaToolkit };
      })
      .sort((a, b) => compareVersionsDescending(a.version, b.version)),
  }));

  const gpuModels = [
    ...new Set(frameworks.flatMap(({ versions }) => versions.flatMap(({ builds }) => builds.flatMap((b) => b.gpuModels)))),
  ].sort(byReleaseNewestFirst);

  return { lastUpdated: raw.last_updated, gpuModels, frameworks };
}
