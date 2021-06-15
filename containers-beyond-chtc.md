---
highlighter: none
layout: markdown-page
title: Running Jobs Beyond CHTC Using Containers
---

This guide shows how to run jobs across CHTC and 
the Open Science Grid using containers. 

# Overview

Linux containers are a way to build a self-contained environment that
includes software, libraries, and other tools. The default way to run 
with containers in CHTC is by using Docker (see 
our [Docker Jobs guide](docker-jobs)). To run on resources outside of 
CHTC, like the campus grid or Open Science Grid, this process must be 
modified slightly. 

# 1. Choose or Create a Docker Container Image

To run a container-based job, you will first need access to a Docker container
image that has been built and placed onto the
[DockerHub](https://hub.docker.com/) website. See our 
[Docker Jobs guide](docker-jobs) for more information about containers in 
general and how to find or create them. 

# 2. Submit Container to be Staged Across CHTC and the OSG

Once you have an existing Docker container for your job, it needs to 
be added to an OSG-based container staging location. You can submit your 
container by adding its name to the file `docker_images.txt` in this 
Github repository: [cvmfs-singularity-sync](https://github.com/opensciencegrid/cvmfs-singularity-sync/)

If you have questions about how to submit changes to the `docker_images.txt` file on 
Github, contact chtc@cs.wisc.edu. 

Once your container is included in the list of Docker images, a 
copy of the container will be placed into a data space 
called `CVMFS` which is available on both CHTC and across the Open Science Grid. 

# 3. Use Singularity Submit File Options

To use your container in a job, set the following submit file options: 

```
# Use the correct container
universe = vanilla
+SingularityImage = "/cvmfs/singularity.opensciencegrid.org/username/image:tag"

# Make sure jobs can access the container staging location
requirements = ( HAS_SINGULARITY || (HasSingularity && HAS_CVMFS_oasis_opensciencegrid_org))

...executable, input files...

# Run on the campus grid and Open Science Grid
+WantFlocking = true
+WantGlidein = true

...other job requirements...

queue 1
```
{: .sub}

Note that the above options **replace** the usual Docker options from 
our [Docker Jobs Guide](docker-jobs). You should **not**
include a `docker_image` option in the submit file if using the above setup. 