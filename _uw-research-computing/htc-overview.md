---
highlighter: none
layout: guide
title: System Overview
guide:
    category: Get started
    tag:
        - htc
---

{% capture content %}
1. [High-Throughput Computing at CHTC](#high-throughput-computing-at-chtc)  
2. [HTC User Policies](#htc-system-user-policies)
    - [HTC System Specific Policies](#htc-system-specific-policies)    
4. [HTC Hardware and Configuration](#htc-hardware-and-configuration)
    - [HTC Operating System and Hardware](#htc-operating-system-and-software)   
    - [HTC Sumbmit Servers](#submit-servers)     
    - [HTC Execute Nodes](#execute-nodes)   
    - [HTC Operating System and Software](#operating-system-and-software)
6. [Data Storage and Management](#data-storage-and-management)   
    - [Tools for managing /home and /staging space](#tools-for-managing-home-and-staging-space)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

<span name="high-throughput-computing-at-chtc"></span>
# High-Throughput Computing at CHTC

The CHTC high-throughput computing (HTC) cluster provides support a variety of computational research tasks. The HTC system offers CPUs/GPUs, high-memory nodes, and other specialized hardware. Workflows that run well on this system include RNA/DNA sequencing, machine learning workflows, weather modeling, monte carlo simulations, etc. 

To get access to the HTC System, please complete our
[New User Consultation Form](form.html). After your request is received, 
a Research Computing Facilitator will follow up to discuss the computational needs 
of your research and connect you with computing 
resources (including non-CHTC services) that best fit your needs.

<span name="htc-system-user-policies"></span>

# HTC System User Policies

See our [User Policies and Expectations](user-expectations.html) for details on general CHTC policies. 

<span name="htc-system-specific-policies"></span>

## HTC System Specific Policies

Below are some of the default limits on CHTC's HTC system. Note that as a large-scale 
computing center, we want you to be able to run at a large scale - often much larger 
than these defaults. Please contact the facilitation team whenever you encounter one 
of these limits so we can adjust your account settings or discuss alternative ways to 
achieve your computing goals. 

-   **Jobs with long runtimes.** There is a default run limit of 72
    hours for each job queued in the HTC System, once it starts running.
    Jobs longer than this will be placed in HTCondor's "hold" state.
    If your jobs will be longer, contact the CHTC facilitation team, and we'll help you to determine the
    best solution.
-   **Submitting many jobs from one submit file.** HTCondor is designed
    to submit thousands (or more) jobs from one submit file. If you are
    submitting <u>over 10,000 jobs per submit file</u> or want to queue 
    more than <u>50,000 total jobs as a single user</u>,
    please [email us](mailto:chtc@cs.wisc.edu) as we have strategies to
    submit that many jobs in a way that will ensure you have as many
    jobs running as possible without also compromising queue performance.
-   **Submitting many *short* jobs from one submit file.** While HTCondor
    is designed to submit thousands of jobs at a time, many *short* jobs
    can overwhelm the submit server, resulting in other jobs taking much
    longer to start than usual. <u> If you plan on submitting over
    1000 jobs per submit file, we ask that you ensure each job has a
    minimum run time of 5 minutes (on average). <u>
-   **The default disk quota is 20 GB** in your `/home` directory, as a 
    starting point. You can track your use of disk space and your quota value,
    using our [Quota Guide](check-quota.html). If you need more space
    for concurrent work, please send an email to chtc@cs.wisc.edu.
-   **Submitting jobs with \"large\" files:** HTCondor\'s
    normal file transfer mechanism (\"transfer\_input\_files\") is good for 
    files up to 100MB in size (or 500MB total, per job). For jobs with larger
    files, please see our guide on [File Availability](file-availability.html) 
    Options, and contact us to make arrangements.

<span name="htc-hardware-and-configuration"></span>

# HTC Hardware and Configuration

The HTC System consists of several submit servers and many compute (aka execute) 
nodes. All users log in at a login node, and submit their workflow as HTCondor jobs that run on execute points. 

<span name="htc-operating-system-and-software"></span>

## HTC Operating System and Software

Submit servers in the HTC System are running CentOS 7 Linux. 

Due to the distributed and independent nature of the HTC system's execute points, there can be a variety of operating systems on the pool of execution point resources (especially for users that opt into running jobs on the globally available OSPool operated by the OSG). However, the default operating system is CentOS 8 Stream Linux unless users request to run on a different operating system using their HTCondor submit file. 

The HTC system is a test bed for the [HTCondor Software Suite](https://htcondor.org/), and thus is typically running the latest or soon-to-be-released versions of HTCondor. 

To see more details of other software on the cluster, see our [HTC Guides page](guides#htc-documentation). 

<span name="submit-servers"></span>

## HTC Submit Servers

There are multiple submit servers for the HTC system. The two most common submit servers are `ap2001.chtc.wisc.edu` and `ap2002.chtc.wisc.edu` (formerly `submit1.chtc.wisc.edu` and `submit2.chtc.wisc.edu`, respectively). All users will be notified what submit server they should log into when their account is created.

<span name="execute-nodes"></span>

## HTC Execute Nodes

Only execute nodes will be used for performing your computational work. 

By default, when users submit HTCondor jobs, their jobs will only run on execute points owned and managed by CHTC staff. As of January 2024, there are approximately 40,000 CPU slots and 80+ GPU slots available in the CHTC execute pool. 

Some users, particularly those requesting GPUs, may wish to access additional execute points so that they may have more jobs running simultantiously. HTC users can opt in to allowing their jobs to run on additional execute points not owned or managed by CHTC staff. There are two additional execute pools that users can opt into using: the UW Grid and the OSG's OSPool. There are many advantages to opting into running on these execute pools, such as accessing more GPUs, accessing different computer architectures, and having more jobs running in parallel. However, because these machines are not managed by CHTC and thus are backfilling on hardware owned by other entities, it is recommended that users only opt into using these resources if they have short (<~10 hours), inturruptable jobs. For more information, see the [Scaling Beyond Local HTC Capacity](https://chtc.cs.wisc.edu/uw-research-computing/scaling-htc) guide. 

### Fair Share Allocation

To promote fair access to HTC computing resources, all users are subject to a fair-share policy. This "fair-share" policy means that users who have run many jobs in the near-past will have a lower priority, and users with little recent activity will see their waiting jobs start sooner. 
(The HTC system does not have a strict "first-in-first-out" queue policy.)

Resource requests will also impact the number of jobs a user has running. Smaller jobs (those requesting smaller amounts of CPUs, memory, and disk) as well as more flexible jobs (those requesting to use a variety of GPUs instead of a specific GPU type) are able to match to more execute points than larger, less flexible jobs. Thus, these jobs will start sooner and more jobs will run in parallel.

<span name="data-storage-and-management"></span>
# Data Storage and Management

**Data space in the HTC system is not backed-up and should be
treated as temporary by users**. Only files necessary for
*actively-running* jobs should be kept on the filesystem, and files
should be removed from the system when jobs complete. A primary copy of any
essential files (e.g. software, submit files, input) should be kept in an 
alternate, non-CHTC storage location.

**CHTC Staff reserve the right to remove any significant amounts of data
on the HTC System** in our efforts to maintain filesystem performance
for all users.

<span name="tools-for-managing-home-and-staging-space"></span>

## Tools for Managing `/home` and `/staging` Space

<span name="check-home-quota-and-usage"></span>
### Check `/home` Quota and Usage
To see what disk and items quotas are currently set for your `/home` direcotry, use the 
`quota -vs` command. See the example below:

``` 
[alice@submit]$ quota -vs
Disk quotas for user alice (uid 20384): 
     Filesystem   space   quota   limit   grace   files   quota   limit   grace
      /dev/sdb1  12690M  20480M  30720M            161k       0       0        
```
{:.term}

The output will list your total data usage under `blocks` on the `/dev/sbd1` filesystem that manages user `/home` data: 
* `space` (MB): the amount of disk space you are currently using
* `quota` (MB): your soft `quota`. This is the value we recommend you consider to be your "quota". 
* `limit` (MB): the hard `limit` or absolute maximum amount of space you can use. This value is almost always 10GB larger than your soft quota, and is only provided as a helpful spillover space. **Once you hit this hard limit value, you and your jobs will no longer be allowed to save data.**
* `files`: the number of files in your `/home` directory. `/home` does not typically restrict the number of files a user can have, which is why there are no values for file `quota` and `limit`

Each of the disk space values are given in megabytes (MB), which can be converted to gigabytes (GB) by dividing by 1024. 

<span name="check-staging-quota-and-usage"></span>

### Check `/staging` Quota and Usage

To see your `/staging` quota and usage, use the `get_quotas <NetID>` command. For example, 
```
[NetID@ap2001 ~]$ get_quotas /staging/NetID
```
{:.term}

If the output of this command is blank, it means you do not have a `/staging` directory. Contact CHTC staff to request one at any time. 

<span name="alt-commands-to-check-quotas"></span>

### Alternative Commands to Check Quotas
Alternatively, the `ncdu` command can also be used to see how many 
files and directories are contained in a given path:

``` 
[NetID@ap2001 ~]$ ncdu /home/NetID
[NetID@ap2001 ~]$ ncdu /staging/NetID
```
{:.term}

When `ncdu` has finished running, the output will give you a total file
count and allow you to navigate between subdirectories for even more
details. Type `q` when you\'re ready to exit the output viewer. More
info here: <https://lintut.com/ncdu-check-disk-usage/>

<span name="request-a-quota-increase"></span>
### Request a Quota Increase
Increased quotas on either of these locations are available upon email 
request to [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) after a user has 
cleared out old data and run relevant test jobs to inform the request. In your request, 
please include both size (in GB) and file/directory counts. If you don\'t 
know how many files your installation creates, because it\'s more than 
the current items quota, simply indicate that in your request.
