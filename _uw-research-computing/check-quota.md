---
highlighter: none
layout: guide
title: Check Disk Quota and Usage
guide:
    category: Manage data
    tag:
        - htc
---

## Introduction

This guide shows you how to check the amount of disk space and number of files you are using on the Access Point in your `/home` and `/staging` directories. You can also check your limit on your disk space and number of files (i.e., your "quota"). This guide will help you manage your disk space and give tips on what do when you've reached your quota.

{% capture content %}
- [Introduction](#introduction)
- [Default quotas](#default-quotas)
- [Check your quota](#check-your-quota)
- [Other ways to check your quota](#other-ways-to-check-your-quota)
- [Check the size of a directory and its contents](#check-the-size-of-a-directory-and-its-contents)
- [What to do when you've reached your quota](#what-to-do-when-youve-reached-your-quota)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Default quotas

| Data location | **`/home`** |  **`/staging`** |
| ----------- | ----------- |
| Default quota (disk) | 40 GB | 100 GB |
| Default quota (number of items) | none | 1000 items |
| Purpose | Default file system, handles most files | Stages large files/containers for file transfer into jobs |
| Recommended location for | Many, small files (<1 GB) | Few, large files (>1 GB) | 

Read more about the differences between the `/home` and `/staging` file system in [this guide](htc-job-file-transfer#data-storage-locations).

<p style="text-align: center; margin-bottom: 0; font-weight: bold;">Need a <code>/staging</code> directory? Need a higher quota?</p>
<div class="d-flex mb-3">
	<div class="p-3 m-auto">
		<a class="btn btn-primary" style="text-align: center" href="quota-request">Fill out our quota request form</a>
	</div>
</div>

## Check your quota

For the most up-to-date information about your quota, use the `get_quotas` command on the Access Point.
```
get_quotas
```
{:.term}

This will print a table with your `/home` and `/staging` quotas. An example output is shown below.

```
[user@ap2002 ~]$ get_quotas
Path              Disk_Used(GB)  Disk_Limit(GB)  Files_Used  File_Limit
/home/username        16.0711        40              8039        N/A
/staging/u/username   13.4731        100             12          1000
```
{:.term}

To print the quota for any path in `/staging`, `/software`, and `/projects` that you have access to, (i.e., a group directory), use the `-p` option:

```
get_quotas -p <path to directory>
```
{:.term}

An example output of the `get_quotas` command with the `-p` option is shown below:

```
[user@ap2002 ~]$ get_quotas -p /staging/groups/example_group
Path                           Disk_Used(GB)  Disk_Limit(GB)  Files_Used  File_Limit
/staging/groups/example_group  0.000433144    100             3           1000
```
{:.term}

## Other ways to check your quota

### Option 1: Check your `/home` quota with `quota -vs`

From any directory location within your `/home` directory, use the command
`quota -vs`. See the example below:

``` 
[user@ap2002 ~]$ quota -vs
Disk quotas for user user (uid 20384): 
     Filesystem   space   quota   limit   grace   files   quota   limit   grace
       /dev/md9  16457M  40960M  51200M            8039       0       0      
```
{:.term}

The output will list your total data usage under `space`, your soft
`quota`, and your hard `limit` at which point your jobs will no longer
be allowed to save data. It also lists information for number of `files`, but
there is no quota for number of files in `/home`.

### Option 2: Check your Message of the Day (MOTD)

Your quota is also printed upon the first time you log on to the Access Point that day. See below for an example:

```
_____________________________________________________________________
 #####  #     # #######  #####  Issues?  Email chtc@cs.wisc.edu
#     # #     #    #    #     # Unauthorized use prohibited by:
#       #     #    #    #       WI Statutes: s. 947.0125
#       #######    #    #       U.S. Code: 18 USC 1030
#       #     #    #    #       U.S. Code: 18 USC 2510-2522
#     # #     #    #    #     # U.S. Code: 18 USC 2701-2712
 #####  #     #    #     #####  U.S. Code: 18 USC § 1831
For off campus ssh access use https://www.doit.wisc.edu/network/vpn/
_____________________________________________________________________

         Online office hours are available twice a week:
            Tuesdays, 10:30am - 12pm (Central time)
            Thursdays, 3:00 - 4:30pm (Central time)

     IMPORTANT: CHTC does NOT back up any user data. Remember to back up your data regularly!
 == NOTICE: THIS NODE IS ON PUPPET ENVIRONMENT "puppet8" ==

Filesystem quota report (last updated 10:33 AM)
Storage                     Used (GB)    Limit (GB)    Files (#)    File Cap (#)    Quota (%)
------------------        -----------  ------------  -----------  --------------  -----------
/home/username                  29.38            40           94               0        73.46
/staging/u/username             50.23          1000          110           10000         5.02
```
{:.term}

However, we recommend [using the `get_quotas` command](#check-your-quota) for the most up-to-date information.

## Check the size of a directory and its contents

If you want to check the size of specific directories and their contents, you can do this with the `du` command.

Move to the directory you'd like to check and type `du`. After several
moments (longer if the contents of your directory are large), the command
will add up the sizes of directory contents and output the total size of
each contained directory in units of kilobytes (KB) with the total size of
that directory listed last. See the example below:

``` 
[user@ap2002 ~]$ du ./
4096    ./dir/subdir/file.txt
4096    ./dir/subdir
7140    ./dir
74688   .
```
{:.term}

You can divide each value by 1024 to get megabytes, and again for gigabytes. Below are extra options for the `du` command.

| Command | Usage |
| --- | --- |
| `du -h` or `du --human-readable` | Prints disk usage in a human-readable format.<br>(K, M, G denote kilo-, mega-, and gigabytes, respectively.)
| `du -s` or `du --summarize` | Prints total disk usage of the directory without printing its contents. |
| `du <path/to/directory>` | Prints disk usage of the specified directory. |

## What to do when you've reached your quota

When you've reached your quota, you may encounter error messages such as `Disk quota exceeded`. When you encounter the error message, we recommend the following steps:

1. Check your quota with `get_quotas`. At which data location did you reach your quota? Did you reach your disk quota or your items quota?
1. If possible, remove any files you no longer need from the system.
1. If you've reached your quota for the **number of files** in `/staging`, we recommend compressing your dataset into zip files or tarballs, because `/staging` is intended for storing few, large files. [Read more about this here.](file-avail-largedata#reduce-file-counts)
1. If you still need more disk space, [request a higher quota.](quota-request)

> ### ⚠️ CHTC is not a storage service
{:.tip-header}

> CHTC data locations are intended for temporarily storing files used in **active calculations only**. Once you are done with the files, please remove them from the system to clear disk space.<br><br>
> **We do not back up any of the data you place on our system. It is your responsibility to back up your own files.**
{:.tip}

## Related pages

* [Use and transfer data in jobs on the HTC system](htc-job-file-transfer)
* [Manage large data in `/staging`](file-avail-largedata)
* [Request a Quota Change](quota-request)