---
highlighter: none
layout: guide
title: "Overview: How to Use Software"
guide:
    category: Software
    tag:
        - htc
        - bold
---
<script type="text/javascript" src="{{ '/assets/js/pages/software-overview.js' | relative_url }}" defer></script>

<a name="top"></a>
In order to run jobs on the High Throughput Computing (HTC) system, researchers need to set up their software on the system. 
This guide introduces how to build software in a container (our recommended strategy), links to a repository with a selection of software installation “recipes”, and quick links to common software packages and their installation recommendations. 

{% capture content %}

- [Start here](#start-here)
- [Quickstart by software type](#quickstart-by-software-type)
- [What approach should I use?](#what-approach-should-i-use)
- [Container Overview](#container-overview)
- [Related pages](#related-pages)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Start Here

For most CHTC users, we recommend using a container for your software environment. 
A container is a portable, self-contained operating system and can be easily executed on different computers. When building the container you can choose the operating system you want to use, and can install programs as if you were the owner of the computer.

<p style="text-align:center"><img src="/images/container-analogy-infographic2.png" width=800></p>

In general, if you have not used containers before, we recommend using Apptainer 
containers. 

<div class="d-flex mb-3">
	<div class="p-3 m-auto">
		<a class="btn btn-primary" href="apptainer-htc.html">Use Custom Software in Jobs Using Apptainer</a>
	</div>
</div>

* For more specific guidance about *your* software, see: [Quickstart by software type](#quickstart-by-software-type)
* For more guidance in whether jumping right into Apptainer is best for you: 
 [What approach should I use?](#what-approach-should-i-use)
* To learn more about containers in general see: [Containers](#container-overview)

## Quickstart by software type

Click the link in the table below to jump to the instructions for the language/program/software that you want to use, and then click on "More Information."

<div class="shadow p-3 border rounded">
    <div class="row gx-1">
        {% assign pages = site.uw-research-computing | where_exp: "x", "x.software_icon.size > 0" %}
        {% for page in pages %}
            <div class="col col-6 col-md-2">
               <button class="btn btn-guide mb-lg-0 d-flex flex-column {% if forloop.first %}btn-guide-highlighted{% endif %}" href="#quickstart" onclick="showExcerpt('{{ page.title | slugify }}', 'side-divider')">
                  <img class="img-btn-guide mx-auto" src="{{ page.software_icon }}" alt="{{ page.title }}">
                  <span class="mx-auto">{{ page.software }}</span>
               </button>
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

## What approach should I use? 

We recommend using containers for jobs in CHTC for a number of reasons, detailed 
[below](#why-use-containers). 

There are two container implementations we support, Docker and Apptainer. 

<div class="d-flex mb-3">
	<div class="p-3 m-auto">
		<a class="btn btn-primary" href="docker-jobs.html">Use Docker in Jobs</a>
		<a class="btn btn-primary" href="apptainer-htc.html">Use Apptainer in Jobs</a>
	</div>
</div>

We recommend using Apptainer as a first choice because you can build the container 
on our servers and it has some features that allow it to be used on a greater variety 
of computing nodes. 

However, there are many good reasons to use Docker (or Apptainer) depending on your 
circumstances. Here is a list of things to consider when deciding which path to take. 

* If your software has an existing Docker or Apptainer/Singularity implementation, use that. 
* If you or your group have an existing Docker container, use Docker. 
* If you already know how to use Docker or Apptainer/Singularity, use whichever you are familiar with. 
* If you want to create a container that can run both on CHTC and your own computer, use Docker. 
* If you want to create a container that you and collaborators can use on your own computers and CHTC, use Docker.
* If you want to keep your container more private, use Apptainer. 

In certain cases, it is reasonable to use a non-container option for software installation, especially when using a package manager like `conda`. 

If you are not sure what to choose, talk to the facilitation team! That's why we're here. 


## Container overview

In this section, we provide a brief introduction into what containers are, 
why we recommend them, and a big picture view of how to use them on our High Throughput system.

### What is a container?

*"A container is a standard unit of software that packages up code and all its dependencies so the application runs quickly and reliably from one computing environment to another."* 
-- [Docker](https://www.docker.com/resources/what-container/)

A container is a portable, self-contained operating system and can be easily executed on different computers regardless of their operating systems or programs.
When building the container you can choose the operating system you want to use, and can install programs as if you were the owner of the computer.

<p style="text-align:center"><img src="/images/container-analogy-infographic1.png" width=800></p>

As an analogy, you could consider a container to be like a camping backpack. Every time you plan to use it, you will need a standard set of gear, which you could pre-pack. Other items, like maps, food, or fuel would depend on where you're going, but you would still have access to the standard gear.

In the same way, you build a container image by installing your software and any additional dependencies. Jobs that use containers can differ in their tasks or data, but they still have access to the installed software and environment.

<p style="text-align:center"><img src="/images/container-analogy-infographic2.png" width=800></p>

While there are some caveats, containers are useful for deploying software on shared computing systems like CHTC, where you do not have permission to install programs directly.

*"You can build a container using Apptainer on your laptop, and then run it on many of the largest HPC clusters in the world, local university or company clusters, a single server, in the cloud, or on a workstation down the hall."*
-- [Apptainer](https://apptainer.org/docs/user/main/introduction.html)

> *What is a Container* ***Image***? <a name="what-is-container-image"></a>
> 
> A "container image" is the persistent, on-disk copy of the container. 
> When we talk about building or moving or distributing a container, we're actually talking about the file(s) that constitute the container. 
> When a container is "running" or "executed", the container image is used to create the run time environment for executing the programs installed inside of it.

### Why use containers? 

We recognize that learning about containers is its own challenge! However, we have found 
in the long run, that containers provide the best long-term user experience when running 
jobs in CHTC, including: 

- a consistent environment no matter what computer your job runs on
- a consistent environment with stable software versions (good for reproducibility)
- ability to fully customize the software installation

Our goal is to make finding or building your container as easy as possible, so you 
can have most of these benefits, without too much pain. 

### Using containers on CHTC

If you have a container, adding it to your job is easy! It's just one more line 
in the submit file. The challenge is usually getting a container that has what you need. 
There are typically two ways of doing so: 

1. Find an existing container 
1. Build your own container image

#### Find an existing container image

These tips from 
[Software Carpentry's Docker materials](https://carpentries-incubator.github.io/docker-introduction/docker-hub.html) 
are a good starting point for choosing useful, trusted container images online. 

> These are some indicators that a container image on Docker Hub is consistently maintained, functional and secure:
> * The container image is updated regularly.
> * The container image associated with a well established company, community, or other group that is well-known.
> * There is a Dockerfile or other listing of what has been installed to the container image.
> * The container image page has documentation on how to use the container image.

#### Build your own container image

To build your own container, the process will include: 

1. Writing a build file, called either a `Dockerfile` or definition (`.def`) file.
	* Consult your software's documentation
	* Choose an existing base container
	* Add the details needed for your software
	* Leverage CHTC's [recipes repository](https://github.com/CHTC/recipes)
1. (If using Apptainer: starting an interactive session on a CHTC build server)
1. Running a command to "build" the container image, using your build file as the 
template for doing so
1. Running a command to put the container in a location where you can use it in your jobs. 

These guides talk about how to do the above steps for either Apptainer or Docker. 
- [Use Custom Software in Jobs Using Apptainer](apptainer-htc)
- [Running HTC Jobs Using Docker Containers](docker-jobs)

> A common question is whether the software installation process is repeated each time a container is used. 
> The answer is "no". 
> The software installation process only occurs when the container is actually being built.
> Once the container has been built, no changes can be made to the container when being used (on CHTC systems).

### Container build recipes

If you need to create your own build file, CHTC provides many specific examples 
in our "Recipes" repository on Github: 
[https://github.com/CHTC/recipes](https://github.com/CHTC/recipes).

Links to specific recipes are used in the [Software](#software) section for certain softwares and coding languages.

### Container technologies

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



## Related Pages

- [Use Custom Software in Jobs Using Apptainer](apptainer-htc)
- [Running HTC Jobs Using Docker Containers](docker-jobs)
- [Using Apptainer Containers on HPC](apptainer-hpc.html)
