---
highlighter: none
layout: guide
title: "HTC System Transition to a New Linux Version (CentOS Stream 9)"
guide: 
    button_class: bg-warning
    order: 0
    category: Basics and Policies
	tag:
		- htc
---

Starting in March 2024, CHTC's high throughput computing (HTC) system began upgrading
the Linux distribution and version we use on our servers to **CentOS Stream 9**. This transition is expected to complete in May 2024. 

Note that this page only applies to a transition on the HTC system (submitting jobs 
with HTCondor). The high performance computing (HPC) cluster will be upgraded in 
the near future as well and have a separate transition 
page. 

All updates to the HTC system will be reflected on this page; significant changes may 
also include a notification to the `chtc-users` mailing list. 

## Important Dates

*Note: By default, CHTC-managed submit servers automatically add a job 
requirement that requires jobs to run on servers running our primary operating system unless otherwise specified by the user.*

* **April 2024**: HTC system will support CentOS 7, CentOS Stream 8, and CentOS Stream 9. By default, 
all jobs not using a software container will continue to match to servers running CentOS 8, however,
**users should begin using software containers or testing jobs on servers running CentOS Stream 9**. 
* **May 1, 2024**: Default operating system requirements for jobs will change from CentOS 8 to CentOS Stream 9.

## What You Need to Do

### If your jobs use containers (Docker, Singularity/Apptainer)

**No action is needed for researchers already using a Docker or Singularity/Apptainer software containers in their jobs.** Becuase software containers have a small operating system installed inside of them, these jobs carry everything they need with them and do not rely signifcantly on the host operating system. By default, your jobs will match to any operating system in the HTC pool, including the new CentOS Stream 9 hosts. 

### All other jobs (not using containers)

**Researchers not already using a Docker or Apptainer software container** will need to either 

- (a) test their software/code on a CentOS Stream 9 machine to see their software needs to be reinstalled. See [Transition to New Operating System](#option-2-transition-to-new-operations-system).
- **or** 
- (b) switch to using a software container (recommended). See the [below](#option-1-using-a-container-recommended) for additional information. 

If you would like to access as much computing capacity as possible, consider using a Docker or Apptainer software container for your jobs so that your jobs can match to a variety of operating systems. See the [information below](#option-1-using-a-container-recommended) for detailed instructions on creating and using software containers. 

## Options For Transitioning Your Jobs

1. [Use a Container (recommended)](#option-1-using-a-container-recommended)
1. [Transition to  New Operating System](#option-2-transition-to-new-operations-system)

### Option 1: Use a Software Container (Recommended)

Using a software container to provide a base version of Linux will allow you to 
run on any nodes in the HTC system regardless of the operating system it is running, and not limit you to a subset of nodes. 

CHTC provides helpful information for learning about creating and using Docker and Apptainer software commands: 

**Apptainer**
- [Use Apptainer Containers](apptainer-htc.html)
- [Build an Apptainer Container](apptainer-build.html)
- [Advanced Apptainer Example - SUMO](apptainer-htc-advanced-example.html)
  
**Docker**
- [Explore and Test Docker Containers](docker-test.html)
- [Build a Docker Container Image](docker-build.html)
- [Running HTC Jobs Using Docker Containers](docker-jobs.html)

**CHTC users are welcome to reach out to the Facilitation team via email or in office hours for help installing their software into a container.**

### Option 2: Transition to a New Operating System

This option is more limiting because 
you are restricted to operating systems used by CHTC, and the number of nodes 
running that operating system. 

Researchers that do not wish to use containers for their job should test their jobs on the CentOS Stream 9 machines as soon as possible so that jobs are not significantly disrupted by this transition. We recommend: 

* Test your jobs by requesting the new operating system  (`chtc_want_el9 = true`, see
more details below) for 1-2 test jobs. (Note that after May 1, this option will not be required as EL9 will be default.)
* If needed, recompile your code. 

Note that if you have not tested your code by May 1, you may want to opt into the old 
operating system temporarily until you have tested and transitioned your code. Instructions for requesting a specific operating system(s) are outlined here:

* [Use Custom Linux Versions in CHTC](os-transition-htc.html).

**If you are having trouble getting your jobs to run successfully on the new operating system**, 
please contact the facilitation team at chtc@cs.wisc.edu or [come to office hours](/uw-research-computing/get-help.html)