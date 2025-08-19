---
highlighter: none
layout: guide
title: Use Custom Linux Versions in CHTC
guide:
    category: Special use cases
    tag:
        - htc
--- 

## Introduction

Sometimes, software and packages have dependencies or require libraries only available on certain operating systems. Without these dependencies/libraries, your software won't work, and your jobs won't run. If you know which operating system your software and jobs need, this guide shows you how to request specific operating systems on CHTC systems.

{% capture content %}
- [Introduction](#introduction)
- [Option 1: Use a container (recommended)](#option-1-use-a-container-recommended)
- [Option 2: Request an operating system version](#option-2-request-an-operating-system-version)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Option 1: Use a container (recommended)

We recommend using containers to create your software environment, which includes the operating system. This allows you to run on nearly any node in the HTC system.

1. Start by reading our [container guide](https://chtc.cs.wisc.edu/uw-research-computing/software-overview-htc).
1. Find a trusted, existing container on [Docker Hub](https://hub.docker.com/) or a [recipe](https://github.com/CHTC/recipes) for your software.
1. Alternatively, start with a base container with the desired Linux operating system, and develop a recipe.
   
   Note that the default Linux containers on Docker Hub are often missing commonly installed packages (i.e., vim, wget, git). Our collaborators in OSG Services maintain a few curated containers with a greater selection of installed tools that can be seen here: [Base Linux Containers](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/#base)

## Option 2: Request an operating system version

You can require a specific operating system version (or versions) for your jobs. This option restricts you to operating systems used by CHTC, and the number of nodes running that operating system.

You can see the current list of machines and their operating system by running the following command and viewing the summary table:
```
condor_status -compact
```
{:.term}

To request that your jobs run on machines of a certain version, add this line to your submit file:

```
requirements = (OpSysMajorVer == 9)
```

In this example, we are requesting machines that only use an Enterprise Linux Operating System of Version 9 (EL9). You can modify this statement to request other operating systems or add other lines to your requirements.

| Example | Use |
| --- | --- |
| `requirements = (OpSysMajorVer == 9) || (OpSysMajorVer == 10)` | Request EL9 *or* EL10 machines |
| `requirements = (OpSysMajorVer >= 9)` | Request machines with EL9 or greater operating system version (inclusive) |
| `requirements = (OpSysMajorVer > 9)` | Request machines an operating system greater than EL9 (exclusive) |


Note that code compiled on a newer version of Linux may not run older versions of Linux. Make sure to test your jobs on each operating system before using the option above.

Does your job already have a requirements statement? If so, you can
add the requirements above to the pre-existing requirements by using
the characters `&&`. For example, if your jobs already require large
data staging:

```
requirements = (Target.HasCHTCStaging == true) 
```

You can add the requirements for using both operating system versions like so: 

```
requirements = (Target.HasCHTCStaging == true) && ((OpSysMajorVer == 9) || (OpSysMajorVer == 10))
```

