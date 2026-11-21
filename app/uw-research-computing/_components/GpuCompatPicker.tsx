'use client';

import { useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import type { CompatBuild, CompatFramework, CompatVersion } from '../_lib/gpuCompat';
import GpuCompatNote from './GpuCompatNote';

/** The version's build for this toolkit, or the one that matches the most GPUs. */
const buildFor = (version: CompatVersion, cudaToolkit: string) =>
  version.builds.find((candidate) => candidate.cudaToolkit === cudaToolkit) ??
  version.builds.find((candidate) => candidate.cudaToolkit === version.defaultCudaToolkit) ??
  version.builds[0];

/**
 * Versions that start with what was typed, so `2.1` offers 2.1.x and 2.10.x to
 * 2.19.x and `0.4.3` offers 0.4.38. A full release such as `v2.14.3` also
 * finds the `2.14.x` entry that covers it.
 */
const filterVersions = (options: string[], { inputValue }: { inputValue: string }) => {
  const typed = inputValue.trim().replace(/^v/i, '').toLowerCase();
  return options.filter((option) => {
    const minor = option.endsWith('.x') ? option.slice(0, -2) : undefined;
    return option.startsWith(typed) || (minor !== undefined && typed.startsWith(`${minor}.`));
  });
};

/** Every GPU model, filled when the build runs on it and outlined and struck through when it doesn't. */
const GpuModels = ({ build, gpuModels }: { build: CompatBuild; gpuModels: string[] }) => (
  <Box sx={{ mb: 3 }}>
    <Typography component='p' variant='subtitle2' aria-live='polite' sx={{ fontWeight: 700, mb: 1 }}>
      Runs on {build.gpuCount} GPUs ({build.gpuModels.length} of {gpuModels.length} models)
    </Typography>
    <Box component='ul' sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, listStyle: 'none', '&&': { p: 0, m: 0 }, '&& > li': { m: 0 } }}>
      {gpuModels.map((model) => {
        const compatible = build.gpuModels.includes(model);
        return (
          <li key={model}>
            <Chip
              size='small'
              label={model}
              color={compatible ? 'success' : 'default'}
              variant={compatible ? 'filled' : 'outlined'}
              aria-label={`${model}: ${compatible ? 'compatible' : 'not compatible'}`}
              sx={compatible ? undefined : { color: 'text.disabled', textDecoration: 'line-through' }}
            />
          </li>
        );
      })}
    </Box>
  </Box>
);

/**
 * Pick a framework, type or choose one of its versions, then a CUDA toolkit
 * that version was built for, and see the GPUs it runs on and the submit file
 * lines that match the job to them. Rendered by `GpuCompatFinder`.
 */
const GpuCompatPicker = ({ frameworks, gpuModels }: { frameworks: CompatFramework[]; gpuModels: string[] }) => {
  const [frameworkId, setFrameworkId] = useState(frameworks[0].id);
  const framework = frameworks.find(({ id }) => id === frameworkId) ?? frameworks[0];

  const [versionId, setVersionId] = useState(framework.versions[0].version);
  const version = framework.versions.find(({ version }) => version === versionId) ?? framework.versions[0];

  const [cudaToolkit, setCudaToolkit] = useState(version.defaultCudaToolkit);
  const build = buildFor(version, cudaToolkit);

  const [copied, setCopied] = useState(false);
  const submitLines = `request_gpus = 1\n${build.submitLines}`;

  /** Keep the toolkit when the new version has it; otherwise the one that matches the most GPUs. */
  const chooseVersion = (next: string) => {
    const nextVersion = framework.versions.find(({ version }) => version === next) ?? framework.versions[0];
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
        <Autocomplete
          fullWidth
          size='small'
          disableClearable
          autoHighlight
          options={framework.versions.map(({ version }) => version)}
          filterOptions={filterVersions}
          value={version.version}
          disabled={framework.versions.length === 1}
          onChange={(_, next) => chooseVersion(next)}
          noOptionsText='No tested version matches'
          renderInput={(params) => (
            <TextField {...params} label={`${framework.label} version`} placeholder='Type a version, like 2.4' />
          )}
        />
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
        <GpuModels build={build} gpuModels={gpuModels} />

        <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography component='p' variant='subtitle2' sx={{ fontWeight: 700 }}>
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
            <GpuCompatNote note={note} />
          </Alert>
        ))}

        <Typography component='p' variant='body2' sx={{ color: 'text.secondary', mb: 0 }}>
          Compute capability {build.capabilityRange}.{' '}
          {'image' in build.tested ? (
            <>
              Tested with <code>{build.tested.image}</code>.
            </>
          ) : (
            <>
              Tested with an image built from <code>{build.tested.baseImage}</code> with{' '}
              <code>pip install {build.tested.pipInstall}</code>.
            </>
          )}
        </Typography>
      </Box>
    </Paper>
  );
};

export default GpuCompatPicker;
