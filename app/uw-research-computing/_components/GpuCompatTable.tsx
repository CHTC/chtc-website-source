import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { loadGpuCompat } from '../_lib/gpuCompat';
import GpuCompatNote from './GpuCompatNote';

/**
 * Every version of one framework from `data/compat.yaml`, with each CUDA
 * toolkit it was built for, the GPUs it runs on and the submit file lines for
 * it. The full listing under the `GpuCompatFinder` picker, collapsed under the
 * framework's name until opened. The table stays in the HTML while collapsed,
 * for search engines and readers without JavaScript.
 */
const GpuCompatTable = ({ framework }: { framework: string }) => {
  const entry = loadGpuCompat().frameworks.find(({ id }) => id === framework);
  if (!entry) throw new Error(`GpuCompatTable: no framework "${framework}" in data/compat.yaml`);

  return (
    <Accordion
      disableGutters
      variant='outlined'
      slotProps={{ heading: { component: 'h2', id: framework } }}
      sx={{ mb: 2, '&::before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMore />} aria-controls={`${framework}-versions`}>
        <Typography component='span' variant='h6'>
          {entry.label}
        </Typography>
        <Typography component='span' sx={{ color: 'text.secondary', alignSelf: 'center', ml: 2 }}>
          {entry.versions.length} versions
        </Typography>
      </AccordionSummary>
      <AccordionDetails id={`${framework}-versions`} sx={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th scope='col'>Version</th>
              <th scope='col'>CUDA toolkit</th>
              <th scope='col'>GPUs it runs on</th>
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
                  <td>
                    <Box component='strong' sx={{ display: 'block' }}>
                      {build.gpuCount} GPUs
                    </Box>
                    {build.gpuModels.join(', ')}
                  </td>
                  <td>
                    {/* A block, not inline code: inline code's padding indents only the first line. */}
                    <Box component='pre' sx={{ m: 0, py: 0.5, px: 1, whiteSpace: 'pre', fontSize: '0.8125rem' }}>
                      <code>{build.submitLines}</code>
                    </Box>
                    {build.notes.map((note) => (
                      <Box key={note} component='small' sx={{ display: 'block', mt: 1 }}>
                        Note: <GpuCompatNote note={note} />
                      </Box>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
};

export default GpuCompatTable;
