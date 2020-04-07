---
highlighter: none
layout: default
title: Create a Portable Python Installation with Miniconda
---

The Anaconda/miniconda distribution of Python is a common tool for 
installing and managing Python-based and other tools. This guide 
describes how to use the miniconda installer to create a conda 
environment inside your job. 

# README

# A. Option 1: Pre-Install Miniconda and Transfer to Jobs

In this approach, we will create an entire software installation inside miniconda 
and then use a tool called `conda pack` to package it up for running jobs. 

TODO: when to use this option

## 1. Create a Miniconda installation

Download the miniconda installer and run it. 

```
[alice@submit]$ 
[alice@submit]$ 
```
{: .term}

https://docs.conda.io/en/latest/miniconda.html

Use default options, accept license agreement. 

different hook

```
(base)[alice@submit]$ 
```
{: .term}

Install env. 
conda create -n myenv scipy

https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html

## 2. Create Software Package

Make sure that your job's miniconda environment is created, but deactivated, so 
you're in the "base" miniconda environment: 

```
(base)[alice@submit]$ 
```
{: .term}

Then, run this command to install the `conda pack` tool: 

```
(base)[alice@submit]$ conda install -c conda-forge conda-pack
```
{: .term}

Click `y` when it asks you to install. 

Finally, use `conda pack` to create a zipped tar.gz file of your environment
(substitute the name of your conda environment where you see `env-name`): 

```
(base)[alice@submit]$ conda pack -n env-name
```
{: .term}

When this step finishes, you should see a file in your current directory named
`env-name.tar.gz`

## 3. Create a Job Executable

The job will need to go through a few steps to use this "packed" conda environment; 
first, setting the `PATH`, then unzipping the environment, then activating it, 
and finally running whatever program you like. The script below is an example 
of what is needed - change the `env-name` to the name of your environment. 

```
#!/bin/bash

export PATH
mkdir env-name
tar -xzf env-name.tar.gz -C env-name

. env-name/bin/activate
# run your python script or program
# python3 hello.py
```
{: .file}

## 4. Submit Jobs

In your submit file, make sure to have the following: 

- Your executable should be the the file you created in [step 3]()
- Remember to transfer your primary script and the environment tar.gz file in 
`transfer_input_files`. If the tar.gz file is larger than 100MB, please email us 
about different tools for delivering the installation to your jobs. 

# B. Option 2: Install Miniconda Inside Each Job

In this approach, rather than copying the Miniconda installation with each job, 
we will copy the Miniconda *installer* and install a new copy of Miniconda with 
each job. 

TODO: When to use this option

## 1. Download the Miniconda Installer and Test Installation

If you haven't already, download the latest Miniconda installer for Linux from the 
[Miniconda website](https://docs.conda.io/en/latest/miniconda.html#linux-installers) 
and place it in your home directory on a CHTC submit server. 

We strongly recommend testing the installation steps for your particular program 
or packages - either on your own computer or similar to the [directions above]() - 
before trying to submit the installation as part of a job to CHTC. 

## 2. Create an Executable Script

Our plan here is to run the Miniconda installer inside the job, build an environment 
with needed packages, and then run our desired script or program. The following 
script should work verbatim - change the `conda install` step to the packages 
you need or the instructions for your program. 

```
#!/bin/bash

# installation steps for Miniconda
export HOME=$PWD
export PATH
sh [installer] -b -p $PWD/miniconda3
export PATH=$PWD/miniconda3/bin:$PATH

# install packages
conda install numpy matplotlib

# run your python script or program
# python3 hello.py
```
{:.file}

## 3. Submit File

In your submit file, include the executable you wrote (as described above)
and in `transfer_input_files` include the Miniconda installer and any other scripts 
or data files you want to include with the job: 

```
executable = run_with_conda.sh
arguments = myscript.py

transfer_input_files = Miniconda3-latest-Linux-x86_64.sh, script.py, other_input.file
```
{:.sub}