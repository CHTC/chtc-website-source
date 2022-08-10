---
highlighter: none
layout: markdown-page
title: The HTC System is Transitioning to a New Linux Version (CentOS Stream 8)
published: true
---

Starting on August 10, CHTC's high throughput computing (HTC) system will begin upgrading
the Linux distribution and version we use on our servers. The current version of Linux running on 
most of our servers is CentOS 7 and we will be upgrading to CentOS Stream 8. This 
transition will happen over the next few months [See "Important Dates"](#important-dates) 
and requires [proactive action from CHTC users](#what-you-need-to-do) to prevent 
interruptions to research work. 

Note that this page only applies to a transition on the HTC system (submitting jobs 
with HTCondor). The high performance computing (HPC) cluster will be upgraded in 
the near future as well and have a separate transition page. 

All updates to the HTC system will be reflected on this page; significant changes may 
also include a notification to the `chtc-users` mailing list. 

## Important Dates

* **August 2022**: significant HTC capacity running CentOS Stream 8, available for testing 
and general use.
* **TBD**: Default operating system requirements for jobs change from CentOS 7 to CentOS Stream 8
* **TBD**: More than 75% of CHTC capacity is run on CentOS Stream 8

## What You Need to Do

### Actions For All Users

All users of CHTC's HTC system should **test their existing workflows**. 
The only exception are those users who use Docker or Singularity containers 
to run their jobs. 

1. Set up a set of typical jobs to use as a test set. It is ideal 
to use a set of jobs for which you already have results so that you confirm 
the results of the test jobs. 

2. Modify the job submit file(s) to require servers that are running the 
soon-to-be default operating system, CentOS Stream 8. 
[See below for details](#require-centos-stream-8-upcoming-default))

3. Submit the jobs. Monitor them for issues -- check both the results of 
your code and the standard output and error files for any unexpected behavior. 

If you have any concerns or questions from your job tests, please contact 
the facilitation team at chtc@cs.wisc.edu. 

If your tests go well, you should be well poised for the transition and can either 
wait for the default setting for jobs to change, or opt into using both in 
the meantime. See immediately below for how to do this. 

### Get More Computing (Optional)

Additionally, for those who want to maximize their usage of HTC system 
resources, we recommend **opting into use of computers with both operating systems**. 

Only do this after you have first run a set of test jobs on CentOS Stream 8 specifically. 
Once that has been done, see below for how to run on servers running both 
versions of Linux: [Use Both CentOS 7 (current default) and CentOS Stream 8 (upcoming 
default)](#use-both-centos-7-current-default-and-centos-stream-8-upcoming-default))

If you use Docker or Singularity containers in your jobs, you do **not** need to 
specify use of both operating systems. These jobs will run on servers using either 
operating system without any changes to your submit file. 

## Current Status of the HTC System

### Capacity Available in the HTC System

<table class="gtable">
  <tr>
    <th>Linux Version</th>
    <th>Percent of Pool Capacity</th>
    <th>Notable Servers</th>
  </tr>
  <tr>
    <td>CentOS 7</td> 
    <td>75%</td>
    <td>Build nodes, range of GPU servers, high memory nodes</td>
  </tr>
  <tr>
    <td>CentOS Stream 8</td> 
    <td>25%</td>
    <td>Build node, Servers with A100 GPUs</td>
  </tr>
</table>

### Default Operating System

Currently, CHTC-managed submit servers automatically add a job 
requirement requesting servers with our most recent operating system,
CentOS 7. To override this default, see below: [Requesting a Specific
Operating System](#requesting-a-specific-operating-system).

## Requesting a Specific Operating System

Throughout this transition, you can require a specific operating system 
version (or versions) for your jobs. 

### Require CentOS Stream 8 (upcoming default)

To request that your jobs run on servers with CentOS Stream 8 **only** add the
following requirements line to your submit file:

``` {.sub}
requirements = (OpSysMajorVer == 8)
```

### Use Both CentOS 7 (current default) and CentOS Stream 8 (upcoming default)

To request that your jobs run on computers running **either** version of 
CentOS Linux, add the following requirements line to your submit file:

``` {.sub}
requirements = (OpSysMajorVer == 7) || (OpSysMajorVer == 8)
```

The advantage of this option is that you may be able to access a
larger number of computers in CHTC. Note that code compiled on a
newer version of Linux may not run older versions of Linux. Make
sure to test your jobs specifically on both CentOS Stream 8 and CentOS 7
before using the option above.

### Combining Requirements

Does your job already have a requirements statement? If so, you can
add the requirements above to the pre-existing requirements by using
the characters `&&`. For example, if your jobs already require large
data staging:

``` {.submit}
requirements = (Target.HasCHTCStaging == true) 
```

You can add the requirements for using CentOS Stream 8 like so:

``` {.submit}
requirements = (Target.HasCHTCStaging == true) && (OpSysMajorVer == 8)
```



