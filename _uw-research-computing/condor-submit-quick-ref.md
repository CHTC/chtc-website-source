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

## Submit jobs

You can use these commands to submit jobs to HTCondor. 

| Command | Use | Example | Notes |
| --- | --- | --- | --- |
| `condor_submit` | submits job(s) as specified by `submit_file` | `condor_submit helloWorld.sub` | See [monitor your jobs](condor_q) 
| `condor_submit -i <submit_file>` | submits an interactive job as specified by `submit_file` | `condor_submit -i helloWorld.sub`
| `condor_submit <submit_file> -append <attribute>` | appends Condor commands to `submit_file` during submission | `condor_submit helloWorld.sub -append "request_disk = 1GB"`| commands are added inplace prior to the `queue` command while leaving the `submit_file` unedited. Can pass `queue` commands as appended, if needed. 
{:.command-table}

## Basic Submit File Options

These commands specify the basic submit file options needed to start a job on HTCondor 

| Command | Use | Example | Notes |
| --- | --- | --- | --- |
| `arguments = "<args>"` | lists arguments to be passed to the executable as part of the command line | `arguments = "hello world` | arguments are wrapped by quotes(") and space separated |
| `environment = <parameter_list>` | lists environmental variables | `environment = "VARIABLE1=Value1 VAR2='hello world'"` | wrapped by quotes(") and space separated |
| `log = <job.log>` | denotes the path to the log file | `log = ./log_files/job1.log`| if not provided, no log file is recorded |
| `output = <job.out>` | path to file capturing `stdout` screen output | `output = ./log_files/job1.out` | can be merged with `stderr` by denoting the same path in `error = <path>` |
| `error = <job.err>` | path to file capturing `stderr` screen output | `output = ./log_files/job1.err` | can be merged with `stdout` by denoting the same path in `output = <path>` |
| `executable = <executable.sh>` | path to the executable script | `executable = helloWorld.py` | the executable script is automatically transferred to the Execution Point (EP) by HTCondor |
| `notification = <Always, Complete, Error, or None>` | notifies by e-mail when certain events occur | | **use carefully:* it can create an large # of inbound emails for multi-job HTCondor clusters |
{:.command-table}

## Managing File Transfers in HTCondor

These commands control how and when files are transferred during submission and following job ending 

| Command | Use | Example | Notes |
| --- | --- | --- | --- |
| `transfer_input_files = ` | lists all the input files to be transferred to the Execute Point (EP) | `transfer_input_files = /staging/<user>/<dir>` <br><br> `transfer_input_files = <protocol>:///chtc/<path>` | comma-separated list various file transfer protocols can be used in `transfer_input_files` including `file:///`, `osdf:///`, `pelican:///`, and `s3:///`|
| `transfer_output_files = ` | explicitly lists the path to files to be returned to the Access Point (AP) from the Execute Point (EP) | `transfer_output_files = ./output_files/results.txt` | |
| `transfer_output_remaps = "<path_on_EP> = <new_path_on_AP>` | remaps (redirects or renames) output files explicitly listed to the Access Point (AP) on job completion | `transfer_output_remaps = "./results.txt = /staging/<user>/job1_results.txt` (saves results.txt as `/staging/<user>/job1_results.txt`) | |
| `when_to_transfer_output = <ON_EXIT, ON_EXIT_OR_EVICT, or ON_SUCCESS>` | causes HTCondor to transfer job outputs based on the job's exit code | |
{:.command-table}

## Controlling Where Your Job Runs

These commands control where you job, runs on which Execution Points, and what your job requires to match/run

| Command | Use | Example | Notes |
| --- | --- | --- | --- |
| `request_cpus = <int>` | requests number of CPUs (cores)|
| `request_disk = <quantity>` | requests amount of disk space (Default in KB) | `request_disk = 40GB` | can denote kilobytes using `K` or `KB`, megabytes using `M` or `MB`, gigabytes using `G` or `GB`, or terrabytes using `T` or `TB` |
| `request_memory = <quantity>` | requests amount of memory for job (Default in KB) | `request_memory = 250GB` | |
| `request_gpus = <int>` | requests number of GPUs | | if not specified, no GPUs requested |
| `requirements = <ClassAd Boolean>` | appends additional requirements to the job submission file | `Requirements = (OpSysAndVer == "RedHat9")`| See PAGEHERE for all requirement options
| `gpus_minimum_capacity = <version>` | minimum GPU Capability value | `gpus_minimum_capability = 8.5` | 
| `gpus_minimum_runtime = <version>` | minimum GPU runtime (usually CUDA) version | `gpus_minimum_runtime = 9.1` | 
| `cuda_version = <version>` | specifies version of CUDA to be used | | superceeded by `gpus_minimum_runtime` |
{:.command-table}

## Controlling How Your Job Runs

These commands control how your job environment behaves on the Execution Point (EP)

| Command | Use | Example | Notes |
| --- | --- | --- | --- |
| `universe = <vanilla or container>` | specifies which HTCondor universe environment to use when running this job | | `universe = vanilla` is the default HTCondor environment <br> `universe = container` specifies an environment built for running container images (Docker, Apptainer, and Singularity)|
| `container_image = <image_file>` | specifies the path to a container image to be used | `container_image = docker://pytorch/pytorch:latest` | can pull image from DockerHub or load `.sif` files directly |
{:.command-table}

## Queue Statement Options

These commands control how many jobs (and what jobs) are queued by HTCondor for execution

| Command | Use | Example | Notes |
| --- | --- | --- | --- |
| `queue` | command line queuing the job to start | | if no other options specified, a single job is queued |
| `queue <int>` | places zero or more copies of the job into the HTCondor queue | `queue 10` | |
| `queue <var> from <list>` | places copies of the job in the queue based on the lines in a comma-separated list `<list>` or `<file>` | `queue name from ./listOfEmployeeNames.txt` | the `<var>` value(s) can be passed as an environment or argument variable |
| `queue <var> in [slice] <list>` | places jobs in the queue using a python style slice selecting only some of the items in the list of items | `queue name in [5:18] ./listOfEmployeeNames.txt` | 
| `queue <var> matching <globbing_string>` | places jobs in the queue based on globbing matches of files/directories in a path | `queue sampleID matching ./samples/sampleID_*` | |
{:.command-table}

## Glossary

| Term | Meaning |
| --- | --- |
| access point | The machine which you log into to access CHTC's servers. This is the machine you use to prepare files for job submission and submit jobs. |
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
