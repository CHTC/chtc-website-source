---
highlighter: none
layout: markdown-page
title: Checkpointing Jobs
---


# What is Checkpointing?

Checkpointing is a technique that provides fault tolerance for a user’s analysis. It consists of saving snapshots of a job’s progress so the job can be restarted without losing its progress and having to restart from the beginning. We highly encourage checkpointing as a solution for jobs that will exceed the 72 hour maximum default runtime on the HTC system. 

This section is about jobs capable of periodically saving checkpoint information, and how to make HTCondor store that information safely, in case it’s needed to continue the job on another machine or at a later time.

There are two types of checkpointing: exit driven and eviction driven. In a vast majority of cases, **exit driven checkpointing** is preferred over eviction driven checkpointing. Therefore, this guide will focus on how to utilize exit driven checkpointing for your analysis. 

Note that not all software, programs, or code are capable of creating checkpoint files and knowing how to resume from them. Consult the manual for your software or program to determine if it supports checkpointing features. Some manuals will refer this ability as "checkpoint" features, as the ability to "resume" mid-analysis if a job is interrupted, or as "checkpoint/restart" capabilities. Contact a Research Computing Facilitator if you would like help determining if your software, program, or code is able to checkpoint. 


# Why Checkpoint? 

Checkpointing allows a job to automatically resume from approximately where it left off instead of having to start over if interrupted. This behavior is advantageous for jobs limited by a maximum runtime policy (72 hours on the HTC system). It is also advantageous for jobs submitted to backfill resources with no runtime guarantee (e.g. for [+WantFlocking or +WantGliding jobs](https://chtc.cs.wisc.edu/uw-research-computing/scaling-htc.html)) where the compute resources may also be more prone to hardware or networking failures.

For example, checkpointing jobs that are limited by a runtime policy can enable HTCondor to exit a job and automatically requeue it to avoid hitting the maximum runtime limit. By using checkpointing, jobs circumvent hitting the maximum runtime limit and can run for extended periods of time until the completion of the analysis. This behavior avoids costly setbacks that may be caused by losing results mid-way through an analysis due to hitting a runtime limit. 

# Process of Exit Driven Checkpointing

Using exit driven checkpointing, a job is specified to time out after a user-specified amount of time with an exit code value of 85 (more on this below). Upon hitting this time limit, HTCondor transfers any checkpoint files listed in the submit file attribute `transfer_checkpoint_files` to a directory called `/spool`. This directory acts as a storage location for these files in case the job is interrupted. HTCondor then knows that jobs with exit code `85` should be automatically requeued, and will transfer the checkpoint files in `/spool` to your job's working directory prior to restarting your executable.

The process of exit driven checkpointing relies heavily on the use of exit codes to determine the next appropriate steps for HTCondor to take with a job. In general, exit codes are used to report system responses, such as when an analysis is running, encountered an error, or successfully completes. HTCondor recognizes exit code `85` as checkpointing jobs and therefore will know to handle these jobs differently than non-checkpoiting jobs.


# Requirements for Exit Driven Checkpointing

Requirements for your code or software: 

- *Checkpoint*: The software, program, or code you are using must be able to generate checkpoint files (i.e. snapshots of the progress made thus far) and know how to resume from them. 
- *Resume*: This means your code must be able to recognize checkpoint files and know to resume from them instead of the original input data when the code is restarted. 
- *Exit*: Jobs should exit with an exit code value of `85` after successfully creating checkpoint files. Additionally, jobs need to be able to exit with a non-`85` value if they encounter an error or write the writing the final outputs.

**In some cases, these requirements can be achieved by using a wrapper script.** This means that your executable may be a script, rather than the code that is writing the checkpoint. An example wrapper script that enables some of these behaviors is below. 

Contact a Research Computing Facilitator for help determining if your job is capable of using checkpointing.  


# Changes to the Submit File

Several modifications to the submit file are needed to enable HTCondor's checkpointing feature. 

- The line `checkpoint_exit_code = 85` must be added. HTCondor recognizes code `85` as a checkpoint job. This means HTCondor knows to end a job with this code but to then to requeue it repeatedly until the analysis completes. 
- The value of `when_to_transfer_output` should be set to `ON_EXIT`. 
- The name of the checkpoint files or directories to be transferred to `/spool` should be specified using `transfer_checkpoint_files`.

**Optional** 
In some cases, it is necessary to write a wrapper script to tell a job when to timeout and exit. In cases such as this, the executable will need to be changed to the name of that wrapper script. An example of a wrapper script that enables a job to checkout and exit with the proper exit codes can be found below. 

An example submit file for an exit driven checkpointing job looks like: 

```
# exit-driven-example.submit

executable                  = exit-driven.sh
arguments                   = argument1 argument2

checkpoint_exit_code        = 85
transfer_checkpoint_files   = my_output.txt, temp_dir, temp_file.txt
+is_resumable = true

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
 
timeout 4h do_science arg1 arg2
 
timeout_exit_status=$?
 
if [ $timeout_exit_status -eq 124 ]; then
    exit 85
fi
 
exit $timeout_exit_status
```

Let’s take a moment to understand what each section of this wrapper script is doing: 

```
#!/bin/bash

timeout 4h do_science argument1 argument2
# The `timeout` command will stop the job after 4 hours (4h). 
# This number can be increased or decreased depending on how frequent your code/software/program 
# is creating checkpoint files and how long it takes to create/resume from these files. 
# Replace `do_science argument1 argument2` with the execution command and arguments for your job.

timeout_exit_status=$?
# Uses the bash notation of `$?` to call the exit value of the last executed command 
# and to save it in a variable called `timeout_exit_status`. 



if [ $timeout_exit_status -eq 124 ]; then
    exit 85
fi

exit $timeout_exit_status

# Programs typically have an exit code of `124` while they are actively running. 
# The portion above replaces exit code `124` with code `85`. HTCondor recognizes 
# code `85` and knows to end a job with this code once the time specified by `timeout`
# has been reached. Upon exiting, HTCondor saves the files from jobs with exit code `85` 
# in the temporary directory within `/spool`.  Once the files have been transferred,
# HTCondor automatically requeues that job and fetches the files found in `/spool`. 
# If an exit code of `124` is not observed (for example if the program is done running 
# or has encountered an error), HTCondor will end the job and will not automaticlally requeue it.

```

The ideal timeout frequency for a job is every 1-5 hours with a maximum of 10 hours. For jobs that checkpoint and timeout in under an hour, it is possible that a job may spend more time with checkpointing procedures than moving forward with the analysis. After 10 hours, jobs that checkpoint and timeout are less able to take advantage of [submitting jobs outside of CHTC](scaling-htc.html) to run on other campus resources or on the OSPool. 


# Checking the Progress of Checkpointing Jobs

Always test a single checkpointing job before scaling up to identify odd or unintentional behaviors in your analysis. 

To determine if your job is successfully creating and saving checkpoint files, you can investigate checkpoint files once they have been transferred to `/spool`.

You can explore the checkpointed files in `/spool` by navigating to `/var/lib/condor/spool`. The directories in this folder are the last four digits of a job's cluster ID with leading zeros removed. Sub folders are labeled with the process ID for each job. For example, to investigate the checkpoint files for `17870068.220`, the files in `/spool` would be found in folder `68` in a subdirectory called `220`.

It is also possible to intentionally evict a running job and have it rematch to an execute server to test if your code is successfully resuming from checkpoint files or not. To test this, use `condor_vacate_job <JobID>`. This command will evict your job intentionally and have it return to "Idle" state in the queue. This job will begin running once it rematches to an execute server, allowing you to test if your job is correctly resuming from checkpoint files or incorrectly starting over with the analysis.  


# More Information

More information on checkpointing HTCondor jobs can be found in HTCondor’s manual: https://htcondor.readthedocs.io/en/latest/users-manual/self-checkpointing-applications.html This documentation contains additional features available to checkpointing jobs, as well as additional examples such as a python checkpointing job. 
