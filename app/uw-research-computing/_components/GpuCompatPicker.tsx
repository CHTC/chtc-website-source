'use client';

import { useState } from 'react';
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import type { CompatFramework, CompatVersion } from '../_lib/gpuCompat';

/** The version's build for this toolkit, or the one that matches the most GPUs. */
const buildFor = (version: CompatVersion, cudaToolkit: string) =>
  version.builds.find((candidate) => candidate.cudaToolkit === cudaToolkit) ??
  version.builds.find((candidate) => candidate.cudaToolkit === version.defaultCudaToolkit) ??
  version.builds[0];

/**
 * Cascading drop-downs: pick a framework, then one of its versions, then a
 * CUDA toolkit that version was built for, and see the submit file lines
 * that match the job to GPUs it can run on. Rendered by `GpuCompatFinder`.
 */
const GpuCompatPicker = ({ frameworks }: { frameworks: CompatFramework[] }) => {
  const [frameworkId, setFrameworkId] = useState(frameworks[0].id);
  const framework = frameworks.find(({ id }) => id === frameworkId) ?? frameworks[0];

  const [versionId, setVersionId] = useState(framework.versions[0].version);
  const version = framework.versions.find(({ version }) => version === versionId) ?? framework.versions[0];

  const [cudaToolkit, setCudaToolkit] = useState(version.defaultCudaToolkit);
  const build = buildFor(version, cudaToolkit);

  const [copied, setCopied] = useState(false);
  const submitLines = `request_gpus = 1\n${build.submitLines}`;

  /** Keep the toolkit when the new version has it; otherwise the one that matches the most GPUs. */
  const chooseVersion = (next: string, from = framework) => {
    const nextVersion = from.versions.find(({ version }) => version === next) ?? from.versions[0];
    setVersionId(nextVersion.version);
    setCudaToolkit(buildFor(nextVersion, cudaToolkit).cudaToolkit);
    setCopied(false);
  };

  const chooseFramework = (next: string) => {
    const nextFramework = frameworks.find(({ id }) => id === next) ?? frameworks[0];
    setFrameworkId(nextFramework.id);
    // A toolkit means something different in another framework, so start from its default.
    setVersionId(nextFramework.versions[0].version);
    setCudaToolkit(nextFramework.versions[0].defaultCudaToolkit);
    setCopied(false);
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
          disabled={framework.versions.length === 1}
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
          // Locked, not hidden: which toolkit the build uses is part of the answer.
          disabled={version.builds.length === 1}
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
        <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography component='p' variant='subtitle2' aria-live='polite' sx={{ fontWeight: 700 }}>
            Add to your submit file for {framework.label} {version.version} with CUDA toolkit {build.cudaToolkit}
          </Typography>
          <Button size='small' startIcon={<ContentCopy fontSize='small' />} onClick={copy} sx={{ flexShrink: 0 }}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </Stack>
        <Box component='pre' sx={{ whiteSpace: 'pre-wrap' }}>
          <code>{submitLines}</code>
        </Box>

        {build.notes.map((note) => (
          <Alert key={note} severity='warning' sx={{ mb: 2 }}>
            {note}
          </Alert>
        ))}

        <Typography component='p' variant='body2' sx={{ color: 'text.secondary', mb: 0 }}>
          Compute capability {build.capabilityRange}. Needs NVIDIA driver {build.minNvidiaDriverVersion} or newer
          (supports CUDA {build.minDriverCuda}).
        </Typography>
      </Box>
    </Paper>
  );
};

export default GpuCompatPicker;
