---
highlighter: none
layout: guide
title: Use Custom Software in Jobs Using Apptainer
guide:
    category: Software
    tag:
        - htc
--- 

Linux containers are a way to build a self-contained environment that
includes software, libraries, and other tools. This guide shows how to
submit jobs that use Apptainer containers.

## Introduction

HTCondor supports the use of Apptainer (formerly known as Singularity) container environments for jobs on the High Throughput Computing system. 

Similar to Docker containers, Apptainer environments allow users to prepare portable software and computing environments that can be sent to many jobs. 
This means your jobs will run in a more consistent environment that is easily reproducible by others. 

Container jobs are able to take advantage of more of CHTC's High Throughput resources because the operating system where the job is running does not need to match the operating system where the container was built.

{% capture content %}
* [Introduction](#introduction)
* [Start Here](#start-here)
* [Use an Apptainer Container in HTC Jobs](#use-an-apptainer-container-in-htc-jobs)
* [Build your own apptainer container](#build-your-own-apptainer-container)
	* [Create a Definition File](#create-a-definition-file)
	* [Start an Interactive Build Job](#start-an-interactive-build-job)
	* [Build Your Container](#build-your-container)
	* [Test Your Container](#test-your-container)
	* [Move the Container .sif File to Staging](#move-the-container-sif-file-to-staging)
* [Suggestions for testing](#suggestions-for-testing)
* [More details about HTCondor and Apptainer](#more-details-about-htcondor-and-apptainer)
* [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Start Here

To run a job using an Apptainer container, you will need access to an Apptainer 
image file, usually with the suffix `.sif`. This file can be placed in your `/home`
 or `/staging` directory, or in a group directory. 
 
* If you have an existing `.sif` file, go straight to [Use an Apptainer Container in HTC Jobs](#use-an-apptainer-container-in-htc-jobs). 
* If you do not have an existing `.sif` container, you can create one in two ways: 
	- [Build your own apptainer container](#build-your-own-apptainer-container)
	- [Convert Docker Images to Apptainer Images](htc-docker-to-apptainer.html)

	Once you have created the `.sif` file by using one of the above methods
	ready, circle back to [Use an Apptainer Container in HTC Jobs](#use-an-apptainer-container-in-htc-jobs).
* For more details about using Apptainer, see [Suggestions for testing](#suggestions-for-testing) and [More details about HTCondor and Apptainer](#more-details-about-htcondor-and-apptainer). 

## Use an Apptainer Container in HTC Jobs

If you or a group member have already created the Apptainer `.sif` file, or are using a container from reputable sources such as the [OSG](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/), add one of these options to your HTCondor submit file 
to add it to your HTC job: 

* Option 1: If the `.sif` file is **in a `/home` directory**:
	
	```
	container_image = path/to/my-container.sif
	```
* Option 2: If the `.sif` file is **in a `/staging` directory**:
	
	```
	container_image = file:///staging/path/to/my-container.sif
	```
	
* Option 3: If the `.sif` file is **in a `/staging` directory AND you are using `+WantFlocking` or `+WantGliding`**:
	
	```
	container_image = osdf:///chtc/staging/path/to/my-container.sif
	```

The full submit file otherwise looks like normal, for example:

```
# apptainer.sub

# Provide HTCondor with the name of your .sif file and universe information
container_image = file:///staging/path/to/my-container.sif

executable = myExecutable.sh

# Include other files that need to be transferred here.
# transfer_input_files = other_job_files

log = job.log
error = job.err
output = job.out

requirements = (HasCHTCStaging == true)

# Make sure you request enough disk for the container image in addition to your other input files
request_cpus = 1
request_memory = 4GB
request_disk = 10GB      

queue
```

More details about how HTCondor integrates with Apptainer are in [More details about HTCondor and Apptainer](#more-details-about-htcondor-and-apptainer).

## Build your own Apptainer container

The process for building an Apptainer container looks like this: 

TBD: graphic

1. **Create a definition file.** The definition file describes a starting software environment in the first two lines and then what to add to it. 
1. **Start an interactive job for building.** We require that you build containers while in an interactive build job.
1. **Build the container.** To build a container, Apptainer uses the instructions in the `.def` file to create a `.sif` file. The `.sif` file is the compressed collection of all the files that comprise the container.
1. **(Optional): Test the container.** Once the image (`.sif` file) is created, it is important to test it to make sure you have all software, packages, and libraries installed correctly.
1. **Move the container to a persistent location.** We recommend placing the image file into your `/staging` folder

### Create a Definition File

To create your own container using Apptainer, you will need to create a definition (`.def`) file. CHTC provides example definition files in the `software` folder of our [Recipes GitHub repository](https://github.com/CHTC/recipes). 

<div class="d-flex mb-3">
	<div class="p-3 m-auto">
		<a class="btn btn-primary" href="https://github.com/CHTC/recipes">CHTC Software Build Recipes</a>
	</div>
</div>

We strongly recommend that you use one of the existing examples as the starting point for creating your own container. 

For the purposes of this guide, we will call 
the definition file `image.def`.

> ### 📖 Learn More About Definition Files
{:.tip-header}

> For more details about the definition file see: 
> [TBD](apptainer-build.html)
{:.tip}

### Start an Interactive Build Job

Building a container can be a computationally intense process. 
As such, we require that you only build containers while in an interactive build job.
On the High Throughput system, you can run the following commands to start an 
interactive job that includes your definition file: 

```
chtc-submit-apptainer-build -build image.def
condor_submit -i interactive.sub
```
{:.term}

Note that this submit file assumes you have a definition file named `image.def` in the same directory as the submit file.

> ### Troubleshooting Tip
{:.tip-header}
> 
> Apptainer `.sif` files can be fairly large, especially if you have a complex software stack. 
> If your interactive job abruptly fails during the build step, you may need to increase the value of `request_disk` in the submit file generated by `chtc-submit-apptainer-build`
> In this case, the `.log` file should have a message about the reason the interactive job was interrupted.
{:.tip}

### Build your container

Once the interactive build job starts, confirm that your `image.def` was transferred to the current directory.

To build your container, run this command:

```
apptainer build my-container.sif image.def
```
{:.term}

Feel free to rename the `.sif` file as you desire; for the purposes of this guide we are using `my-container.sif`.

As the command runs, a variety of information will be printed to the terminal regarding the container build process.
Unless something goes wrong, this information can be safely ignored.
Once the command has finished running, you should see `INFO:    Build complete: my-container.sif`.
Using the `ls` command, you should now see the container file `my-container.sif`. 

If the build command fails, examine the output for error messages that may explain why the build was unsuccessful.
Typically there is an issue with a package installation, such as a typo or a missing but required dependency.
Sometimes there will be an error during an earlier package installation that doesn't immediately cause the container build to fail.
But, when you test the container, you may notice an issue with the package.

If you are having trouble finding the error message, edit the definition file and remove (or comment out) the installation commands that come after the package in question.
Then rebuild the image, and now the relevant error messages should be near the end of the build output.

For more information on building Apptainer containers, see our [Building an Apptainer Container](apptainer-build.html) guide.

### Test your container

Once your container builds successfully, we highly encourage you to immediately test the container while still in the interactive build session. 

To test your container, use the command

```
apptainer shell -e my-container.sif
```
{:.term}

You should see your command prompt change to `Apptainer>`. 

When you are finished running commands inside the container, run the command `exit` to exit the container. 

```
exit
```
{:.term}

Your prompt should change back to something like `[username@build4000 ~]$`.

For more details about testing, see [Suggestions for testing](#suggestions-for-testing).

### Move the container .sif file to staging

Since Apptainer `.sif` files are routinely more than 1GB in size, we recommend that you transfer `my-container.sif` to your `/staging` directory.
It is usually easiest to move the container file directly to staging while still in the interactive build job:

```
mv my-container.sif /staging/$USER
```
{:.term}

If you do not have a `/staging` directory, you can skip this step and the `.sif` file will be automatically transferred back to the login server when you exit the interactive job.

We encourage you to request a `/staging` directory, especially if you plan on running many jobs using this container.
See our [Managing Large Data in Jobs](file-avail-largedata.html) guide for more information on using staging.

At this point, you can use the container in jobs, as described [above](#use-an-apptainer-container-in-htc-jobs). 

## Suggestions for testing

As always with the High Throughput system, we recommend submitting a single test 
job and confirming that your job behaves as expected.
If there are issues with the job, you may need to modify your executable, or even (re)build your own container. 

In an interactive job, run: 
```
apptainer shell -e my-container.sif
```
{:.term}

The `shell` command logs you into a terminal "inside" the container, with access to the libraries, packages, and programs that were installed in the container following the instructions in your `image.def` file.
(The `-e` option is used to prevent this terminal from trying to use the host system's programs.)

While "inside" the container, try to run your program(s) that you installed in the container. 
Typically it is easiest to try to print your program's "help" text, e.g., `my-program --help`. 
If using a programming language such as `python3` or `R`, try to start an interactive code session and load the packages that you installed.

If you installed your program in a custom location, consider using `ls` to verify the files are in the right location. 
You may need to manually set the `PATH` environment variable to point to the location of your program's executable binaries.
For example,

```
export PATH=/opt/my-program/bin:$PATH
```
{:.term}

Consult the "Special Considerations" section of our [Building an Apptainer Container](apptainer-build.html#special-considerations-for-building-your-container) guide for additional information on setting up and testing your container.

Also see the section [below](#more-details-about-htcondor-and-apptainer) for how to fully emulate the behavior of an 
HTCondor job interactively. 

## More details about HTCondor and Apptainer

From the user's perspective, a container job is practically identical to a regular job.
The main difference is that instead of running on the execute point's default operation system, the job is run inside the container. 

When you submit a job to HTCondor using a submit file with `container_image` set, HTCondor automatically handles the process of obtaining and running the container. You do not need to include any `apptainer` commands in your `executable` file. The process looks roughly like

- Claim machine that satisifies submit file requirements
- Pull (or transfer) the container image
- Transfer input files, executable to working directory 
- Run the executable script inside the container, as the submit user, with key directories mounted inside (such as the working directory, /staging directories, etc.)
- Transfer output files back to the submit server

For testing purposes, you can replicate the behavior of a container job with the following command.
First, start an interactive job.
Then run this command but change `my-container.sif` and `myExecutable.sh` to the names of the `.sif` and `.sh` files that you are using:

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

The container image can be placed in multiple locations in CHTC and still used in the job. 
If the `.sif` file is located on the login server, you can use 

```
container_image = my-container.sif
```

although we generally don't recommend this, since `.sif` files are large and should instead be located in [staging](file-avail-largedata.html).

Therefore, we recommend using

```
container_image = file:///staging/path/to/my-container.sif
```

If you are using `+WantFlocking` or `+WantGliding` as described in our [Scale Beyond Local HTC Capacity](scale-htc.html) guide, then you should instead use

```
container_image = osdf:///chtc/staging/path/to/my-container.sif
```

to enable transferring of the `.sif` file via the [OSDF](https://osg-htc.org/services/osdf.html) to compute capacity beyond CHTC.

## Related Pages

- [Building an Apptainer Container](apptainer-build)
- [Convert Docker Images to Apptainer Images](htc-docker-to-apptainer.html)
- [Advanced Example](apptainer-htc-advanced-example)
- [Using Apptainer Containers on HPC](apptainer-hpc.html).
- [Use Custom Software in Jobs Using Docker](docker-jobs)
- [Overview: How to Use Software](software-overview-htc)
