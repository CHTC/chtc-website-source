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

Files in our S3 data storage are organized in storage units called
"buckets." You can think of an S3 bucket like a folder containing a
set of data. Each bucket has a unique name of your choosing and can
contain folders, executable files, data files, and most other types of
files. S3 buckets are protected with a key that is unique to you
(similar to a password) and, when provided with the key, buckets
can be accessed from any machine with an internet connection. CHTC
automatically creates and manages keys for users, so you do not have
to provide your key when manging files in your S3 buckets on CHTC
transfer servers or when submitting jobs on CHTC submit servers that
transfer data from S3 buckets.

Users are expected to abide by this intended use expectation and follow the
instructions for using S3 buckets written in this guide (e.g. files placed
in S3 buckets should ALWAYS be listed in the submit file).

## B. Getting Access to Create S3 Buckets

Any one with a CHTC account whose data meets the intended use above
can request access to create S3 buckets inside CHTC's S3 data
storage. A Research Computing Facilitator will review the request and
follow up. If appropriate, S3 bucket creation will be enabled for and
a quota will be set on your account. Quotas are based on individual
user needs; if a larger quota is needed, email chtc@cs.wisc.edu with
your request.

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

Data in a CHTC S3 bucket can be accessed from jobs running almost
anywhere (including most of OSG). HTCondor automatically matches and
runs jobs that use S3 buckets only on machines that support S3 data
transfers.

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

```
[alice@transfer]$ mc mb chtc/my-bucket-name
```
{: .term}

Each bucket in CHTC must have a unique name, so be descriptive! We
recommend creating a bucket per dataset or per batch of jobs.

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

```
$ tar -czvf job_package.tar.gz file_or_dir
```
{: .term}

## D. Use the Transfer Server

Movement of large data into/out of S3 buckets before and after jobs
should be performed via CHTC's transfer server, as below, and
**not via a CHTC submit server.** After obtaining an account on the
transfer server and creating an S3 bucket, copy relevant files directly into your
home directory from your own computer:

- Example `scp` command on your own Linux or Mac computer:
	```
$ scp large-input.file username@transfer.chtc.wisc.edu:/home/username/
	```
	{: .term}
- If using a Windows computer:
	- Using a file transfer application, like WinSCP, directly drag the large
file from its location on your computer to a location within
`/home/username/` on transfer.chtc.wisc.edu.

Then in an SSH session on the transfer server, copy files in to your
S3 bucket:

```
[alice@transfer]$ mc cp large-input.file chtc/my-bucket
```
{: .term}

## E. Remove Files After Jobs Complete

As with all CHTC file spaces, data should be removed from S3 buckets AS
SOON AS IT IS NO LONGER NEEDED FOR ACTIVELY-RUNNING JOBS. Even if it
will be used again in the future, it should be deleted from and copied
back at a later date. Files can be taken out of S3 buckets using similar
mechanisms as uploaded files. In an SSH session on the transfer
server, copy files from your bucket to your home directory:

```
[alice@transfer]$ mc cp chtc/my-bucket/large-output.file .
```
{: .term}

Then copy files from the transfer server to your own computer:

- Example `scp` command on your own Linux or Mac computer:
	```
$ scp username@transfer.chtc.wisc.edu:/home/username/large-output.file .
	```
	{: .term}
- If using a Windows computer:
	- Using a file transfer application, like WinSCP, directly drag the large
file from its location within `/home/username/` on
transfer.chtc.wisc.edu to your computer.

To remove a file inside your S3 bucket, in an SSH session on the
transfer server:

```
[alice@transfer]$ mc rm chtc/my-bucket/large-input.file
[alice@transfer]$ mc rm chtc/my-bucket/large-output.file
```
{: .term}

To remove an entire bucket (**only do this if you are certain the
bucket is no longer needed**):

```
[alice@transfer]$ mc rb chtc/my-bucket
```
{: .term}

# 3. Using Staged Files in a Job

## A. Transferring Large Input Files

To use data placed in a CHTC S3 bucket, add files to your submit
file's `transfer_input_files` that point to the filename
(e.g. `large-input.file`) inside your bucket (e.g. `my-bucket`) on
CHTC's S3 storage (`s3dev.chtc.wisc.edu`):

```
...
executable = my_script.sh
transfer_input_files = s3://s3dev.chtc.wisc.edu/my-bucket/large-input.file
arguments = large-input.file
...
```
{: .sub}

## B. Moving Large Output Files

To have your job automatically copy data back to your CHTC S3 bucket,
add file mappings to a `transfer_output_remaps` command inside your
submit file:

```
transfer_output_remaps = "large-output.file = s3://s3dev.chtc.wisc.edu/my-bucket/large-output.file"
```
{: .sub}

# 4. Checking Your Data Use and File Counts

To check what files are in your bucket and the size of the files:
```
[alice@submit]$ mc ls chtc/my-bucket
```
{: .term}

To check your bucket's total data usage:
```
[alice@submit]$ mc du chtc/my-bucket
```
{: .term}

To check your bucket's file count:
```
[alice@submit]$ mc find chtc/my-bucket | wc -l
```
{: .term}
