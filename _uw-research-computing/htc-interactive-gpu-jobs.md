---
highlighter: none
layout: guide
title: Interactive GPU Jobs
guide:
    category: Special use cases
    tag:
        - htc
---

## Introduction

This guide shows you how to run interactive GPU jobs on CHTC's High Throughput Computing (HTC) system.

CHTC's HTC system is primarily meant for submitting batches of large workloads. However, a few resources are set aside for testing and troubleshooting GPU jobs interactively.

> ### 📢 Interactive GPU policy starting April 13, 2026
{:.tip-header}

> `condor_ssh_to_job` will be unavailable for jobs running on CHTC’s shared GPU machines.
> 
> #### What’s staying the same
> 
> If your group has owned or prioritized access to GPUs, you will still be able to run both interactive jobs or connect to running jobs using `condor_ssh_to_job`. 
> 
> #### Why we are making the change
> 
> Some users have been abusing the `condor_ssh_to_job` functionality by submitting long-running sleep jobs, then connecting periodically to run interactive commands while leaving the GPU unused for long periods of time (or worse, simulating work on the GPU that is not productive). This hoarding of resources is not in the spirit of our commitment to fair share access to computing, and so we are removing this functionality from our shared use GPUs. 
> 
> #### What you can do
> 
> * You can run interactive jobs on general use GPUs. See this current page for more.
> * Check-in on the output of your jobs while they are running by using `condor_tail`. [See our documentation](htc-monitor-jobs).
> 
> If you have questions or comments specifically about this change in policy, please fill out our [feedback form](https://docs.google.com/forms/d/e/1FAIpQLSe9yJNyuZcI9j8m4VR8JbZf6Zj3hO4wNbkydd6he2vEtwYJNQ/viewform?usp=preview).
{:.tip}


{% capture content %}
- [Introduction](#introduction)
- [Availablility](#availablility)
   * [Shared GPUs](#shared-gpus)
   * [Researcher-owned GPUs](#researcher-owned-gpus)
- [Submit an interactive GPU job](#submit-an-interactive-gpu-job)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Availablility
### Shared GPUs

We have *dedicated* slots for interactive jobs on CHTC's shared GPU machines:

| Number of slots | GPU model | Number of GPUs per slot | GPU Memory |
| --- | --- | --- |
| 4 | NVIDIA GeForce RTX 2080 Ti | 1 | 10.6 GB |
| 1 | NVIDIA A100 | 1 | 39.5 GB |

The slots in the table above *only* run interactive GPU jobs. Interactive GPU jobs can still run on other slots on shared GPU machines, depending on availability upon submission.

**All interactive GPU jobs have a maximum runtime of 4 hours and are limited to 1 GPU.** Interactive multi-GPU jobs are not permitted on CHTC's shared GPU machines.

You will not be able to run `condor_ssh_to_job` on noninteractive GPU jobs.

### Researcher-owned GPUs

If you have access to researcher-owned GPU machines, you may submit interactive jobs within those machines' resource limits. `condor_ssh_to_job` is permitted on these machines.

## Submit an interactive GPU job

1. Ensure your resource requirements allow you to match to an interactive GPU slot.
1. Submit your job with the `-i` command.
    
   ```
   condor_submit -i <submit_file>
   ```
   {:.term}
1. When your job starts, you will see a welcome message and your prompt will change, for example:

   ```
   Waiting for job to start...
   Welcome to slot1_1@gpulab2001.chtc.wisc.edu!
   == NOTICE: THIS NODE IS ON PUPPET ENVIRONMENT "puppet8" ==

   [netid@gpulab2001 scratch]$
   ```
   {:.term}
1. When you are done with your interactive session, type `exit` to return back to the Access Point.

## Related pages
- [Use GPUs](gpu-jobs)
- [Monitor your jobs](htc-monitor-jobs)
- [Machine learning jobs](machine-learning-htc)
- [Interactive computing with BadgerCompute](https://badgercompute.wisc.edu)