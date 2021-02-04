---
highlighter: none
layout: default
title: HPC Cluster Basic Use Guide
---

> **Notice:** The HPC cluster is currently being transitioned to a 
>  new configuration. Please start new and move existing workflows 
> to the new configuration described in [these guides](/hpc-overview).
> 
> This page will be archived when we have fully transitioned the cluster 
> to the new configuration on November 24, 2020. 

The CHTC has partnered with the UW-Madison [Advanced Computing
Initiative](http://aci.wisc.edu/) (ACI) in order to provide a dedicated
high-performance computing (HPC) cluster meant for large, singular
computations that use specialized software to achieve internal
parallelization of work across multiple servers of dozens to hundreds of
cores. All other computational work, including that in the form of
single or multiple compute jobs that each complete in less than 72 hours
on a single node will run more efficiently on our larger high-throughput
computing (HTC) system (which also includes specialized hardware for
extreme memory, GPUs, and other cases), and should not be run on the HPC
Cluster.\
\
Before using the campus-shared HPC Cluster or any CHTC computing
resource, **you will need to obtain access** by filling out the
[Large-Scale Computing Request Form](/form) on
our website so that our Research Computing Facilitators can make sure to
match you to the best computing resources (including non-CHTC
services).\
\
If you have been using the HPC Cluster already, and believe your
research group would benefit from purchasing prioritized hardware to add
to the HPC Cluster, please see our [**information regarding buy-in
options for access to your own priority queue.**](/hpc-buy-in.shtml)

Contents
========

1.  [Cluster Configuration and Policies](#policy)
    -   [Hardware and Partition Configuration](#hardware)
    -   [Logging In](#head-nodes)
    -   [Data Storage](#files)
    -   [Partition Configuration and Job Scheduling](#job-scheduling)
2.  [Basic Use of the Cluster](#use)
    -   [Log in to the cluster head node](#log-in)
    -   [Software Capabilities](#software)
    -   [Submitting jobs](#job-submission)
        -   [Requesting an Interactive Job (\"int\" and \"pre\"
            partitions)](#interactive-job)
        -   [Submitting a Job to the Queue (all partitions)](#batch-job)
    -   [Viewing jobs in the queue](#queue)
    -   [Removing jobs](#remove)
3.  [Tools for Managing Home Directory Space](#homedir)


<a name="policy"/>

Cluster Configuration and Policies
==================================

<a name="hardware"/>

A. Hardware and Partition Configuration
---------------------------------------

The HPC Cluster servers consist of two head nodes and many compute nodes
(\"servers\") of memory and multiple CPU cores. There is one queue with
access to separate \"partitions\" of hardware, including the largest
partitions that are available to anyone on campus (for free).\
\
Our first generation nodes (\"univ\" partition) each have 16 CPU cores
of 2.2 GHz, and 64 GB of RAM (4 GB per CPU core). Our second generation
nodes (in the \"univ2\" partition) each have 20 CPU cores of 2.5 GHz,
and 128 GB of RAM. All users log in at a head node, and all user files
on the shared file sytem (Gluster) are accessible on all nodes.
Additionally, all nodes are tightly networked (56 Gbit/s Infiniband) so
they can work together as a single \"supercomputer\", depending on the
number of CPUs you specify.\
\
Because the HPC Cluster is specifically intended for singular compute
jobs requiring multiple nodes of cores (to complete in under a week),
users running work in the form of single-node (or smaller) computations
will be contacted to move such work to our larger and more appropriate
HTC System. Otherwise, such numerous smaller jobs impede the
effectiveness of the HPC Cluster for running larger jobs.

<a name="head-nodes"/>

B. Logging In
-------------

You may log in to the cluster, submit jobs, and transfer/move data
through either head node (aci-service-1.chtc.wisc.edu or
aci-service-2.chtc.wisc.edu).

**DO NOT RUN PROGRAMS ON THE HEAD NODES.**

Simple commands (to compress data, create directories, etc.) that run
within a few minutes on the head node are okay, but any scripts,
software, or other processes that perform data manipulations/creation
are VERY likely to kill the head nodes, creating signficant issues for
all active users and CHTC staff. To ensure proper functioning of the
cluster for ALL users, computational work should always be run within an
interactive session (see below) or batch job. **CHTC staff reserve the
right to kill any long-running or problematic processes on the head
nodes and/or disable user accounts that violate this policy**, and users
may not be notified of account deactivation. Processes that only
occasionally perform work (e.g. crontab, etc.) are still a violoation of
this policy.

If you are not able to log into the cluster, please contact us at
chtc@cs.wisc.edu.

Only ssh connections from an on-campus network are allowed, so you will
need to first connect to an on-campus server with ssh or Virtual Private
Network (VPN) before connecting to either HPC head node, when
off-campus. (The Division of IT provides the
[WiscVPN](https://it.wisc.edu/services/wiscvpn/), which will work for
users with a UW NetID.)

<a name="files"/>

C. Data Storage
---------------

**Data space in the HPC file system is not backed-up and should be
treated as temporary by users**. Only files necessary for
*actively-running* jobs should be kept on the file system, and files
should be removed from the cluster when jobs complete. A copy of any
essential files should be kept in an alternate, non-CHTC storage
location.\
\
**Each user is initially allocated 100 GB of data storage space and a
file count quota of 50,000 files/directories** in their home directory
(/home/*username*/). To check how many files and directories you have in
your home directory (and subdirectories), see the [instructions
below](#homedir). Increased quotas are available upon email request to
chtc@cs.wisc.edu. In your request, please include both size (in GB) and
file/directory counts for:

-   software packages installed in your home directory (if any)
-   the input and output for a single job

If you don\'t know how many files your installation creates, because
it\'s more than 50,000, simply indicate that in your request.\
\
**CHTC Staff reserve the right to remove any significant amounts of data
on the HPC Cluster** in our efforts to maintain filesystem performance
for all users, though we will always first ask users to remove excess
data and minimize file counts before taking additional action.\
\
**Local scratch space** of 500 GB is available on each execute node in
`/scratch/local/$USER` and is automatically cleaned out upon completion
of scheduled job sessions (interactive or non-interactive). Local
scratch is available on the compiling node, aci-service-2, in the same
location and should be cleaned out by the user upon completion of
compiling activities. CHTC staff will otherwise clean this location of
the oldest files when it reaches 80% capacity.

<a name="job-scheduling"/>

D. Partition Configuration and Job Scheduling
---------------------------------------------

The job scheduler on the HPC Cluster is SLURM. You can read more about
submitting jobs to the queue on [SLURM\'s
website](https://slurm.schedmd.com/overview.html), but
we have provided a simple guide below for getting started.\
\
We have provisioned 3 freely-available submission partitions and a small
set of nodes prioritized for interactive testing. These partitions can
be thought of as different queues, and are selected by the user at the
time of job submission.

### Per-user limitations

To promote fairness, **there is a 600-core running limit per-user across
the entire cluster of partitions,** with rare exceptions for researchers
who *own* more than this number of cores. Additionally, each user may
only have 10 jobs running at once. Users with many smaller (1-node or
2-node) jobs will find that they experience better throughput on CHTC\'s
high-throughput computing (HTC) system, and can email chtc@cs.wisc.edu
to get access.

{:.gtable}
  | Partition | p-name | \# nodes (N) | t-max | t-default | max nodes/job | cores/node (n) | RAM/node (GB) |
  | --- |
  | University | univ | 38 | 7 days | 1 day | 16 | 16 | 64
  | University 2 | univ2 | 148 | 7 days | 1 day | 16 | 20 | 128
  | Owners | *unique* | 124 | *unique* | *unique* | *unique* | 20 | 128
  | Interactive | int | 2 | 30 min | 30 min | 1 | 16 | 64
  | Pre-emptable (backfill) | pre | 316 | 24 hrs | 4 hrs | 16 | 16 or 20 | 64 or 128



\*note: jobs not requesting a run time will be alotted the default value
(t-default) for that partition; jobs without a partition indicated will
be run in the \"univ\" partition.\
\
The **University (univ)** partition is available to all UW-Madison
researchers, and jobs are run without being pre-empted for the duration
of time requested. This partition is best for running longer (multi-day)
jobs on any number of CPUs and will always have at least 32 nodes (512
cores), but usually much more.\
\
The ***Owner*** partitions actually consist of multiple group-specific
partitions for research groups who have paid into the cluster for a set
number of nodes. Each *owner* partition will have unique settings, and
owned nodes are backfilled by jobs from the \"pre\" queue.\
\
The **Interactive (int)** partition consists of a few nodes meant for
short and immediate interactive testing on a single node (up to 16 CPUs,
64 GB RAM). There is a specific command to access the \"int\"
partition:\
`srun -n16 -N1 -p int --pty bash`\
\
The **Pre-emptable (pre)** partition is under-layed on the entire
cluster and is meant for more immediate turn-around of shorter and
somewhat smaller jobs, or for interactive sessions requiring more than
the 30-minute limit of the \"int\" partition. Pre-emptable jobs will run
on any idle nodes (primarily Owner nodes, as the University partition is
likely to be full), but will be pre-empted by jobs of other partitions
with priority on those nodes. However, pre-empted jobs will be re-queued
if originally submitted with an sbatch script (see below).

Job Priority Determinations
---------------------------

\
**A. User priority decreases as the user accumulates hours of CPU time**
over the last 21 days, across all queues. This \"fair-share\" policy
means that users who have run many/larger jobs in the near-past will
have a lower priority, and users with little recent activity will see
their waiting jobs start sooner. We do NOT have a strict
\"first-in-first-out\" queue policy.\
**B. Job priority increases with job wait time.** After the
history-based user priority calculation in (A), the next most important
factor for each job\'s priority is the amount of time that each job has
already waited in the queue. For all the jobs of a single user, these
jobs will most closely follow a \"first-in-first-out\" policy.\
**C. Job priority increases with job size, in cores.** This least
important factor slightly favors larger jobs, as a means of somewhat
countering the inherently longer wait time necessary for allocating more
cores to a single job.

<a name="use"/>

Basic Use of the Cluster
========================

<a name="log-in"/>

**1. Log in to the cluster head node**
----------------------------------

Create an ssh connection to aci-service-1.chtc.wisc.edu using your
UW-Madison username and associated password.

### Checking partition availabilty

To see partitions that you can submit to, use the following command:

``` 
[alice@service]$ sinfo
```
{:.term}

Using the \"`-a`\" argument to \"`sinfo`\" will show ALL partitions.

<a name="software"/>

**2. Software Capabilities**
----------------------------------

As part of our overall strategy for enabling users through computing, we
actually encourage users to install and compile their desired software
(and version), as they wish, within the /home/*username* location.
Compiling, like any other computational work is best-performed in an
interactive session. If your compilation will take more than the 30
minutes allowed on our interactive (\"int\") partition, alter the
interactive job command below to submit to \"univ\" or \"univ2\" to have
more time. Please email chtc@cs.wisc.edu if you can\'t find the
compiler you need or have other issues.\
\
**For more specific details on compiling and running MPI code**\
Please see our [HPC Cluster MPI Use Guide](MPIuseguide) for information
about the availability of specific libraries and how to load modules for
them.

<a name="job-submission"/>

**3. Submitting jobs**
------------------

<a name="interactive-job"/>


**A. Requesting an Interactive Job (\"int\" and \"pre\" partitions)**\
You may request up to a full node (16 CPUs, 64 GB RAM) when requesting
an interactive session in the \"int\" partition. Interactive sessions on
the \"int\" partition are allowed for 30 minutes, but you may request
less time (see the below example). Sessions in the \"pre\" partition are
limited according to the \"Partition\" table above, but are potentially
subject to interruption.

``` 
[alice@service]$ srun -n16 -N1 -p int --pty bash
```
{:.term}

The above example indicates a request for 16 CPUs (`-n16`) on a single
node (`-N1`) in the \"int\" partition (`-p int`), and \"`-t 15`\" would
indicate a request for 15 minutes, if desired rather than the 30-minute
default. After the interactive shell is created to a compute node with
the above command, you\'ll have access to files on the shared file
system and be able to execute code interactively as if you had directly
logged in to that node. **It is important to exit the interactive shell
when you\'re done working by typing `exit`**.


<a name="batch-job"/>
**B. Submitting a Job to the Queue (all partitions)**\
To submit jobs to the queue for a given partition such that a connection
to the jobs is not maintained, you should use `sbatch` submission. You
will first want to create an `sbatch` script, which is is essentially
just a shell script (sh, bash, etc.) with `#SBATCH` descriptor lines.\
The following example requests a job slot with 16 CPU cores on each of 2
nodes (32 cores total) for 4 hours and 30 minutes:

``` {.sub}
#!/bin/sh
#This file is called submit-script.sh
#SBATCH --partition=univ        # default "univ", if not specified
#SBATCH --time=0-04:30:00       # run time in days-hh:mm:ss
#SBATCH --nodes=2           # require 2 nodes
#SBATCH --ntasks-per-node=16            # (by default, "ntasks"="cpus")
#SBATCH --mem-per-cpu=4000      # RAM per CPU core, in MB (default 4 GB/core)
#SBATCH --error=job.%J.err
#SBATCH --output=job.%J.out
#Make sure to change the above two lines to reflect your appropriate
# file locations for standard error and output

#Now list your executable command (or a string of them).
# Example for non-SLURM-compiled code:
module load mpi/gcc/openmpi-1.6.4
mpirun -n 32 /home/username/mpiprogram
```

You can then submit the script with the following command:

``` 
[alice@service]$ sbatch submit-script.sh
```
{:.term}

Other lines that you may wish to add to your script for specifying a
number of total tasks (equivalent to \"cores\" by default), desired CPU
cores per task (for multiple CPU cores per MPI task), or total RAM per
node are:

``` {.sub}
#SBATCH --mem=4000         # RAM per node, in MB (default 64000/node, max values in partition table)
#SBATCH --ntasks=32        # total number of "tasks" (cores) requested
#SBATCH --cpus-per-task=1  # default "1" if not specified
```

In any case, it is important to make sure that your request fits within
the hardware configuration of your chosen partition.\
\
**C. Using srun and salloc**\
In early tests with the cluster, we encouraged running non-interactive
jobs with SLURM\'s `srun` and `salloc` commands *without* an sbatch
script; however, doing so creates and requires a persistent connection
to your job as it runs, and interrupted jobs are not re-queued if
submitted this way (even when using the \"pre\" partition). You are
welcome to submit jobs in these modes according to [SLURM\'s user
guide](https://slurm.schedmd.com/overview.html), which
has some awesome advanced features for complex MPI configurations.\
**Please remember to indicate partition and run time with the -p and -t
flags, respectively** (see the interactive job command, above, for an
example using these flags).

<a name="queue"/>

**4. Viewing jobs in the queue**
----------------------------

To view *your* jobs in the SLURM queue, enter the following:

``` 
[alice@service]$ squeue -u username
```
{:.term}

Issuing `squeue` alone will show all user jobs in the queue. You can
view all jobs for a particular partition with \"`squeue -p univ`\"

<a name="remove"/>

**5. Removing jobs**
----------------

After running `squeue`, you can kill and/or remove your job from the
queue with the following:

``` 
[alice@service]$ scancel job#
```
{:.term}

where `job#` is the number shown for your job in the `squeue` output.

<a name="homedir"/>

Tools for Managing Home Directory Space
=======================================

**1. Checking Home Directory Usage**
--------------------------------

In order to check how many files and directories are contained in your
home directory, as well as the total amount of space used, we recommend
using the Linux tool `ncdu`.

To check data usage and file counts, run `ncdu` from within the
directory you\'d like to query. Example:

``` 
[alice@service]$ cd /home/alice
[alice@service]$ ncdu
```
{:.term}

When `ncdu` has finished running, the output will give you a total file
count and allow you to navigate between subdirectories for even more
details. Type `q` when you\'re ready to exit the output viewer. More
info here: <https://lintut.com/ncdu-check-disk-usage/>

The command `df` can also be used to examine your space quota (in GB) and how much is used:

```
[alice@service]$ df -h /home/alice
```
{:.term}

**2. \"Disappearing\" Files**
-------------------------

Due to a bug in the file system program used on the cluster, certain
files can sometimes \"disappear\". The file is still there, but you
can\'t see it when you look for files using the `ls` command. People
frequently notice this error when:

-   Trying to delete a folder and getting an error message like:

    ``` 
    rm: cannot remove 'folder/': Directory not empty 
    ```
    {:.term}

-   A job looks like it completed successfully, but you can\'t see all
    the files that should be there.

If you know the name of the file that should be there, you can try to
read it by providing the full file name to a file reader like `less` or
`cat`. You can also remove the file directly if you know its name. If
you\'d like to make the file visible again, you can attempt to do so by
going through the following sequence of commands:

``` 
[alice@service]$ cp filename /home/username
[alice@service]$ rm filename
[alice@service]$ mv /home/username/filename .
```
{:.term}

If you are trying to remove files and **can\'t remember the file\'s
name**, create a directory called \"to\_delete\" in your home directory
and move the problematic directories there. Then send an email to
chtc@cs.wisc.edu and we can remove the contents of that folder.
