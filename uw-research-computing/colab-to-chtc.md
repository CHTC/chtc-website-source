---
highlighter: none
layout: markdown-page
title: Going from Google Colab to CHTC's GPU Lab
published: false
---

# Overview

TBD


## A. Get the Needed Packages From Colab

Assume you have a started notebook

1. Install + run pipreqs

1. Export notebook as .py file

1. Download requirements + .py

## B. Build a Docker Container

1. Create all needed files

Copy the requirements file to CHTC

Create a Docker file that looks like this:

```
Add this
```

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

queue```

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
