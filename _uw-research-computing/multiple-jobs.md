---
highlighter: none
layout: guide
title: Submitting Multiple Jobs Using HTCondor
alt_title: Submitting Multiple Jobs Using HTCondor
guide:
    category: Submit jobs
    tag:
        - htc
---

## Introduction

This guide shows you how to write a submit file to submit multiple jobs. This option is great for  submitting high throughput workloads, such as iterating over multiple datasets or parameters.

{% capture content %}
- [Introduction](#introduction)
- [Overview](#overview)
- [Option 1: Submit N number of jobs with `queue <N>`](#option-1-submit-n-number-of-jobs-with-queue-n)
- [Option 2: Submit multiple jobs that iterate over variables with `queue <variable> from <list>`](#option-2-submit-multiple-jobs-that-iterate-over-variables-with-queue-variable-from-list)
    * [Use multiple variables for each job](#use-multiple-variables-for-each-job)
- [Option 3: Organize jobs into individual directories](#option-3-organize-jobs-into-individual-directories)
   * [Example: Submit multiple jobs in different directories with `queue <variable> from <list>` ](#example-submit-multiple-jobs-in-different-directories-with-queue-variable-from-list)
   * [Example: Submit multiple jobs in different directories with `queue <variable> matching <pattern>` ](#example-submit-multiple-jobs-in-different-directories-with-queue-variable-matching-pattern)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Overview

HTCondor has tooling for submitting many jobs from a single submit file. Instead of writing a script to write 1000 `.sub` files, you can write **just one `.sub` file and submit it once**. Using this option also ensures reliable operation of the the login nodes.

> ### 💭 Considerations
{:.tip-header}

> The hardware of the submit server can be overwhelmed if there are a significant number of jobs submitted at once or rapidly starting and finishing. Plan ahead for the following scenarios: 
>
> 1. **If you plan to submit 10,000+ jobs at a time**, add `max_idle = 10000` to your submit file.
> 1. If you plan to submit 1000+ jobs, please make sure that each job has a minimum run time of 5 minutes (on average). **If your calculations are shorter than 5 minutes**, then modify your workflow to run multiple calculations per job.
{:.tip}

We recommend submitting multiple jobs by using one of these options:

1.  [**`queue <N>`**](#queueN). Submit *N* number of jobs. Useful for performing replications, looping through files named with numbers, and looping through a matrix where each job uses information from a specific row or column.
2.  [**`queue <var> from <list>`**](#variables). Loops through a list of file names, parameters, etc. as defined in separate text file. This is the **most flexible option**.
3.  [**Organize Jobs Into Individual Directories**](#initialdir). Great for pipelines using the same scripts but need outputs to be separated in their own directories.

> ### ⚠️ Avoid using HTCondor's default variables
{:.tip-header}
> The examples below will include the use of `$(variable_name)` to specify details like input file names, file locations (aka paths), etc. When selecting a custom variable name, **avoid** default HTCondor submit file variables:
> * `Cluster` or `ClusterID`
> * `Process` or `ProcID`
> * `batch_name`
> * `output`
> * `input`
> * `arguments`
{:.tip}

## Option 1: Submit N number of jobs with `queue <N>`

Use `queue N` to submit *N* number of jobs. Each job will be assigned a unique `Process` number from `0` to `N-1`. Because the `Process` variable is unique for each job, it can be used in the submit file to create unique filenames or paths for each job.

### Example: `queue 10`

```
batch_name = job_$(Cluster)

shell = echo $(Process)

log = $(batch_name).log
error = $(batch_name)_$(Process).err
output = $(batch_name)_$(Process).out

request_cpus = 1
request_memory = 10 MB
request_disk = 10 MB

queue 10
```
{: .sub}

* This submit file will create 10 jobs, each numbered `0` through `9`. This number replaces every instance of `$(Process)`, including the command in `shell`, or the filenames of the standard output/standard error files.
* `$(Cluster)` is populated with the unique job ID generated upon submission.
* `$(batch_name)` is a default submit file option. Its value is displayed when running `condor_q`.

> ### 💡 Start `$(Process)` at 1
{:.tip-header}
> If you prefer starting `$(Process)` at `1` instead of `0`, add this to your submit file:
> ```
> plusone = $(Process) + 1
> NewProcess = $INT(plusone,%d)
> 
> shell = echo $(NewProcess)
>
> ... remaining submit details ...
> 
> queue 10
> ```
> {: .sub}
> 
> Now, the custom variable `$(NewProcess)` can be used and will range from `1` to `10`.
{:.tip}

## Option 2: Submit multiple jobs that iterate over variables with `queue <variable> from <list>`

This is the most flexible option and is useful especially for a **list of parameters or files**. Use the `queue <variable> from <list>` syntax to submit multiple jobs from a list (like a `for` loop).

### Example: `queue state from parameters.txt`

Suppose you need to run an analysis (`compare_states`) on three different data files (`illinois.data`, `nebraska.data`, `wisconsin.data`). Each analysis needs to be submitted as a separate job.

First, we create a list of the `.data` files we want to iterate over, called `parameters.txt`:
```
illinois.data
nebraska.data
wisconsin.data
```

Next, in the submit file, following the pattern `queue <var> from <list>`, replace `<var>` with a custom variable name like `state` and replace `<list>` with `parameters.txt`, our list of files:

```
queue state from parameters.txt
```
{: .sub}

For each line in `parameters.txt`, HTCondor will submit a job and the variable 
`$(state)` can be used anywhere in the submit file to represent the name of the `.data` file 
to be used by that job. For the first job, `$(state)` will be `illinois.data`, for the 
second job `$(state)` will be `nebraska.data`, and so on. For example:

```
executable = compare_states
arguments = $(state)
transfer_input_files = $(state)

... remaining submit details ...

queue state from parameters.txt
```
{: .sub}

> ### 💡 Create your list with bash scripting
{:.tip-header}
> You can quickly create lists using bash scripting. In the example above, use:
> ```
> ls *.data > parameters.txt
> ```
> {:.term}
> in the directory containing the .data files to quickly create your list.
{:.tip}

## Use multiple variables for each job

`queue <var> from <list>` works with multiple variables, delimited by commas.

### Example: `queue state, year from parameters.txt`

Let's say we need to add a year as an additional input parameter for our jobs. We can modify your `parameters.txt` file:

```
illinois.data, 1995
illinois.data, 2005
nebraska.data, 1999
nebraska.data, 2005
wisconsin.data, 2000
wisconsin.data, 2015
```
{:.term}

Modify the `queue` statement to define two variables named `state` and `year`:

```
queue state, year from parameters.txt
```

The variables `$(state)` and `$(year)` can be used in the submit file:

```
executable = compare_states
arguments = $(state) $(year)
transfer_input_files = $(state)

... remaining submit details ...

queue state, year from parameters.txt
```
{: .sub}

## Option 3: Organize jobs into individual directories

### Example: Submit multiple jobs in different directories with `queue <variable> from <list>` 

Suppose there's a directory for each state you want to analyze, and each of those directories has
its own input file named `input.data`:

```
[netid@ap2001 state-analysis]$ tree
.
├── compare_states
├── compare_states.sub
├── illinois/
│   └── input.data
├── nebraska/
│   └── input.data
└── wisconsin/
    └── input.data
```
{:.term}

We will use the HTCondor submit file attribute `initialdir` to define the specific directory from which each job in the batch will start. By default, `initialdir` is set to the directory from which the `condor_submit` command is executed.

In this example, the default `initialdir` would be the `state-analysis` directory, but we want to change it to `illinois`, `nebraska`, and `wisconsin` for each job.

First, we create a text file called `state-dirs.txt` with a list of our initial directories:

```	
illinois
nebraska
wisconsin
```

Then we modify our submit file and add the `initialdir` attribute:
```
initialdir = $(state_dir)
executable = compare_states
transfer_input_files = input.data

... remaining submit details ...

queue state_dir from state-dirs.txt
```
{:.sub}

In this example, HTCondor creates a job for each directory in `state-dirs.txt` and uses that directory as the `initialdir` from which the job will be submitted. As a result, `transfer_input_files = input.data` can be used without specifying the path to this `input.data` file. Any output generated by the job will then be placed in the individual state directories.

> ### ⚠️ Differences in `executable` and `shell` when using `initialdir`
{:.tip-header}
> `initialdir` only changes the input and output file path (including the HTCondor `log`, `error`, and 
`output` files), not the `executable`, which is in the same working directory as the submit file (`compare_states.sub`).
> * If you are using `executable`, your executable should be in the **same directory** as the submit file.
> * If you are using `shell`, you will need to transfer in your executable, which means it must be **relative to the initial working directory**. Example submit file:
>
> ```
> initialdir = $(state_dir)
> shell = ./compare_states
> transfer_input_files = input.data, ../compare_states
>
> ... remaining submit details ...
>
> queue state_dir from state-dirs.txt
> ```
{:.tip}

### Example: Submit multiple jobs in different directories with `queue <variable> matching <pattern>` 

Suppose there's a directory for each state you want to analyze, and each of those directories (all prefixed with `state_`) has its own input file named `input.data`:

```
[netid@ap2001 state-analysis]$ tree
.
├── compare_states
├── compare_states.sub
├── state_illinois/
│   └── input.data
├── state_nebraska/
│   └── input.data
└── state_wisconsin/
    └── input.data
```
{:.term}

We can use `queue <variable> matching <pattern>` and `initialdir` to submit multiple jobs in their individual directories. Read the previous section to learn more about `initialdir`.

```
initialdir = $(state_dir)
executable = compare_states
transfer_input_files = input.data

... remaining submit details ...

queue state_dir matching state_*
```
{:.sub}

> ### ⚠️ When `<variable>` is a directory
{:.tip-header}
> When your custom `<variable>` is a directory, be careful when calling it in your submit file, because its value will also include the `/`.
>
> In the example above, `$(state_dir)` will take the value `state_wisconsin/`. If you specify:
> ```
> output = $(state_dir).out
> ```
> 
> Instead of getting the output file `state_wisconsin.out`, you'll create a hidden `.out` file in a `state_wisconsin/` subdirectory:
>
> ```
> [netid@ap2001 state-analysis]$ tree -a state_wisconsin
> state_wisconsin
>     ├── state_wisconsin
>     │   ├── .err
>     │   ├── .log
>     │   └── .out
>     └── input.data
> ```
> {:.term}
>
> **When `<variable>` is a directory, we recommend using it *only* in `initialdir`.**
{:.tip}

## Related pages
* [Job submission basics](htcondor-job-submission)
* [Basic scripting and job submission with arguments](htc-basic-scripting)
* [Quick reference: Basic shell commands](basic-shell-commands)
* [HTCondor manual: Submitting a Job](https://htcondor.readthedocs.io/en/latest/users-manual/submitting-a-job.html)