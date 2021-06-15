---
highlighter: none
layout: markdown-page
title: Running Your First CHTC Job
---

So, you have access to a submit machine, have all the right accounts,
and you are ready to run your first job in the CHTC. As we described in
[Our Approach](http://chtc.cs.wisc.edu/approach.shtml), the CHTC is a
collection of distributed resources. The magic that enables you to run
jobs on these resources is software, called
[HTCondor](http://research.cs.wisc.edu/htcondor/), developed at the
UW-Madison.

Let\'s first do, and then ask why
---------------------------------

Rather than having you read a bunch of stuff before hand, let\'s just
run some jobs, and *then* you can do the reading. We are going to run
the traditional \'hello world\' program with a CHTC twist. In order to
demonstrate the distributed resource nature of the CHTC, we will run
\'hello CHTC\' 3 times, where each time is its own job. Since you are
not directly invoking the execution of each job, you need to tell
HTCondor *how* to run the jobs. The information needed is placed into a
*submit file*.

***Note: You must be logged into an HTCondor submit machine for the
following example to work***

Copy the highlighted text below, and paste it into file called
`hello-chtc.sub`, the submit file, in your home directory on the submit
machine.

    # hello-chtc.sub
    # My very first HTCondor submit file
    #
    # Submit files require that you define certain aspects of your job,
    #  but you can also specify custom variables. We're going to specify
    #  our own variable that will be used later in the submit file as 
    #  $(job).
    job = hello-chtc
    #
    # Specify the HTCondor Universe (vanilla is typical for almost all
    #  jobs) AND the desired name of the HTCondor log file. $(Cluster)
    #  will utilize the queue number for the set of 3 jobs we submit.
    universe = vanilla
    log = $(job)_$(Cluster).log
    #
    # Specify your executable (single binary or a script that runs several
    #  commands), arguments, and files for system output and system error.
    #  $(Process) will be a unique number for each job, starting with "0".
    executable = $(job)
    arguments = $(Process)
    output = $(job)_$(Cluster)_$(Process).out
    error = $(job)_$(Cluster)_$(Process).err
    #
    # Specify that HTCondor should transfer files to and from the
    #  computer where each job runs. The last of these lines *would* be
    #  used if there were any other files needed for the executable to run.
    should_transfer_files = YES
    when_to_transfer_output = ON_EXIT
    # transfer_input_files = file1,file2,file3,etc
    #
    # Tell HTCondor how many CPU cores, and how much memory and disk space
    #  each job will need on the computer where it runs.
    #  (Memory is in MBs; we'll ask for 1GB)
    #  (Storage in KBs, we'll ask for 1 MB)
    request_cpus = 1
    request_memory = 1000
    request_disk = 1000
    #
    # Tell HTCondor to run 3 instances of our job:
    queue 3

Now, copy the text below and paste it into a file called `hello-chtc`,
again placing this file into your home directory on the submit machine.
This bash script will be our executable.

    #!/bin/bash
    #
    # hello-chtc
    # My very first CHTC job
    #
    echo "Hello CHTC from Job $1 running on `whoami`@`hostname`"

Ok, run your very first job by entering these two commands:

    chmod +x hello-chtc
    condor_submit hello-chtc.sub

The `chmod` command tells the system that the `hello-chtc` file is an
executable program. You only need to run this command the first time you
create a new executable file. The `condor_submit` command actually
submits your jobs to HTCondor. If all goes well, you will see output
from the `condor_submit` command that appears as:

    Submitting job(s).....
    3 job(s) submitted to cluster 845638.

To check on the status of your jobs, run the following command:

    condor_q $USER

The `$USER` argument will show only your jobs, and you can replace
`$USER` with your username. You will see output that looks like:

    -- Submitter: user@submit.chtc.wisc.edu : <128.104.100.43:9618?sock=5235_1ed5_2> : submit-1.chtc.wisc.edu
     ID      OWNER            SUBMITTED     RUN_TIME ST PRI SIZE CMD               
    845638.0   user           3/12 12:46   0+00:00:00 I  0   0.0  hello-chtc 0       
    845638.1   user           3/12 12:46   0+00:00:00 I  0   0.0  hello-chtc 1       
    845638.2   user           3/12 12:46   0+00:00:00 I  0   0.0  hello-chtc 2       

    3 jobs; 0 completed, 0 removed, 3 idle, 0 running, 0 held, 0 suspended

You can run the `condor_q` command periodically to see the progress of
your jobs. In a few minutes, the queue should be empty, implying that
your jobs have completed. If you do a listing of your home directory,
you should see something like:

    -rwxrwxr-x 1 user user   92 Mar 12 12:45 hello-chtc
    -rw------- 1 user user   17 Mar 12 12:48 hello-chtc_845638_0.out
    -rw------- 1 user user   17 Mar 12 12:48 hello-chtc_845638_1.out
    -rw------- 1 user user   17 Mar 12 12:48 hello-chtc_845638_2.out
    -rw-rw-r-- 1 user user 3180 Mar 12 12:48 hello-chtc_845638.log
    -rw-rw-r-- 1 user user  580 Mar 12 12:40 hello-chtc.sub

**Useful information is provided in the user log and the output/error
files.**

HTCondor creates a transaction log of everything that happens to your
jobs. Looking at the log file is very useful for debugging problems that
may arise. An excerpt from `hello-chtc_845638.log` produced due the
submission of the 3 jobs will look something like this:

    000 (845638.000.000) 03/12 12:46:29 Job submitted from host: <128.104.100.43:9618?sock=5235_1ed5_2>
    ...
    000 (845638.001.000) 03/12 12:46:29 Job submitted from host: <128.104.100.43:9618?sock=5235_1ed5_2>
    ...
    000 (845638.002.000) 03/12 12:46:29 Job submitted from host: <128.104.100.43:9618?sock=5235_1ed5_2>
    ...
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
               Disk (KB)            :       12     1000  26703078
               Memory (MB)          :        0     1000      1000
    ...

And, if you look at one of the output files, you should see something
like this:

    Hello CHTC from Job 0 running on slot4@e069.chtc.wisc.edu

**Congratulations.** You\'ve run your first jobs in the CHTC!

What Else?
==========

Removing Jobs
-------------

To remove a specific job, specify the job \# in the queue (format:
Cluster.Process). Example:

    condor_rm 845638.0

You can even remove all of the jobs of the same cluster by specifying
only the Cluster value for that batch.\
\
To remove **all of your jobs**:

    condor_rm $USER

The Importance of Testing
-------------------------

1. **Examining Job Success.** Within the log file, you can see
information about the completion of each job, including a system error
code (as seen in \"return value 0\"). You can use this code, as well as
information in your \".err\" file and other output files, to determine
what issues your job(s) may have had, if any.   

2. **Determining Memory and Disk Requirements.** The log file also
indicates how much memory and disk each job used, so that you can first
test a few jobs before submitting many more with more accurate request
values. When you request too little, your jobs will be \"evicted\" from
the computer they\'re running on, and HTCondor will have to try to rerun
them (maybe many times) until it requests enough for you. When you
request too much, your jobs may not match to as many available \"slots\"
as they could otherwise, and your overall throughput will suffer in that
case as well.  

3. **Determining Run Time.** Depending on how long each of your jobs are
(determined by examining when the job began executing and when it
completed), you can send your jobs to even more computers than are in
the CHTC Pool (where your jobs will run, by default). Refer to the table
below for tips on how to send your jobs to the rest of the UW Grid and
to the national [Open Science Grid](http://www.opensciencegrid.org/).

Getting the Right Resources
---------------------------

Be sure to always add or modify the following lines in your submit
files, as appropriate, and after running a few tests.

{:.gtable}
  | Submit file entry | Resources your jobs will run on |
  | --- | --- |
  | request\_cpus = *cpus* | Matches each job to a computer \"slot\" with at least this many CPU cores. |
  | request\_disk = *kilobytes* | Matches each job to a slot with at least this much disk space, in units of KB. |
  | request\_memory = *megabytes* | Matches each job to a slot with at least this much memory (RAM), in units of MB.|
  | +WantFlocking = true | Also send jobs to other HTCondor Pools on campus (UW Grid) <br> Good for jobs that are less than \~4 hours, on average, or checkpointing jobs. |
  | +WantGlideIn = true | Also send jobs to the Open Science Grid (OSG). <br> Good for jobs that are less than \~2 hours, on average, or checkpointing jobs. |


Now, time for a little homework
-------------------------------

To get the most of the CHTC, you will want to have a good understanding
of how HTCondor works. The full HTCondor manual is comprehensive, but
the links below guide you to the most important sections to read in
order to get started. You can always dig into more details as you become
more experienced.

-   [Road-map for Running
    Jobs](http://research.cs.wisc.edu/htcondor/manual/v7.8/2_4Road_map_Running.html)
-   [Submitting a
    Job](http://research.cs.wisc.edu/htcondor/manual/v7.8/2_5Submitting_Job.html)
-   [`condor_submit` manual
    page](http://research.cs.wisc.edu/htcondor/manual/v7.8/condor_submit.html)
-   [Managing a
    Job](http://research.cs.wisc.edu/htcondor/manual/v7.8/2_6Managing_Job.html)
-   [`condor_q` manual
    page](http://research.cs.wisc.edu/htcondor/manual/v7.8/condor_q.html)
-   [Matchmaking with
    ClassAds](http://research.cs.wisc.edu/htcondor/manual/v7.8/2_3Matchmaking_with.html)

Now you are ready for some real work
------------------------------------

Ok, you have the basics! This should be enough background to get you
started using the CHTC for the *real* problems you came to us for.
Remember, we are here to help. Don\'t hesitate to contact us at
[chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) with questions.
