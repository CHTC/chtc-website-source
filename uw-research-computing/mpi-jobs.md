---
highlighter: none
layout: markdown-page
title: Running MPI Jobs in CHTC
---


This guide describes when and how to run multi-core jobs, programmed with MPI, in
CHTC's high throughput compute (HTC) system.

**To best understand the below information, users should already have an
understanding of:**

-   Using the command line to: navigate within directories,
    create/copy/move/delete files and directories, and run their
    intended programs (aka \"executables\").
-   [The CHTC\'s Intro to Running HTCondor
    Jobs](helloworld)

Overview
========

Before you begin, review our below discussion of [MPI requirements and
use cases](#require), to make sure that our multi-core MPI capabilities
are the right solution for your computing problem. If you have any
questions, contact a CHTC facilitator at
[chtc@cs.wisc.edu](chtc@cs.wisc.edu).

Once you know that you need to run multi-core jobs that use MPI on our
HTC system, you will need to do the following:

1.  [Compile your code using our MPI module system](#compile)
2.  [Create a script to that loads the MPI module you used for
    compiling, and then runs your code](#script)
3.  [Make sure your submit file has certain key requirements](#submit)


<a name="require"/>

A. Requirements and Use Cases
=============================

Most jobs on CHTC\'s HTC system are run on one CPU (sometimes called a
\"processor\", or \"core\") and can be executed without any special
system libraries. However, in some cases, it may be advantageous to run
a single program on multiple CPUs (also called multi-core), in order to
speed up single computations that cannot be broken up and run as
independent jobs. If you have questions about the advantages and
disadvantages of running multi-core jobs versus single-core jobs,
contact one of CHTC\'s facilitators at
[chtc@cs.wisc.edu](chtc@cs.wisc.edu).

Running on multiple CPUs can be enabled by the parallel programming
standard MPI. For MPI jobs to compile and run, CHTC has a set of MPI
tools installed to a shared location that can be accessed via software
modules.

<a name="view"/>

B. View MPI Modules on the HTC System
=====================================

MPI tools are accessible on the HTC system through software \"modules\",
which are tools to access and activate a software installation. To see
which MPI packages are supported in the HTC, you can type the following
command from the submit server:

``` 
[alice@submit]$ module avail
```
{:.term}

Your software may require newer versions of MPI libraries than those
available via our modules. If this is the case, send an email to
[chtc@cs.wisc.edu](chtc@cs.wisc.edu), to find out if we can install
that library into the module system.

C. Submitting MPI jobs
======================

<a name="compile"/>

**1. Compile MPI Code**
-------------------

You can compile your program by submitting an interactive build job to
one of our compiling servers. Do not compile code on the submit server,
as doing so may cause performance issues. The interactive job is
essentially a regular HTCondor job, but *without* an executable; **you**
are the one running the commands instead (in this case, to compile the
program).

**Instructions for submitting an interactive build/compile job** are
available on our [interactive submission guide](inter-submit).
The only line in the submit file that you need to change is
`transfer_input_files` to reflect all the source files on which your
program depends. Otherwise, go through the steps described in that guide
until immediately after running `condor_submit -i`.

Once your interactive job begins on one of our compiling servers, you
can confirm which MPI modules are available to you by typing:

``` 
[alice@build]$ module avail
```
{:.term}

Choose the module you want to use and load it with the following
command:

``` 
[alice@build]$ module load mpi_module
```
{:.term}

where `mpi_module` is replaced with the name of the MPI module you\'d
like to use.

> **IMPORTANT NOTICE**: Make sure you are using a current MPI module;
> shown in the first section of modules under the
> `/software/chtc/modules` heading.

After loading the module, compile your program. If your program is
organized in directories, **make sure to create a tar.gz file of
anything you want copied back to the submit server**. Once typing `exit`
the interactive job will end, and any \*files\* created during the
interactive job will be copied back to the submit location for you.

If your MPI program is especially large (more than 100 MB, compiled), or
if it can *only* run from the exact location to which it was installed,
you may also need to take advantage of CHTC\'s shared software location
or our public web proxy called Squid. Email CHTC\'s Research Computing
Facilitators at [chtc@cs.wisc.edu](chtc@cs.wisc.edu) if this is the case.


<a name="script"/>

**2. Script For Running MPI Jobs**
------------------------------

To run your newly compiled program within a job, you need to write a
script that loads an MPI module and then runs the program, like so:

``` 
#!/bin/bash

# Commands to enable modules, and then load an appropriate MP/MPI module
export PATH
. /etc/profile.d/modules.sh
module load mpi_module

# Untar your program installation, if necessary
tar -xzf my_install.tar.gz

# Command to run your OpenMP/MPI program
# (This example uses mpirun, other programs
# may use mpiexec, or other commands)
mpirun -np 8 ./path/to/myprogram
```
{:.file}

Replace `mpi_module` with the name of the module you used to compile
your code, `myprogram` with the name of your program, and `X` with the
number of CPUs you want the program to use. There may be additional
options or flags necessary to run your particular program; make sure to
check the program\'s documentation about running multi-core processes.

<a name="submit"/>

**3. Submit File Requirements**
---------------------------

There are several important requirements to consider when writing a
submit file for multicore jobs. They are shown in the sample submit file
below and include:

-   **Require access to MPI modules.** To ensure that your job will have
    access to CHTC software modules, including MPI modules, you must
    include the following in your submit file.

    ``` {.sub}
    requirements = (HasChtcSoftware == true)
    ```

-   **Request \*accurate\* CPUs and memory** Run at least one test job
    and look at the log file produced by HTCondor to determine how much
    memory and disk space your multi-core jobs actually use. Requesting
    too much memory will cause two issues: your jobs will match more
    slowly and they will be wasting resources that could be used by
    others. Also, the fewer CPUs your jobs require, the sooner you\'ll
    have more jobs running. Jobs requesting 16 CPUs or less will do
    best, as nearly all of CHTC\'s servers have at least that many, but
    you can request and use up to 36 CPUs per job.
-   **The script you wrote above (shown as `run_mpi.sh` below) should be
    your submit file \"executable\"**, and your compiled program and any
    files should be listed in **transfer\_input\_files**.

A sample submit file for multi-core jobs is given below:

``` {.sub}
# multicore.sub
# A sample submit file for running a single multicore (8 cores) job

## General submit file options
universe = vanilla
log = mc_$(Cluster).log
output = mc_$(Cluster).out
error = mc_$(Cluster).err

## Submit file options for running your program
executable = run_mpi.sh
# arguments = (if you want to pass any to the shell script)
should_transfer_files = YES
when_to_transfer_output = ON_EXIT
transfer_input_files = (this should be a comma separate list of input files if needed)

# Requirement for accessing new set of modules
requirements = ( HasChtcSoftware == true ) 

## Request resources needed by your job
request_cpus = 8
request_memory = 8GB
request_disk = 2GB

queue
```

After the submit file is complete, you can submit your jobs using
`condor_submit`.
