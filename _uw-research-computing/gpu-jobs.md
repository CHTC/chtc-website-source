---
highlighter: none
layout: guide
title: Submitting Jobs That Use GPUs
guide:
    order: 0
    category: Special Use Cases
    tag:
        - htc
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

- [Available CHTC GPUs](#a-available-chtc-gpus)
- [Submit jobs using GPUs in CHTC](#b-submit-jobs-using-gpus-in-chtc)
- [GPU capacity beyond the CHTC GPU Lab](#c-gpu-capacity-beyond-the-chtc-gpu-lab)
- [Using condor_status to explore GPUs](#d-using-condor_status-to-explore-chtc-gpus)
- [Prepare software using GPUs](#e-prepare-software-using-gpus)

# A. Available CHTC GPUs

## 1. GPU Lab

CHTC has a set of GPUs that are available for use by any CHTC user with an 
account on our high throughput computing (HTC) system
via the [CHTC GPU Lab](gpu-lab.html), which includes templates and a campus GPU community.

Our expectation is that most, if not all, of CHTC users running GPU jobs should utilize 
the capacity of the GPU Lab to run their work. 

<table class="gtable">
  <tr>
    <th>Number of Servers</th>
    <th>Names</th>
    <th>GPUs / Server</th>
    <th>GPU Type (<code>DeviceName</code>)</th>
    <th>Hardware Generation <code>Capability</code></th>
    <th>GPU Memory <code>GlobalMemoryMB</code></th>
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
    <td>16GB</td>
  </tr>
  <tr>
    <td>4</td>
    <td>gpulab2000 - gpulab2003</td>
    <td>8</td>
    <td>GeForce RTX 2080 Ti</td>
    <td>7.5</td>
    <td>10GB</td>
  </tr>
  <tr>
    <td>2</td>
    <td>gpulab2004, gpulab2005</td>
    <td>4</td>
    <td>A100-SXM4-40GB</td>
    <td>8.0</td>
    <td>40GB</td>
  </tr>
  <tr>
    <td>10</td>
    <td>gpu2002 - gpu2011</td>
    <td>4</td>
    <td>A100-SXM4-80GB</td>
    <td>8.0</td>
    <td>80GB</td>
  </tr>
  <tr>
    <td>3</td>
    <td>gpu4000 - gpu4002</td>
    <td>10</td>
    <td>L40</td>
    <td>8.9</td>
    <td>45GB</td>
  </tr>
</table>

### Special GPU Lab Policies

 **Jobs running on GPU Lab servers have time limits and job number limits 
(differing from CHTC defaults across the rest of the HTC System).**

{:.gtable}
  | Job type | Maximum runtime | Per-user limitation | 
  | --- |
  | Short | 12 hrs | 2/3 of CHTC GPU Lab GPUs | 
  | Medium | 24 hrs | 1/3 of CHTC GPU Lab GPUs |  
  | Long  | 7 days | up to 4 GPUs in use | 

There are a certain number of slots in the GPU Lab reserved for interactive use. Interactive 
jobs that use GPU Lab servers are restricted to using a single GPU and a 4 hour runtime. 

## 2. Other Capacity

There is additional dedicated and backfill GPU capacity available in CHTC and beyond; 
see [GPU capacity beyond the GPU Lab](#c-gpu-capacity-beyond-the-chtc-gpu-lab) for details. 

# B. Submit Jobs Using GPUs in CHTC

## 1. Choose GPU-Related Submit File Options

The following options are needed in your HTCondor submit file in order 
to access the GPUs in the CHTC GPU Lab and beyond: 

- **Request GPUs (required)**: All jobs that use GPUs must request GPUs in their submit file (along
with the usual requests for CPUs, memory, and disk).
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
of GPU jobs, characterized in the table [above](#special-gpu-lab-policies).  Indicate which job type you would 
like to submit by using the submit file option below. 
	```
+GPUJobLength = "short" 
# Can also request "medium" or "long"
	```
	{: .sub}
	If you do not specify a job type, the `medium` job type will be used as the default. If 
	your jobs will run in less than 12 hours, it is advantageous to indicate that they are 
	"short" jobs because you will be able to have more jobs running at once. 

- **Request Specific GPUs or CUDA Functionality Using `require_gpus` (optional)**: If your software or code requires a certain
type of GPU, or has some other special requirement, there is a special submit file line 
to request these capabilities, `require_gpus`. For example, if you want a certain 
class of GPU, represented by 
the attribute `Capability`, your `require_gpus` statement would look like this: 
	```
require_gpus = (Capability > 7.5)
	```
	{: .sub}
	
	You can see a table of the different attributes that HTCondor tracks 
	about the GPU nodes, and how to explore their values, in the section
	on [Using condor_status to explore GPUs](#d-using-condor_status-to-explore-chtc-gpus).
		
	It may be tempting to add requirements for specific GPU servers or
	types of GPU cards. However, when possible, it is best to write your
	code so that it can run across GPU types and without needing the
	latest version of CUDA.
	

- **Specify Multiple GPU Requirements (optional)**: Multiple requirements can be specified by using && statements:
	```
require_gpus = (Capability >= 7.5) && (GlobalMemoryMb >= 11000)
	```
	{:.sub}
	Ensure all specified requirements match the attributes of the GPU/Server of interest. HTCondor matches jobs to GPUs that match all specified requirements. Otherwise, the jobs will sit idle indefinitely.

- **Indicate Software or Data Requirements Using `requirements`**: If your data is large enough to 
	use our `/staging` data system (see more information [here](file-avail-largedata.html)), 
	or you are using modules or other software in our shared `/software` system, include 
	the needed requirements. 

- **Indicate Shorter/Resumable Jobs**: if your jobs are shorter than 4-6 hours, or have 
    the ability to checkpoint at least that frequently, we highly recommend taking 
    advantage of the additional GPU servers in CHTC that can run these kind of jobs 
    as backfill! Simply add the following option to your submit file: 
    ```
+is_resumable = true
	```
	{: .sub}
	
	For more information about the servers that you can run on with this option, 
	and what it means to run your jobs as "backfill" see 
	the section below on [Accessing Research Group GPUs](#1-access-research-group-gpus).

## 2. Sample Submit File

A  sample submit file is shown below. There are also example submit files and 
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

## 3. Notes

It is important to still request at least one CPU per job to do the
processing that is not well-suited to the GPU.

Note that HTCondor will make sure your job has access to the GPU; it will
set the environment variable `CUDA_VISIBLE_DEVICES` to indicate which GPU(s)
your code should run on. The environment variable will be read by CUDA to select the appropriate 
GPU(s). Your code should not modify this environment variable or manually 
select which GPU to run on, as this could result in two jobs sharing a GPU. 

It is possible to request multiple GPUs. Before doing so, make sure you're 
using code that can utilize multiple GPUs and then submit a test job to confirm 
success before submitting a bigger job. Also keep track of how long jobs 
are running versus waiting; the time you save by using multiple GPUs may be 
not worth the extra time that the job will likely wait in the queue. 

# C. GPU Capacity Beyond the CHTC GPU Lab

The following resources are additional CHTC-accessible servers with GPUs. They do not have the 
special time limit policies or job limits of the GPU Lab. However, some of them are 
owned or prioritized by specific groups. The implications of this 
on job runtimes is noted in each section. 

Note that all GPU jobs need to include the `request_gpus` option in their submit file, 
even if they are not using the GPU Lab. 

## 1. Access Research Group GPUs

Certain GPU servers in CHTC are prioritized for the
research groups that own them, but are available to run other jobs when
not being used by their owners. When running on these servers, jobs
forfeit our otherwise guaranteed runtime of 72 hours, and have the potential to be interrupted. However, for
shorter jobs or jobs that have implemented self-checkpointing, this is not a drawback and allowing jobs to run on these
additional servers opens up more capacity. 

Therefore, these servers are a good fit for GPU jobs that run in a few hours 
or less, or have implemented self-checkpointing (the capability to save progress 
to a file and restart from that progress). Use the `is_resumable` option shown 
above in the [list of submit file options](#1-choose-gpu-related-submit-file-options). 

<h2>2. Use the <code class="h2">gzk</code> Servers</h2>

These are servers that are similar to the GPU Lab severs with two important differences 
for running GPU jobs: 
- they do not have access to CHTC's large data `/staging` file system
- they do not have Docker capability

You do not need to do anything specific to allow jobs to run on these servers. 

## 3. Using GPUs in CHTC's OSG Pool and the UW Grid

CHTC, as a member of the [OSG Consortium](http://www.osg-htc.org/) can access GPUs that
are available on the [OS Pool](https://osg-htc.org/about/open_science_pool/). CHTC is 
also a member of a campus computing network called the UW Grid, where groups on campus 
share computing capacity, including access to idle GPUs. 

See [this guide](scaling-htc.html) to know
whether your jobs are good candidates for the UW Grid or OS Pool and then get in touch
with CHTC's Research Computing Facilitators to discuss details. 

# D. Using condor_status to explore CHTC GPUs

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
specific server attributes. In general, when querying attributes using 
`condor_status`, a "GPUs_" prefix needs to be added to the attribute name. 
For example, the tables at the top of the guide can be mostly
recreated using the attributes `Machine`, `TotalGpus`,
`GPUs_DeviceName` and `GPUs_Capability`:

```
[alice@submit]$ condor_status -constraint 'Gpus > 0' \
				-af Machine TotalGpus GPUs_DeviceName GPUs_Capability
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
		<td>(<code>GPUs_</code>)<code>DeviceName</code></td>
		<td>The type of GPU card.</td>
	</tr>
	<tr>
		<td>(<code>GPUs_</code>)<code>Capability</code></td>
		<td>Represents various capabilities of the GPU. Can be used as a proxy for the GPU card type when 
		requiring a specific type of GPU. <a href="https://en.wikipedia.org/wiki/CUDA#GPUs_supported">Wikipedia</a>
		has a table showing the compute capability for specific GPU architectures and cards.
		More details on what the capability numbers mean can be found on the 
		<a href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capabilities">
		NVIDIA website</a>.</td>
	</tr>
	<tr>
		<td>(<code>GPUs_</code>)<code>DriverVersion</code></td>
		<td><b>Not</b> the version of CUDA on the server or the NVIDIA driver version, but the maximum CUDA runtime version supported by the NVIDIA driver on the server. </td>
	</tr>
	<tr>
		<td>(<code>GPUs_</code>)<code>GlobalMemoryMb</code></td>
		<td>Amount of memory available on the GPU card.</td>
	</tr>
</table>

# E. Prepare Software Using GPUs

Before using GPUs in CHTC you should ensure that the use of GPUs will
actually help your program run faster. This means that the code or
software you are using has the special programming required to use GPUs
and that your particular task will use this capability.

If this is the case, there are several ways to run GPU-enabled software
in CHTC:

> **Machine Learning**\
>  For those using machine learning code specifically, we have a guide
> with more specific recommendations here: [Run Machine Learning Jobs on
> HTC](machine-learning-htc.html)

## 1. Compiled Code

You can use our conventional methods of creating a portable installation
of a software package (as in our R/Python guides) to run on GPUs. Most
of our build servers or GPU servers have copies of the CUDA Runtime that
can be used to compile code. To access these servers, submit an
interactive job, following the instructions in our [Build Job
Guide](inter-submit.html) or by submitting a GPU job submit file with the
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
our [Docker guide](docker-jobs.html) for how to use Docker in CHTC.

Currently we recommend using 
["nvidia/cuda" containers with a tag beginning with "12.1.1-devel"](https://hub.docker.com/r/nvidia/cuda/tags?page=1&name=12.1.1-devel)
for best integration with our system.
