---
highlighter: none
layout: default
title: Using Software on the HPC Cluster
---

The HPC Cluster uses SLURM to manage jobs on the HPC Cluster. This page describes 
how to submit and manage jobs using SLURM. 

Contents
========

1. [Submitting Jobs Using SLURM](1-submitting-jobs-using-slurm)
1. [Viewing Jobs in the Queue](2-viewing-jobs-in-the-queue)
1. [Viewing Additional Job Information](3-viewing-additional-job-information)
1. [Removing or Holding Jobs](4-removing-or-holding-jobs)

The following assumes that you have been granted access to the HPC cluster 
and can log into the head node `aci-login-1.chtc.wisc.edu`. If this is not
the case, please see the [CHTC account application page](/form) or email
the facilitation team at chtc@cs.wisc.edu. 

**1. Submitting Jobs Using SLURM**
==================

**A. Submitting a Job**
-----------------

Jobs can be submitted to the cluster using a submit file, sometimes also 
called a "batch" file. The top half of the file consists of `#SBATCH` 
options which communicate needs or parameters of the job -- these lines 
are **not** comments, but essential options for the job. The values for 
`#SBATCH` options should reflect the size of nodes and run time limits 
described [here]()

After the `#SBATCH` options, the submit file should contain the commands
needed to run your job, including loading any needed software modules. 

An example submit file is given below. It requests 2 nodes of 16 cores 
and 64GB of memory each (so 32 cores and 128 GB of memory total), on the 
`univ` partition. It also specifies a run time limit of 4.5 hours. 

``` {.sub}
#!/bin/sh
#This file is called submit-script.sh
#SBATCH --partition=univ        # default "univ", if not specified
#SBATCH --time=0-04:30:00       # run time in days-hh:mm:ss
#SBATCH --nodes=2           # require 2 nodes
#SBATCH --ntasks-per-node=16            # cpus per node (by default, "ntasks"="cpus")
#SBATCH --mem=64000      # RAM per node
#SBATCH --error=job.%J.err
#SBATCH --output=job.%J.out
#Make sure to change the above two lines to reflect your appropriate
# file locations for standard error and output

#Now list your executable command (or a string of them).
# Example for non-SLURM-compiled code:
module load mpi/gcc/openmpi-1.6.4
mpirun -n 32 /software/username/mpiprogram
```

Once 

``` 
[alice@login]$ sbatch submit-script.sh
```
{:.term}

Other lines that you may wish to add to your script for specifying a
number of total tasks (equivalent to \"cores\" by default), desired CPU
cores per task (for multiple CPU cores per MPI task), or RAM per
cpu are:

``` {.sub}
#SBATCH --mem-per-cpu=4000         # RAM per cpu, in MB
#SBATCH --ntasks=32        # total number of "tasks" (cores) requested
#SBATCH --cpus-per-task=1  # default "1" if not specified
```

In any case, it is important to make sure that your request fits within
the hardware configuration of your chosen partition.\


**B. Requesting an Interactive Job (\"int\" and \"pre\" partitions)**
-----------------

You may request up to a full node (16 CPUs, 64 GB RAM) when requesting
an interactive session in the \"int\" partition. Interactive sessions on
the \"int\" partition are allowed for 30 minutes, but you may request
less time. Sessions in the \"pre\" partition are
limited according to the \"Partition\" table above, but are potentially
subject to interruption.

``` 
[alice@login]$ srun -n16 -N1 -p int --pty bash
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


**2. Viewing Jobs in the Queue**
==================

To view *your* jobs in the SLURM queue, enter the following:

``` 
[alice@login]$ squeue -u username
```
{:.term}

Issuing `squeue` alone will show all user jobs in the queue. You can
view all jobs for a particular partition with `squeue -p univ`.

**3. Viewing Additional Job Information**
==================

Accounting information for jobs that are invoked with SLURM are logged. The `sacct`	 command displays job accouting data in a variety of forms for your analysis. 

**If you are having trouble viewing output from `sacct` try running this command first**

```
[alice@login]$ sacct --start=2018-01-01
```
{:.term}


## How To Select Jobs

- To display information about a specific job or list of jobs use `-j` or `--jobs` followed by a job number or comma separated list of job numbers.
	
	```
	[alice@login]$ sacct -jobs job1,job2,job3
	```
	{:.term}
<!-- Sample output -->

- To select information about jobs in a certian date range use `--start` and `--end` Without it, `sacct` will only return jobs from the current day.
	
	```
	[alice@login]$ sacct --start=YYYY-MM-DD
	```
	{:.term}

- To select information about jobs in a certian time range use `--starttime` and `--endtime` The default start time is 00:00:00 of the current day, unless used with `-j`, then the default start time is Unix Epoch 0. The default end time is time of running the command. Valid time formats are
	```
	HH:MM[:SS] [AM|PM]
	MMDD[YY] or MM/DD[/YY] or MM.DD[.YY]
	MM/DD[/YY]-HH:MM[:SS]
	YYYY-MM-DD[THH:MM[:SS]] 
	```

	```
	[alice@login]$ sacct --starttime 08/23 --endtime 08/24
	```
	{:.term}

- To display another user's jobs use `--user`
	
	```
	[alice@login]$ sacct --user BuckyBadger
	```
	{:.term}
	<!-- Sample output -->

- To only show statistics relevant to the job allocation itself, not taking steps into consideration use `-X`. This can be useful when trying to figure out which part of a job errored out.
	
	```
	[alice@login]$ sacct -X
	```
	{:.term}
	<!-- Sample Output -->

## Displaying Specific Fields

`sacct` can display different fields about your jobs. You can use the `--helpformat` flag to get a full list.

```	
[alice@login]$ sacct --helpformat
```
{:.term}

### Recommended Fields

When looking for information about your jobs CHTC recommends using these fields
```
elapsed
end
exitcode
jobid
ncpus
nnodes
nodelist
ntasks
partition
start
state
submit
user
```

For example run

```
sacct --start=2020-01-01 --format=jobid
```
{:.term}

to see jobIDs of all jobs ran since 1/1/2020.



**4. Removing or Holding Jobs**
==================

You can kill and/or remove your job from the
queue with the following:

``` 
[alice@login]$ scancel job#
```
{:.term}

where `job#` is the number shown for your job in the `squeue` output.

TBD: using hold/release features
