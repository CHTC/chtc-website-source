---
highlighter: none
layout: markdown-page
title: Going from Google Colab to CHTC's GPU Lab
published: false
---

# Overview

1. Get the notebook's package requirements from Colab and convert the notebook to ```.py```.
1. Use an interactive job on CHTC to build and publish a docker container with the requirements specified by your job.
1. Submit your job on CHTC using the docker universe, paying attention to hardware requirements.

## A. Get the Needed Packages From Colab

Our first step is to gather needed requirements from the Colab environment. 
Assuming you have a started notebook running in Colab, go through the following steps. 

1. **Export notebook as .py file.**
	
	Export a clean copy of the notebook with ```.py``` extension before 
	it is altered. This can be done using File--Download--Download .py. 
	Save this to the local machine.

1. Mount Google Drive and navigate to working directory
	
	In a new cell, run
	```
	from google.colab import drive
	drive.mount('/content/drive/')
	```
	Navigate to the working directory of the notebook:
	```
	%cd 'path/to/directory'
	```

1. Convert the notebook to .py to run with ```pipreqs```
	
	In a new cell, run
	```
	!jupyter nbconvert --to=python 'notebook_name.ipynb'
	```

1. Install + run pipreqs
	
	Install and use ```pipreqs``` with the ```--use-local``` flag to generate a list of all python packages and versions used by Colab in the notebook. These packages are determined by the program's imports. In a new cell, run
	```
	!pip install pipreqs
	!pipreqs --use-local
	```
	
	This will generate a file named ```requirements.txt```. Double check that the file contains the expected packages. If there were any other ```.py``` files in the directory, their imports will also be included in ```requirements.txt```.

1. Download ```requirements.txt```

	Download ```requirements.txt``` generated in the previous step and save it to the local directory containing the ```.py``` downloaded in step 1.

## B. Build a Docker Container

Next, we build a Docker container to replicate the Colab environment. This is 
done via an interactive HTCondor job on one of CHTC's build nodes. 

(For more information on Docker in general, see our general [Docker Guide](docker-jobs))

1. **Assemble all needed files.** 

	To build our container, we need the following files in the submit server home directory: 

	* Copy over the `requirements.txt` file you created in the previous step. 
	* Create a file called `Dockerfile` 
	```
FROM nvidia/cuda:11.4.2-cudnn8-runtime-ubuntu20.04
ADD requirements.txt /
RUN apt-get update && apt-get install python3.7
RUN apt-get -y install python3-pip
RUN pip install -r /requirements.txt
	```
	This will be the "recipe" for creating our container along with the `requirements.txt` 
	file. Using the Nvidia base container ensures that CUDA/CuDNN are imported 
	properly. If you know you require specific versions of CUDA/CuDNN, the base container can be adjusted accordingly. Additional containers can be found <a href="https://hub.docker.com/r/nvidia/cuda">here</a>.
	* Create a submit file called `build.sub` that target's CHTC's build servers and includes the previous 
	two files as input files: 
	```{: .sub}
# Software build file, build.sub

universe = vanilla
log = interactive.log

# bring along the requirements and Dockerfile
transfer_input_files = requirements.txt, Dockerfile

+IsBuildJob = true
requirements = (OpSysMajorVer =?= 7)
request_cpus = 1
request_memory = 6GB
request_disk = 6GB

queue	
	```

1. **Start an interactive job.** 

	Run the following command to start an interactive job on the build server: 
	```{: .term}
$ condor_submit -i build.sub
	```
	After a few moments, the interactive job should start and the terminal prompt will change. 
	
1. **Build the container.**
	TODO: Buildah stuff
	
	```{: .term}
$ buildah
	```
	
1. **Upload to Docker Hub.**
	TODO: Buildah stuff
	
	```{: .term}
$ buildah
	```

1. **Exit interactive job.**

	Once the container has been uploaded to Docker Hub, exit the interactive job 
	by typing `exit`. 

## C. Submit a Job

Finally, write a submit file that includes the 

1. Create submit file that looks like this: 

	```{:.sub}
universe = docker
docker_image = [blah]

executable = python script

should_transfer_files = YES
when_to_transfer_output = ON_EXIT
#transfer_input_files = 

request_gpus = 1
+WantGPULab = true
+GPUJobLength = "short"

request_cpus = 1
request_memory = 1GB
request_disk = 1GB

log = job_$(Cluster).log
error = job_$(Cluster)_$(Process).err
output = job_$(Cluster)_$(Process).out

queue 1
	```
	Fill in Docker image name, script name

1. Upload python script, Make sure script has shebang at top

1. Think about data! 

1. Submit a test job, then submit real thing
