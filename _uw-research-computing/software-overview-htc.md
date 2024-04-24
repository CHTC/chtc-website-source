---
highlighter: none
layout: guide
title: "Overview: Software"
guide:
    order: 0
    category: Software Solutions
    tag:
        - htc
---

<a name="top"></a>
In order to run jobs on the High Throughput Computing (HTC) system, researchers need to set up their software on the system. 
This guide introduces how to build software in a container (our recommended strategy), links to a repository with a selection of software installation “recipes”, and quick links to common software packages and their installation recommendations. 

{% capture content %}

[Quickstart](#quickstart)

[Recipes](#recipes)

[Containers](#containers)

[Software](#software)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

---

## Quickstart

Click the link in the table below to jump to the instructions for the language/program/software that you want to use.
More information is provided in the [CHTC Recipes Repository](#recipes) and [Containers](#containers) sections.

<table>
    <tr>
        <td><a href="#java">Java</a></td>
        <td><a href="#julia">Julia</a></td>
        <td><a href="#matlab">Matlab</a></td>
    </tr>
    <tr>
        <td><a href="#miniconda">Miniconda</a></td>
        <td><a href="#python">Python</a></td>
        <td><a href="#r">R</a></td>
    </tr>
</table>

---

## Recipes

CHTC provides specific examples for software and workflows for use on our systems in our "Recipes" repository on Github: 
[https://github.com/CHTC/recipes](https://github.com/CHTC/recipes).

Links to specific recipes are used in the [Software](#software) section for certain softwares and coding languages.

---

## Containers

Many of the recipes in our Recipes repository involve building your own container. 
In this section, we provide a brief introduction into how to use containers for setting up your own software to run on the High Throughput system.

### What is a Container?

*"A container is a standard unit of software that packages up code and all its dependencies so the application runs quickly and reliably from one computing environment to another."* 
-- [Docker](https://www.docker.com/resources/what-container/)

A container is a portable, self-contained operating system and can be easily executed on different computers regardless of their operating systems or programs.
When building the container you can choose the operating system you want to use, and can install programs as if you were the owner of the computer.

While there are some caveats, containers are useful for deploying software on shared computing systems like CHTC, where you do not have permission to install programs directly.

*"You can build a container using Apptainer on your laptop, and then run it on many of the largest HPC clusters in the world, local university or company clusters, a single server, in the cloud, or on a workstation down the hall."*
-- [Apptainer](https://apptainer.org/docs/user/main/introduction.html)

> *What is a Container* ***Image***? <a name="what-is-container-image"></a>
> 
> A "container image" is the persistent, on-disk copy of the container. 
> When we talk about building or moving or distributing a container, we're actually talking about the file(s) that constitute the container. 
> When a container is "running" or "executed", the container image is used to create the run time environment for executing the programs installed inside of it.

### Container Technologies

There are two container technologies supported by CHTC: [Docker](https://www.docker.com/) and [Apptainer](https://apptainer.org/).
Here we briefly discuss the advantages of each.

#### Docker <a name="docker-info"></a>

[https://www.docker.com/](https://www.docker.com/)

Docker is a commercial container technology for building and distributing containers.
Docker provides a platform for distributing containers, called [Docker Hub](https://hub.docker.com/).
Docker Hub can make it easy to share containers with colleagues without having to worry about the minutiae of moving files around. 

On the HTC system, you can provide the name of your Docker Hub container in your submit file, 
and HTCondor will automatically pull (download) the container and use it to create the software environment for executing your job.
Unfortunately, however, you are unable to build a Docker container and upload it to Docker Hub from CHTC servers, 
so your container must already exist on Docker Hub in a public repository.
This requires that you have Docker installed on your computer so that you can build the container and upload it to Docker Hub.

#### Apptainer <a name="apptainer-info"></a>

[https://apptainer.org/](https://apptainer.org/)

Apptainer is an open-source container technology for building containers. 
Apptainer creates a single, stand-alone file that is the ([container image](#what-is-container-image)).
As long as you have the container image file, you can use Apptainer to run your container.

On the HTC system, you can provide the name of your Apptainer file in your submit file,
and HTCondor will use a copy of it to create the software environment for executing your job.
You can use Apptainer to build the container image file on CHTC servers, so there is no need to install the container software on your own computer.

### Use an Existing Container

If you or a colleague have already built a container for use on CHTC, it is fairly straightforward to modify your jobs to use the container environment as discussed below.

#### Use a Docker container

*Full Guide*: [Running HTC Jobs Using Docker Containers](docker-jobs.html)

If the container you want to use is hosted on Docker Hub, find the container "address" and provide it in your submit file.
The address typically has the convention of `user/repository:tag`, though official repositories such as Python are just `repository:tag`.
In your submit file, use

```
container_image = docker://user/repository:tag
```
{:.sub}

If the container you want to use is hosted in a different container registry, there should still be a container "address" to use,
but now there will be a website prefix.

```
container_image = docker://registry_address/user/repository:tag
```
{:.sub}

For example, to use a container from the [NVIDIA Container Registry](https://catalog.ngc.nvidia.com/containers) (`nvcr`), 
you would have `docker://nvcr.io/nvidia/repository:tag`.

[Back to Top](#top)

#### Use an Apptainer container

*Full Guide*: [Use Apptainer Containers](apptainer-htc.html)

For historical reasons, the Apptainer container file has the file extension `.sif`. 
The syntax for giving HTCondor the name of the container file depends on where it is located on the CHTC system.

If the `.sif` file is in a **`/home` directory**:

```
container_image = path/to/my-container.sif
```
{:.sub}

If the `.sif` file is in a **`/staging` directory**:

```
container_image = file:///staging/path/to/my-container.sif
```
{:.sub}

If the `.sif` file is **in a `/staging` directory AND you are using `+WantFlocking` or `+WantGliding`**:

```
container_image = osdf:///chtc/staging/path/to/my-container.sif
```
{:.sub}

[Back to Top](#top)

### Build Your Own Container

You can build your own container with the operating system and software that you want to use.
The general process is the same whether you are using Docker or Apptainer.

1. **Consult your software's documentation** 
   
   Determine the requirements for installing the software you want to use.
   In particular you are looking for (a) the operating systems it is compatible with and (b) the prerequisite libraries or packages.

2. **Choose a base container** 

   The base container should at minimum use an operating system compatible with your software. 
   Ideally the container you choose also has many of the prerequisite libraries/programs already installed.

3. **Create your own definition file**

   The definition file contains the installation commands needed to set up your software.
   (The structure of the container "definition" file differs between Docker and Apptainer, but it is fairly straightforward to translate between the two.)

4. **Build the container**

   Once the definition file has been written, you must "build" the container. 
   The computer you use to build the container will run through the installation commands, almost as if you were actually installing the software on that computer,
   but will save the results into the container file(s) for later use.

5. **Distribute the container**

   To use the container on CHTC servers, you'll need to distribute the container to right location.
   For Docker containers, this means "pushing" the container to Docker Hub or similar container registry.
   For Apptainer containers, this typically means copying the container `.sif` file to the [/staging system](file-avail-largedata.html).

You can then use the container following the [instructions above](#use-an-existing-container).

> A common question is whether the software installation process is repeated each time a container is used. 
> The answer is "no". 
> The software installation process only occurs when the container is actually being built.
> Once the container has been built, no changes can be made to the container when being used (on CHTC systems).

#### Build your own Docker container

Please follow the instructions in our guide [Build a Docker Container Image](docker-build.html) to build your own container using Docker.
As mentioned above, you will need to have Docker installed on your own computer.
This is so that you can push the completed container to Docker Hub.

*You are unable to push containers from CHTC to Docker Hub, so please do not build Docker containers using CHTC!*

#### Build your own Apptainer container

Please follow the instructions in our guide [Use Apptainer Containers](apptainer-htc.html) to build your own container using Apptainer.
You can use CHTC servers to build the container, so there is no need to install any software on your computer.

[Back to Top](#top)

---

## Software

The following sections cover how to deploy specific softwares and coding langauges on the HTC system. 

<table>
    <tr>
        <td><a href="#java">Java</a></td>
        <td><a href="#julia">Julia</a></td>
        <td><a href="#matlab">Matlab</a></td>
    </tr>
    <tr>
        <td><a href="#miniconda">Miniconda</a></td>
        <td><a href="#python">Python</a></td>
        <td><a href="#r">R</a></td>
    </tr>
</table>

> Note: we are planning to move each section to a standalone webpage in the future, but they will still be linked through this webpage.

## Java

### Quickstart<a name="java-quickstart"></a>

To use Java on the HTC system, we recommend that you use the Java Development Kit (JDK). 

1. Obtain a copy of the pre-compiled JDK for "Linux/x64" from [https://jdk.java.net/](https://jdk.java.net/).

2. Include the JDK `.tar.gz` file in your submit file with the list of files to be transferred:

   ```
   transfer_input_files = openjdk-22_linux-x64_bin.tar.gz, program.jar
   ```
   {:.sub}

3. Include instructions for using the JDK in your `executable` file:

   ```
   #!/bin/bash

   tar -xzf openjdk-22_linux-x64_bin.tar.gz
   export JAVA_HOME=$PWD/jdk-22
   export PATH=$JAVA_HOME/bin:$PATH

   java -jar program.jar
   ```

[Back to Top](#top)

### More information<a name="java-info"></a>

To obtain your copy of the Java Development Kit (JDK), go to [https://jdk.java.net/](https://jdk.java.net/).
Click the link for the JDK that is "Ready for use".
There will be a download link "tar.gz" under the "Builds" section for "Linux/x64".
You can then either (a) right-click the download link and copy the link address, sign in to the submit server, and use the `wget` command with that link, 
or (b) click the link to download to your computer, then manually upload the file from your computer to the submit server.

The example above uses file names for JDK 22 as of 2024-04.
Be sure to change the file names for the version that you actually use.
We recommend that you test and explore your setup using an [interactive job](inter-submit.html).

#### Executable<a name="java-executable"></a>

A bash `.sh` file is used as the `executable` file in order to unpack and set up the JDK environment for use by your script.
Here is the executable from the [Quickstart](#java-quickstart) section with comments:

```
#!/bin/bash

# Decompress the JDK
tar -xzf openjdk-22_linux-x64_bin.tar.gz

# Add the new JDK folder to the bash environment
export JAVA_HOME=$PWD/jdk-22
export PATH=$JAVA_HOME/bin:$PATH

# Run your program
java -jar program.jar
```

## Julia

### Quickstart<a name="julia-quickstart"></a>

#### Option A (recommended)<a name="julia-quickstart-a"></a>

Build a container with Julia & packages installed inside:

1. [How to build your own container](#build-your-own-container)
2. [Example container recipes for Julia](https://github.com/CHTC/recipes/tree/main/software/Julia)
3. [Use your container in your HTC jobs](#use-an-existing-container)

#### Option B<a name="julia-quickstart-b"></a>

Use a portable copy of Julia and create your own portable copy of your Julia packages:

1. Follow the instructions in our guide [Run Julia Jobs](julia-jobs.html). 

> Option B may be sensitive to the operating system of the execution point.
> If you run into issues, we recommend using Option A instead.

[Back to Top](#top)

### More information<a name="julia-info"></a>

No CHTC machine has Julia pre-installed, so you **must** configure a portable copy of Julia to work on the HTC system.
Using a container as described above is the easiest way to accomplish this.

#### Executable

When using a container, you can use a `.jl` script as the submit file `executable`, provided that the first line (the "shebang") in the `.jl` file is

```
#!/usr/bin/env julia
```

with the rest of the file containing the commands you want to run using Julia.

Alternatively, you can use a bash `.sh` script as the submit file `executable`, and in that file you can use the `julia` command:

```
#!/bin/bash

julia my-script.jl
```

In this case, remember to include your `.jl` file in the `transfer_input_files` line of your submit file.

#### Arguments

For more information on passing arguments to a Julia script, see the 
[Julia documentation](https://docs.julialang.org/en/v1/manual/command-line-interface/#Using-arguments-inside-scripts).

## Matlab

### Quickstart<a name="matlab-quickstart"></a>

Build a container with Matlab & toolboxes installed inside:

1. [How to build your own container](#build-your-own-container)
2. [Example container recipes for Matlab](https://github.com/CHTC/recipes/tree/main/software/Matlab)
3. [Use your container in your HTC jobs](#use-an-existing-container)

> **Note**: Because Matlab is a licensed software, you **must** add the following line to your submit file:
> 
> ```
> concurrency_limits = MATLAB:1
> ```
> {:.sub}
> 
> Failure to do so may cause your or other users' jobs to fail to obtain a license from the license server.

[Back to Top](#top)

### More information<a name="matlab-info"></a>

CHTC has a site license for Matlab that allows for up to 10,000 jobs to run at any given time across *all CHTC users*. 
Hence the requirement for adding the line `concurrency_limits = MATLAB:1` to your submit files, so that HTCondor can keep track of which jobs are using or will use a license.

Following the instructions above, you are able to install a variety of Matlab Toolboxes when building the container.
The Toolboxes available for each supported version of Matlab are described here: https://github.com/mathworks-ref-arch/matlab-dockerfile/blob/main/mpm-input-files/.
Navigate to the text file for the version of interest, and look at the section named "INSTALL PRODUCTS".
The example recipes linked above provide instructions on how to specify the packages you want to install when building the container.

#### Executable<a name="matlab-executable"></a>

When using the Matlab container, we recommend the following process for executing your Matlab commands in an HTCondor job:

1. Put your Matlab commands in a `.m` script. For this example, we'll call it `my-script.m`.

2. Create the file `run-matlab.sh` with the following contents:
   
   ```
   #!/bin/bash
   
   matlab -batch "my-script"
   ```

   Note that in the script, the `.m` extension has been dropped from the file name (uses `"my-script"` instead of `"my-script.m"`).

3. In your submit file, set the `.sh` script as the executable and list the `.m` file to be transferred:

   ```
   executable = run-matlab.sh
   transfer_input_files = my-script.m
   ```
   {:.sub}

#### Arguments<a name="matlab-arguments"></a>

To pass arguments from the submit file to your `.m` script, you need to set up your executable `.sh` file to create an additional `.m` file with the desired variable definitions.
For example, to use an argument to define a different value of `data_file` for each job, you would use the following executable:

```
#!/bin/bash

cat << EOF > variables.m
data_file = '${1}'
EOF

matlab -batch "variables;my-script"

rm variables.m
```

The `variables.m` file is created with `data_file` defined as the value passed from the submit file `arguments` line.
Then when matlab is started, it first loads the definitions from the `variables.m` line before executing your main `my-script.m`.
(Of course, for this to be useful, the code in `my-script.m` needs to use the variable `data_file` to do something.)
Finally, the temporary `variables.m` file is removed so that it is not brought back to the submit server when the job completes.

More than one variable can be defined.
For example, if we wanted to add the variable `x`, we would use this:

```
cat << EOF > variables.m
data_file = '${1}'
x = ${2}
EOF
```

where the values of `data_file` and `x` will correspond to the first and second values of the submit file `arguments` line, respectively.

## Miniconda

### Quickstart<a name="miniconda-quickstart"></a>

#### Option A (recommended)<a name="miniconda-quickstart-a"></a>

Build a container with Conda packages installed inside:

1. [How to build your own container](#build-your-own-container)
2. [Example container recipes for Conda](https://github.com/CHTC/recipes/tree/main/software/Conda)
3. [Use your container in your HTC jobs](#use-an-existing-container)

#### Option B<a name="miniconda-quickstart-b"></a>

Create your own portable copy of your Conda packages:

1. Follow the instructions in our guide [Use Conda Environments to Run Python Jobs](conda-installation.html)

> Option B may be sensitive to the operating system of the execution point, and not all conda packages can be made portable using this process.
> If you run into issues, we recommend using Option A instead.

[Back to Top](#top)

### More information<a name="miniconda-info"></a>

The above instructions are intended for if you have package(s) that need to be installed using `conda install`. 
Miniconda can be used to install Python and R and corresponding packages. 
But if you only need to install Python or R, and do not otherwise need to use a `conda install` command to set up the packages, 
you should see our instructions for setting up [Python](#python) or [R](#r) because there is less chance of obscure errors when building your container.

When building or using a Miniconda container, you do not need to create or activate a conda environment.
For the build process, you skip directly to the `conda install` commands you want to run.
Similarly, when executing a script in a Miniconda container, the packages are loaded when the container starts.

#### Executable

If you are planning to execute a python `.py` script using your Miniconda container, you can follow the instructions in the [Python Executable](#python-executable) section.

If you are planning to execute a `.R` script using your Miniconda container, you can follow the instructions in the [R Executable](#r-executable) section.

Otherwise, you can use a bash `.sh` script as the submit file `executable`:

```
#!/bin/bash

<your commands go here>
```

where the contents of the file are the commands that you want to execute using your conda environment.
You do not and should not try to activate the conda environment in the executable if you are using a container.

## Python

### Quickstart<a name="python-quickstart"></a>

#### Option A (recommended)<a name="python-quickstart-a"></a>

Build a container with Python & packages installed inside:

1. [How to build your own container](#build-your-own-container)
2. [Example container recipes for Python](https://github.com/CHTC/recipes/tree/main/software/Python/)
3. [Use your container in your HTC jobs](#use-an-existing-container)

#### Option B<a name="python-quickstart-b"></a>

Use an existing container with a base installation of Python:

1. Choose an existing container. See 
   [OSG Base Containers](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/#base)
   or
   [DockerHub Python Containers](https://hub.docker.com/_/python).
2. [Use the container in your HTC jobs](#use-an-existing-container)

[Back to Top](#top)

### More information<a name="python-info"></a>

All CHTC machines have a base installation of Python 3.
The exact versions and packages installed, however, can vary from machine to machine.
You should be able to include simple python commands in your calculations, i.e., `python3 simple-script.py`.

If you need a specific version of Python 3 or would like to install your own packages, we recommend that you use a container as described above.

The example recipes provided above for building your own container are intended for python packages that can be installed using `python3 -m pip install`. 
Additional software can be installed when building your own container.

For packages that need to be installed with `conda install`, see the section on [Miniconda](#miniconda). 

#### Executable<a name="python-executable"></a>

When using a container, you can use a python `.py` script as the submit file `executable`, provided that the first line (the "shebang") in the `.py` file is

```
#!/usr/bin/env python3
```

with the rest of the file containing the commands that you want to run using Python.

Alternatively, you can use a bash `.sh` script as the submit file `executable`, and in that file you can use the `python3` command:

```
#!/bin/bash

python3 my-script.py
```

In this case, remember to include your `.py` file in the `transfer_input_files` line of your submit file.

## R

### Quickstart<a name="r-quickstart"></a>

#### Option A (recommended)<a name="r-quickstart-a"></a>

Build a container with Python & packages installed inside:

1. [How to build your own container](#build-your-own-container)
2. [Example container recipes for R](https://github.com/CHTC/recipes/tree/main/software/R/)
3. [Use your container in your HTC jobs](#use-an-existing-container)

#### Option B<a name="r-quickstart-b"></a>

Use an existing container with a base installation of R:

1. Choose an existing container. See 
   [OSG R containers](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/#:~:text=R%20(opensciencegrid/osgvo%2Dr))
   or 
   [Rocker R containers](https://rocker-project.org/images/).
2. [Use the container in your HTC jobs](#use-an-existing-container)

[Back to Top](#top)

### More information<a name="r-info"></a>

No CHTC machine has R pre-installed, so you **must** configure a portable copy of R to work on the HTC system.
Using a container as described above is the easiest way to accomplish this.

#### Executable<a name="r-executable"></a>

When using a container, you can use a `.R` script as the submit file `executable`, provided that the first line (the "shebang") in the `.R` file is

```
#!/usr/bin/env Rscript
```

with the rest of the file containing the commands that you want to run using R.

Alternatively, you can use a bash `.sh` script as the submit file `executable`, and in that file you can use the `Rscript` command:

```
#!/bin/bash

Rscript my-script.R
```

In this case, remember to include your `.R` file in the `transfer_input_files` line of your submit file.
