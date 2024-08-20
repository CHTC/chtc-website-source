---
highlighter: none
layout: guide
title: "Overview: How to Use Software"
guide:
    order: 0
    category: Software Solutions
    tag:
        - htc
        - bold
---
<script type="text/javascript" src="{{ '/assets/js/pages/software-overview.js' | relative_url }}" defer></script>

<a name="top"></a>
In order to run jobs on the High Throughput Computing (HTC) system, researchers need to set up their software on the system. 
This guide introduces how to build software in a container (our recommended strategy), links to a repository with a selection of software installation “recipes”, and quick links to common software packages and their installation recommendations. 

{% capture content %}

[Quickstart](#quickstart)

[Recipes](#recipes)

[Containers](#containers)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Quickstart

Click the link in the table below to jump to the instructions for the language/program/software that you want to use.
More information is provided in the [CHTC Recipes Repository](#chtc-recipes-repository) and [Containers](#containers) sections.

<div class="shadow p-3 border rounded">
    <div class="row gx-1">
        {% assign pages = site.uw-research-computing | where_exp: "x", "x.software_icon.size > 0" %}
        {% for page in pages %}
             <div class="col col-6 col-md-2">
             <button class="btn btn-guide mb-lg-0 {% if forloop.first %}btn-guide-highlighted{% endif %}" href="#quickstart" onclick="showExcerpt('{{ page.title | slugify }}', 'side-divider')"><img class="img-btn-guide" src="{{ page.software_icon }}" alt="{{ page.title }}">{{ page.software }}</button>
             </div>
        {% endfor %}
    </div>
    <div class="card-body side-divider" style="display: block;">
        {% for page in pages %}
            <div class="excerpt" id="{{ page.title | slugify }}" style="display: {% if forloop.first %}block{% else %}none{% endif %};">
                {{ page.excerpt | markdownify }}
                <a href="{{ page.url }}" style="font-weight: bold; text-decoration: underline;">More Information</a>
            </div>
        {% endfor %}
    </div>
</div>

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
