---
highlighter: none
layout: markdown-page
title: Accessing Additional Resources by Running Outside of CHTC
---


This guide provides an introduction to running jobs outside of CHTC:
what resources are available, why using these resources is beneficial,
and how to use them.

**1. What resources are available outside CHTC?**
=============================================

A. The UW Grid
--------------

What we call the \"UW Grid\" is a collection of all the groups and
centers on campus that run their own high throughput computing pool that
uses HTCondor. Some of these groups include departments (Biochemistry,
Statistics) or large physics projects (IceCube, CMS). Through agreements
with these groups, jobs submitted in CHTC can opt into running on these
other campus pools if there is space.

We call sending jobs to other pools on campus *flocking*.

B. The Open Science Grid (OSG)
------------------------------

The Open Science Grid (OSG) is a group of universities and research labs
who have agreed to share their unused computational resources with each
other. If a job is submitted from an OSG submission point, it can run in
the OSG pool associated with that submission point. This OSG pool is the
result of going out to other members of the OSG and finding if they have
any unused computers that are available to run jobs. These unused
computers then form a pool of resources where jobs can go run.

CHTC is a member of the Open Science Grid, so our submit servers,
besides sending jobs to CHTC computers (the default), can send jobs to
the OSG. We call sending jobs to other institutions *gliding*.

**2. Why run on additional resources outside CHTC?**
================================================

Running on other resources in addition to CHTC has one huge benefit:
size! The UW Grid and Open Science Grid include thousands of computers,
addition to what\'s already available in CHTC. Most CHTC users who run
on CHTC, the UW Grid, and the OSG can get more than 100,000 computer
hours in a single day.

**3. Job Qualifications**
=====================

Not all jobs will run well outside of CHTC. Because these jobs are
running all over the campus or country, on computers that don\'t belong
to us, they have two major requirements:

-   **No \"large\" data**: All of the files for your jobs are in your
    home directory and/or in SQUID, and output files are small enough to
    return to your home directory (less than 2 GB). We normally handle
    larger files in our Gluster filesystem which is only available from
    CHTC.  

-   **Short or interruptable jobs**: Your job can run in under 8 hours
    \-- either it finishes in that amount of time, or it
    self-checkpoints at least that frequently.

**4. Submitting Jobs to run outside CHTC**
======================================

If your jobs meet the characteristics above and you would like to use
either the UW Grid or OSG to run jobs, in addition to CHTC, follow the
following steps:

A. Test Your Jobs
-----------------

You should run a small test (anywhere from 10-100 jobs) outside CHTC
before submitting your full workflow. To do this, take a job submission
that you know runs successfully on CHTC. Then add the following options:

1.  To run on the UW Grid:

    ``` {.sub}
    +WantFlocking = true
    ```

2.  To run on the OSG:

    ``` {.sub}
    +WantGlidein = true
    ```

3.  To force your jobs outside of CHTC (for test purposes only!):

    ``` {.sub}
    requirements = (Poolname =!= "CHTC")
    ```

4.  **For jobs running R** do the following:
    1.  <ins>In your submit file</ins>, add a link that will download
        a package of extra libraries:

        ``` {.sub}
        transfer_input_files = other files, http://proxy.chtc.wisc.edu/SQUID/SLIBS.tar.gz
        ```

    2.  <ins>In your executable script</ins>, add these lines that
        unzip the library package and set it up in the job environment:

        ``` 
        tar -xzf SLIBS.tar.gz
        export LD_LIBRARY_PATH=$(pwd)/SS:$LD_LIBRARY_PATH
        ```
        {:.file}

We recommend that you run a separate test for the UW Grid and OSG if you
are planning to use both. If your submit file already has a
`requirements = ` line, you can appending the `Poolname` requirement by
using a double ampersand (`&&`) and then the additional requirement

Set the job submission to run anywhere from 10 - 100 jobs, and then
submit.

B. Scaling Up
-------------

Once you have tested your jobs and they seem to be running successfully,
you are ready to submit a full batch of jobs that uses CHTC and the UW
Grid/OSG. Make sure your submit file(s) has:

1.  If using the UW Grid:

    ``` {.sub}
    +WantFlocking = true
    ```

2.  If using the OSG:

    ``` {.sub}
    +WantGlidein = true
    ```

3.  **REMOVE** the `Poolname` requirement from the test jobs.
