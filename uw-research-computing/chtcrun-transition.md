---
highlighter: none
layout: markdown-page
title: Emulating ChtcRun Job Submission
---


This guide demonstrates how to submit multiple jobs, using a specific
directory structure. It is relevant to:

-   Researchers who have used CHTC\'s \"ChtcRun\" tools in the past
-   Anyone who wants to submit multiple jobs, where each job has its own
    directory for input/output files on the submit server.

**1. Software and Input Preparation**
---------------------------------

The first time you submit jobs, you will need to prepare a portable
version of your software and a script (what we call the job\'s
\"executable\") that runs your code. We have guides for preparing:

-   [Matlab](matlab-jobs)
-   [Python](python-jobs)
-   [R](r-jobs)

Choose the right guide for you and follow the directions for compiling
your code (Matlab) or building an installation (Python, R). Also follow
the instructions for writing a shell script that runs your program.
These are typically steps 1 and 2 of the above guides.

**2. Directory Structure**
----------------------

Once you\'ve prepared your code and script, create the same directory
structure that you would normally use with ChtcRun. For a single batch
of jobs, the directories will look like this:

``` 
project_name/
    run_code.sh
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
individual job directories start with the word \"job\".

**3. Submit File**
--------------

> **Note: if you are submitting more than 10,000 jobs at once, you\'ll
> need to use a different submit file. Please email the CHTC Research
> Computing Facilitators at <chtc@cs.wisc.edu> if this is the case!**

Your submit file, which should go in your main project directory, should
look like this:

``` {.sub}
# Specify the HTCondor Universe (vanilla is the default and is used
#  for almost all jobs), the desired name of the HTCondor log file,
#  and the desired name of the standard error and standard output file.  
universe = vanilla
log = process.log
error = process.err
output = process.out
#
# Specify your executable (single binary or a script that runs several
#  commands) and arguments
executable = run_code.sh
# arguments = arguments to your script go here
#
# Specify that HTCondor should transfer files to and from the
#  computer where each job runs. 
should_transfer_files = YES
when_to_transfer_output = ON_EXIT
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

You **must** change the name of the executable to your own script, and
in certain cases, add arguments.

Note that the final line matches the pattern of your directory names
created in the second step. You can use a different name for the
directories (like `data` or `seed`), but you should use whatever word
they share in the final queue statement in place of \"job\".

Jobs can then be submitted as described in our [Introduction to HTC
Guide](helloworld), using `condor_submit`.
