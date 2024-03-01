---
highlighter: none
layout: guide
title: Run R Jobs
guide:
    order: 5
    category: Software Solutions
    tag:
        - htc
---

_ACTION REQUIRED: As of September 29th, the HTC system's default operating system will transition to CentOS Stream 8. This guide has been updated to reflect this change. However, this transition may impact users were running R jobs before September 29th. For more information, see the [HTC Operating System Transition](/uw-research-computing/os-transition-htc.html) guide._ 

**To best understand the below information, users should already have an
understanding of:**

-   Using the command line to: navigate within directories,
    create/copy/move/delete files and directories, and run their
    intended programs (aka \"executables\").
-   [The CHTC\'s Intro to Running HTCondor
    Jobs](helloworld.html)

Overview
========

CHTC provides several copies of R that can be used to run R code in
jobs. See our list of supported versions here: [CHTC Supported
R](#supported)

This guide details the steps needed to:

1.  [Create a portable copy of your R packages](#build)
2.  [Write a script that uses R and your packages](#script)
3.  [Submit jobs](#submit)

If you want to build your own copy of base R, see this archived page:

-   [Building a R installation](r-build.html)

<span name="supported"></span>

CHTC-Provided R Installations
=========================

CHTC provides a pre-built copy of the following versions of R: 

### Building on CentOS Stream 8 Linux

{:.gtable}
  | R version | Name of R installation file |
  | --- | --- |
  | R 3.5.1 | R351.tar.gz |
  | R 3.6.3 | R363.tar.gz |
  | R 4.0.5 | R405.tar.gz |
  | R 4.1.3 | R413.tar.gz | 

If you need a newer version of R than is shown here, 
[please contact us!](mailto:chtc@cs.wisc.edu) We want to continuously 
add new versions of R to this list and rely on your needs to know what 
we should add. 

If you need a specific version of R not shown in this list, especially 
if it is am older R version, we recommend using a Docker container with R installed 
to run your jobs 
(see CHTC's [Docker Jobs guide](docker-jobs.html)). The 
[Rocker organization on Docker Hub](https://hub.docker.com/u/rocker) 
has an excellent selection of containers with many different versions of R. Contact 
us with any questions about this. 

<span name="build"></span>

**1. Adding R Packages**
====================

If your code uses specific R packages (like `dplyr`, `rjags`, etc)
follow the directions below to download and prepare the packages you
need for job submission. **If your job does not require any extra R
packages, skip to parts 2 and 3**.

You are going to start an interactive job that runs on the HTC build
servers and that downloads a copy of R. You will then install your
packages to a folder and zip those files to return to the submit server.

> These instructions are primarily about adding packages to a fresh
> install of R; if you want to add packages to a pre-existing package
> folder, there will be notes below in boxes like this one.

<span name="version"></span>

A. Submit an Interactive Job
----------------------------

Create the following special submit file on the submit server, calling
it something like `build.sub`.

``` {.sub}
# R build file

universe = vanilla
log = interactive.log

# Choose a version of R from the table above
transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/chtc/el8/R###.tar.gz

+IsBuildJob = true
requirements = (OpSysMajorVer =?= 8)
request_cpus = 1
request_memory = 4GB
request_disk = 2GB

queue
```

The only thing you should need to change in the above file is the name
of the `R###.tar.gz` file - in the \"transfer\_input\_files\" line. We
have four versions of R available to build from \-- see the table above.

> If you want to add packages to a pre-existing package directory, add
> the `tar.gz` file with the packages to the `transfer_input_files`
> line:
>
> ``` {.sub}
> transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/chtc/el8/R###.tar.gz, packages.tar.gz
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

**1. Set up R**

Once the interactive build job starts, you should see the R installation
that you specified inside the working directory:

``` 
[alice@build]$ ls -l
-rw-r--r-- 1 alice alice  78M Mar 26 12:24 R###.tar.gz
drwx------ 2 alice alice 4.0K Mar 26 12:24 tmp
drwx------ 3 alice alice 4.0K Mar 26 12:24 var
```
{:.term}

We\'ll now unzip the copy of R and set the `PATH` variable to reference
that version of R:

``` 
[alice@build]$ tar -xzf R###.tar.gz
[alice@build]$ export PATH=$PWD/R/bin:$PATH
[alice@build]$ export RHOME=$PWD/R
```
{:.term}

To make sure that your setup worked, try running:

``` 
[alice@build]$ R --version
```
{:.term}

The output should match the version number that you want to be using!

> If you brought along your own package directory that you previously created by following this tutorial, un-tar it here and
> skip the directory creation step below (i.e. you do not need to run `mkdir packages` because this directory already exists and should have been brought along in your submit file).

**2. Install packages**

First, create, a directory to put your packages into:

``` 
[alice@build]$ mkdir packages
```
{:.term}

Then, tell R to use that directory for the packages you\'re going to
install:

``` 
[alice@build]$ export R_LIBS=$PWD/packages
```
{:.term}

You can choose what name to use for this directory \-- if you have
different sets of packages that you use for different jobs, you could
use a more descriptive name than \"packages\".

Then start the R console:

``` 
[alice@build]$ R
```
{:.term}

In the R terminal, install your packages using `install.packages`.

``` 
> install.packages("package_name")
```
{:.term}

Replace "package_name" with the name of the package you wish to install. 

The first time you will be prompted to choose a \"CRAN mirror\" - this
is where R is downloading the package. Choose any US-based location to download.  

If you need a Bioconductor package you will first need to install the
Bioconductor installation manager, then use Bioconductor to install your
package:

``` 
> if (!requireNamespace("BiocManager", quietly = TRUE))
      install.packages("BiocManager")
> BiocManager::install("package_name") 
```
{:.term}

After you\'ve installed all your packages, we recommend loading each
library to confirm that they installed successfully:

``` 
> library(package_name)
```
{:.term}

Repeat this step as needed to load all packages installed during your
interactive session.

Then exit the R console:

``` 
> quit()
```
{:.term}

C. Finish Up
------------

**1. Create a `tar.gz` file of your packages**

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

**2. Finish the interactive build job**

We now have our packages bundled and ready for CHTC! You can now exit
the interactive job and the tar.gz file with your R packages will return
to the submit server with you.

``` 
[alice@build]$ exit 
```
{:.term}

<span name="script"></span>

**2. Creating a Script**
====================

In order to use CHTC\'s copy of R and the packages you have prepared in
an HTCondor job, we will need to write a script that unpacks both R and
the packages and then runs our R code. We will use this script as as the
`executable` of our HTCondor submit file.

A sample script appears below. After the first line, the lines starting
with hash marks are comments . You should replace \"my\_script.R\" with
the name of the script you would like to run.

``` {.file}
#!/bin/bash

# untar your R installation. Make sure you are using the right version!
tar -xzf R###.tar.gz
# (optional) if you have a set of packages (created in Part 1), untar them also
tar -xzf packages.tar.gz

# make sure the script will use your R installation, 
# and the working directory as its home location
export PATH=$PWD/R/bin:$PATH
export RHOME=$PWD/R
export R_LIBS=$PWD/packages

# run your script
Rscript my_script.R
```

If you have additional commands you would like to be run within the job,
you can add them to this base script. Once your script does what you
would like, give it executable permissions by running:

``` 
[alice@submit] chmod +x run_R.sh
```
{:.term}

> Arguments in R
> --------------
>
> To pass arguments to an R script within a job, you\'ll need to use the
> following syntax in your main executable script, in place of the
> generic command above:
>
> ``` {.file}
> Rscript myscript.R $1 $2
> ```
>
> Here, `$1` and `$2` are the first and second arguments passed to the
> bash script from the submit file (see below), which are then sent on
> to the R script. For more (or fewer) arguments, simply add more (or
> fewer) arguments and numbers.
>
> In addition, your R script will need to be able to accept arguments
> from the command line. There is sample code for doing this on [this
> r-bloggers.com
> page](https://www.r-bloggers.com/passing-arguments-to-an-r-script-from-command-lines/)
> and about a quarter of the way into this [Software Carpentry
> lesson](https://swcarpentry.github.io/r-novice-inflammation/05-cmdline.html)
> (look for `print-args-trailing.R`).

<span name="submit"></span>

**3. Submitting Jobs**
==================

A sample submit file can be found in our [hello
world](helloworld.html) example page. You should make the following
changes in order to run R jobs:

-   Your `executable` should be the script that you wrote
    [above](#script).

    ``` {.sub}
    executable = run_R.sh
    ```

-   Modify the CPU/memory request lines. Test a few jobs for disk
    space/memory usage in order to make sure your requests for a large
    batch are accurate! Disk space and memory usage can be found in the
    log file after the job completes.
-   Change `transfer_input_files` to include:

    ``` {.sub}
    transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/chtc/el8/R###.tar.gz, packages.tar.gz, my_script.R
    ```

-   If your script takes arguments (see the box from the previous
    section), include those in the arguments line:

    ``` {.sub}
    arguments = value1 value2
    ```

<span name="squid"></span>

> ### How big is your package tarball?
>
> If your package tarball is larger than 100 MB, you should NOT transfer
> the tarball using `transfer_input_files`. Instead, you should use
> CHTC\'s web proxy, `squid`. To learn more about `squid` please see our
> user guide [File Availability with Squid Web
> Proxy](file-avail-squid.html). To request
> space on `squid`, email the research computing facilitators at
> <chtc@cs.wisc.edu>.
