import fs from 'fs';
import path from 'path';
import { FAILSAFE_SCHEMA, load } from 'js-yaml';

/** One GPU type a build runs on, and how many of it CHTC has when the data says. */
export interface CompatChip {
  name: string;
  count?: number;
}

/** One framework build: a version compiled against one CUDA toolkit. */
export interface CompatBuild {
  cudaToolkit: string;
  minNvidiaDriverVersion: string;
  minDriverCuda: string;
  /** The compute capabilities it supports: `7.5 to 9.0, except 8.9`. */
  capabilityRange: string;
  compatibleGpus: number;
  chips: CompatChip[];
  requirements: string;
}

export interface CompatVersion {
  version: string;
  builds: CompatBuild[];
}

export interface CompatFramework {
  id: string;
  label: string;
  versions: CompatVersion[];
}

export interface GpuCompat {
  lastUpdated: string;
  frameworks: CompatFramework[];
}

interface RawBuild {
  cuda_toolkit: string;
  min_nvidia_driver_version: string;
  min_driver_cuda: string;
  compute_capability: { min: string; max: string; excluded?: string[] };
  n_compatible_gpus: string;
  /** GPU types and their counts (`A100: 40`), or just the names (`chip_names`). */
  chips?: Record<string, string>;
  chip_names?: string[];
  condor_requirements: string;
}

interface RawCompat {
  last_updated: string;
  frameworks: Record<string, Record<string, RawBuild[]>>;
}

const capabilityRange = ({ min, max, excluded = [] }: RawBuild['compute_capability']): string =>
  `${min} to ${max}` + (excluded.length ? `, except ${excluded.join(', ')}` : '');

const chips = (build: RawBuild): CompatChip[] =>
  build.chips
    ? Object.entries(build.chips).map(([name, count]) => ({ name, count: Number(count) }))
    : (build.chip_names ?? []).map((name) => ({ name }));

const FRAMEWORK_LABELS: Record<string, string> = {
  pytorch: 'PyTorch',
  tensorflow: 'TensorFlow',
  jax: 'JAX',
};

/** Newest first: `2.10.0` sorts before `2.9.1`. */
const compareVersionsDescending = (a: string, b: string): number => {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const difference = (right[i] ?? 0) - (left[i] ?? 0);
    if (difference) return difference;
  }
  return 0;
};

/**
 * `content/uw-research-computing/data/compat.yaml`: which CHTC GPUs each
 * framework version and CUDA toolkit can run on. Read with the failsafe
 * schema so every value stays a string; the default schema would read a
 * version key such as `2.10` as the number 2.1.
 */
export function loadGpuCompat(): GpuCompat {
  const file = path.join(process.cwd(), 'content', 'uw-research-computing', 'data', 'compat.yaml');
  const raw = load(fs.readFileSync(file, 'utf8'), { schema: FAILSAFE_SCHEMA }) as RawCompat;
  return {
    lastUpdated: raw.last_updated,
    frameworks: Object.entries(raw.frameworks).map(([id, versions]) => ({
      id,
      label: FRAMEWORK_LABELS[id] ?? id,
      versions: Object.entries(versions)
        .map(([version, builds]) => ({
          version,
          builds: builds
            .map((build) => ({
              cudaToolkit: build.cuda_toolkit,
              minNvidiaDriverVersion: build.min_nvidia_driver_version,
              minDriverCuda: build.min_driver_cuda,
              capabilityRange: capabilityRange(build.compute_capability),
              compatibleGpus: Number(build.n_compatible_gpus),
              chips: chips(build),
              requirements: build.condor_requirements,
            }))
            .sort((a, b) => compareVersionsDescending(b.cudaToolkit, a.cudaToolkit)),
        }))
        .sort((a, b) => compareVersionsDescending(a.version, b.version)),
    })),
  };
}
