---
highlighter: none
layout: guide
title: "Practice: Submit HTC Jobs using HTCondor"
guide:
    category: Submit jobs
    tag:
        - htc
---

## Purpose

This guide discusses how to run jobs on the CHTC using HTCondor.

## Workflow Overview

The process of running computational workflows on CHTC resources follows the following outline: 

<img src="/images/overview_htcondor_job_submission.png" class= "img-fluid"/>

**Terminology:**

- **Access point** is where you login and stage your data, executables/scripts, and software to use in jobs. 
- **HTCondor** is a job scheduling software that will run your jobs out on the execution points. 
- The **Execution Points** is the set of resources your job runs on. It is composed of servers, as well as other technologies, that compose the cpus, memory, and disk space that will run the computations of your jobs. 

## Run Jobs using HTCondor

We are going to run the traditional 'hello world' program with a CHTC twist. In order to demonstrate the distributed resource nature of CHTC's HTC System, we will produce a 'Hello CHTC' message 3 times, where each message is produced within is its own 'job'. Since you will not run execution commands yourself (HTCondor will do it for you), you need to tell HTCondor how to run the jobs for you in the form of a submit file, which describes the set of jobs.

> Note: You must be logged into a CHTC Access Point for the following example to work.

### Prepare job executable and submit file on an Access Point

1. First, create the executable script you would like HTCondor to run.
   For our example, copy the text below and paste it into a file called `hello-world.sh` (we recommend using a command line text editor) in your home directory.
	
   ```
   #!/bin/bash
   #
   # hello-world.sh
   # My CHTC job
   #
   # print a 'hello' message to the job's terminal output:
   echo "Hello CHTC from Job $1 running on `whoami`@`hostname`"
   #
   # keep this job running for a few minutes so you'll see it in the queue:
   sleep 180
   ```

   This script would be run locally on our terminal by typing `hello-world.sh <FirstArgument>`.
   However, to run it on CHTC, we will use our HTCondor submit file to run the `hello-world.sh` executable and to automatically pass different arguments to our script. 

