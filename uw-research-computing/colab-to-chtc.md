---
highlighter: none
layout: markdown-page
title: Going from Google Colab to CHTC's GPU Lab
published: true
---

# Overview

1. Get the notebook's package requirements from Colab and convert the notebook to ```.py```.
1. Use an interactive job on CHTC to build and publish a docker container with the requirements specified by your job.
1. Submit your job on CHTC using the docker universe, paying attention to hardware requirements.

## A. Get the Needed Packages From Colab

Assume you have a started notebook

1. Export notebook as .py file <br />
Export a clean copy of the notebook with ```.py``` extension before it is altered. This can be done using File--Download--Download .py. Save this to the local machine.
1. Mount Google Drive and navigate to working directory <br />
In a new cell, run
```
from google.colab import drive
drive.mount('/content/drive/')
```
Navigate to the working directory of the notebook:
```
%cd 'path/to/directory'
```
1. Convert the notebook to .py to run with ```pipreqs```<br />
In a new cell, run
```
!jupyter nbconvert --to=python 'notebook_name.ipynb'
```
1. Install + run pipreqs <br />
Install and use ```pipreqs``` with the ```--use-local``` flag to generate a list of all python packages and versions used by Colab in the notebook. These packages are determined by the program's imports. In a new cell, run
```
!pip install pipreqs
!pipreqs --use-local
```
This will generate a file named ```requirements.txt```. Double check that the file contains the expected packages. If there were any other ```.py``` files in the directory, their imports will also be included in ```requirements.txt```.
1. Download ```requirements.txt``` <br />
Download ```requirements.txt``` generated in the previous step and save it to the local directory containing the ```.py``` downloaded in step 1.

## B. Build a Docker Container

1. Create all needed files 

Copy the requirements file to CHTC

Create a Docker file that looks like this:

```
FROM nvidia/cuda:11.4.2-cudnn8-runtime-ubuntu20.04
ADD requirements.txt /
RUN apt-get update && apt-get install python3.7
RUN apt-get -y install python3-pip
RUN pip install -r /requirements.txt
```
Using the Nvidia base container ensures that CUDA/CuDNN are imported properly. If you know you require specific versions of CUDA/CuDNN, the base container can be adjusted accordingly. Additional containers can be found <a href="https://hub.docker.com/r/nvidia/cuda">here</a>.

Create a submit file

```
# Software build file

universe = vanilla
log = interactive.log

# bring along the requirements
transfer_input_files = requirements.txt

+IsBuildJob = true
requirements = (OpSysMajorVer =?= 7)
request_cpus = 1
request_memory = 4GB
request_disk = 2GB

queue
```

1. Start an interactive job

1. Build the container

1. Upload to Docker Hub

1. Exit interactive job

## C. Submit a job

1. Create submit file that looks like this: 

```
universe = docker
log = job_$(Cluster).log
error = job_$(Cluster)_$(Process).err
output = job_$(Cluster)_$(Process).out

executable = python script

should_transfer_files = YES
when_to_transfer_output = ON_EXIT
#transfer_input_files = 

request_cpus = 1
request_memory = 1GB
request_disk = 1GB

queue 1
```

Fill in Docker image name, script name

1. Upload python script, Make sure script has shebang at top

1. Think about data! 

1. Submit a test job, then submit real thing
