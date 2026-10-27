'use client';

import { useState } from 'react';
import { Alert, Badge, Box, Button, Chip, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import type { CompatBuild, CompatFramework } from '../_lib/gpuCompat';

/** The build that runs on the most GPUs; the newest toolkit on a tie (builds come newest first). */
const widest = (builds: CompatBuild[]): CompatBuild =>
  builds.reduce((best, build) => (build.compatibleGpus > best.compatibleGpus ? build : best));

/**
 * Cascading drop-downs: pick a framework, then one of its versions, then a
 * CUDA toolkit that version was built for, and see the submit file
 * requirements and which CHTC GPUs match. Rendered by `GpuCompatFinder`.
 */
const GpuCompatPicker = ({ frameworks }: { frameworks: CompatFramework[] }) => {
  const [frameworkId, setFrameworkId] = useState(frameworks[0].id);
  const framework = frameworks.find(({ id }) => id === frameworkId) ?? frameworks[0];

  const [versionId, setVersionId] = useState(framework.versions[0].version);
  const version = framework.versions.find(({ version }) => version === versionId) ?? framework.versions[0];

  const [cudaToolkit, setCudaToolkit] = useState(widest(version.builds).cudaToolkit);
  const build = version.builds.find((candidate) => candidate.cudaToolkit === cudaToolkit) ?? widest(version.builds);
  const better = widest(version.builds);

  const [copied, setCopied] = useState(false);
  const submitLines = `request_gpus = 1\n${build.requirements}`;

  /** Keep the toolkit when the new version has it; otherwise the one with the most GPUs. */
  const chooseVersion = (next: string, from = framework) => {
    const builds = (from.versions.find(({ version }) => version === next) ?? from.versions[0]).builds;
    setVersionId(next);
    setCudaToolkit(builds.some((candidate) => candidate.cudaToolkit === cudaToolkit) ? cudaToolkit : widest(builds).cudaToolkit);
    setCopied(false);
  };

  const chooseFramework = (next: string) => {
    const nextFramework = frameworks.find(({ id }) => id === next) ?? frameworks[0];
    setFrameworkId(next);
    chooseVersion(nextFramework.versions[0].version, nextFramework);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(submitLines);
    setCopied(true);
  };

  return (
    <Paper variant='outlined' sx={{ my: 3, p: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {/* With one framework in the data, the version label names it. */}
        {frameworks.length > 1 && (
          <TextField
            select
            fullWidth
            size='small'
            label='Framework'
            value={framework.id}
            onChange={(event) => chooseFramework(event.target.value)}
          >
            {frameworks.map(({ id, label }) => (
              <MenuItem key={id} value={id}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          select
          fullWidth
          size='small'
          label={`${framework.label} version`}
          value={version.version}
          onChange={(event) => chooseVersion(event.target.value)}
        >
          {framework.versions.map(({ version }) => (
            <MenuItem key={version} value={version}>
              {version}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          size='small'
          label='CUDA toolkit'
          value={build.cudaToolkit}
          onChange={(event) => {
            setCudaToolkit(event.target.value);
            setCopied(false);
          }}
        >
          {version.builds.map(({ cudaToolkit }) => (
            <MenuItem key={cudaToolkit} value={cudaToolkit}>
              {cudaToolkit}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Typography component='p' variant='h5' aria-live='polite' sx={{ fontWeight: 700 }}>
          {build.compatibleGpus} GPUs match
        </Typography>
        <Typography component='p' variant='body2' sx={{ color: 'text.secondary', mb: 1.5 }}>
          {framework.label} {version.version} with CUDA toolkit {build.cudaToolkit}
        </Typography>
        {/* Room above the chips for the count badges. */}
        <Stack direction='row' useFlexGap spacing={2} sx={{ flexWrap: 'wrap', pt: 1, mb: 2 }}>
          {build.chips.map(({ name, count }) => (
            <Badge key={name} badgeContent={count} color='primary' max={999}>
              <Chip
                label={name}
                size='small'
                color='primary'
                variant='outlined'
                aria-label={count === undefined ? name : `${name}: ${count} GPUs`}
              />
            </Badge>
          ))}
        </Stack>

        {better.compatibleGpus > build.compatibleGpus && (
          <Alert severity='info' sx={{ mb: 2 }}>
            {framework.label} {version.version} built for CUDA toolkit {better.cudaToolkit} matches{' '}
            {better.compatibleGpus} GPUs. Use that build unless you need CUDA {build.cudaToolkit}.
          </Alert>
        )}

        <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography component='p' variant='subtitle2' sx={{ fontWeight: 700 }}>
            Add to your submit file
          </Typography>
          <Button size='small' startIcon={<ContentCopy fontSize='small' />} onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </Stack>
        <Box component='pre' sx={{ whiteSpace: 'pre-wrap' }}>
          <code>{submitLines}</code>
        </Box>

        <Typography component='p' variant='body2' sx={{ color: 'text.secondary', mb: 0 }}>
          Compute capability {build.capabilityRange}. Needs NVIDIA driver {build.minNvidiaDriverVersion} or newer
          (supports CUDA {build.minDriverCuda}).
        </Typography>
      </Box>
    </Paper>
  );
};

export default GpuCompatPicker;
