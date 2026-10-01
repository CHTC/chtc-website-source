---
highlighter: none
layout: guide
title: Adding External Resources with HTCondor Annex
guide:
    category: Special use cases
    tag:
        - htc
---

HTCondor Annex lets you use resources from an external HPC allocation to run jobs submitted through your CHTC Access Point. This guide walks through the steps to create an annex, transfer its setup files, and launch GPU execution points on an external cluster. 

> **Under development:** This guide and the HTCondor Annex workflow are actively being developed. Commands and configuration details may change. Please contact the CHTC facilitation team before getting started.

{% capture content %}

- [Log in to your Access Point](#1-log-in-to-your-access-point)
- [Prepare and submit your HTCondor jobs](#2-prepare-and-submit-your-htcondor-jobs)
- [Create and transfer the annex](#3-create-and-transfer-the-annex)
- [Set up the annex on Expanse](#4-set-up-the-annex-on-expanse)
- [Configure the Slurm job](#5-configure-the-slurm-job)
- [Start the annex](#6-start-the-annex)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

In this guide, you will set up an HTCondor Annex to make resources on 
[Expanse](https://www.sdsc.edu/systems/expanse/index.html)
available to jobs submitted from your CHTC Access Point. 

**Prerequisites**

<ul>
<li style="margin-top: 1px;">An account on a CHTC Access Point (ap2001, ap2002)</li>
<li style="margin-top: 1px;">An account on Expanse</li>
<li style="margin-top: 1px;">An Expanse allocation</li>
</ul>

In what follows, replace `<netid>`, `<username>`, and `<project>` with your own information. This example creates an annex named `my_annex` using a Slurm array of 24 jobs, each requesting one GPU, one CPU, and 32 GB of memory. Use the same annex name throughout.

> ### ❓ Does Annex work on other clusters? 
{:.tip-header} 

> Yes! In this example we are using a single cluster (Expanse), but the Annex 
> can be used on other external clusters as well. Talk to the Facilitation team 
> if you would like to use an Annex on a different system. 
{:.tip}

## 1. Log in to your Access Point

```
ssh <netid>@ap2001.chtc.wisc.edu
```
{:.term}

## 2. Prepare and submit your HTCondor jobs

Add these lines to your submit file (for example, `hello.sub`), along with your executable, resource requests, and other job settings:

```
MY.TargetAnnexName = "my_annex"
MY.WantFlocking = true
```

> ### 💡 Want to *only* use your Annexed Capacity?
{:.tip-header}

> If you would like your job to **only** run on your annexed capacity (and not Open Capacity), add the following to your requirements' line:
> ```condor
> (Target.AnnexName == "my_annex")
> ```
{:.tip}


Submit your jobs:

```
condor_submit hello.sub
```
{:.term}

## 3. Create and transfer the annex

On the Access Point, create the annex and copy its tarball to your Expanse home directory:

```
htcondor annex create my_annex
```
{:.term}

This will generate a tarball with your annex setup and required files. Transfer it to the HPC cluster you'd like to annex from (in this example, Expanse):

```
scp annex-my_annex.tar <username>@login.expanse.sdsc.edu:~/
```
{:.term}

## 4. Set up the annex on the remote cluster

Log in and extract the tarball:

```bash
ssh <username>@login.expanse.sdsc.edu
tar -xvf annex-my_annex.tar
```
{:.term}

Change to the directory containing the extracted annex scripts and run the 
annex setup script. 

```bash
cd annex-my_annex
./annex-setup.sh
```
{:.term}

## 5. Configure the Slurm job

Edit `hpc.slurm` to use your Expanse project account and desired wall time. You should 
only need to change the `#SBATCH` variables; the commands below the `#SBATCH` variables 
should remain unchanged. 

The example below requests one hour; adjust the array size and resource requests to suit your allocation and workload.

```bash
#!/bin/bash
#SBATCH -J my_annex
#SBATCH -o %A_%a.out
#SBATCH -e %A_%a.err
#SBATCH --array=1-24
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --gpus=1
#SBATCH --cpus-per-task=1
#SBATCH --mem=32G
#SBATCH --partition=gpu-shared
#SBATCH --account=<project>
#SBATCH --time=0-01:00:00

module load gpu
module load slurm

echo "$(date) $(hostname) Annex job starting"
export ANNEX_JOBID=${SLURM_JOBID:-pid-$$}
SCRATCH="${PWD}"
if [ -f ~/.condor/annex_config ]; then
    . ~/.condor/annex_config
fi
PILOT_DIR="${SCRATCH}/pilot.${ANNEX_JOBID}"

echo "$(date) $(hostname) Performing setup tasks"
./annex-job-setup.sh "$PILOT_DIR"

# This will block until all of the pilots terminate.
echo "$(date) $(hostname) Launching EPs"
if [ -z "$SLURM_JOBID" ]; then
    ./annex-node.sh "$PILOT_DIR"
else
    srun -K0 -W0 ./annex-node.sh "$PILOT_DIR"
fi

echo "$(date) $(hostname) All EPs have exited, performing cleanup"
echo "$(date) $(hostname) Removing temporary directory ${PILOT_DIR}"
rm -fr -- "${PILOT_DIR}"
echo "$(date) $(hostname) Annex job complete, exiting"
```

## 6. Start the annex

From the directory containing the annex scripts, submit the Slurm job:

```bash
sbatch hpc.slurm
```
{:.term}

As Slurm starts the array tasks, they launch HTCondor execution points for your annex. Your queued HTCondor jobs can then match these resources when their requirements are satisfied. Actual concurrency depends on resource availability and Slurm limits.

> **Single-user requirement:** The user who submits HTCondor jobs to the annex must also be the user who creates it. Support for one user creating an annex that multiple users can use is under development; this documentation will be updated when it is available.

## 7. Monitor and shut down the annex

You can monitor the annex in two ways: 

1. From the Expanse login node, you can view if the job array is running (using `squeue`) 
and look at the SLURM error and output files. 
1. From the CHTC Access Point, you can run the following command
	```
	htcondor annex status
	```
	{:.term}

If you want to stop the annex at any point (before it reaches its timeout), remove the job array submitted on Expanse. 