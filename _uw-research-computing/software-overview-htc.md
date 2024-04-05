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
While our High Throughput system has little in the way of pre-installed software, 
we've created resources to help users set up the software they want to use for running their jobs.

{% capture content %}

[Quickstart](#quickstart)

[CHTC Recipes Repository](#chtc-recipes-repository)

[Containers](#containers)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Quickstart

Click the link in the table below to jump to the instructions for the language/program/software that you want to use.
More information is provided in the [CHTC Recipes Repository](#chtc-recipes-repository) and [Containers](#containers) sections.

<table>
    <tr>
        <td><a href="#java">Java</a></td>
        <td><a href="#julia">Julia</a></td>
        <td><a href="#matlab">Matlab</a></td>
    </tr>
    <tr>
        <td><a href="#miniconda">Miniconda</a></td>
        <td><a href="#python">Python</a></td>
        <td><a href="#r-lang">R</a></td>
    </tr>
</table>

## CHTC Recipes Repository

CHTC provides examples for software and workflows for use on our systems in our "Recipes" repository on Github: 
[https://github.com/CHTC/recipes](https://github.com/CHTC/recipes).

## Containers

Many of the recipes in our Recipes repository involve building your own container. 
In this section, we provide a brief introduction into how to use containers for setting up your own software to run on the High Throughput system.

### Container Types

#### Docker

#### Apptainer

### Use an Existing Container

### Build Your Own Container

## Java

## Julia

## Matlab

## Miniconda

## Python

### Quickstart<a name="python-quickstart"></a>

To use Python 3 on the HTC system, we recommend that you use an existing container, or build your own with the version and packages that you want to use.

To use an existing container with a base installation of python, follow the [instructions above](#use-an-existing-container) and choose from one of these sources: 

* [OSG Base Containers](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/#base)
* [DockerHub Python Containers](https://hub.docker.com/_/python)

To build your own container with the version and packages that you want, follow the [instructions above](#build-your-own-container) and use one of the following example [Recipes](#chtc-recipes-repository):

* [Base python](https://github.com/CHTC/recipes/tree/main/software/Python/base-python)
* [Python with numpy](https://github.com/CHTC/recipes/tree/main/software/Python/numpy)
* [Python with scipy](https://github.com/CHTC/recipes/tree/main/software/Python/scipy)

See also: [Miniconda](#miniconda)

[Back to Top](#top)

### More information<a name="python-info"></a>

All CHTC machines have a base installation of Python 3.
The exact versions and packages installed, however, can vary from machine to machine.
You should be able to include simple python commands in your calculations, i.e., `python3 simple-script.py`.

If you need a specific version of Python 3 or would like to install your own packages, we recommend that you use a container as described above.

The example recipes provided above for building your own container are intended for python packages that can be installed using `python3 -m pip install`. 
Additional software can be installed when building your own container.

For packages that need to be installed with `conda install`, see the section on [Miniconda](#miniconda). 

## R



