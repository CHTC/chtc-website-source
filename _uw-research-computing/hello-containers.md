---
highlighter: none
layout: guide
title: Practice Building Apptainer Containers on CHTC
guide:
    category: Software
    tag:
        - htc
---

Container images are one of the most useful ways to make HTC workflows portable and reproducible on CHTC. This guide walks through the basics of building Apptainer containers on CHTC with two examples - a conda environment and installing Linux system packages. 

{% capture content %}

- [Before you start](#before-you-start)
- [Overview](#overview)
- [Example A — **Conda Install (`numpy` and `pandas`)**](#example-a--conda-install-numpy-and-pandas)
- [Example B — **Install via `apt-get`**](#example-b--install-via-apt-get)
- [Running Jobs Using These Containers](#running-jobs-using-these-containers)
- [Common Tips & Best Practices](#common-tips--best-practices)
- [Related Pages](#related-pages)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Before you start

Before getting started, you'll need to make sure you have the following:
- [x] A CHTC account on `ap2001` or `ap2002` or another HTC node. 
- [x] A `/staging` directory with at least 10 GB of free space

## Overview

To build a container:

1. Write a definition file (`.def`).
2. Write a build job submit file. 
3. Submit an interactive build job. 
4. Run `apptainer build` inside the interactive job to generate a `.sif` container image file. 
5. Test the container locally in the interactive build session.
6. Move the `.sif` file to your staging folder. 
7. Use the image in your job. 

We will go through these seven steps for each example below. 

## Example A — **Conda install (`numpy` and `pandas`)**

This example shows how to include Python and a conda-installed package in your container.

### Step 1: Write the container definition file: `conda-np-pd.def`

For this example, we will create a container that includes `numpy` and `pandas` installed 
via `conda`. We will start from the [**CHTC Recipes repo**](https://github.com/CHTC/recipes/tree/main/) example for [conda base](https://github.com/CHTC/recipes/tree/main/software/Conda/base-conda) installations. You can find the [template definition file in the recipes repo](https://github.com/CHTC/recipes/blob/main/software/Conda/base-conda/base-conda.def). 
This starts from a miniforge base and installs `numpy` and `pandas` into the `base` conda environment.

Create an apptainer definition file called `conda-env.def`:
```text
Bootstrap: docker
From: condaforge/miniforge3:latest

%post
    conda install -y -c conda-forge numpy pandas
```

### Steps 2-3: Create the container build job

Create an apptainer build job submit file (`build-conda.sub`):

```text
log = build-conda.log

transfer_input_files = conda-env.def

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

### Step 4: Build the Apptainer container: `conda-np-pd.sif`

Once interactive shell starts, build the apptainer container using the `apptainer build` command:

```bash
apptainer build conda-np-pd.sif conda-env.def
```


### Step 5: Test the container within the build session

Test your newly build apptainer container using the `apptainer shell` command:

```bash
apptainer shell conda-np-pd.sif
python -c "import numpy; import pandas;"
```

Type `exit` to leave the running container: 

```bash
exit
```

### Step 6: Store your apptainer container in `/staging`: 

Move the `.sif` file to your staging folder. Replace `b/bbadger` with your username!!

```bash
mv conda-np-pd.sif /staging/b/bbadger/
```

Type exit again to leave the interactive job. 

```bash
exit
```

### Step 7: Run a job

See [Running Jobs Using These Containers](#running-jobs-using-these-containers)

## Example B — **Install via `apt-get`**

This example shows installing system packages *directly* inside the container using `apt-get`.

### Step 1: Write the container definition file: `apt-cowsay.def`

For this example, we will create a container that includes `cowsay` installed via the ubuntu `apt-get` package manager. We will start with an existing `Ubuntu 22.04` [Docker Hub container](https://hub.docker.com/layers/library/ubuntu/22.04/images/sha256-14be402d3f1eeeb5e7da73d3260322c68e7b51c88388f53e88eb21d6450bd520). We will specify this base image using the `Bootstrap: docker` and `From: ubuntu:22.04` definition file syntax.

Create an apptainer definition file called `apt-cowsay.def`:

```text
Bootstrap: docker
From: ubuntu:22.04

%post
    apt-get update -y
    apt-get install -y cowsay

```

Base image is `ubuntu:22.04` and system packages install at build time.


### Steps 2-3: Create the container build job

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

### Step 4: Build the Apptainer container: `apt-cowsay.sif`

Once interactive shell starts, build the apptainer container using the `apptainer build` command:

```bash
apptainer build apt-cowsay.sif apt-cowsay.def
```


### Step 5: Test the container within the build session

Test your newly build apptainer container using the `apptainer shell` command:

```bash
apptainer shell apt-cowsay.sif 
cowsay "Hello from apt!"
```

Type `exit` to leave the running container: 

```bash
exit
```

### Step 6: Store your apptainer container in `/staging`: 

Move to the `.sif` file to your staging folder. Replace `b/bbadger` with your username!!


```bash
mv apt-cowsay.sif /staging/b/bbadger
```

Type exit again to leave the interactive job. 

```bash
exit
```

### Step 7: Run a job

See [Running Jobs Using These Containers](#running-jobs-using-these-containers)

## Running jobs using these containers

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

## Common tips & best practices

* **Always place the `.sif` in `/staging`** to leverage CHTC’s storage and avoid unnecessary transfers.
* **Request enough disk space** in your submit file to transfer the container.
* Use the existing [**CHTC Recipes repo**](https://github.com/CHTC/recipes/tree/main/software) as templates for common installations.

## Related pages

* [Building an apptainer Container](https://chtc.cs.wisc.edu/uw-research-computing/apptainer-build)
* [Using Apptainer Containers on CHTC](https://chtc.cs.wisc.edu/uw-research-computing/apptainer-htc)
* [CHTC Software Container Recipe Repo](https://github.com/CHTC/recipes/tree/main/software)
