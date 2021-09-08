---
highlighter: none
layout: markdown-page
title: Transition to the Newly Configured HPC Cluster
---

The HPC Cluster is being upgraded to a new configuration during October-November 2020. 
If you have an account on our current HPC cluster (logging into `aci-service-1` or 
`aci-service-2`) this page, along with our [User News page](user-news), has 
a summary of what you need to know and actions you need to take. 

## Changes in the New Configuration

The new HPC configuration will include the following changes:
- new head nodes (`hpclogin1.chtc.wisc.edu`, `hpclogin2.chtc.wisc.edu`)
- all-new filesystems, and with a division between `/home` (for data and job 
submission) and `/software` (for software installations).
- a new queue with SLURM version 20.02.2
- upgrade of operating system on all nodes from Scientific Linux 6 to CentOS 7
- all-new software modules, compiled for CentOS 7

The above changes will result in an entirely new HPC computing environment (but with the same execute nodes)
and will provide users with new SLURM features (if desired) and improved data reliability
for their HPC work.

## Timeline 

-   **Oct 13-14**: 'univ' and half of 'univ2' partition nodes transitioned to new configuration
-   **Oct 15**: users granted access to new login nodes (hpclogin1/[2.chtc.wisc.edu](http://2.chtc.wisc.edu)); new documentation made prominent on [chtc.cs.wisc.edu](http://chtc.cs.wisc.edu)
-   **Oct 27-28**: all researcher-owned hardware transitioned
-   **Nov 10-11**: all remaining (univ2) hardware transitioned
-   **Nov 24**: accounts disabled on aci-service-1/2; accounts/data subsequently deleted; old documentation removed

## Actions to Take

**Now**

Review the updated use guides for the new cluster configuration here: [HPC Cluster user guides](hpc-overview)

Start removing all old and unneeded files from the current HPC cluster. 

**After October 15**

1. Confirm that you can log into the new login nodes - `hpclogin1.chtc.wisc.edu` and
`hpclogin2.chtc.wisc.edu`. 

2. Install your software on the new cluster. Note that we have a special directory 
specifically for software installations on the new configuration -- software installs 
can be placed into your `/software/username` directory. For full details on this and 
the new modules, see the [software guide](hpc-software). 

3. Test a job submission (or a few!) on the new cluster. 

4. Transfer ONLY needed files from the old cluster to the new, and continue to remove 
all old and unneeded data from the old cluster. 

# Contact us at chtc@cs.wisc.edu with any questions or concerns.



