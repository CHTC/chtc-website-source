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

**Goal:** Build container images that include the software you need, and run jobs on the CHTC High Throughput Computing system using those images. 

## 1) CHTC Apptainer Basics

* Apptainer containers are self-contained images (`.sif` files) you can run in CHTC jobs. 
* You *must* build them in an interactive build job on CHTC, *not* on the login node. 
* Once built, put the `.sif` file in your `/staging` folder and reference it in your HTCondor submit file. 

### Minimal Submit File Snippet

In your Condor submit file:

```
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

*(CHTC recommends staging the `.sif` to avoid transferring large files repeatedly.)*

## 2) How Containers Are Built on CHTC

To build a container:

1. **Write a definition file (`.def`):** describes base image and install steps. 
2. **Submit an interactive build job:** use HTCondor with `+IsBuildJob = true`. 
3. **Run `apptainer build` inside the interactive job.** 
4. **Test the image locally in the build session.** 
5. **Move the `.sif` to `/staging/your-user`.** 


## 3) Example A — **Conda Install (`numpy` and `pandas`)**

This example shows how to include Python and a conda-installed package in your container.

### A.1 Definition File: `conda-np-pd.def`

For this example, we will create a container that includes `numpy` and `pandas` installed via `conda`. We will start from the [**CHTC Recipes repo**](https://github.com/CHTC/recipes/tree/main/) example for [conda base](https://github.com/CHTC/recipes/tree/main/software/Conda/base-conda) installations. You can find the [template definition file in the recipes repo](https://github.com/CHTC/recipes/blob/main/software/Conda/base-conda/base-conda.def). 

```
Bootstrap: docker
From: continuumio/miniconda3

%post
    conda install -y -c conda-forge numpy pandas
```

✔ This starts from a miniconda base and installs `numpy` and `pandas` into the `base` conda environment.
✔ The packages are ready to use as soon as the container starts up.


### A.2 Build the Container

Interactive build submit file (`build-conda.sub`):

```
log = $(job_name).log

transfer_input_files = conda-np-pd.def.def

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
### A.3 Build the Apptainer Container
Once interactive shell starts:

```bash
apptainer build conda-np-pd.sif conda-np-pd.def
```


### A.3 Test Within Build Session

```bash
apptainer shell conda-np-pd.sif
python -c "import numpy; import pandas;"
```

Exit and move to staging:

```bash
mv conda-np-pd.sif /staging/$USER/conda-np-pd.sif
```

> ### ⚠️ Containers Should Always Be Stored in `/staging`
{:.tip-header}

> Containers are large and often reused files. Storing them in your `/staging` directory avoids repeated transfers from your home directory, saving time and resources when running jobs.
{:.tip}


## 4) Example B — **Install via `apt-get`**

This example shows installing system packages *directly* inside the container using `apt-get`.

### B.1 Definition File: `apt-cowsay.def`

```
Bootstrap: docker
From: ubuntu:22.04

%post
    apt-get update -y
    apt-get install -y cowsay

```

✔ Base image is `ubuntu:22.04` and system packages install at build time.


### B.2 Build the Container

Interactive build submit (`build-apt.sub`):

```
log = $(job_name).log

transfer_input_files = apt-cowsay.def

+IsBuildJob = True

request_cpus = 8
request_memory = 16GB
request_disk = 30GB

queue
```

Then in the interactive session:

```bash
apptainer build apt-cowsay.sif apt-cowsay.def
```


### B.3 Test & Stage

```bash
apptainer shell apt-cowsay.sif 
cowsay "Hello from apt!"
```

Exit and move to staging:`

```bash
exit
mv apt-cowsay.sif /staging/$USER
```


## 5) Running Jobs Using These Containers

Once build, your HTCondor job `run.sh` can simply invoke the installed tools:

### Example `run.sh`

```
#!/bin/bash
echo "Running inside container"
cowsay "CHTC says hi"
```

### Example `run.sub`

```
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

> ### ☝️🤓 Remember to use the `osdf:///` protocol whenever using containers `/staging`
{:.tip-header}

> The OSDF protocol allows HTCondor to more efficiently transfer large container files stored in `/staging`, improving job startup times and reducing unnecessary data movement. 
> 
> **Note** If your container is stored elsewhere (e.g., your group `/staging/groups/` directory), please use the `file:///` protocol instead. 
> 
> For more information about these protocols, see the [CHTC - Manage large data in /staging](https://chtc.cs.wisc.edu/uw-research-computing/file-avail-largedata#main).
{:.tip}

## 6) Common Tips & Best Practices

* **Always place the `.sif` in `/staging`** to leverage CHTC’s storage and avoid unnecessary transfers.
* **Request enough disk space** in your submit file to transfer the container.
* Use the existing [**CHTC Recipes repo**](https://github.com/CHTC/recipes/tree/main/) as templates for common installations.

