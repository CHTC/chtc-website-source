---
highlighter: none
layout: markdown-page
title: Run Machine Learning Jobs on the HTC system
---

This guide provides some of our recommendations for success 
in running machine learning (specifically deep learning) jobs in CHTC. 

> This is a new *how-to* guide on the CHTC website. Recommendations and 
> feedback are welcome via email (chtc@cs.wisc.edu) or by creating an 
> issue on the CHTC website Github repository: [Create an issue](https://github.com/CHTC/chtc-website-source/issues/new)

Overview
========

It is important to understand the needs of a machine learning job before submitting 
it and have a plan for managing software. This guide covers: 

1. [Considering job requirements](#1-job-requirements)
2. [Recommendations for managing software](#2-software-options)

# 1. Job Requirements

Before digging into the nuts and bolts of software installation in the next section, 
it is important to first consider a few other job requirements that might apply to 
your machine learning job. 

## A. Do you need GPUs?

CHTC has about 4 publicly available GPUs and thousands of CPUs. When possible, using 
CPUs will allow your jobs to start more quickly and to have many running at once. For 
certain calculations, GPUs may provide a different advantage as some machine learning 
algorithms are optimized to run significantly faster on GPUs. Consider whether you 
would benefit from running one or two long-running calculations on a GPU or if your 
work is better suited to running many jobs on CHTC's available CPUs. 

If you need GPUs for your jobs, you can see a summary of available GPUs in CHTC and 
how to access them here: 

* [GPUs in CHTC](gpu-jobs)

Note that you may need to use different versions of your software, depending on whether or 
not you are using GPUs, as shown in the [software section of this guide](#2-software-options). 

## B. How big is your data? 

CHTC's usual data recommendations apply for machine learning jobs. If your job is using 
an input data set larger than a few hundred MB or generating output files larger than 
a few GB, you will likely need to use our large data 
file share. Contact the CHTC Research Computing Facilitators to get access and 
read about the large data location here: 

* [Managing Large Data in HTC Jobs](file-avail-largedata)

## C. How long does your job run? 

CHTC's default job length is 72 hours. If your task is long enough that you will 
encounter this limit, contact the CHTC Research Computing Facilitators (chtc@cs.wisc.edu) 
for potential work arounds. 

## D. How many jobs do you want to submit? 

Do you have the ability to break your work into many independent pieces? If so, 
you can take advantage of CHTC's capability to run many independent jobs at once, 
especially when each job is using a CPU. See our guide for running multiple jobs here: 

* [Submitting Multiple Jobs Using HTCondor](multiple-jobs)

# 2. Software Options

Many of the tools used for machine learning, specifically deep learning and 
convolutional neural networks, have enough dependencies that our usual installation 
processes work less reliably. The following options are the best way to handle the complexity 
of these software tools.  

Please be aware of which CUDA library version you are using to run your code. 

A. Using Docker Containers
--------------------------

CHTC's HTC system has the ability to run jobs using Docker containers, which package 
up a whole system (and software) environment in a consistent, reproducible, portable 
format. When possible, we recommend using standard, publicly available 
Docker containers to run machine learning jobs in CHTC. 

To see how you can use Docker containers to run jobs in CHTC, see: 
* [Docker Jobs in CHTC](docker-jobs)
* [GPU/Machine Learning Job Examples on Github](https://github.com/CHTC/templates-GPUs)

You can also test and examine containers on your own computer:
* [Exploring and Testing Docker Containers](docker-test)

Some machine learning frameworks publish ready-to-go Docker images: 
* [Tensorflow on Docker Hub](https://hub.docker.com/r/tensorflow/tensorflow) - the "Overview" on that page describes how to choose an image.
* [Pytorch on Docker Hub](https://hub.docker.com/r/pytorch/pytorch/tags) - we recommend choosing the most recently published image that ends in `-runtime`.

If you can not find a Docker container with exactly the tools you need, you can build your 
own, starting with one of the containers above. For instructions on how to build and 
test your own Docker container, see this guide: 

* [Building Docker Containers](docker-build)

B. Using Conda
--------------

The Python package manager conda is a popular tool for installing and 
managing machine learning tools.
See [this guide](conda-installation) for information on how 
to use conda to provide dependencies for CHTC jobs. 

Note that when installing tensorflow using `conda`, it is important to install 
not the generic `tensorflow` package, but `tensorflow-gpu`. This ensures that 
the installation will include tensorflow's GPU capability. 
