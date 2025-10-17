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

Over-requesting memory may cause your jobs to wait in idle for longer than needed, but under-requesting memory may cause your jobs to go on hold when they do exceed the memory allocated to your job.

**This page outlines strategies for requesting variable amounts of memory in jobs.** This guide is for users whose memory usage for a list of jobs may spike unexpectedly or vary depending on inputs or other conditions.

{% capture content %}
- [Introduction](#introduction)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Option 1: Use `retry_request_memory`

This submit file option is good for jobs where a **few of their jobs have unexpected spikes in memory usage**. To use this feature, add this line to your submit file:

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

## Option 2: Use `retry_request_memory_increase` and `retry_request_memory_max`

If you need a more incremental list of memory options, you can use these two submit file attributes together.

```
retry_request_memory_increase = <quantity to add or RequestMemory expression>
retry_request_memory_max = <memory>
```

This option works similar to `retry_request_memory`, except allowing multiple retries in increments.

For example, if you use these lines in your submit file:
```
request_memory = 1 GB
retry_request_memory_increase = RequestMemory*4
retry_request_memory_max = 16 GB
```

Your jobs will be submitted at three increments of increasing memory (1 GB, 4 GB, and 16 GB) until they succeed. If your jobs exceed 16 GB of memory, they will go on hold.

## Related pages
* [Job submission basics](htcondor-job-submission)
* [Monitor your job](condor_q)
