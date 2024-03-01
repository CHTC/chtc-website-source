---
highlighter: none
layout: guide
title: Checking Disk Quota and Usage
guide:
    order: 7
    category: Basics and Policies
    tag:
        - htc
---

The following commands will allow you to monitor the amount of disk
space you are using in your home directory on our (or another) submit node and to determine the
amount of disk space you have been allotted (your quota).

If you also have a `/staging` directory on the HTC system, see our 
[staging guide](file-avail-largedata.html#5-checking-your-quota-data-use-and-file-counts) for 
details on how to check your quota and usage. 
\
The default quota allotment on CHTC submit nodes is 20 GB with a hard
limit of 30 GB (at which point you cannot write more files).\
\
**Note: The CHTC submit nodes are not backed up, so you will want to
copy completed jobs to a secure location as soon as a batch completes,
and then delete them on the submit node in order to make room for future
jobs.** If you need more disk space to run a single batch or concurrent
batches of jobs, please contact us ([Get Help!](get-help.html)). We have multiple ways of dealing with large disk space
requirements to make things easier for you.

If you wish to change your quotas, please see [Request a Quota Change](quota-request).

**1. Checking Your User Quota and Usage**
-------------------------------------

From any directory location within your home directory, type
`quota -vs`. See the example below:

``` 
[alice@submit]$ quota -vs
Disk quotas for user alice (uid 20384): 
     Filesystem   space   quota   limit   grace   files   quota   limit   grace
      /dev/sdb1  12690M  20480M  30720M            161k       0       0        
```
{:.term}

The output will list your total data usage under `blocks`, your soft
`quota`, and your hard `limit` at which point your jobs will no longer
be allowed to save data. Each of the values given are in 1-kilobyte
blocks, so you can divide each number by 1024 to get megabytes (MB), and
again for gigabytes (GB). (It also lists information for ` files`, but
we don\'t typically allocate disk space by file count.)

**2. Checking the Size of Directories and Contents**
------------------------------------------------

Move to the directory you\'d like to check and type `du` . After several
moments (longer if you\'re directory contents are large), the command
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
