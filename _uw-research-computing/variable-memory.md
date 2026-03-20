---
highlighter: none
layout: guide
title: Request variable memory
guide:
    category: Troubleshooting
    tag:
        - htc
---

## Introduction

**This page outlines strategies for requesting variable amounts of memory in jobs.** This guide is for users whose memory usage for a list of jobs may spike unexpectedly or vary depending on inputs or other conditions.

{% capture content %}
- [Introduction](#introduction)
- [Why you should care about memory usage](#why-you-should-care-about-memory-usage)
- [Use `retry_request_memory`](#use-retry_request_memory)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

If your job has ever gone on hold for exceeding memory use, you've probably solved it by increasing your `request_memory` attribute in your submit file. You might even always over-request memory, just to be on the safe side.

## Why you should care about memory usage

Because CHTC is a shared resource, correctly requesting the resources that you require for your jobs to function ensures that both you and other users have a good experience on the system.

* **Over-requesting memory** may cause your jobs to **wait in idle** for longer than needed, since HTCondor needs to find and allocate these larger resource requests for your jobs. And resources unused by your job could be used for others' jobs.

* **Under-requesting memory** may cause your jobs to **go on hold** when they do exceed the memory allocated to your job. Whatever work by your job will be lost but the computing time will still affect your priority.

But what if only a **fraction** of your jobs needs more memory than the rest of the list of jobs? How can you get the throughput you need without over-requesting memory?

## Use `retry_request_memory`

This submit file option is good for jobs where a **few of the jobs have unexpected spikes in memory usage**. To use this feature, add this line to your submit file:

```
retry_request_memory = <memory>
```

If your job is evicted because it uses more memory than allocated, the `retry_request_memory` option tells HTCondor to retry the job with the specified increased memory.

For example, if you use these lines in your submit file:

```
request_memory = 1 GB
retry_request_memory = 4 GB
```

Each job generated in this submission will request 1 GB of memory. If the job is evicted because it uses more than 1 GB of memory, the job will be restarted with 4 GB of memory.

You may also use expressions:

```
request_memory = 1 GB
retry_request_memory = RequestMemory*4
```

When using expressions:

* We recommend *only* multiplying by integers.
* Expressions using addition operators or floating point numbers are not recommended.

## Related pages

* [HTCondor manual reference](https://htcondor.readthedocs.io/en/main/man-pages/condor_submit.html#retry_request_memory)
* [Job submission basics](htcondor-job-submission)
* [Monitor your job](condor_q)
