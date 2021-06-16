---
highlighter: none
layout: markdown-page
title: Importance of Testing
---


Running your code in test jobs before submitting large job batches is
CRUCIAL to effective high-throughput computing.

Why Test?
=========

Improving your own throughput
-----------------------------

Spending the time and effort to run test jobs will pay off in more
effective high-throughput computing in the following ways:

-   **Better matching:** Pinpointing the required amount of memory/disk
    space will allow your jobs to match to as many computers as
    possible. Requesting excessive amounts of memory and disk space will
    limit the number of slots where your jobs can run, as well as using
    unnecessary space that could be available for other users. That
    said\...
-   **Fewer holds or evictions:** If you don\'t request \*enough\*
    memory or disk and your job exceeds its request, it can go on hold.
    Jobs that have not been tested and run over 72 hours are liable to
    be evicted without finishing.
-   **Fewer wasted compute hours:** the evictions and holds described
    above will be wasted compute hours, decreasing your priority in the
    high-throughput system while not returning any results.
-   **Making good choices:** knowing how big and how long your jobs are,
    and the size of input/output files will show you how to most
    effectively use CHTC resources. Jobs under 2 hrs or so? Allow your
    jobs to flock and glide to the UW Grid and Open Science Grid. Input
    files of more than 5 GB? You should probably be using the CHTC large
    file staging area. Longer jobs? Include a line in your submit file
    restricting your jobs to the CHTC servers that guarantee 72 hours.

Being a good citizen
--------------------

CHTC\'s high-throughput system has hundreds to thousands of users,
meaning that poor computing practices by one user can impact many other
users. Users who submit jobs that don\'t finish or are evicted because
of incorrect memory requests are using hours that could have been used
by other people. In the worst case, untested code can cause other jobs
running on an execute server to be evicted, directly harming someone
else\'s research process. The best practices listed in these guides
exist for a reason. Testing your code and job submissions to make sure
they abide by CHTC recommendations will not only benefit your own
throughput but make sure that everyone else is also getting a fair share
of the resource.

What to Test
============

When running test jobs, you want to pay attention to at least the
following five variables:

-   disk space
-   memory usage
-   length of job
-   input file size
-   output file size

Memory and disk space simply make sure that your jobs have the resources
they need to run properly. Memory is the amount of RAM needed by your
program when it executes; disk space is how much hard drive space is
required to store your data, executables, and any output files.

Job length has a huge impact on where your jobs can run. Within a subset
of CHTC servers, jobs are guaranteed to run for 72 hours. Jobs that run
for longer than 72 hours will fail, unless they have implemented a
self-checkpointing method that allows them to resume after being
evicted. Jobs that are shorter, around 2-4 hours, are good candidates to
run on the UW Grid and/or Open Science Grid.

Input and output file size will impact how your files will be
transferred to and from the execute nodes. Large input files will need
to be staged on a proxy server or shared file system; small input files
can use HTCondor\'s built-in file transfer system. If you have questions
about how to handle your data, please email
[chtc@cs.wisc.edu](chtc@cs.wisc.edu) to get in touch with a research
computing facilitator who can advise you.

In addition to these considerations, your script/program itself should
be thoroughly tested on your own machine until it is as bug-free and
correct as possible. If it uses any libraries or packages, you should
know what they are and if they have any other dependencies.

How to Test
===========

Interactive Jobs
----------------

One of the most useful tools for testing is HTCondor\'s interactive job
feature. An interactive job is essentially a job without an executable;
you are the one running the commands instead, through a bash (shell?)
session.

To request an interactive job:

1.  Create a submit file as if you were submitting the job normally,
    with one change. Don\'t include an executable line; instead, list
    your executable file in the `transfer_input_files` line.

        # sample submit file
        universe = vanilla
        log = interactive.log

        # executable = # delete or comment out
        should_transfer_files = YES
        when_to_transfer_output = ON_EXIT
        transfer_input_files = data_file,myprogram

        request_cpus = 1
        request_memory = 1GB
        request_disk = 1GB
              
        queue

2.  Then, submit the job using the `-i` option:

        $ condor_submit -i submit_file

    You should see a message like:

        Submitting job(s).
        1 job(s) submitted to cluster 4347054.
        Waiting for job to start... 

3.  After a few minutes, the job should match and open an interactive
    session on an execute server, with all the files you listed in
    `transfer_input_files` You are now on an execute server, much like
    one your jobs will be running on when you submit them to HTCondor.
    Here, you can try running your executable.
4.  Once you are done, you can type `exit` to leave the interactive
    session. **Note that any files you created during the session will
    be transferred back with you!** Another useful tool can be to save
    your history to a file, using the following command:

        $ history > history.txt 

Scale testing
-------------

Once you know that your code works and you can successfully submit one
job to be run by HTCondor, you should test a few jobs before submitting
the full-size batch. After these few jobs complete, pay attention to the
variables described above (memory, disk space, etc.) so you can edit
your submit files before submitting your entire batch of jobs.

To find information about memory, disk space and time, look at a job\'s
log file. Its name and where it is located may vary, depending on your
submit process, but once you find it, you should see information like
this:

    001 (845638.000.000) 03/12 12:48:06 Job executing on host: <128.104.58.85:49163>
    ...
    005 (845638.000.000) 03/12 12:48:06 Job terminated.
        (1) Normal termination (return value 0)
            Usr 0 00:00:00, Sys 0 00:00:00  -  Run Remote Usage
            Usr 0 00:00:00, Sys 0 00:00:00  -  Run Local Usage
            Usr 0 00:00:00, Sys 0 00:00:00  -  Total Remote Usage
            Usr 0 00:00:00, Sys 0 00:00:00  -  Total Local Usage
        17  -  Run Bytes Sent By Job
        92  -  Run Bytes Received By Job
        17  -  Total Bytes Sent By Job
        92  -  Total Bytes Received By Job
            Partitionable Resources :    Usage  Request Allocated
               Cpus                 :                 1         1
               Disk (KB)            :       12  1000000  26703078
               Memory (MB)          :        0     1000      1000

The table at the end of the log file shows how many resources you used
and can be used to fine-tune your requests for memory and disk. If you
didn\'t keep track yourself, the log file also lists when the job
started to execute, and when it ended, thus the length of time required
for completion.
