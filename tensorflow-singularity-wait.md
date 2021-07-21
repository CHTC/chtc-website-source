---
highlighter: none
layout: markdown-page
title: Running Tensorflow Jobs
---

This guide describes how to use a pre-built Tensorflow environment
(implemented as a [Singularity container](http://singularity.lbl.gov/))
to run Tensorflow jobs in CHTC and on the Open Science Grid (OSG).

Overview
--------

Typically, software in CHTC jobs is installed or compiled locally by
individual users and then brought along to each job, either using the
default file transfer or our SQUID web server. However, another option
is to use a *container* system, where the software is installed in a
*container image*. CHTC (and the OSG) have capabilities to access and
start containers and run jobs inside them. One container option
available in CHTC is [Docker](docker-jobs); another is
Singularity.

In CHTC, our Singularity support consists of running jobs inside a
pre-made Singularity container with an installation of Tensorflow. This
Singularity set up is very flexible: it is accessible both in CHTC and
on the Open Science Grid, and can be used to run Tensorflow either with
CPUs or GPUs. This guide starts with a basic CPU example, but then goes
on to describe how to use the Singularity Tensorflow container for GPUs,
and also how to run on the Open Science Grid.

1.  [Basic Tensorflow Job Template](#template)
2.  [Using Tensorflow on GPUs](#gpus)
3.  [Using Tensorflow on the OSG](#osg)

<a name="template"></a>

**1. Basic Tensorflow Job Template**
--------------------------------

The submit file for jobs that use the Tensorflow singularity container
will look similar to other CHTC jobs, except for the additional
Singularity options seen below.

**Submit File**

``` {.sub}
# Typical submit file options
universe = vanilla
log = $(Cluster).$(Process).log
error = $(Cluster).$(Process).err
output = $(Cluster).$(Process).out

# Fill in with your own script, arguments and input files
# Note that you don't need to transfer any software
executable = run_tensorflow.sh
arguments =
transfer_input_files = 

# Singularity settings
+SingularityImage = "/cvmfs/singularity.opensciencegrid.org/opensciencegrid/tensorflow:latest"
Requirements = HAS_SINGULARITY == True

# Resource requirements
request_cpus = 1
request_memory = 2GB
request_disk = 4GB

# Number of jobs
queue 1
```

**Sample Executable (Wrapper Script)**

Your job will be running inside a container that has Tensorflow
installed, so there should be no need to set any environment variables.

``` 
#!/bin/bash

# your own code here 
python test.py
```
{:.file}


<a name="gpus"></a>

**2. CPUs vs GPUs**
---------------

The submit file above use a CPU-enabled version of Tensorflow. In order
to take advantage of GPUs, make the following changes to the submit file
above:

-   Request GPUs in addition to CPUs:

    ``` {.sub}
    request_gpus = 1
    ```

-   Change the Singularity image to tensorflow with GPUs:

    ``` {.sub}
    +SingularityImage = "/cvmfs/singularity.opensciencegrid.org/opensciencegrid/tensorflow-gpu:latest"
    ```

-   Add a GPU card requirement to the requirements line:

    ``` {.sub}
    requirements = HAS_SINGULARITY == True && CUDACapability >= 3
    ```

For more information about GPUs and how GPU jobs work in CHTC, see our
[GPU Jobs guide](gpu-jobs).

> **Limited GPU availablity in CHTC**\
> This Singularity/Tensorflow functionality is not yet available on
> CHTC\'s newer GPUs with a sufficiently high CUDA Capability.
> Therefore, for now, the best way to use this Singularity/Tensorflow
> environment with GPUs is by running jobs on the Open Science Grid (see
> below). We are working on having Singularity support on all CHTC GPUs
> soon.

<a name="osg"></a>

**3. Running on OSG**
-----------------

This Tensorflow environment can also be run on the Open Science Grid, or
OSG, either as the CPU or GPU version.

For more details on accessing the OSG, see [our guide for running
outside CHTC, sections 3 and 4](scaling-htc).
