---
highlighter: none
layout: content
title: Learning About Your Jobs Using condor_q
---

{% capture content %}
The `condor_q` command can be used for much more than just
checking on whether your jobs are running or not! Read on to learn how
you can use `condor_q` to answer many common questions about running
jobs.
{% endcapture %}
{% include /components/markdown-container.html %}

{% capture content %}
1.  [Default `condor_q` output, in \"batches\"](#default-condorq-output)
2.  [View all of your jobs (old condor\_q output).](#view-all-jobs)
3.  [View jobs from all users.](#view-jobs-from-all-users)
4.  [Determine why jobs are on hold.](#determine-why-jobs-are-on-hold)
5.  [Determine why a job is not running](#find-out-why-jobs-are-idle)
6.  [Find out where jobs are running.](#find-out-where-jobs-are-running)
7.  [View jobs by DAG.](#view-jobs-by-dag)
8.  [View all details about a job.](#view-all-details-about-a-job)
9.  [View specific details about a job using auto-format.](#view-specific-details-about-a-job-using-auto-format)
10. [View only specific types of jobs using a constraint](#constraining-the-output-of-condorq)
11. [Remove a held job from the queue](#remove-a-held-job-from-the-queue)
{% endcapture %}
{% include /components/directory.html %}  

{% capture content %}
Summary
=======

-   `condor_q`: Show my jobs that have been submitted on this server.\
    Useful options:
    -   `-nobatch`: Starting in version HTCondor 8.6.0 installed in July
        2016, data is displayed in a compact mode (one line per
        cluster). With this option output will be displayed in the old
        format (one line per process)
    -   `-all`: Show all the jobs submitted on the submit server.
    -   `-hold`: Show only jobs in the \"on hold\" state and the reason
        for that. Held jobs are those that got an error so they could
        not finish. An action from the user is expected to solve the
        problem.
    -   `-better-analyze JobId`: -better-analyze : Analyse a specific
        job and show the reason why it is in its current state.
    -   `-run`: Show your running jobs and related info, like how much
        time they have been running, in which machine, etc.
    -   `-dag`: Organize condor\_q output by DAG.
    -   `-long JobId`: Show all information related to that job.
    -   `-af Attr1 Attr2 ...`: List specific attributes of jobs, using
        autoformat.

Examples and Further Explanation
================================

<a name="default"/>

**1. Default condor\_q output**
---------------------------

As of July 19, 2016, the default `condor_q` output will show a single
user\'s jobs, grouped in \"batches\", as shown below:

``` 
[alice@submit]$ condor_q
OWNER   BATCH_NAME        SUBMITTED   DONE   RUN    IDLE   HOLD  TOTAL JOB_IDS
alice   CMD: sb          6/22 13:05      _     32      _      _      _ 14297940.23-99
alice   DAG: 14306351    6/22 13:47     27    113     65      _    205 14306411.0 ...
alice   CMD: job.sh      6/22 13:56      _      _     12      _      _ 14308195.6-58
alice   DAG: 14361197    6/22 16:04    995      1      _      _   1000 14367836.0
```
{:.term}

HTCondor will automatically group jobs into \"batches\" for this
display. However, it\'s also possible for you to specify groups of jobs
as a \"batch\" yourself. You can either:

-   Add the following line to your submit file:

    ``` {.sub}
     batch_name = "CoolJobs" 
    ```

-   Use the `-batch-name` option with condor\_submit:

    ``` 
    [alice@submit]$ condor_submit submit_file.sub -batch-name CoolJobs
    ```
    {:.term}

Either option will create a batch of jobs with the label \"CoolJobs\".

<a name="nobatch"/>

**2. View all jobs.**
-----------------

To display more detailed condor\_q output (where each job is listed on a
separate line), you can use the batch name or any existing grouping
constraint (`ClusterId` or other \"-constraint\" options - see
[below](#constraint) for more on constraints) and the `-nobatch` flag.

Looking at a batch of jobs with the same `ClusterId` would look like
this:

``` 
[alice@submit]$ condor_q -nobatch 195

 ID     OWNER    SUBMITTED     RUN_TIME ST PRI SIZE CMD
195.10  alice    6/22 13:00   0+00:00:00 H  0    0.0 job.sh
195.14  alice    6/22 13:00   0+00:01:44 R  0    0.0 job.sh
195.16  alice    6/22 13:00   0+00:00:26 R  0    0.0 job.sh
195.39  alice    6/22 13:00   0+00:00:05 R  0    0.0 job.sh
195.40  alice    6/22 13:00   0+00:00:00 I  0    0.0 job.sh
195.41  alice    6/22 13:00   0+00:00:00 I  0    0.0 job.sh
195.53  alice    6/22 13:00   0+00:00:00 I  0    0.0 job.sh
195.57  alice    6/22 13:00   0+00:00:00 I  0    0.0 job.sh
195.58  alice    6/22 13:00   0+00:00:00 I  0    0.0 job.sh

9 jobs; 0 completed, 0 removed, 5 idle, 3 running, 1 held, 0 suspended
```
{:.term}

This was the default view for `condor_q` from January 2016 until July
2016.

<a name="all"/>

**3. View jobs from all users.**
----------------------------

By default, `condor_q` will just show you information about **your**
jobs. To get information about all jobs in the queue, type:

``` 
[alice@submit]$ condor_q -all
```
{:.term}

This will show a list of all job batches in the queue. To see a list of
all jobs (individually, not in batches) for all users, combine the
`-all` and `-nobatch` options with `condor_q`. This was the default view
for `condor_q` before January 2016.

<a name="hold"/>

**4. Determine why jobs are on hold.**
----------------------------------

If your jobs have gone on hold, you can see the hold reason by running:

``` 
[alice@submit]$ condor_q -hold
```
{:.term}

or

``` 
[alice@submit]$ condor_q -hold JobId 
```
{:.term}

The first will show you the hold reasons for **all** of your jobs that
are on hold; the second will show you the hold reason for a specific
job. The hold reason is sometimes cut-off; try the following to see the
entire hold reason:

``` 
[alice@submit]$ condor_q -hold -af HoldReason
```
{:.term}

If you aren\'t sure what your hold reason means email
chtc@cs.wisc.edu.

<a name="bet"/>

**5. Find out why jobs are idle**
-----------------------------

`condor_q` has an option to describe why a job hasn\'t matched and
started running. Find the JobId of a job that hasn\'t started running
yet and use the following command:

``` 
$ condor_q -better-analyze JobId
```
{:.term}

After a minute or so, this command should print out some information
about why your job isn\'t matching and starting. This information is not
always easy to understand, so please email us with the output of this
command if you have questions about what it means.

<a name="run"/>

**6. Find out where jobs are running.**
-----------------------------------

To see which computers your jobs are running on, use:

``` 
[alice@submit]$ condor_q -nobatch -run
428.0   alice        6/22  17:27   0+00:07:17 slot1_12@e313.chtc.wisc.edu
428.1   alice        6/22  17:27   0+00:07:11 slot1_8@e376.chtc.wisc.edu
428.2   alice        6/22  17:27   0+00:07:16 slot1_15@e451.chtc.wisc.edu
428.3   alice        6/22  17:27   0+00:07:16 slot1_17@e277.chtc.wisc.edu
428.5   alice        6/22  17:27   0+00:07:16 slot1_9@e351.chtc.wisc.edu
428.7   alice        6/22  17:27   0+00:07:16 slot1_1@e373.chtc.wisc.edu
428.8   alice        6/22  17:27   0+00:07:16 slot1_5@e264.chtc.wisc.edu
```
{:.term}

<a name="dag"/>

**7. View jobs by DAG.**
--------------------

If you have submitted multiple DAGs to the queue, it can be hard to tell
which jobs belong to which DAG. The `-dag` option to `condor_q` will
sort your queue output by DAG:

``` 
[alice@submit]$ condor_q -nobatch -dag
 ID      OWNER/NODENAME   SUBMITTED     RUN_TIME ST PRI SIZE CMD               
460.0   alice        11/18 16:51   0+00:00:17 R  0   0.3  condor_dagman -p 0
462.0    |-0           11/18 16:51   0+00:00:00 I  0   0.0  print.sh
463.0    |-1           11/18 16:51   0+00:00:00 I  0   0.0  print.sh
464.0    |-2           11/18 16:51   0+00:00:00 I  0   0.0  print.sh
461.0   alice        11/18 16:51   0+00:00:09 R  0   0.3  condor_dagman -p 0
465.0    |-0           11/18 16:51   0+00:00:00 I  0   0.0  print.sh
466.0    |-1           11/18 16:51   0+00:00:00 I  0   0.0  print.sh
467.0    |-2           11/18 16:51   0+00:00:00 I  0   0.0  print.sh

8 jobs; 0 completed, 0 removed, 6 idle, 2 running, 0 held, 0 suspended
```
{:.term}

<a name="long"/>

**8. View all details about a job.**
--------------------------------

Each job you submit has a series of attributes that are tracked by
HTCondor. You can see the full set of attributes for a single job by
using the \"long\" option for `condor_q` like so:

``` 
[alice@submit]$ condor_q -l JobId 
...
Iwd = "/home/alice/analysis/39909"
JobPrio = 0
RequestCpus = 1
JobStatus = 1
ClusterId = 19997268
JobUniverse = 5
RequestDisk = 10485760
RequestMemory = 4096
DAGManJobId = 19448402
...
```
{:.term}

Attributes that are often useful for checking on jobs are:

-   `Iwd`: the job\'s submission directory on the submit node
-   `UserLog`: the log file for a job
-   `RequestMemory, RequestDisk`: how much memory and disk you\'ve
    requested per job
-   `MemoryUsage`: how much memory the job has used so far
-   `JobStatus`: numerical code indicating whether a job is idle,
    running, or held
-   `HoldReason`: why a job is on hold
-   `DAGManJobId`: for jobs managed by a DAG, this is the JobId of the
    parent DAG

<a name="af"/>

**9. View specific details about a job using auto-format**
------------------------------------------------------

If you would like to see specific attributes (see above) for a job or
group of jobs, you can use the \"auto-format\" (`-af`) option to
`condor_q` which will print out only the attributes you name for a
single job or group of jobs.

For example, if I would like to see the amount of memory and disk I\'ve
requested for all of my jobs, and how much memory is currently behing
used, I can run:

``` 
[alice@submit]$ condor_q -af RequestMemory RequestDisk MemoryUsage
1 325 undefined
1 325 undefined
2000 1000 245
2000 1000 220
2000 1000 245
```
{:.term}

<a name="constraint"/>

**10. Constraining the output of condor\_q.**
-----------------------------------------

If you would like to find jobs that meet certain conditions, you can use
`condor_q`\'s \"constraint\" option. For example, suppose you want to
find all of the jobs associated with the DAGMan Job ID \"234567\". You
can search using:

``` 
[alice@submit]$ condor_q -constraint "DAGManJobId == 234567" 
```
{:.term}

To use a name (for example, a batch name) as a constraint, you\'ll need
to use multiple sets of quotation marks:

``` 
[alice@submit]$ condor_q -constraint 'JobBatchName == "MyJobs"'
```
{:.term}

One common use of constraints is to find all jobs that are running,
held, or idle. To do this, use a constraint with the `JobStatus`
attribute and the appropriate status number - the status codes can be
found in [Appendix
A](https://htcondor.readthedocs.io/en/latest/classad-attributes/job-classad-attributes.html?highlight=JobStatus)
of the HTCondor Manual.

Remember [`condor_q -hold`](#determine-why-jobs-are-on-hold) from before? In the background, the
`-hold` option is constraining the list of jobs to jobs that are on hold
(using the `JobStatus` attribute) and then printing out the `HoldReason`
attribute. Try running:

``` 
[alice@submit]$ condor_q -constraint "JobStatus == 5" -af ClusterId ProcId HoldReason
```
{:.term}

You should see something very similar to running `condor_q -hold`!

<a name="remove"/>

**11. Remove a held job from the queue**
------------------------------------------------------

To remove a job held in the queue, run:

```
[alice@submit]$ condor_rm <JobID>
```
{:.term}

This will remove the job in the queue. Once you have made changes to allow the job to run successfully, the job can be resubmitted using `condor_submit`.

------------------------------------------------------------------------

This page takes some of its content and formatting from [this HTCondor
reference
page](http://vivaldi.ll.iac.es/sieinvens/siepedia/pmwiki.php?n=HOWTOs.CondorUsefulCommands).
{% endcapture %}
{% include /components/markdown-container.html %}
