---
highlighter: none
layout: file_avail
title: Managing Large Data in HTC Jobs
alt_title: Use Large Input and Output Files Via Staging
guide:
    order: 2
    category: Handling Data in Jobs
    tag:
        - htc
---

When submitting jobs to CHTC's High Throughput Computing (HTC) system, 
there is a distinct location for staging data that is too large to be 
handled at scale via the default <a href="http://htcondor.org">HTCondor</a> file transfer mechanism. This 
location should be used for jobs that require input files larger than 100MB
and/or that generate output files larger than 3-4GB. 

**To best understand the below information, users should already be
familiar with:**

1.  Using the command-line to: navigate directories,
    create/edit/copy/move/delete files and directories, and run intended
    programs (aka "executables").
2.  CHTC's [Intro to Running HTCondor Jobs](htcondor-job-submission)
3.  CHTC's guide for [Typical File Transfer](htc-job-file-transfer)

{% capture content %}
- [1. Policies and Intended Use](#1-policies-and-intended-use)
   * [A. Intended Use](#a-intended-use)
   * [B. Access to Large Data Staging](#b-access-to-large-data-staging)
   * [C. User Data Management Responsibilities](#c-user-data-management-responsibilities)
   * [D. Data Access Within Jobs](#d-data-access-within-jobs)
- [2. Staging Large Data](#2-staging-large-data)
   * [A. Get a Directory](#a-get-a-directory)
   * [B. Reduce File Counts](#b-reduce-file-counts)
   * [C. Use the Transfer Server](#c-use-the-transfer-server)
   * [D. Remove Files After Jobs Complete](#d-remove-files-after-jobs-complete)
- [3. Using Staged Files in a Job](#3-using-staged-files-in-a-job)
   * [A. Transferring Large Input Files](#a-transferring-large-input-files)
   * [B. Transferring Large Output Files](#b-transferring-large-output-files)
- [4. Submit Jobs Using Staged Data](#4-submit-jobs-using-staged-data)
- [5. Related Pages](#5-related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

# 1. Policies and Intended Use

> **USERS VIOLATING ANY OF THE POLICIES IN THIS GUIDE WILL
> HAVE THEIR DATA STAGING ACCESS AND/OR CHTC ACCOUNT REVOKED UNTIL CORRECTIVE
> MEASURES ARE TAKEN. CHTC STAFF RESERVE THE RIGHT TO REMOVE ANY
> PROBLEMATIC USER DATA AT ANY TIME IN ORDER TO PRESERVE PERFORMANCE.**


## A. Intended Use

Our large data staging location is only for input and output files that 
are individually too large to be managed by our other data movement 
methods, <a href="https://htcondor.org">HTCondor</a> file transfer. This includes individual input files 
greater than 100MB and individual output files greater than 3-4GB. 

Users are expected to abide by this intended use expectation and follow the 
instructions for using `/staging` written in this guide.

## B. Access to Large Data Staging

Any one with a CHTC account whose data meets the intended use above can request 
space in our large data staging area. A Research Computing Facilitator will 
review the request and follow up. If appropriate, access will be granted via 
a directory in the system and a quota. Quotas are based on individual user needs; 
if a larger quota is needed, see our [Request a Quota Change](quota-request) guide. 

We can also create group or shared spaces by request. 

## C. User Data Management Responsibilities

As with all CHTC file spaces: 

- **Keep copies**: Our large data staging area is not backed up and has the 
possibility of data loss; keep copies of ANY and ALL data in `/staging` in another, non-CHTC
location. 
- **Remove data**: We expect that users remove data from `/staging` AS
SOON AS IT IS NO LONGER NEEDED FOR ACTIVELY-RUNNING JOBS. 
- **Monitor usage and quota**: Each `/staging` folder has both a size and "items" quota. Quota changes 
can be requested as described in our [Request a Quota Change](quota-request) guide. 

CHTC staff reserve the right to remove data from our large data staging 
location (or any CHTC file system) at any time.

## D. Data Access Within Jobs

Staged large data will 
be available only within the the CHTC pool, on a subset of our total 
capacity. 

Staged data are owned by the user and only the user's own
jobs can access these files (unless the user specifically modifies unix
file permissions to make certain files available for other users).


# 2. Staging Large Data

In order to stage large data for use on CHTC's HTC system: 

- **Get a directory**: Large data staging is available by request.
- **Reduce file counts**: Combine and compress files that are used together.
- **Use the transfer server**: Upload your data via our dedicated file transfer server.
- **Remove files after jobs complete**: our data staging space is quota controlled and not backed up. 

## A. Get a Directory

Space in our large data staging area is granted by request. If you think you need 
a directory, email CHTC's Research Computing Facilitators (chtc@cs.wisc.edu). 

The created directory will exist at this path: `/staging/username`

## B. Reduce File Counts

Data placed in our large data `/staging` location 
should be stored in as few files as possible (ideally,
one file per job), and will be used by a job only after being copied
from `/staging` into the job working directory (see [below](#3-using-staged-files-in-a-job)).
Similarly, large output should first be written to the
job working directory then compressed in to a single file before being
copied to `/staging` at the end of the job. 

To prepare job-specific data that is large enough to pre-staging
and exists as multiple files or directories (or a directory of multiple
files), first create a compressed tar package before placing the file in
`/staging` (either before submitting jobs, or within jobs before
moving output to /staging). For example:

```
$ tar -czvf job_package.tar.gz file_or_dir 
```
{: .term}

## C. Use the Transfer Server

Movement of data into/out of `/staging` before and after jobs should
only be performed via CHTC's transfer server, as below, and **not via a
CHTC submit server.** After obtaining a user directory within
`/staging` and an account on the transfer server, copy relevant
files directly into this user directory from your own computer:

- Example `scp` command on your own Linux or Mac computer:
```
$ scp large.file username@transfer.chtc.wisc.edu:/staging/username/ 
```
{:.term}

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
## A. Transferring Large Input Files
Staged files should be specified in the job submit file using the `osdf://` or `file:///` syntax,
depending on the size of the files to be transferred. [See this table for more information](htc-job-file-transfer#transferring-data-to-jobs-with-transfer_input_files).

```
transfer_input_files = osdf://chtc/staging/username/file1, file:///staging/username/file2, file3 
```
{:.sub}


## B. Transferring Large Output Files

By default, any new or changed files in the top-level directory are transferred to your working directory on `/home`. If you have large output files, this is undesirable.

Large outputs should be transferred to staging using the same file transfer protocols in HTCondor's `transfer_output_remaps` option: 

```
transfer_output_files = file1, file2
transfer_output_remaps = "file1 = osdf://chtc/staging/username/file1; file2 = file:///staging/username/file2"
```
{:.sub}

# 4. Submit Jobs Using Staged Data

In order to properly submit jobs using staged large data, always do the following:

- **Submit from `/home`**: ONLY submit jobs from within your home directory
    (`/home/username`), and NEVER from within `/staging`.

In your submit file: 

- **Request sufficient disk space**: Using `request_disk`, request an amount of disk 
space that reflects the total of (a) input data that each job will copy into
    the job working directory from `/staging,` and (b) any output that
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

transfer_input_files = osdf://chtc/staging/username/myprogram, file:///staging/username/largedata.tar.gz

# IMPORTANT! Require execute servers that can access /staging
Requirements = (Target.HasCHTCStaging == true)

# Make sure to still include lines like "request_memory", "request_disk", "request_cpus", etc. 

queue
```

# 5. Related Pages

* [Data Storage Locations on the HTC](htc-job-file-transfer)
* [Check Disk Quota and Usage](check-quota)
* [Request a /staging directory or quota change](quota-request)