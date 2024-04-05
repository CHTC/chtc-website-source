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

### Quickstart<a name="java-quickstart"></a>

[Back to Top](#top)

### More information<a name="java-info"></a>

## Julia

### Quickstart<a name="julia-quickstart"></a>

[Back to Top](#top)

### More information<a name="julia-info"></a>

## Matlab

### Quickstart<a name="matlab-quickstart"></a>

[Back to Top](#top)

### More information<a name="matlab-info"></a>

## Miniconda

### Quickstart<a name="miniconda-quickstart"></a>

To use Miniconda environments on the HTC system, we recommend that you build your own container following the [instructions above](#build-your-own-container) 
and use our example [Miniconda Recipe](https://github.com/CHTC/recipes/tree/main/software/Miniconda) in our [recipes repository](#chtc-recipes-repository):

* [Miniconda](https://github.com/CHTC/recipes/tree/main/software/Miniconda/miniconda)

Alternatively, you could follow our old process for creating a portable copy of a conda environment, as described in our guide 
[Use Conda Environments to Run Python Jobs](conda-installation.html). Note, however, that this process may be sensitive to the 
operating system of the execution point, and not all conda packages can be made portable using this process.

See also: [Python](#python), [R](#r)

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

To use Python 3 on the HTC system, we recommend that you use an existing container, or build your own with the version and packages that you want to use.

To use an existing container with a base installation of python, follow the [instructions above](#use-an-existing-container) and choose from one of these sources: 

* [OSG Base Containers](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/#base)
* [DockerHub Python Containers](https://hub.docker.com/_/python)

To build your own container with the version and packages that you want, follow the [instructions above](#build-your-own-container) 
and use one of the example [Python Recipes](https://github.com/CHTC/recipes/tree/main/software/Python/) in our [recipes repository](#chtc-recipes-repository):

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

To use R on the HTC system, we recommend that you use an existing container, or build your own with the version and packages that you want to use.

To use an existing container with a base installation of R, follow the [instructions above](#use-an-existing-container) and choose from one of these sources:

* [OSG R containers](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/#:~:text=R%20(opensciencegrid/osgvo%2Dr))
* [Rocker R containers](https://rocker-project.org/images/)

To build your own container with the version and packages that you want, follow the [instructions above](#build-your-own-container) 
and use one of the following example [R Recipes](https://github.com/CHTC/recipes/tree/main/software/R/) in our [recipes repository](#chtc-recipes-repository):

* [Base R](https://github.com/CHTC/recipes/tree/main/software/R/base-r)
* [R with tidyverse](https://github.com/CHTC/recipes/tree/main/software/R/tidyverse)
* [R with geospatial packages](https://github.com/CHTC/recipes/tree/main/software/R/geospatial)

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
