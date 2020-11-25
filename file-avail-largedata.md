---
highlighter: none
#layout: default
layout: file_avail
title: Managing Large Data in HTC Jobs
---

When submitting jobs to CHTC's High Throughput Computing (HTC) system, 
there is a distinct location for staging data that is too large to be 
handled at scale via the default HTCondor file transfer mechanism. This 
location should be used for jobs that require input files larger than 100MB
and/or that generate output files larger than 3-4GB. 

**To best understand the below information, users should already be
familiar with:**

- Using the command-line to: navigate directories,
  create/edit/copy/move/delete files and directories, and run intended
  programs (aka "executables").
- CHTC's [Intro to Running HTCondor Jobs](/helloworld.shtml)
- CHTC's guide for [Typical File Transfer](/file-availability.shtml)

# Contents

[Policies and Intended Use](#policies-and-intended-use)
[Staging Large Data](#staging-large-data)
[Using Staged Files in a Job](#using-staged-files-in-a-job)
&nbsp;&nbsp;&nbsp;&nbsp;[Accessing Large Input Files](#accessing-large-input-files)
&nbsp;&nbsp;&nbsp;&nbsp;[Moving Large Output Files](#moving-large-output-files)
[Submit Jobs Using Staged Data](#submit-jobs-using-staged-data)
[Checking your Quota, Data Use, and File Counts](#checking-your-quota-data-use-and-file-counts)

# Policies and Intended Use

**USERS VIOLATING ANY OF THE POLICIES IN THIS GUIDE WILL
HAVE THEIR DATA STAGING ACCESS AND/OR CHTC ACCOUNT REVOKED UNTIL CORRECTIVE
MEASURES ARE TAKEN. CHTC STAFF RESERVE THE RIGHT TO REMOVE ANY
PROBLEMATIC USER DATA AT ANY TIME IN ORDER TO PRESERVE PERFORMANCE.**

## Intended Use

`/staging` is a location specifically for hosting your large input (>100MB) 
and/or large ouput (>4GB) files or when jobs need >500MB of cumulative input. 
Job input and outupt of these sizes are too large to be 
managed by our other data movement methods. 

**Users are expected to abide by this intended use expectation and follow the 
instructions for using `/staging` written in this guide.** Files placed 
in `/staging` should **NEVER** be listed in the submit file, but rather accessed 
via the job's executable (aka .sh) script. See --- for more details.

<p style="background-color:yellow;"> Jobs must <b>NEVER</b> be submitted from 
<code>/staging</code>. All HTCondor job submissions must be performed from your 
<code>/home</code> directory on the submit server.</p>

Files hosted in `/staging` are only excessible to jobs running in the CHTC pool. 
About 50% of CHTC execute servers have access to `/staging`. Users will get 
better job throughput if they are able to break up their work into smaller jobs 
that each use or produce smaller input and output files.

## Access to `staging`

Access to `/staging` is provided only if your work requires the use of large 
input and/or output files. **Default CHTC account creation does not include 
access to `/staging`.** If you think you need access to `/staging`, or would 
like to know more about managing your data needs, please [contact us]<mailto:chtc@cs.wisc.edu>.

## Data Management and Quota Control

- **As with all CHTC file spaces, CHTC does not back up your files in 
`/staging`.**

- **Transfer Server**: We expect that users will only use our dedicated 
transfer server, transfer.chtc.wisc.edu, instead of the submit server,
to upload and download their large files to and from `/staging`. Transferring 
large files with the submit server can use a lot of network bandwidth and potentially 
disrupt job submission for all users.

- `/staging` directories include a disk space and items (i.e. directories and files) 
quota. Quotas are necessary for maintaning the stability and reliability of 
`/staging`. Quota changes can be requested by emailing <chtc@cs.wisc.edu> and 
users can monitor quota settings and usage as described [below]<TBD>

- **Reduce file size and count**: We expect that users will use tar and 
compression to reduce data size and file counts such that a single tarball 
is needed and/or produced per job.

- **Shared large data**: `/staging` directories are owned by the user, 
and only the user's own jobs can access these files. We can created shared group 
`/staging` directories for sharing large input and output files as needed. 
[Contact us]<mailto:chtc@cs.wisc.edu> to learn more.

- **Remove data**: We expect that users remove data from `/staging` AS
SOON AS IT IS NO LONGER NEEDED FOR ACTIVELY-RUNNING JOBS. 

- CHTC staff reserve the right to remove data from our large data staging 
location (or any CHTC file system) at any time.

# Getting Started With `/staging`

In order to stage large data for use on CHTC's HTC system: 

- **Request a directory**: Large data staging is available by request.
- **Reduce file counts**: Combine and compress files that are used together.
- **Use the transfer server**: Upload your data via our dedicated file transfer server.
- **Remove files after jobs complete**: our data staging space is quota controlled and not backed up. 

## Request A `/staging` Directory

Space in our large data staging area is granted by request. If you think you need 
a directory, email CHTC's Research Computing Facilitators (chtc@cs.wisc.edu). 

The created directory will exist at this path: 

Individual directories will be created at `/staging/username`.
Group directories will be created at `/staging/groups/group_name`.

## Reduce File Size and Counts

Data placed in `/staging` should be stored in as few files as 
possible. `tar` and file compression should always be used when possible to 
reduce your large file size and file counts. Ideally your jobs should 
use a single "tarball" for large input and/or produce a single "tarball" 
for large output.

Large output should *FIRST* be written to the
job's working directory. Compressed output can then be written to 
your `/staging` directory.

To prepare job-specific data that is large enough to pre-staging
and exists as multiple files or directories (or a directory of multiple
files), first create a compressed tar package before placing the file in
`/staging` (either before submitting jobs, or within jobs before
moving output to /staging). For example:

```
$ tar -czvf job_package.tar.gz file_or_dir 
```
{: .term}

## Upload and Download Data via Transfer Server

Movement of data into/out of `/staging` before and after jobs should
only be performed via CHTC's transfer server, as below, and **not via a
CHTC submit server.** After obtaining a user directory within
`/staging` and an account on the transfer server, copy relevant
files directly into this user directory from your own computer:

- Example `scp` command on your own Linux or Mac computer:
```
$ scp large.file username@transfer.chtc.wisc.edu:/staging/username/ 
```
{.term}

- If using a Windows computer:
	- Using a file transfer application, like WinSCP, directly drag the large
file from its location on your computer to a location within
`/staging/username/` on transfer.chtc.wisc.edu.

## D. Remove Files After Jobs Complete

As with all CHTC file spaces, data should be removed from `/staging` AS
SOON AS IT IS NO LONGER NEEDED FOR ACTIVELY-RUNNING JOBS. Even if it
will be used it the future, it should be deleted from and copied
back at a later date. Files can be taken off of `/staging` using similar 
mechanisms as uploaded files (as above). 

# 3. Using Staged Files in a Job

As shown above, the staging directory for large data is `/staging/username`. 
All interaction with files in this location should occur within your job's 
main executable.

## A. Accessing Large Input Files

To use large data placed in the `/staging` location, add commands to your 
job executable that copy input 
from `/staging` into the working directory of the job. Program should then use 
files from the working directory, being careful to remove the coiped 
files from the working
directory before the completion of the job (so that they're not copied
back to the submit server as perceived output). 

Example, if executable is a shell script:

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

If jobs produce large (more than 3-4GB) output files, have 
your executable write the output file(s) to a location within
the working directory, and then make sure to move this large file to
the `/staging` folder, so that it's not transferred back to the home directory, as
all other "new" files in the working directory will be.

Example, if executable is a shell script:

```
#!/bin/bash
# 
# Command to save output to the working directory:
./myprogram myinput.txt output_dir/
#
# Tar and mv output to staging, then delete from the job working directory:
tar -czvf large_output.tar.gz output_dir/ other_large_files.txt
mv large_output.tar.gz /staging/username/
rm other_large_files.txt
#
# END
```
{: .file}

## C. Handling Standard Output (if needed)

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
into `/staging` at the end of the job.

Example, if "`myprogram`" produces very large standard output, and is
run from a script (bash) executable:

```
#!/bin/bash
#
# script to run myprogram,
# 
# redirecting large standard output to a file in the working directory:
./myprogram myinput.txt myoutput.txt > large_std.out
# 
# tar and move large files to staging so they're not copied to the submit server:
tar -czvf large_stdout.tar.gz large_std.out
cp large_stdout.tar.gz /staging/username/subdirectory
rm large_std.out large_stdout.tar.gz
# END
```
{: .file}

# 4. Submit Jobs Using Staged Data

In order to properly submit jobs using staged large data, always do the following:

- **Submit from `/home`**: ONLY submit jobs from within your home directory
    (`/home/username`), and NEVER from within `/staging`.

In your submit file: 

- **No large data in the submit file**:  Do NOT list any `/staging` files in any of the submit file
    lines, including: `executable, log, output, error, transfer_input_files`. Rather, your
    job's ENTIRE interaction with files in `/staging` needs to occur
    WITHIN each job's executable, when it runs within the job (as shown [above](#3-using-staged-files-in-a-job))
- **Request sufficient disk space**: Using `request_disk`, request an amount of disk 
space that reflects the total of a) input data that each job will copy into
    the job working directory from `/staging,` and b) any output that
    will be created in the job working directory.
- **Require access to `/staging`**: Include the CHTC specific attribute that requires 
servers with access to `/staging`

See the below submit file, as an example, which would be submitted from
within the user's `/home` directory:

``` {.sub}
### Example submit file for a single job that stages large data
# Files for the below lines MUST all be somewhere within /home/username,
# and not within /staging/username

executable = run_myprogram.sh
log = myprogram.log
output = $(Cluster).out
error = $(Cluster).err

## Do NOT list the large data files here
transfer_input_files = myprogram

# IMPORTANT! Require execute servers that can access /staging
Requirements = (Target.HasCHTCStaging == true)

# Make sure to still include lines like "request_memory", "request_disk", "request_cpus", etc. 

queue
```

# 5. Checking your Quota, Data Use, and File Counts

You can use the command `get_quotas` to see what disk 
and items quotas are currently set for a given directory path. 
This command will also let you see how much disk is in use and how many 
items are present in a directory:

```
[username@transfer ~]$ get_quotas /staging/username
```
{:.term}

Alternatively, the `ncdu` command can also be used to see how many 
files and directories are contained in a given path:

``` 
[username@transfer ~]$ ncdu /staging/username
```
{:.term}

When `ncdu` has finished running, the output will give you a total file
count and allow you to navigate between subdirectories for even more
details. Type `q` when you\'re ready to exit the output viewer. More
info here: <https://lintut.com/ncdu-check-disk-usage/>
