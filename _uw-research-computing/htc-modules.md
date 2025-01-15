---
highlighter: none
layout: guide
title: Use Software Available in Modules
guide:
    category: Software
    tag:
        - htc
---

This guide describes when and how to use software, using MPI as an example, that is available as pre-installed modules on the HTC system. 

**To best understand the below information, users should already have an
understanding of:**

-   Using the command line to: navigate within directories,
    create/copy/move/delete files and directories, and run their
    intended programs (aka \"executables\").
-   [The CHTC\'s Intro to Running HTCondor Jobs](helloworld.html)

## Overview

1. [General Software Policies](#1-general-software-policies)
2. [Using Pre-Installed Software in Modules](#2-using-pre-installed-software-in-modules)
3. [Installing Software on the HTC System](#3-installing-software-on-the-htc-system)
4. [Example: Using an MPI module in HTC Jobs](4-example-using-an-mpi-module-in-htc-jobs)

## 1. General Software Policies

In CHTC, we install a minimal set of software for use 
on our systems. On the HTC System, CHTC staff manage installations of 
the following types of programs: 

* Compilation tools and common dependencies (e.g. MPI, different GCC versions)
* Software that requires a shared license (e.g. COMSOL)

Information on how to access CHTC-managed installations is in the next 
section of this guide.  

## 2. Using Pre-Installed Software in Modules

All software on the HTC system that is installed by CHTC staff is available via 
a tool called "modules". 

### A. See Available Software Modules

There are two ways to search through the software modules on the HTC system: 

1. **View all modules**
	This command will show all software modules available: 
```
[alice@submit]$ module avail
```

2. **Search for specific modules**
	If you are searching for a specific software module, you can use the 
	`module spider` command with part of the software name. For example, to 
	search for Open MPI modules, you would type:
```
[alice@submit]$ module spider openmpi
```

### B. Load Software in Modules

Once you find a software module that you want to use, you need to "load" it 
into your command line environment to make it active, filling in `module_name` with the name you found through one of the above steps. 

```
[alice@submit]$ module load module_name
```

> **When to Load Modules**
> 
> You can load modules to compile code (see below). If you do this, make sure to load
> the same modules as part of your job script before running the main command. 
> 
> You can also load modules to run specific software. If done for interactive 
> testing, this should be done in an interactive job; otherwise, the module 
> should be loaded in the job submit file. 

### C. Unload Software in Modules

If you no longer want to use a specific software installation, you can "unload"
the software module with the following command: 

```
[alice@submit]$ module unload module_name
```

If you want to clear your command line environment and start over, run the following: 

```
[alice@submit]$ module purge
```

## 3. Installing Software on the HTC System

### A. Overview

Unless you are using a licensed software program provided via modules, you 
are able to compile and install the software you need on the HTC System.  

Compilation can be done via an interactive job as described in 
our HTC Compiling or Testing Code with an Interactive Job guide. 
If using CHTC's provided compilation tools via modules, make 
sure to load the needed modules before compiling and to load the same 
modules in your job submission. 

For groups that would like to share software installations among group
members, please contact us about getting a shared "group" directory. 

If you are new to software installation, see the section below for 
a more step-by-step description of the process. 

### B. Step by Step Process
The process for installing software is described in more detail in our [Compiling or Testing Code with an Interactive Job](inter-submit.html)
1. **Start an Interactive Job** - it is necessary to build software in an interactive job as noted in [Compiling or Testing Code with an Interactive Job](inter-submit.html)
1. **Download Source Code** - download the source code for your desired program. 
	You should only need the source code until the software is properly installed, but if desired, you may keep a zipped copy of 
	the source code in your workspace.
1. **Read the Docs** - try to find the installation instructions, either online or 
	in the downloaded source code. In particular, you'll want to note if there are 
	any special requirements for dependencies like MPI or the compiler needed. 
1. **Load Modules** - if you are using software modules to help you build your 
	code, load them now. Keep track of what you use so that you can load them 
	in your job submit file later. We also recommend doing a `module purge` before 
	loading your compiling modules to make sure you're starting from a clean environment. 
1. **Install** - most scientific software follows the three step installation process
	of `configure` - `make` - `make install`. 
	1. `configure`- this step checks for tools and requirements needed to compile 
		the code. This is the step where you set the final installation location of 
		a program. The option for setting this location is typically called the 
		"prefix"; a common syntax is: `$ ./configure --prefix=/home/user`.
		This is where you will want to set the installation location to be your 
		`/home` directory. 
	1. `make` - this step compiles and links the code, turning it from human-readable 
		source code to compiled binary code. This is usually the most time consuming 
		step of the installation process. 
	1. `make install` - this step copies compiled files to the final installation location 
		(usually specified in the `configure` step). 

<span name="example"></span>
## 4. Example: Using an MPI module in HTC Jobs

**Below is the process of setting up HTC jobs that use the MPI modules to run. This process can be modified for other software available in modules as well.**

Before you begin, review our below discussion of [MPI requirements and
use cases](#require), to make sure that our multi-core MPI capabilities
are the right solution for your computing problem. 

Once you know that you need to run multi-core jobs that use MPI on our
HTC system, you will need to do the following:

1.  [Compile your code using our MPI module system](#compile)
2.  [Create a script to that loads the MPI module you used for
    compiling, and then runs your code](#script)
3.  [Make sure your submit file has certain key requirements](#submit)


<span name="require"></span>

### A. Requirements and Use Cases

Most jobs on CHTC\'s HTC system are run on one CPU (sometimes called a
\"processor\", or \"core\") and can be executed without any special
system libraries. However, in some cases, it may be advantageous to run
a single program on multiple CPUs (also called multi-core), in order to
speed up single computations that cannot be broken up and run as
independent jobs.

Running on multiple CPUs can be enabled by the parallel programming
standard MPI. For MPI jobs to compile and run, CHTC has a set of MPI
tools installed to a shared location that can be accessed via software
modules.

<span name="view"></span>

### B. View MPI Modules on the HTC System

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
[chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu), to find out if we can install
that library into the module system.

### C. Submitting MPI jobs

<span name="compile"></span>

#### 1. Compile MPI Code

You can compile your program by submitting an interactive build job to
one of our compiling servers. Do not compile code on the submit server,
as doing so may cause performance issues. The interactive job is
essentially a regular HTCondor job, but *without* an executable; **you**
are the one running the commands instead (in this case, to compile the
program).

**Instructions for submitting an interactive build/compile job** are
available on our [interactive submission guide](inter-submit.html).
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

After loading the module, compile your program. If your program is
organized in directories, **make sure to create a tar.gz file of
anything you want copied back to the submit server**. Once typing `exit`
the interactive job will end, and any \*files\* created during the
interactive job will be copied back to the submit location for you. 

If your MPI program is especially large (more than 100 MB, compiled), or
if it can *only* run from the exact location to which it was installed,
you may also need to take advantage of CHTC\'s shared software location
or our public web proxy called Squid. Email CHTC\'s Research Computing
Facilitators at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) if this is the case.


<span name="script"></span>

#### 2. Script For Running MPI Jobs

To run your newly compiled program within a job, you need to write a
script that loads an MPI module and then runs the program, like so:

``` 
#!/bin/bash

# The following three commands are **REQUIRED** to enable modules, and then to load the appropriate MP/MPI module
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

<span name="submit"></span>

#### 3. Submit File Requirements

There are several important requirements to consider when writing a
submit file for multicore jobs. They are shown in the sample submit file
below and include:

-   **Require access to MPI modules.** To ensure that your job will have
    access to CHTC software modules, including MPI modules, you must
    include the following in your submit file.

    ``` {.sub}
    requirements = (HasChtcSoftware == true)
    ```
-   **The script you wrote above (shown as `run_mpi.sh` below) should be
    your submit file \"executable\"**, and your compiled program and any
    files should be listed in **transfer\_input\_files**.

A sample submit file for multi-core jobs is given below:

``` {.sub}
# multicore.sub
# A sample submit file for running a single multicore (8 cores) job
executable = run_mpi.sh
# arguments = (if you want to pass any to the shell script)

## Specify the name of HTCondor's log, standard error, and standard out files
log = mc_$(Cluster).log
output = mc_$(Cluster).out
error = mc_$(Cluster).err

# Tell HTCondor how to handle input files
should_transfer_files = YES
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
