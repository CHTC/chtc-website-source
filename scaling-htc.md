---
highlighter: none
layout: markdown-page
title: Scaling Beyond Local HTC Capacity
---


This guide provides an introduction to running jobs outside of CHTC: why
using these resources is beneficial, what resources are available, and
how to use them.

Contents
========

1.  [Why run on additional resources outside CHTC?](#why)
    -   [The UW Grid](#uw)
    -   [The Open Science Grid (OSG)](#osg)
2.  [Job Qualifications](#job)
3.  [Submitting Jobs to Run Beyond CHTC](#submit)


<a name="why"></a>

**1. Why run on additional resources outside CHTC?**
================================================

Running on other resources in addition to CHTC has one huge benefit:
size! The UW Grid and Open Science Grid include thousands of computers,
addition to what\'s already available in CHTC. Most CHTC users who run
on CHTC, the UW Grid, and the OSG can get more than 100,000 computer
hours (more than 11 years of computing!) in a single day. Read on to
learn more about these resources.


<a name="uw"></a>

A. The UW Grid
--------------

What we call the \"UW Grid\" is a collection of all the groups and
centers on campus that run their own high throughput computing pool that
uses HTCondor. Some of these groups include departments (Biochemistry,
Statistics) or large physics projects (IceCube, CMS). Through agreements
with these groups, jobs submitted in CHTC can opt into running on these
other campus pools if there is space.

We call sending jobs to other pools on campus *flocking*.

<a name="osg"></a>

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


<a name="job"></a>

**2. Job Qualifications**
=====================

Not all jobs will run well outside of CHTC. Because these jobs are
running all over the campus or country, on computers that don\'t belong
to us, they have two major requirements:

-   **No \"large\" data**: All of the files for your jobs are in your
    home directory and/or in SQUID (the options listed on our [file
    transfer guide](/file-availability.shtml) and our [SQUID
    guide](/file-avail-squid.shtml)), and output files are small enough
    to return to your home directory (less than 2 GB). We normally
    handle larger files in our large data filesystem (see our [data
    staging guide](/file-avail-largedata.shtml)) which is only available
    from CHTC.  

-   **Short or interruptable jobs**: Your job can run in under 8 hours
    \-- either it finishes in that amount of time, or it
    self-checkpoints at least that frequently.


<a name="submit"></a>

**3. Submitting Jobs to Run Beyond CHTC**
=====================================

If your jobs meet the characteristics above and you would like to use
either the UW Grid or OSG to run jobs, in addition to CHTC, you can add
the following to your submit file:

{:.gtable}
  | +WantFlocking = true | Also send jobs to other HTCondor Pools on campus (UW Grid)<br>Good for jobs that are less than \~8 hours, on average, or checkpointing jobs. |
  | +WantGlideIn = true  | Also send jobs to the Open Science Grid (OSG). <br> Good for jobs that are less than \~8 hours, on average, or checkpointing jobs. |

To guarantee maximum efficiency, **please do the following steps
whenever submitting a new type of job to the UW Grid or OSG:**

1.  **Test Your Jobs:** You should run a small test (anywhere from
    10-100 jobs) outside CHTC before submitting your full workflow. To
    do this, take a job submission that you know runs successfully on
    CHTC. Then add the following options in the submit file + submit the
    test jobs:

    ``` {.sub}
    requirements = (Poolname =!= "CHTC")
    ```

    (If your submit file already has a `requirements = ` line, you can
    appending the `Poolname` requirement by using a double ampersand
    (`&&`) and then the additional requirement.)

2.  **Troubleshooting:** If your jobs don\'t run successfully on the UW
    Grid or OSG, please [get in touch with a research computing
    facilitator](/get-help.shtml).  
    
3.  **Scaling Up:** Once you have tested your jobs and they seem to be
    running successfully, you are ready to submit a full batch of jobs
    that uses CHTC and the UW Grid/OSG. **REMOVE** the `Poolname`
    requirement from the test jobs but leave the `+wantFlocking` and
    `+wantGlidein` lines.
