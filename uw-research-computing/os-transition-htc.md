---
highlighter: none
layout: markdown-page
title: HTC System Transition to a New Linux Version (CentOS Stream 8)
published: true
---

Starting on August 1, 2022, CHTC's high throughput computing (HTC) system began upgrading
the Linux distribution and version we use on our servers. **CentOS Stream 8 is now 
the operating system used on the majority of our servers, and the default requested 
operating system by jobs, unless specified otherwise.** 

Note that this page only applies to a transition on the HTC system (submitting jobs 
with HTCondor). The high performance computing (HPC) cluster will be upgraded in 
the near future as well and have a separate transition 
page. _Users of the HPC cluster will be notified_ when the transition to CentOS Stream 8 begins on the HPC system. 

All updates to the HTC system will be reflected on this page; significant changes may 
also include a notification to the `chtc-users` mailing list. 

## Important Dates

* **August 2022**: HTC system will support both CentOS 7 and CentOS Stream 8. By default, 
all jobs will continue to match to servers running CentOS 7, however,
**users should begin testing jobs on servers running CentOS Stream 8**. These servers are also 
available for general use. 
* **September 2022**: More than 75% of CHTC capacity will run on CentOS Stream 8.
* **September 29, 2022**: Default operating system requirements for jobs will change from CentOS 7 to 
CentOS Stream 8.

## What You Need to Do

* **If your jobs were running successfully before, but now failing**, scale down your submissions 
and run a few test jobs on the new operating system (now the default). If you absolutely 
HAVE to keep running, you can continue to (temporarily) run on CentOS 7 by following 
the instructions [below](#requesting-a-specific-operating-system)
* **If you are having trouble getting your jobs to run successfully on the new operating system**, 
please contact the facilitation team at chtc@cs.wisc.edu or [come to office hours](/uw-research-computing/get-help.html)
* **If you would like to access as much computing capacity as possible**, consider using 
running your jobs on servers with either CentOS 7 or CentOS Stream 8. See the [options below](#requesting-a-specific-operating-system) 
for opting into both; note that your code will likely need to have been compiled on the older 
operating system version. 

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
    <td>33%</td>
    <td>Build nodes, range of GPU servers, high memory nodes</td>
  </tr>
  <tr>
    <td>CentOS Stream 8</td> 
    <td>67%</td>
    <td>Build node, servers with A100 GPUs</td>
  </tr>
</table>

### Default Operating System

By default, CHTC-managed submit servers automatically add a job 
requirement that requires jobs to run on servers running our primary operating system,
CentOS 7, unless otherwise specified by the user. To override this default, see below: [Requesting a Specific
Operating System](#requesting-a-specific-operating-system).

## Requesting a Specific Operating System

At any time, you can require a specific operating system 
version (or versions) for your jobs. 

### Use Both CentOS 7 (previous default) and CentOS Stream 8 (current default)

To request that your jobs run on computers running **either** version of 
CentOS Linux, add the following requirements line to your submit file:

``` {.sub}
requirements = (OpSysMajorVer == 7) || (OpSysMajorVer == 8)
```

> Note: this requirement is not necessary for jobs that use Docker containers; 
> these jobs will run on servers with any operating system automatically. 

The advantage of this option is that you may be able to access a
larger number of computers in CHTC. Note that code compiled on a
newer version of Linux may not run older versions of Linux. Make
sure to test your jobs specifically on both CentOS Stream 8 and CentOS 7
before using the option above.

### Require CentOS 7 (previous default)

To request that your jobs run on servers with CentOS 7 **only** add the
following requirements line to your submit file:

``` {.sub}
requirements = (OpSysMajorVer == 7)
```

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
requirements = (Target.HasCHTCStaging == true) && (OpSysMajorVer == 7)
```



