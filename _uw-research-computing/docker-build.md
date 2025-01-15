---
layout: guide
title: Build a Docker Container Image
guide:
    category: Software
    tag:
        - htc
---

Linux containers are a way to build a self-contained environment that
includes software, libraries, and other tools. CHTC currently supports
running jobs inside [Docker](https://www.docker.com/what-docker)
containers. This guide describes how to build a Docker image
that you can use for running jobs in CHTC. For information on using 
this image for jobs, see our [Docker Jobs guide](docker-jobs.html).

# Overview

**Note that all the steps below should be run on your own computer, not
in CHTC.**

Docker images can be created using a special file format
called a "Dockerfile". This file has commands that allow you to:

-   use a pre-existing Docker image as a base
-   add files to the image
-   run installation commands
-   set environment variables

You can then "build" an image from this
file, test it locally, and push it to DockerHub, where
<a href="https://htcondor.org">HTCondor</a> can then use the image to build containers to run jobs in. 
Different versions of the image can be labeled with different version 
"tags".

This guide has:

1.  [Step by Step Instructions](#a-step-by-step-instructions)
2.  [Examples](#b-examples)

# A. Step by Step Instructions

## 1. Set Up Docker on Your Computer

{% include install_docker.md %}

## 2. Explore Docker Containers (optional)

If you have never used Docker before, we recommend exploring a pre-existing container 
and testing out installation steps interactively before creating a Dockerfile. See the 
first half of this guide: [Exploring and Testing a Docker Container](docker-test.html)

## 3. Create a Dockerfile

A Dockerfile is a plain text file with keywords that add elements to a 
Docker image. There are many keywords that can be used in a Dockerfile (documented on
the Docker website here: [Dockerfile
keywords](https://docs.docker.com/engine/reference/builder/)), but we will use a 
subset of these keywords following this basic outline: 

- Starting point: Which Docker image do you want to start with?
- Additions: What needs to be added? Folders? Data? Other software? 
- Environment: What variables (if any) are set as part of the software installation? 

### Create the file

Create a blank text file named `Dockerfile`. If you are planning on making
multiple images for different parts of your workflow, 
you should create a separate folder for each 
new image with the a ``Dockerfile`` inside each of them.

<h3>Choose a base image with <code class="h3">FROM</code></h3>

Usually you don't want to start building your image from scratch. 
Instead you'll want to choose a "base" image to add things to.

You can find a base image by searching DockerHub. If you're
using a scripting language like Python, R or perl, you could start with
the "official" image from these languages. If you're not sure what to
start with, using a basic Linux image (Debian, Ubuntu and CentOS are common 
examples) is often a good place to start.

Images often have tagged versions. Besides choosing the image
you want, make sure to choose a version by clicking on the "Tags" tab of
the image.  

Once you've decided on a base image and version, add it as the first
line of your Dockerfile, like this:

```dockerfile
FROM repository/image:tag
```
{:.file}

Some images are maintained by DockerHub itself 
(these are the "official" images mentioned above), 
and do not have a repository.
For example, to start with [Centos 7](https://hub.docker.com/_/centos), 
you could use 

```dockerfile
FROM centos:7
```
{:.file}

while starting from one of 
[HTCondor's HTC Jupyter notebook images](https://hub.docker.com/r/htcondor/htc-minimal-notebook)
might look like

```dockerfile
FROM htcondor/htc-minimal-notebook:2019-12-02
```
{:.file}

When possible, you should use a specific tag 
(**not** the automatic `latest` tag)
in `FROM` statements.

Here are some base images you might find useful to build off of:

- [Centos](https://hub.docker.com/_/centos)
- [Ubuntu](https://hub.docker.com/_/ubuntu)
- [Python](https://hub.docker.com/_/python) / [Anaconda](https://hub.docker.com/r/continuumio/anaconda3) / [Miniconda](https://hub.docker.com/r/continuumio/miniconda3)
- [R](https://hub.docker.com/_/r-base) / [Tidyverse](https://hub.docker.com/r/rocker/tidyverse/)
- [Tensorflow](https://hub.docker.com/r/tensorflow/tensorflow)
- [PyTorch](https://hub.docker.com/r/pytorch/pytorch)

<h3>Install packaged software with <code class="h3">RUN</code></h3>

The next step is the most challenging. We need to add commands to the
Dockerfile to install the desired software. There are a few standard ways to
do this:

-   Use a Linux package manager. This is usually `apt-get` for Debian-based 
containers (e.g, Ubuntu) or `yum` for RedHat Linux containers (e.g., CentOS). 
-   Use a software-specific package manager (like `pip` or `conda` for Python).
-   Use installation instructions (usually a progression of `configure`,
    `make`, `make install`).

Each of these options will be prefixed by the `RUN` keyword. You can
join together linked commands with the `&&` symbol; to break lines, put
a backslash `\` at the end of the line. `RUN` can execute any command inside the
image during construction, but keep in mind that the only thing kept in the final
image is changes to the filesystem (new and modified files, directories, etc.).

For example, suppose that your job's executable ends up running Python and
needs access to the packages `numpy` and `scipy`, as well as the Unix tool `wget`.
Below is an example of a `Dockerfile` that uses `RUN` to install these packages
using the system package manager and Python's built-in package manager.

```dockerfile
# Build the image based on the official Python version 3.8 image
FROM python:3.8

# Our base image happens to be Debian-based, so it uses apt-get as its system package manager
# Use apt-get to install wget 
RUN apt-get update \
 && apt-get install wget

# Use RUN to install Python packages (numpy and scipy) via pip, Python's package manager
RUN pip3 install numpy scipy
```
{:.file}

If you need to copy specific files (like source code) from your computer into the
image, place the files in the same folder as the
Dockerfile and use the `COPY` keyword. You could also download files 
within the image by using the `RUN` keyword and commands like `wget` 
or `git clone`.

For example, suppose that you need to use
[JAGS](http://mcmc-jags.sourceforge.net/) 
and the 
[rjags package for R](https://cran.r-project.org/web/packages/rjags/index.html). 
If you have the 
[JAGS source code](https://sourceforge.net/projects/mcmc-jags/files/JAGS/4.x/Source/)
downloaded next to the `Dockerfile`, you could compile and
install it inside the image like so:

```dockerfile
FROM rocker/r-ver:3.4.0

# COPY the JAGS source code into the image under /tmp
COPY JAGS-4.3.0.tar.gz /tmp

# RUN a series of commands to unpack the JAGS source, compile it, and install it
RUN cd /tmp \
 && tar -xzf JAGS-4.3.0.tar.gz \
 && cd JAGS-4.3.0 \
 && ./configure \
 && make \
 && make install

# install the R package rjags
RUN install2.r --error rjags
```
{:.file}

<h3>Set up the environment with <code class="h3">ENV</code></h3>

Your software might rely on certain environment variables being set correctly.

One common situation is that if you're installing a program to a custom location 
(like a home directory), you may need to add that directory to the image's system
`PATH`. For example, if you installed some scripts to `/home/software/bin`, you
could use

```dockerfile
ENV PATH="/home/software/bin:${PATH}"
```
{:.file}

to add them to your `PATH`.

You can set multiple environment variables at once:

```dockerfile
ENV DEBIAN_FRONTEND=noninteractive \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8
```
{:.file}

## 4. Build, Name, and Tag the Image

So far we haven't actually created the image -- we've just been
listing instructions for *how* to build the image in the Dockerfile.
Now we are ready to build the image!

First, decide on a name for the image, as well as a tag. Tags are
important for tracking which version of the image you've created (and
are using). A simple tag scheme would be to use numbers (e.g. v0, v1,
etc.), but you can use any system that makes sense to you.

Because HTCondor caches Docker images by tag, we **strongly recommend that you 
never use the `latest` tag, and always build images with a new, unique tag that
you then explicitly specify in new jobs**.

To build and tag your image, open a Terminal (Mac/Linux) or Command
Prompt (Windows) and navigate to the folder that contains your
Dockerfile:

```
$ cd directory
```
{:.term}

(Replace `directory` with the path to the appropriate folder.)

Then make sure Docker is running (there should be an icon on
your status bar, and running `docker info` shouldn't indicate any errors) and run:

```
$ docker build -t username/imagename:tag .
```
{:.term}

Replace `username` with your Docker Hub username and replace
`imagename` and `tag` with the values of your choice. Note the `.` at the end
of the command (to indicate "the current directory").

If you get errors, try to determine what you may need to add or change
to your Dockerfile and then run the build command again. Debugging a Docker
build is largely the same as debugging any software installation process.

## 5. Test Locally

This page describes how to interact with your new Docker image on your
own computer, before trying to run a job with it in CHTC:

- [Exploring a Docker Container on Your Computer](docker-test.html)

## 6. Push to DockerHub

Once your image has been successfully built and tested, you
can push it to DockerHub so that it will be available to run jobs in
CHTC. To do this, run the following command:

```
$ docker push username/imagename:tag
```
{:.term}

(Where you once again replace `username/imagename:tag` with what you used in
previous steps.)

The first time you push an image to DockerHub, you may need to run this
command beforehand:

```
$ docker login
```
{:.term}

It should ask for your DockerHub username and password.

> ## Reproducibility
> 
> If you have a free account on Docker Hub, any container image that you 
> have pushed there will be scheduled for removal if it is not used (pulled) at least once 
> every 6 months (See the [Docker Terms of Service](https://www.docker.com/pricing/resource-consumption-updates)). 
> 
> For this reason, and just because it's a good idea in general, we recommend 
> creating a file archive of your container image and placing it in whatever space 
> you use for long-term, backed-up storage of research data and code. 
> 
> To create a file archive of a container image, use this command, 
> changing the name of the archive file and container to reflect the 
> names you want to use: 
> ```
> docker save --output archive-name.tar username/imagename:tag
> ```
> {:.term}
> 
> It's also a good idea to archive a copy of the Dockerfile used to generate a 
> container image along with the file archive of the container image itself. 

## 7. Running Jobs

Once your Docker image is on Docker Hub, you can use it to run 
jobs on CHTC's HTC system. See this guide for more details: 

-   [Running Docker Jobs in CHTC](docker-jobs.html)

# B. Examples

This section holds various example `Dockerfile` that cover more advanced use cases.

## Installing a Custom Python Package from GitHub

Suppose you have a custom Python package hosted on GitHub, but not available 
on PyPI.
Since `pip` can install packages directly from `git` repositories, you could 
install your package like this:

```dockerfile
FROM python:3.8

RUN pip3 install git+https://github.com/<RepositoryOwner>/<RepositoryName>
```
where you would replace `<RepositoryOwner>` and `<RepositoryName>` with your
desired targets.

## QIIME

This `Dockerfile` installs [QIIME2](https://qiime2.org/) based on
[these instructions](https://docs.qiime2.org/2017.11/install/native/).
It assumes that the [Linux 64-bit miniconda
installer](https://conda.io/miniconda.html) has been downloaded into the
directory with the Dockerfile.

```dockerfile
FROM python:3.6-stretch

COPY Miniconda3-latest-Linux-x86_64.sh /tmp

RUN mkdir /home/qiimeuser
ENV HOME=/home/qiimeuser

RUN cd /tmp \
 && ./Miniconda3-latest-Linux-x86_64.sh -b -p /home/qiimeuser/minconda3 \
 && export PATH=/home/qiimeuser/minconda3/bin:$PATH \
 && conda update conda \
 && conda create -n qiime2-2017.10 --file https://data.qiime2.org/distro/core/qiime2-2017.10-conda-linux-64.txt
```
