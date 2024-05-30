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
the Linux distribution and version we use on our servers to **CentOS Stream 9** (EL9). This transition is expected to complete in June 2024. 

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

2. Run a typical job as a test. It is highly likely that certain codes will 
   fail on the new worker nodes, as the underlying dependencies of your code, including 
   the operating system, and any modules used, have changed. 

3. If your jobs no longer run, archive your previous software installation(s) and 
   rebuild your software. The [Software Changes](#software-changes) section below has 
   more specific information. 

4. If you recompiled your code, run a few small test jobs to confirm that the 
   code is working correctly. 

**If you are having trouble getting your jobs to run successfully on the new operating system**, 
please contact the facilitation team at chtc@cs.wisc.edu or [come to office hours](/uw-research-computing/get-help.html)

## Software Changes

Almost all packages and libraries have been upgraded as part of the operating system transition. 
Unless your code is fairly simple, you will likely need to recompile it.

Remember to always compile your code/programs in a (interactive) Slurm job!

> Not only does this help avoid stressing the resources of the login server, but the upgraded login server uses a newer CPU architecture than the worker nodes in the cluster.
> Most compilers auto-detect the CPU architecture and adapt the compilation to use that architecture.
> Attempting to use such compiled code on a different/older CPU architecture can lead to "Illegal instruction" errors, among others.

### Modules

Most of the modules on the upgraded cluster have been kept, but with upgraded versions.
The following table is a comparison of the modules on the old operating system (EL8) versus the new operating system (EL9).
(Adapted from the output of `module avail` on the respective servers.)

You will likely need to recompile your code to use the new module versions.
Remember to also update any `module load` commands that specify a particular version of the module,
otherwise you may encounter "module(s) are unknown" errors.

#### Module comparison

| Module name | Old version (EL8) | New version (EL9) |
| :--- | :--- | :--- |
| abaqus | 2018-hotfix-1904 | *TBD* |
| ansys | 2022r24 | 2024r1 |
| aocc | 3.2.0 | 4.2.0 |
| cmake | 3.27.7 | 3.27.9 |
| comsol | 6.0, 6.1, 6.2 | 6.2 |
| gcc | 11.3.0 | 13.2.0 |
| hdf5 (intel-oneapi-mpi) | 1.12.2 | *dropped* |
| hdf5 (openmpi) | 1.12.2 | 1.14.3 |
| intel-oneapi-compilers | 2023.2.1 | 2024.1.0 |
| intel-oneapi-mkl | 2023.2.0 | 2024.0.0 |
| intel-oneapi-mpi | 2021.10.0 | 2021.12.1 |
| intel-tbb | 2021.9.0 | *deprecated* |
| lmstat.comsol | 6.0 | *TBD* |
| lumerical-fdtd | 2022-r2.4 | 2024-R1.2 |
| matlab | R2021b, R2022b | R2024a |
| mvapich2 | 2.3.7-1 | *deprecated* |
| mvapich | *n/a* | 3.0 |
| netcdf-c | 4.8.1 | 4.9.2 |
| netcdf-cxx4 | 4.3.1 | 4.3.1 |
| netcdf-fortran | 4.5.4 | 4.6.1 | 
| openmpi (aocc) | 4.1.3 | *dropped* |
| openmpi (gcc) | 4.1.3 | 5.0.3 |
| patchelf (gcc) | 0.17.2 | 0.18.0\* |
| patchelf (intel) | 0.18.0 | *dropped* | 
| patchelf (oneapi) | 0.18.0 | *dropped* | 
| petsc | 3.18.1 | 3.21.1 |
| pmix | *n/a* | 5.0.1 |

> Modules that are "dropped" or "deprecated" may be manually installed by the user using [Spack](#spack).

### Spack

Spack is a package manager platform that allows users to install software without admin privileges.
CHTC also uses Spack to install the software underlying the system-wide modules discussed above.

> If you have not used Spack before, you can skip this section and go directly to the [Set Up Spack on HPC](hpc-spack-setup.html) guide.
