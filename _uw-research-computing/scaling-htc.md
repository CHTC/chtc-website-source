---
highlighter: none
layout: guide
title: Scale Beyond Local HTC Capacity
guide:
    category: Special use cases
    tag:
        - htc
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


<span name="why"></span>

**1. Why run on additional resources outside CHTC?**
================================================

Running on other resources in addition to CHTC has one huge benefit:
size! The UW Grid and OSG include thousands of computers,
addition to what\'s already available in CHTC, including specialized 
hardware resources like GPUs. Most CHTC users who run
on CHTC, the UW Grid, and the OSG can get more than 100,000 computer
hours (more than 11 years of computing!) in a single day. Read on to
learn more about these resources.

<span name="uw"></span>

A. UW Grid
--------------

What we call the \"UW Grid\" is a collection of all the groups and
centers on campus that run their own high throughput computing pool that
uses HTCondor. Some of these groups include departments (Biochemistry,
Statistics) or large physics projects (IceCube, CMS). Through agreements
with these groups, jobs submitted in CHTC can opt into running on these
other campus pools if there is space.

<span name="osg"></span>

B. UW-Madison's OSG Pool
------------------------------

CHTC maintains an OSG pool for the campus community, which includes 
resources contributed by campuses, national labs, and other institutions 
across and beyond the US.


<span name="job"></span>

**2. Job Qualifications**
=====================

Not all jobs will run well outside of CHTC. Because these jobs are
running all over the campus or country, on computers that don\'t belong
to us, they have two major requirements:

-   **Moderate Data Sizes**: We can support input file sizes of up to 
	20 GB per file per job. This covers input files that would normally be 
	transferred out of a `/home` directory or use SQUID, in addition to larger 
	files up to 20GB. Outputs per job can be of similar sizes. If your input or 
	output files are larger than 1GB, or you have any other questions about 
	handling data on resources beyond CHTC, please [contact us](mailto:chtc@cs.wisc.edu)! 

-   **Short or interruptable jobs**: Your job can complete in under 10 hours
    \-- either it finishes in that amount of time, or it
    self-checkpoints at least that frequently. If you would like to implement
    self-checkpointing for a longer code, we are happy to provide resources 
    and guidance. 


<span name="submit"></span>

**3. Submitting Jobs to Run Beyond CHTC**
=====================================

If your jobs meet the characteristics above and you would like to use
either the UW Grid or OS Pool to run jobs, in addition to CHTC, you can add
the following to your submit file:

{:.gtable}
  | `want_campus_pools = true` | Also send jobs to other HTCondor Pools on campus (UW Grid)<br>Good for jobs that are less than \~8 hours, on average, or checkpointing jobs. |
  | `want_ospool = true`  | Also send jobs to the OS Pool. <br> Good for jobs that are less than \~8 hours, on average, or checkpointing jobs. |

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
    facilitator](get-help.html).  
    
3.  **Scaling Up:** Once you have tested your jobs and they seem to be
    running successfully, you are ready to submit a full batch of jobs
    that uses CHTC and the UW Grid/OS Pool. **REMOVE** the `Poolname`
    requirement from the test jobs but leave the `want_campus_pools` and
    `want_ospool` lines.
