---
highlighter: none
layout: guide
title: Monitor your jobs
guide:
    category: Submit jobs
    tag:
        - htc
---

## Introduction

This guide outlines how to monitor your jobs. Use this guide to check on your jobs' statuses, check on their standard output/error messages, or connect to a running job.

{% capture content %}
- [Introduction](#introduction)
- [Watch your jobs with `condor_watch_q`](#watch-your-jobs-with-condor_watch_q)
- [Check your jobs' status with `condor_q`](#check-your-jobs-status-with-condor_q)
- [Check the your jobs' progress with `condor_tail`](#check-the-your-jobs-progress-with-condor_tail)
- [Connect to your job with `condor_ssh_to_job`](#connect-to-your-job-with-condor_ssh_to_job)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Watch your jobs with `condor_watch_q`

For a real-time view of your jobs' status, run the `condor_watch_q` tool. For example:

```
[netid@ap2002 ~]$ condor_watch_q
BATCH    IDLE  INPUT  RUN  DONE  TOTAL  JOB_IDS
4839429    -      -    1     -      1   4839429.0               [====================]
4839838    1      6    -     3     10   4839838.1 ... 4839838.9 [-->>>>>>>>>>>>######]

Total Progress: [----->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>=====###################]

Total: 11 jobs; 3 completed, 1 idle, 7 running

Updated at 2026-04-06 16:13:39
Press any key to exit
```
{:.term}

`condor_watch_q` updates every second with color-coded output on your terminal by reading your HTCondor log file (specified by the `log` attribute in your submit file).

## Check your jobs' status with `condor_q`

To check the status of your jobs, use the command `condor_q` on the Access Point. For example:

```
[netid@ap2002]$ condor_q

-- Schedd: ap2002.chtc.wisc.edu : <128.104.101.92:9618?... @ 04/14/23 15:35:17
OWNER     BATCH_NAME     SUBMITTED   DONE   RUN    IDLE  TOTAL JOB_IDS
netid ID: 3606214       4/14 12:31      2     1       _      3 36062145.0-2
   
3 jobs; 2 completed, 0 removed, 0 idle, 1 running, 0 held, 0 suspended
```
{:.term}

### `condor_q` options

Additional options are available for the `condor_q` command. See the table below.

| Command | Use | Notes |
| --- | --- | --- |
| `condor_q` | displays status of your submitted jobs; jobs are batched by default |
| `condor_q -nobatch` | displays status of your submitted jobs without the batched view |
| `condor_q <job_ID>` | displays status of the job(s) associated with `job_ID` |
| `condor_q -l <job_ID>` | lists all attributes of the job(s) associated with `job_ID` | |
| `condor_q -hold <job_ID>` | displays the hold reason for job(s) associated with `job_ID` |
| `condor_q -better-analyze <job_ID>` | displays *simulated* results of the matching process associated with the job | This is a *starting point* for troubleshooting jobs sitting in the idle state. |
| `condor_q -run` | displays your running jobs |
| `condor_q -dag` | organizes the `condor_q` output by DAGs |
| `condor_q -af <attribute1> <attribute2>` | displays specific attributes of jobs. | See the attributes from `condor_q -l` or [HTCondor job attributes](https://htcondor.readthedocs.io/en/latest/classad-attributes/job-classad-attributes.html). |
{:.command-table}

> ### ⛔ Do not run `watch condor_q`
{:.tip-header}

> Do not run `watch condor_q` or any equivalent command that queries `condor_q` in high frequency. This will overwhelm the scheduler and reduce operational efficiency for all users.
>
> Use `condor_watch_q` instead, or [contact us](get-help) for help on addressing your specific needs.
{:.tip}

## Check the your jobs' progress with `condor_tail`

To check on the progress of currently running jobs, you can use `condor_tail <job_ID>` to read the last few lines of a file in your job's scratch directory. For example:

```
[netid@ap2002 ~]$ condor_tail 4839838.6
inflating: data/8724.jpg
  inflating: data/8725.jpg
  inflating: data/8726.jpg
  inflating: data/8727.jpg
  inflating: data/8728.jpg
```
{:.term}

By default, `condor_tail` prints the standard output.

| Command | Use |
| --- | --- |
| `condor_tail <job_ID>` | print the last few lines of the standard output |
| `condor_tail -stderr <job_ID>` | print the last few lines of the standard error |
| `condor_tail <job_ID> <filename>` | print the last few lines of `<filename>` in the job's scratch directory |

## Connect to your job with `condor_ssh_to_job`

You can connect to a currently running job by using `condor_ssh_to_job`. When you're done with the session, type `exit` to return to the Access Point.

```
[netid@ap2002 ~]$ condor_ssh_to_job 4839849.0
Welcome to slot1_135@e4031.chtc.wisc.edu!
Your condor job is running with pid(s) 3406940.
 == NOTICE: THIS NODE IS ON PUPPET ENVIRONMENT "puppet8" ==

[netid@e4031 scratch]$ exit
logout
Connection to condor-job.e4031.chtc.wisc.edu closed.
```
{:.term}

> ### ⚠️ Policy for `condor_ssh_to_job`
{:.tip-header}

> This tool is intended for quick checks and troubleshooting. This is NOT intended for interactive job submission. For interactive jobs, use the `-i` flag, i.e.,
>
> `condor_submit -i <submit_file>`.
>
> **`condor_ssh_to_job` is NOT available for GPU jobs on CHTC's shared GPU machines. See [our interactive GPU jobs guide](htc-interactive-gpu-jobs) for more details.**
{:.tip}

## Related pages
* [Job submission basics](htcondor-job-submission)
* [Quick reference: HTCondor commands](htcondor-quick-ref)
* [Interactive GPU jobs](htc-interactive-gpu-jobs)