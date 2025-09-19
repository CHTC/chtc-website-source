---
highlighter: none
layout: guide
title: Use Custom Software in Jobs Using Docker
alt_title: Use Software Installed in a Docker Container
guide:
    category: Software
    tag:
        - htc
---

Linux containers are a way to build a self-contained environment that
includes software, libraries, and other tools. This guide shows how to
submit jobs that use Docker containers.

{% capture content %}
- [Start Here](#start-here)
- [Use a Docker Container in a Job](#use-a-docker-container-in-a-job)
- [Tips for HTCondor integration](#tips-for-htcondor-integration)
- [Find an existing Docker container image](#find-an-existing-docker-container-image)
- [Build your own Docker container image](#build-your-own-docker-container-image)
- [Testing Docker containers](#testing-docker-containers)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Start Here

To run a job using a Docker container, you will need access to a Docker container
image that has been built and placed onto the
[DockerHub](https://hub.docker.com/) website or another Docker registry service 
like [https://quay.io/] or a GitLab registry. 

If you have an existing Docker container with your software installed 
inside, go straight to [Use a Docker Container in a Job](#use-a-docker-container-in-a-job) 
and [Tips for HTCondor integration](#tips-for-HTCondor-integration)

If you do not have an existing Docker container you can: 
* **Find one:** [Find an existing Docker container image](#find-an-existing-docker-container-image)
* **Create one:** [Create a Docker Container Image](#create-a-docker-container-image). 
Once you have a container image 
ready, circle back to [Use a Docker Container in a Job](#use-a-docker-container-in-a-job). 

## Use a Docker Container in a Job

Jobs that run inside a Docker container will be almost exactly the same
as normal HTCondor jobs. The main change is indicating which Docker 
container to use and an optional "container universe" option: 

```
# HTC Submit File

# Provide HTCondor with the name of the Docker container
container_image = docker://user/repo:tag
universe = container

executable = myExecutable.sh
transfer_input_files = other_job_files

log = job.log
error = job.err
output = job.out

request_cpus = 1
request_memory = 4GB
request_disk = 2GB

queue
```

In the above, change the address of the Docker container image as 
needed based on the container you are using. 

> ### 💻 Non Docker Hub Registries
{:.tip-header}

> If your container is hosted on a Docker registry other than 
> DockerHub, just add the registry prefix before the container 
> repository name. For example, for a container hosted in 
> the Red Hat repository `quay.io`, the option should be: 
> 
> ```
> container_image = docker://quay.io/user/repo:tag
> ```
{:.tip}

## Tips for HTCondor integration

When your job starts, HTCondor will pull the indicated image from
DockerHub, and use it to run your job. You do not need to run any 
Docker commands yourself. 

Other pieces of the job (your executable and input files) should be just
like a non-Docker job submission. 

<!--
TODO: 
- transfer executable? 
- NON root
- tag versions
--> 

We recommend using container tags. Importantly, whenever you make a significant change
to your container, you will want to use a new tag name to ensure that your jobs are getting an
updated version of the container, and not an 'old' version that has been cached by DockerHub 
or CHTC. 

## Find an existing Docker container image

The easiest way to get a Docker container image for running a job is to
use a public or pre-existing image on DockerHub or another registry. You can find images by
getting an account on DockerHub and searching for the software you want
to use.

Sample images:

-   [Python](https://hub.docker.com/_/python/)
-   [R](https://hub.docker.com/r/rocker/r-ver/)
-   ...and [more](https://hub.docker.com/explore/)

An image supported by a group will be continuously updated and the
versions will be indicated by "tags". We recommend choosing a specific
tag (or tags) of the container to use in CHTC. 

## Build your own Docker container image

You can also build your own Docker container image and upload it to
DockerHub. See [this link to our guide on building containers](docker-build.html) or the [Docker
documentation](https://docs.docker.com/engine/getstarted/) for more
information.

## Testing Docker containers

If you want to test your jobs or container, you have two options: 

* We have a guide on exploring and testing Docker containers on your own computer here: 
    * [Exploring and Testing Docker Containers](docker-test.html)
* You can test a container interactively in CHTC by using a normal Docker job submit file and using the 
	interactive flag with `condor_submit`: 
	```
	[alice@ap]$ condor_submit -i docker.sub
	```
	{:.term}
	This should start a session inside the indicated Docker container and connect you to it using ssh. Type `exit` to end the interactive job. *Note*: Files generated during your interactive job with Docker will not be transfered back to the submit node.  If you have a directory on `staging`, you can transfer the files there instead; if you have questions about this, please contact a facilitator. 

## Related Pages

- [Build a Docker Container Image](docker-build)
- [Explore and Test Docker Containers](docker-test)
- [Use Custom Software in Jobs Using Apptainer](apptainer-htc)
- [Overview: How to Use Software](software-overview-htc)
