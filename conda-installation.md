---
highlighter: none
layout: default
title: Create a Portable Python Installation with Miniconda
---

The Anaconda/Miniconda distribution of Python is a common tool for 
installing and managing Python-based software and other tools. This guide 
describes how to use the Miniconda installer to create a conda 
environment for use in CHTC jobs. 

# Overview

When should you use Miniconda as an installation method in CHTC? 
- Your software has specific Miniconda/conda centric installation instructions
- The above is true *and* the software has a lot of dependencies
- You mainly use Python to do your work. 

There are two ways to use Miniconda on CHTC's HTC system. The first is to create your 
installation environment on the submit server and send a zipped version to 
your jobs. The other option is to install Miniconda inside each job. 
The first option is more efficient, especially for complex installations, 
but there may be rare situations where installing with each job is better. 
We recommend trying the pre-installation option first. 

- Recommended: [Option 1: Pre-Install Miniconda and Transfer to Jobs](#option-1-pre-install-miniconda-and-transfer-to-jobs)
- Alternative: [Option 2: Install Miniconda Inside Each Job](#option-2-install-miniconda-inside-each-job)

# Option 1: Pre-Install Miniconda and Transfer to Jobs

In this approach, we will create an entire software installation inside Miniconda 
and then use a tool called `conda pack` to package it up for running jobs. 

## 1. Create a Miniconda installation

Download the latest Linux [miniconda installer](https://docs.conda.io/en/latest/miniconda.html) and run it. 

```
[alice@submit]$ sh Miniconda3-latest-Linux-x86_64.sh
```
{: .term}

Accept the license agreement and default options. At the end, you can choose whether or 
not to "initialize Miniconda3 by running conda init?" The default is no; you should 
then run the `eval` command listed by the installer to "activate" Miniconda. You'll 
also want to save this command so that you can reactivate the Miniconda installation 
when needed in the future. 

## 2. Create a conda "environment" with your software

Make sure that you've activated the base Miniconda environment if you haven't 
already. Your prompt should look like this: 

```
(base)[alice@submit]$ 
```
{: .term}

To create an environment, use the `conda create` command and then activate the 
environment: 

```
(base)[alice@submit]$ conda create -n env-name
(base)[alice@submit]$ conda activate env-name
```
{: .term}

Then, run the `conda install` command to install the different packages and 
software you want to include in the installation. How this should look is often 
listed in the installation examples for software 
(e.g. [Qiime2](https://docs.qiime2.org/2020.2/install/native/#install-qiime-2-within-a-conda-environment), 
[Pytorch](https://pytorch.org/get-started/locally/)). 

```
(env-name)[alice@submit]$ conda install pkg1 pkg2
```
{: .term}

Once everything is installed, deactivate the environment to go back to the 
Miniconda "base". 

```
(env-name)[alice@submit]$ conda deactivate
```
{: .term}

For example, if you wanted to create an installation with `pandas` and 
`matplotlib` and call the environment `py-data-sci`, I would use this sequence 
of commands: 

```
(base)[alice@submit]$ conda create -n py-data-sci
(base)[alice@submit]$ conda activate py-data-sci
(py-data-sci)[alice@submit]$ conda install pandas matplotlib
(py-data-sci)[alice@submit]$ conda deactivate
(base)[alice@submit]$ 
```
{: .term}

> ## More about Miniconda
> 
> See the [official conda documentation](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html) for 
> more information on creating and managing environments with `conda`. 

## 3. Create Software Package

Make sure that your job's Miniconda environment is created, but deactivated, so 
you're in the "base" Miniconda environment: 

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

## 4. Create a Job Executable

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
#run your python script or program
#python3 hello.py
```
{: .file}

## 5. Submit Jobs

In your submit file, make sure to have the following: 

- Your executable should be the the file you created in [step 4]()
- Remember to transfer your primary script and the environment tar.gz file in 
`transfer_input_files`. If the tar.gz file is larger than 100MB, please email us 
about different tools for delivering the installation to your jobs. 

# Option 2: Install Miniconda Inside Each Job

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