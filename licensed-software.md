---
highlighter: none
layout: default
title: Using Licensed Software in CHTC
---


This guide describes when and how to run jobs that use licensed software in
CHTC's high throughput compute (HTC) system.

**To best understand the below information, users should already have an
understanding of:**

-   Using the command line to: navigate within directories,
    create/copy/move/delete files and directories, and run their
    intended programs (aka \"executables\").
-   [The CHTC\'s Intro to Running HTCondor Jobs](/helloworld.shtml)

Overview
========

Once you know that you need to use a licensed software program on our
HTC system, you will need to do the following:

-   [View Licensed Software in the HTC System](#access)
-   [Submit Jobs Using Software Modules](#submission)
    1.  [Create a script that loads the correct software
        module.](#script)
    2.  [Make sure your submit file has certain key
        requirements](#submit)


<a name="policies"/>

A. CHTC\'s Licensed Software Policies on the HTC System
=======================================================

Our typical practice for software support in CHTC is for users to
install and manage their own software installations. We have multiple
guides to help users with [common software
programs](/howto_overview.shtml) and additional support is always
available through [CHTC\'s research computing
facilitators](/get-help.shtml).

However, certain software programs require paid licenses which can make
it challenging for individual users to install the software and use the
licenses correctly. As such, we provide support for software
installation and use on our high throughput system. Installation of
licensed programs is by request to and at the discretion of CHTC staff.

We always recommend using a free or open-source software alternative
whenever possible, as certain software licenses restrict the amount of
computing that can contribute to your research.

<a name="access"/>

B. Viewing Licensed Software on the HTC System
==============================================

Software with paid licenses that has been installed on the high
throughput (HTC) system is accessible through software \"modules\",
which are tools to access and activate a software installation. To see
which software programs are available on the HTC system, run the
following command on an HTC submit server:

``` 
[alice@submit]$ module avail
```
{:.term}

> Note: you should never run a program directly on the submit server.
> Jobs that use licensed software/modules should always be submitted as
> HTCondor jobs as [described below](#submission).

Note that not all software modules are available to all CHTC users. Some
programs like `ansys` have a campus or shared license which makes them
available to all CHTC users. Other software, like `lumerical` and
`abaqus`, is licensed to a specific group and is only available to
members of that group. 

<a name="submission"/>

C. Submitting Jobs Using Licensed Software Modules
==================================================

The following sections describe how to create a bash script executable
and HTCondor submit file to run jobs that use software accessible via
the modules.

<a name="script"/>

**1. Script For Running Jobs with Modules**
---------------------------------------

To run a job that uses a licensed software installation on the HTC
system, you need to write a script that loads the software module and
then runs the program, like so:

``` 
#!/bin/bash

# Commands to enable modules, and then load an appropriate software module
export PATH
. /etc/profile.d/modules.sh
module load software

# Command to run your software from the command line
cmd -options input.file
```
{:.file}

Replace `software` with the name of the software module you want to use,
found via the `module avail` command described [above](#access). Replace
the final command with the syntax to run your software, with the
appropriate options.

For example, to run a Comsol job, the script might look like this:

``` 
#!/bin/bash

export PATH
. /etc/profile.d/modules.sh
module load COMSOL/5.4

comsol batch -inputfile test.mph -outputfile test-results.mph
```
{:.file}

<a name="submit"/>

**2. Submit File Requirements**
---------------------------

There are several important requirements to consider when writing a
submit file for jobs that use our licensed software modules. They are
shown in the sample submit file below and include:

-   **Require access to the modules.** To ensure that your job will have
    access to CHTC software modules you must include the following in
    your submit file.

    ``` {.sub}
    requirements = (HasChtcSoftware == true)
    ```

-   **Request accurate CPUs and memory.** Run at least one test job and
    look at the log file produced by HTCondor to determine how much
    memory and disk space your jobs actually use. We recommend
    requesting the smallest number of CPUs where your job will finish in
    1-2 days.
-   **The script you wrote above (shown as `run_job.sh` below) should be
    your submit file \"executable\"**, and any input files should be
    listed in **transfer\_input\_files**.

A sample submit file is given below:

``` {.sub}
# software.sub
# A sample submit file for running a single job using software modules

universe = vanilla
log = job_$(Cluster).log
output = job_$(Cluster).out
error = job_$(Cluster).err

# the executable should be the script you wrote above
executable = run_job.sh
# arguments = (if you want to pass any to the shell script)
should_transfer_files = YES
when_to_transfer_output = ON_EXIT
transfer_input_files = (this should be a comma separate list of input files if needed)

# Requirement for accessing new set of software modules
requirements = ( HasChtcSoftware == true ) 

request_cpus = 1
request_memory = 2GB
request_disk = 2GB

queue
```

After the submit file is complete, you can submit your jobs using
`condor_submit`.
