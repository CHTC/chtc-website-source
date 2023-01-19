---
highlighter: none
layout: markdown-page
title: Transitioning to a New HPC Cluster
published: true
---

The Center for High Throughput Computing’s High Performance Cluster is being 
replaced by a new High Performance System! All components of the system (execute 
nodes, network, shared file system) are new and we expect an improved experience for our HPC users.

ALL USERS OF THE EXISTING HPC SYSTEM WILL NEED TO MIGRATE TO THIS NEW CLUSTER. 
Importantly, access to the existing cluster will be phased out in early 2022. 
CHTC staff are here to assist with your transition.

## Highlights

* The existing HPC cluster is being replaced by a new cluster. After **February 2023** 
ALL users will lose access to the existing cluster, and all user files will be 
deleted. 
* Custom software will need to be reinstalled and jobs will need to be tested on 
the new cluster. 
* The `univ2` partition is being renamed, and partition policies have changed. 
* Users should avoid using `mpirun` and instead should use `srun` to execute their 
MPI code.  
* File system conventions have changed - jobs will now use `/scratch/$USER` to run, 
and `/home/$USER` will be mainly used for software installations and reference 
files. 

## Important Dates

* **Mid January 2023:** New cluster available for general use
* **February 28, 2023:** Jobs will no longer run on the old cluster
* **March 15, 2023:** Access to `hpclogin1.chtc.wisc.edu` login node and old file 
system removed, **Data for all users will be deleted on the old HPC system.**

## What You Need to Do

### Move Data

Back up files from the old cluster to another system (e.g. your laptop), copy 
files you are actively working with to the new cluster, and delete all data off 
the old HPC system. **All files in `/home` and `/software` will be deleted off the 
existing system starting March 15, 2023.**

### Log In and Quota Check

Confirm you can access the new cluster by logging into the new login node. 

### Prepare and Submit Test Jobs

After logging in, prepare and submit a few test jobs to confirm that your work 
will run, paying attention to these important changes: 

1. **Appropriate usage of `/home` and `/scratch`:** 
    - Jobs should be run out of `/scratch/$USER`. Your scratch directory has a quota of  100GB disk space and 250,000 items
    - Only use your `/home` directory for software installations and general job files and templates.
      Your `/home` directory has a quota of 20GB disk space and 250,000 items.
    - The `/software` directory is being phased out. 

1. **Build software with new modules:** users will need to reinstall and/or rebuild 
their software on the new HPC cluster. Users may encounter different versions of 
common tools on the new cluster, so it is important to try installing your 
software early to ensure compatibility. If a software or library is not available 
that is necessary for your installation is not installed, contact CHTC staff (see 
our [get help page](/uw-research-computing/get-help.html)).

1. **Change MPI execution:** Our systems administrators now recommend using `srun` 
with the `--mpi=pmix` flag instead of `mpirun` or `mpiexec` to execute MPI type code. It
should look like this:
		srun --mpi=pmix mpi_program

1. **Change #SBATCH options:** The new cluster has different partition names *and* 
different sized nodes. The main general use partition is now called `shared` 
instead of `univ2` or `univ3`. We also recommend the following changes because 
most of our nodes now have 128 cores, so requesting multiple nodes is not 
advantageous if your jobs are smaller than 128 cores. We also now recommend requesting 
memory per core instead of memory per node, for similar reasons. Here are our recommendations 
for different sized jobs: 

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


### Optimizing Jobs (Optional)

The new cluster nodes have very fast local disk space on each node. If your code 
is able to use local space for certain parts of its calculations or is able to 
sync data between local spaces, it may be advantageous to use this disk to speed 
up your jobs. It is located at the following path on each node: 

```
/local/$USER
```

## New Cluster Specifications

**Execute Nodes** 

We have 40 general use execute nodes, representing 5,120 cores of capacity. 
Server specs (Dell Poweredge R6525): 
* 128 cores using the AMD Epyc 7763 processor
* 512GB of memory
* 1.5TB of local (not shared) fast NVME disk

Operating System: CentOS Stream 8

Scheduler: SLURM 22.05.6




