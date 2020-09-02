---
highlighter: none
layout: default
title: Transition to the Newly Configured HPC Cluster
---

The HPC Cluster is being upgraded to a new configuration during September - October 2020. 
If you have an account on our current HPC cluster (logging into `aci-service-1` or 
`aci-service-2`) this page, along with our [User News page](/user-news), has 
a summary of what you need to know and actions you need to take. 

## Changes in the New Configuration

The new HPC configuration will include the following changes:
- upgrade of operating system from Scientific Linux release 6.6 to CentOS 7
- upgrade of SLURM from version 2.5.1 to version 20.02.2
- upgrades to filesystems, specifically a division between `/home` (for data and job 
submission) and `/software` (for software installations). 
- a new set of modules and software
- new head node hostnames (`hpclogin1.chtc.wisc.edu`, `hpclogin2.chtc.wisc.edu`)

The above changes will result in a new HPC computing environment
and will provide users with new SLURM features and improved support and reliability
for their HPC work.

## Timeline 

-   **Sep 15-17**: 'univ' and half of 'univ2' partition nodes transitioned to new configuration
-   **Sep 17**: users granted access to new login nodes (hpclogin1/[2.chtc.wisc.edu](http://2.chtc.wisc.edu)); new documentation made prominent on [chtc.cs.wisc.edu](http://chtc.cs.wisc.edu)
-   **Sep 29-30**: all researcher-owned hardware transitioned
-   **Oct 6-7**: all remaining (univ2) hardware transitioned
-   **Oct 13**: accounts disabled on aci-service-1/2; accounts/data subsequently deleted; old documentation removed

## Actions to Take

**Now**

Review the updated guides for the new configuration here: [HPC Cluster user guides](/hpc-overview)

Start removing all old and unneeded files from the current HPC cluster. 

**After September 17**

1. Confirm that you can log into the new login nodes - `hpclogin1.chtc.wisc.edu` and
`hpclogin2.chtc.wisc.edu`. 

2. Install your software on the new cluster. Note that we have a special directory 
specifically for software installations on the new configuration -- software installs 
can be placed into your `/software/username` directory. For full details on this and 
the new modules, see the [software guide](/hpc-software). 

3. Test a job submission (or a few!) on the new cluster. 

4. Transfer ONLY needed files from the old cluster to the new, and continue to remove 
all old and unneeded data from the old cluster. 

# Contact us at chtc@cs.wisc.edu with any questions or concerns



