---
highlighter: none
layout: markdown-page
title: Going from Google Colab to CHTC's GPU Lab
published: true
---

This guide provides a step-by-step process for going from running a notebook 
that uses GPUs on Google Colab, to running it as a job in CHTC, using CHTC's 
GPU Lab resources. 

# Overview

Go through the following steps to transition from Google Colab to CHTC's GPU Lab: 

1. Get a script and package requirements from the Colab interface
1. Build and publish a docker container recreating the Colab software environment
1. Submit your job on CHTC, paying attention to hardware requirements.

### Why use CHTC's GPU Lab? 

Google Colab has better support for interactive work in a notebook interface; however, 
the free version has a strict time limit on how long you can run calculations. If you want
to run many GPU-based calculations or need more time, CHTC can provide a larger number 
of GPUs and a longer run time limit. 

## A. Get the Needed Packages From Colab

Assume the notebook you'd like to run on CHTC's system is already open.

1. **Export notebook as ```.py``` file:** <br />
    Export a clean copy of the notebook with ```.py``` extension before it is altered. This can be done using File--Download--Download ```.py```. Save this to the local machine.
1. **Mount Google Drive and navigate to working directory:** <br />
    In a new cell, run
    ```
    from google.colab import drive
    drive.mount('/content/drive/')
    ```
    Navigate to the working directory of the notebook:
    ```
    %cd 'path/to/directory'
    ```
1. **Convert the notebook to ```.py``` to run with ```pipreqs```:**<br />
    In a new cell, run
    ```
    !jupyter nbconvert --to=python 'notebook_name.ipynb'
    ```
1. **Install + run pipreqs:** <br />
    Install and use ```pipreqs``` with the ```--use-local``` flag to generate a list of all python packages and versions used by Colab in the notebook. These packages are determined by the program's imports. In a new cell, run
    ```
    !pip install pipreqs
    !pipreqs --use-local
    ```
    This will generate a file named ```requirements.txt```. Double check that the file contains the expected packages. If there were any other ```.py``` files in the directory, their imports will also be included in ```requirements.txt```.
1. **Download ```requirements.txt```:** <br />
    Download ```requirements.txt``` generated in the previous step and save it to the local directory containing the converted ```.py``` file downloaded in step 1.

## B. Build a Docker Container

<b>The rest of the instructions occur on the CHTC system.</b>

1. **Upload files to CHTC:**<br />

	Upload the `requirements.txt` file and the Python `.py` script saved from 
	the previous step to your home directory on the HTC system. 

1. **Create the Dockerfile:**<br />

    Copy the `requirements.txt` file to CHTC, and create a file called `Dockerfile` (there is no extension for this type of file) that looks like this:

    ```
    FROM nvidia/cuda:11.4.2-cudnn8-runtime-ubuntu20.04
    ADD requirements.txt /
    RUN apt-get update && apt-get install python3.7
    RUN apt-get -y install python3-pip
    RUN pip install -r /requirements.txt
    ``` 
    {: .file}
    
    Using the Nvidia base container ensures that CUDA/CuDNN, two libraries often used by popular ML frameworks, are imported properly. If you know you require specific versions of CUDA/CuDNN, the base container can be adjusted accordingly. Additional containers can be found <a href="https://hub.docker.com/r/nvidia/cuda">here</a>.

    Note that Python 3.7 is used in this example's ```Dockerfile``` because at the time of writing, Colab runs on 3.7. Future updates to Colab may require an updated version of Python.

1. **Create a submit file:**

    Create a file called ```build.sub``` that looks like

    ```
    # Software build file

    universe = vanilla
    log = interactive.log

    # bring along the requirements
    transfer_input_files = requirements.txt, Dockerfile

    +IsBuildJob = true
    requirements = (OpSysMajorVer =?= 7)
    request_cpus = 1
    request_memory = 4GB
    request_disk = 16GB

    queue
    ``` 
    {: .sub}

    Some of the specified values, such as ```request_memory``` and ```request_disk``` might have to be updated to reflect the particular memory and disk requirements of your container. Building containers can use a surprising amount of disk, so if your build job continues to exit back to the submit node while the build is running, try increasing these values incrementally until the build succeeds. The amount of disk used to build the container may be significantly larger than the total size of the container when it is finished.

1. **Start an interactive job:**
    
    Submit the job to HTCondor using the ```-i``` flag to indicate that it will be an interactive build job:
    ```
    condor_submit -i build.sub
    ```{: .term}
    
1. **Build the container with `podman`:** 

    Once the interactive job has begun, use ```podman``` to login to Dockerhub:
    ```
    podman login docker.io
    ```
    {: .term}
    When prompted, enter the username and password associated with your Dockerhub account.

    Once logged in, build the container:
    ```
    podman build -t <dockerhub_user/container_name:tag> .
    ```
    {: .term}
    For example, if you're building the first version of a PyTorch container and your dockerhub username is chtc_user, your build command might look like 
    
    ```
    podman build -t chtc_user/pytorch:v1 .
    ```
    {: .term}
    
1. **Upload to Dockerhub:**

    Now find the image Hash ID associated with the container that was just built. Run `podman images` and copy the Hash ID of your container.

    Push the container to dockerhub.io:

    ```
    podman push <Hash ID> <dockerhub_user/container_name:tag>
    ```
    {: .term}
    
    Again, for chtc_user, this might look like `podman push 123456 chtc_user/pytorch:v1`

    Once podman has finished uploading the container, the container should be ready for use by HTCondor.

1. **Exit interactive job:**

    In the terminal, type `exit`. This will terminate the interactive job and return you to the submit node.

## C. Submit a job

1. **Create job submit file:**

	Create a submit file called something like `my_job.sub` that looks like this: 

    ```
    universe = docker
    docker_image = your_image
    log = job_$(Cluster).log
    error = job_$(Cluster)_$(Process).err
    output = job_$(Cluster)_$(Process).out

    executable = python_script.py

    should_transfer_files = YES
    when_to_transfer_output = ON_EXIT
    #transfer_input_files = 

    request_cpus = 1
    request_memory = 1GB
    request_disk = 1GB

    queue 1
    ```
    {: .sub}

    Fill in the Docker image name from the previous step, and the name of your python script. In the above example, a container called `chtc_user/pytorch:v1` was pushed to Dockerhub, so the string `chtc_user/pytorch:v1` would be included after the `docker_image` attribute.

1. **Add "shebang" to Python script**

	In your Python script, put the following line (the first characters, `#!` are 
	known as a shebang) as the very first line of your Python script: 
	
	```
	#!/usr/bin/env python3
	```
	{: .file}
    
    This line indicates that you want the script to be run as a Python script. 

1. **Think about data!**

    As with other jobs on CHTC, think about the data requirements for your job.. Jobs with larger requirements may require a larger value for the ```request_memory``` and ```request_disk``` attributes, and if you intend to transfer the data from the submit node, you may need to do so using one of CHTC's alternative data transfer methods, such as Squid. More information about large file transfers can be found <a href="https://chtc.cs.wisc.edu/uw-research-computing/file-avail-largedata">here</a>.
1. Submit a test job, then submit real thing.

    Try submitting a scaled-down test job to ensure everything is set up correctly. When the test job runs successfully, submit the real job.
