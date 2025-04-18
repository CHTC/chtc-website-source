---
highlighter: none
layout: guide
title: Using Apptainer Containers on HPC
guide:
  category: Software
  tag:
    - hpc
--- 

## Introduction

Similar to Docker containers, Apptainer environments allow users to prepare portable software and computing environments that can be sent to many jobs. 
This means your jobs will run in a more consistent environment that is easily reproducible by others. 

{% capture content %}

[Create a Definition File](#create-a-definition-file)

[Start an Interactive Session](#start-an-interactive-session)

[Build Your Container](#build-your-container)

[Test Your Container](#test-your-container)

[Use an Apptainer Container in HPC Jobs](#use-an-apptainer-container-in-hpc-jobs)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Create a Definition File

The definition (`.def`) file contains the instructions for what software to install while building the container.
CHTC provides example definition files in the `software` folder of our [Recipes GitHub repository](https://github.com/CHTC/recipes). We strongly recommend that you use one of the existing examples as the starting point for creating your own container. 

To create your own container using Apptainer, you will need to create a definition (`.def`) file. 
We encourage you to read our [Building an Apptainer Container](apptainer-build.html) guide to learn more about the components of the Apptainer definition file.

### Regarding MPI

**We are still in the process of developing guidance for deploying MPI-based software in containers on the High Performance system.**
The instructions in this guide should work for *single*-node jobs.
*Multi*-node jobs require the MPI installed in the container to integrate with Slurm and/or the cluster installation of MPI, and we are still exploring how to do so.

## Start an Interactive Session

Building a container can be a computationally intense process. 
As such, we require that you only build containers while in an interactive session.
On the High Performance system, you can use the following command to start the interactive session:

```
srun --mpi=pmix -n4 -N1 -t 240 -p int --pty bash
```
{:.term}

## Build Your Container

We recommend working from your `/scratch` directory when first building your container.

Once the interactive session starts, set the Apptainer temporary directory:

```
export APPTAINER_TMPDIR=/scratch/$USER/apptainer/tmp
mkdir -p $APPTAINER_TMPDIR
```
{:.term}

To build a container, Apptainer uses the instructions in the `.def` file to create a `.sif` file. The `.sif` file is the compressed collection of all the files that comprise the container.

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

## Test Your Container

Once your container builds successfully, it is important to test it to make sure you have all software, packages, and libraries installed correctly.

To test your container, use the command

```
apptainer shell -e my-container.sif
```
{:.term}

You should see your command prompt change to `Apptainer>`.

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

When you are finished running commands inside the container, run the command `exit` to exit the container. 
Your prompt should change back to something like `[username@spark-a006 directory]$`.
If you are satisfied with the container that you built, run the `exit` command again to exit the interactive Slurm session.

## Use an Apptainer Container in HPC Jobs

Now that you have the container image saved in the form of the `.sif` file, you can use it as the environment for running your HPC jobs.

For execution on a **single node**, we recommend adding the following commands to your sbatch script:

```
export TMPDIR=/scratch/$USER/apptainer_tmp/${SLURM_JOB_ID}
mkdir -p $TMPDIR

srun apptainer exec -e \
    --bind /home/$USER \
    --bind /scratch/$USER \
    --bind $TMPDIR \
    my-container.sif my-job-script.sh

rm -rf $TMPDIR
```

All of the commands that you want to execute using the container should go into `my-job-script.sh`. 

Then submit your job to Slurm as usual, as described in our [Submitting and Managing Jobs Using SLURM](hpc-job-submission.html) guide.

### On multiple nodes

We now have a prototype method for running multi-node jobs using an Apptainer container.
For instructions on the process, see the recipe in our Recipes repository:

* [Multi-Node Container Jobs on HPC](https://github.com/CHTC/recipes/tree/main/workflows-hpc/multi-node-container)

***Please let us know at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) if you are able to successfully implement this method!***

We welcome feedback about the process and its instructions.
And of course, feel free to reach out for assistance if you run into any issues.
