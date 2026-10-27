import { Box } from '@mui/material';
import { loadGpuCompat } from '../_lib/gpuCompat';

/**
 * Every version of one framework from `data/compat.yaml`, with each CUDA
 * toolkit it was built for and the submit file lines for it. The full
 * listing under the `GpuCompatFinder` picker, so it is in the HTML for
 * search engines and readers without JavaScript.
 */
const GpuCompatTable = ({ framework }: { framework: string }) => {
  const entry = loadGpuCompat().frameworks.find(({ id }) => id === framework);
  if (!entry) throw new Error(`GpuCompatTable: no framework "${framework}" in data/compat.yaml`);

  return (
    <Box sx={{ overflowX: 'auto', mb: 2 }}>
      <table>
        <thead>
          <tr>
            <th scope='col'>{entry.label} version</th>
            <th scope='col'>CUDA toolkit</th>
            <th scope='col'>Compute capability</th>
            <th scope='col'>Submit file lines</th>
          </tr>
        </thead>
        <tbody>
          {entry.versions.flatMap(({ version, builds }) =>
            builds.map((build, index) => (
              <tr key={`${version}-${build.cudaToolkit}`}>
                {index === 0 && (
                  <th scope='rowgroup' rowSpan={builds.length} style={{ verticalAlign: 'top' }}>
                    {version}
                  </th>
                )}
                <td>{build.cudaToolkit}</td>
                <td>{build.capabilityRange}</td>
                <td>
                  <Box component='code' sx={{ whiteSpace: 'pre' }}>
                    {build.submitLines}
                  </Box>
                  {build.notes.map((note) => (
                    <Box key={note} component='small' sx={{ display: 'block', mt: 1 }}>
                      Note: {note}
                    </Box>
                  ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Box>
  );
};

export default GpuCompatTable;
