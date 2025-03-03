---
highlighter: none
layout: hpc_layout
title: HPC System Overview
guide:
    category: Get started
    tag:
        - hpc
---

{% capture content %}
1. [High-Performance Computing at CHTC](#high-performance-computing-at-chtc)  
2. [HPC User Policies](#hpc-cluster-user-policies)  
3. [HPC Hardware and Configuration](#hpc-hardware-and-configuration)  
    - [Execute Nodes and Partitions](#execute-nodes-and-partitions)   
    - [Operating System and Software](#operating-system-and-software)
4. [Data Storage and Management](#data-storage-and-management)   
    - [Tools for managing home and software space](#tools-for-managing-home-and-software-space)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}
      
# High-Performance Computing at CHTC

The CHTC high-performance computing (HPC) cluster provides dedicated support for large, 
singular computations that use specialized software (i.e. MPI) to achieve internal 
parallelization of work across multiple servers of dozens to hundreds of cores. 

***Is high-performance computing right for me?*** Only computational work that 
fits that above description is appropriate for the HPC Cluster. Computational 
work that can complete on a single node in less than a few days will be 
best supported by our larger high-throughput computing (HTC) system (which also
includes specialized hardware for extreme memory, GPUs, and other cases). For more 
information, please see [Our Approach](/approach.html).

To get access to the HPC Cluster, please complete our
[New User Consultation Form](form.html). After your request is received, 
a Research Computing Facilitator will follow up to discuss the computational needs 
of your research and connect you with computing 
resources (including non-CHTC services) that best fit your needs.

# HPC Cluster User Policies

See our [User Policies and Expectations](user-expectations.html) for details on general CHTC and HPC cluster policies. 

# HPC Hardware and Configuration

The HPC Cluster consists of two login nodes and many compute (aka execute) 
nodes. All users log in at a login node, and all user files on the shared file sytem are accessible on all nodes.
Additionally, all nodes are tightly networked (200 Gbit/s Infiniband) so
they can work together as a single \"supercomputer\", depending on the
number of CPUs you specify. 

## Operating System and Software

All nodes in the HPC Cluster are running CentOS 8 Stream Linux. 

The SLURM scheduler version is 22.05.6. 

To see more details of other software on the cluster, see the [HPC Software page](hpc-software.html). 

## Login Nodes

The login node for the cluster is: `spark-login.chtc.wisc.edu` 

For more details on logging in, see the "Connecting to CHTC" guide linked above. 

## Execute Nodes and Partitions

Only execute nodes will be used for performing your computational work. 
The execute nodes are organized into several \"partitions\", including 
the `shared`, `pre`, and `int` partitions which are available to 
all HPC users as well as research group specific partitions that consist 
of researcher-owned hardware and which all HPC users can access on a 
backfill capacity via the `pre` partition (more details below).

  {:.gtable}
  | Partition | p-name | \# nodes (N) | t-default | t-max | max cores/job | cores/node (n) | RAM/node (GB) |
  | --- |
  | Shared | shared | 45 | 1 day | 7 day | 320 | 64 or 128 | 512
  | Interactive | int | 2 | 1 hr | 4 hrs | 16 | 64 or 128 | 512 (max 64 per job)
  | Pre-emptable (backfill) | pre | 45 | 4 hrs | 24 hrs | 320 | 64 or 128 | 512
  | Owners | *unique* | 19 | 24 hrs | 7 days | *unique* | 64 or 128 | 512


- `shared` compute nodes each have 64 or 128 cores and 512 GB of RAM.  
Jobs submitted to this partition 
can request and use up to 7 days of running time.

- `int` consists of two compute nodes is intended for short and immediate interactive 
testing on a single node (up to 16 CPUs, 64 GB RAM). Jobs submitted to this partition 
can run for up to 4 hours.

- `pre` (i.e. pre-emptable) is an under-layed partition encompassing all HPC Cluster 
nodes and is intended for more immediate turn-around of shorter, smaller, and/or 
interactive sessions requiring more than the 4 hour time limit of the `int` partition. 
Jobs submitted to `pre` are run as back-fill on any idle nodes, including researcher-owned 
compute nodes, meaning these jobs may be pre-empted by higher priority 
jobs. By default, pre-empted jobs will be re-queued (to run again) if they were submitted with 
an sbatch script.

### Fair Share Allocation

To promote fair access to HPC computing resources, all users are limited to 10 concurrently 
running jobs (if you need to queue more, please get in touch). Additionally, users are restricted to a total of 720 cores 
across all running jobs (core limits do not apply on research group partitions of
more than 720 cores).

When determining which order to run jobs, the following policies are applies, in order or significance
to job priority determinations:

A. User priority decreases as the user accumulates hours of CPU time over the last 21 days, across 
all queues. This "fair-share" policy means that users who have run many/larger jobs in the near-past 
will have a lower priority, and users with little recent activity will see their waiting jobs start sooner. 
(The cluster does not have a strict "first-in-first-out" queue policy.)

B. Job priority increases with job wait time. After the history-based user priority calculation in (A), 
the next most important factor for each job's priority is the amount of time that each job has already 
waited in the queue. For all the jobs of a single user, these jobs will most closely follow a "first-in-first-out" policy.

C. Job priority increases with job size, in cores. This least important factor slightly favors larger jobs, so that 
the scheduler can take advantage when large numbers of newly-available nodes happen to become available (requiring less 
wasted time to deliberately drain nodes for larger jobs). So, among a user's jobs submitted at roughly the same time, 
a larger job may run first, if the number of nodes necessary for the larger job is already available.


# Data Storage and Management

**Data space in the HPC Cluster filesystem is not backed-up and should be
treated as temporary by users**. Only files necessary for
*actively-running* jobs should be kept on the filesystem, and files
should be removed from the cluster when jobs complete. A primary copy of any
essential files (e.g. software, submit files, input) should be kept in an 
alternate, non-CHTC storage location.

Each user will receive two primary data storage locations: 

1. `/home/username` with an initial disk quota of 30GB 
and 250,000 items. Your home directory is meant to be used for files 
you use repeatedly, like submit file templates, source code, software 
installations, and reference data files. 

2. `/scratch/username` with an initial disk quota of 100GB and 
250,000 items. Jobs should always be submitted and run out of 
`/scratch`. It is the space for all working data, including individual 
job inputs, job outputs, and job log/stderr/stdout files. 

> ### What about `/software`?
> 
> If you are installing software meant to be shared within a group, 
> we can create a dedicated folder for you in the `/software` space
> email us (chtc@cs.wisc.edu) if this is you!  

To check how many files and directories you have in
your `/home` or `/scratch` directory see the 
[instructions below](#tools-for-managing-home-and-software-space).

Changes to quotas for either of these locations are available upon request
per our [Request a Quota Change](quota-request) guide. If you don\'t 
know how many files your installation creates, because it\'s more than 
the current items quota, simply indicate that in your request.

**CHTC Staff reserve the right to remove any significant amounts of data
on the HPC Cluster** in our efforts to maintain filesystem performance
for all users.

**Local scratch space** is available on each execute node in `/local/$USER`.
This space is **NOT** automatically cleaned out, so if you use this space,
be sure to remove the files before the end of your job script or 
interactive session.

## Tools for managing home and software space

You can use the command `get_quotas` to see what disk 
and items quotas are currently set for a given directory path. 
This command will also let you see how much disk is in use and how many 
items are present in a directory:

```
[username@hpclogin1 ~]$ get_quotas /home/username /scratch/username
```
{:.term}

Alternatively, the `ncdu` command can also be used to see how many 
files and directories are contained in a given path:

``` 
[username@hpclogin1 ~]$ ncdu /home/username
[username@hpclogin1 ~]$ ncdu /scratch/username
```
{:.term}

When `ncdu` has finished running, the output will give you a total file
count and allow you to navigate between subdirectories for even more
details. Type `q` when you\'re ready to exit the output viewer. More
info here: <https://lintut.com/ncdu-check-disk-usage/>
