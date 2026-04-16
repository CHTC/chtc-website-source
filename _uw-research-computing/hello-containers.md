---
highlighter: none
layout: guide
title: Hello Containers: Practice Building Apptainer Images on CHTC
guide:
    category: Software
    tag:
        - htc
---


# Hello Containers with Apptainer on CHTC

Research workflows depend on software stacks that can be difficult to install consistently across systems. Container images are one of the most useful ways to make HTC workflows portable and reproducible on CHTC. This guide walks through the basics of building Apptainer containers on CHTC, including how to write a definition file, submit an interactive build job, build and test a `.sif` image, store it in `/staging`, and use it in an HTCondor submit file. It also includes simple worked examples showing two common installation patterns: adding software with Conda and installing system packages with `apt-get`. By packaging software into an Apptainer image, you can create a controlled environment that is easier to test, share, and reuse in future jobs. On CHTC, containers are especially helpful when your workflow requires packages that are not already available, when you want to avoid repeatedly reinstalling software, or when you need a more reproducible setup for scaling jobs. 

**Goal:** Build container images that include the software you need, and run jobs on the CHTC High Throughput Computing system using those images. 

<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Before you start](#before-you-start)
   * [Minimal Submit File Snippet](#minimal-submit-file-snippet)
- [How Containers Are Built on CHTC](#how-containers-are-built-on-chtc)
- [Example A — **Conda Install (`numpy` and `pandas`)**](#example-a--conda-install-numpy-and-pandas)
   * [Write the container definition file: `conda-np-pd.def`](#write-the-container-definition-file-conda-np-pddef)
   * [Create the container build job](#create-the-container-build-job)
   * [Build the Apptainer container: `conda-np-pd.sif`](#build-the-apptainer-container-conda-np-pdsif)
   * [Test the container within the build session](#test-the-container-within-the-build-session)
   * [Store your apptainer container in `/staging`: ](#store-your-apptainer-container-in-staging)
- [Example B — **Install via `apt-get`**](#example-b--install-via-apt-get)
   * [Write the container definition file: `apt-cowsay.def`](#write-the-container-definition-file-apt-cowsaydef)
   * [Create the container build job](#create-the-container-build-job-1)
   * [Build the Apptainer container: `apt-cowsay.sif`](#build-the-apptainer-container-apt-cowsaysif)
   * [Test the container within the build session](#test-the-container-within-the-build-session-1)
   * [Store your apptainer container in `/staging`: ](#store-your-apptainer-container-in-staging-1)
- [Running Jobs Using These Containers](#running-jobs-using-these-containers)
   * [Example `run.sh`](#example-runsh)
   * [Example `run.sub`](#example-runsub)
- [Common Tips & Best Practices](#common-tips--best-practices)
- [Related Pages](#related-pages)

<!-- TOC end -->

## Before you start

Before getting started, you'll need to make sure you have the following:
- [x] A CHTC account on `ap2001` or `ap2002`
- [x] A `/staging` directory with at least 10 GB of free space
- [x] Unix text editing experience with `vim` or `nano`

* Apptainer containers are self-contained images (`.sif` files) you can run in CHTC jobs. 
* You *must* build them in an interactive build job on CHTC, *not* on the login node. 
* Once built, put the `.sif` file in your `/staging` folder and reference it in your HTCondor submit file.

### Minimal Submit File Snippet

This is the submit file that tells HTCondor to use your container. 

```text
container_image = osdf:///chtc/staging/path/to/my-container.sif

executable = run.sh
log = job.log
error = job.err
output = job.out

request_cpus = 2
request_memory = 4GB
request_disk = 8GB

queue
```

HTCondor will automatically transfer and use the container defined by `container_image`. 

## How Containers Are Built on CHTC

Containers should be built on a dedicated _Build Node_ on CHTC. We can target our interactive build jobs to a build node by following the steps below. 

To build a container:

1. **Write a definition file (`.def`):** describes base image and install steps. 
2. **Write a build job submit file:** that includes `+IsBuildJob = true`. 
3. **Submit an interactive build job:** use HTCondor with `condor_submit -i build.sub`. 
4. **Run `apptainer build` inside the interactive job.** 
5. **Test the image locally in the interactive build session.** 
6. **Move the `.sif` to `/staging/your-user`.** 


## Example A — **Conda Install (`numpy` and `pandas`)**

This example shows how to include Python and a conda-installed package in your container.

### Write the container definition file: `conda-np-pd.def`

For this example, we will create a container that includes `numpy` and `pandas` installed via `conda`. We will start from the [**CHTC Recipes repo**](https://github.com/CHTC/recipes/tree/main/) example for [conda base](https://github.com/CHTC/recipes/tree/main/software/Conda/base-conda) installations. You can find the [template definition file in the recipes repo](https://github.com/CHTC/recipes/blob/main/software/Conda/base-conda/base-conda.def). 

Create an apptainer definition file called `conda-np-pd.def`:
```text
Bootstrap: docker
From: continuumio/miniconda3

%post
    conda install -y -c conda-forge numpy pandas
```

✔ This starts from a miniconda base and installs `numpy` and `pandas` into the `base` conda environment.
✔ The packages are ready to use as soon as the container starts up.


### Create the container build job

Create an apptainer build job submit file (`build-conda.sub`):

```text
log = build-conda.log

transfer_input_files = conda-np-pd.def

+IsBuildJob = True

request_cpus = 8
request_memory = 16GB
request_disk = 30GB

queue
```

Submit the build job as an interactive session:

```bash
condor_submit -i build-conda.sub
```

### Build the Apptainer container: `conda-np-pd.sif`

Once interactive shell starts, build the apptainer container using the `apptainer build` command:

```bash
apptainer build conda-np-pd.sif conda-np-pd.def
```


### Test the container within the build session

Test your newly build apptainer container using the `apptainer shell` command:

```bash
apptainer shell conda-np-pd.sif
python -c "import numpy; import pandas;"
```

### Store your apptainer container in `/staging`: 

Exit out of the apptainer shell and move to staging:

```bash
exit
mv conda-np-pd.sif /staging/$USER/conda-np-pd.sif
```

> ### ⚠️ Containers Should Always Be Stored in `/staging`
{:.tip-header}

> Containers are large and often reused files. Storing them in your `/staging` directory avoids repeated transfers from your home directory, saving time and resources when running jobs.
{:.tip}


## Example B — **Install via `apt-get`**

This example shows installing system packages *directly* inside the container using `apt-get`.

###  Write the container definition file: `apt-cowsay.def`

For this example, we will create a container that includes `cowsay` installed via the ubuntu `apt-get` package manager. We will start with an existing `Ubuntu 22.04` [Docker Hub container](https://hub.docker.com/layers/library/ubuntu/22.04/images/sha256-14be402d3f1eeeb5e7da73d3260322c68e7b51c88388f53e88eb21d6450bd520). We will specify this base image using the `Bootstrap: docker` and `From: ubuntu:22.04` definition file syntax.

Create an apptainer definition file called `apt-cowsay.def`:

```text
Bootstrap: docker
From: ubuntu:22.04

%post
    apt-get update -y
    apt-get install -y cowsay

```

✔ Base image is `ubuntu:22.04` and system packages install at build time.


### Create the container build job

Create an apptainer build job submit file (`build-apt.sub`):

```text
log = build-apt.log

transfer_input_files = apt-cowsay.def

+IsBuildJob = True

request_cpus = 8
request_memory = 16GB
request_disk = 30GB

queue
```

Submit the build job as an interactive session:

```bash
condor_submit -i build-apt.sub
```

### Build the Apptainer container: `apt-cowsay.sif`

Once interactive shell starts, build the apptainer container using the `apptainer build` command:

```bash
apptainer build apt-cowsay.sif apt-cowsay.def
```


### Test the container within the build session

Test your newly build apptainer container using the `apptainer shell` command:

```bash
apptainer shell apt-cowsay.sif 
cowsay "Hello from apt!"
```

### Store your apptainer container in `/staging`: 

Exit out of the apptainer shell and move to staging:

```bash
exit
mv apt-cowsay.sif /staging/$USER
```

> ### ⚠️ Containers Should Always Be Stored in `/staging`
{:.tip-header}

> Containers are large and often reused files. Storing them in your `/staging` directory avoids repeated transfers from your home directory, saving time and resources when running jobs.
{:.tip}

## Running Jobs Using These Containers

Once built, your HTCondor job `run.sh` can simply invoke the installed tools:

### Example `run.sh`

```text
#!/bin/bash
echo "Running inside container"
cowsay "CHTC says hi"
```

### Example `run.sub`

```text
container_image = osdf:///chtc/staging/path/to/my-container.sif

executable = run.sh
log = job.log
error = job.err
output = job.out

request_cpus = 2
request_memory = 4GB
request_disk = 8GB

queue
```

> ### Remember to use the `osdf:///` protocol whenever using containers `/staging`
{:.tip-header}

> The OSDF protocol allows HTCondor to more efficiently transfer large container files stored in `/staging`, improving job startup times and reducing unnecessary data movement. 
> 
> **Note** If your container is stored elsewhere (e.g., your group `/staging/groups/` directory), please use the `file:///` protocol instead. 
> 
> For more information about these protocols, see the [CHTC - Manage large data in /staging](https://chtc.cs.wisc.edu/uw-research-computing/file-avail-largedata#main).
{:.tip}

## Common Tips & Best Practices

* **Always place the `.sif` in `/staging`** to leverage CHTC’s storage and avoid unnecessary transfers.
* **Request enough disk space** in your submit file to transfer the container.
* Use the existing [**CHTC Recipes repo**](https://github.com/CHTC/recipes/tree/main/software) as templates for common installations.

## Related Pages
* [Building an apptainer Container](https://chtc.cs.wisc.edu/uw-research-computing/apptainer-build)
* [Using Apptainer Containers on CHTC](https://chtc.cs.wisc.edu/uw-research-computing/apptainer-htc)
* [CHTC Software Container Recipe Repo](https://github.com/CHTC/recipes/tree/main/software)
