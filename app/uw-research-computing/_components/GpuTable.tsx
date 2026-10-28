import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { readYaml } from '../_lib/docs';
import { Footnote } from './DocBlocks';

interface Gpu {
  gpu_name: string;
  gpu_type: string;
  hardware_generation: number | string;
  gpu_memory?: string;
  gpus_minimum_memory: string;
  shared_memory?: boolean;
  open_gpus: number;
  backfill_gpus: number;
  open_servers?: string[];
}

/** Right-aligned, fixed-width digits so the counts line up. */
const NUM_SX = { textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' } as const;
const HEAD_SX = { verticalAlign: 'bottom' } as const;
const TOTAL_SX = { fontWeight: 700, borderTop: 2 } as const;

const Num = ({ children, sx }: { children: ReactNode; sx?: object }) => (
  <Box component='td' sx={{ ...NUM_SX, ...sx }}>
    {children}
  </Box>
);

/** YAML reads `6.0` as the number 6; compute capabilities print as x.y. */
const capability = (gpu: Gpu) =>
  typeof gpu.hardware_generation === 'number' ? gpu.hardware_generation.toFixed(1) : gpu.hardware_generation;

/** The GPU's name with the marks that point at the notes under the table. */
const GpuName = ({ gpu }: { gpu: Gpu }) => (
  <td>
    {gpu.gpu_name}
    {gpu.shared_memory && <sup>§</sup>}
    {gpu.gpu_type.includes('MIG') && <sup>‡</sup>}
  </td>
);

const sum = (gpus: Gpu[], count: (gpu: Gpu) => number) => gpus.reduce((total, gpu) => total + count(gpu), 0);

/**
 * The GPUs in the HTC pool, from `content/uw-research-computing/data/gpus.yaml`:
 * the types with open capacity, with their open, backfill and total counts,
 * then the types only reachable as backfill in a collapsed table, then the
 * notes the marks in both refer to.
 */
const GpuTable = () => {
  const gpus = readYaml<Gpu[]>('data/gpus.yaml');
  const open = gpus.filter((gpu) => gpu.open_gpus > 0);
  const backfillOnly = gpus.filter((gpu) => gpu.open_gpus === 0);
  const openTotal = sum(gpus, (gpu) => gpu.open_gpus);
  const backfillTotal = sum(gpus, (gpu) => gpu.backfill_gpus);
  const anySharedMemory = gpus.some((gpu) => gpu.shared_memory);

  return (
    <>
      <Box sx={{ overflowX: 'auto', mb: 2 }}>
        <table>
          <thead>
            <tr>
              <Box component='th' rowSpan={2} sx={HEAD_SX}>
                GPU Name
              </Box>
              <Box component='th' rowSpan={2} sx={{ ...HEAD_SX, ...NUM_SX }}>
                Hardware Generation
                <br />
                <small>
                  (<code>GPUs_Capability</code>)
                </small>
              </Box>
              <Box component='th' rowSpan={2} sx={{ ...HEAD_SX, ...NUM_SX }}>
                GPU Memory (VRAM)
                <br />
                <small>
                  (<code>gpus_minimum_memory</code>)<sup>†</sup>
                </small>
              </Box>
              <Box component='th' colSpan={3} sx={{ textAlign: 'center' }}>
                Number of GPUs
              </Box>
            </tr>
            <tr>
              <Box component='th' sx={NUM_SX}>
                Open capacity
              </Box>
              <Box component='th' sx={NUM_SX}>
                Backfill
              </Box>
              <Box component='th' sx={NUM_SX}>
                Total
              </Box>
            </tr>
          </thead>
          <tbody>
            {open.map((gpu) => (
              <tr key={gpu.gpu_name}>
                <GpuName gpu={gpu} />
                <Num>{capability(gpu)}</Num>
                <Num>
                  <code>{gpu.gpus_minimum_memory}</code>
                </Num>
                <Num>{gpu.open_gpus}</Num>
                <Num>{gpu.backfill_gpus}</Num>
                <Num>{gpu.open_gpus + gpu.backfill_gpus}</Num>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <Box component='td' colSpan={3} sx={TOTAL_SX}>
                Total, all GPU types
              </Box>
              <Num sx={TOTAL_SX}>{openTotal}</Num>
              <Num sx={TOTAL_SX}>{backfillTotal}</Num>
              <Num sx={TOTAL_SX}>{openTotal + backfillTotal}</Num>
            </tr>
          </tfoot>
        </table>
      </Box>

      {backfillOnly.length > 0 && (
        <details>
          <summary>GPU types available only through backfill</summary>
          <Box sx={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>GPU Name</th>
                  <Box component='th' sx={NUM_SX}>
                    Capability
                  </Box>
                  <Box component='th' sx={NUM_SX}>
                    Memory<sup>†</sup>
                  </Box>
                  <Box component='th' sx={NUM_SX}>
                    GPUs
                  </Box>
                </tr>
              </thead>
              <tbody>
                {backfillOnly.map((gpu) => (
                  <tr key={gpu.gpu_name}>
                    <GpuName gpu={gpu} />
                    <Num>{capability(gpu)}</Num>
                    <Num>
                      <code>{gpu.gpus_minimum_memory}</code>
                    </Num>
                    <Num>{gpu.backfill_gpus}</Num>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <Box component='td' colSpan={3} sx={TOTAL_SX}>
                    Total
                  </Box>
                  <Num sx={TOTAL_SX}>{sum(backfillOnly, (gpu) => gpu.backfill_gpus)}</Num>
                </tr>
              </tfoot>
            </table>
          </Box>
        </details>
      )}

      <Footnote>
        <sup>†</sup> The largest <code>gpus_minimum_memory</code> value that still matches this GPU. A higher
        value excludes it. A lower value also matches GPUs with less memory.
        {anySharedMemory && (
          <>
            <br />
            <sup>§</sup> The CPU and GPU share one pool of memory. Memory your job uses on the CPU leaves less
            for the GPU.
          </>
        )}
        <br />
        <sup>‡</sup> A MIG slice is part of one A100 GPU. It has 40&nbsp;GB of memory but about 40% of the
        computing power of a full A100. Two slices share one A100.
      </Footnote>
    </>
  );
};

export default GpuTable;
