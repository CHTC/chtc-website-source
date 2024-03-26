---
highlighter: none
layout: guide
title: Advanced Apptainer Example - SUMO
guide:
    order: 12
    category: Software Solutions
    tag:
        - htc
--- 

Sometimes the program you want to use does not have a pre-existing container that you can build on top of.
Then you will need to install the program and its dependencies inside of the container.
In this example, you will install the program [SUMO](https://sumo.dlr.de/docs/index.html) in a container.

{% capture content %}

[1. Choose the Base Container Image](#1-choose-the-base-container-image)
[2. Add the Installation Commands](#2-add-the-installation-commands)
[3. Add the Environment Variables](#3-add-environment-variables)
[Summary](#summary)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## 1. Choose the Base Container Image

First, you will need to choose a base image for the container.
Consult the documentation for the program you want to install to make sure you select a compatible operating system.

For this example, we will use the most recent LTS version of Ubuntu from Docker.
The beginning of the `image.def` file should look like this:

```
Bootstrap: docker
From: ubuntu:22.04
```

## 2. Add the Installation Commands

All of the installation commands that you want Apptainer to execute during the container build step are provided in the `%post` section of the definition file.

### Setting up non-interactive installation

First, you may need to instruct programs that you are executing commands in a non-interactive environment.
There can be issues with installing packages in a container that would not normally occur when installing manually in the terminal. 

On the HTC system in particular, the `/tmp` directory inside of the container needs to be given global read/write permissions.
This can be done by adding the following line at the start of the `%post` section:

```
   chmod 777 /tmp
```

Similarly, some packages require that the user answer interactive prompts for selecting various options.
Since the Apptainer build is non-interactive, this can cause the package installation to hang.
While this isn't an issue in the present example, the issue can be avoided by adding the following line near the start of the `%post` section:

```
   DEBIAN_FRONTEND=noninteractive
```

Note that this particular command only applies to Debian-based container images, such as Ubuntu.

The `image.def` so far looks like this:

```
Bootstrap: docker
From: ubuntu:22.04

%post
    chmod 777 /tmp
    DEBIAN_FRONTEND=noninteractive
```

### Install dependencies

First, you should install the dependencies that your program requires.

Following the [program's instructions](https://sumo.dlr.de/docs/Installing/Linux_Build.html), we can do install the dependencies with the following set of commands.

```
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

Note that we are using the built-in package manager (`apt`) of Ubuntu, since that is the base operating system we chose to build on top of.
If you choose a different operating system, you may need to use a different package manager.

In this case, the first command is `apt-get update` which will update the list of available packages.
This is necessary to get the latest versions of the packages in the following `apt-get install` command.

The `apt-get install` command will install the dependencies required by the SUMO program.

> Note that these installation commands do not use `sudo`, as Apptainer already has permissions to install programs in the container.

The `image.def` file now looks like this:

```
Bootstrap: docker
From: ubuntu:22.04

%post
    chmod 777 /tmp
    DEBIAN_FRONTEND=noninteractive

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

#### Compile the program

After installing the dependencies, you can provide the commands for actually compiling your program.

We now add the commands for compiling the SUMO program itself:

```
git clone --recursive https://github.com/eclipse/sumo
export SUMO_HOME=/sumo
mkdir sumo/build/cmake-build && cd sumo/build/cmake-build
cmake ../..
make
```

The `%post` section is now complete and will install SUMO and its dependencies in the container at build time.

The `image.def` file now looks like this:

```
Bootstrap: docker
From: ubuntu:22.04

%post
    chmod 777 /tmp
    DEBIAN_FRONTEND=noninteractive

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
    export SUMO_HOME=/sumo
    mkdir sumo/build/cmake-build && cd sumo/build/cmake-build
    cmake ../..
    make
```

## 3. Add Environment Variables

While the `%post` section now contains all of the instructions for installing and compiling your desired program, 
you likely need to add commands for setting up the environment so that the shell recognizes your program.
This is typically the case if your program compiled successfully but you still get a "command not found" error when you try to execute it.

To set environment variables automatically when your container runs, you need to add them to the `%environment` section before you build the container.

For example, in the `%post` section there is the command `export SUMO_HOME=/sumo`, which sets the environment variable `SUMO_HOME` to the location of the `sumo` directory.
This environment variable, however, is only active during the installation phase of the container build, and will not be set when the container is actually run.
Thus, we need to set `SUMO_HOME` and update `PATH` with the location of the SUMO `bin` folder by using the `%environment` section.

We therefore add the following lines to the `image.def` file:

```
%environment
    export SUMO_HOME=/sumo
    export PATH=/sumo/bin:$PATH
```

These environment variables will be set when the container starts, so that the `sumo` command is automatically found when we try to execute it.

## Summary

The full `image.def` file for this advanced example is now:

```
Bootstrap: docker
From: ubuntu:22.04

%post
    chmod 777 /tmp
    DEBIAN_FRONTEND=noninteractive

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
    export SUMO_HOME=/sumo
    mkdir sumo/build/cmake-build && cd sumo/build/cmake-build
    cmake ../..
    make

%environment
    export SUMO_HOME=/sumo
    export PATH=/sumo/bin:$PATH
```

We can now build the container using this definition file.

- For more information on the components of an Apptainer definition (`.def`) file and container image file (`.sif`), see our [Building an Apptainer Container](apptainer-build.html) guide.
- For information on building and using the container on the HTC system, see our [Use Apptainer Containers](apptainer-htc.html) guide.