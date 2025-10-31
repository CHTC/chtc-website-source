---
highlighter: none
layout: guide
title: Use Licensed Software
guide:
    category: Software
    tag:
        - htc
---

## Introduction

This guide describes how to run jobs that use licensed software in CHTC's high throughput computing (HTC) system.

{% capture content %}
- [Introduction](#introduction)
- [Policies](#policies)
- [How to use licensed software](#how-to-use-licensed-software)
- [Licensed software on the HTC system](#licensed-software-on-the-htc-system)
- [Modules](#modules)
- [Submit file requirements](#submit-file-requirements)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Policies

Users install and manage their own software installations via [containers](software-overview-htc) or [portable installations](inter-submit). CHTC's research computing facilitators are available to [help](get-help) through this process.

Some software programs require paid licenses, which may require additional support. *Installation of licensed programs is by request to and at the discretion of CHTC staff.*

**We recommend using a free or open-source software alternative whenever possible**, as some software licenses restrict the amount of computing that can contribute to your research.

Jobs using licensed software are incompatible with external capacity like the OSPool or campus pools.

## How to use licensed software

1. **Find your [licensed software](#licensed-software-on-the-htc-system)** in the table. For most cases, you will need to [request access]((mailto:chtc@cs.wisc.edu)) to the licensed software.
2. **[Build a container](software-overview-htc#containers) or [use the module system](#modules)** to prepare your software and scripts, depending on your licensed software.
3. **Modify your submit file.**
    * Add the right [`concurrency_limits`](#submit-file-requirements) to your submit file.
    * Add `requirements = (HasChtcSoftware == true)`.

## Licensed software on the HTC system

| Software        | Limit name             | Pool limit    | Use via | Allowed users |
| --------------- | ---------------------- | -------- | -------------- |------ |
| ABAQUS          | `ABAQUS`                 | 50       | module         | Must belong to an approved research group. |
| ANSYS           | `ANSYS_RESEARCH`        | 20       | module         | Must belong to an approved research group. |
| COMSOL (Physics) | `COMSOL_PHYSICS`        | 2        | module         | Must belong to the Physics department. |
| Gurobi          | `GUROBI`                 | 4096     | [container](https://github.com/CHTC/recipes/tree/main/software/Gurobi) | [Contact CHTC.](get-help) |
| Lumerical       | `LUMERICAL`              | 3        | [container](https://optics.ansys.com/hc/en-us/articles/12325704816659-Dockerfile-support)         | Must belong to an approved research group. |
| MATLAB          | `MATLAB`                 | 10000    | [container](https://github.com/CHTC/recipes/tree/main/software/Matlab) | Must use our MATLAB container recipes. Does not need approval. |

> If you need access to these licensed software, contact us at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu).

| Unsupported licensed software | Notes |
| --- |
| Gaussian | Requires third-party assistance. |
| Mathematica | Incompatible. |
| VASP | Requires third-party assistance. HPC system recommended. |

## Modules

### See available modules

For licensed software accessible through the module system, you can see the available modules and versions of the software by running this command on the Access Point.

``` 
[alice@submit]$ module avail
```
{:.term}

### Use and load modules in your executable script

For jobs that use licensed software in modules, load the module in your executable script. Below is an example.

``` 
#!/bin/bash

# Commands to enable modules, and then load an appropriate software module
export PATH
. /etc/profile.d/modules.sh
module load <software>

# Command to run your software from the command line
cmd -options input.file
```
{:.file}

Replace `<software>` with the name of the software module you want to use,
found via the `module avail` command described [above](#access). Replace
the final command with the syntax to run your software, with the
appropriate options.

For example, to run a COMSOL job, the script might look like this:

``` 
#!/bin/bash

export PATH
. /etc/profile.d/modules.sh
module load COMSOL

comsol batch -inputfile test.mph -outputfile test-results.mph
```
{:.file}

## Submit file requirements

When using licensed software managed by CHTC you must add the following to your submit file.

-   **Require CHTC Software**. This ensures that your job will run on machines that have access to CHTC software modules and licenses.

    ```
    requirements = (HasChtcSoftware == true)
    ```

-   **Add a concurrency limit.** This "checks out" a license for your job. If the maximum number of licenses are checked out, your job will stay in idle until a license is available. This prevents job errors stemming from unavailable licenses. To your submit file, add:

    ```
    concurrency_limits = LIMIT_NAME:num_of_licenses_used
    ```
    
    See the [table above](#licensed-software-on-the-htc-system) for `LIMIT_NAME`.

    For example, to run a job that uses one ANSYS license, use: 
    
    ```
    concurrency_limits = ANSYS_RESEARCH:1
    ```

    > ### How many licenses should I specify in `concurrency_limits`?
    {:.tip-header}
    > For most jobs, you will only need to check out **one** license.
    > 
    > However, some workflows and software check out multiple licenses for different processes (such as using the R bindings for Gurobi). Please be aware of your job's behavior, and specify the correct number of licenses to the best of your ability.
    {:.tip}

-   **Request accurate CPUs and memory.** Run at least one test job and
    look at the log file produced by HTCondor to determine how much
    memory and disk space your jobs actually use. We recommend
    requesting the smallest number of CPUs where your job will finish in
    1-2 days.

## Related pages

* [Software overview](software-overview-htc)
* [Recipes](https://github.com/CHTC/recipes)
* [Get help](get-help)
