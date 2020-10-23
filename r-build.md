---
highlighter: none
layout: default
title: Building R in HTC
---

# Overview

**This guide will provide instructions for compiling base R from source code and is intended 
for compiling versions of R that are currently not provided via the CHTC Squid Web Proxy**

Before compiling R, please take a moment to review our [R Jobs](/r-jobs.shtml) guide to see what versions of R are currently available.

**To best understand the below information, you 
should already have an understanding of how to:**
  * navigate within directories 
  * create/copy/move/delete files and directories 
  * run your intended program 
  * use HTCondor to submit jobs

This guide details the steps needed to: 

 1. [Download R source code](#1-download-r-source-code) 
 2. [Submit an interactive job to a build server](#2-submit-an-interactive-job-to-a-build-server) 
 3. [Compile base R from source code](#3-compile-base-r-from-source-code) 
 4. [Install additional R packages](#4-install-packages) 
 5. [Create a portable copy of your R installation that can be brought along with your jobs](#5-create-a-portable-copy-of-your-r-installation)
 6. [Use your custom R installation in your jobs](#6-use-your-custom-r-installation-in-your-jobs) 

# Compile R

## 1. Download R Source Code

Before running any commands on CHTC, use a browser to get the source code 
for your desired version of R from [CRAN](https://cran.r-project.org) 
Under "Source Code for all Platforms", find the R-#.#.#.tar.gz file for your 
desired version of R and download it to your computer before transferring a copy 
to your `/home` directory on the submit server. 

## 2. Submit An Interactive Job To A Build Server

Creating an R installation can be computationally intensive and should not be 
performed on the submit server. Instead, you will create your installation 
on a CHTC build server by using an interactive job. 

The interactive job is essentially a job without an executable; 
you will be the one running the commands, instead (in this case, to install R).
Like a regular HTCondor job, once you finish your R installation on the build server, 
the output files (your completed portable R installation) will be transferred back to 
the submit server (so that you can use the R installation for later jobs). 

To submit an interactive job, create a submit file called `build.sub` as shown below:

``` {:.sub}
# build.sub
# Software build file

universe = vanilla
log = interactive.log

# change the name of the file to be the name of your source code
transfer_input_files = R-#.#.#.tar.gz

+IsBuildJob = true
requirements = (OpSysMajorVer =?= 7)
request_cpus = 1
request_memory = 4GB
request_disk = 4GB

queue
```

Be sure to modify the above `transfer_input_files` statement with the appropriate 
name of the R source code that you downloaded in the previous ste.

Once this submit file is created, you will start the interactive job by
running the following command:

``` 
[user@submit]$ condor_submit -i build.sub
```
{:.term}

The interactive build job should start in about a minute. Once it has
started, the job has a time limit of four hours.

## 3. Compile Base R From Source Code

Once the interactive job starts, R can be compiled. The general workflow will be 
to first run the R configuration script followed by `make` and `make install`. 

To install R, first create a directory that will hold your R installation (e.g. `R/`) 
, then extract all of the source code files from R-#.#.#.tar.gz and move into the source code directory:

``` 
[user@build]$ mkdir R/
[user@build]$ tar xzf R-#.#.#.tar.gz
[user@build]$ cd R-#.#.#/
```
{:.term}

From the source code directory, run the following commands. **The `make` step may take a while to 
complete!** If building R version 4.x.x or higher you will need to modify the below `configure` 
command to include the flag `--with-pcre1` 
(e.g. `./configure --prefix=$_CONDOR_SCRATCH_DIR/R --with-pcre1`).

```
[user@build]$ ./configure --prefix=$_CONDOR_SCRATCH_DIR/R
[user@build]$ make
[user@build]$ make install
```
{:.term}

Then return the the top level directory:

```
[user@build]$ cd ../
```
{:.term}

If R has been installed successfully, you should be able to run the following command as a test:

```
[user@build]$ R/bin/R --version
```
{:.term}

The output of the above command should match the version number that you just installed!

## 4. Install Packages 

After your R compilation has completed, if any additional R packages are required for your work, 
please follow the steps in our [R Jobs](/r-jobs.shtml) guide 
starting with the `export` commands shown in step 
[1.B.1](/r-jobs.shtml#b.-install-the-packages). After creating a compressed tar 
archive of your `packages` directory return the the next steps in this guide.

## 5. Create A Portable Copy of Your R Installation

Once R has been successfully compiled (and after any packages have been installed), the final step 
is to create a compressed tar archive of your R installation. From the top level directory:

```
[user@build]$ tar czf my_R#.#.#.tar.gz R/
```
{:.term}

**Be sure to check the size of your R tar archive:**
```
[user@build]$ ls -lh my_R#.#.#.tar.gz
```
{:.term}

**If the size of `my_R#.#.#.tar.gz` is larger than ~100MB then your will need to use 
the CHTC Squid Wed Proxy to host this file.** See our 
[Squid Web Proxy](/file-avail-squid.shtml) guide for more details.

Now you have a portable copy of your R installation that can be brought along with your jobs. 
The final step is to terminate your interactive job, and HTCondor will tranfer your R tar archive 
back to your `/home` directory:

```
[user@submit]$ exit
```
{:.term}

Once your interactive job terminates, you will be back in your `/home` directory on the submit 
server and should see a copy of your R tar archive:

```
[user@submit]$ ls
```
{:.term}

## 6. Use Your Custom R Installation In Your Jobs

To use the R installation that was built using the steps in this guide, please follow 
the steps and examples described on our [R Jobs](/r-jobs.shtml) guide, **however 
you will need to modify `transfer_input_files` in your submit file to specify your `R#.#.#.tar.gz` 
tar archive instead of transferring a copy of R from the Squid web proxy.**
