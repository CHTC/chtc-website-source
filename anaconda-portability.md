---
highlighter: none
layout: default
title: Create a Portable Python Installation with Miniconda
---

The Anaconda/miniconda distribution of Python is a common tool for 
installing and managing Python-based and other tools. This guide 
describes how to create a miniconda installation that can be packaged 
up to run jobs in CHTC's HTC system. 

1. Create and Package the Anaconda Environment
========================================

- download the Linux miniconda installer to the submit node and run it to
install miniconda (basically installs python and python tools) --> get Josh's instructions

- add a tool called "conda-pack" to the base conda installation. 
```
(base)[alice@submit]$ conda install -c conda-forge conda-pack
```
{:.term}

- then, create a conda environment with all of the libraries/versions of
packages you need. 

- After creating/activating that conda environment, run: 

```
(myenv)[alice@submit]$ conda pack
```
{:.term}

This command will create a tarball called `myenv.tar.gz` with your whole conda 
environment inside. 

2. Use the Anaconda Environment to Run Jobs
========================================

A. Executable Shell Script

In your job's executable shell script, you'll need to do the following to use
the conda environment:

```
#!/bin/bash

mkdir tensorflow
tar -xzf myenv.tar.gz -C tensorflow
. tensorflow/bin/activate
python3 script.py
```
{:.file}

And then run your python script.

B. Submit File

Then, to submit a job, create a submit file that transfers the tarball created
by the conda pack command. Also in the submit file, use this line:

```
getenv = true
```
{:.sub}