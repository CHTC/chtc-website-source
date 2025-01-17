---
highlighter: none
layout: hpc_layout
title: Recreating Spack Installs on a New Operating System
published: true
guide:
    category: Software
    tag:
        - hpc
---

If you had a software install on the HPC cluster before June 2024 and need to update it, read through 
the details in this guide. Unless your code is fairly simple, you will likely need to recompile it.

If you are installing something on the HPC cluster for the first time, refer to our main software 
guide to start: [Use HPC Software](hpc-software)

**Remember to always compile your code/programs in a (interactive) Slurm job! [How To](hpc-job-submission.html#for-simple-testing-or-compiling)**

> Not only does this help avoid stressing the resources of the login server, but the upgraded login server uses a newer CPU architecture than the worker nodes in the cluster.
> Most compilers auto-detect the CPU architecture and adapt the compilation to use that architecture.
> Attempting to use such compiled code on a different/older CPU architecture can lead to "Illegal instruction" errors, among others.

## Modules

Most of the modules on the upgraded cluster have been kept, but with upgraded versions.
The following table is a comparison of the modules on the old operating system (EL8) versus the new operating system (EL9).
(Adapted from the output of `module avail` on the respective servers.)

You will likely need to recompile your code to use the new module versions.
Remember to also update any `module load` commands that specify a particular version of the module,
otherwise you may encounter "module(s) are unknown" errors.

### Module comparison

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
| patchelf (gcc) | 0.17.2 | 0.17.2 |
| patchelf (intel) | 0.18.0 | *dropped* | 
| patchelf (oneapi) | 0.18.0 | 0.17.2 | 
| petsc | 3.18.1 | 3.21.1 |
| pmix | *n/a* | 5.0.1 |

> Different versions of module packages, or packages that are "dropped" or "deprecated" may be manually installed by the user using [Spack](#spack).

## Spack

Spack is a package manager platform that allows users to install software without admin privileges.
CHTC also uses Spack to install the software underlying the system-wide modules discussed above.

> If you have not used Spack before, you can skip this section and go directly to the [Set Up Spack on HPC](hpc-spack-setup.html) guide.

Here is the general process for setting up your software on the upgraded EL9 system; detailed instructions are provided after the general process: 

1. Identify the environments you currently have and which you want to reproduce on the upgraded system. 

2. Remove your existing Spack folders. 

3. Do a clean installation of Spack.

4. In an interactive job, create your Spack environment(s) and install the packages as you did previously.

5. Update your job submission scripts and/or recompile programs as needed to use the new Spack environment(s). 

*The following instructions assume that you previously installed Spack in your home (`~/`) directory for individual use.*

#### 1. Identify your environments

You can see your Spack environments with 

```
spack env list
```
{:.term}

Activate an environment that you want to replicate with

```
spack env activate environment_name
```
{:.term}

Then list your package "specs" with the command

```
spack find
```
{:.term}

There is a section "`==> Root specs`" that lists the package specs you explicity added when you created your environment.
Save a copy of these specs somewhere safe, so that you can use them to replicate the environment later on.
You can ignore the "`installed packages`" section, as that will certainly change on the new system.

Repeat the above steps for each environment you want to replicate on the upgraded system.

### 2. Remove your existing Spack folders

The easiest way to update Spack for the upgraded system is to remove the current Spack installation and reinstall from scratch.

> Before proceeding, you may want to make a backup of each folder using
>
> ```
> tar -czf folder_name.tar.gz ~/folder_name
> ```
> {:.term}

For most users, the following commands should work:

```
cd ~/
rm -rf spack spack_programs spack_modules .spack
```
{:.term}

The command may take a while to run.

### 3. Fresh install of Spack

Next, follow the instructions in our guide [Set Up Spack on HPC](hpc-spack-setup.html) to do a fresh installation of Spack.
The commands in the guide have been updated for setting up Spack on the new operating system.

### 4. Recreate your environments

Follow the instructions in our guide [Install Software Using Spack](hpc-spack-install.html) to create your desired environments
using the "root specs" that you saved earlier.

**NOTE**: We've made small but important change to this guide: **you should always start an interactive Slurm job before creating or modifying a Spack environment**.
The login server uses different hardware than the execute servers, and the mismatch leads to Spack using the wrong settings for installing packages.
Of course, as before, you should only install packages while in interactive Slurm job.

Behind the scenes, we've made a few changes to the configuration that will hopefully make the package installation much smoother.

### 5. Update your workflow

Finally, remember to update your workflow to use the new Spack environments and the packages installed therein.

* If you explicitly provide paths to packages installed using Spack, be sure to update those paths in your compiler configuration or in your job submission script.

* If you used Spack to provide dependencies for manually compiling a program, remember to recompile the program.

* If you changed the name of your environment, be sure to update the name in your job submission script.

