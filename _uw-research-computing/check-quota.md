---
highlighter: none
layout: guide
title: Check Disk Quota and Usage
guide:
    order: 7
    category: Basics and Policies
    tag:
        - htc
---

The following commands will allow you to monitor the amount of disk
space you are using in your home directory on the access point and to determine the
amount of disk space you have been allotted (your quota). 

The default quota allotment in your `/home` directory is 20 GB with a hard
limit of 30 GB (at which point you cannot write more files).

**Note: The CHTC access points are not backed up, so you should
copy completed jobs to a secure location as soon as a batch completes,
and then delete them on the submit node in order to make room for future
jobs.** Disk space provided is intended for *active* calculations only, not permanent storage.
If you need more disk space to run a single batch or concurrent
batches of jobs, please contact us ([Get Help!](get-help.html)). We have multiple ways of dealing with large disk space requirements to make things easier for you.

If you wish to change your quotas, please see [Request a Quota Change](quota-request).

**1. Checking Your `/home` Quota and Usage**
-------------------------------------

From any directory location within your `/home` directory, use the command
`quota -vs`. See the example below:

``` 
[alice@submit]$ quota -vs
Disk quotas for user alice (uid 20384): 
     Filesystem   space   quota   limit   grace   files   quota   limit   grace
      /dev/sdb1  12690M  20480M  30720M            161k       0       0        
```
{:.term}

The output will list your total data usage under `space`, your soft
`quota`, and your hard `limit` at which point your jobs will no longer
be allowed to save data. Each value is given in 1-kilobyte
blocks, so you can divide each number by 1024 to get megabytes (MB), and
again for gigabytes (GB). (It also lists information for number of `files`, but
we don't typically allocate disk space in `/home` by file count.)

**2. Checking Your `/staging` Quota and Usage**
------------------------------------------------
Users may have a `/staging` directory, meant for staging large files and data intended for
job submission. See our [Managing Large Data in HTC Jobs](file-avail-largedata) guide for
more information.

To check your `/staging` quota, use the command `get_quotas /staging/username`.

```
[alice@submit]$ get_quotas /staging/alice
Path            Quota(GB)  Items  Disk_Usage(GB)  Items_Usage
/staging/alice  20         5      3.18969         5
```
{:.term}

Your `/staging` directory has a disk and item quota. In the example above, the disk quota is
20 GB, and the items quota is 5 items. The current usage is printed in the following columns;
in the example, the user has used 3.19 GB and 5 items.

To request a quota increase, [fill out our quota request form](quota-request).

**3. Checking the Size of Directories and Contents**
------------------------------------------------

Move to the directory you'd like to check and type `du` . After several
moments (longer if the contents of your directory are large), the command
will add up the sizes of directory contents and output the total size of
each contained directory in units of kilobytes with the total size of
that directory listed last. See the example below:

``` 
[alice@submit]$ du ./
4096    ./dir/subdir/file.txt
4096    ./dir/subdir
7140    ./dir
74688   .
```
{:.term}

As for quota usage above, you can divide each value by 1024 to get
megabytes, and again for gigabytes.

Using `du` with the `-h` or `--human-readable` flags will display the
same values with only two significant digits and a K, M, or G to denote
the byte units. The `-s` or `--summarize` flags will total up the size
of the current directory without listing the size of directory contents
. You can also specify which directory you\'d like to query, without
moving to it, by adding the relative filepath after the flags. See the
below example from the `home` directory which contains the directory
`dir`:

``` 
[alice@submit]$ du -sh dir
7.1K    dir
```
{:.term}
