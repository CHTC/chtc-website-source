---
highlighter: none
layout: guide
title: Running Python Jobs
software_icon: /uw-research-computing/guide-icons/python-icon.png
software: Python
guide:
    tag:
        - htc
excerpt_separator: <!--more-->
published: true
---

## Quickstart: Python

### Option A - Own Container (recommended)

Build a container with Python & packages installed inside:

1. How to build your own container: [Apptainer](apptainer-htc#use-an-apptainer-container-in-htc-jobs) / [Docker](docker-build)
2. [Example container recipes for Python](https://github.com/CHTC/recipes/tree/main/software/Python/)
3. Use your container in your HTC jobs: [Apptainer](software-overview-htc.html#use-an-existing-container) / [Docker](docker-jobs.html#use-a-docker-container-in-a-job)

#### Option B - Existing Container

Use an existing container with a base installation of Python:

1. Choose an existing container. See 
   [OSG Base Containers](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/#base)
   or
   [DockerHub Python Containers](https://hub.docker.com/_/python).
2. Use the container in your HTC jobs: [Apptainer](software-overview-htc.html#use-an-existing-container) / [Docker](docker-jobs.html#use-a-docker-container-in-a-job)

<!--more-->

## More information

All CHTC machines have a base installation of Python 3.
The exact versions and packages installed, however, can vary from machine to machine.
You should be able to include simple python commands in your calculations, i.e., `python3 simple-script.py`.

If you need a specific version of Python 3 or would like to install your own packages, we recommend that you use a container as described above.

The example recipes provided above for building your own container are intended for python packages that can be installed using `python3 -m pip install`. 
Additional software can be installed when building your own container.

For packages that need to be installed with `conda install`, see the guide on [Conda](software-overview-htc.html#quickstart). 

### Executable

When using a container, you can use a python `.py` script as the submit file `executable`, provided that the first line (the "shebang") in the `.py` file is

```
#!/usr/bin/env python3
```

with the rest of the file containing the commands that you want to run using Python.

Alternatively, you can use a bash `.sh` script as the submit file `executable`, and in that file you can use the `python3` command:

```
#!/bin/bash

python3 my-script.py
```

In this case, remember to include your `.py` file in the `transfer_input_files` line of your submit file.

<!-- Archived 2024-05

**To best understand the below information, you should already have an
understanding of:**

-   Using the command line to: navigate within directories,
    create/copy/move/delete files and directories, and run their
    intended programs (aka \"executables\").
-   [The CHTC\'s Intro to Running HTCondor
    Jobs](helloworld.html)

Overview
========

CHTC provides several copies of Python that can be used to run Python
code in jobs. See our list of supported versions here: [CHTC Supported
Python](#supported)

This guide details the steps needed to:

1.  [Create a portable copy of your Python packages](#build)
2.  [Write a script that uses Python and your packages](#script)
3.  [Submit jobs](#submit)

If you want to use conda to manage your Python package dependencies, 
read this guide as background material,
then read [our guide on using conda](conda-installation.html).

<span name="supported"></span>

CHTC-Provided Python Installations
==============================

CHTC provides a pre-built copy of the following versions of Python: 

### Building on CentOS 7 Linux _(Soon to be Phased Out)_

{:.gtable}
  | Python version  | Name of Python installation file |
  | --- | --- |
  | Python 2.7 | python27.tar.gz |
  | Python 3.6 | python36.tar.gz |
  | Python 3.7 | python37.tar.gz |
  | Python 3.8 | python38.tar.gz |
  | Python 3.9 | python39.tar.gz |

### Building on CentOS Stream 8 Linux _(RECOMMENDED)_

{:.gtable}
  | Python version  | Name of Python installation file |
  | --- | --- |
  | Python 3.7 | python37.tar.gz |
  | Python 3.8 | python38.tar.gz |
  | Python 3.9 | python39.tar.gz |
  | Python 3.10 | python310.tar.gz |

If you need a specific version of Python not shown 
above, [contact the Research Computing Facilitators](mailto:chtc@cs.wisc.edu) to 
see if we can build it for you; if 
we can't, we can send you instructions for how to build your own copy of Python 
or use a Docker container for running your jobs. 

**1. Adding Python Packages**
=========================
<span name="build"></span>

If your code uses specific Python packages (like `numpy`, `matplotlib`,
`sci-kit learn`, etc) follow the directions below to download and
prepare the packages you need for job submission. **If your job does not
require any extra Python packages, skip to parts 2 and 3.**

You are going to start an interactive job that runs on the HTC build
servers and that downloads a copy of Python. You will then install your
packages to a folder and zip those files to return to the submit server.

> These instructions are primarily about adding packages to a fresh
> install of Python; if you want to add packages to a pre-existing
> package folder, there will be notes below in boxes like this one.

Preliminary Step: Choose a Linux Version to Build On
----------------------------------

As of August 2022, the newest hardware in the HTC system is running a newer version of Linux, 
CentOS Stream 8. A limited amount of our older hardware is still running CentOS 7 but these machines will be upgraded to the new operating system in the near future. More information about this transition can be found in the [HTC Operating System Transition](/uw-research-computing/os-transition-htc.html) guide. 

There are two approaches to running on our pool: 

- **compile on CentOS 8, run on CentOS8**: This is the recommended option for (1) all new users and for (2) existing users who have tested their CentOS 7 builds and determined they are not compatabile with CentOS 8 machines. By choosing this option, you will have access to the vast majority of the HTC system's capacity.

- **compile on CentOS 7, run on both versions of CentOS**: This is a **temporary** option available to users who previously compiled their software on CHTC's CentOS 7 machines. In _some_ cases, it is possible to use the same software, library, and packages on both CentOS 7 and CentOS Stream 8 machines. Existing users who compiled their software on CentOS 7 machines will need to (1) test their jobs to ensure they run successfully on CentOS Stream 8 machines and (2) plan for the phasing out of CentOS 7 machines (expected Fall 2022). 


A. Submit an Interactive Job
----------------------------
<span name="version"></span>
Create the following special submit file on the submit server, calling
it something like `build.sub`. **Make sure that you choose the appropriate 
Python tar.gz file and requirements if you want to build on CentOS 7 versus 
CentOS Stream 8. **

```
# Python build file

universe = vanilla
log = interactive.log

# In the latest version of HTCondor on CHTC, interactive jobs require an executable.
# If you do not have an existing executable, use a generic linux command like hostname as shown below.
executable = /usr/bin/hostname

# Choose a version of Python from the tables above
# If building on CentOS 7 (To be Phased Out)
# transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/chtc/python##.tar.gz

# If building on CentOS 8 (Recommended)
transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/chtc/el8/python##.tar.gz

+IsBuildJob = true
# Indicate which version of Linux (CentOS) you want to build your packages on
requirements = (OpSysMajorVer =?= 8)
request_cpus = 1
request_memory = 4GB
request_disk = 2GB

queue
```
 {:.sub}

> If you want to add packages to a pre-existing package directory, add
> the `tar.gz` file with the packages to the `transfer_input_files`
> line:
>
> ``` {.sub}
> transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/chtc/el8/python##.tar.gz, packages.tar.gz
> ```

Once this submit file is created, you will start the interactive job by
running the following command:

``` 
[alice@submit]$ condor_submit -i build.sub
```
{:.term}

It may take a few minutes for the build job to start.

B. Install the Packages
-----------------------

Once the interactive build job starts, you should see the Python that
you specified inside the working directory:

``` 
[alice@build]$ ls -lh
-rw-r--r-- 1 alice alice  78M Mar 26 12:24 python##.tar.gz
drwx------ 2 alice alice 4.0K Mar 26 12:24 tmp
drwx------ 3 alice alice 4.0K Mar 26 12:24 var
```
{:.term}

We\'ll now unzip the copy of Python and set the `PATH` variable to
reference that version of Python:

``` 
[alice@build]$ tar -xzf python##.tar.gz
[alice@build]$ export PATH=$PWD/python/bin:$PATH
```
{:.term}

To make sure that your setup worked, try running:

``` 
[alice@build]$ python3 --version
```
{:.term}

You can also try running this command to make sure the copy of python
that is now active is the one you just installed:

``` 
[alice@build]$ echo `which python3`
```
{:.term}

The command above should return a path that includes the prefix
`/var/lib/condor/`, indicating that it is installed in your job\'s
working directory.

If you\'re using Python 2, use `python2` instead of `python3` above (and
in what follows). The output should match the version number that you
want to be using!

> If you brought along your own package directory, un-tar it here and
> skip the directory creation step below.

First, create a directory to put your packages into and then add that directory to our list of enviornmental variables that can be used by HTCondor to find the package directory: 

``` 
[alice@build]$ mkdir packages
[alice@build]$ export PYTHONPATH=$PWD/packages
```
{:.term}

You can choose what name to use for this directory \-- if you have
different sets of packages that you use for different jobs, you could
use a more descriptive name than \"packages\"

To install the Python packages run the following command:

``` 
[alice@build]$ python3 -m pip install --target=$PWD/packages package1 package2 etc.
```
{:.term}

Replace *package1* *package2* with the names of packages you want to
install. `pip` should download all dependent packages and install them.
Certain packages may take longer than others.

> If a specific version of a package is required, you can provide the version number using the syntax `packagename==X.Y.Z`.
> For example, `numpy==1.23.5` would install version `1.23.5` of `numpy`.  

If you have difficulties installing a package, we recommend you upgrade `pip` and then try reinstalling your packages:

``` 
[alice@build]$ python3 -m pip install --upgrade pip
[alice@build]$ python3 -m pip install --target=$PWD/packages package1 package2 etc.
```
{:.term}

> The python packages (and versions) can instead be installed using the file `requirements.txt`, which contains one package name (and versions, if needed) per line.  
> This file can be created manually or, if you have a working python installation that you want to duplicate, by running 
>
>  ```
> python3 -m pip freeze > requirements.txt
> ```
> {:.term}
> 
> To install the packages contained within `requirements.txt`, run
> 
> ```
> python3 -m pip install -r requirements.txt
> ```
> {:.term}


C. Finish Up
------------

Right now, if we exit the interactive job, nothing will be transferred
back because we haven\'t created any new **files** in the working
directory, just **sub-directories**. In order to transfer back our
installation, we will need to compress it into a tarball file - not only
will HTCondor then transfer back the file, it is generally easier to
transfer a single, compressed tarball file than an uncompressed set of
directories.

Run the following command to create your own tarball of your packages:

``` 
[alice@build]$ tar -czf packages.tar.gz packages/
```
{:.term}

Again, you can use a different name for the `tar.gz` file, if you want.

We now have our packages bundled and ready for CHTC! You can now exit
the interactive job and the tar.gz file with your Python packages will
return to the submit server with you (this sometimes takes a few extra
seconds after exiting).

``` 
[alice@build]$ exit 
```
{:.term}


**2. Creating a Script**
====================
<span name="script"></span>
In order to use CHTC\'s copy of Python and the packages you have
prepared in an HTCondor job, we will need to write a script that unpacks
both Python and the packages and then runs our Python code. We will use
this script as as the `executable` of our HTCondor submit file.

A sample script (`run_python.sh`) appears below. After the first line, the lines starting
with hash marks are comments . You should replace \"my\_script.py\" with
the name of the script you would like to run, and modify the Python
version numbers to be the same as what you used above to install your
packages.

``` 
#!/bin/bash

# untar your Python installation. Make sure you are using the right version!
tar -xzf python##.tar.gz
# (optional) if you have a set of packages (created in Part 1), untar them also
tar -xzf packages.tar.gz

# make sure the script will use your Python installation, 
# and the working directory as its home location
export PATH=$PWD/python/bin:$PATH
export PYTHONPATH=$PWD/packages
export HOME=$PWD

# run your script
python3 my_script.py
```
{:.file}

If you have additional commands you would like to be run within the job,
you can add them to this base script. Once your script does what you
would like, give it executable permissions by running:

``` 
[alice@submit] chmod +x run_python.sh
```
{:.term}

> Arguments in Python
> -------------------
>
> To pass arguments to a Python script within a job, you\'ll need to use the
> following syntax in your main executable script, in place of the
> generic command above:
>
> ``` 
> python3 my_script.py $1 $2
> ```
> {:.file}
>
> Here, `$1` and `$2` are the first and second arguments passed to the
> bash script from the submit file (see below), which are then sent on
> to the Python script. For more (or fewer) arguments, simply add more
> (or fewer) arguments and numbers.
>
> In addition, your Python script will need to be able to accept
> arguments from the command line. There is an explanation of how to do
> this in [this Software Carpentry
> lesson](https://swcarpentry.github.io/python-novice-inflammation/12-cmdline.html).


**3. Submitting Jobs**
==================
<span name="submit"></span>
A sample submit file can be found in our [hello
world](helloworld.html) example page. You should make the following
changes in order to run Python jobs:

-   **What version of Linux can you run on?** 
	- If you compiled your packages on CentOS7, 
		you can try running your jobs on servers that have either version of Linux. This requires 
		an additional requirement, shown 
		in [this guide](/uw-research-computing/os-transition-htc.html). 
	- If you compiled your packages on CentOS Stream 8, your jobs should ONLY run on 
	servers using CentOS Stream 8. This will be the default as of September 29. Before 
	then, make sure to opt into using that operating system, as described in the same 
	guide linked above. 

-   Your `executable` should be the script that you wrote
    [above](#script).

    ``` 
    executable = run_python.sh
    ```
    {:.sub}
-   Modify the CPU/memory request lines.  Test a few jobs for disk space/memory usage in 
    order to make sure your requests for a large batch are accurate!  
    Disk space and memory usage can be found in the log file after the job completes. 
-   Change transfer_input_files to include the python tar file, packages, script, and any other 
	needed files. **If you used our CentOS 7 version of Python**, this may look like: 
    ```
    transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/chtc/python##.tar.gz, packages.tar.gz, my_script.py
    ```
    {:.sub}
	
	**If you used our CentOS Stream 8 version of Python**, this may look like: 
    ```
    transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/chtc/el8/python##.tar.gz, packages.tar.gz, my_script.py
    ```
    {:.sub}

-   If your script takes arguments (see the box from the previous
    section), include those in the arguments line:

    ``` {.sub}
    arguments = value1 value2
    ```

> ### How big is your package tarball?
>
> If your package tarball is larger than 100 MB, you should NOT transfer
> the tarball using `transfer_input_files`. Instead, you should use
> CHTC\'s web proxy, `squid`. In order to request space on `squid`,
> email the research computing facilitators at <chtc@cs.wisc.edu>.
 -->