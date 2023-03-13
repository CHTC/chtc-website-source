---
highlighter: none
layout: hpc_layout
title: Submitting and Managing Jobs Using SLURM
guide: 
    order: 0
    category: Job Submission
    tag:
        - hpc
---

The HPC Cluster uses SLURM to manage jobs on the HPC Cluster. This page describes 
how to submit and manage jobs using SLURM. 

Contents
========

1. [Submitting Jobs Using SLURM](#1-submitting-jobs-using-slurm)
1. [Viewing Jobs in the Queue](#2-viewing-jobs-in-the-queue)
1. [Viewing Additional Job Information](#3-viewing-additional-job-information)
1. [Removing or Holding Jobs](#4-removing-or-holding-jobs)

The following assumes that you have been granted access to the HPC cluster 
and can log into the head node `hpclogin3.chtc.wisc.edu`. If this is not
the case, please see the [CHTC account application page](form.html) or email
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
described [here](hpc-overview.html).

After the `#SBATCH` options, the submit file should contain the commands
needed to run your job, including loading any needed software modules. 

An example submit file is given below. It requests 1 nodes of 64 cores 
and 4GB of memory each (so 64 cores and 256 GB of memory total), on the 
`shared` partition. It also specifies a run time limit of 4.5 hours. 

``` {.sub}
#!/bin/sh
#This file is called submit-script.sh
#SBATCH --partition=shared       # default "shared", if not specified
#SBATCH --time=0-04:30:00       # run time in days-hh:mm:ss
#SBATCH --nodes=1               # require 1 nodes
#SBATCH --ntasks-per-node=64    # cpus per node (by default, "ntasks"="cpus")
#SBATCH --mem=4000             # RAM per node in megabytes
#SBATCH --error=job.%J.err
#SBATCH --output=job.%J.out
# Make sure to change the above two lines to reflect your appropriate
# file locations for standard error and output

# Now list your executable command (or a string of them).
# Example for code compiled with a software module:
module load mpimodule
srun --mpi=pmix -n 64 /home/username/mpiprogram
```

Once the submit file is created, it can be submitted using the `sbatch` command: 

``` 
[alice@login]$ sbatch submit-script.sh
```
{:.term}

**B. Optimizing Your Submit File**
-------------------

The new cluster has different partition names and different sized nodes. We  recommend the following changes because most of our nodes now have 128 cores, so requesting multiple nodes is not advantageous if your jobs are smaller than 128 cores. We also now recommend requesting memory per core instead of memory per node, for similar reasons. Here are our recommendations for different sized jobs:

<table>
	<tr>
		<th>Job size</th>
		<th>Recommended <code>#SBATCH</code> flags</th>
	</tr>
	<tr>
		<td>32-128 cores</td>
		<td>Example for 32 cores: <pre>
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=32 # recommend multiples of 16
#SBATCH --mem-per-cpu=4000</pre></td>
	</tr>
	<tr>
		<td>96 - 256 cores</td>
		<td>Split over a few nodes, for example for 160 cores: <pre>
#SBATCH --nodes=2
#SBATCH --ntasks-per-node=80 # designate cores per node
#SBATCH --mem-per-cpu=4000</pre> 
	OR:  <pre>
#SBATCH --nodes=2
#SBATCH --ntasks=160 # designate overall cores
#SBATCH --mem-per-cpu=4000</pre></td>
	</tr>
	<tr>
		<td>128 or 256 cores (whole nodes)</td>
		<td>Example for 256 cores: <pre>
#SBATCH --nodes=2
#SBATCH --ntasks-per-node=128
#SBATCH --mem-per-cpu=4000</pre></td>
	</tr>
</table>

**C. Requesting an Interactive Job (\"int\" and \"pre\" partitions)**
-----------------

If you want to run your job commands yourself, as a test before submitting 
a job as described above, you can request an interactive job on the cluster. 

There is a dedicated partition 
for interactive work called `int`; you may request up to a full node (128 CPUs, 
512 GB RAM) when requesting an interactive session in the \"int\" partition and 
the session is limited to 60 minutes. Using another partition (like `pre`) will 
mean your interactive job is subject to the limits of that partition. 

### For simple testing or compiling

The command to request an interactive job is `srun --mpi=pmix`, and includes the partition
in which you'd like to run the interactive job. 

``` 
[alice@login]$ srun --mpi=pmix -n4 -N1 -p int --pty bash
```
{:.term}

> Note: You will not be able to run MPI code in this interactive session.

The above example indicates a request for 4 CPUs (`-n4`) on a single
node (`-N1`) in the \"int\" partition (`-p int`). Adding \"`-t 15`\" would
indicate a request for 15 minutes, if desired, rather than the 60-minute
default. After the interactive shell is created to a compute node with
the above command, you\'ll have access to files on the shared file
system and be able to execute code interactively as if you had directly
logged in to that node. **It is important to exit the interactive shell
when you\'re done working by typing `exit`**.

### For running MPI code

To run an MPI program in an interactive session, you will need to (1) allocate the 
resources using `salloc`, then (2) use `srun` to run the MPI code, and finally (3)
give up the allocated resources.  

1. **Request resources**

   ```
   [alice@login]$ salloc -n4 -N1 -p int
   ```
   {:.term}
   
   This command requests 4 CPUs (`-n4`) on a single node (`-N1`) in the \"int\"
   partition (`-p int`), and assigns the resources to a new terminal session
   on the login node.  When the allocation has started, you will see a message
   like this:
   ```
   salloc: Granted job allocation 18701
               Guest on spark-a005.chtc.wisc.edu
   ```
   {:.term}
   
   ***To run code in this allocation, be sure to use `srun` as described in the next step!***
   
2. **Use resources**

   At this point, your terminal is still running on the login node.  To run
   commands using the resources in the allocation, you will need to use `srun`.
   ```
   [alice@login]$ srun --mpi=pmix /path/to/mpi/script
   ```
   {:.term}
   
   This will execute the specified script using the allocated resources.
   When the `srun` calculation has finished, you will remain in the allocation
   session, allowing you to run `srun` multiple times in quick succession.  
   
   You can also use the allocated resources interactively with
   ```
   [alice@login]$ srun --mpi=pmix --pty bash
   ```
   {:.term}
   
   which will start an interactive terminal session in your allocation (this 
   is evident by the change in the command prompt from `[alice@login]` to 
   `[alice@spark-a###]`).  Keep in mind that you will not be able to use
   MPI inside the interactive session.  You can exit the interactive session
   and return to the allocation by entering `exit`.  
   
3. **Give up resources**
   
   To end your allocation, simply enter `exit`.  You will see a message like
   this:
   ```
   exit
   salloc: Relinquishing job allocation 18701
   salloc: Job allocation 18701 has been revoked.
   ```
   {:.term}
   
> It can be difficult to remember whether or not you are currently using an
> allocation.  A quick way of checking is to see if the `SLURM_JOB_ID` is set
> by entering `echo $SLURM_JOB_ID`.  If you are in an allocation, this command
> will return the job ID number that corresponds to an entry in your SLURM queue
> (see below).  
> 
> A more convenient option is to update your `.bashrc` file so that the command
> prompt changes when you are in an allocation.  This can be done using the
> following commands:
> ```
> echo 'PS1="$SLURM_JOB_ID[\u@\h \W]\$ " ' >> ~/.bashrc
> echo 'export PS1' >> ~/.bashrc
> ```
> {:.term}
>   
> Now when you run `salloc`, your command prompt will start with the corresponding
> SLURM job ID number.  This will also be the case for the interactive `srun` 
> command.  For example, 
> ```
> [alice@login]$ salloc -n4 -N1 -p int
> salloc: Granted job allocation 18701
>             Guest on spark-a005.chtc.wisc.edu
>	       
> 18701[alice@login]$ echo 'I am running an allocation.'
> I am running an allocation.
> 18701[alice@login]$ srun --mpi=pmix --pty bash
> 
> 18701[alice@spark-a006] echo 'I am using the resources interactively.'
> I am using the resources interactively.
> 18701[alice@spark-a006] exit
> exit
> 18701[alice@login]$ exit
> exit
> salloc: Relinquishing job allocation 18701
> [alice@login]$
> ```
> {:.term}
> 
> * This can be undone by removing the two added lines from the `.bashrc` file 
>    in your home directory.  
>
> > More advanced users can manipulate their bash prompt further.  
> > The `SLURM_JOB_ID` variable is created for the allocation, and 
> > a `SLURM_JOB_UID` variable is created for the interactive `srun`.


**2. Viewing Jobs in the Queue**
==================

To view your jobs in the SLURM queue, use the following command: 

``` 
[alice@login]$ squeue -u username
```
{:.term}

Issuing `squeue` alone will show all user jobs in the queue. You can
view all jobs for a particular partition with `squeue -p shared`.

**3. Viewing Additional Job Information**
==================

Accounting information for jobs that are invoked with SLURM are logged. The `sacct` command displays job accouting data in a variety of forms for your analysis. 

**If you are having trouble viewing output from `sacct` try running this command first**

```
[alice@login]$ sacct --start=2018-01-01
```
{:.term}


## How To Select Jobs

- To display information about a specific job or list of jobs use `-j` or `--jobs` followed by a job number or comma separated list of job numbers.
	
	```
	[alice@login]$ sacct --jobs job1,job2,job3
	```
	{:.term}
<!-- Sample output -->

- To select information about jobs in a certain date range use `--start` and `--end` Without it, `sacct` will only return jobs from the current day.
	
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

If you want to leave a job in the queue, but prevent it from running immediately, 
you can "hold" a submitted job by using: 

``` 
[alice@login]$ scontrol hold job#
```
{:.term}

To release jobs that are held so that they can run, use this command: 

``` 
[alice@login]$ scontrol release job#
```
{:.term}
