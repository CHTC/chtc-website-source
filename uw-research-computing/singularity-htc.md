---
highlighter: none
layout: markdown-page
title: Use Apptainer (Singularity) Environments
--- 

## Overview
HTCondor supports the use of Apptainer (formerly known as Singularity) environments for jobs on the High Throughput Computing system. 

Similar to Docker containers, Apptainer environments allow users to prepare portable software and computing environments that can be sent to many jobs. This means your jobs will run in a more consistent environment that is easily reproducible by others. Additionally, similar to Docker containers, Apptainer jobs are able to take advantage of running on more of CHTC's High Throughput pool because Apptainer jobs can run on both our new CentOS8 machines, as well as our older CentOS7 machines, in addition to more easily taking advantage of back filling on external compute resources (e.g.[`+WantFlocking` and `+WantGliding` resources](https://chtc.cs.wisc.edu/uw-research-computing/scaling-htc.html).

## 1. Choose or create an Apptainer Image
To run an Apptainer job, it is necessary to first choose a preexisting Apptainer image or create your own. 

### A. Preexisting Images
Like Docker, it is easiest to use Apptainer in your jobs by finding a preexisting image that contains your desired software and environment setup. 

Preexisting "base" images can be found in the Apptainer library or from reputable sources such as the [OSG](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/). Additionally, it to convert a Docker container (e.g your own or from DockerHub) to a Apptainer image. 

### B. Create your Own Image
To create your own image, it is still necessary to select a "base" image to add to. See below how to customaize your base image by adding and preparing additional software packages/libraries. **If your apptainer image does not require any additional packages or libraries, skip to section 7.**   

## 2. Submit an interactive job
In your `/home` directory, create a submit file for your Apptainer build job called something like `build.sub`: 

```
# Apptainer build file

universe = vanilla
log = interactive.log

# If your build job needs access to any files in your /home directory, transfer them to your job using transfer_input_files
# transfer_input_files = 

+IsBuildJob = true
requirements = (OpSysMajorVer =?= 8)
request_cpus = 1
request_memory = 4GB
request_disk = 2GB

queue
```
Once your submit file is ready, queue an interactive job by running the following command:

```
[alice@submit]$ condor_submit -i build.sub
```

It may take a few minutes for the build job to start.

## 3. Create your Apptainer Build File

Inside your interactive job, create a blank text file called `image.def`. In this `.def` file, we will *def*ine what we want our Apptainer image to look like. 

In the following example, we discuss how to build on top of a pre-existing Docker container called `rocker/geospatial:4.2.2`. This container contains several common R geospatial packages, but we will learn how to add additional R packages to it. 

The first lines of this file should include where to get the base image from. If using the `rocker/geospatial:4.2.2` Docker image as our starting point, our `image.def` file would look like this:

```
Bootstrap: docker
From: rocker/geospatial:4.2.2
```

Then there is a section called `%post` where you put the additional commands to make the image just like you need it. For example, if we wanted to install the R package `cowsay`, we would use: 

```
%post
    apt-get update -y     # command to update existing packages
    apt-get install -y \  # command to install building tools we may need
            build-essential \
            cmake \
            g++ \
            r-base-dev

    R -e "install.packages('cowsay', dependencies=TRUE, repos='http://cran.rstudio.com/')" 
```
The `R -e "install.packages('cowsay', dependencies=TRUE, repos='http://cran.rstudio.com/')" ` line tells our image to start `R` and to use the common `R` fucnction `install.packages` to install `cowsay`. 

See the Apptainer documentation for a full reference on how to specify build specs. Note that the `%runscript` section is ignored when the container is executed on the High Throughput system.

The final `image.def` looks like:

```
Bootstrap: docker
From: rocker/geospatial:4.2.2

%post
    apt-get update -y
    apt-get install -y \
            build-essential \
            cmake \
            g++ \
            r-base-dev

    R -e "install.packages('cowsay', dependencies=TRUE, repos='http://cran.rstudio.com/')"
```

## 4. Build your Apptainer Container

Once your build spec is ready, you can "build" the container. The process of building an apptainer image will convert our `.def` file to a `.sif` Apptainer/Singularity image that we will use for future job submissions. To build our container, run this command:

```
$ apptainer build my-container.sif image.def
```

If you list the contents of your scratch directory by running `ls`, you should now see your executable Apptainer/Singularity file `my-container.sif`. 

Once the image is built, it is important to test it to make sure you have all software, packages, and libraries installed correctly. 

## 5. Testing Your Container

Just like it is important to test your codes and jobs at a small scale, you should make sure that your container is working correctly. To do this, we will start an "interactive Apptainer session" with the Apptainer/Singularity "shell" mode. The recommended command line, similar to how containers are started for jobs, is:

```
THIS CODE NEEDS TESTING (LIKELY REMOVE /SRV, ETC)
apptainer shell my-container.sif \
            --home $PWD:/srv \
            --pwd /srv \
           #--bind /cvmfs \
            --scratch /var/tmp \
            --scratch /tmp \
            --contain --ipc --pid \
``` 

This will give you an interactive shell using your container, with your current working directory mounted under /srv. Your prompt should change to: 

```
Apptainer my-container.sif:~>
```

You can explore the container and test your code in this mode. Once you are down exploring, exit the container by running `exit` or with `CTRL+D`.
 

# 6. Exit your HTCondor Interactive Job

Now that we have prepared our Apptainer image and tested it, we are ready to exit our interactive session. When we do, our build file will return to our `/home` directory on the submit server.  To exit, run:

```
[alice@build]$ exit
```

## 7. Use an Apptainer Container in HTC Jobs

HTCondor will automatically fetch and  prepare your Apptainer environment for your high-throughput jobs as long as we provide HTCondor with the `.sif` file information in your job's submit file. Specifically, we need to provide HTCondor with the name of the `container_image` and to tell HTCondor where to find the `.sif` file to transfer to the job using `transfer_input_files` like so: 

```
# HTC Submit File

# Provide HTCondor with the name of your .sif file and universe information
container_image = my-container.sif
universe = container

executable = myExecutable.sh

# Tell HTCondor to transfer the my-container.sif file to each job
transfer_input_files = my-container.sif, other_job_files

log = job.log
err = job.err
out = job.out

request_cpus = 1
request_memory = 4GB
request_disk = 2GB

queue
```
