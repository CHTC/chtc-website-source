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
    -   [The OSG Consortium](#osg)
2.  [Job Qualifications](#job)
3.  [Submitting Jobs to Run Beyond CHTC](#submit)


<a name="why"></a>

**1. Why run on additional resources outside CHTC?**
================================================

Running on other resources in addition to CHTC has one huge benefit:
size! The UW Grid and Open Science Pool (OS Pool) include thousands of computers,
in addition to what\'s already available in CHTC, including specialized 
hardware resources like GPUs. Most CHTC users who run
on CHTC, the UW Grid, and the OS Pool can get more than 100,000 computer
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

B. The OSG Consortium
------------------------------

The <a href="http://www.osg-htc.org/">OSG Consortium</a> is a group of universities and research labs
who have agreed to share their unused computational resources with each
other. If a job is submitted from an OSG submission point, it can run in
the [Open Science Pool](https://osg-htc.org/about/open_science_pool/) associated with that submission point. This OSG pool is the
result of going out to other members of the OS Pool and finding if they have
any unused computers that are available to run jobs. These unused
computers then form a pool of resources where jobs can go run.

CHTC is a member of the OSG Consortium, so our submit servers,
besides sending jobs to CHTC computers (the default), can send jobs to
the OSG. We call sending jobs to other institutions *gliding*.


<a name="job"></a>

**2. Job Qualifications**
=====================

Not all jobs will run well outside of CHTC. Because these jobs are
running all over the campus or country, on computers that don\'t belong
to us, they have two major requirements:

-   **Moderate Data Sizes**: Ideally, all of the files for your jobs should be
    in your home directory and/or in SQUID (the options listed on our [file
    transfer guide](file-availability) and our [SQUID
    guide](file-avail-squid)), and output files are small enough
    to return to your home directory (less than 2 GB).  If your data files 
    are large enough to use our large data file system ("staging", see our [data
    staging guide](file-avail-largedata)) and you would like to use external
    resource, please [contact us](chtc@cs.wisc.edu)!  In certain cases, we may be 
    able to support larger data needs outside of CHTC. 

-   **Short or interruptable jobs**: Your job can run in under 8 hours
    \-- either it finishes in that amount of time, or it
    self-checkpoints at least that frequently. If you would like to implement
    self-checkpointing for a longer code, we are happy to provide resources 
    and guidance. 


<a name="submit"></a>

**3. Submitting Jobs to Run Beyond CHTC**
=====================================

If your jobs meet the characteristics above and you would like to use
either the UW Grid or OS Pool to run jobs, in addition to CHTC, you can add
the following to your submit file:

{:.gtable}
  | +WantFlocking = true | Also send jobs to other HTCondor Pools on campus (UW Grid)<br>Good for jobs that are less than \~8 hours, on average, or checkpointing jobs. |
  | +WantGlideIn = true  | Also send jobs to the OS Pool. <br> Good for jobs that are less than \~8 hours, on average, or checkpointing jobs. |

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
    Grid or OS Pool, please [get in touch with a research computing
    facilitator](get-help).  
    
3.  **Scaling Up:** Once you have tested your jobs and they seem to be
    running successfully, you are ready to submit a full batch of jobs
    that uses CHTC and the UW Grid/OS Pool. **REMOVE** the `Poolname`
    requirement from the test jobs but leave the `+wantFlocking` and
    `+wantGlidein` lines.
