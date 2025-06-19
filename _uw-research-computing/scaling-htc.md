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

{% capture content %}
- [Why run on additional capacity outside CHTC?](#why-run-on-additional-capacity-outside-chtc)
- [Is this capacity for you?](#is-this-capacity-for-you)
- [External computing capacity accessible from CHTC](#external-computing-capacity-available-from-chtc)
- [How to use external capacity](#how-to-use-external-capacity)
	- [Testing jobs outside CHTC](#testing-jobs-outside-chtc)
- [Things to consider](#things-to-consider)
- [Related Pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Why run on additional capacity outside CHTC?

Running on other resources in addition to CHTC has one huge benefit:
**size!**

In addition to what's available at CHTC, UW-Madison groups and the national OSG Consortium make 
thousands of computers available for high throughput computing, including specialized 
hardware resources like GPUs. 

Most CHTC users who submit jobs to CHTC, campus pools, and the OSPool can get more than 100,000 computer
hours (more than 11 years of computing!) in a single day. 

<!--to do: cool graphic or link to story about OSPool user?-->

## Is this capacity for you?

Many jobs on CHTC's HTC system would benefit from extra computing capacity! We make 
the following recommendations to decide if your jobs would be a good fit. 

<table>
<tr>
  <th>Job Length</th>
  <td>10-24 hours (per job)</td>
  <td>Your job should complete in under 10 hours
    — either it finishes in that amount of time, or it
    <a href="checkpointing">self-checkpoints</a> at least that frequently. If you would like to implement
    self-checkpointing for a longer code, we are happy to provide resources 
    and guidance. </td>
</tr>
<tr>
  <th>Data Size</th>
  <td>Up to 20GB input/output per job</td>
  <td>This covers input files that would normally be 
	transferred out of a <code>/home</code> directory or using an <code>osdf:///</code> URL from 
	the  <code>/staging</code> directory.</td>
</tr>
<tr>
  <th>Software</th>
  <td>An Apptainer container (recommended)</td>
  <td>Almost any software that runs in CHTC will run outside CHTC, but the best 
  scenario is using a container to maintain a consistent software environment.</td>
</tr>
</table>

If you have large data files, long jobs, or questions about containers,
please [contact us](mailto:chtc@cs.wisc.edu)! 

## External computing capacity accessible from CHTC

### UW Campus Pools

CHTC has connections with other groups and centers 
on campus that run their own high throughput computing pool that
uses HTCondor. Some of these groups include departments (Biochemistry,
Statistics) or large physics projects (IceCube, CMS). Through agreements
with these groups, jobs submitted in CHTC can opt into running on these
other campus pools if they are not fully utilized by their owners. 

### Open Science Pool (OSPool)

As the home for the [PATh project](https://path-cc.io/), CHTC operates a 
national high throughput computing pool called the 
[Open Science Pool](https://osg-htc.org/services/ospool/), composed of 
computing capacity contributed by campuses, national labs, and other institutions 
across and beyond the United States. CHTC users submitting from a CHTC Access Point can 
opt into allowing their jobs to utilize this national pool. 

## How to use external capacity

If your jobs meet the characteristics above and you would like to use
external HTC pools to run jobs, in addition to CHTC, you can add
the following to your submit file:

{:.gtable}
  | `want_campus_pools = true` | Opts into sending jobs to other HTCondor Pools on campus.<br>Good for jobs that are less than \~12 hours, on average, or jobs with checkpointing. |
  | `want_ospool = true`  | Opts into sending jobs to the OS Pool. <br> Good for jobs that are less than \~12 hours, on average, or jobs with checkpointing |

<span name="testing"></span>

### Testing jobs outside CHTC

To guarantee maximum efficiency, please do the following steps
whenever submitting a new type of job beyond CHTC. 

1.  **Run test jobs:** You should run set of test jobs (anywhere from
    10-2000 jobs) outside CHTC before submitting your full workflow. To
    do this, take a job submission that you know runs successfully on
    CHTC. Add the following options in the submit file and submit the
    test jobs:

    ``` {.sub}
    requirements = (Poolname =!= "CHTC")
    want_campus_pools = true
    want_ospool = true
    ```

    (If your submit file already has a `requirements = ` line, you can
    appending the `Poolname` requirement by using a double ampersand
    (`&&`) and then the additional requirement.)

2.  **Identify problems:** If your jobs don\'t run successfully on the UW
    Grid or OS Pool, please [get in touch with a research computing
    facilitator](get-help.html).  
    
3.  **Scale up:** Once you have tested your jobs and they seem to be
    running successfully, you are ready to submit a full batch of jobs
    that uses CHTC and the UW Grid/OS Pool. **REMOVE** the `Poolname`
    requirement from the test jobs but leave the `want_campus_pools` and
    `want_ospool` lines.

## Things to consider

### Containers

Containers are the best way to ensure a consistent software environment for 
your jobs when running inside and outside CHTC. We generally recommend using
Apptainer, since the OSPool provides the best support for Apptainer containers.

- **Already using Apptainer?** Great! No changes needed. 
- **Already using Docker?** Convert your container to the apptainer format and use 
staging and and `osdf:///` URL to send it to your jobs. See 
[this guide](apptainer-build#converting-a-docker-image-to-an-apptainer-container-image) for details. 
- **Not using containers at all?** [Check out our docs](apptainer-htc) or 
[talk to CHTC facilitators](get-help) about the best approach for your code. 

### Data

If you are transferring your data to jobs: 

- from `/home`, using normal HTCondor file transfer
- from `/staging`, using an `osdf:///` URL.

You can use capacity outside of CHTC. If you are using a different method to 
access your files, [contact the facilitation team](get-help) about how you might 
run your work outside CHTC. 

## Related Pages

- [Use and transfer data in jobs on the HTC system](htc-job-file-transfer)
- [Use Apptainer Containers ](apptainer-htc)
- [Convert docker to apptainer](apptainer-build#converting-a-docker-image-to-an-apptainer-container-image)
