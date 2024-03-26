---
highlighter: none
layout: guide
title: Use Apptainer Containers
guide:
    order: 10
    category: Software Solutions
    tag:
        - htc
--- 

## Introduction

HTCondor supports the use of Apptainer (formerly known as Singularity) environments for jobs on the High Throughput Computing system. 

Similar to Docker containers, Apptainer environments allow users to prepare portable software and computing environments that can be sent to many jobs. 
This means your jobs will run in a more consistent environment that is easily reproducible by others. 

Container jobs are able to take advantage of more of CHTC's High Throughput resources because the operating system where the job is running does not need to match the operating system where the container was built.

{% capture content %}

[Quickstart](#quickstart)

* [Use an existing container](#use-an-existing-container)
* [Build your own container](#build-your-own-container)



{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Quickstart <a name="quickstart"></a>

### Use an existing container

If you or a group member have already created the Apptainer `.sif` file, or using a container from reputable sources such as the [OSG](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/), follow these steps to use it in an HTCondor job.

1. *Add the container `.sif` file to your submit file* <a name="quickstart-use-submit"></a>

    If the `.sif` file is **on the submit server**:

    ```
    container_image = path/to/my-container.sif
    ```

    If the `.sif` file is **on the `/staging` server**:

    ```
    container_image = file:///staging/path/to/my-container.sif
    ```

    If the `.sif` file is **on the `/staging` server AND you are using `+WantFlocking` or `+WantGliding`**:

    ```
    container_image = osdf:///chtc/staging/path/to/my-container.sif
    ```

    [Jump to more information](#use-an-apptainer-container-in-htc-jobs)

2. *Test your container job* <a name="quickstart-use-test"></a>

    As always with the High Throughput system, submit a single test job and confirm that your job behaves as expected.
    If there are issues with the job, you may need to modify your executable, or even (re)build your own container.

### Build your own container

If you need to create your own container for the software you want to use, follow these steps.
For more information on any particular step, jump to the corresponding section later in this guide.

<!-- 
Might be worth setting up the quick-start items as dropdown items.
Need help from Cannon; default approach does not render well on the website.
-->

1. *Create a definition file* <a name="quickstart-build-definition-file"></a>

    The definition (`.def`) file contains the instructions for what software to install while building the container.
    CHTC provides example definition files in the `software` folder of our [Recipes GitHub repository](https://github.com/CHTC/recipes). Choose from one of the existing examples, or create your own using the instructions later in this guide.

    [Jump to more information](#create-a-definition-file)

2. *Start an interactive build job* <a name="quickstart-build-interactive"></a>

    Start an interactive build job (an example submit file  `build.sub` is provided below).
    Be sure to include your `.def` file in the `transfer_input_files` line, or else create the file once the interactive job starts using a command line editor.

    Then submit the interactive build job with

    ```
    condor_submit -i build.sub
    ```

    [Jump to more information](#start-an-interactive-build-job)

3. *Build your container* <a name="quickstart-build-build"></a>

    While in an interactive build job, run the command

    ```
    apptainer build my-container.sif image.def
    ```

    If the container build finishes successfully, then the container image (`.sif`) file is created.
    This file is used for actually executing the container.

    [Jump to more information](#build-your-container)

4. *Test your container* <a name="quickstart-build-test"></a>

    While still in the interactive build job, run the command

    ```
    apptainer shell my-container.sif
    ```
    
    This command will start the container and log you into it, allowing you to test your software commands.

    Once you are done testing the container, enter
    
    ```
exit
    ```
    
    **once** to exit the container.

    [Jump to more information](#test-your-container)

5. *Move the container .sif file to staging* <a name="quickstart-build-move"></a>

    Once you are satisfied that your container is built correctly, copy your `.sif` file to your staging directory.

    ```
    mv my-container.sif /staging/$USER
    ```

    Once the file has transferred, exit the interactive job with

    ```
    exit
    ```

    [Jump to more information]()

Once you've built the container, use the instructions [above](#use-an-existing-container) to use the container in your HTCondor job.

## Create a definition file

To create your own container using Apptainer, you will need to create a definition (`.def`) file. 
For the purposes of this guide, we will call the definition file `image.def`.

CHTC provides example definition files in the `software` folder of our [Recipes GitHub repository](https://github.com/CHTC/recipes). We strongly recommend that you use one of the existing examples as the starting point for creating your own container. 

If the software you want to use is not in the CHTC Recipes repository, you can create your own container. Here is general process for creating your own definition file for building your custom container:

1. Consult your software's documentation to find (a) the operating systems it is compatible with and (b) the prerequisite libraries or packages.
2. Choose a base container that is at minimum using a compatible operating system. Ideally the container you choose also has many of the prerequisite libraries/programs already installed.
3. Create your own definition file with the installation commands needed to set up your software.

We encourage you to read our [Building an Apptainer Container](apptainer-build.html) guide to learn more about the components of the Apptainer definition file.

An advanced example of a definition file is provided in our [Advanced Apptainer Example - SUMO](apptainer-htc-advanced-example.html) guide.

[Jump back to Quickstart](#quickstart-build-definition-file)

## Start an interactive build job

Building a container can be a computationally intense process. 
As such, we require that you only build containers while in an interactive build job.
On the High Throughput system, you can use the following submit file `build.sub`:

```
# build.sub
# For building an Apptainer container

universe = vanilla
log = build.log

# In the latest version of HTCondor on CHTC, interactive jobs require an executable.
# If you do not have an existing executable, use a generic linux command like hostname as shown below.
executable = /usr/bin/hostname

# If you have additional files in your /home directory that are required for your container, add them to the transfer_input_files line as a comma-separated list.
transfer_input_files = image.def

+IsBuildJob = true
request_cpus = 4
request_memory = 16GB
request_disk = 16GB

queue
```

Note that this submit file assumes you have a definition file named `image.def` in the same directory as the submit file.

Once you've created the submit file, you can submit an interactive job with the command 

```
condor_submit -i build.sub
```

> Apptainer `.sif` files can be fairly large, especially if you have a complex software stack. 
> If your interactive job abruptly fails during the build step, you may need to increase the value of `request_disk` in your submit file.
> In this case, the `.log` file should have a message about the reason the interactive job was interrupted.

[Jump back to Quickstart](#quickstart-build-interactive)

## Build your container

Once the interactive build job starts, confirm that your `image.def` was transferred to the current directory.

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

Once the image is built, it is important to test it to make sure you have all software, packages, and libraries installed correctly.

For more information on building Apptainer containers, see our [Building an Apptainer Container](apptainer-build.html) guide.

[Jump back to Quickstart](#quickstart-build-build)

## Test your container

Once your container builds successfully, we highly encourage you to immediately test the container while still in the interactive build session.

To test your container, use the command

```
apptainer shell -e my-container.sif
```

You should see your command prompt change to `Apptainer>`.

The shell command logs you into a terminal "inside" the container, with access to the libraries, packages, and programs that were installed in the container following the instructions in your `image.def` file.
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

Consult the "Special Considerations" section of our [Building an Apptainer Container](apptainer-build.html#special-considerations-for-building-your-container) guide for additional information on setting up and testing your container.

When you are finished running commands inside the container, run the command `exit` to exit the container. 
Your prompt should change back to something like `[username@build4000 ~]$`.

[Jump back to Quickstart](#quickstart-build-test)

## Move the container .sif file to staging

Since Apptainer `.sif` files are routinely more than 1GB in size, we recommend that you transfer `my-container.sif` to your `/staging` directory.
It is usually easiest to move the container file directly to staging while still in the interactive build job:

```
mv my-container.sif /staging/$USER
```

If you do not have a `/staging` directory, you can skip this step and the `.sif` file will be automatically transferred back to the login server when you exit the interactive job.
We encourage you to request a `/staging` directory, especially if you plan on running many jobs using this container.
See our [Managing Large Data in Jobs](file-avail-largedata.html) guide for more information on using staging.

[Jump back to Quickstart](#quickstart-build-move)


## Use an Apptainer Container in HTC Jobs

Now that you have the container image saved in the form of the `.sif` file, you can use it as the environment for running your HTCondor jobs.
In your submit file, specify the image file using the `container_image` command.
HTCondor will automatically transfer the `.sif` file and automatically execute your `executable` file inside of the container; you do not need to include any `apptainer` commands in your `executable` file. 

If the `.sif` file is located on the login server, you can use 

```
container_image = my-container.sif
```

although we generally don't recommend this, since `.sif` files are large and should instead be located in [staging](file-avail-largedata.html).

Therefore, we recommend using

```
container_image = file:///staging/path/to/my-container.sif
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

# Make sure you request enough disk for the container image in addition to your other input files
request_cpus = 1
request_memory = 4GB
request_disk = 10GB      

queue
```

Then use `condor_submit` with the name of your submit file:

```
condor_submit apptainer.sub
```

If you are using `+WantFlocking` or `+WantGliding` as described in our [Scale Beyond Local HTC Capacity](scale-htc.html) guide, then you should instead use

```
container_image = osdf:///chtc/staging/path/to/my-container.sif
```

to enable transferring of the `.sif` file via the [OSDF](https://osg-htc.org/services/osdf.html) to compute capacity beyond CHTC.

[Jump back to Quickstart](#quickstart-use-submit)

> From the user's perspective, a container job is practically identical to a regular job.
> The main difference is that instead of running on the execute point's default operation system, the job is run inside the container.
>
> When you submit a job to HTCondor using a submit file with `container_image` set, HTCondor automatically handles the process of obtaining and running the container.
> The process looks roughly like
>
> - Claim machine that satisifies submit file requirements
> - Pull (or transfer) the container image
> - Transfer input files, executable to working directory 
> - Run the executable script inside the container, as the submit user, with key directories mounted inside (such as the working directory, /staging directories, etc.)
> - Transfer output files back to the submit server
>
> For testing purposes, you can replicate the behavior of a container job with the following command (remember to first start an interactive job if you are logged in to the submit server).
>
> ```
> apptainer exec \
>         --scratch /tmp \
>         --scratch /var/tmp \
>         --workdir $(pwd) \
>         --pwd $(pwd) \
>         --bind $(pwd) \
>         --no-home \
>         --containall \
>         my-container.sif \
>         /bin/bash myExecutable.sh 1> job.out 2> job.err
> ```
> {:.term}
>

