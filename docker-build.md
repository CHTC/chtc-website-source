---
layout: default
title: Building a Docker Container Image
---

Linux containers are a way to build a self-contained environment that
includes software, libraries, and other tools. CHTC currently supports
running jobs inside [Docker](https://www.docker.com/what-docker)
containers. This guide describes how to build a Docker image
that you can use for running jobs in CHTC. For information on using 
this image for jobs, see our [Docker Jobs guide](docker-jobs.shtml).

# Overview

**Note that all the steps below should be run on your own computer, not
in CHTC.**

Docker images can be created using a special file format
called a "Dockerfile". This file has keywords that allow you to:

-   use a pre-existing Docker image as a base
-   add files into the image
-   run installation commands
-   set environment variables

You can then "build" an image from this
file, test it locally, and push it to DockerHub, where
HTCondor can then use it to build containers to run jobs in. 
Different versions of the image can be labeled with different version 
"tags". This guide has:

1.  [Step by Step Instructions](#a-step-by-step-instructions)
2.  [Examples](#b-examples)

# A. Step by Step Instructions

## 1. Set Up Docker on Your Computer

{% include install_docker.md %}

## 2. Explore Docker Containers (optional)

If you have never used Docker before, we recommend exploring a pre-existing container 
and testing out installation steps interactively before creating a Dockerfile. See the 
first half of this guide: [Exploring and Testing a Docker Container](docker-test.shtml)

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
multiple images, you should create a separate folder for each 
new image with the appropriate Dockerfile inside.

### Choose a "base" image with `FROM`

Often you don't want to start building your image from
scratch; you'll want to choose a base image to add things to.

You can find a base image by searching DockerHub. If you're
using a scripting language like Python, R or perl, you could start with
the official image from these languages. If you're not sure what to
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

Some images are maintained by DockerHub itself, and do not have a repository.
For example, to start with [Centos 7](https://hub.docker.com/_/centos), you could
use 

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

### Copy files and install software with `COPY` and `RUN`

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

If you need to copy specific files (like source code) from your computer into the
image, place the files in the same folder as the
Dockerfile and use the `COPY` keyword. You could also download files 
within the image by using the `RUN` keyword and commands like `wget` 
or `git clone`. 

In the example below, we show most of these options. Note that the Python source code
(`Python-3.2.1.tgz`) would need to be downloaded to the directory with the
Dockerfile in advance.
(In real life, you would start with one of the [official Python images](https://hub.docker.com/_/python).)

```dockerfile
# Build the image based on Ubuntu Linux
FROM ubuntu/ubuntu:bionic

# Copy the Python source code tarball from your computer 
# into the image, in the /tmp directory
COPY Python-3.5.2.tgz /tmp

# Update the Ubuntu system tools
RUN apt-get update

# Use the standard instructions for 
# installing Python from source code
RUN cd /tmp \
 && tar -xzf Python-3.2.1.tgz \
 && cd Python-3.2.1 \
 && ./configure \
 && make \
 && make install

# Use the python package manager pip to 
# install the numpy package
RUN pip3 install numpy
```
{:.file}

### Set the environment with `ENV`

If you're installing a program to a custom location (like a home
directory), you may need to add that directory to the image's system
PATH.

```dockerfile
ENV PATH="/home/software/bin:${PATH}"
```
{:.file}

You can set multiple environment variables at once:

```dockerfile
ENV DEBIAN_FRONTEND=noninteractive \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8
```
{:.file}

## 4. Build and Name the Image

So far we haven't actually created the image -- we've just been
listing instructions for the image in the Dockerfile. But we are now
ready to build the image!

First, decide on a name for the image, as well as a tag. Tags are
important for tracking which version of the image you've created (and
are using). A simple tag scheme would be to use numbers (e.g. v0, v1,
etc.), but you can use any system that makes sense to you. The image name 
will also include your Docker Hub user name. 

To build and tag your image, open a Terminal (Mac/Linux) or Command
Prompt (Windows) and navigate to the folder that contains your
Dockerfile:

```shell script
$ cd directory
```
{:.term}

(Replace "directory" with the path to the appropriate folder.)

Then make sure Docker is running (there should be a small icon on either
your status bar, and running `docker info` shouldn't indicate any errors) and run:

```shell script
$ docker build -t username/imagename:tag .
```
{:.term}

Replace `username` with your Docker Hub user name and replace
`imagename` and `tag` with the values of your choice. Note the `.` at the end
of the command.

If you get errors, try to determine what you may need to add or change
to your Dockerfile and then run the build command again.

## 5. Test Locally

This page describes how to interact with your new Docker image on your
own computer, before trying to run a job with it in CHTC:

-   [Exploring a Docker Container on Your Computer](/docker-test.shtml)

## 6. Push to DockerHub

Once your image has been successfully built and tested, you
can push it to DockerHub so that it will be available to run jobs in
CHTC. To do this, run the following command:

```shell script
$ docker push username/imagename:tag
```
{:.term}

The first time you push an image to DockerHub, you may need to run this
command first:

```shell script
$ docker login
```
{:.term}

It should ask for your DockerHub username and password.

## 7. Running Jobs

Once your Docker image is on Docker Hub, you can use it to run 
jobs on CHTC's HTC system. See this guide for more details: 

-   [Running Docker Jobs in CHTC](/docker-jobs.shtml)

# B. Examples

The following is a non-exhaustive list of sample Dockerfiles

## cutadapt

Sample Dockerfile for installing
[cutadapt](https://github.com/marcelm/cutadapt/) with Python 3.4.

```dockerfile
FROM python:3.4-wheezy
RUN pip3 install cutadapt
```

## JAGS + rjags

Sample Dockerfile for installing the [JAGS
program](http://mcmc-jags.sourceforge.net/) and [rjags package for
R.](). It assumes that the [JAGS
source](https://sourceforge.net/projects/mcmc-jags/files/JAGS/4.x/Source/)
has been downloaded into the directory with the Dockerfile.

```dockerfile
FROM rocker/r-ver:3.4.0

COPY JAGS-4.3.0.tar.gz /tmp
RUN cd /tmp \
 && tar -xzf JAGS-4.3.0.tar.gz \
 && cd JAGS-4.3.0 \
 && ./configure \
 && make \
 && make install

RUN install2.r --error rjags
```

## QIIME

Sample Dockerfile for installing [QIIME2](https://qiime2.org/) based on
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
