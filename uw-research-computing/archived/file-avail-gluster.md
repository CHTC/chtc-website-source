---
highlighter: none
layout: file_avail
title: Using Gluster for Large Data and Software
published: false
---

> NOTE: GLUSTER HAS BEEN REPLACED BY A NEW LARGE DATA STAGING SYSTEM, DESCRIBED [HERE](file-avail-largedata.html).
> ==================================================================================================================
>
> \
> **Important Dates**
>
> -   March 4 - Applications open for space on the new large data
>     system.
> -   April 1 - Jobs that require Gluster will no longer run.
> -   April 15 - Gluster file share is removed and all files in Gluster
>     are deleted.
>
> For more information, see recent entries on the [CHTC User News
> page](user-news.html).\
> \
> This page will be archived once the transition to the new system is
> complete on April 15, 2020.

CHTC maintains a Gluster file share, which should only be used for files
or software that are too large for HTCondor file transfer or SQUID. The
below guide discusses how to use CHTC\'s Gluster option for jobs that
use or produce very large files.

Contents
--------

1.  [Policies and Intended Use](#policy)
2.  [Practices for Files within Gluster](#staging)
3.  [Submit File Implications](#submit)
4.  [Using Gluster-staged Files and Software for Jobs](#input)
    -   [Copy files from Gluster into the working directory, from within
        the jobs](#copy)
    -   [Software that is too large for or doesn\'t work with file
        transfer](#large)
5.  [Copying large output files to Gluster from within a job](#within)
    -   [Write output files to the working directory, then move these to
        Gluster](#working)
    -   [ALSO consider: Large standard output (\"screen output\")
        produced by your jobs](#also)
6.  [Removing files from Gluster after jobs complete](#after)
7.  [Checking your Quota, Data Use, and File Counts in Glusters](#check)

<a name="policy"></a>

**1. Policies and Intended Use:**
-----------------------------

* Intended Use:  
Gluster is a staging area for input files, output files, and software
that are individually too large for file transfer or SQUID. Files and
software within Gluster will be available only to jobs running in the
CHTC Pool, and only a portion of the pool.

* Access to Gluster:  
is granted upon request to [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu)  and consultation with a
Research Computing Facilitator.

* Limitations:  
    -   **Access outside of CHTC?** Jobs relying on Gluster will only run in
        CHTC\'s HTCondor Pool, and data in Gluster is not accessible to
        HTCondor jobs running outside of this pool.
    -   **Not all files \...** Gluster should ONLY be used for individual
        data and software files that are larger than the values in the
        table, above. Files placed in /mnt/gluster should NEVER be listed in
        the submit file (for example, as the \"executable\", \"output\",
        \"error\", or \"log\" files, or for files listed in
        \"transfer\_input\_files\"). Only files in the user\'s home
        directory should ever be listed in these lines of the submit file.
    -   **Capacity** Each user is allowed a certain amount of space in
        Gluster, though we can increase this space for special requests to
        [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) 
<br>
* Data Security:  
Files placed in Gluster are owned by the user, and only the user\'s own
jobs can access these files (unless the user specifically modifies unix
file permissions to make certain files available for other users).

* Data Cleanup:  
As for all CHTC file space, data should be removed from /mnt/gluster AS
SOON AS IT IS NO LONGER NEEDED FOR ACTIVELY-RUNNING JOBS. Even if it
will be used it the future, it should be deleted from Gluster and copied
back at a later date.

* Allowed Data Amounts:  
As of July 25, 2017, initial quotas of 10GB of 100 files have been
implemented for every folder within Gluster. Request to
[chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu)  and consultation with an RCF will be necessary for
increasing this quota.

* KEEP COPIES:  
of ANY and ALL data or software in Gluster in another, non-CHTC
location. The HTC Gluster is not backed up and is prone to data loss
over time. CHTC staff reserve the right to remove any data from the HTC
Gluser (or any CHTC file system) at any time.

**USERS VIOLATING ANY OF THE POLICIES (also below) IN THIS GUIDE WILL
HAVE THEIR GLUSTER ACCESS AND/OR CHTC ACCOUNT REVOKED UNTIL CORRECTIVE
MEASURES ARE TAKEN. CHTC STAFF RESERVE THE RIGHT TO REMOVE ANY
PROBLEMATIC USER DATA AT ANY TIME IN ORDER TO PRESERVE PERFORMANCE.**

**The examples and information in the below guide are useful ONLY if:**

-   you already have an account on a CHTC-administered submit server
-   you already have a user directory in the HTC Gluster system, after
    requesting it via email discussion to [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) 

**To best understand the below information, users should already be
familiar with:**

1.  Using the command-line to: navigate directories,
    create/edit/copy/move/delete files and directories, and run intended
    programs (aka \"executables\").
2.  CHTC\'s [Intro to Running HTCondor Jobs](helloworld.html)
3.  CHTC\'s guide for [Typical File Transfer](file-availability.html)

<a name="staging"></a>

**2. Practices for Files within Gluster:**
======================================

Data in Gluster should be stored in as few files as possible (ideally,
one file per job), and will be used by a job only after being copied
from /mnt/gluster into the job working directory (see \#3, below).
Similarly, large output requiring Gluster should first be written to the
job working directory then compressed in to a single file before being
copied to /mnt/gluster at the end of the job (see \#4, below).\
\
To prepare job-specific data that is large enough to require Gluster and
exists as multiple files or directories (or a directory of multiple
files), first create a compressed tar package before placing the file in
/mnt/gluster (either before submitting jobs, or within jobs before
moving output to /mnt/gluster). For example:

``` 
$ tar -czvf job_package.tar.gz file_or_dir 
```
{:.term}

Movement of data into/out of /mnt/gluster before and after jobs should
only be performed via CHTC\'s transfer server, as below, and **not via a
CHTC submit server.** After obtaining a user directory within
`/mnt/gluster` and an account on the transfer server, copy relevant
files directly into this user directory from your own computer:

Example `scp` command on your own Linux or Mac computer:

``` 
$ scp large.file username@transfer.chtc.wisc.edu:/mnt/gluster/username/ 
```
{:.term}

If using a Windows computer:

Using a file transfer application, like WinSCP, directly drag the large
file from its location on your computer to a location within
`/mnt/gluster/username/` on transfer.chtc.wisc.edu.


<a name="submit"></a>

**3. Submit File Implications**
===========================

In order to properly submit jobs using Gluster, always do the following:

-   ONLY submit Gluster-dependent jobs from within your home directory
    (`/home/username`), and NEVER from within `/mnt/gluster`.
-   Do NOT list any `/mnt/gluster` files in any of the submit file
    lines, including:
    `executable, log, output, error, transfer_input_files`. Rather, your
    job\'s ENTIRE interaction with files in `/mnt/gluster` needs to
    occur WITHIN each job\'s executable, when it runs within the job.
-   Request an adequate amount of disk space with \"`request_disk`\", to
    include the total amount of input data that each job will copy into
    the job working directory from /mnt/gluster, and any output that
    will be created in the job working directory.
-   Make sure to use a submit file \"Requirements\" line so that your
    jobs only run on execute servers that have access to Gluster.

See the below submit file, as an example, which would be submitted from
within the user\'s home directory:

``` {.sub}
### Example submit file for a single Gluster-dependent job
# Files for the below lines MUST all be somewhere within /home/username,
# and not within /mnt/gluster/username

log = myprogram.log
executable = run_myprogram.sh
output = $(Cluster).out
error = $(Cluster).err
transfer_input_files = myprogram

# IMPORTANT! Require execute servers that have Gluster:
Requirements = (Target.HasGluster == true)

# Make sure to still include lines like "request_memory", "request_disk", "request_cpus", etc. 

queue
```

<a name="input"></a>

**4. Using Gluster-staged Files and Software for Jobs**
===================================================

As stated in [\#2](#submit), all interaction with files and software in
`/mnt/gluster` should occur within your job\'s main executable, when it
runs. Therefore, there are two options for jobs depending on on
Gluster-staged software (larger than a few GB) and input (larger than
100 MB per file).

<a name="copy"></a>

A. Copy files from Gluster into the working directory, from within the job
--------------------------------------------------------------------------

The recommended method is to have your job executable copy input or
software from /mnt/gluster into the working directory of the job, and
use it from there, being careful to remove such files from the working
directory before the completion of the job (so that they\'re not copied
back to the submit server as perceived output). An example is below:

``` 
#!/bin/bash
#
# First, copy the compressed tar file from /mnt/gluster into the working directory,
#  and un-tar it to reveal your large input file(s) or directories:
cp /mnt/gluster/username/large_input.tar.gz ./
tar -xzvf large_input.tar.gz
#
# Command for myprogram, which will use files from the working directory
./myprogram large_input.txt myoutput.txt
#
# Before the script exits, make sure to remove the file(s) from the working directory
rm large_input.tar.gz large_input.txt
#
# END
```
{:.file}

<a name="large"></a>

B. Software that is too large for or doesn\'t work with file transfer
---------------------------------------------------------------------

If your software will ONLY work if it remains in the same location where
it was first installedi, and there are barriers to installing it within
the working directory of every job (install-on-the-fly), please contact
us for assistance. DO NOT PLACE SOFTWARE IN GLUSTER WITHOUT PERMISSION
AND INPUT FROM CHTC STAFF: [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu)

<a name="within"></a>

**5. Copying large output files to Gluster from within a job**
==========================================================

As stated in [\#2](#submit), all interaction with files in
`/mnt/gluster` should occur within your designated \"executable\", when
it runs. Therefore, there are two options for having steps within your
executable write files to Gluster, as well as a consideration for large
standard output.


<a name="working"></a>

A. Write output files to the working directory, then move these to Gluster
--------------------------------------------------------------------------

If your jobs write any data directly to Gluster from within a job, your
jobs will run slower AND will cause Gluster to be slower for other
users. Instead, have your executable write the file to a location within
the working directory, and then make sure to move this large file to
Gluster (or copy to Gluster, and then remove from the working
directory), so that it\'s not transferred back to the home directory, as
all other \"new\" files in the working directory will be.

Example, if executable is a shell script:

``` 
#!/bin/bash
# 
# Command to save output to the working directory:
./myprogram myinput.txt large_output.txt
#
# Tar and copy output to Gluster, then delete from the job working directory:
tar -czvf large_output.tar.gz large_output.txt other_large_files_or_dirs
mv large_output.tar.gz /mnt/gluster/username/subdirectory
rm large_output.txt
#
# END
```
{:.file}


<a name="also"></a>

B. ALSO consider: Large standard output (\"screen output\") produced by your jobs
---------------------------------------------------------------------------------

In some instances, your software may produce very large standard output
(what would typically be output to the command screen, if you ran the
command for yourself, instead of having HTCondor do it). Because such
standard output from your software will usually be captured by HTCondor
in the submit file \"output\" file, this \"output\" file WILL still be
transferred by HTCondor back to your home directory on the submit
server, which may be very bad for you and others, if that captured
standard output is very large.

In these cases, it is useful to redirect the standard output of commands
in your executable to a file in the working directory, and then move it
into Gluster at the end of the job.

Example, if \"`myprogram`\" produces very large standard output, and is
run from a script (bash) executable:

```
#!/bin/bash
#
# script to run myprogram,
# 
# redirecting large standard output to a file in the working directory:
./myprogram myinput.txt myoutput.txt > large_std.out
# 
# tar and move large files to Gluster so they're not copied to the submit server:
tar -czvf large_stdout.tar.gz large_std.out
cp large_stdout.tar.gz /mnt/gluster/username/subdirectory
rm large_std.out large_stdout.tar.gz
# END
```
{:.file}


<a name="after"></a>

**6. Removing files from Gluster after jobs complete**
==================================================

Similar to the procedures from transferring files into Gluster, you can
directly copy files out of Gluster using command-line `scp` or
file-transfer applications like WinSCP.


<a name="check"></a>

**7. Checking your Quota, Data Use, and File Counts in Gluster**
============================================================

To check your total data usage and quota, run `df -h` for your Gluster
directory. Example:

    $ df -h /mnt/gluster/alice

To check data usage and file counts, run `ncdu` from within the
directory you\'d like to query. Example:

    $ cd /mnt/gluster/alice
    $ ncdu

When `ncdu` has finished running, the output will give you a total file
count and allow you to navigate between subdirectories for even more
details. Type `q` when you\'re ready to exit the output viewer. More
info here: <https://lintut.com/ncdu-check-disk-usage/>
