import fs from 'fs';
import path from 'path';
import { FAILSAFE_SCHEMA, load } from 'js-yaml';

/** One framework build: a version compiled against one CUDA toolkit. */
export interface CompatBuild {
  cudaToolkit: string;
  minNvidiaDriverVersion: string;
  /** The CUDA version the driver must support: `gpus_minimum_runtime`. */
  minDriverCuda: string;
  /** The compute capabilities it supports: `7.5 to 9.0, except 8.9`. */
  capabilityRange: string;
  /** The `gpus_*` submit file lines. */
  submitLines: string;
  /** Caveats, from the `# Note:` lines in the data. */
  notes: string[];
}

export interface CompatVersion {
  version: string;
  builds: CompatBuild[];
  /** The build that matches the most GPUs: the lowest runtime, then the widest capability range. */
  defaultCudaToolkit: string;
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
  /** `gpus_*` submit file lines, then any `# Note: ...` lines. */
  condor_requirements: string;
}

interface RawCompat {
  last_updated: string;
  frameworks: Record<string, Record<string, RawBuild[]>>;
}

const capabilityRange = ({ min, max, excluded = [] }: RawBuild['compute_capability']): string =>
  `${min} to ${max}` + (excluded.length ? `, except ${excluded.join(', ')}` : '');

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

const toBuild = (build: RawBuild): CompatBuild => {
  const lines = build.condor_requirements.split('\n').map((line) => line.trim()).filter(Boolean);
  return {
    cudaToolkit: build.cuda_toolkit,
    minNvidiaDriverVersion: build.min_nvidia_driver_version,
    minDriverCuda: build.min_driver_cuda,
    capabilityRange: capabilityRange(build.compute_capability),
    submitLines: lines.filter((line) => !line.startsWith('#')).join('\n'),
    notes: lines.filter((line) => line.startsWith('#')).map((line) => line.replace(/^#\s*(Note:\s*)?/, '')),
  };
};

/** The build with the lowest `gpus_minimum_runtime`, then the widest capability range. */
const broadest = (builds: RawBuild[]): RawBuild =>
  [...builds].sort(
    (a, b) =>
      compareVersionsDescending(b.min_driver_cuda, a.min_driver_cuda) ||
      compareVersionsDescending(b.compute_capability.min, a.compute_capability.min) ||
      compareVersionsDescending(a.compute_capability.max, b.compute_capability.max)
  )[0];

/**
 * `content/uw-research-computing/data/compat.yaml`: the GPUs each framework
 * version and CUDA toolkit can run on, as submit file lines. Read with the
 * failsafe schema so every value stays a string; the default schema would
 * read a version key such as `2.10` as the number 2.1.
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
            .map(toBuild)
            .sort((a, b) => compareVersionsDescending(b.cudaToolkit, a.cudaToolkit)),
          defaultCudaToolkit: broadest(builds).cuda_toolkit,
        }))
        .sort((a, b) => compareVersionsDescending(a.version, b.version)),
    })),
  };
}
