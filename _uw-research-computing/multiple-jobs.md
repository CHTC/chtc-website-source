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

{% capture content %}
1.  [Submit Multiple Jobs Using queue](#queue)
2.  [Use queue N in your HTCondor submit files](#queueN)
	- [*2A.* Use integer numbered input files](#integer)
	- [*2B.* Specify a row or column number for each job](#rowcol)
	- [*3C.* Need *N* to start at 1](#n1)
3.  [Submit multiple jobs with one or more distinct variables per job](#variables)
	- [*3A.* Use multiple variables for each job](#multiple_variables)
4.  [Organizing Jobs Into Individual Directories](#initialdir)
	- [*4A.* Submitting Multiple Jobs in Different Directories with `queue <variable> from list`](#initialdir_states)
	- [*4B.* Submitting Multiple Jobs in Different Directories with `queue <directory> matching *`](#initialdir_jobs)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Overview
HTCondor has several convenient features for streamlining high-throughput 
job submission. This guide provides several examples 
of how to leverage these features to **submit multiple jobs with a 
single submit file.**

*Why submit multiple jobs with a single submit file?*

Users should submit multiple jobs using a single submit file, or where applicable, as few 
separate submit files as needed. Using HTCondor multi-job submission features is more 
efficient for users and will help ensure reliable operation of the the login nodes.

Many options exist for streamlining your submission of multiple jobs, 
and this guide only covers a few examples of what is truly possible with 
HTCondor. If you are interested in a particular approach that isn't described here, 
please contact [CHTC's research computing facilitators](mailto:chtc@cs.wisc.edu) and we will 
work with you to identify options to meet the needs of your work.

> **Before you continue reading:** While HTCondor is designed to submit many jobs at a
> time using a single submit file, the hardware of the submit server can be overwhelmed
> if there are a significant number of jobs submitted at once or rapidly starting and finishing.
> Therefore, plan ahead for the following to scenarios: 
>
> 1) If you plan to submit 10,000+ jobs at a time, please let us
>    know, so we can provide options that will protect the queue's performance. 
> 2) If you plan to submit 1000+ jobs, please make sure that each job
>    has a minimum run time of 10 minutes (on average). If your calculations are shorter than
>    10 minutes, then modify your workflow to run multiple calculations per job.
>    

<a name="queue"></a>
<h1>1. Submit Multiple Jobs Using <code class="h1">queue</code></h1>

All HTCondor submit files require a `queue` attribute (which must also be 
the last line of the submit file). By default, `queue` will submit one job, but 
users can also configure the `queue` attribute to behave like a for loop 
that will submit multiple jobs, with each job varying as predefined by the user.

Below are different HTCondor submit file examples for submitting batches of multiple 
jobs and, where applicable, how to indicate the differences between jobs in a batch 
with user-defined variables. Additional examples and use cases are provided further below:

1.  ***[queue <N\>](#queueN)*** - will submit *N* number of jobs. Examples 
    include performing replications, where the same job must be repeated *N* number 
    of times, looping through files named with numbers, and looping through 
    a matrix where each job uses information from a specific row or column.
2.  ***[queue <var\> from <list\>](#variables)*** - will loop through a 
    list of file names, parameters, etc. as defined in separate text file (i.e. *<list>*). 
    This `queue` option is very flexible and provides users with many options for 
    submitting multiple jobs.
3.  **[Organizing Jobs Into Individual Directories](#initialdir)** -
    another option that can be helpful in organizing multi-job submissions.

These `queue` options are also described in the following video from HTCondor Week 2020: 
<a href="https://www.youtube.com/watch?v=m7dQChJH5LU">
	<img alt="2020 HTCondor Week Presentation" src="https://raw.githubusercontent.com/CHTC/chtc-website-source/master/images/multi-job-submit-video-thumbnail.png" width="360" height="204"></a>

[Submitting Multiple Jobs Using HTCondor Video](https://www.youtube.com/watch?v=m7dQChJH5LU)

What makes these `queue` options powerful is the ability to use user-defined 
variables to specify details about your jobs in the HTCondor submit file. The 
examples below will include the use of `$(variable_name)` to specify details 
like input file names, file locations (aka paths), etc. **When selecting a 
variable name, users must avoid bespoke HTCondor submit file variables 
such as `Cluster`, `Process`, `output`, and `input`, `arguments`, etc.**

<h2>2. Use <code class="h2">queue N</code> in your HTCondor submit files</h2><a name="queueN"></a>

When using `queue N`, HTCondor will submit a total of *N* 
jobs, counting from 0 to *N* - 1 and each job will be assigned 
a unique `Process` id number spanning this range of values. Because 
the `Process` variable will be unique for each job, it can be used in 
the submit file to indicate unique filenames and filepaths for each job.

The most straightforward example of using `queue N` is to submit 
*N* number of identical jobs. The example shown below demonstrates 
how to use the `Cluster` and `Process` variables to assign unique names 
for the HTCondor `error`, `output`, and `log` files for each job in the batch:

```
# 100jobs.sub
# submit 100 identical jobs

log = job_$(Cluster)_$(Process).log
error = job_$(Cluster)_$(Process).err
output = job_$(Cluster)_$(Process).out

... remaining submit details ...

queue 100
```
{: .sub}

For each job, the appropriate number, `0, 1, 2, ... 99` will replace `$(Process)`. 
`$(Cluster)` will be a unique number assigned to the entire 100 job batch. Each 
time you run `condor_submit job.sub`, you will be provided 
with the `Cluster` number which you will also see in the output produced by 
the command `condor_q`.

If a uniquely named results file needs to be returned by each job, 
`$(Process)` and `$(Cluster)` can also be used as `arguments`, and anywhere 
else as needed, in the submit file:

```
arguments = $(Cluster)_$(Process).results

... remaining submit details ...

queue 100
```
{:.sub}

Be sure to properly format the `arguments` statement according to the 
executable used by the job.

***What if my jobs are not identical?*** `queue N` may still be a great 
option! Additional examples for using this option include:

<a name="integer"></a>
### 2A. Use integer numbered input files

```
[user@login]$ ls *.data
0.data   1.data   2.data   3.data
...      97.data  98.data  99.data
```
{: .term}

In the submit file, use:

```
transfer_input_files = $(Process).data

... remaining submit details ...

queue 100
```
{: .sub}

<a name="rowcol"></a>
### 2B. Specify a row or column number for each job

$(Process) can be used to specify a unique row or column of information in a 
matrix to be used by each job in the batch. The matrix needs to then be transferred 
with each job as input. For exmaple:

```
transfer_input_files = matrix.csv
arguments = $(Process)

... remaining submit details ...

queue 100
```
{: .sub}

The above exmaples assumes that your job is set up to use an argument to 
specify the row or column to be used by your software.

<a name="n1"></a>
### 2C. Need *N* to start at 1

If your input files are numbered 1 - 100 instead of 0 - 99, or your matrix 
row starts with 1 instead of 0, you can perform basic arithmetic in the submit 
file:

```
plusone = $(Process) + 1
NewProcess = $INT(plusone,%d)
arguments = $(NewProcess)

... remaining submit details ...

queue 100
```
{: .sub}

Then use `$(NewProcess)` anywhere in the submit file that you would
have otherwise used `$(Process)`. Note that there is nothing special about the 
names `plusone` and `NewProcess`, you can use any names you want as variables.

<a name="variables"></a>
## 3. Submit multiple jobs with one or more distinct variables per job

Think about what's different between each job that needs to be submitted. 
Will each job use a different input file or combination of software parameters? Do 
some of the jobs need more memory or disk space? Do you want to use a different 
software or script on a common set of input files? Using `queue <var> from <list>` 
in your submit files can make that possible! `<var>` can be a single user-defined 
variable or comma-separated list of variables to be used anywhere in the submit file. 
`<list>` is a plain text file that defines `<var>` for each individual job to be submitted in the batch.

Suppose you need to run a program called `compare_states` that will run on 
on the following set of input files: `illinois.data`, `nebraska.data`, and 
`wisconsin.data` and each input file can analyzed as a separate job.

To create a submit file that will submit all three jobs, first create a 
text file that lists each `.data` file (one file per line). 
This step can be performed directly on the login node, for example:

```
[user@state-analysis]$ ls *.data > states.txt
[user@state-analysis]$ cat states.txt
illinois.data
nebraska.data
wisconsin.data
```
{: .term}

Then, in the submit file, following the pattern `queue <var> from <list>`,
replace `<var>` with a variable name like `state` and replace `<list>` 
with the list of `.data` files saved in `states.txt`:

```
queue state from states.txt
```
{: .sub}

For each line in `states.txt`, HTCondor will submit a job and the variable 
`$(state)` can be used anywhere in the submit file to represent the name of the `.data` file 
to be used by that job. For the first job, `$(state)` will be `illinois.data`, for the 
second job `$(state)` will be `nebraska.data`, and so on. For example:

```
# run_compare_states_per_state.sub

transfer_input_files = $(state)
arguments = $(state)
executable = compare_states

... remaining submit details ...

queue state from states.txt
```
{: .sub}

<a name="multiple_variables"></a>
### 3A. Use multiple variables for each job

Let's imagine that each state `.data` file contains data spanning several 
years and that each job needs to analyze a specific year of data. Then 
the `states.txt` file can be modified to specify this information:

```
[user@state-analysis]$ cat states.txt
illinois.data, 1995
illinois.data, 2005
nebraska.data, 1999
nebraska.data, 2005
wisconsin.data, 2000
wisconsin.data, 2015
```
{: .term}

Then modify the `queue` to define two `<var>` named `state` and `year`:

```
queue state,year from states.txt
```
{: .sub}

Then the variables `$(state)` and `$(year)` can be used in the submit file:

```
# run_compare_states_by_year.sub
arguments = $(state) $(year)
transfer_input_files = $(state)
executable = compare_states

... remaining submit details ...

queue state,year from states.txt
```
{: .sub}

<a name="initialdir"></a>
## 4. Organizing Jobs Into Individual Directories

<a name="initialdir_states"></a>
### 4A. Submitting Multiple Jobs in Different Directories with `queue <variable> from list` 

One way to organize jobs is to assign each job to its own directory,
instead of putting files in the same directory with unique names. To
continue our \"compare\_states\" example, suppose there\'s a directory
for each state you want to analyze, and each of those directories has
its own input file named `input.data`:

```
[user@state-analysis]$ ls -F
compare_states  illinois/  nebraska/  wisconsin/

[user@state-analysis]$ ls -F illinois/
input.data

[user@state-analysis]$ ls -F nebraska/
input.data

[user@state-analysis]$ ls -F wisconsin/
input.data
```
{: .term}

The HTCondor submit file attribute `initialdir` can be used 
to define a specific directory from which each job in the batch will be 
submitted. The default `initialdir` location is the directory from which the 
command `condor_submit myjob.sub` is executed. 

Combining `queue var from list` with `initiadir`, each line of *<list>* will include 
the path to each state directory and `initialdir` set to this path for 
each job:

```
#state-per-dir-job.sub
initialdir = $(state_dir)
transfer_input_files = input.data	
executable = compare_states

... remaining submit details ...

queue state_dir from state-dirs.txt
```
{: .sub}

Where `state-dirs.txt` is a list of each directory with state data:

```	
[user@state-analysis]$ cat state-dirs.txt
illinois
nebraska
wisconsin
```
{: .term}

**Notice that `executable = compare_states` has remained unchanged in the above example. 
When using `initialdir`, only the input and output file path (including the HTCondor log, error, and 
output files) will be changed by `initialdir`**.

In this example, HTCondor will create a job for each directory in `state-dirs.txt` and use 
that state\'s directory as the `initialdir` from which the job will be submitted. 
Therefore, `transfer_input_files = input.data` can be used without specifying 
the path to this `input.data` file. Any output generated by the job will then be returned to the `initialdir` 
location.

<a name="initialdir_jobs"></a>
### 4B. Submitting Multiple Jobs in Different Directories with `queue <directory> matching *` 

This section demonstrates how to submit multiple jobs, using a specific
directory structure where folder names have a string of text in common. It is relevant to anyone who wants to submit multiple jobs, where each job has its own directory for input/output files on the submit server.

**Directory Structure**
For a single batch of jobs, the directories will look like this:

``` 
project_name/
    run_code.sh
    submit.sub
    shared/
        scripts, code_package
        shared_input
    job1/
        input/
            job_input
    job2/
        input/
            job_input
    job3/
        input/
            job_input
```
{:.other}

You\'ll want to put all your code and files required for every job in
`shared/` and individual input files in the individual job directories
in an `input` folder. In the submit file below, it matters that the
individual job directories start with the word \"job\". Your directories should all have a string of text in common, so that you can use the `queue <directory> matching <commonString>*` syntax to queue a job for each directory. 

> **Note: the job directories need to be hosted in your `/home` directory 
> on the submit node. The following instructions will not work for files 
> hosted on `/staging`!**

**Submit File**
Your submit file, which should go in your main project directory, should
look like this:

``` {.sub}
# Specify your executable (single binary or a script that runs several
#  commands) and arguments
executable = run_code.sh
# arguments = arguments to your script go here
#
# Specify the desired name of the HTCondor log file,
#  and the desired name of the standard error and standard output file.  
log = process.log
error = process.err
output = process.out
#
# Specify that HTCondor should transfer files to and from the
#  computer where each job runs. 
should_transfer_files = YES
# Set the submission directory for each job with the $(directory)
# variable (set below in the queue statement).  Then transfer all 
# files in the shared directory, and from the input folder in the 
# submission directory
initialdir = $(directory)
transfer_input_files = ../shared/,input/
#
# Tell HTCondor what amount of compute resources
#  each job will need on the computer where it runs.
request_cpus = 1
request_memory = 1GB
request_disk = 1GB
#
# Create a job for each "job" directory.
queue directory matching job*
```

Note that the final line matches the pattern of your directory names that you previously
created. You can use a different name for the
directories (like `data`, `sample`, or `seed`), but you should use whatever word
the directories have in common in the final queue statement in place of \"job\".

Jobs can then be submitted using `condor_submit`.
