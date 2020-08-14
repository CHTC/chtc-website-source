---
highlighter: none
layout: default
title: Using Software on the HPC Cluster
---

This page describes how to install and run software on CHTC's HPC Cluster. 

Contents
========

1.  [General Software Policies](#1-general-software-policies)
2.  [Using Pre-Installed Software in Modules](#2-using-pre-installed-software-in-modules)
3.  [Installing Software on the Cluster](#3-installing-software-on-the-cluster)
4.  [Using Software in Jobs](#)

# 1. General Software Policies

In CHTC, we install a minimal set of software for use 
on our systems. On the HPC Cluster, CHTC staff manage installations of 
the following types of programs: 

* Compilation tools and common dependencies (e.g. MPI, NetCDF, different GCC versions)
* Software that requires a shared license (e.g. COMSOL, ABAQUS)

Information on how to access CHTC-managed installations is in the next 
section. If you need to use a program not in that group, the instructions 
for creating your own installation follow. 

If you have questions or concerns about installing your own software or 
the available dependencies, contact the facilitation team at chtc@cs.wisc.edu. 

# 2. Using Pre-Installed Software in Modules

All software on the cluster that is installed by CHTC staff is available via 
a tool called "modules". 

## A. See Available Software Modules

There are two ways to search through the software modules on the HPC cluster: 

1. **View all modules**
	This command will show all software modules available: 
		```
		[alice@login]$ module avail
		```

2. **Search for specific modules**
	If you are searching for a specific software module, you can use the 
	`module spider` command with part of the software name. For example, to 
	search for Open MPI modules, you would type:
		```
		[alice@login]$ module spider openmpi
		```

## B. Access Software in Modules

Once you find a software module that you want to use, you need to "load" it 
into your command line environment to make it active, filling in `module_name` with 
the name you found through one of the above steps. 

```
[alice@login]$ module load module_name
```

> ** When to Load Modules **
> 
> You can load modules to compile code (see below). If you do this, make sure to load
> the same modules as part of your job script before running the main command. 
> 
> You can also load modules to run specific software. If done for interactive 
> testing, this should be done in an interactive job; otherwise, the module 
> should be loaded in the job submit file. 

## C. Unload Software in Modules

If you no longer want to use a specific software installation, you can "unload"
the software module with the following command: 

```
[alice@login]$ module unload module_name
```

If you want to clear your command line environment and start over, run the following: 

```
[alice@login]$module purge
```

# 3. Installing Software on the Cluster

## Overview

Plan to follow these recommendations when building software on the HPC Cluster. 

* Software should be compiled on the build node. (?)
* Final installation should be to your `/software` folder

If you are new to software installation, see the more step-by-step process 
described below. 

## Step by Step Process

1. **Download Source Code** - download the source code for your desired program (where to?)
1. **Read the Docs** - try to find the installation instructions, either online or 
	in the downloaded source code. In particular, you'll want to note if there are 
	any special requirements for dependencies like MPI or the compiler needed. 
1. **Access Build Node** ?
1. **Load Modules** - if you are using software modules to help you build your 
	code, load them now. Keep track of what you use so that you can load them 
	in your job submit file later. We also recommend doing a `module purge` before 
	loading your modules to make sure you're starting from a clean environment. 
1. **Install** - most scientific software follows the three step installation process
	of `configure` - `make` - `make install`. 
	1. `configure`- this step checks for tools and requirements needed to compile 
		the code. This is the step where you set the final installation location of 
		a program. The option for setting this location is typically called the 
		"prefix"; a common syntax is: 
			~~~
			$ ./configure --prefix=/software/user
			~~~
		This is where you will want to set the installation location to be your 
		`/software` directory. 
	1. `make` - this step compiles and links the code, turning it from human-readable 
		source code to compiled binary code. This is usually the most time consuming 
		step of the installation process. 
	1. `make install` - Copies compiled files to the final installation location 
		(usually specified in the `configure` step). 

## Optional: Creating Your Own Modules

TBD

# Using Software in Jobs

The commands to run your software will go in the job's submit file, as described 
in our [HPC job submission guide](). 

If you used one of the software modules to compile your code, make sure you 
load it in your job's submit file before running your main command. 

You can access your software by including the path to its location in your 
`/software` directory, or by setting the `PATH` environment variable to include 
the software location and then running the command. 
