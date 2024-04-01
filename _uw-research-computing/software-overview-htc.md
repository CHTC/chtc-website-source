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
        <td><a href="#python">Python</a></td>
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

### Find an Existing Container

### Build Your Own Container

## Python

To use Python 3 on the HTC system, use an existing container or build your own with the version and packages that you want to use.

<!--Replace ALL occurrences of accordionExample in this dropdown with a unique string id dropdown-->
<!--For instance if this is for a python item you could replace it with `python`-->

<div class="accordion pb-3" id="pythonExample">
  <div class="accordion-item">
    <h2 class="accordion-header mt-0" id="pythonExample-heading">
      <button class="accordion-button p-2" type="button" data-bs-toggle="collapse" data-bs-target="#pythonExample-collapseOne" aria-expanded="true" aria-controls="pythonExample-collapseOne">
        Python Dropdown
      </button>
    </h2>
    <div id="pythonExample-collapseOne" class="accordion-collapse collapse" aria-labelledby="pythonExample-headingOne" data-bs-parent="#pythonExample">
      <div class="accordion-body p-2">
        <p>Python is an open-source programming language that emphasizes readability of the code, implicit typing, and the automatic management of process level details.</p>
        <p>For more information, visit <a href="https://www.python.org/">python.org</a>.</p>
        Presumably, markdown style code will be interpreted literally. For example, this link: [CHTC Recipes Repository](#chtc-recipes-repository).
      </div>
    </div>
  </div>
</div>