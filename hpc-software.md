---
highlighter: none
layout: default
title: Using Software on the HPC Cluster
---

This page describes how to install and run software on CHTC's HPC Cluster. 

Contents
========

1.  [General Software Policies](#)
2.  [Using Pre-Installed Software in Modules](#)
3.  [Installing Software on the Cluster](#)
4.  [Using Software in Jobs](#)

# General Software Policies

In CHTC, we install a minimal set of software for use 
on our systems. On the HPC Cluster, CHTC staff manage installations of 
the following types of programs: 

* Compilation tools and common dependencies (e.g. MPI, NetCDF, different GCC versions)
* Software that requires a shared license (e.g. COMSOL, ABAQUS)

Information on how to access CHTC-managed installations is in the next 
section. If you need to use a program not in that group, the instructions 
for creating your own installation follow. 

# Using Pre-Installed Software in Modules

All software on the cluster that is installed by CHTC staff is available via 
a tool called "modules". 

## See Available Software Modules

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

## Access Software in Modules

Once you find a software module that you want to use, you need to "load" it 
into your command line environment to make it active, filling in `module_name` with 
the name you found through one of the above steps. 

```
[alice@login]$ module load module_name
```

## Unload Software in Modules

If you no longer want to use a specific software installation, you can "unload"
the software module with the following command: 

```
[alice@login]$ module unload module_name
```

If you want to clear your command line environment and start over, run the following: 

```
[alice@login]$module purge
```

# Installing Software on the Cluster

## Overview

* use build server? 
* install to /software
* use local scratch? 

## Step by Step Process

* log into build server(??)
* download source code
* read docs
* load dependencies
* configure (configure)
* make
* make install

## Testing the install

## Optional: Creating Your Own Modules

# Using Software in Jobs




