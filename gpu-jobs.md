---
highlighter: none
layout: default
title: Jobs That Use GPUs
---

# Overview

GPUs (Graphical Processing Units) are a special kind of computer
processor that are optimized for running very large numbers of simple
calculations in parallel, which often can be applied to problems related
to image processing or machine learning. Well-crafted GPU programs for
suitable applications can outperform implementations running on CPUs by
a factor of ten or more, *but only when the program is written and
designed explicitly to run on GPUs using special libraries like CUDA*.
For researchers who have problems that are well-suited to GPU
processing, it is possible to run jobs that use GPUs in CHTC. Read on to
determine:

1.  [GPUs available in CHTC](#1-gpus-available-in-chtc)
2.  [Submit Jobs Using GPUs](#2-submit-jobs-using-gpus)
3.  [Preparing Software Using GPUs](#3-preparing-software-using-gpus)
4.  [Using GPUs on the Open Science Grid](#4-using-gpus-on-the-open-science-grid)

> This is the initial version of a guide about running GPU jobs in CHTC.
> If you have any suggestions for improvement, or any questions about
> using GPUs in CHTC, please email the research computing facilitators
> at chtc@cs.wisc.edu.

# 1. GPUs Available in CHTC

CHTC's high throughput (HTC) system has the following servers with GPU
capabilities (as of 3/16/2020):

## A. General Use GPUs via the CHTC GPU Lab

There are a limited number of shared use GPUs available through the CHTC GPU
Lab. Therefore, these servers have different policies about job runtimes and
the maximum number of running jobs per user than general CHTC servers.
These GPUs are a special investment from the UW2020 program, and the policies
aim to maximize how many researchers can benefit from this investment.

By opting-in to use the CHTC GPU Lab servers, you agree to be contacted by the
project leaders occasionally to discuss your GPU computing and help improve the
GPU Lab.

<table class="gtable">
  <tr>
    <th>Number of Servers</th>
    <th>Names</th>
    <th>GPUs / Server</th>
    <th>GPU Type</th>
    <th>Current OS</th>
    <th>HasCHTCStaging</th>
  </tr>
<!--  <tr>
    <td>gpu-3.chtc.wisc.edu</td> 
    <td>1 </td>
    <td>Tesla K40c</td>
  </tr>   -->  
  <tr>
    <td>2</td>
    <td>gpu2000, gpu2001</td>
    <td>2</td>
    <td>Tesla P100-PCIE-16GB</td>
    <td>CentOS 7</td>
    <td>yes</td>
  </tr>
  <tr>
    <td>4</td>
    <td>gpu2002 - gpu2005</td>
    <td>8</td>
    <td>GeForce RTX 2080 Ti</td>
    <td>CentOS 7</td>
    <td>yes</td>
  </tr>
</table>

### Job types, runtimes, and per-user limitations

**Jobs running in the CHTC GPU Lab have different time limits than normal CHTC job
submissions**. 

See the table below for the default runtime limits for normally submitted jobs

{:.gtable}
  | Job type | Submit file name (?) | Maximum runtime | Per-user limitation |
  | --- |
  | Short | ? | 12 hrs | 2/3 of CTHC GPU Lab GPUs |
  | Medium | ? | 24 hrs | 1/3 of CTHC GPU Lab GPUs |
  | Long | ? | 7 days | 1 job with 1-2 GPUs |
  | Pre-emptable (backfill) | ? | None | None |

For interactive jobs, the default time limit is 4 hours and only 1 GPU can be requested 
at once. 

These job types, runtimes, and per-user limitations are subject to change with
short notice as the CHTC GPU Lab studies usage patterns.

## B. Researcher Owned GPUs

Some GPU servers in CHTC have 
been purchased for specific research groups and are prioritized for
their group members. If you set the submit file option `+WantFlocking`
to true, your jobs are eligible to run on all GPU servers in CHTC, but
they are no longer guaranteed a 72-hour run time -- see [below](#d-access-shared-and-research-group-gpus-optional).

## C. See All Available Resources

You can also find out information about GPUs in CHTC through the
`condor_status` command. All of our servers with GPUs have a `TotalGPUs`
attribute that is greater than zero; thus we can query the pool to find
GPU-enabled servers by running:

``` 
[alice@submit]$ condor_status -compact -constraint 'TotalGpus > 0'
```
{: .term}

To print out specific information about a GPU server and its GPUs, you
can use the "auto-format" option for `condor_status` and the names of
specific server attributes. For example, the tables above can be mostly
recreated using the attributes `Machine`, `TotalGpus` and
`CUDADeviceName`:

```
[alice@submit]$ condor_status -compact -constraint 'TotalGpus > 0' -af Machine TotalGpus CUDADeviceName
```
{: .term}


In addition, HTCondor tracks other GPU-related attributes for each
server, including:

<table class="gtable">
	<tr>
		<th>Attribute </th>
		<th>Explanation </th>
	</tr>
	<tr>
		<td><code>Gpus</code></td>
		<td>Number of GPUs in an individual job slot on a server (one server can be divided into slots to run multiple jobs).</td>
	</tr>
	<tr>
		<td><code>TotalGPUs</code></td>
		<td>The total number of GPUs on a server.</td>
	</tr>
	<tr>
		<td><code>CUDADeviceName</code></td>
		<td>The type of GPU card.</td>
	</tr>
	<tr>
		<td><code>CUDACapability</code></td>
		<td>Represents various capabilities of the GPU. Can be used as a proxy for the GPU card type when 
		requiring a specific type of GPU. More details on what the capability numbers mean can be found on the 
		<a href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capabilities">
		NVIDIA website</a>.</td>
	</tr>
	<tr>
		<td><code>CUDADriverVersion</code></td>
		<td>Maximum CUDA runtime version supported by the GPU drivers on the server. </td>
	</tr>
	<tr>
		<td><code>CUDAGlobalMemoryMb</code></td>
		<td>Amount of memory available on the GPU card.</td>
	</tr>
</table>

# 2. Submit Jobs Using GPUs

The following sections describe how to alter your HTCondor submit file in order 
to access the GPUs in CHTC. 

## A. Request GPUs (required)

All jobs that use GPUs must request GPUs in their submit file (along
with the usual requests for CPUs, memory and disk).

```
request_gpus = 1
```
{: .sub}
 
It is important to still request at least one CPU per job to do the
processing that is not well-suited to the GPU.

Note that HTCondor will make sure your job has access to the GPU -- you
shouldn't need to set any environmental variables or other options
related to the GPU, except what is needed inside your code.

## B. Use the GPU Lab Servers (recommended)

To accept the CHTC GPU Lab policies and opt-in to use these GPUs, add the
following line to your submit file:

```
+WantGPULab = true
```
{: .sub}


**<todo: finalize the syntax>**

**REMINDER**: As described [above](#job-types-runtimes-and-per-user-limitations), using 
the GPU Lab servers means that default CHTC job limits 
are changed, including the length of the job. 
To specify the job type... **<todo: finalize the syntax>**

```
???
```
{: .sub}

If you do not specify a job type, the Medium job type will be used as the default.

## C. Request specific GPUs or CUDA functionality (optional)

If your software or code requires a specific version of CUDA, a certain
type of GPU, or has some other special requirement, you will need to add
a "requirements" statement to your submit file that uses one of the
attributes shown above.

If you want a certain class of GPU, use CUDACapability:

```
requirements = (CUDACapability == 7.5)
```
{: .sub}


This table shows the "CUDACapability" value for our general use GPUs:

<table class="gtable">
  <tr>
    <th>GPU Model</th>
    <th>CUDACapability</th>
  </tr>
  <tr>
   <td>Tesla P100-PCIE-16GB</td>
   <td>6.0</td>
  </tr>
  <tr>
    <td>GeForce RTX 2080 Ti </td>
    <td>7.5</td>
  </tr>
</table>

> It may be tempting to add requirements for specific GPU servers or
> types of GPU cards. However, when possible, it is best to write your
> code so that it can run across GPU types and without needing the
> latest version of CUDA.

## D. Access research group GPUs (optional)

As alluded to above, certain GPU servers in CHTC are prioritized for the
research groups that own them, but are available to run other jobs when
not being used by their owners. When running on these servers, jobs
forfeit our otherwise guaranteed runtime of 72 hours; however, for
shorter jobs, this is not a drawback and allowing jobs to run on these
additional servers opens up more capacity. To allow jobs to run on these
research-group owned servers if there is space, add the "Flocking"
option to your submit file:

```
+wantFlocking = true
```
{: .sub}

## E. Use the `gzk` servers (optional)

The default operating system for jobs in CHTC is now CentOS 7. **If you
want to use the `gzk-*` GPU nodes shown above, you'll need to
specifically request the use of Scientific Linux 6 as an operating
system.** There is an example of how to do this in our [Operating System
guide](/os-transition.shtml).

# 3. Preparing Software Using GPUs

Before using GPUs in CHTC you should ensure that the use of GPUs will
actually help your program run faster. This means that the code or
software you are using has the special programming required to use GPUs
and that your particular task will use this capability.

If this is the case, there are several ways to run GPU-enabled software
in CHTC:

> **Machine Learning**\
>  For those using machine learning code specifically, we have a guide
> with more specific recommendations here: [Run Machine Learning Jobs on
> HTC](/machine-learning-htc.shtml)

## A. Compiled Code

You can use our conventional methods of creating a portable installation
of a software package (as in our R/Python guides) to run on GPUs. Most
of our build servers or GPU servers have copies of the CUDA Runtime that
can be used to compile code. To access these servers, submit an
interactive job, following the instructions in our [Build Job
Guide](/inter-submit) or by submitting a GPU job submit file with the
interactive flag for `condor_submit`. Once on a build or GPU server, see
what CUDA versions are available by looking at the path
`/user/local/cuda-*`.

Note that we strongly recommend software installation strategies that
incorporate the CUDA runtime into the final installed code, so that jobs
are able to run on servers even if a different version of the CUDA
runtime is installed (or there's no runtime at all!). For compiled code,
look for flags that enable static linking or use one of the solutions
listed below.

## B. Docker

CHTC's GPU servers have "nvidia-docker" installed, a specific version of
Docker that integrates Docker containers with GPUs. If you can find or
create a Docker image with your software that is based on the
nvidia-docker container, you can use this to run your jobs in CHTC. See
our [Docker guide](/docker-jobs.shtml) for how to use Docker in CHTC.

# 4. Using GPUs on the Open Science Grid

CHTC, as a member of the Open Science Grid (OSG) can access GPUs that
are available on the OSG. See [this guide](/scaling-htc.shtml) to know
whether your jobs are good candidates for the OSG and then get in touch
with CHTC's Research Computing Facilitators to discuss details.

