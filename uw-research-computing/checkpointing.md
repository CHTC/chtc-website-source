---
highlighter: none
layout: markdown-page
title: Checkpointing Jobs
---

# What is Checkpointing?

Checkpointing is a technique that provides fault tolerance for a user’s analysis. It consists of saving snapshots of a job’s progress so the job can be restarted without losing its progress and having to restart from the beginning. We encourage checkpointing as a solution for jobs that will exceed the 72 hour max default runtime on the HTC cluster. 

This section is about jobs capabable of periodically saving checkpoint information, and how to make HTCondor store that information safely, in case it’s needed to continue the job on another machine or at a later time.

There are two types of checkpointing: exit driven and eviction driven. In most cases, exit driven checkpointing is preferred over eviction driven checkpointing. Therefore, this guide will focus on exit driven checkpointing. 

Note that not all software, programs, or code are capable of creating checkpoint files and knowing how to resume from them. Consult the manual for your software or program to determine if it supports checkpointing features. 


# Process of Exit Driven Checkpointing

Using exit driven checkpointing, HTCondor ends a job after a user-specified amount of time, records the exit code of that job as 85 (more on this below) and transfers files created thus far (including the most recent checkpoint file) in a directory called /SPOOL. HTCondor then knows to requeue jobs with exit code 85. Once the job matches to a machine, the files in /SPOOL will be transferred to the execute machine that your job has been assigned to and your executable will begin running.

The process of exit driven checkpoiniting relies heavily on the use of exit codes to determine the next appropriate steps for HTCondor to take with a job. Exit codes are used to report system responses, such as when an analysis is running, encountered an errorr, or successfully completed. HTCondor recognizes exit code 85 as checkpointing jobs and therefore will handle these jobs differently than non-checkpoiting jobs. 


# Requirements for Exit Driven Checkpointing

- The software, program, or code you are using must be able to capture checkpoints (i.e. snapshots) and know how to resume from them. This means your code must be able to recognize checkpoint files and know to resume from them instead of the original input data. 
- Because checkpointing jobs will end, be requeued, and restart from a checkpoint file, it is necessary to add a wrapper script or modify an existing one to add information timing out a job. This means that your executable may be a script, rather than the code that is writing the checkpoint.
- Small changes to the submit file are needed to enable a checkpointing job to automatically re-enter the queue upon timing out. 

Contact a Reserach Computing Facilitator with help determining if your job is capable of using checkpointing.  


# Changes to the Submit File
If your code can use checkpointing, you will need to add/edit a few lines of the submit file. 

- First, add the line `checkpoint_exit_code = 85`. HTCondor recognizes code `85` as a checkpoint job. This means HTCondor knows to end a job with this code but to then to requeue it repetitively until the analysis completes. 
- Second, make sure when_to_transfer_output is set to `when_to_transfer_output = ON_EXIT`. 
- Lastly, in many cases, it is necessary to write a wrapper script to tell a job when to timeout and exit. In cases such as this, the executable will need to be changed to the name of that wrapper script. 

An example submit file for an exit driven checkpointing job looks like: 

```
# exit-driven-example.submit

executable                  = exit-driven.sh
arguments                   = argument1 argument2

checkpoint_exit_code        = 85
should_transfer_files       = yes
when_to_transfer_output     = ON_EXIT

output                      = example.out
error                       = example.err
log                         = example.log

cpu                         = 1
request_disk                = 2 GB
request_memory              = 2 GB 

queue 1
```


# Example Wrapper Script for Checkpointing Job
As previously described, it may be necessary to use a wrapper script to tell your job when and how to exit as it checkpoints. An example of a wrapper script that tells a job to exit every 4 hours looks like: 

```
#!/bin/bash
 
timeout 4h do_RAxML_science arg1 arg2
 
timeout_exit_status=$?
 
if [ $timeout_exit_status -eq 124 ]; then
    exit 85
fi
 
exit $timeout_exit_status
```

Let’s take a moment to understand what each section of this wrapper script is doing: 

``` exit-driven.sh
#!/bin/bash

# The `timeout` command will stop the job after 4 hours (4h). This number can be increased or decreased depending on how frequent your code/software/program is creating checkpoint files and how long it takes to create/resume from these files. We recommend setting timeout to be between 4-10 hours.  Replace `do_science argument1 argument2` with the execution command and arguments for your job.

timeout 4h do_science argument1 argument2

# Uses the bash notation of `$?` to call the exit value of the last executed command and to save it in a variable called `timeout_exit_status`. 

timeout_exit_status=$?

# Programs typically have an exit code of `124` while they are actively running. This code replaces exit code `124` with code `85`. HTCondor recognizes code `85` and knows to end a job with this code once the time specified by `timeout` has been reached. Upon exiting, HTCondor saves the files from jobs with exit code `85` in a temporary directory called /SPOOL.  Once the files have been transferred, HTCondor automatically requeues that job and fetches the files from /SPOOL. If an exit code of `124` is not observed, for example if the program is done running it will not have this value, HTCondor will end the job and have it exit the queue or will place the job on hold if it encounters an error. 

if [ $timeout_exit_status -eq 124 ]; then
    exit 85
fi

exit $timeout_exit_status
```


# Checking the Progress of Checkpointing Jobs



# More Information
More information on both exit and eviction driven checkpointing HTCondor jobs can be found in HTCondor’s manual: https://htcondor.readthedocs.io/en/latest/users-manual/self-checkpointing-applications.html
