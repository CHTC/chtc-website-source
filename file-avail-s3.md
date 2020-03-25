---
highlighter: none
#layout: default
layout: file_avail
title: Managing Large Data in HTC Jobs with S3 Buckets
---

When submitting jobs to CHTC's High Throughput Computing (HTC) system,
there is a distinct location for staging data that is too large to be
handled at scale via the default HTCondor file transfer mechanism
but needs to be accessed outside of CHTC
(for example, data for jobs that run on the Open Science Grid).

**To best understand the below information, users should already be
familiar with:**

1.  Using the command-line to: navigate directories,
    create/edit/copy/move/delete files and directories, and run intended
    programs (aka "executables").
2.  CHTC's [Intro to Running HTCondor Jobs](/helloworld.shtml)
3.  CHTC's guide for [Typical File Transfer](/file-availability.shtml)

Contents
--------

1.  [Policies and Intended Use](#1-policies-and-intended-use)
2.  [Staging Large Data in S3 Buckets](#2-staging-large-data-in-s3-buckets)
3.  [Using Staged Files in a Job](#3-using-staged-files-in-a-job)
	- [Transferring Large Input Files](#a-transferring-large-input-files)
	- [Moving Large Output Files](#b-moving-large-output-files)
4.  [Checking your Data Use and File Counts](#4-checking-your-data-use-and-object-counts)

# 1. Policies and Intended Use

> **USERS VIOLATING ANY OF THE POLICIES IN THIS GUIDE WILL
> HAVE THEIR DATA STAGING ACCESS AND/OR CHTC ACCOUNT REVOKED UNTIL CORRECTIVE
> MEASURES ARE TAKEN. CHTC STAFF RESERVE THE RIGHT TO REMOVE ANY
> PROBLEMATIC USER DATA AT ANY TIME IN ORDER TO PRESERVE PERFORMANCE.**


## A. Intended Use

Our S3 data storage is only for input and output files that
are individually too large to be managed by our other data movement
methods, HTCondor file transfer or SQUID, and when these files are
expected to be accessed outside of CHTC. This includes individual input files
greater than 100MB and individual output files greater than 3-4GB.

Users are expected to abide by this intended use expectation and follow the
instructions for using S3 written in this guide (e.g. files placed
in S3 should ALWAYS be listed in the submit file).

## B. Access to S3 Data Storage

Any one with a CHTC account whose data meets the intended use above
can request access to CHTC's S3 data storage. A Research
Computing Facilitator will review the request and follow up. If
appropriate, S3 bucket creation will be enabled and a quota set on
your account. Quotas are based on individual user needs; if a larger quota
is needed, email chtc@cs.wisc.edu with your request.

## C. User Data Management Responsibilities

As with all CHTC file spaces:

- **Keep copies**: Our S3 buckets are not backed up and have the
possibility of data loss; keep copies of ANY and ALL data in S3
buckets in another, non-CHTC location.
- **Remove data**: We expect that users remove data from S3 buckets AS
SOON AS IT IS NO LONGER NEEDED FOR ACTIVELY-RUNNING JOBS.
- **Monitor usage and quota**: Your account has both a size and
number of files quota that applies across all buckets owned by your
account. Quota changes can be requested by emailing chtc@cs.wisc.edu.

CHTC staff reserve the right to remove S3 buckets or revoke bucket
creation permission at any time.

## D. Data Access Within Jobs

Data in a CHTC S3 bucket is available anywhere (including OSG) as long
as the version of HTCondor running on the execute machines support
jobs that use S3 URLs.

Data in CHTC S3 buckets are owned by the user (or a set of users), and
only the user's (or users') own jobs can access these files.

# 2. Staging Large Data in S3 Buckets

In order to stage data in an S3 bucket for use on CHTC's HTC system:

- **Get S3 bucket creation access**: Bucket creation access is granted by request.
- **Create an S3 bucket**: Create a bucket that will contain the data for your project.
- **Reduce file counts**: Combine and compress files that are used together.
- **Use the transfer server**: Upload your data to your bucket via our dedicated file transfer server.
- **Remove files after jobs complete**: Data in S3 buckets are quota controlled and not backed up.

## A. Get S3 Bucket Creation Access

CHTC S3 bucket creation access is granted by request. If you think you need
to create S3 buckets, email CHTC's Research Computing Facilitators (chtc@cs.wisc.edu).

## B. Create an S3 Bucket

Buckets can be created on a CHTC submit server or the CHTC transfer server
using the `mc` command:

``` {: .term}
$ mc mb chtc/my-bucket-name
```

Each bucket in CHTC must have a unique name, so be descriptive!

## C. Reduce File Counts

Data placed in S3 buckets should be stored in as few files as possible
(ideally, one file per job). Similarly, large output should first be
written to the job working directory then compressed in to a single
file before being transferred back to an S3 bucket at the end of the job.

To prepare job-specific data that is large enough
and exists as multiple files or directories (or a directory of multiple
files), first create a compressed tar package before placing the file in
an S3 bucket (either before submitting jobs, or within jobs before
transferring output to). For example:

``` {: .term}
$ tar -czvf job_package.tar.gz file_or_dir
```

## D. Use the Transfer Server

Movement of large data into/out of S3 buckets before and after jobs
should be performed via CHTC's transfer server, as below, and
**not via a CHTC submit server.** After obtaining an account on the
transfer server and creating an S3 bucket, copy relevant files directly into your
home directory from your own computer:

- Example `scp` command on your own Linux or Mac computer:
``` {.term}
$ scp large-input.file username@transfer.chtc.wisc.edu:/home/username/
```
- If using a Windows computer:
	- Using a file transfer application, like WinSCP, directly drag the large
file from its location on your computer to a location within
`/home/username/` on transfer.chtc.wisc.edu.

Then in an SSH session on the transfer server, copy files in to your
S3 bucket:

``` {.term}
$ mc cp large-input.file chtc/my-bucket
```

## E. Remove Files After Jobs Complete

As with all CHTC file spaces, data should be removed from S3 buckets AS
SOON AS IT IS NO LONGER NEEDED FOR ACTIVELY-RUNNING JOBS. Even if it
will be used again in the future, it should be deleted from and copied
back at a later date. Files can be taken out of S3 buckets using similar
mechanisms as uploaded files. In an SSH session on the transfer
server, copy files from your bucket to your home directory:

``` {.term}
$ mc cp chtc/my-bucket/large-output.file .
```

Then copy files from the transfer server to your own computer:

- Example `scp` command on your own Linux or Mac computer:
``` {.term}
$ scp username@transfer.chtc.wisc.edu:/home/username/large-output.file .
```
- If using a Windows computer:
	- Using a file transfer application, like WinSCP, directly drag the large
file from its location within `/home/username/` on
transfer.chtc.wisc.edu to your computer.

To remove a file inside your S3 bucket, in an SSH session on the
transfer server:

``` {.term}
$ mc rm chtc/my-bucket/large-input.file
$ mc rm chtc/my-bucket/large-output.file
```

To remove an entire bucket (**only do this if you are certain the
bucket is no longer needed**):

``` {.term}
$ mc rb chtc/my-bucket
```

# 3. Using Staged Files in a Job

## A. Transferring Large Input Files

To use data placed in a CHTC S3 bucket, add files to your submit
file's `transfer_input_files` that point to the filename
(e.g. `large-input.file`) inside your bucket (e.g. `my-bucket`) on
CHTC's S3 storage (`s3dev.chtc.wisc.edu`):

``` {: .file}
...
executable = my_script.sh
transfer_input_files = s3://s3dev.chtc.wisc.edu/my-bucket/large-input.file
arguments = large-input.file
...
```

## B. Moving Large Output Files

To have your job automatically copy data back to your CHTC S3 bucket,
add file mappings to a `transfer_output_remaps` command inside your
submit file:

``` {: .file}
transfer_output_remaps = "large-output.file = s3://s3dev.chtc.wisc.edu/my-bucket/large-output.file"
```

# 4. Checking Your Data Use and File Counts

To check what files are in your bucket and the size of the files:
``` {.term}
$ mc ls chtc/my-bucket
```

To check your bucket's total data usage:
``` {.term}
$ mc du chtc/my-bucket
```

To check your bucket's file count:
``` {.term}
$ mc find chtc/my-bucket | wc -l
```
