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
- [Basic Submit File Options](#basic-submit-file-options)
- [Managing File Transfers in HTCondor](#managing-file-transfers-in-htcondor)
- [Controlling Where Your Job Runs](#controlling-where-your-job-runs)
- [Controlling How Your Job Runs](#controlling-how-your-job-runs)
- [Queue Statement Options](#queue-statement-options)
- [Glossary](#glossary)
- [Related Pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

> **Please note the following!** 
> 
> * Bracketed items (`<>`) denote where to place your input. 
>   Do not include the brackets in your command.
> * All commands should be entered on a single line.

## Commands to submit jobs

| Command | Use | Notes and Examples                                                                                                                                                                                                                        |
| --- | --- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `condor_submit` | submits job(s) as specified by `submit_file` | See [monitor your jobs](htcondor-job-submission.md) <br><br> **Example:** <br>`condor_submit helloWorld.sub`                                                                                                                              |
| `condor_submit -i <submit_file>` | submits an interactive job as specified by `submit_file` | **Example:** <br>`condor_submit -i helloWorld.sub`                                                                                                                                                                                        |
{:.command-table}

## Basic Submit File Options

| Option                           | Use | Notes and Examples                                                                                                                                 |
|----------------------------------| --- |----------------------------------------------------------------------------------------------------------------------------------------------------|
| `executable = <executable.sh>`   | path to the executable script | The executable script is automatically transferred to the Execution Point (EP) by HTCondor. <br><br> **Example:** <br>`executable = helloWorld.py` |
| `arguments = "<args>"`           | lists arguments to be passed to the executable as part of the command line | Arguments are wrapped by quotes(") and space separated. Embed spaces using single quotes.<br><br> **Example:** <br>`arguments = "'hello world'"`   |
| `environment = <parameter_list>` | lists environmental variables | Wrapped by quotes(") and space separated. <br><br> **Example:** <br>`environment = "VARIABLE1=Value1 VAR2='hello world'"`                          |
| `log = <job.log>`                | denotes the path to the log file | We always recommend specifying `log`. If `log` is not provided, no log file is written. <br><br> **Example:** <br>`log = ./log_files/job1.log` |
| `output = <job.out>`             | path to file capturing `stdout` screen output | Can be merged with `stderr` by denoting the same path in `error = <path>`. <br><br> **Example:** <br>`output = ./log_files/job1.out` |
| `error = <job.err>`              | path to file capturing `stderr` screen output | Can be merged with `stdout` by denoting the same path in `output = <path>`. <br><br> **Example:** <br>`error = ./log_files/job1.err`  |
{:.command-table}

## File transfers options

Visit our [file transfers guide](htc-file-transfer) for more details.

| Option                                                     | Use | Notes and Examples                                                                                                                                                                                                                                                             |
|------------------------------------------------------------| --- |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `transfer_input_files = `                                  | lists all the input files to be transferred to the Execute Point (EP) | Comma-separated list. Various file transfer protocols can be used including `file:///`, `osdf:///`, `pelican:///`, and `s3:///`. <br><br> **Examples:** <br> `transfer_input_files = osdf:///chtc/staging/...`                                                                 |
| `transfer_output_files = `                                 | explicitly lists the path to files to be returned to the Access Point (AP) | If this is not specified, HTCondor will only transfer new and changed **files** in the top-level directory of the Execution Point. <br><br> **Example:** <br><br>`transfer_output_files = results.txt`|
| `transfer_output_remaps = "<path_on_EP>=<new_path_on_AP>"` | remaps output files to a new location on the AP upon job completion | File paths on the left side (e.g., ./results.txt) refer to locations on the Execution Point (EP), while remapped paths on the right side refer to the Access Point (AP). <br><br> **Example:** <br>`transfer_output_remaps = "results.txt=/staging/<user>/job1_results.txt"` |
{:.command-table}

## Request resources

| Option                                   | Use                                                                  | Notes and Examples                                                                                                                                                                       |
|------------------------------------------|----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `request_cpus = <int>`                   | requests number of CPUs (cores)                                      | **Example:** <br>`request_cpus = 4`                                                                                                                                                      |
| `request_disk = <quantity>`              | requests disk space (Default in KiB)                                 | Can use units like `K`, `M`, `G`, or `T`. <br><br> **Example:** <br>`request_disk = 40GB`                                                                                                |
| `request_memory = <quantity>`            | requests memory for job (Default in MB)                              | **Example:** <br>`request_memory = 250GB`                                                                                                                                                |
| `request_gpus = <int>`                   | requests number of GPUs                                              | If not specified, no GPUs requested.                                                                                                                                                     |
| `requirements = <ClassAd Boolean>`       | sets job execution constraints                                       | See [ClassAd reference](https://htcondor.readthedocs.io/en/latest/classad-attributes/job-classad-attributes.html). <br><br> **Example:** <br>`requirements = (OpSysAndVer == "RedHat9")` |
| `gpus_minimum_capability = <version>`    | sets minimum GPU capability to specify the GPU type                  | **Example:** <br>`gpus_minimum_capability = 8.5`                                                                                                                                         |
| `gpus_maximum_capability = <version>`    | sets maximum GPU capability to specify the GPU type                  | **Example:** <br>`gpus_maximum_capability = 9.0`                                                                                                                                         |
| `gpus_minimum_memory = <quantity in MB>` | specifies the minimum GPU VRAM memory to request                     | **Example:** <br>`gpus_minimum_memory = 3200`                                                                                                                                            |

{:.command-table}

_Note: For more information on submitting GPU jobs, please visit our [Using GPUs](gpu-jobs.md) guide._

## Specifying the software environment

| Option                           | Use | Notes and Examples                                                                                                                |
|----------------------------------| --- |-----------------------------------------------------------------------------------------------------------------------------------|
| `container_image = <image_file>` | defines container image path | Can pull from DockerHub or use a local `.sif` file. <br><br> **Example:** <br>`container_image = docker://pytorch/pytorch:latest` |
{:.command-table}

_Note: For more information on using containers in your jobs, please visit our [Using Apptainer Containers](apptainer-htc) or [Running HTC Jobs Using Docker Containers](docker-jobs) guide._

## Options for submitting a list of jobs

| Option                                   | Use | Notes and Examples                                                                                                                         |
|------------------------------------------| --- |--------------------------------------------------------------------------------------------------------------------------------------------|
| `queue`                                  | queues a single job | If no other options specified, queues one job.                                                                                             |
| `queue <int>`                            | queues multiple copies of the job | **Example:** <br>`queue 10`                                                                                                                |
| `queue <var> from <file>`                | queues jobs using values from file | The `<var>` value(s) can be used as arguments/environment variables. <br><br> **Example:** <br>`queue name from ./listOfEmployeeNames.txt` |
| `queue <var1>,<var2> from <file>`        | queues jobs using multiple vars from file | **Example:** <br>`queue first, last from ./listOfEmployeeNames.txt`                                                                        |
| `queue <var> in [slice] <list>`          | queues jobs using Python-style slicing | **Example:** <br>`queue name in [5:18] ./listOfEmployeeNames.txt`                                                                          |
| `queue <var> matching <globbing_string>` | queues jobs from file pattern matches | **Example:** <br>`queue sampleID matching ./samples/sampleID_*`                                                                            |
{:.command-table}

## Scale beyond local capacity
| Option                     | Use | Notes and Examples                                                                                                                         |
|----------------------------| --- |--------------------------------------------------------------------------------------------------------------------------------------------|
| `want_campus_pools = True` | Allows jobs to run on other HTCondor pools on campus (e.g., UW Grid) | Best for short (<8hr) or checkpointable jobs. Expands matching opportunities across campus. <br><br> **May not include `HasCHTCStaging` in the requirements**                            |
| `want_ospool = True`       | Allows jobs to match to the national Open Science Pool (OSPool)      | Best for short (<8hr) or checkpointable jobs. Significantly increases available compute slots. <br><br> **May not include `HasCHTCStaging` in the requirements**                         |
{:.command-table}

## Glossary

| Term | Meaning |
| --- | --- |
| access point | The machine you log into for submitting jobs (e.g., CHTC login node). |
| error file / standard error | The file where your job writes error messages. |
| execution point | The machine where your job actually runs. |
| held/hold | Job has encountered an issue and paused. |
| idle | Job hasn't matched to an execution point yet. |
| job ID | Unique ID made of `ClusterID.ProcID` like `12345.0`. |
| log file | Tracks job events and resource usage. |
| output file / standard out | File where job writes standard output (e.g., print statements). |
| process ID | ID of an individual job in a job cluster. |
| running | Job has matched and is currently running. |
| submit file | File specifying everything needed to run your job. |

## Related Pages

* [Practice: Submit HTC Jobs using HTCondor](htcondor-job-submission)
* [Monitor your jobs](condor_q)
* [HTCondor manual - condor_submit](https://htcondor.readthedocs.io/en/latest/man-pages/condor_submit.html)

