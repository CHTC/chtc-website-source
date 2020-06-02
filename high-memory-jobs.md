---
highlighter: none
layout: default
title: Submitting High Memory Jobs on CHTC's HTC System
---

**The examples and information in the below guide areuseful ONLY if:**
-   you already have an account on a CHTC-administered submit server
-   your jobs will use more than \~120 GB of memory

**To best understand the below information, users should already befamiliar with:**
1.  Using the command-line to: navigate directories,
    create/edit/copy/move/delete files and directories, and run intended
    programs (aka \"executables\").
2.  [CHTC\'s Intro to Running HTCondor Jobs](/helloworld.shtml)
3.  CHTC\'s guides for handling large data ([Guide
    here](/file-avail-largedata.shtml)) and software installation.

Overview
--------

A high-memory job is one that requires a significantly larger amount of
memory (also known as RAM) than a typical high throughput job usually
over 200 GB and up to 1-4 TB. In the following guide, we cover resources
and recommendations for running high-memory work in CHTC. **However,
please make sure to email us if you believe you will need to run
\"high-memory\" work for the first time, or are planning the execution
of new \"high-memory\" work that is different from what you\'ve run
before.** We\'ll happily help you with some personalized tips and
considerations for getting your work done most efficiently.

1.  [High Memory Resources in CHTC](#resources)
2.  [Getting Started](#get-started)
3.  [Running High Memory Jobs](#running)


<a name="resoures"></a>

**1. High Memory Resources in CHTC**
================================

Our high memory servers have the following specs:

{:.gtable}
  | Number of servers| Memory per server | CPUs per server | Local disk space on server | Names | 
  | --- | --- | --- | --- | --- |
  | 1 | 512 GB | 16 | 2.5 TB | `wid-003`|
  | 16 | 512 GB | 40 | 1.2 TB | `e2003`-`e2018` |
  | 2 | 2 TB | 80 | 3.5+ TB | `mem2001`, `mem2002` |
  | 1 | 4 TB | 80 | 6 TB | `mem3` | 




<a name="get-started"></a>

**2. Getting Started**
==================

<a name="id"></a>

A. Identifying High Memory Jobs
-------------------------------

Jobs that request over 200GB of memory in their [submit file](#submit)
can run on our dedicated high memory machines. However, if your job
doesn\'t need quite that much memory, it\'s good to request less, as
doing so will allow your job(s) to run on more servers, since CHTC has
hundreds of servers with up to 100 GB of memory and dozens of servers
with up to 250 GB of memory.

<a name="testing"></a>

B. Testing
----------

Before running a full-size high-memory job, make sure to use a small
subset of data in a test job. Not only will this give you a chance to
try out the submit file syntax and make sure your job runs, but it can
help you estimate how much memory and/or disk you will need for a job
using your full data.

You can also use interactive jobs to test commands that will end up in
your \"executable\" script. To run an interactive job, prepare your
submit file as usual. Note that for an interactive job, you should use a
smaller memory request (and possibly lower CPU and disk as well) than
for the final job (so that the interactive job starts) and plan to
simply test commands, not run the entire program. To submit interactive
job, use the `-i` flag with `condor_submit`:

``` 
[alice@submit]$ condor_submit -i submit.file
```
{:.term}

After waiting for the interactive job to start, this should open a bash
session on an execute machine, which will allow you to test your
commands interactively. Once your testing is done, make the appropriate
changes to your executable, adjust your resource requests, and submit
the job normally.


<a name="consult"></a>

C. Consult with Facilitators
----------------------------

If you are unsure how to run high-memory jobs on CHTC, or if you\'re not
sure if everything in this guide applies to you, get in touch with a
research computing facilitator by emailing [chtc@cs.wisc.edu](chtc@cs.wisc.edu).


<a name="running"></a>

**3. Running High Memory Job**
===========================


<a name="submit"></a>

A. Submit File
--------------

The submit file shown in our [Hello World example](/helloworld.shtml) is
a good starting point for building your high memory job submit file. The
following are places where it\'s important to customize:

-   **`request_memory`**: It is crucial to make this request as accurate
    as you can by [testing](#testing) at a small scale if possible (see
    above). Online documentation/help pages or your colleagues\'
    experience is another source of information about required memory.  


-   **Long running jobs**: If your high memory job is likely to run
    longer than our 3-day time limit, please email us for options on how
    to run for longer. In the past, high memory jobs received an extra
    time allowance automatically but this is no longer the case.
-   **`request_cpus`**: Sometimes, programs that use a large amount of
    memory can also take advantage of multiple CPUs. If this is the case
    for your program, you can request multiple CPUs. However, **it is
    always easier to start jobs that request fewer number of cores,
    rather than more**. We recommend:

    {:.gtable}
      | Requesting \_\_\_ of memory? | Request fewer than \_\_\_ CPUs |
      | --- | --- | 
      | up to 100 GB | 4 |
      | 100-500 GB | 8 |
      | 500GB-1TB | 16 |
      | 1-1.5TB | 20 |
      | 1.5-2TB | 20 |
      | 2TB or greater | 32 |



    If you think a higher CPU request would significantly improve your
    job\'s performance, contact a facilitator.  

-   **`request_disk`**: Request the maximum amount of data your job will
    ever have within the job working directory on the execute node,
    including all output and input (which will take up space before some
    of it is removed from the job working directory at the end of the
    job).  
    
-   **Other requirements**: if your job uses files from [our large data
    space](/file-avail-largedata.shtml), or [Docker for
    software](/docker-jobs.shtml), add the necessary requirements for
    these resources to your submit file.

Altogether, a sample submit file may look something like this:

``` {.sub}
### Example submit file for a single staging-dependent job

universe = vanilla

# Files for the below lines will all be somewhere within /home/username,
# and not within /staging/username
log = run_myprogram.log
executable = run_Trinity.sh
output = $(Cluster).out
error = $(Cluster).err
transfer_input_files = trinityrnaseq-2.0.1.tar.gz
should_transfer_files = YES

# Require execute servers that have large data staging
Requirements = (Target.HasCHTCStaging == true)

# Memory, disk and CPU requests
request_memory = 200GB
request_disk = 100GB
request_cpus = 4

# Submit 1 job
queue 1
### END
```


<a name="software"></a>

B. Software
-----------

Like any other job, the best option for high memory work is to create a
portable installation of your software. We have guides for [scripting
languages](/howto_overview.shtml) and [using
Docker](/docker-jobs.shtml), and can otherwise provide individual
support for program installation [during office hours or over
email](/get-help.shtml).


<a name="executable"></a>

C. \"Executable\" script
------------------------

As described in many of our guides (for
[software](/howto_overview.shtml) or for using [large
data](/file-avail-largedata.shtml)), you will need to write a script
that will run your software commands for you and that will serve as the
submit file \"executable\". Things to note are:

-   If using files from our large data staging space, follow the
    recommendations in our [guide](/file-avail-largedata.shtml).
-   If using multiple cores, make sure that you request the same number
    of \"threads\" or \"processes\" in your command as you requested in
    your [submit file](#submit).

Altogether, a sample script may look something like this (perhaps called
`run_Trinity.sh`):

``` 
#!/bin/bash
# Copy input data from /staging to the present directory of the job
# and un-tar/un-zip them.  
cp /staging/username/reads.tar.gz ./
tar -xzvf reads.tar.gz
rm reads.tar.gz

# Set up the software installation in the job working directory, and 
# add it to the job's PATH
tar -xzvf trinityrnaseq-2.0.6-installed.tar.gz
rm trinityrnaseq-2.0.6-installed.tar.gz
export PATH=$(pwd)/trinityrnaseq-2.0.6:$PATH

# Run software command, referencing input files in the working directory and 
# redirecting "stdout" to a file.  Backslashes are line continuation.
Trinity --seqType fq --left reads_1.fq \
--right reads_2.fq --CPU 4 --max_memory \
20G > trinity_stdout.txt

# Trinity will write output to the working directory by default, 
# so when the job finishes, it needs to be moved back to /staging
tar -czvf trinity_out_dir.tar.gz trinity_out_dir
cp trinity_out_dir.tar.gz trinity_stdout.txt /staging/username/
rm reads_*.fq trinity_out_dir.tar.gz trinity_stdout.txt

### END
```
{:.file}
