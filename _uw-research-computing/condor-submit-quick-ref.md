---
layout: guide
title: "Quick reference: HTCondor Submission commands"
alt_title: "Quick reference: HTCondor Submission commands"
guide:
    category: Get started
    tag: htc
---

## Introduction

This page lists common HTCondor commands and options for jobs. Users familiar with HTCondor and job submission on CHTC's High Throughput Computing (HTC) system can use this page as a quick reference. For users who are just starting out, we suggest reading our linked guides to understand the full context of each command or option.

{% capture content %}
- [Introduction](#introduction)
- [Commands to submit jobs](#commands-to-submit-jobs)
- [Basic submit file options](#basic-submit-file-options)
- [Transfer files](#transfer-files)
- [Request resources](#request-resources)
- [Software environment](#software-environment)
- [Submit multiple jobs](#submit-multiple-jobs)
- [HTCondor default variables](#htcondor-default-variables)
- [Scale beyond local capacity](#scale-beyond-local-capacity)
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

See [job submission basics](htcondor-job-submission)

| Command | Use | Notes and Examples                                                                                                                                                                                                                        |
| --- | --- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `condor_submit <submit_file>` | submits job(s) as specified by `submit_file` | **Example:** <br>`condor_submit helloWorld.sub`                                                                                                                              |
| `condor_submit -i <submit_file>` | submits an interactive job as specified by `submit_file` | **Example:** <br>`condor_submit -i helloWorld.sub`                                                                                                                                                                                        |
{:.command-table}

## Basic submit file options

| Option                           | Use | Notes and Examples                                                                                                                                 |
|----------------------------------| --- |----------------------------------------------------------------------------------------------------------------------------------------------------|
| `executable = <executable.sh>`   | path to the executable script or binary | The executable is automatically transferred to the Execution Point (EP) by HTCondor. <br><br> **Example:** <br>`executable = helloWorld.py` |
| `arguments = "<args>"`           | lists arguments to be passed to the executable as part of the command line | Arguments are wrapped by quotes (") and space separated. Embed spaces using single quotes.<br><br> **Example:** <br>`arguments = "--print 'hello world'"`   |
| `log = <job.log>`                | denotes the path to the log file | We recommend always specifying `log` to help with troubleshooting. If `log` is not provided, no log file is written. <br><br> **Example:** <br>`log = log_files/job1.log` |
| `output = <job.out>`             | denotes the path to the file capturing `stdout` screen output | Can be merged with `stderr` by denoting the same path in `error = <path>`. <br><br> **Example:** <br>`output = log_files/job1.out` |
| `error = <job.err>`              | denotes the path to file capturing `stderr` screen output | **Example:** <br>`error = log_files/job1.err`  |
{:.command-table}

## Transfer files

Visit our [file transfer guide](htc-job-file-transfer) for more details.

| Option                                                     | Use | Notes and Examples                                                                                                                                                                                                                                                             |
|------------------------------------------------------------| --- |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `transfer_input_files = <file1>, <file2>`                                  | lists all the input files to be transferred to the Execute Point (EP) | Comma-separated list. Various file transfer protocols can be used including `file:///`, `osdf:///`, `pelican:///`, and `s3:///`. <br><br> **Examples:** <br> `transfer_input_files = osdf:///chtc/staging/...`                                                                 |
| `transfer_output_files = <file1>, <file2>`                                 | explicitly lists the path to files on the EP to be returned to the working directory on the AP. | If this is not specified, HTCondor will only transfer new and changed **files** in the top-level directory of the Execution Point. Subdirectories are not transferred. <br><br> **Example:**<br>`transfer_output_files = results.txt`|
| `transfer_output_remaps = "<file>=<new_path>; <file2>=<new_path>"` | remaps output files to a specified path. Can be used for renaming files. | Delimited by semicolons. Can be used in conjunction with various file transfer protocols. <br><br> **Example:** <br>`transfer_output_remaps = "results.txt=osdf:///chtc/staging/<user>/job1_results.txt"` |
{:.command-table}

## Request resources

| Option                                   | Use                                                                  | Notes and Examples                                                                                                                                                                       |
|------------------------------------------|----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `request_cpus = <integer>`                   | requests number of CPUs (cores)                                      | **Example:** <br>`request_cpus = 4`                                                                                                                                                      |
| `request_disk = <quantity>`              | requests disk space (Default in KiB)                                 | Can use units like `K`, `M`, `G`, or `T`. <br><br> **Example:** <br>`request_disk = 40GB`                                                                                                |
| `request_memory = <quantity>`            | requests memory for job (Default in MB)                              | **Example:** <br>`request_memory = 250GB`                                                                                                                                                |
| `request_gpus = <integer>`                   | requests number of GPUs                                              | See our [GPU jobs guide](gpu-jobs). |
| `gpus_minimum_capability = <version>`    | sets minimum GPU capability               | **Example:** <br>`gpus_minimum_capability = 8.5`                                                                                                                                         |
| `gpus_maximum_capability = <version>`    | sets maximum GPU capability                | **Example:** <br>`gpus_maximum_capability = 9.0`                                                                                                                                         |
| `gpus_minimum_memory = <quantity>` | requests minimum GPU VRAM memory (Default in MB)                 | **Example:** <br>`gpus_minimum_memory = 3200`                                                                                                                                            |
| `requirements = <ClassAd Boolean>`       | sets job execution constraints                                       | See [ClassAd reference](https://htcondor.readthedocs.io/en/latest/classad-attributes/job-classad-attributes.html). <br><br> **Example:** <br>`requirements = (OpSysAndVer == "RedHat9")` |

{:.command-table}

_For more information on submitting GPU jobs, please visit our [Using GPUs](gpu-jobs.md) guide._

## Software environment

| Option                           | Use | Notes and Examples                                                                                                                |
|----------------------------------| --- |-----------------------------------------------------------------------------------------------------------------------------------|
| `container_image = <image_file>` | defines container image path | Can pull from DockerHub or use a local `.sif` file. <br><br> **Example:** <br>`container_image = docker://pytorch/pytorch:latest` |
| `environment = <parameter_list>` | lists environmental variables for use in your jobs | Wrapped by quotes(") and space separated. <br><br> **Example:** <br>`environment = "VARIABLE1=Value1 VAR2='hello world'"`                          |
{:.command-table}

_Note: For more information on using containers in your jobs, please visit our [Using Apptainer Containers](apptainer-htc) or [Running HTC Jobs Using Docker Containers](docker-jobs) guide._

## Submit multiple jobs

See our [multiple jobs guide](multiple-jobs#variables).

| Option                                   | Use | Notes and Examples                                                                                                                         |
|------------------------------------------| --- |--------------------------------------------------------------------------------------------------------------------------------------------|
| `queue`                                  | submits a single job | If no other options specified, submits one job.                                                                                             |
| `queue <int>`                            | submits multiple copies of the job | **Example:** <br>`queue 10`                                                                                                                |
| `queue <var> from <file>`                | submits jobs using values from a file | The `<var>` value(s) can be used elsewhere in the submit file.<br><br> **Example:** <br>`queue name from listOfEmployeeNames.txt` |
| `queue <var1>,<var2> from <file>`        | submits jobs using multiple vars from file | **Example:** <br>`queue first, last from listOfEmployeeNames.txt`                                                                        |
| `queue <var> in [slice] <list>`          | submits jobs using Python-style slicing | **Example:** <br>`queue name in [5:18] listOfEmployeeNames.txt`                                                                          |
| `queue <var> matching <globbing_string>` | submits jobs from file pattern matches | **Example:** <br>`queue sampleID matching samples/sampleID_*`                                                                            |
{:.command-table}

## HTCondor default variables

| Option | Use | Notes and Examples | 
| --- | --- | --- |
| `$(Cluster)` | The unique job ID generated for each job submission. | **Example:** <br>`log = job_$(Cluster).log` generates a unique log file, i.e., `job_12345.log` |
| `$(Process)` | The unique process ID generated for each job in a cluster of submissions. Starts at `0`. | **Example:** <br>`out = $(Cluster)_$(Process).out` generates a unique stdout file for each job, i.e., `12345_0.out`, `12345_1.out`, `12345_2.out` |

## Scale beyond local capacity

These options are best for short (<8hr) or checkpointable jobs. Expands matching opportunities across campus. Read more about [scaling beyond local capacity](scaling-htc). **Do not include `HasCHTCStaging` in the requirements**.

| Option | Use |
| --- | --- | --- |
| `want_campus_pools = true` | Allows jobs to run on other HTCondor pools on campus (e.g., UW Grid) |
| `want_ospool = true`       | Allows jobs to match to the national Open Science Pool (OSPool)      |
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

