---
highlighter: none
layout: hpc_layout
title: Reviewing Job Information Using SLURM
guide: 
    order: 1
    category: Job Submission
    tag:
        - hpc
---

The HPC Cluster uses SLURM to manage jobs on the HPC Cluster. This page describes 
how to review job performance and monitor other job information. 

{% capture content %}
- [View Job Performance with `seff`](#view-job-performance-with-seff)
- [View Job Information with `sacct`](#view-job-information-with-sacct)
   * [How To Select Jobs](#how-to-select-jobs)
   * [Displaying Specific Fields](#displaying-specific-fields)
   * [Recommended Fields](#recommended-fields)
   * [Other Useful Options](#other-useful-options)
   * [A Sample `sacct` Query](#a-sample-sacct-query)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

The following assumes that you have been granted access to the HPC cluster 
and can log into the head node `spark-login.chtc.wisc.edu`. If this is not
the case, please see the [CHTC account application page](form.html) or email
the facilitation team at chtc@cs.wisc.edu. 


## View Job Performance with `seff`

The `seff` command will print out a summary of usage and efficiency metrics for 
a specific job. The usage and output looks like this: 

```
[alice@login]$ seff 79950
Job ID: 79950
Cluster: spark_el9
User/Group: alice/alice
State: COMPLETED (exit code 0)
Nodes: 1
Cores per node: 16
CPU Utilized: 00:00:08
CPU Efficiency: 1.61% of 00:08:16 core-walltime
Job Wall-clock time: 00:00:31
Memory Utilized: 876.69 MB (estimated maximum)
Memory Efficiency: 2.74% of 31.25 GB (1.95 GB/core)
```
{:.term}

## View Job Information with `sacct`

SLURM saves jobs information in a database that can be queried using the `sacct` command. 

> **If you are having trouble viewing output from `sacct` try running this command first**
> 
> ```
> [alice@login]$ sacct --start=2018-01-01
> ```
> {:.term}


### How To Select Jobs

By default `sacct` shows only your jobs, that ran or were submitted on the current 
date. See the following list for different ways to select groups of jobs to review. Some of the options -- especially the time and user options -- can both be added to the same query. 

- To display information about a **specific job or list of jobs** use `-j` or `--jobs` followed by a job number or comma separated list of job numbers.
	
```
[alice@login]$ sacct --jobs job1,job2,job3
```
{:.term}
<!-- Sample output -->

- To select information about jobs in a **certain date range** use `--start` and `--end` Without it, `sacct` will only return jobs from the current day.

```
[alice@login]$ sacct --start=YYYY-MM-DD
```
{:.term}

- To select information about jobs in a **certain time range** use `--starttime` and `--endtime` The default start time is 00:00:00 of the current day, unless used with `-j`, then the default start time is Unix Epoch 0. The default end time is time of running the command. Valid time formats are
```
HH:MM[:SS] [AM|PM]
MMDD[YY] or MM/DD[/YY] or MM.DD[.YY]
MM/DD[/YY]-HH:MM[:SS]
YYYY-MM-DD[THH:MM[:SS]] 
```

```
[alice@login]$ sacct --starttime 08/23 --endtime 08/24
```
{:.term}

- To display another **user's** jobs use `--user`
	
```
[alice@login]$ sacct --user BuckyBadger
```
{:.term}
<!-- Sample output -->

### Displaying Specific Fields

`sacct` can display different fields about your jobs. You can use the `--helpformat` flag to get a full list.

```	
[alice@login]$ sacct --helpformat
```
{:.term}

Once you know what fields to display, the format flag will allow you to list the ones you want to see:

```	
[alice@login]$ sacct --format=JobId,Partition,NCpus,NNodes,State,Elapsed
``` 

### Recommended Fields

When looking for information about your jobs CHTC recommends using these fields
```
elapsed
end
exitcode
jobid
ncpus
nnodes
nodelist
ntasks
partition
start
state
submit
user
```

### Other Useful Options

To only show statistics relevant to the job allocation itself, not taking steps into consideration, use `-X`. This can be useful when trying to figure out which part of a job errored out.
	
```
[alice@login]$ sacct -X
```
{:.term}
<!-- Sample Output -->

### A Sample `sacct` Query

For example to view all of your jobs since January 1, 2024, printing 
out which partition you used, how many nodes, and what the final status of the job was, 
use: 

```
[alice@login]$ sacct -X --start=2024-01-01 --format=jobid,partition,nnodes,state
```
{:.term}


