---
highlighter: none
layout: guide
title: Use Apptainer (Singularity) Environments
guide:
    order: 10
    category: Software Solutions
    tag:
        - htc
--- 

## Overview
HTCondor supports the use of Apptainer (formerly known as Singularity) environments for jobs on the High Throughput Computing system. 

Similar to Docker containers, Apptainer environments allow users to prepare portable software and computing environments that can be sent to many jobs. 
This means your jobs will run in a more consistent environment that is easily reproducible by others. 
Additionally, similar to Docker containers, Apptainer jobs are able to take advantage of more of CHTC's High Throughput resources because Apptainer jobs can run on both our new CentOS8 machines and our older CentOS7 machines. 
Similarly, Apptainer jobs can more easily back fill on external compute resources (e.g.[`+WantFlocking` and `+WantGlideIn` resources](scaling-htc.html)).

## 1. Choose or create an Apptainer Image
To run an Apptainer job, it is necessary to first choose a preexisting Apptainer image or create your own. 

### A. Preexisting Images
Like with Docker, the easiest way to use Apptainer in your jobs is to find a preexisting image that contains your desired software and environment setup. 

Preexisting images can be found in reputable sources such as the [OSG](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/). 
It is also possible to convert a Docker container (e.g your own or from DockerHub) to a Apptainer image. 
**If your apptainer image does not require any additional packages or libraries, skip to [section 7](#7-use-an-apptainer-container-in-htc-jobs).**   

### B. Create your Own Image
To create your own image, it is still necessary to select a "base" image to add to. 
Check the documentation of the software you are interested in to see if they maintain images for the software program or its dependencies.
The majority of the guide that follows explains how to customize your base image by adding and preparing additional software packages/libraries.

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
request_disk = 4GB

queue
```

Once your submit file is ready, queue an interactive job by running the following command:

```
condor_submit -i build.sub
```
{:.term}

It may take a few minutes for the build job to start.

## 3. Create your Apptainer Build File

Inside your interactive job, create a blank text file called `image.def`. In this `.def` file, you will *def*ine what you want the Apptainer image to look like. 
The simple example below describes how to augment a pre-existing container that already contains most of what you need.
The advanced example below describes how to build a container from a base operating system.

### A. Simple example
In this example, you will augment a pre-existing container called `rocker/geospatial:4.2.2`.
This container contains several common R geospatial packages, which makes it convenient to use for geospatial code in R.
This container does not have *all* R packages, however, and you will likely want to add additional packages particular to your work.

To begin, the first lines of the `image.def` file should include where to get the base image from. 
If using the `rocker/geospatial:4.2.2` Docker image as your starting point, your `image.def` file would look like this:

```
Bootstrap: docker
From: rocker/geospatial:4.2.2
```

These lines tell Apptainer to pull the pre-existing image from Docker Hub, and to use it as the base for the container that will be built using this `image.def` file.

Next, you will want to include instructions in the `image.def` file for installing the additional packages that you want R to have.
In the `image.def` file, the installation instructions are placed in the `%post` section.
Note that because the `rocker` container already contains R, there is no need to install R in the `%post` section.

Let's say that you want to install the R package `cowsay`, which does not come preinstalled in the `rocker` container.
To do so, you will need to add install command to the `%post` section:

```
%post
    R -e "install.packages('cowsay', dependencies=TRUE, repos='http://cran.rstudio.com/')"
```

The `R -e "install.packages('cowsay', dependencies=TRUE, repos='http://cran.rstudio.com/')" ` command will execute the `install.packages` command inside the `R` terminal.
Since the command was placed in the `%post` section, Apptainer will execute this command when you build the container.

The full `image.def` file for this simple example is now:

```
Bootstrap: docker
From: rocker/geospatial:4.2.2

%post
    R -e "install.packages('cowsay', dependencies=TRUE, repos='http://cran.rstudio.com/')"
```

The `image.def` file is can now be used to build the container, as described below in [4. Build Your Apptainer Container](#4-build-your-apptainer-container).

### B. Advanced example

Sometimes the program you want to use does not have a pre-existing container that you can build on top of.
Then you will need to install the program and its dependencies inside of the container.
In this example, you will install the program [SUMO](https://sumo.dlr.de/docs/index.html) in a container.

First, you will again need to choose a base image for the container.
In this case, use the most recent LTS version of Ubuntu from Docker.
The top of the `image.def` file should look like:

```
Bootstrap: docker
From: ubuntu:22.04
```

Again, you will need to specify the installation commands within the `%post` section of the definition file.
Per the [program's instructions](https://sumo.dlr.de/docs/Installing/Linux_Build.html), you will first need to install various dependencies.
This can be done using the built-in package manager (`apt`) of Ubuntu, as shown below.

```
%post
    apt-get update -y
    apt-get install -y \
            git \
            cmake \
            python3 \
            g++ \
            libxerces-c-dev \
            libfox-1.6-dev \
            libgdal-dev \
            libproj-dev \
            libgl2ps-dev \
            python3-dev \
            swig \
            default-jdk \
            maven \
            libeigen3-dev
```

The first command is `apt-get update` and will update the list of available packages, which is necessary to get the latest versions of the packages in the following `apt-get install` command.
The following `apt-get install` command will install the dependencies required by the SUMO program.
Note that these installation commands do not use `sudo`, as Apptainer already has permissions to install programs in the container.

These commands will install the required dependencies, but you still need to include the commands for installing the SUMO program itself. 
Simply add the installation commands after the commands for installing the dependencies, but still within the `%post` section:

```
%post
    apt-get update -y
    apt-get install -y \
            git \
            cmake \
            python3 \
            g++ \
            libxerces-c-dev \
            libfox-1.6-dev \
            libgdal-dev \
            libproj-dev \
            libgl2ps-dev \
            python3-dev \
            swig \
            default-jdk \
            maven \
            libeigen3-dev

    git clone --recursive https://github.com/eclipse/sumo
    export SUMO_HOME="$PWD/sumo"
    mkdir sumo/build/cmake-build && cd sumo/build/cmake-build
    cmake ../..
    make

```

The `%post` section is now complete and will install SUMO and its dependencies in the container at build time.

The full `image.def` file for this advanced example is now:

```
Bootstrap: docker
From: ubuntu:22.04

%post
    apt-get update -y
    apt-get install -y \
            git \
            cmake \
            python3 \
            g++ \
            libxerces-c-dev \
            libfox-1.6-dev \
            libgdal-dev \
            libproj-dev \
            libgl2ps-dev \
            python3-dev \
            swig \
            default-jdk \
            maven \
            libeigen3-dev

    git clone --recursive https://github.com/eclipse/sumo
    export SUMO_HOME="$PWD/sumo"
    mkdir sumo/build/cmake-build && cd sumo/build/cmake-build
    cmake ../..
    make
```

See the [Apptainer documentation](https://apptainer.org/docs/user/latest/definition_files.html) for a full reference on how to specify build specs. 
> Note that the `%runscript` section is ignored when the container is executed on the High Throughput system.

## 4. Build your Apptainer Container

Once your image definition file is ready, you can "build" the container. 
The process of building an apptainer image will convert your `.def` file to a `.sif` Apptainer/Singularity image, which you will use for future job submissions. 
To build your container, run this command:

```
apptainer build my-container.sif image.def
```
{:.term}

As the command runs, a variety of information will be printed to the terminal regarding the container build process.
Unless something goes wrong, this information can be safely ignored.
Once the command has finished running, you should see `INFO:    Build complete: my-container.sif`).
Using the `ls` command, you should now see your executable Apptainer/Singularity file `my-container.sif`. 

If the build command fails, examine the output for error messages that may explain why the build was unsuccessful.
Typically there is an issue with a package installation, such as a typo or a missing but required dependency. 
To make it easier to troubleshoot, you can rerun the build command but redirect the output to a file.
For example, the following command will save the build output to `build.log` instead of printing it to the screen.

```
apptainer build my-container.sif image.def &> build.log
```
{:.term}

You can then examine the `build.log` file for the relevant error messages.

Sometimes there will be an error in a package installation that doesn't cause the apptainer build command to fail.
But, when you test the container, you may notice an issue with the package.
In that case, edit the definition file and remove (or comment out) the installation commands that come after the package in question.
Then rebuild the image, and now the relevant error messages should be near the end of the build output.

Once the image is built, it is important to test it to make sure you have all software, packages, and libraries installed correctly. 

## 5. Testing Your Container

Just like it is important to test your codes and jobs at a small scale, you should make sure that your container is working correctly. To do this, start an "interactive Apptainer session" with the Apptainer/Singularity "shell" mode. The recommended command line, similar to how containers are started for jobs, is:

```
apptainer shell \
            --home $PWD:/srv \
            --pwd /srv \
            --scratch /var/tmp \
            --scratch /tmp \
            --contain --ipc --pid \
            my-container.sif
``` 
{:.term}

This will give you an interactive shell running in your container, with your current working directory mounted under `/srv`. 
Your prompt should change to: 

```
Apptainer>
```
{:.term}

You can explore the container and test your code in this mode. 
For example,

```
Apptainer> pwd
/srv
Apptainer> ls
image.def my-container.sif tmp/ var/
Apptainer> exit
[alice@build ~]$ 
```
{:.term}

Once you are done exploring, exit the container by entering `exit` or by using the keyboard shortcut `CTRL+D`.

## 6. Exit your HTCondor Interactive Job

Now that you have prepared your Apptainer image and tested it, you are ready to exit your interactive session. 
By default, when you exit the interactive job the definition file and image file will return to same directory as your submit file on the submit file.
If your `.sif` file is large (> 5 GB), however, you should consider first moving it to your staging directory (`mv my-container.sif /staging/yourNetID/`).
See our `/staging` guide at [Managing Large Data in HTC Jobs](file-avail-largedata.html) for more information.

To exit, simply enter `exit` to end the interactive session and return to the submit node.

## 7. Use an Apptainer Container in HTC Jobs

Now that you have the container image saved in the form of the `.sif` file, you can use it as the environment for running your HTCondor jobs.
In your submit file, simply specify the image file using the `container_image` command and include the file in the `transfer_input_files` line, i.e.

```
container_image = my-container.sif
transfer_input_files = my-container.sif
```

The full submit file otherwise looks like normal, for example:

```
# apptainer.sub

# Provide HTCondor with the name of your .sif file and universe information
# (`universe = container` is optional as long as `container_image` is specified)
container_image = my-container.sif
universe = container

executable = myExecutable.sh

# Tell HTCondor to transfer the my-container.sif file to each job
transfer_input_files = my-container.sif, other_job_files

log = job.log
error = job.err
output = job.out

# Make sure you request enough disk for the container image in addition to your other input files
request_cpus = 1
request_memory = 4GB
request_disk = 2GB      

queue
```

Then simply use `condor_submit` with the name of your submit file.

> **Before running multiple jobs using your container, be sure to check the size of the `.sif` file.**
> If greater than 100 MB, the `.sif` file should **NOT** transferred using `transfer_input_files`.
> Instead, you should plan to use either CHTC's web proxy (SQUID) or large data filesystem (`/staging`).
> For more information, see our guides on SQUID ([Transfer Large Input Files Via Squid](file-avail-squid.html)) and `/staging` ([Managing Large Data in HTC Jobs](file-avail-largedata.html)).

## 8. How HTCondor Runs a Container Job

From the user's perspective, a container job is practically identical to a regular job.
The main difference is that instead of running on the execute point's default operation system, the job is run inside the container.

When you submit a job to HTCondor using a submit file with `container_image` set, HTCondor automatically handles the process of obtaining and running the container.
The process looks roughly like
    * Claim machine that satisifies submit file requirements
    * Pull (or transfer) the container image
    * Transfer input files, executable to working directory 
    * Run the executable script inside the container, as the submit user, with key directories mounted inside (such as the working directory, /staging directories, etc.)
    * Transfer output files back to the submit server

For testing purposes, you can replicate the behavior of a container job with the following command (remember to first start an interactive job if you are logged in to the submit server).
```
apptainer exec \
        --scratch /tmp \
        --scratch /var/tmp \
        --workdir $(pwd) \
        --pwd $(pwd) \
        --bind $(pwd) \
        --no-home \
        --containall \
        my-container.sif \
        /bin/bash myExecutable.sh 1> job.out 2> job.err
```
{:.term}


