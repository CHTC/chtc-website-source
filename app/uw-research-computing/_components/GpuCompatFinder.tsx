import { loadGpuCompat } from '../_lib/gpuCompat';
import GpuCompatPicker from './GpuCompatPicker';

/**
 * The framework / version / CUDA toolkit picker for `data/compat.yaml`. The
 * data is read at build time and handed to the client-side picker.
 */
const GpuCompatFinder = () => {
  const { frameworks } = loadGpuCompat();
  return <GpuCompatPicker frameworks={frameworks} />;
};

export default GpuCompatFinder;
