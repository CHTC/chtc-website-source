---
layout: guide
title: "Quick reference: Slurm and HPC commands"
alt_title: "Quick reference: Slurm and HPC commands"
guide:
    category: Get started
    tag: hpc
---

## Introduction

This page lists common Slurm commands and options for jobs. Users familiar with Slurm and job submission on CHTC's High Performance Computing (HPC) system can use this page as a quick reference. For users who are just starting out, we suggest reading the full guides to understand the full context of each command or option.

{% capture content %}
- [Introduction](#introduction)
- [Submit jobs](#submit-jobs)
- [Monitor jobs](#monitor-jobs)
- [Machine information](#machine-information)
- [Modules](#modules)
- [Check quotas](#check-quotas)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

> **Please note the following!** 
> 
> * Bracketed items (`<>`) denote where to place your input. 
>   Do not include the brackets in your command.
> * All commands should be entered on a single line.

## Submit jobs

See our [job submission](hpc-job-submission) guide for more information.

| Command | Use | Notes |
| --- | --- | --- |
| `sbatch <executable.sh>` | submits job(s) as specified by `executable.sh`. | **We recommend using `sbatch` over the other methods.** |
| `srun --mpi=pmix -n4 -N1 -p int --pty bash` | submits an interactive job (intended for simple testing/compiling) | The example uses 4 cores, 1 node, and submits to the *interactive* partition |
| `scancel <job_ID>` | removes the job(s) associated with `job_ID`. |
| `scontrol hold <job_ID>` | holds the job(s) associated with `job_ID` and leaves it in the queue. |
| `scontrol release <job_ID>` | releases the held job associated with `job_ID` to the queue. | 

### Submit jobs using `salloc`

We recommend using `sbatch` to submit jobs (see above) instead of `salloc`. See [this guide](hpc-job-submission#for-running-mpi-code) for more information.

| Command | Use | Notes |
| --- | --- | --- |
| `salloc -n4 -N1 -p int ` | requests an allocation for a job | The example uses 4 cores, 1 node, and submits to the *interactive* partition |
| `srun --mpi=pmix </path/to/mpi/script>` | executes a script using allocated resources (`salloc`) |
| `srun --mpi=pmix --pty bash` | submits an interactive job using allocated resources (`salloc`) | 
| `echo $SLURM_JOB_ID` | check to see if you are currently using an allocation. If so, a job ID is returned. |
| `exit` | end your allocation |
{:.command-table}

## Monitor jobs

Use these commands to monitor your submitted jobs.

| Command | Use |
| --- | --- |
| `squeue --me` | displays status of your submitted jobs |
| `squeue -u <username>` | displays status of your submitted jobs by username |
| `squeue -p <partition>` | displays status of your submitted jobs by partition |
| `seff <job_ID>` | view job performance |

### View job information with `sacct`

`sacct` displays information about job(s) from the SLURM database. The table below displays options to filter information. Multiple options may be combined.

| `sacct --jobs <job_ID>,<job_ID>` | filters by `job_ID` |
| `sacct --start=<YYYY-MM-DD>` | filters jobs starting from date `YYYY-MM-DD` |
| `sacct --end=<YYYY-MM-DD>` | filters jobs ending by date `YYYY-MM-DD`. | Should be used with `--start`, since the default option only returns jobs from the current day. |
{:.command-table}

## Machine information

These commands display information about the machines that execute jobs.

| Command | Use | Notes |
| --- | --- | --- |
| `sinfo` | displays information about nodes |
| `sinfo -n <node>` | displays information about specified node | Example: `sinfo -n spark-a006` |
| `sinfo -p <partition>` | displays information about specified partition | Example: `sinfo -p pre` |
{:.command-table}

## Modules

These commands access software in the module system. Read [this guide](hpc-software#2-using-pre-installed-software-in-modules) for more information.

| Command | Use |
| --- | --- | --- |
| `module avail` | displays available software modules |
| `module spider <keyword>` | searches for `<keyword>` in available modules |
| `module load <module>` | loads `<module>` |
| `module unload <module>` | unloads `<module>` |
| `module list` | shows all currently loaded modules |
| `module purge` | unloads all modules |
{:.command-table}

## Check quotas

| Command | Use |
| --- | --- | --- |
| `get_quotas` | shows your `/home` and `/scratch` disk and files quota |
| `get_quotas -p <path>` | shows the disk and files quota for a specified path, such as a group directory |

## Related pages

* [Slurm documentation](https://slurm.schedmd.com/)
