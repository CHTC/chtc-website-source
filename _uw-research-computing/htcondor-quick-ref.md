
layout: guide
title: "Quick reference: HTCondor commands"
alt_title: "Quick reference: HTCondor commands"
guide:
    category: Get started
    tag: htc
---

## Introduction

This page lists common HTCondor commands and options for jobs. Users familiar with HTCondor and job submission on CHTC's High Throughput Computing (HTC) system can use this page as a quick reference. For users who are just starting out, we suggest reading the full guides (linked) to understand the full context of each command or option.

{% capture content %}
- [Introduction](#introduction)
- [Submit jobs](#submit-jobs)
- [Monitor jobs](#monitor-jobs)
- [Machine information](#machine-information)
- [Glossary](#glossary)
- [Related Pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

> **Please note the following!** 
> 
> * Bracketed items (`<>`) denote where to place your input. 
>   Do not include the brackets in your command.
> * All commands should be entered on a single line.

## Submit jobs

You can use these commands to submit, hold, or remove your jobs.

| Command | Use | Notes |
| --- | --- | --- |
| `condor_submit <submit_file>` | submits job(s) as specified by `submit_file` | See [job submission](htcondor-job-submission) |
| `condor_submit -i <submit_file>` | submits an interactive job as specified by `submit_file` |
| `condor_rm <username>` | removes all of your jobs | 
| `condor_rm <job_ID>` | removes the job(s) associated with `job_ID` |
| `condor_hold <job_ID>` | holds the job(s) associated with `job_ID` |
| `condor_release <job_ID>` | releases the held job(s) associated with `job_ID` |
| `condor_ssh_to_job <job_ID>` | allows you to "ssh" to the execution point on which the job associated with `job_ID` is running on |
{:.command-table}

## Monitor jobs

| Command | Use | Notes |
| --- | --- | --- |
| `condor_q` | displays status of your submitted jobs; jobs are batched by default | See [monitor your jobs](condor_q) |
| `condor_q -nobatch` | displays status of your submitted jobs without the batched view |
| `condor_q <job_ID>` | displays status of the job(s) associated with `job_ID` |
| `condor_q -l <job_ID>` | lists all attributes of the job(s) associated with `job_ID` |
| `condor_q -hold <job_ID>` | displays the hold reason for job(s) associated with `job_ID` |
| `condor_q -better-analyze <job_ID>` | displays *simulated* results of the matching process associated with the job | This is a *starting point* for troubleshooting jobs sitting in the idle state. |
| `condor_watch_q` | displays the "real-time" status of your jobs | Updated every 2 seconds. `CTRL + C` to exit. |
| `condor_tail <job_ID>` | prints the last 10 lines of the standard output the job associated with `job_ID` |
{:.command-table}

## Machine information

These commands display information about the execution points - machines that execute/run jobs.

| Command | Use | Notes |
| --- | --- | --- |
| `condor_status` | lists all execution point slots |
| `condor_status <execution_point>` | lists information about the specified `execution_point` |
| `condor_status -l <execution_point>` | lists all attributes of `execution_point` |
| `condor_status -compact` | lists all execution_point slots in a compact view |
| `condor_status -gpus` | lists all execution_point slots with GPUs |
{:.command-table}

## Glossary

| Term | Meaning |
| --- | --- |
| access point | The machine which you log into to access CHTC's servers. This is the machine you use to prepare files for job submission and submit jobs. |
| cluster ID | A unique number associated with a single job submission. |
| error file / standard error | The file in which your job typically prints any errors. |
| execution point | The machine that executes or runs your job. |
| held/hold | A job state in which your job has stopped running due to an error. |
| idle | A job state in which your job has not yet matched to an execution point and hasn't started running yet. |
| job ID | The unique number associated with a job. This consists of a cluster ID, followed by a period and a process ID. For example, the job ID `12345.0` has a cluster ID of `12345` and a process ID of `0`. |
| log file | The file where HTCondor prints messages about your job's execution and resource usage. |
| output file / standard out | The file where your job typically prints output. Any messages printed to the "screen" in a job will be saved in this file. |
| process ID | A unique number associated with each job within a job submission. See [submit multiple jobs](multiple-jobs). |
| running | A job state in which your job has matched to the execution point and is currently executing/running. |
| submit file | A text-based file that tells HTCondor details about your job, including the commands to run, what files need to be transferred, where to save the outputs, and more. See the [job submission](htcondor-job-submission). |

## Related Pages

* [Job submission](htcondor-job-submission)
* [Monitor your jobs](condor_q)
* [HTCondor manual](https://htcondor.readthedocs.io/en/latest/)
