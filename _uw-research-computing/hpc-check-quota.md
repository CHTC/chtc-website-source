---
highlighter: none
layout: guide
title: Check Disk Quota and Usage
guide:
    category: Manage data
    tag:
        - hpc
---

## Introduction

This guide shows you how to check the amount of disk space and number of files you are using in your `/home` and `/scratch` directories. You can also check your limit on your disk space and number of files (i.e., your "quota"). This guide will help you manage your disk space and give tips on what do when you've reached your quota.

{% capture content %}
- [Introduction](#introduction)
- [Default quotas](#default-quotas)
- [Check your quota](#check-your-quota)
- [Check your Message of the Day (MOTD)](#check-your-message-of-the-day-motd)
- [Check the size of a directory and its contents](#check-the-size-of-a-directory-and-its-contents)
- [What to do when you've reached your quota](#what-to-do-when-youve-reached-your-quota)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Default quotas

| Data location | **`/home`** |  **`/scratch`** |
| ----------- | ----------- |
| Default quota (disk) | 30 GB | 100 GB |
| Default quota (number of items) | 250,000 items | 250,000 items |
| Purpose | Repeatedly used files<br>(templates, source code, software, reference data) | Working data<br>(inputs, outputs, logs, stderr, stdout) |

<p style="text-align: center; margin-bottom: 0; font-weight: bold;">Need more quota?</p>
<div class="d-flex mb-3">
	<div class="p-3 m-auto">
		<a class="btn btn-primary" style="text-align: center" href="quota-request">Fill out our quota request form</a>
	</div>
</div>

## Check your quota

For the most up-to-date information about your quota, use the `get_quotas` command.
```
get_quotas
```
{:.term}

This will print a table with your `/home` and `/scratch` quotas. An example output is shown below.

```
[user@spark-login ~]$ get_quotas
Path            Disk_Used(GB)  Disk_Limit(GB)  Files_Used  File_Limit
/home/user      6.08254        30              150372      250000
/scratch/user   2.33743        100             22          250000
```
{:.term}

To print the quota for a path in `/home`, `/scratch`, and `/software` that you have access to, (i.e., a group directory), use the `-p` option:

```
get_quotas -p <path to directory>
```
{:.term}

An example output of the `get_quotas` command with the `-p` option is shown below:

```
[user@spark-login ~]$ get_quotas -p /software/groups/example_group
Path                            Disk_Used(GB)  Disk_Limit(GB)  Files_Used  File_Limit
/software/groups/example_group  0.000433144    100             3           1000
```
{:.term}

## Check your Message of the Day (MOTD)

Your quota is also printed upon login. See below for an example:

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

 == NOTICE: THIS NODE IS ON PUPPET ENVIRONMENT "puppet8" ==

Filesystem quota report (last updated 01:01 PM)
Storage           Used (GB)    Limit (GB)    Files (#)    File Cap (#)    Quota (%)
--------------  -----------  ------------  -----------  --------------  -----------
/home/user             6.08            30       150372          250000        20.28
/scratch/user          2.34           100           22          250001         2.34
```
{:.term}

However, we recommend [using the `get_quotas` command](#check-your-quota) for the most up-to-date information.

## Check the size of a directory and its contents

If you want to check the size of specific directories and their contents, you can do this with the `ncdu` utility.

```
[user@spark-login ~]$ ncdu /home/username
[user@spark-login ~]$ ncdu /scratch/username
```
{:.term}

When `ncdu` has finished running, the output will give you a total file count and allow you to navigate between subdirectories for even more details. Type `q `when you're ready to exit the output viewer.

## What to do when you've reached your quota

When you've reached your quota, you may encounter error messages such as `Disk quota exceeded`. When you encounter the error message, we recommend the following steps:

1. Check your quota with `get_quotas`. At which data location did you reach your quota? Did you reach your disk quota or your items quota?
1. If possible, remove any files you no longer need from the system.
1. If you still need more disk space, [request more quota.](quota-request)

> ### ⚠️ CHTC is not a storage service
{:.tip-header}

> CHTC data locations are intended for temporarily storing files used in **active calculations only**. Once you are done with the files, please remove them from the system to clear disk space.<br><br>
> **We do not back up any of the data you place on our system. It is your responsibility to back up your own files.**
{:.tip}

## Related pages

* [HPC System Overview](hpc-overview)