---
layout: guide
title: "Quick reference: HTCondor Submission commands"
alt_title: "Quick reference: HTCondor Submission commands"
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

| Command | Use | Example | Notes |
| --- | --- | --- | --- |
| `condor_submit` | submits job(s) as specified by `submit_file` | `condor_submit helloWorld.sub` | See [monitor your jobs](condor_q) |
| `condor_submit -i <submit_file>` | submits an interactive job as specified by `submit_file` | `condor_submit -i helloWorld.sub`| 
| `condor_submit <submit_file> -append <attribute>` | appends Condor commands to `submit_file` during submission | `condor_submit helloWorld.sub -append "request_disk = 1GB"`| commands are added inplace prior to the `queue` command while leaving the `submit_file` unedited. Can pass `queue` commands as appended, if needed. |
{:.command-table}

## Basic Submit File Options

These commands display information about the execution points - machines that execute/run jobs.

| Command | Use | Example | Notes |
| --- | --- | --- | --- |
| `arguments = "<args>"` | lists arguments to be passed to the executable as part of the command line | `arguments = "hello world` ("hello", "world" are passed as two separate arguments)| arguments are wrapped by quotes(") and space separated |
| `environment = <parameter_list>` | lists environmental variables | `environment = "VARIABLE1=Value1 VAR2='hello world'"` | wrapped by quotes(") and space separated |
| `log = <job.log>` | denotes the path to the log file | `log = ./log_files/job1.log`| if not provided, no log file is recorded |
| `output = <job.out>` | path to file capturing `stdout` screen output | `output = ./log_files/job1.out` | can be merged with `stderr` by denoting the same path in `error = <path>` |
| `error = <job.err>` | path to file capturing `stderr` screen output | `output = ./log_files/job1.err` | can be merged with `stdout` by denoting the same path in `output = <path>` |
| `executable = <executable.sh>` | path to the executable script | `executable = helloWorld.py` | the executable script is automatically transferred to the Execution Point (EP) by HTCondor |
| `notification = <Always, Complete, Error, or None>` | lists all attributes of `execution_point` |
{:.command-table}

## Managing File Transfers in HTCondor

These commands display information about the execution points - machines that execute/run jobs.

| Command | Use | Example | Notes |
| --- | --- | --- | --- |
| `transfer_input_files = ` | lists all execution point slots |
| `transfer_input_files = ` | lists information about the specified `execution_point` |
| `log = <job.log>` | lists all attributes of `execution_point` |
| `out = <job.out>` | lists all attributes of `execution_point` |
| `error = <job.err>` | lists all attributes of `execution_point` |
| `executable = <executable.sh>` | lists all attributes of `execution_point` |
| `notification = <Always, Complete, Error, or None>` | lists all attributes of `execution_point` |
{:.command-table}

## Controlling Where Your Job Runs

These commands display information about the execution points - machines that execute/run jobs.

| Command | Use | Example | Notes |
| --- | --- | --- | --- |
| `request_cpus = <int>` | lists all execution point slots |
| `request_disk = <quantity>` | lists information about the specified `execution_point` |
| `request_memory = <quantity>` | lists all attributes of `execution_point` |
| `request_gpus = <int>` | lists all attributes of `execution_point` |
| `requirements = <ClassAd Boolean>` | lists all attributes of `execution_point` |
| `gpus_minimum_capacity = <version>` | lists all attributes of `execution_point` |
| `cuda_version = <version>` | lists all attributes of `execution_point` |
{:.command-table}

## Controlling How Your Job Runs

These commands display information about the execution points - machines that execute/run jobs.

| Command | Use | Example | Notes |
| --- | --- | --- | --- |
| `universe = <vanilla, docker, or container>` | lists all execution point slots |
| `container_image = ` | lists information about the specified `execution_point` |
| `container_target_dir = </path/to/dir >` | lists all attributes of `execution_point` |
{:.command-table}

## Queue Statement Options

These commands display information about the execution points - machines that execute/run jobs.

| Command | Use | Example | Notes |
| --- | --- | --- | --- |
| `queue` | lists all execution point slots |
| `queue <int>` | lists information about the specified `execution_point` |
| `queue <var> from <list>` | lists all attributes of `execution_point` |
| `queue <var1>, <var2> from <list>` | lists all attributes of `execution_point` |
| `queue <int_expr>, <var2> from <list>` | lists all attributes of `execution_point` |
| `queue <var1> <var> in [slice] <list>` | lists all attributes of `execution_point` |
| `queue <var> matching <globbing_string>` | lists all attributes of `execution_point` |
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
