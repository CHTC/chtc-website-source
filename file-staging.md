---
highlighter: none
layout: default
# layout: file_avail
title: Managing Large Data in HTC Jobs
---

When submitting jobs to CHTC's High Throughput Computing (HTC) system, 
there is a distinct location for staging data that is too large to be 
handled at scale via the default HTCondor file transfer mechanism. This 
location should be used for jobs that require input files larger than 100MB
and/or that generate output files larger than 3-4GB. 

Contents
--------

1.  [Policies and Intended Use](#1-policies-and-intended-use)
2.  [Practices for Files within Gluster](#staging)
3.  [Using Gluster-staged Files and Software for Jobs](#input)
	- Input
	- Output
5.  [Submit Jobs Using Staged Data](#4-submit-jobs-using-staged-data)
6.  [Removing files from Gluster after jobs complete](#after)
7.  [Checking your Quota, Data Use, and File Counts in Glusters](#check)

1. Policies and Intended Use:
-----------------------------

Intended Use:

Our large data staging location is only for input and output files that 
are individually too large to be managed by our other data movement 
methods: HTCondor file transfer or SQUID. 

Access to Gluster:

is granted upon request to chtc@cs.wisc.edu and consultation with a
Research Computing Facilitator.

Limitations:

-   **Access outside of CHTC?** Staged large data will 
be available only within the the CHTC pool, on a subset of our total 
capacity. 
-   **Not all files ...** Gluster should ONLY be used for individual
    data and software files that are larger than the values in the
    table, above. Files placed in /staging should NEVER be listed in
    the submit file (for example, as the "executable", "output",
    "error", or "log" files, or for files listed in
    "transfer\_input\_files"). Only files in the user's home directory
    should ever be listed in these lines of the submit file.
-   **Capacity** Each user is allowed a certain amount of space in
    Gluster, though we can increase this space for special requests to
    chtc@cs.wisc.edu

Data Security:

Files placed in Gluster are owned by the user, and only the user's own
jobs can access these files (unless the user specifically modifies unix
file permissions to make certain files available for other users).

Data Cleanup:

As for all CHTC file space, data should be removed from /staging AS
SOON AS IT IS NO LONGER NEEDED FOR ACTIVELY-RUNNING JOBS. Even if it
will be used it the future, it should be deleted from Gluster and copied
back at a later date.

Allowed Data Amounts:

As of July 25, 2017, initial quotas of 10GB of 100 files have been
implemented for every folder within Gluster. Request to chtc@cs.wisc.edu
and consultation with an RCF will be necessary for increasing this
quota.

KEEP COPIES:

of ANY and ALL data or software in Gluster in another, non-CHTC
location. The HTC Gluster is not backed up and is prone to data loss
over time. CHTC staff reserve the right to remove any data from the HTC
Gluser (or any CHTC file system) at any time.\
\

**USERS VIOLATING ANY OF THE POLICIES (also below) IN THIS GUIDE WILL
HAVE THEIR GLUSTER ACCESS AND/OR CHTC ACCOUNT REVOKED UNTIL CORRECTIVE
MEASURES ARE TAKEN. CHTC STAFF RESERVE THE RIGHT TO REMOVE ANY
PROBLEMATIC USER DATA AT ANY TIME IN ORDER TO PRESERVE PERFORMANCE.**

**The examples and information in the below guide are useful ONLY if:**\

-   you already have an account on a CHTC-administered submit server
-   you already have a user directory in the HTC Gluster system, after
    requesting it via email discussion to chtc@cs.wisc.edu

**To best understand the below information, users should already be
familiar with:**\

1.  Using the command-line to: navigate directories,
    create/edit/copy/move/delete files and directories, and run intended
    programs (aka "executables").
2.  CHTC's [Intro to Running HTCondor Jobs](/helloworld.shtml)
3.  CHTC's guide for [Typical File Transfer](/file-availability.shtml)

# 2. Staging Data:

Data placed in our large data `/staging` location 
should be stored in as few files as possible (ideally,
one file per job), and will be used by a job only after being copied
from /staging into the job working directory (see \#3, below).
Similarly, large output requiring Gluster should first be written to the
job working directory then compressed in to a single file before being
copied to /staging at the end of the job (see \#4, below).\
\
 To prepare job-specific data that is large enough to require Gluster
and exists as multiple files or directories (or a directory of multiple
files), first create a compressed tar package before placing the file in
/staging (either before submitting jobs, or within jobs before
moving output to /staging). For example:

``` {.term}
$ tar -czvf job_package.tar.gz file_or_dir 
```

Movement of data into/out of /staging before and after jobs should
only be performed via CHTC's transfer server, as below, and **not via a
CHTC submit server.** After obtaining a user directory within
`/staging` and an account on the transfer server, copy relevant
files directly into this user directory from your own computer:

Example `scp` command on your own Linux or Mac computer:

``` {.term}
$ scp large.file username@transfer.chtc.wisc.edu:/staging/username/ 
```

If using a Windows computer:

Using a file transfer application, like WinSCP, directly drag the large
file from its location on your computer to a location within
`/staging/username/` on transfer.chtc.wisc.edu.


# 2. Using Staged Files in a Job

As shown above, the staging directory for large data is `/staging/username`. 
All interaction with files in this location should occur within your job's 
main executable.

## A. Accessing Large Input Files

Add commands to your job executable to copy input 
from `/staging` into the working directory of the job, and
use it from the working directory, being careful to remove the coiped 
files from the working
directory before the completion of the job (so that they're not copied
back to the submit server as perceived output). An example is below:

```
#!/bin/bash
#
# First, copy the compressed tar file from /staging into the working directory,
#  and un-tar it to reveal your large input file(s) or directories:
cp /staging/username/large_input.tar.gz ./
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
{: .file}


## B. Moving Large Output Files

If your jobs write any data directly to Gluster from within a job, your
jobs will run slower AND will cause Gluster to be slower for other
users. Instead, have your executable write the file to a location within
the working directory, and then make sure to move this large file to
Gluster (or copy to Gluster, and then remove from the working
directory), so that it's not transferred back to the home directory, as
all other "new" files in the working directory will be.

Example, if executable is a shell script:

``` {.file}
#!/bin/bash
# 
# Command to save output to the working directory:
./myprogram myinput.txt output_dir/
#
# Tar and copy output to Gluster, then delete from the job working directory:
tar -czvf large_output.tar.gz output_dir/ other_large_files.txt
mv large_output.tar.gz /staging/username/
rm other_large_files.txt
#
# END
```


In some instances, your software may produce very large standard output
(what would typically be output to the command screen, if you ran the
command for yourself, instead of having HTCondor do it). Because such
standard output from your software will usually be captured by HTCondor
in the submit file "output" file, this "output" file WILL still be
transferred by HTCondor back to your home directory on the submit
server, which may be very bad for you and others, if that captured
standard output is very large.

In these cases, it is useful to redirect the standard output of commands
in your executable to a file in the working directory, and then move it
into Gluster at the end of the job.

Example, if "`myprogram`" produces very large standard output, and is
run from a script (bash) executable:

``` {.file}
#!/bin/bash
#
# script to run myprogram,
# 
# redirecting large standard output to a file in the working directory:
./myprogram myinput.txt myoutput.txt > large_std.out
# 
# tar and move large files to Gluster so they're not copied to the submit server:
tar -czvf large_stdout.tar.gz large_std.out
cp large_stdout.tar.gz /staging/username/subdirectory
rm large_std.out large_stdout.tar.gz
# END
```

# 4. Submit Jobs Using Staged Data

In order to properly submit jobs using Gluster, always do the following:

-   ONLY submit Gluster-dependent jobs from within your home directory
    (`/home/username`), and NEVER from within `/staging`.
-   Do NOT list any `/staging` files in any of the submit file
    lines, including:
    `executable, log, output, error, transfer_input_files`. Rather, your
    job's ENTIRE interaction with files in `/staging` needs to occur
    WITHIN each job's executable, when it runs within the job.
-   Request an adequate amount of disk space with "`request_disk`", to
    include the total amount of input data that each job will copy into
    the job working directory from /staging, and any output that
    will be created in the job working directory.
-   Make sure to use a submit file "Requirements" line so that your jobs
    only run on execute servers that have access to Gluster.

See the below submit file, as an example, which would be submitted from
within the user's home directory:

``` {.sub}
### Example submit file for a single job that stages large data
# Files for the below lines MUST all be somewhere within /home/username,
# and not within /staging/username

executable = run_myprogram.sh
log = myprogram.log
output = $(Cluster).out
error = $(Cluster).err

transfer_input_files = myprogram

# IMPORTANT! Require execute servers that have Gluster:
Requirements = (Target.HasCHTCStaging == true)

# Make sure to still include lines like "request_memory", "request_disk", "request_cpus", etc. 

queue
```

# 6. Removing files from Gluster after jobs complete

Similar to the procedures from transferring files into Gluster, you can
directly copy files out of Gluster using command-line `scp` or
file-transfer applications like WinSCP.

# 7. Checking your Quota, Data Use, and File Counts in Gluster

To check your total data usage and quota, run `df -h` for your Gluster
directory. Example:

    $ df -h /staging/alice

To check data usage and file counts, run `ncdu` from within the
directory you'd like to query. Example:

    $ cd /staging/alice
    $ ncdu

When `ncdu` has finished running, the output will give you a total file
count and allow you to navigate between subdirectories for even more
details. Type `q` when you're ready to exit the output viewer. More info
here: <https://lintut.com/ncdu-check-disk-usage/>

