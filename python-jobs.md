---
highlighter: none
layout: default
title: Running Python Jobs on CHTC
---


**To best understand the below information, users should already have an
understanding of:**

-   Using the command line to: navigate within directories,
    create/copy/move/delete files and directories, and run their
    intended programs (aka \"executables\").
-   [The CHTC\'s Intro to Running HTCondor
    Jobs](http://chtc.cs.wisc.edu/helloworld.shtml)

Overview
========

CHTC provides several copies of Python that can be used to run Python
code in jobs. See our list of supported versions here: [CHTC Supported
Python](#supported)

This guide details the steps needed to:

1.  [Create a portable copy of your Python packages](#build)
2.  [Write a script that uses Python and your packages](#script)
3.  [Submit jobs](#submit)

If you want to build your own copy of base Python, see this archived
page:

-   [Building a Python installation](archived/python-jobs.shtml)


Supported Python Installations
==============================


{:.gtable}
  | Python version  | Name of Python installation file |
  | --- | --- |
  | Python 2.7 | python27.tar.gz |
  | Python 3.6 | python36.tar.gz |
  | Python 3.7 | python37.tar.gz |
  | Python 3.8 | python38.tar.gz |


**1. Adding Python Packages**
=========================

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


A. Submit an Interactive Job
----------------------------

Create the following special submit file on the submit server, calling
it something like `build.sub`.

```
# Python build file

universe = vanilla
log = interactive.log

# Choose a version of Python from the table above
transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/chtc/python##.tar.gz

+IsBuildJob = true
requirements = (OpSysMajorVer =?= 7) && ( IsBuildSlot == true )
request_cpus = 1
request_memory = 2GB
request_disk = 2GB

queue
```
 {:.sub}

The only thing you should need to change in the above file is the name
of the `python##.tar.gz` file - in the \"transfer\_input\_files\" line.
We have two versions of Python available to build from \-- see the table
above.

> If you want to add packages to a pre-existing package directory, add
> the `tar.gz` file with the packages to the `transfer_input_files`
> line:
>
> ``` {.sub}
> transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/chtc/python##.tar.gz, packages.tar.gz
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
[alice@build]$ which python3
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

First, create, a directory to put your packages into:

``` 
[alice@build]$ mkdir packages
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

In order to use CHTC\'s copy of Python and the packages you have
prepared in an HTCondor job, we will need to write a script that unpacks
both Python and the packages and then runs our Python code. We will use
this script as as the `executable` of our HTCondor submit file.

A sample script appears below. After the first line, the lines starting
with hash marks are comments . You should replace \"my\_script.py\" with
the name of the script you would like to run, and modify the Python
version numbers to be the same as what you used above to install your
packages.

``` {.file}
#!/bin/bash

# untar your Python installation. Make sure you are using the right version!
tar -xzf python##.tar.gz
# (optional) if you have a set of packages (created in Part 1), untar them also
tar -xzf packages.tar.gz

# make sure the script will use your Python installation, 
# and the working directory as its home location
export PATH=$PWD/python/bin:$PATH
export PYTHONPATH=$PWD/packages

# run your script
python3 my_script.py
```

If you have additional commands you would like to be run within the job,
you can add them to this base script. Once your script does what you
would like, give it executable permissions by running:

``` {.term}
[alice@submit] chmod +x run_python.sh
```

> Arguments in Python
> -------------------
>
> To pass arguments to an R script within a job, you\'ll need to use the
> following syntax in your main executable script, in place of the
> generic command above:
>
> ``` {.file}
> python3 my_script.py $1 $2
> ```
>
> Here, `$1` and `$2` are the first and second arguments passed to the
> bash script from the submit file (see below), which are then sent on
> to the Python script. For more (or fewer) arguments, simply add more
> (or fewer) arguments and numbers.
>
> In addition, your Python script will need to be able to accept
> arguments from the command line. There is an explanation of how to do
> this in [this Software Carpentry
> lesson](http://swcarpentry.github.io/python-novice-inflammation/10-cmdline/index.html).

[]{#submit}

3. Submitting Jobs
==================

A sample submit file can be found in our [hello
world](/helloworld.shtml) example page. You should make the following
changes in order to run Python jobs:

-   Your `executable` should be the script that you wrote
    [above](#script).

    ``` {.sub}
    executable = run_py.sh
        Modify the CPU/memory request lines.  Test a few jobs for disk space/memory usage in 
    order to make sure your requests for a large batch are accurate!  
    Disk space and memory usage can be found in the log file after the job completes. 
         Change transfer_input_files to include: 
        transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/chtc/python##.tar.gz, packages.tar.gz, my_script.py
    ```

-   If your script takes arguments (see the box from the previous
    section), include those in the arguments line:

    ``` {.sub}
    arguments = value1 value2
    ```

[]{#squid}

> ### How big is your package tarball?
>
> If your package tarball is larger than 100 MB, you should NOT transfer
> the tarball using `transfer_input_files`. Instead, you should use
> CHTC\'s web proxy, `squid`. In order to request space on `squid`,
> email the research computing facilitators at <chtc@cs.wisc.edu>.
