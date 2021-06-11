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

1.  [Examining CHTC's GPU Capacity](#a-examining-chtcs-gpu-capacity)
2.  [Using the CHTC GPU Lab](#b-using-the-chtc-gpu-lab)
3.  [Preparing Software Using GPUs](#c-preparing-software-using-gpus)
4.  [GPU Capacity Beyond the CHTC GPU Lab](#d-gpu-capacity-beyond-the-chtc-gpu-lab)

> This is the initial version of a guide about running GPU jobs in CHTC.
> If you have any suggestions for improvement, or any questions about
> using GPUs in CHTC, please email the research computing facilitators
> at chtc@cs.wisc.edu.

# A. Examining CHTC's GPU Capacity

You can find out information about GPUs in CHTC through the
`condor_status` command. All of our servers with GPUs have a `TotalGPUs`
attribute that is greater than zero; thus we can query the pool to find
GPU-enabled servers by running:

``` 
[alice@submit]$ condor_status -compact -constraint 'TotalGpus > 0'
```
{: .term}

To print out specific information about a GPU server and its GPUs, you
can use the "auto-format" option for `condor_status` and the names of
specific server attributes. For example, the tables below can be mostly
recreated using the attributes `Machine`, `TotalGpus`,
`CUDADeviceName` and `CUDACapability`:

```
[alice@submit]$ condor_status -compact -constraint 'TotalGpus > 0' \
			-af Machine TotalGpus CUDADeviceName CUDACapability
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
		requiring a specific type of GPU. <a href="https://en.wikipedia.org/wiki/CUDA#GPUs_supported">Wikipedia</a>
		has a table showing the CUDA compute capability for specific GPU architectures and cards.
		More details on what the capability numbers mean can be found on the 
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


# B. Using the CHTC GPU Lab

CHTC has a set of GPUs that are available for use by any CHTC user with an 
account on our high throughput computing (HTC) system
via the [CHTC GPU Lab](/gpu-lab.shtml), which includes templates and a campus GPU community.

Our expectation is that most, if not all, of CHTC users running GPU jobs should utilize 
the capacity of the GPU Lab to run their work. 

For those who would like to pursue alternative GPU resources, see our list of 
[additional GPU resources below](#d-gpu-capacity-beyond-the-chtc-gpu-lab)

## 1. Resources in the CHTC GPU Lab


<table class="gtable">
  <tr>
    <th>Number of Servers</th>
    <th>Names</th>
    <th>GPUs / Server</th>
    <th>GPU Type</th>
    <th>CUDACapability</th>
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
    <td>6.0</td>
    <td>yes</td>
  </tr>
  <tr>
    <td>4</td>
    <td>gpulab2000 - gpulab2003</td>
    <td>8</td>
    <td>GeForce RTX 2080 Ti</td>
    <td>7.5</td>
    <td>yes</td>
  </tr>
  <tr>
    <td>1</td>
    <td>gpulab2004</td>
    <td>4</td>
    <td>A100</td>
    <td>8.0</td>
    <td>yes</td>
  </tr>
</table>

## 2. Special Policies in the GPU Lab

Because the CHTC GPU Lab was
funded by a special investment from the [UW2020 program](https://research.wisc.edu/funding/uw2020/round-5-projects/enabling-graphics-processing-unit-based-data-science/), we
have implemented special policies to maximize how many researchers can 
benefit from this investment. **Specifically, jobs running on GPU Lab servers have time limits and job number limits 
(differing from CHTC defaults across the rest of the HTC System).**

{:.gtable}
  | Job type | Maximum runtime | Per-user limitation | 
  | --- |
  | Short | 12 hrs | 2/3 of CHTC GPU Lab GPUs | 
  | Medium | 24 hrs | 1/3 of CHTC GPU Lab GPUs |  
  | Long  | 7 days | 1 job with 1-2 GPUs | 

There are a certain number of slots in the GPU Lab reserved for interactive use. Interactive 
jobs that use GPU Lab servers are restricted to using a single GPU and a 4 hour runtime. 

These job types, runtimes, and per-user limitations are subject to change with
short notice as the CHTC GPU Lab studies usage patterns.

By opting-in to use the CHTC GPU Lab servers, you agree to be contacted by the
project leaders occasionally to discuss your GPU computing and help improve the
GPU Lab.

## 3. Submit Jobs Using the CHTC GPU Lab

The following options are needed in your HTCondor submit file in order 
to access the GPUs in the CHTC GPU Lab: 

- **Request GPUs**: All jobs that use GPUs must request GPUs in their submit file (along
with the usual requests for CPUs, memory and disk).
	```
	request_gpus = 1
	```
	{: .sub}

- **Request the CHTC GPU Lab**: To use CHTC's shared use GPUs, you need to opt-in to the GPU Lab. To 
do so, add the
following line to your submit file:
	```
	+WantGPULab = true
	```
	{: .sub}
 
- **Indicate Job Type**: We have categorized three "types"
of GPU jobs, characterized in the table [above](#2-special-policies-in-the-gpu-lab).  Indicate which job type you would 
like to submit by using the submit file option below. 
	```
	+GPUJobLength = "short" 
	# Can also request "medium" or "long"
	```
	{: .sub}
	If you do not specify a job type, the `medium` job type will be used as the default. If 
	your jobs will run in less than 12 hours, it is advantageous to indicate that they are 
	"short" jobs because you will be able to have more jobs running at once. 

- **Request Specific GPUs or CUDA Functionality (optional)**: If your software or code requires a specific version of CUDA, a certain
type of GPU, or has some other special requirement, you will need to add
a "requirements" statement to your submit file that uses one of the
attributes shown above. If you want a certain class of GPU, use CUDACapability:
	```
	requirements = (CUDACapability == 7.5)
	```
	{: .sub}
	It may be tempting to add requirements for specific GPU servers or
	types of GPU cards. However, when possible, it is best to write your
	code so that it can run across GPU types and without needing the
	latest version of CUDA.

A complete sample submit file is shown below. There are also example submit files and 
job scripts in this [GPU Job Templates repository](https://github.com/CHTC/templates-GPUs) 
in CHTC's Github organization. 

```
# gpu-lab.sub
# sample submit file for GPU Lab jobs

universe = vanilla
log = job_$(Cluster)_$(Process).log
error = job_$(Cluster)_$(Process).err
output = job_$(Cluster)_$(Process).out

# Fill in with whatever executable you're using
executable = run_gpu_job.sh
#arguments = 

should_transfer_files = YES
when_to_transfer_output = ON_EXIT
# Uncomment and add input files that are in /home
# transfer_input_files = 

# Uncomment and add custom requirements
# requirements = 

+WantGPULab = true
+GPUJobLength = "short"

request_gpus = 1
request_cpus = 1
request_memory = 1GB
request_disk = 1GB

queue 1

```
{: .sub}

## 4. General Notes

It is important to still request at least one CPU per job to do the
processing that is not well-suited to the GPU.

Note that HTCondor will make sure your job has access to the GPU -- you
shouldn't need to set any environmental variables or other options
related to the GPU, except what is needed inside your code.

It is possible to request multiple GPUs. Before doing so, make sure you're 
using code that can utilize multiple GPUs and then submit a test job to confirm 
success before submitting a bigger job. Also keep track of how long jobs 
are running versus waiting; the time you save by using multiple GPUs may be 
not worth the extra time that the job will likely wait in the queue. 

# C. Preparing Software Using GPUs

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

## 1. Compiled Code

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

## 2. Docker

CHTC's GPU servers have "nvidia-docker" installed, a specific version of
Docker that integrates Docker containers with GPUs. If you can find or
create a Docker image with your software that is based on the
nvidia-docker container, you can use this to run your jobs in CHTC. See
our [Docker guide](/docker-jobs.shtml) for how to use Docker in CHTC.


# D. GPU Capacity Beyond the CHTC GPU Lab

The following resources are additional CHTC-accessible servers with GPUs. They do not have the 
special time limit policies or job limits of the GPU Lab. However, some of them are 
owned or prioritized by specific groups. The implications of this 
on job runtimes is noted in each section. 

Note that all GPU jobs need to include the `request_gpus` option in their submit file, 
even if they are not using the GPU Lab. 

```
request_gpus = 1
```
{: .sub}

## 1. Access Research Group GPUs

Certain GPU servers in CHTC are prioritized for the
research groups that own them, but are available to run other jobs when
not being used by their owners. When running on these servers, jobs
forfeit our otherwise guaranteed runtime of 72 hours. However, for
shorter jobs, this is not a drawback and allowing jobs to run on these
additional servers opens up more capacity. 

Therefore, these servers are a good fit for GPU jobs that run in a few hours 
or less, or have implemented self-checkpointing (the capability to save progress 
to a file and restart from that progress). 

To allow jobs to run on these
research-group owned servers if there is space, add the "Flocking"
option to your submit file:

```
+wantFlocking = true
```
{: .sub}

## 2. Use the `gzk` Servers

These are servers that are similar to the GPU Lab severs with two important differences 
for running GPU jobs: 
- they do not have access to CHTC's large data `/staging` file system
- they do not have Docker capability

## 3. Using GPUs on the Open Science Grid

CHTC, as a member of the <a href="http://www.opensciencegrid.org/">Open Science Grid (OSG)</a> can access GPUs that
are available on the OSG. See [this guide](/scaling-htc.shtml) to know
whether your jobs are good candidates for the OSG and then get in touch
with CHTC's Research Computing Facilitators to discuss details. 
