---
highlighter: none
layout: guide
title: Building an Apptainer Container
guide:
    category: Software
    tag:
        - htc
        - hpc
--- 

This guide describes the general process for creating an Apptainer container. 
Specifically, we discuss the components of the "definition file" and how that file is used to construct or "build" the container itself. **Use this guide as a reference to help customize the contents of your container.** For a step-by-step tutorial of 
how to build a container, see [Use Custom Software in Jobs Using Apptainer](apptainer-htc.html).

{% capture content %}

* [The Apptainer definition file](#the-apptainer-definition-file)
* [Creating a definition file](#creating-a-definition-file)
* [The Apptainer container image](#the-apptainer-container-image)
* [Special considerations for building your container](#special-considerations-for-building-your-container)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## The Apptainer Definition File

The instructions for how Apptainer should build a container are located in the definition file (typically suffixed with `.def`).
The following table summarizes the sections that are routinely used when constructing a container: 

| Section | Description |
| ------- | ----------- |
| "Header" | Choose an existing container to start from. |
| `%files` | Add existing files (e.g., pre-downloaded source code) to use in the container. |
| `%post`  | Installation commands for adding libraries/programs to the container. |
| `%environment` | Automatically set environment variables when the container is started to help find installed programs. |
| `%labels` | Add information or metadata to help identify the container and its contents. |
| `%help` | Add text to help others use the container and its contents. |

With the exception of the "Header", sections in the definition file begin with a line starting with `%name_of_section` and all subsequent lines belong to that section until the end of the file or the next `%section` line is encountered.
Typically the contents of a section are indented to help visually distinguish the different parts.

Additional sections can be specified, though not all may be functional when using the container on CHTC systems.
For additional information on Apptainer definition files, see the [Apptainer documentation](https://apptainer.org/docs/user/latest/definition_files.html).
The manual page provides a full reference on the different sections of the definition file.

> Note that the `%runscript` section is ignored when the container is executed on the High Throughput system.

### Header section

This must be the first section of the definition file. 
The header specifies the container image that Apptainer should start with.
Apptainer will load this container image before attempting to execute the build commands.

Most users will use 

```
Bootstrap: docker
From: user/repo:tag
```

where `user/repo:tag` is any valid address to a Docker-based container registry. 
For example,

```
Bootstrap: docker
From: rocker/tidyverse:4.1.3
```

would use the [Rocker tidyverse v4.1.3](https://hub.docker.com/layers/rocker/tidyverse/4.1.3/images/sha256-666a64557c0edbeb785e41f352b6fdf5bda150f87d3faed112398aba1300d944?context=explore) container hosted on [DockerHub](https://hub.docker.com) as the base for the current build.

Alternatively, 

```
Bootstrap: docker
From: nvcr.io/nvidia/tensorflow:24.02-tf2-py3
```

would use the [NVIDIA TensorFlow 2 v24.02](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/tensorflow/tags) container hosted on the [NVIDIA Container Registry](https://catalog.ngc.nvidia.com/containers) (`nvcr`). 

To build on a local Apptainer image (e.g. `container.sif`), use:

```
Bootstrap: localimage
From: container.sif
```

> If you just want to convert an existing Docker container into an Apptainer container, you do not need to use a definition file.
> Instead, you can directly run the `apptainer build` command using the Docker address, as described [below](#converting-a-docker-image-to-an-apptainer-container-image).

### Files section

The `%files` section is used to copy files from the machine that is running Apptainer (the "host") into the container that Apptainer is building. 
This section is typically used when you have the source code saved on the host and want to extract/compile/install it inside of the container image.

> While the container is being built on the host system, by default it does not have direct access to files located on the host system. 
> The `%files` section serves as the bridge between the host system and the container being built.

The syntax for use is

```
%files
    file_on_host file_in_container
```

where `file_on_host` is in the same directory as the `.def` definition file, and where `file_in_container` will be copied to the container's root (`/`) by default.
You can instead provide absolute paths to the files on the host or in the container, or both.
For example:

```
%files
    /home/username/my-source-code.tar.gz /opt/my-program-build/my-source-code.tar.gz
```

> If the directories in the path in the container do not already exist, they will be created.

### Post section

The `%post` section contains any and all commands to be executed when building the container.
Typically this involves first installing packages using the operating system's package manager and then compiling/installing your custom programs.
Environment variables can be set as well, but they will only be active during the build (use the `%environment` section if you need them active during run time).

For example, if using an `ubuntu` based container, then you should be able to use the `apt` package manager to install your program's dependencies.

```
%post
    chmod 777 /tmp
    apt update -y
    apt install -y gcc make wget
```

> The `chmod 777 /tmp` is a specific workaround for building containers on the HTC system at CHTC. **Do not use this** line if you are using Apptainer to build containers **on a different system**.

Note that we have used the `-y` option for `apt` to pre-emptively agree to update `apt` and to install the `gcc`, `make`, and `wget` packages. 
Otherwise, the `apt` command will prompt you to confirm the executions via the command line. 
But since the Apptainer build process is executed non-interactively, you will be unable to enter a response via the command line, and the commands will eventually time out and the build fail.

Once you install the dependencies you need using the operating system's package manager, you can use those packages to obtain and install your desired program. 
For example, the following commands will install the [GNU Units](https://www.gnu.org/software/units/) command `units`.

```
    mkdir -p /opt/units-source
    cd /opt/units-source
    wget https://ftp.gnu.org/gnu/units/units-2.23.tar.gz
    tar -xzf units-2.23.tar.gz
    cd units-2.23
    ./configure
    make 
    make install
```

If using the default installation procedure, your program should be installed in and detectable by the operating system.
If not, you may need to manually environment variables to recognize your program.

### Environment section

The `%environment` section can be used to automatically set environment variables when the container is actually started.

For example, if you installed your program in a custom location `/opt/my-program` and the binaries are in the `bin/` folder, you could use this section to add that location to your `PATH` environment variable:

```
%environment
    export PATH="/opt/my-program/bin:$PATH"
```

> Effectively, this section can be used like a `.bashrc` or `.bash_profile` file.

### Labels section

The `%labels` section can be used to provide custom metadata about the container, which can make it easier for yourself and others to identify the nature and provenance of a container.

The syntax for this section is

```
%labels
    LabelNameA LabelValueA
    LableNameB LabelValueB
```

where `LabelName` is the name of the label, and `LabelValue` is the corresponding value.
For example, 

```
%labels
    Author Bucky Badger
    ContactEmail bbadger@wisc.edu
    Name Bucky's First Container
```

will generate the metadata in the container showing the `Author` as `Bucky Badger`, the `ContactEmail` as `bbadger@wisc.edu`, and the container `Name` as `Bucky's First Container`.

For an existing container, you can inspect the metadata with the command `apptainer inspect my_container.sif`.

> For a container with the `%labels` in the above example, you should see the following output:
> 
> ```
> $ apptainer inspect my_container.sif
>
> Author: Bucky Badger
> ContactEmail: bbadger@wisc.edu
> Name: Bucky's First Container
> ```
> {:.term}
> 
> along with some automatically generated labels.

### Help section

The `%help` section can be used to provide custom help text about how to use the container.
This can make it easier for yourself and others to interact and use the container.

For example,

```
%help
    This container is based on Ubuntu 22.04 and has the GNU Units command installed. 
    You can use the command `units` inside this container to convert from one unit of measurement to another.
    For example,
        $ units '1 GB' 'MB'
    returns
                * 1000
                / 0.001
```

For an existing container, you can inspect the help text with the command `apptainer run-help my-container.sif`.

## Creating a definition file

Here is general process for creating your own definition file for building your custom container:

1. **Consult your software's documentation** 
   
   Determine the requirements for installing the software you want to use.
   In particular you are looking for (a) the operating systems it is compatible with and (b) the prerequisite libraries or packages.

2. **Choose a base container** 

   The base container should at minimum use an operating system compatible with your software. 
   Ideally the container you choose also has many of the prerequisite libraries/programs already installed.

3. **Customize your definition file**

   In addition to examples in this guide, see our [Advanced Apptainer Example - SUMO](apptainer-htc-advanced-example.html) guide for an example of how to customize
   a definition file for your software. 

Remember that the `.def` file contains the *instructions* for creating your container and is not itself the container. 
To use the software defined within the `.def` file, you will need to first "build" the container and create the `.sif` file, as described in the following sections.

> ### 📝 Reference: CHTC's "Recipes" Repository
{:.tip-header}

> To see multiple examples of Apptainer definition files for different
> softwares, check out the software section of CHTC's "recipes" repository: 
> * [CHTC software recipes](https://github.com/CHTC/recipes/tree/main/software)
{:.tip}


## The Apptainer container image

The actual container image, which can be executed by Apptainer as a stand-alone operating system, is stored in a `.sif` file.\* 
The instructions for constructing the `.sif` file are provided by the `.def` definition file, as described above.
Basically, the `.sif` file is a compression of all of the files in the stand-alone operating system that comprises a "container".
Apptainer can use this one file to reconstitute the container at runtime.

*\* `sif` stands for "Singularity Image File"; Apptainer is formerly an open-source fork of the original program called Singularity.*

### Building the container

To create the `.sif` file from the `.def` file, you need to run the command

```
apptainer build my-container.sif my-container.def
```
{:.term}

Here the syntax is to provide the name of the `.sif` file that you want to create and then provide the name of the existing `.def` definition file.

> **Don't run the `apptainer build` command on the login server!** 
> Building the container image can be an intensive process and can consume the resources of the login server.
> 
> * On the High Throughput system, first start an interactive build job as described in our [Use Apptainer Containers](apptainer-htc.html) guide.
> * On the High Performance system, first launch an interactive Slurm session as described [here](hpc-job-submission.html#for-simple-testing-or-compiling).

### Converting a Docker image to an Apptainer container image

You can directly convert an existing Docker container into an Apptainer container image without having to provide a definition file.
To do so, use the command

```
apptainer build my-container.sif docker://user/repo:tag
```
{:.term}

where `user/repo:tag` is any valid address to a Docker-based container registry. (For example, `rocker/tidyverse:4.1.3` from DockerHub or `nvcr.io/nvidia/tensorflow:24.02-tf2-py3` from NVIDIA Container Registry.)

### Testing the container interactively

After building your container, we strongly recommend that you start it up and check that your program has been installed correctly.
Assuming that you are in an interactive session (i.e., not on the login server), then you can run

```
apptainer shell my-container.sif
```
{:.term}

This command should log you into a terminal that is backed by the container's operating system.

> On the High Throughput system, you can instead submit an interactive job that uses the `.sif` file as the `container_image`. 
> In this case, you do not need to run any `apptainer` commands, as HTCondor has automatically done so before you load into the interactive session.

Then you can check that the files are in the right place, or that your program can be found.
An easy way to check if your program is at least in recognized by the container is to try to print the help text for the program.

For example,

```
[username@hostname ~]$ apptainer shell units.sif
Apptainer> units --help

Usage: units [options] ['from-unit' 'to-unit']

<additional output truncated>
```
{:.term}

> By default, only your current directory will be mounted into the container, meaning the only files you can see from the host system are those in the directory where you ran the command.
>
> Furthermore, the interactive container session may inherit environment variables from your terminal session on the host system, which may conflict with the container environment.
> In this case, use the `-e` option to use a "clean" environment for the interactive session: `apptainer shell -e my-container.sif`.

## Special Considerations for Building Your Container

<!-- I would like to turn this into a drop-down section. Not sure if that is implemented in CHTC webpages yet. -->

* **Non-interactive**

  Because the container build is a non-interactive process, all commands within the `.def` file must be able to execute without user intervention.

* **Be prepared to troubleshoot**

  A consequence of the non-interactive build is that when something goes wrong, the build process will fail without creating a `.sif` file.
  That in turn means that when the build is restarted, it does so from completely from scratch.

  *It is rare to correctly write your `.def` file such that the container builds successfully on your first try!* 
  Do not be discouraged - examine the build messages to determine what went wrong and use the information to correct your `.def` file, then try again.

* **Multi-stage build**

  It is possible to have a multi-stage build.
  In this scenario, you have two `.def` files.
  You use the first one to construct an intermediary `.sif` file, which you can then use as the base for the second `.def` file.
  In the second `.def` file, you can specify

  ```
  Bootstrap: localimage
  From: path/to/first.sif
  ```

* **`.sif` files can be large**
  
  If you are installing a lot of programs, the final `.sif` image can be large, on the order of 10s of gigabytes. 
  Keep that in mind when requesting disk space.
  On the High Throughput system, we encourage you to place your container image on the `/staging` system.

* **Files cannot be created or modified after the container has been built**
  
  While you can read and execute any file within the container, you will not be able to create or modify files in the container once it has been built.
  The exception is if the location is "mounted" into the container, which means that there is a corresponding location on the host system where the files will be stored.
  Even then, you will only be allowed to create/modify files in that location if you would be able to normally without a container.

  This behavior is intentional as otherwise it would be possible for users to modify files on the host machine's operating system, which would be a signicant security, operations, and privacy risk.

* **Manually set a HOME directory**

  Some programs create `.cache` directories and may attempt to do so in the user's "HOME" directory.
  When executing in a container, however, the user typically does NOT have a "HOME" directory.
  In this case, some programs default to creating the directory in the root `/` directory.
  This will not work for reasons in the previous item.

  One workaround may be to manually set the `HOME` environment variable after the container has started. 
  On CHTC systems, the following should address this issue:

  ```
  export HOME=$(pwd)
  ```
  {:.term}

  If this does not address the issue, examine the error messages and consult the program documentation for how configure the program to use an alternate location for cache or temporary directories.


## Related Pages

* [Advanced Apptainer Example - SUMO](apptainer-htc-advanced-example.html)
* [Convert Docker Images to Apptainer Images](htc-docker-to-apptainer.html)
* [Use Custom Software in Jobs Using Apptainer](apptainer-htc.html)
* [Using Apptainer Containers on HPC](apptainer-hpc.html)

