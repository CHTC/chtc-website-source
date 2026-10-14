---
layout: guide
title: Convert Docker images to Apptainer images
guide:
  category: Software
  tag:
    - htc
description: >-
  While HTCondor can pull container images from Docker Hub, we recommmend
  converting Docker images to local Apptainer images (.sif files) so that you
  have a local copy of your container image. This…
legacy_url: /uw-research-computing/htc-docker-to-apptainer.html
---
<div class="uw-toc">
<p class="uw-toc-title">Table of Contents</p>

- [Why convert your Docker image to an Apptainer image?](#why-convert-your-docker-image-to-an-apptainer-image)
- [Convert a Docker image into an Apptainer image](#convert-a-docker-image-into-an-apptainer-image)
   * [Move the image to your staging directory](#move-the-image-to-your-staging-directory)
- [Use the Apptainer image in a job](#use-the-apptainer-image-in-a-job)

</div>



## Why convert your Docker image to an Apptainer image?

While HTCondor can pull container images from Docker Hub, we recommmend converting Docker images to local Apptainer images (`.sif` files) so that you have a local copy of your container image. This reduces pull requests from Docker Hub.

## Convert a Docker image into an Apptainer image

You will need to launch an interactive job to build the Apptainer image. Below is an example of a submit file. You may want to change memory or disk space requirements, depending on the expected requirements for your image.


<div class="md-sub">

```
# build.sub
# For building an Apptainer container

log = build.log

requirements = (HasCHTCStaging == true)

+IsBuildJob = true
request_cpus = 1
request_memory = 4GB
request_disk = 4GB

queue
```

</div>


Submit the interactive job with `condor_submit -i build.sub`. 

<div class="md-term">

```
[user@ap2002]$ condor_submit -i build.sub
Submitting job(s).
1 job(s) submitted to cluster 3017972.
Waiting for job to start...
Welcome to build1_1@build4000.chtc.wisc.edu!

[user@build4000 ~]$
```

</div>


Once you enter the interactive job, we can begin building the Apptainer image.

Use the `apptainer build` command to build the Apptainer image.


<div class="md-term">

```
apptainer build container.sif docker://user/repo:tag
```

</div>


where `user/repo:tag` is any valid address to a Docker-based container registry. (For example, `rocker/tidyverse:4.1.3` from DockerHub or `nvcr.io/nvidia/tensorflow:24.02-tf2-py3` from NVIDIA Container Registry.) From this registry, we are creating an Apptainer image called `container.sif`. After running the command, you should see messages printed to your screen while Apptainer pulls the Docker image and builds the `.sif` file. The Apptainer image is done building when you see this message:


<div class="md-term">

```
INFO:    Creating SIF file...
INFO:    Build complete: container.sif
```

</div>


### Move the image to your staging directory

Because container images are generally large, we require users to move these images into their staging directories. While you are still in your interactive job, move the image to your staging directory.


<div class="md-term">

```
mv container.sif /staging/u/username/
```

</div>


## Use the Apptainer image in a job

To use the Apptainer image in a job, refer to this article: [Use Apptainer Containers](/uw-research-computing/apptainer-htc/#use-an-apptainer-container-in-htc-jobs)
