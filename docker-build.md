---
highlighter: none
layout: default
title: Building a Docker Container Image
---

Linux containers are a way to build a self-contained environment that
includes software, libraries, and other tools. CHTC currently supports
running jobs inside [Docker](https://www.docker.com/what-docker)
containers. This guide describes how to build a Docker container image
that you can use for running jobs in CHTC. For information on using 
this container image for jobs, see our [Docker Jobs guide](docker-jobs.shtml).

Overview
========

Docker container images can be created using a special file format
called a "Dockerfile". This file has keywords that allow you to:

-   use a pre-existing Docker container as a base
-   add files into the container
-   run installation commands
-   set environment variables

You can then "build" a container image from this
file, test it locally, and push it to a central Docker location where
HTCondor can then use it to run jobs. Different versions of the
container image can be labeled with different version "tags". This guide
has:

1.  [Step by Step Instructions](#a-step-by-step-instructions)
2.  [Examples](#b-examples)

**Note that all the steps below should be run on your own computer, not
in CHTC.**

A. Step by Step Instructions
============================

## 1. Set Up Docker on Your Computer

{% include install_docker.md %}

## 2. Explore Docker Containers (optional)

If you have never used Docker before, we recommend exploring a pre-existing container 
and testing out installation steps interactively before creating a Dockerfile. 

## 3. Create a Dockerfile

A Dockerfile is a plain text file with keywords that add elements to a 
Docker container. There are many keywords that can be used in a Dockerfile (documented on
the Docker website here: [Dockerfile
keywords](https://docs.docker.com/engine/reference/builder/)), but we will use a 
subset of these keywords following this basic outline: 

- Starting point: Which Docker container do you want to start with?
- Additions: What needs to be added? Folders? Data? Other software? 
- Environment: What variables (if any) are set as part of the software installation? 

### Create the file

Create a blank text file. Because of 
the way Docker builds containers, you should create a separate folder representing 
each container, with the appropriate Dockerfile inside. 
You can call the file whatever you want, but the
convention is to use the name `Dockerfile`, with no file extension. 

### FROM: Choose a "base" container image

Often you don't want to start building your container image from
scratch; you'll want to choose a base container image to add things to.

You can find a base container image by searching DockerHub. If you're
using a scripting language like Python, R or perl, you could start with
the official image from these languages. If you're not sure what to
start with, using a basic Linux image (Debian, Ubuntu and CentOS are common 
examples) is often a good place to start.

Container images often have tagged versions. Besides choosing the image
you want, make sure to choose a version by clicking on the "Tags" tab of
the image.

Once you've decided on a base image and version, add it as the first
line of your Dockerfile, like this:

```
FROM username/imagename:tag
```
{:.file}

### COPY and RUN: Copy files and install software

The next step is the most challenging. We need to add commands to the
Dockerfile to install the software. There are a few standard ways to to
do this:

-   Use a Linux package manager - usually `apt-get` for Debian/Ubuntu or `yum` or RedHat Linux, including CentOS. 
-   Use a software-specific package manager (like `pip`, or `conda`)
-   Use installation instructions (usually a progression of `configure`,
    `make`, `make install`)

Each of these options will be prefixed by the `RUN` keyword. You can
join together linked commands with the `&&` symbol; to break lines, put
a backslash `\` at the end of the line.

If you need to copy specific files (like source code) into the
container, you can do so by placing the files in the same folder as the
Dockerfile, and using the `COPY` keyword. You could also download files 
within the container by using the `RUN` keyword and commands like `wget` or `git clone`. 

In the example below, we show most of these options. Note that the Python source code
(`Python-3.2.1.tgz`) has been downloaded to the directory with the
Dockerfile in advance.

```
## Build the container based on Ubuntu Linux
FROM ubuntu/ubuntu:bionic

## Copy the Python source code from your computer 
## into the container
COPY Python-3.5.2.tgz /tmp

## Update the Ubuntu system tools
RUN apt-get update

## Use the standard instructions for 
## installing Python from source code
RUN cd /tmp
	&& tar -xzf Python-3.2.1.tgz \
	&& cd Python-3.2.1 \
	&& ./configure \
	&& make \
	&& make install

## Use the python package manager pip to 
## install the numpy package
RUN pip3 install numpy
```
{:.file}

### ENV: Set the environment

If you're installing a program to a custom location (like a home
directory), you may need to add that directory to the container's system
PATH.

```
ENV PATH="/home/software/bin:${PATH}"
```
{:.file}

## 4. Build and Name the Container Image

So far we haven't actually created the container -- we've just been
listing instructions for the container in the Dockerfile. But we are now
ready to build the container image!

First, decide on a name for the container image, as well as a tag. Tags are
important for tracking which version of the image you've created (and
are using). A simple tag scheme would be to use numbers (e.g. v0, v1,
etc.), but you can use any system that makes sense to you. The image name 
will also include your Docker Hub user name. 

To build and tag your image, open a Terminal (Mac/Linux) or Command
Prompt (Windows) and navigate to the folder that contains your
Dockerfile:

```
$ cd directory
```
{:.term}

(Replace "directory" with the path to the appropriate folder.)

Then make sure Docker is running (there should be a small icon on either
your top or bottom status bar) and run:

```
$ docker build -t username/imagename:tag -f dockerfile .
```
{:.term}

Replace `username` with your Docker Hub user name and replace
 `imagename` and `tag` with the values of your choice. 

If you get errors, try to determine what you may need to add or change
to your Dockerfile and then run the build command again.

## 5. Test Locally

This page describes how to interact with your new Docker image on your
own computer, before trying to run a job with it in CHTC:

-   [Exploring Docker Containers](/docker-test.shtml)

## 6. Push to DockerHub

Once your container image has been successfully built and tested, you
can push it to DockerHub so that it will be available to run jobs in
CHTC. To do this, run the following command:

```
$ docker push username/imagename:tag
```
{:.term}

The first time you push an image to DockerHub, you may need to run this
command first:

```
$ docker login
```
{:.term}

It should ask for your DockerHub username and password.

## 7. Running Jobs

Once your Docker container image is on Docker Hub, you can use it to run 
jobs on CHTC's HTC system. See this guide for more details: 

-   [Running Docker Jobs in CHTC](/docker-jobs.shtml)

B. Examples
===========

The following is a non-exhaustive list of sample Dockerfiles

cutadapt
--------

Sample Dockerfile for installing
[cutadapt](https://github.com/marcelm/cutadapt/) with Python 3.4.

    FROM python:3.4-wheezy
    RUN pip3 install cutadapt

JAGS + rjags
------------

Sample Dockerfile for installing the [JAGS
program](http://mcmc-jags.sourceforge.net/) and [rjags package for
R.](). It assumes that the [JAGS
source](https://sourceforge.net/projects/mcmc-jags/files/JAGS/4.x/Source/)
has been downloaded into the directory with the Dockerfile.

    FROM rocker/r-ver:3.4.0

    COPY JAGS-4.3.0.tar.gz /tmp
    RUN cd /tmp \
        && tar -xzf JAGS-4.3.0.tar.gz \
        && cd JAGS-4.3.0 \
        && ./configure \
        && make \
        && make install

    RUN install2.r --error \ 
            rjags

QIIME
-----

Sample Dockerfile for installing [QIIME2](https://qiime2.org/) based on
[these instructions](https://docs.qiime2.org/2017.11/install/native/).
It assumes that the [Linux 64-bit miniconda
installer](https://conda.io/miniconda.html) has been downloaded into the
directory with the Dockerfile.

    FROM python:3.6-stretch

    COPY Miniconda3-latest-Linux-x86_64.sh /tmp

    RUN mkdir /home/qiimeuser
    ENV HOME /home/qiimeuser

    RUN cd /tmp && \
        ./Miniconda3-latest-Linux-x86_64.sh -b -p /home/qiimeuser/minconda3 && \
        export PATH=/home/qiimeuser/minconda3/bin:$PATH && \
        conda update conda && \
        conda create -n qiime2-2017.10 \
        --file https://data.qiime2.org/distro/core/qiime2-2017.10-conda-linux-64.txt
