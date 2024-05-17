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

* **May 15**: Worker nodes start transitioning from the existing cluster to the new cluster partitions. 
* **May 17**: Log in to new cluster configuration (running CentOS Stream 9) is available.
* **May 20 - May 31**: Users can rebuild their code and test jobs on the new cluster partitions.  
* **June 1, 2024**: The old cluster partitions are closed. 

## What You Need to Do




**If you are having trouble getting your jobs to run successfully on the new operating system**, 
please contact the facilitation team at chtc@cs.wisc.edu or [come to office hours](/uw-research-computing/get-help.html)