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

Interactive jobs on CHTC's shared GPU machines are limited to the following resources:

| Number of slots | GPU model | Number of GPUs per slot | GPU Memory |
| --- | --- | --- |
| 4 | NVIDIA GeForce RTX 2080 Ti | 1 | 10.6 GB |
| 1 | NVIDIA A100 | 1 | 39.5 GB |

**Interactive GPU jobs have a maximum runtime of 4 hours.**

Users will **only** be able to run `condor_ssh_to_job` on interactive GPU jobs. This function is disabled for noninteractive GPU jobs.

### Researcher-owned GPUs

Users with access to researcher-owned GPU machines may submit interactive jobs within those machines' resource limits.

## Submit an interactive GPU job

1. Ensure your resource requirements allow you to match to an interactive GPU slot.
1. Submit your job with the `-i` command.
    
   ```
   condor_submit -i <submit_file>
   ```
   {:.term}
1. When your job starts, you will see your prompt change, for example:

   ```
   [netid@gpulab2001 ~]$
   ```
   {:.term}
1. When you are done with your interactive session, type `exit` to return back to the Access Point.

## Related pages
- [Use GPUs](gpu-jobs)
- [Machine learning jobs](machine-learning-htc)
- [Interactive computing with BadgerCompute](https://badgercompute.wisc.edu)