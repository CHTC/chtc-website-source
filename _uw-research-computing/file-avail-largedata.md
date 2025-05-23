---
highlighter: none
layout: file_avail
title: Manage large data in /staging
alt_title: Manage large data in /staging
guide:
    category: Manage data
    tag:
        - htc
---

## Introduction

When submitting jobs to the HTC system, large data needs to be stored and handled differently to improve the efficiency of file transfer and maintain system stability. Basic file transfer concepts for large data is covered in our [file transfer guide](htc-job-file-transfer). This guide expands on those concepts and includes recommendations for managing large data.

**Before reading this guide users should already be familiar with:**

1.  [Using the command line](basic-shell-commands) to navigate directories,
    create and manage files, and use scripts.
2.  CHTC's [Intro to Running HTCondor Jobs](htcondor-job-submission)
3.  CHTC's guide for [File Transfer](htc-job-file-transfer)

{% capture content %}
- [Introduction](#introduction)
- [Policies and intended use](#policies-and-intended-use)
   * [Intended use](#intended-use)
   * [User responsibilities](#user-responsibilities)
- [Stage large data](#stage-large-data)
   * [Request a `/staging` directory](#request-a-staging-directory)
   * [Reduce file counts](#reduce-file-counts)
   * [Use the transfer server](#use-the-transfer-server)
   * [Remove files after jobs complete](#remove-files-after-jobs-complete)
- [Use staged files in a job](#use-staged-files-in-a-job)
   * [Transfer large input files](#transfer-large-input-files)
   * [Transfer large output files](#transfer-large-output-files)
- [Submit jobs using staged data](#submit-jobs-using-staged-data)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Policies and intended use

> **USERS VIOLATING ANY OF THE POLICIES IN THIS GUIDE WILL
> HAVE THEIR DATA STAGING ACCESS AND/OR CHTC ACCOUNT REVOKED UNTIL CORRECTIVE
> MEASURES ARE TAKEN. CHTC STAFF RESERVE THE RIGHT TO REMOVE ANY
> PROBLEMATIC USER DATA AT ANY TIME IN ORDER TO PRESERVE PERFORMANCE.**


### Intended use

Our large data staging location is ***only*** for input and output files that are individually too large to be managed by the HTCondor file transfer. This includes individual input and output files greater than 1 GB.

Users are expected to abide by this intended use expectation and follow the 
instructions for using `/staging` written in this guide.

### User responsibilities

As with all CHTC data spaces, users should: 

- **Back up your data**: We do not back up any of our systems; keep copies of any and all data in `/staging` in another, non-CHTC location. 
- **Remove data**: We expect that users remove data from `/staging` as soon as it is no longer needed for active jobs.
- **Monitor usage and quota**: Each `/staging` folder a quota for disk size and number of files. To check your quota, see [this guide](check-quota).

CHTC staff reserve the right to remove data from our large data staging location (or any CHTC file system) at any time.

## Stage large data

In order to stage large data for use on CHTC's HTC system, users must: 

1. **Request a `/staging` directory**: Use our quota request form.
1. **Reduce file counts**: Combine and compress files that are used together.
1. **Transfer files to the HTC system via the transfer server**: Upload your data via our dedicated file transfer server.
1. **Remove files after jobs complete**: Our data staging space is quota-controlled and not backed up. 

### Request a `/staging` directory

Any one with a CHTC account whose data meets the intended use above can request space in our large data staging area by filling out a quota request form. The default quota is 100 GB / 1000 items; if a larger quota is needed, request more quota. The created directory will exist at this path: `/staging/username`

We can also create group or shared spaces by request. 

<p style="text-align: center; margin-bottom: 0; font-weight: bold;">Need a <code>/staging</code> directory or more quota?</p>
<div class="d-flex mb-3">
	<div class="p-3 m-auto">
		<a class="btn btn-primary" style="text-align: center" href="quota-request">Quota request form</a>
	</div>
</div>


### Reduce file counts

The file system backing our `/staging`space is optimized to handle small numbers of large files. If your job requires many small files, we recommend placing these files in the `/home` directory or compressing multiple files into a single zip file or tarball. See [this table](htc-job-file-transfer#data-storage-locations) for more information on the differences between `/staging` and `/home`. 

Data placed in our large data `/staging` location should be stored in as few files as possible (ideally, one file per job), and will be used by a job only after being copied from `/staging` into the job working directory. Similarly, large output should first be written to the job's working directory then compressed in to a single file before being copied to `/staging` at the end of the job. 

To combine multiple files, directories, or a directory with multiple files, first create a compressed tarball before placing the file in `/staging`. For example:

```
$ tar -czvf filename.tar.gz file_or_dir 
```
{:.term}

### Use the transfer server

Uploading or downloading data to `/staging` should only be performed via CHTC's transfer server, `transfer.chtc.wisc.edu`, and **not via a CHTC Access Point.**

For example, you can use `scp` to transfer files into your `/staging` directory:
```
$ scp large.file netid@transfer.chtc.wisc.edu:/staging/netid/ 
```
{:.term}

### Remove files after jobs complete

As with all CHTC file spaces, data should be removed from `/staging` AS
SOON AS IT IS NO LONGER NEEDED FOR ACTIVELY-RUNNING JOBS. Even if it
will be used it the future, it should be deleted from and copied
back at a later date. Files can be taken off of `/staging` using similar 
mechanisms as uploaded files (as above). 

## Use staged files in a job
### Transfer large input files
Staged files should be specified in the job submit file using the `osdf:///` or `file:///` syntax,
depending on the size of the files to be transferred. [See this table for more information](htc-job-file-transfer#transfer-input-data-to-jobs-with-transfer_input_files).

```
transfer_input_files = osdf:///chtc/staging/username/file1, file:///staging/username/file2, file3 
```
{:.sub}


### Transfer large output files

By default, any new or changed files in the top-level directory are transferred to your working directory on `/home`. If you have large output files, this is undesirable.

Large outputs should be transferred to staging using the same file transfer protocols in HTCondor's `transfer_output_remaps` or `output_destination` option: 

```
transfer_output_files = file1, file2, file3
transfer_output_remaps = "file1 = osdf:///chtc/staging/username/file1; file2 = file:///staging/username/file2"
```
{:.sub}

In the example above, `file1` and `file2` are transferred to `/staging` via two different file transfer protocols (which depends on their file size), and `file3` is transferred to the submit directory on `/home`.

Read more about how to transfer output data, including the `output_destination` option, in our [file transfer guide](htc-job-file-transfer).

## Submit jobs using staged data

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

transfer_input_files = osdf:///chtc/staging/username/myprogram, file:///staging/username/largedata.tar.gz

# IMPORTANT! Require execute servers that can access /staging
Requirements = (Target.HasCHTCStaging == true)

# Make sure to still include lines like "request_memory", "request_disk", "request_cpus", etc. 

queue
```

## Related pages

* [Use and transfer data in jobs on the HTC system](htc-job-file-transfer)
* [Check Disk Quota and Usage](check-quota)
* [Request a /staging directory or quota change](quota-request)