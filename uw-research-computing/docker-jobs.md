---
highlighter: none
layout: markdown-page
title: Running HTC Jobs Using Docker Containers
---

Linux containers are a way to build a self-contained environment that
includes software, libraries, and other tools. This guide shows how to
submit jobs that use Docker containers.

# Overview

Typically, software in CHTC jobs is installed or compiled locally by
individual users and then brought along to each job, either using the
default file transfer or our SQUID web server. However, another option
is to use a *container* system, where the software is installed in a
*container image*. Using a container to handle software can be
advantageous if the software installation 1) has many dependencies, 2)
requires installation to a specific location, or 3) "hard-codes" paths
into the installation.

CHTC (and the OS Pool) have capabilities to access and start containers and
run jobs inside them. This guide shows how to do this for
[Docker](https://www.docker.com/what-docker) containers.

In order to run your job inside a Docker container, you will need to:

1.  [Find or prepare a Docker container image for your jobs to
    use](#1-choose-or-create-a-docker-container-image)
2.  [Make a few changes to your submit file](#2-submit-file-customization)
3.  [Other testing information](#3-testing)

# 1. Choose or Create a Docker Container Image

To run a Docker job, you will first need access to a Docker container
image that has been built and placed onto the
[DockerHub](https://hub.docker.com/) website. There are two primary ways
to do this.

## A. Pre-existing Images

The easiest way to get a Docker container image for running a job is to
use a public or pre-existing image on DockerHub. You can find images by
getting an account on DockerHub and searching for the software you want
to use.

Sample images:

-   [Python](https://hub.docker.com/_/python/)
-   [R](https://hub.docker.com/r/rocker/r-ver/)
-   ...and [more](https://hub.docker.com/explore/)

An image supported by a group will be continuously updated and the
versions will be indicated by "tags". We recommend choosing a specific
tag (or tags) of the container to use in CHTC.

## B. Build Your Own Image

You can also build your own Docker container image and upload it to
DockerHub. See [this link to our guide on building containers](docker-build.html) or the [Docker
documentation](https://docs.docker.com/engine/getstarted/) for more
information.

Simiilarly, we recommend using container tags. Importantly, whenever you make a significant change
to your container, you will want to use a new tag name to ensure that your jobs are getting an
updated version of the container, and not an 'old' version that has been cached by DockerHub 
or CHTC.

# 2. Submit File Customization

Jobs that run inside a Docker container will be almost exactly the same
as "vanilla" HTCondor jobs. There are two needed customizations to the
submit file: indicated that the job is a Docker job, and which Docker
container to use.

## A. Using a Docker Image

Start with a usual CHTC submit file like the one shown in our [Hello
World](helloworld.html) guide. Then, make the following two changes:

1.  Change the universe from "vanilla" to "docker":

```
universe = docker
```
{:.sub}

2.  Add a line to indicate which Docker image you want to use for
    running your job:

```
docker_image = user_name/image_name:tag
```
{:.sub}

When your job starts, HTCondor will pull the indicated image from
DockerHub, and use it to run your job.

## B. Executable and Input Files

Other pieces of the job (your executable and input files) should be just
like a non-Docker job submission; the only change may be that your
executable no longer needs to install or unpack your software, since it
will already be present in the Docker container.

# 3. Testing

If you want to test your jobs, you have two options: 

* We have a guide on exploring and testing Docker containers on your own computer here: 
    * [Exploring and Testing Docker Containers](docker-test.html)
* You can test a container interactively in CHTC by using a normal Docker job submit file and using the 
interactive flag with `condor_submit`: 
    ```
    [alice@submit]$ condor_submit -i docker.sub
    ```
    {: .cmd}
    This should start a session inside the indicated Docker container and connect you to it using ssh. Type `exit` to end the interactive job. *Note*: Files generated during your interactive job with Docker will not be transfered back to the submit node.  If you have a directory on `staging`, you can transfer the files there instead.