3. Prepare your HTCondor submit file, which you will use to tell HTCondor what job to run and how to run it.
   Copy the text below, and paste it into file called `hello-world.sub`.
   This is the file you will submit to HTCondor to describe your jobs (known as the submit file).

   ```
   # hello-world.sub
   # My HTCondor submit file
   
   # Specify your executable (single binary or a script that runs several
   #  commands) and arguments to be passed to jobs. 
   #  $(Process) will be a integer number for each job, starting with "0"
   #  and increasing for the relevant number of jobs.
   executable = hello-world.sh
   arguments = $(Process)
   		
   # Specify the name of the log, standard error, and standard output (or "screen output") files. Wherever you see $(Cluster), HTCondor will insert the 
   #  queue number assigned to this set of jobs at the time of submission.
   log = hello-world_$(Cluster)_$(Process).log
   error = hello-world_$(Cluster)_$(Process).err
   output = hello-world_$(Cluster)_$(Process).out
   
   # This line *would* be used if there were any other files
   # needed for the executable to use.
   # transfer_input_files = file1,/absolute/pathto/file2,etc
   
   # Tell HTCondor requirements (e.g., operating system) your job needs, 
   # what amount of compute resources each job will need on the computer where it runs.
   request_cpus = 1
   request_memory = 1GB
   request_disk = 5GB
   
   # Tell HTCondor to run 3 instances of our job:
   queue 3
   ```
   {:.sub}
   
   By using the "$1" variable in our hello-world.sh executable, we are telling HTCondor to fetch the value of the argument in the first position in the submit file and to insert it in location of "$1" in our executable file.
   
   Therefore, when HTCondor runs this executable, it will pass the $(Process) value for each job and hello-world.sh will insert that value for "$1" in hello-world.sh.
   
   More information on special variables like "$1", "$2", and "$@" can be found [here](https://swcarpentry.github.io/shell-novice/06-script.html).
		
5. Now, submit your job to HTCondor’s queue using `condor_submit`:
	
   ```
   [alice@ap2002]$ condor_submit hello-world.sub
   ```
   {:.term}
	
   The `condor_submit` command actually submits your jobs to HTCondor. If all goes well, you will see output from the `condor_submit` command that appears as:

   ```
   Submitting job(s)...
   3 job(s) submitted to cluster 36062145.
   ```
   {:.term}

7. To check on the status of your jobs in the queue, run the following command:
   
   ```
   [alice@ap2002]$ condor_q
   ```
   {:.term}
   
   The output of `condor_q` should look like this:

   ```
   -- Schedd: ap2002.chtc.wisc.edu : <128.104.101.92:9618?... @ 04/14/23 15:35:17
   OWNER     BATCH_NAME     SUBMITTED   DONE   RUN    IDLE  TOTAL JOB_IDS
   Alice ID: 3606214       4/14 12:31      2     1       _      3 36062145.0-2
   
   3 jobs; 2 completed, 0 removed, 0 idle, 1 running, 0 held, 0 suspended
   ```
   {:.term}
   
   You can run the `condor_q` command periodically to see the progress of your jobs.
   By default, `condor_q` shows jobs grouped into batches by batch name (if provided), or executable name.
   To show all of your jobs on individual lines, add the `-nobatch` option. 

9. When your jobs complete after a few minutes, they'll leave the queue.
   If you do a listing of your `/home` directory with the command `ls -l`, you should see something like:
   
   ```
   [alice@submit]$ ls -l
   total 28
   -rw-r--r-- 1 alice alice    0 Apr  14 15:37 hello-world_36062145_0.err
   -rw-r--r-- 1 alice alice   60 Apr  14 15:37 hello-world_36062145_0.out
   -rw-r--r-- 1 alice alice    0 Apr  14 15:37 hello-world_36062145_0.log
   -rw-r--r-- 1 alice alice    0 Apr  14 15:37 hello-world_36062145_1.err
   -rw-r--r-- 1 alice alice   60 Apr  14 15:37 hello-world_36062145_1.out
   -rw-r--r-- 1 alice alice    0 Apr  14 15:37 hello-world_36062145_1.log
   -rw-r--r-- 1 alice alice    0 Apr  14 15:37 hello-world_36062145_2.err
   -rw-r--r-- 1 alice alice   60 Apr  14 15:37 hello-world_36062145_2.out
   -rw-r--r-- 1 alice alice    0 Apr  14 15:37 hello-world_36062145_2.log
   -rw-rw-r-- 1 alice alice  241 Apr  14 15:33 hello-world.sh
   -rw-rw-r-- 1 alice alice 1387 Apr  14 15:33 hello-world.sub
   ```
   {:.term}

   **Useful information is provided in the user log, standard error, and standard output files.**
	
   HTCondor creates a transaction log of everything that happens to your jobs.
   Looking at the log file is very useful for debugging problems that may arise.
   Additionally, at the completion of a job, the .log file will print a table describing the amount of compute resources requested in the submit file compared to the amount the job actually used.
   An excerpt from hello-world_36062145_0.log produced due the submission of the 3 jobs will looks like this:
	
   ```
   …
   005 (36062145.000.000) 2023-04-14 12:36:09 Job terminated.
   	(1) Normal termination (return value 0)
   		Usr 0 00:00:00, Sys 0 00:00:00  -  Run Remote Usage
   		Usr 0 00:00:00, Sys 0 00:00:00  -  Run Local Usage
   		Usr 0 00:00:00, Sys 0 00:00:00  -  Total Remote Usage
   		Usr 0 00:00:00, Sys 0 00:00:00  -  Total Local Usage
   	72  -  Run Bytes Sent By Job
   	265  -  Run Bytes Received By Job
   	72  -  Total Bytes Sent By Job
   	265  -  Total Bytes Received By Job
   	Partitionable Resources :    Usage  Request  Allocated 
   	   Cpus                 :        0        1          1 
   	   Disk (KB)            :      118     1024 1810509281 
   	   Memory (MB)          :       54     1024       1024 
   
   	Job terminated of its own accord at 2023-04-14T17:36:09Z with exit-code 0.
   ```
   
   **And, if you look at one of the output files, you should see something like this:**
   `Hello CHTC from Job 0 running on alice@e389.chtc.wisc.edu.`

**Congratulations. You've run an HTCondor job!**

## Important Workflow Elements

**A. Removing Jobs** 

To remove a specific job, use `condor_rm <JobID, ClusterID, Username>`. 
Example:
	
```
[alice@ap2002]$ condor_rm 845638.0
```
{:.term}

**B. Importance of Testing & Resource Optimization** 

1. **Examine Job Success** Within the log file, you can see information about the completion of each job, including a system error code (as seen in "return value 0").
   You can use this code, as well as information in your ".err" file and other output files, to determine what issues your job(s) may have had, if any.

2. **Improve Efficiency** Researchers with input and output files greater than 1GB, should store them in their `/staging` directory instead of `/home` to improve file transfer efficiency.
   See our data transfer guides to learn more. 

3. **Get the Right Resource Requests**
   Be sure to always add or modify the following lines in your submit files, as appropriate, and after running a few tests.

   <table>
     <tr>
       <th>Submit file entry</th>
       <th>Resources your jobs will run on</th> 
     </tr>
     <tr>
       <td>request_cpus = cpus</td>
       <td>Matches each job to a computer "slot" with at least this many CPU cores.</td> 
     </tr>
     <tr>
       <td>request_disk = kilobytes</td>
       <td>Matches each job to a slot with at least this much disk space, in units of KB.</td> 
     </tr>
     <tr>
       <td>request_memory = megabytes</td>
       <td>Matches each job to a slot with at least this much memory (RAM), in units of MB.</td>
     </tr>
   </table>

4. **Determining Memory and Disk Requirements.**
   The log file also indicates how much memory and disk each job used, so that you can first test a few jobs before submitting many more with more accurate request values.
   When you request too little, your jobs will be terminated by HTCondor and set to "hold" status to flag that job as requiring your attention.
   To learn more about why a job as gone on hold, use `condor_q -hold`.
   When you request too much, your jobs may not match to as many available "slots" as they could otherwise, and your overall throughput will suffer.

## You have the basics, now you are ready to run your OWN jobs!
