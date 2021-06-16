---
highlighter: none
layout: markdown-page
title: HTCondor Submit File Variations
---


**The examples and information in this guide work best for the below
cases\*:**

1.  Submission to an HTCondor System with file transfer (rather than a
    shared filesystem).
2.  Submission to an HTCondor System that is unix-based (Linux or Mac
    operating system, as Windows may have important differences).

(\*see the HTCondor software manual and online examples from other
organizations for cases outside of those we cover on the CHTC website)\
\
**To best understand the below information, users should already have an
understanding of:**

1.  Using the command line to: navigate within directories,
create/copy/move/delete files and directories, and run their intended
programs (aka \"executables\").
2.  [The CHTC\'s Intro to Running HTCondor Jobs](helloworld)
3.  The importance of indicating the below submit file lines, which are left
out of the below examples for simplicity:
    ```
    universe = vanilla    # or other
    request_memory = 
    request_disk = 
    request_cpus = 
    should_transfer_files = YES
    when_to_transfer_output = ON_EXIT    # or other  
    ```   

**Click on the links below to go directly to the appropriate example**

1. [Organizing many jobs with integer-numbered filenames](#int-files)  

2. [Organizing job files within integer-numbered directories](#int-dir)  
    -  [Numbered directories using $(Process)](#int-dir-process)
    -  [Numbered directories using $(Process) as the InitialDir](#int-dir-initialdir) 
3. [Using your own non-HTCondor variables in the submit file](#own-variables)

4. [Jobs with un-numbered data](#notint)
    -  [Using a different, non-numbered input file for each job](#notint-files)
    -  [Using a different, non-numbered directory for each job](#notint-dir)







<a name="int-files"></a>

**1. Organizing many jobs with integer-numbered filenames:**
===============================================================

This example is most similar to our [Intro to Running HTCondor Jobs](/helloworld) and uses HTCondor's $(Process) variable to indicate
 filename differences for each job. For \"queue *N*\" in the submit file,
 the $(Process) variable will start with
 "0" and end with N-1, such that you can use $(Process) to indicate
 filenames and filepaths. 

Submit file:

```
executable = my.exec
arguments = $(Process).data comparison.data $(Process).out
output = $(Process).out
error = $(Process).err
log = $(Process).log
transfer_input_files = $(Process).data,comparison.data
queue 3
```



**Submit directory before submitting**

```
(submit_dir)/   submit.file
                my.exec
                comparison.data
                0.data
                1.data
                2.data
```

**After completion**
```
(submit_dir)/   submit.file
                my.exec
                comparison.data
                0.data  0.out  0.err  0.log
                1.data  1.out  1.err  1.log
                2.data  2.out  2.err  2.log
```


**Job working directory after input transfer, before execution**

    (working_dir)/  my.exec
                    0.data
                    comparison.data
                    (other HTCondor tracking files)



<a name="int-dir"></a>

**2. Organizing job files within integer-numbered sub-directories**
===============================================================

<a name="int-dir-process"></a>

A. Numbered directories using \$(Process)
-----------------------------------------

The below example uses \$(Process) to organize input, error, output, and
log files into numbered directories. Note that other files produced
within the job will still return to the submission directory.

**Submit file:**

    executable = my.exec
    arguments = input.data comparison.data $(Process).out
    output = $(Process)/job.out
    error = $(Process)/job.err
    log = $(Process)/job.log
    transfer_input_files = $(Process)/input.data,comparison.data
    queue 3


**Submit directory before submitting**

```
(submit_dir)/   submit.file
                my.exec
                comparison.data
                0/  input.data
                1/  input.data
                2/  input.data
```

**After completion**
```
(submit_dir)/   submit.file
                my.exec
                comparison.data
                0.out   1.out   2.out
                0/  input.data  job.out
                    job.err     job.log
                1/  input.data  job.out
                    job.err     job.log
                2/  input.data  job.out
                    job.err     job.log
```


**Job working directory after input transfer, before execution**

    (working_dir)/  my.exec
                    input.data
                    comparison.data
                    (other HTCondor tracking files)


<a name="int-dir-initialdir"></a>

B. Numbered directories using \$(Process) as the InitialDir
-----------------------------------------------------------

Most users prefer using \"IntitialDir\" to organize all job data,
including files created within the job, as opposed to the previous
method. Below, HTCondor\'s \"InitialDir\" variable is used to set the
initial directory of *each* job, establishing the location for
log/output/error, as well as input files needed by the job and any files
produced by the job.\
**NOTE that HTCondor still expects the executable to exist relative to
submission directory.**

**Submit file:**

    InitialDir = $(Process)
    executable = my.exec
    arguments = input.data comparison.data my.out
    output = job.out
    error = job.err
    log = job.log
    transfer_input_files = input.data,../comparison.data
    queue 3

**Submit directory before submitting**

```
(submit_dir)/   submit.file
                my.exec
                comparison.data
                0/  input.data
                1/  input.data
                2/  input.data
```

**After completion**
```
(submit_dir)/   submit.file
                my.exec
                comparison.data
                0/  input.data  job.out  my.out
                    job.err     job.log
                1/  input.data  job.out  my.out
                    job.err     job.log
                2/  input.data  job.out  my.out
                    job.err     job.log
```

**Job working directory after input transfer, before execution**

    (working_dir)/  my.exec
                    input.data
                    comparison.data
                    (other HTCondor tracking files)


<a name="own-variables"></a>

**3. Using your own non-HTCondor variables in the submit file**
===========================================================

You can define your own variable(s), named as you like, for use
throughout the submit file. Just make sure to not use a built-in
variable that is already used by HTCondor (\"output\" for example).

**Submit file:**

    # My variables:
    myvar = compare-states
    sharedfile = comparison.data
    #
    executable = $(myvar).exec
    arguments = $(Process).data $(sharedfile) $(myvar).out
    output = $(Process).out
    error = $(Process).err
    log = $(Process).log
    transfer_input_files = $(Process).data,$(sharedfile)
    queue 3

**Submit directory before submitting**

```
(submit_dir)/   submit.file
                compare-states.exec
                comparison.data
                0.data
                1.data
                2.data
```

**After completion**
```
(submit_dir)/   submit.file
                compare-states.exec
                comparison.data
                0.data  0.out  0.err  0.log
                1.data  1.out  1.err  1.log
                2.data  2.out  2.err  2.log
```


**Job working directory after input transfer, before execution**

    (working_dir)/  my.exec
                    0.data
                    comparison.data
                    (other HTCondor tracking files)



<a name="notint"></a>

**4. Jobs with non-numbered data**
==============================

Rather than creating multiple submit files for individual jobs or having
to number your files, it is possible to write a single submit file that
uses different non-numbered files by adding multiple \"queue\"
statements.

Essentially, the submit file establishes a set of overall submit file
lines, but in combination with a set of submit file lines that are
redefined with each instance of \"queue *N*\".


<a name="notint-files"></a>

A. Using a different, non-numbered input file for each job
-------------------------------------------------------

Using the ideas from the previous example with non-HTCondor submit
file variables, you can redefine your own non-HTCondor variable for each
instance of \"queue\":

**Submit file:**

    executable = my.exec
    arguments = $(state).data comparison.data my_$(state).out
    output = $(state).out
    error = $(state).err
    log = $(state).log
    transfer_input_files = $(state).data,comparison.data

    state = iowa
    queue 1

    state = missouri
    queue 1

    state = wisconsin
    queue 1

**Submit directory before submitting**

```
(submit_dir)/   submit.file
                my.exec
                comparison.data
                iowa.data
                missouri.data
                wisconsin.data
```

**After completion**
```
(submit_dir)/   submit.file
                my.exec
                comparison.data
                iowa.err    iowa.data  
                iowa.log    iowa.out
                missouri.err    missouri.data
                missouri.log    missouri.out
                wisconsin.err   wisconsin.data  
                wisconsin.log   wisconsin.out
                my_iowa.out
                my_missouri.out
                my_wisconsin.out
```

**Job working directory after input transfer, before execution**

    (working_dir)/  my.exec
                    iowa.data
                    comparison.data
                    (other HTCondor tracking files)


<a name="notint-dir"></a>


B. Using a different non-numbered directory for each job
--------------------------------------------------------

In this example, we once again use multiple \"queue\" statements, but
redefine the \"InitialDir\" each time.

**Submit file:**

    executable = my.exec
    arguments = state.data comparison.data my_$(InitialDir).out
    output = job.out
    error = job.err
    log = job.log
    transfer_input_files = input.data,../comparison.data

    InitialDir = iowa
    queue 1

    InitialDir = missouri
    queue 1

    InitialDir = wisconsin
    queue 1

**Submit directory before submitting**

```
(submit_dir)/   submit.file
                my.exec
                comparison.data
                iowa/      state.data
                missouri/  state.data
                wisconsin/ state.data
```

**After completion**
```
(submit_dir)/   submit.file
                my.exec
                comparison.data
                iowa/      state.data   job.out
                       job.err  job.log
                       my_iowa.out
                missouri/  state.data   job.out
                       job.err  job.log
                       my_missouri.out
                wisconsin/ state.data   job.out
                       job.err  job.log
                       my_wisconsin.out
```

**Job working directory after input transfer, before execution**

    (working_dir)/  my.exec
                    missouri.data
                    comparison.data
                    (other HTCondor tracking files)
