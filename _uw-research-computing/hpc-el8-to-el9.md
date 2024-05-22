---
highlighter: none
layout: guide
title: HPC System Transition to a New Linux Version (CentOS Stream 9) and Cluster Configuration
published: false
guide: 
    button_class: bg-warning
    order: 0
    category: Basics and Policies
        tag:
        - hpc
---

Starting in May 2024, CHTC's high performance computing (HPC) cluster began upgrading
the Linux distribution and version we use on our servers to **CentOS Stream 9**. This transition is expected to complete in June 2024. 

Note that this page only applies to a transition on the HPC cluster. For information 
on the HTC system transition, see [HPC System Transition to a New Linux Version (CentOS Stream 9)](htc-el8-to-el9.html)

All updates to the HPC Cluster will be reflected on this page; significant changes may 
also include a notification to the `chtc-users` mailing list. 

## Important Dates

* **May 15**: Worker nodes start transitioning from the existing cluster to upgraded cluster partitions. 
* **May 22**: Log in to upgraded cluster login node is available.
* **May 22 - May 31**: Users should rebuild their code and test jobs on 
* **June 1, 2024**: The old cluster partitions are closed. 

## What is Changing

As part of this transition, there will be a new login node for 
the HPC cluster: `spark-login.chtc.wisc.edu`. 

If you log into `spark-login`, you will have access to a new 
module stack, compiled on CentOS Stream 9, and the partitions available will 
have worker nodes that are running CentOS Stream 9. 

The files in your `/home` and `/scratch` directories will be unchanged. 

## What You Need to Do

**As soon as possible**, do the following: 

1. Log into the new login node `spark-login.chtc.wisc.edu`. 

1. Run a typical job as a test. It is highly likely that certain codes will 
fail on the new worker nodes, as the underlying dependencies of your code, including 
the operating system, and any modules used, have changed. 

1. If your jobs no longer run, archive your previous software installation(s) and 
rebuild your software. Some tips: 
	* We strongly recommend comping in an interactive job, to confirm your 
	compiled code will be compatible with all worker nodes in the cluster. 
	* If you are using a custom spack installation, we recommend archiving your 
	existing `~/.spack` directory and recreating your spack environment from 
	scratch as described in [Set Up Spack on HPC](hpc-spack-setup.html)

1. If you recompiled your code, run a few small test jobs to confirm that the 
code is working correctly. 

**If you are having trouble getting your jobs to run successfully on the new operating system**, 
please contact the facilitation team at chtc@cs.wisc.edu or [come to office hours](/uw-research-computing/get-help.html)