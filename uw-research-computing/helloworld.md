---
highlighter: none
layout: markdown-page
title: Running Your First CHTC Jobs
---

   
So, you have an account on a submit node, and you are ready to run your
first job in the CHTC. As we described in [Our
Approach](/approach.html), the CHTC is a
collection of distributed resources. The magic that enables you to run
jobs on these resources is software, called
[HTCondor](http://research.cs.wisc.edu/htcondor/), developed at the
UW-Madison.

{% capture content %}
1.  [Let\'s first do, and then ask why](#1-lets-first-do-and-then-ask-why)
2.  [What Else?](#2-what-else)
    -   [Removing Jobs](#a-removing-jobs)
    -   [The Importance of Testing](#b-the-importance-of-testing)
    -   [Getting the Right Resources](#c-getting-the-right-resources)
    -   [Time for a little homework](#d-run-your-own-jobs)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

**1. Let\'s first do, and then ask why**
====================================

We recommend that you also check out the 
[HTCondor Job Submission Intro (video)](https://www.youtube.com/watch?v=p2X6s_7e51k&list=PLO7gMRGDPNumCuo3pCdRk23GDLNKFVjHn&index=2),
but this example let's you just run some jobs so you can see what
happens, with some additional discussion along the way. 

We are going to run the traditional
\'hello world\' program with a CHTC twist. In order to demonstrate the
distributed resource nature of CHTC's HTC System, we will produce a \'Hello
CHTC\' message 3 times, where each message is produced within is its own \'job\'.
Since you will not run execution commands yourself (HTCondor will do it for you), you need to tell
HTCondor *how* to run the jobs for you in the form of a *submit file*, which
describes the set of jobs.

***Note: You must be logged into an HTCondor submit machine for the
following example to work.***

**1.** Copy the highlighted text below, and paste it into file called
`hello-chtc.sub` (we recommend using a command line text editor) in your home directory on the submit
machine. This is the file you will submit to HTCondor to describe your jobs (known as the submit file).

``` 
# hello-chtc.sub
# My very first HTCondor submit file
#
# Specify the HTCondor Universe (vanilla is the default and is used
#  for almost all jobs) and your desired name of the HTCondor log file,
#  which is where HTCondor will describe what steps it takes to run 
#  your job. Wherever you see $(Cluster), HTCondor will insert the 
#  queue number assigned to this set of jobs at the time of submission.
universe = vanilla
log = hello-chtc_$(Cluster).log
#
# Specify your executable (single binary or a script that runs several
#  commands), arguments, and a files for HTCondor to store standard
#  output (or "screen output").
#  $(Process) will be a integer number for each job, starting with "0"
#  and increasing for the relevant number of jobs.
executable = hello-chtc.sh
arguments = $(Process)
output = hello-chtc_$(Cluster)_$(Process).out
error = hello-chtc_$(Cluster)_$(Process).err
#
# Specify that HTCondor should transfer files to and from the
#  computer where each job runs. The last of these lines *would* be
#  used if there were any other files needed for the executable to use.
should_transfer_files = YES
when_to_transfer_output = ON_EXIT
# transfer_input_files = file1,/absolute/pathto/file2,etc
#
# Tell HTCondor what amount of compute resources
#  each job will need on the computer where it runs.
request_cpus = 1
request_memory = 1GB
request_disk = 1MB
#
# Tell HTCondor to run 3 instances of our job:
queue 3
```
{:.sub}

> For a \"template\" version of this submit file without the comments,
> [click here](/uw-research-computing/files/template.sub).

**2.** Now, create the executable that we specified above: copy the text
below and paste it into a file called `hello-chtc.sh`

``` 
#!/bin/bash
#
# hello-chtc.sh
# My very first CHTC job
#
# print a 'hello' message to the job's terminal output:
echo "Hello CHTC from Job $1 running on `whoami`@`hostname`"
#
# keep this job running for a few minutes so you'll see it in the queue:
sleep 180
```
{:.file}

When HTCondor runs this executable, it will pass the \$(Process) value
for each job and `hello-chtc.sh` will insert that value for \"\$1\",
above.

**3.** Now, submit your job to the queue using `condor_submit`:


```
[alice@submit]$ condor_submit hello-chtc.sub
```
{:.term}


The `condor_submit` command actually submits your jobs to HTCondor. If
all goes well, you will see output from the `condor_submit` command that
appears as:

``` 
Submitting job(s).....
3 job(s) submitted to cluster 436950.
```
{:.term}


**4.** To check on the status of your jobs, run the following command:

{:.term}
``` 
[alice@submit]$ condor_q
```


(If you want to see everyone\'s jobs, use `condor_q -all`.)

The output of `condor_q` should look like this:

``` 
-- Schedd: submit-2.chtc.wisc.edu : <128.104.101.92:9618?... @ 04/05/19 15:35:17
OWNER  BATCH_NAME     SUBMITTED   DONE   RUN    IDLE  TOTAL  JOB_IDS
alice  ID: 436950     4/5  15:34     _     _       3      3  436950.0-2

3 jobs; 0 completed, 0 removed, 3 idle, 0 running, 0 held, 0 suspended
```
{:.term}

You can run the `condor_q` command periodically to see the progress of
your jobs. By default, `condor_q` shows jobs grouped into batches by
batch name (if provided), or executable name. To show all of your jobs
on individual lines, add the `-nobatch` option. For more details on this
option, and other options to `condor_q`, see our [condor\_q
guide](condor_q.html).

> **Potential Failures**
>
> If your jobs go on hold and you usually use a Windows laptop or
> desktop, please see [this page](dos-unix.html) for a potential
> diagnosis and solution.


**5.** When your jobs complete after a few minutes, they\'ll leave the
queue. If you do a listing of your home directory with the command
`ls -l`, you should see something like:

``` 
[alice@submit]$ ls -l
total 28
-rw-r--r-- 1 alice alice    0 Apr  5 15:37 hello-chtc_436950_0.err
-rw-r--r-- 1 alice alice   60 Apr  5 15:37 hello-chtc_436950_0.out
-rw-r--r-- 1 alice alice    0 Apr  5 15:37 hello-chtc_436950_1.err
-rw-r--r-- 1 alice alice   60 Apr  5 15:37 hello-chtc_436950_1.out
-rw-r--r-- 1 alice alice    0 Apr  5 15:37 hello-chtc_436950_2.err
-rw-r--r-- 1 alice alice   60 Apr  5 15:37 hello-chtc_436950_2.out
-rw-r--r-- 1 alice alice 5111 Apr  5 15:37 hello-chtc_436950.log
-rw-rw-r-- 1 alice alice  241 Apr  5 15:33 hello-chtc.sh
-rw-rw-r-- 1 alice alice 1387 Apr  5 15:33 hello-chtc.sub
```
{:.term}

**Useful information is provided in the user log and the output files.**

HTCondor creates a transaction log of everything that happens to your
jobs. Looking at the log file is very useful for debugging problems that
may arise. An excerpt from `hello-chtc_845638.log` produced due the
submission of the 3 jobs will look something like this:

``` 

000 (436950.000.000) 04/05 15:34:33 Job submitted from host: <128.104.101.92:9618?addrs=128.104...>
...
040 (436950.000.000) 04/05 15:34:50 Started transferring input files
    Transferring to host: <128.104.55.170:9618?addrs=128.104....>
...
040 (436950.000.000) 04/05 15:34:50 Finished transferring input files
...
001 (436950.000.000) 04/05 15:34:51 Job executing on host: <128.104.55.170:9618?addrs=128.104...>
...
006 (436950.000.000) 04/05 15:35:00 Image size of job updated: 368
    1  -  MemoryUsage of job (MB)
    292  -  ResidentSetSize of job (KB)
...
040 (436950.000.000) 04/05 15:37:51 Started transferring output files
...
040 (436950.000.000) 04/05 15:37:51 Finished transferring output files
...
005 (436950.000.000) 04/05 15:37:51 Job terminated.
    (1) Normal termination (return value 0)
        Usr 0 00:00:00, Sys 0 00:00:00  -  Run Remote Usage
        Usr 0 00:00:00, Sys 0 00:00:00  -  Run Local Usage
        Usr 0 00:00:00, Sys 0 00:00:00  -  Total Remote Usage
        Usr 0 00:00:00, Sys 0 00:00:00  -  Total Local Usage
    60  -  Run Bytes Sent By Job
    241  -  Run Bytes Received By Job
    60  -  Total Bytes Sent By Job
    241  -  Total Bytes Received By Job
    Partitionable Resources :    Usage  Request Allocated 
       Cpus                 :        0        1         1 
       Disk (KB)            :       24     1024    908236 
       Ioheavy              :                           0 
       Memory (MB)          :        1     1024      1024 
...
```
{:.file}

And, if you look at one of the output files, you should see something
like this:

``` 
Hello CHTC from Job 0 running on alice@e389.chtc.wisc.edu
```
{:.file}
  
**Congratulations.** You\'ve run your first jobs in the CHTC!


**2. What Else?**
=============

A. Removing Jobs
----------------

To remove a specific job, specify the job ID number from the queue
(format: Cluster.Process). Example:

``` 
[alice@submit]$ condor_rm 845638.0
```
{:.term}

You can even remove all of the jobs of the same cluster by specifying
only the Cluster value for that batch. 
To remove **all of your jobs**:

``` 
[alice@submit]$ condor_rm $USER
```
{:.term}

**B. The Importance of Testing**
----------------------------

1\. **Examining Job Success.** Within the log file, you can see
information about the completion of each job, including a system error
code (as seen in \"return value 0\"). You can use this code, as well as
information in your \".err\" file and other output files, to determine
what issues your job(s) may have had, if any. 

2\. **Determining Memory
and Disk Requirements.** The log file also indicates how much memory and
disk each job used, so that you can first test a few jobs before
submitting many more with more accurate request values. When you request
too little, your jobs will be terminated by HTCondor and set to \"hold\" 
status to flag that job as requiring your attention. To learn more 
about why a job as gone on hold, use `condor_q -hold`.

When you request too much, your jobs may not match to as many 
available \"slots\" as they could otherwise, and your overall throughput 
will suffer in that case as well.

3\. **Determining Run Time.** Depending on how long each of your jobs are
(determined by examining when the job began executing and when it
completed), you can send your jobs to even more computers than are in
the CHTC Pool (where your jobs will run, by default). Refer to the table
below for tips on how to send your jobs to the rest of the UW Grid and
to the national [OS Pool](https://osg-htc.org/about/open_science_pool/).



**C. Getting the Right Resources**
------------------------------

Be sure to always add or modify the following lines in your submit
files, as appropriate, and after running a few tests.

  {:.gtable}
  | Submit file entry  | Resources your jobs will run on |
  | --- | --- |
  | `request_cpus = `*`cpus`*  |  Matches each job to a computer \"slot\" with at least this many CPU cores. |
  | `request_disk = `*`kilobytes`*  |  Matches each job to a slot with at least this much disk space, in units of KB. |
  |`request_memory = `*`megabytes`*  |  Matches each job to a slot with at least this much memory (RAM), in units of MB.|
  |`+WantFlocking = true`  |  Also send jobs to other HTCondor Pools on campus (UW Grid) <br> Good for jobs that are less than \~8 hours, or checkpoint at least that frequently.|
  |`+WantGlideIn = true`  |  Also send jobs to the OS Pool.<br> Good for jobs that are less than \~8 hours (or checkpoint at least that frequently), and have been tested for portability. (Contact Us for more details).|

Learn more about sending jobs to the UW Grid and OS pool in our [Scaling Beyond Local HTC Capacity](scaling-htc.html) guide.


D. Run Your OWN Jobs
----------------------------------

If you didn't check it out already, NOW is a great time to check out the 
[HTCondor Job Submission Intro (video)](https://www.youtube.com/watch?v=p2X6s_7e51k&list=PLO7gMRGDPNumCuo3pCdRk23GDLNKFVjHn&index=2), 
which introduces various ways to specify differences between jobs (e.g. 
parameters, different input filenames, etc.), ways to organize your data, etc.
You'll notice that it's part of a playlist of videos with topics for HTCondor users.

[Our full set of CHTC
online guides is available here](guides.html), and includes some specific 
examples for how to use various software within a job, or a Research Computing 
Facilitation can help you get your software going. Remember to [Get
Help](get-help.html) whenever you have questions or issues. That\'s
what CHTC staff are here for.

The full HTCondor manual is comprehensive
and lengthy, and Googling \"HTCondor examples\" may lead you to examples
that really only work on another campus\'s HTCondor system. You can
always dig into more details as you become more experienced, but the
below pages of the manual may be a good place to start, if you like
manuals:

-   [Road-map for Running
    Jobs](https://htcondor.readthedocs.io/en/latest/users-manual/running-a-job-steps.html)
-   [Submitting a
    Job](https://htcondor.readthedocs.io/en/latest/users-manual/submitting-a-job.html)
-   [`condor_submit` manual
    page](https://htcondor.readthedocs.io/en/latest/man-pages/condor_submit.html)
-   [Managing a
    Job](https://htcondor.readthedocs.io/en/latest/users-manual/managing-a-job.html)
-   [`condor_q` manual
    page](https://htcondor.readthedocs.io/en/latest/man-pages/condor_q.html)
-   [Matchmaking with
    ClassAds](https://htcondor.readthedocs.io/en/latest/users-manual/matchmaking-with-classads.html)

**Now you are ready for some real work**
====================================

Ok, you have the basics! This should be enough background to get you
started using the CHTC for the *real* problems you came to us for.
Remember, we are here to help. Don\'t hesitate to contact us at
[chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) with questions.
