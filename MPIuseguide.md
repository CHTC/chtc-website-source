---
highlighter: none
layout: default
title: MPI Use Guide
---


Contents
========

1.  [Overview of installed MPI libraries](#overview)
2.  [Using the MPI libraries to compile your code](#lib)
3.  [Running your job](#run)

This page describes how to use the MPI libraries installed on the HPC
cluster.

<a name="overview"></a>

**1. Overview of Installed MPI Libraries**
======================================

There are multiple MPI libraries installed on the cluster, many compiled
in at least two ways (see below). The SLURM scheduler also has
integrated libraries for most MPI versions, which you can read about
[here](https://computing.llnl.gov/linux/slurm/mpi_guide.html).

There are ten different MPI libraries installed:

-   OpenMPI version 1.6.4
-   OpenMPI version 1.10.2
-   OpenMPI version 2.0.1
-   OpenMPI version 2.1.0
-   OpenMPI version 3.1.1
-   MPICH version 3.0.4
-   MPICH version 3.1
-   MPICH2 version 1.5
-   MVAPICH2 version 1.9
-   MVAPICH2 version 2.1

**IMPORTANT: If your software can use OpenMPI or MVAPICH2, these are the
recommended MPI libraries for CHTC\'s HPC Cluster and will perform the
fastest on the cluster\'s Infiniband networking.** MPICH and MPICH2 do
not use Infiniband, by default, and will perform slower than OpenMPI or
MVAPICH2, though we\'ve configured them to work as well as for
ethernet-only clusters, so they\'ll still work if your software will
*only* run with MPICH or MPICH2.

Note that many of our MPI libraries have been compiled with different
base compilers, to accommodate codes that require these base compilers
to be built successfully. The compiler used to build MPI can be seen in
the names of our software modules (see [below](#lib)) and include:

-   `gcc` - the base system version of `gcc`
-   `intel` - compiled with Intel Composer XE and Intel MPI Library
    Development Kit 4.1 compilers
-   `intel-2016` -
-   `2.1.0-GCC-7.3.0-2.30` - version 7.3 of `gcc`

<a name="lib"></a>

**2. Using the MPI Libraries to Compile Your Code**
===============================================

In order to successfully compile and run your code using these MPI
libraries you need to set a few environmental variables. To set these
variables you will be using the Environmental Modules package
(<http://modules.sourceforge.net>). This package is very easy to use and
it will automatically set the environmental variables necessary to use
the flavor and version of MPI that you need.

First, you are going to want to run the following command to see the
available modules:

``` 
[alice@service]$ module avail
```
{:.term}

When you run the above command you will receive output similar to this:

``` 
[alice@service]$ module avail
---------------------------------------- /etc/modulefiles ----------------------------------------
mpi/gcc/mpich-3.0.4                 mpi/gcc/openmpi-1.6.4               mpi/intel/mvapich2-1.9
mpi/gcc/mvapich2-1.9                mpi/intel/mpich-3.0.4               mpi/intel/openmpi-1.6.4
matlab-r2015b                       compile/intel-2016                  mpi/gcc/openmpi/2.1.0-GCC-7.3.0-2.30
```
{:.term}

As you can see, the MPI libraries compiled with GCC compilers are listed
under `mpi/gcc/` and the MPI libraries compiled with Intel compilers are
listed under `mpi/intel/`.

To load a module (for example, OpenMPI compiled with GCC compilers),
simply run this command:

``` 
[alice@service]$ module load mpi/gcc/openmpi-1.6.4
```
{:.term}

Now all necessary environmental variables are set correctly and you can
go ahead and compile your code!

If you loaded the wrong module, let\'s say MPICH compiled with Intel
compilers, you can unload it by running:

``` 
[alice@service]$ module unload mpi/intel/mpich-3.0.4
```
{:.term}

You can see what modules you already have loaded by running:

``` 
[alice@service]$ module list
```
{:.term}

**NOTE:** Before using any of the MPI libraries under `mpi/intel/` you
first need to load the `compile/intel` module.

<a name="run"></a>


**3. Running Your Job**
===================

**NOTE:** To run your job you need the same module loaded as when you
compiled your code. When you log out of your terminal all loaded modules
are automatically unloaded.

In order to ensure that your job has the appropriate modules loaded when
it runs, we recommend adding the `module load` command to your submit
file, with the appropriate modules. See our sample submit file in the
[HPC Use Guide](/HPCuseguide.shtml#batch-job) to see what this looks
like.
