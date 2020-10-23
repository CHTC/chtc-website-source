---
highlighter: none
layout: hpc_layout
title: HPC Cluster Overview
---

# Content
 
1. [High-Performance Computing at CHTC](#high-performance-computing-at-chtc)  
2. [New HPC Configuration](#new-hpc-configuration)
3. [HPC User Policies](#hpc-user-policies)  
4. [HPC Hardware and Configuration](#hpc-hardware-and-configuration)  
    - [Partitions](#partitions)   
4. [Data Storage and Management](#data-storage-and-management)   
    - [Tools for managing home and software space](#tools-for-managing-home-and-software-space)

# High-Performance Computing at CHTC

The CHTC high-performance computing (HPC) cluster provides dedicated support for large, 
singular computations that use specialized software (i.e. MPI) to achieve internal 
parallelization of work across multiple servers of dozens to hundreds of cores. 

***Is high-performance computing right for me?*** Only computational work that 
fits that above description is permitted on the HPC. All other computational 
work, including single and multi-core (but single node) processes, that each complete 
in less than 72 hours on a single node will be 
best supported by our larger high-throughput computing (HTC) system (which also
includes specialized hardware for extreme memory, GPUs, and other cases). For more 
information about high-throughput computing, please see [Our Approach](/approach).

To get access to the HPC, please complete our
[Large-Scale Computing Request Form](/form). After your account request is received, 
our Research Computing Facilitators will follow up with you and schedule a meeting 
to discuss the computational needs of your research and connect you with computing 
resources (including non-CHTC services) that best fit your needs.

## New HPC Configuration

Roll out of the new HPC configuration is currently scheduled for late Sept./early Oct. 
More information about our HPC upgrade and user migration timeline was sent out to 
users by email. All CHTC user email correspondences are available at [User News](/user-news).

The new HPC configuration will include the following changes:
- upgrade of operating system from Scientific Linux release 6.6 to CentOS 7
- upgrade of SLURM from version 2.5.1 to version 20.02.2
- upgrades to filesystems and user data and software management
- a new set of modules and software
- new head node hostnames

The above changes will result in a new HPC computing environment 
and will provide users with new SLURM features and improved support and reliability 
for their HPC work. 

# HPC User Policies

Below is a list of policies that apply to all HPC users. 

**1. Do Not Run Programs On The Login Nodes**   
When you connect to the HPC, you are connected to a login node. The HPC login nodes have 
limited computing resources that are occupied with running Slurm and managing job submission. 

Users should only run basic commands (like `tar`, `cp`, `mkdir`) on the login nodes. The 
execution of scripts, including cron, software, and software compilation on the login nodes
is prohibited (and could VERY likely crash the head node). However, users may run small scripts 
and commands (to compress data, create directories, etc.) that run within a few minutes but 
their use should be minimized when possible. If you are unsure if your scripts are suitable 
for running on the login nodes, please contact us at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu).

**CHTC staff reserve the right to kill any long-running or problematic processes on the 
head nodes and/or disable user accounts that violate this policy**

Violation of these policies may result in suspension of your account.

**2. The HPC Is Reserved For MPI-enabled, Multi-node Jobs**   
HPC users should not submit single-core or single-node jobs to the HPC. Users will 
be asked to transition this kind of work to our high-throughput computing system.

**3. HPC File System Is Not Backed-up**    
All files on the HPC should be treated as temporary and only files necessary for 
actively running jobs should be kept on the file system. Once your jobs complete, 
your files should be removed from the HPC. Campus researchers have several options 
for data storage solutions, including [ResearchDrive](https://it.wisc.edu/services/researchdrive/) 
which provides up to 5TB of storage for free. Our guide 
[Transferring Files Between CHTC and ResearchDrive](transfer-data-researchdrive.shtml) provides 
step-by-step instructions for transferring your data to and from the HPC and RsearchDrive.

CHTC Staff reserve the right to remove any significant amounts of data on the HPC Cluster 
in our efforts to maintain filesystem performance for all users, though we will always 
first ask users to remove excess data and minimize file counts before taking additional action.

**4. Fair-share Policy**  
To promote fair access to HPC computing resources, all users are limited to 10 concurrently 
running jobs at a time. Additionally, user are restricted to a total of 600 cores 
across all running jobs. Core limits do not apply on research group partitions of
more than 600 cores.

**5. Job Priority Policy**   

A. User priority decreases as the user accumulates hours of CPU time over the last 21 days, across 
all queues. This "fair-share" policy means that users who have run many/larger jobs in the near-past 
will have a lower priority, and users with little recent activity will see their waiting jobs start sooner. We do 
NOT have a strict "first-in-first-out" queue policy.

B. Job priority increases with job wait time. After the history-based user priority calculation in (A), 
the next most important factor for each job's priority is the amount of time that each job has already 
waited in the queue. For all the jobs of a single user, these jobs will most closely follow a "first-in-first-out" policy.

C. Job priority increases with job size, in cores. This least important factor slightly favors larger jobs, as a means of 
somewhat countering the inherently longer wait time necessary for allocating more cores to a single job.

# HPC Hardware and Configuration

The HPC Cluster consists of two login nodes and many compute (aka execute) 
nodes. All users log in at a login node, and all user files
on the shared file sytem are accessible on all nodes.
Additionally, all nodes are tightly networked (56 Gbit/s Infiniband) so
they can work together as a single \"supercomputer\", depending on the
number of CPUs you specify. All execute and head nodes are running the Linux 
operating system CentOS version 7.

Only execute nodes will be used for performing your computational work. 
The execute nodes are organized into several \"partitions\", including 
the `univ`, `univ2`, `pre`, and `int` partitions which are available to 
all HPC users as well as research group specific partitions that consist 
of researcher owned hardware and which all HPC users can access on a 
backfill capacity via the `pre` partition (more details below).

## Partitions

  {:.gtable}
  | Partition | p-name | \# nodes (N) | t-max | t-default | max nodes/job | cores/node (n) | RAM/node (GB) |
  | --- |
  | University 2 | univ2 | 148 | 7 days | 1 day | 16 | 20 | 128
  | Interactive | int | 6 | 1 hr | 1hr | 1 | 20 | 128
  | Pre-emptable (backfill) | pre | 316 | 24 hrs | 4 hrs | 16 | 16 or 20 | 64 or 128
  | Owners | *unique* | 124 | *unique* | *unique* | *unique* | 20 | 128

- `univ2` consists of our second generation compute nodes, each with 20 
CPU cores of 2.5 GHz and 128 GB of RAM. Like `univ`, jobs submitted to this partition 
will not be pre-empted and can run for up to 7 days.

- `int` consists of two compute nodes is intended for short and immediate interactive 
testing on a single node (up to 16 CPUs, 64 GB RAM). Jobs submitted to this partition 
can run for up to 1 hour.

- `pre` (i.e. pre-emptable) is an under-layed partition encompassing all HPC compute 
nodes. This partiton is intended for more immediate turn-around of shorter and somewhat 
smaller jobs, or for interactive sessions requiring more than the 30-minute limit of 
the `int` partition. Jobs submitted to `pre` are pre-emptable and can run for up to 24 
hours. `pre` partition jobs will run on any idle nodes, including researcher owned 
compute nodes nodes, as back-fill meaning these jobs may be pre-empted by higher priority 
jobs. However, pre-empted jobs will be re-queued when submitted with an sbatch script.

# Data Storage and Management

**Data space in the HPC file system is not backed-up and should be
treated as temporary by users**. Only files necessary for
*actively-running* jobs should be kept on the file system, and files
should be removed from the cluster when jobs complete. A copy of any
essential files should be kept in an alternate, non-CHTC storage
location.

Each user will receive two primary data storage locations: 

1. `/home/username` with an initial disk quota of 100GB 
and 10,000 items. With the exception of software, all of the files 
needed for your work, such as input, output, configuration files, etc. 
should be located in your `/home` directory.

2. `/software/username` with an initial disk quota of 10GB and 
100,000 items. All software, library, etc. installtions should 
be written to and located in your `/software` directory.

To check how many files and directories you have in
your `/home` or `/software` directory see the 
[instructions below](#tools-for-managing-home-and-software-space).

Increased quotas to either of these locations are available upon email 
request to [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu). In your request, 
please include both size (in GB) and file/directory counts. If you don\'t 
know how many files your installation creates, because it\'s more than 
the current items quota, simply indicate that in your request.

**CHTC Staff reserve the right to remove any significant amounts of data
on the HPC Cluster** in our efforts to maintain filesystem performance
for all users, though we will always first ask users to remove excess
data and minimize file counts before taking additional action.


**Local scratch space** of 500 GB is available on each execute node in
`/scratch/local/$USER` and is automatically cleaned out upon completion
of scheduled job sessions (interactive or non-interactive). Local
scratch is available on the login nodes, `hpclogin1` and `hpclogin2`, also at 
`/scratch/local/$USER` and should be cleaned out by the user upon completion of
compiling activities. CHTC staff will otherwise clean this location of
the oldest files when it reaches 80% capacity.

## Tools for managing home and software space

To see how many files and directories are contained in your
`home` or `software` directories, including the total amount of 
used disk space, we recommend using the Linux tool `ncdu`.

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
