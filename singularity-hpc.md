---
highlighter: none
layout: markdown-page
title: Using Software in a Container on the HPC Cluster
---


Software that is packaged in a \"container\" can
be run on the HPC cluster. This guide assumes that you are starting with 
an existing Docker container and shows how to use it to run a job on the HPC cluster. 

The two steps to 
1.  [Convert the container to a Singularity image file](#image)
2.  [Run a job that uses the container](#command)

<a name="image"></a>

**1. Convert Container to Singularity Format**
===================

We assume that there is a Docker container (either found
or created by you) online that you want to use. To use this container 
on the HPC cluster, it needs to be converted to a Singularity-format
image file. To do this: 

1. Log in to one of the HPC cluster log in nodes. 
1. Start an interactive job: 
	```
	[alice@login]$ srun -n4 -N1 -p int --pty bash
	```

1.  Once the interactive job starts, you'll need to unset a shell environment
variable that prevents download of the Docker container. 
	```
	[alice@int]$ unset HTTPS_PROXY
	```

1. Then, save the Docker container to a Singularity image. 
	``` 
	[alice@int]$ singularity build /software/alice/name.simg docker://user/image:version
	```
	{:.term}
	
	For example, if user \"Alice\" wanted to use the [\"Fenics\" container
	provided on DockerHub](https://hub.docker.com/r/fenicsproject/stable),
	and save it to a file named `fenics.simg`, she would run:

	``` 
	[alice@int]$ singularity build /software/alice/fenics.simg docker://fenicsproject/stable:latest
	```
	{:.term}

	> This command will by default, pull the initial Docker container from 
	> Docker Hub. If your Docker container is stored elsewhere, or you are 
	> starting with a Singularity image, contact CHTC staff for specific instructions. 

1. Once the command completes, type `exit` to leave the interactive job. 


<a name="command"></a>

**2. Using Singularity Container Images**
===================

To use a Singularity container in a job, the SLURM submit file will remain mostly the
same; what will change is the job's primary command at the end of the
file. This command will run your primary program inside the container
file you\'ve downloaded.

``` {.sub}
#!/bin/sh
#SBATCH options

singularity exec /path/to/container/file command-to-run
```

For example, if Alice wanted to run a script she had written
(`poisson.py`) inside the downloaded fenics container, she would use the
following command at the end of her submit file:

``` {.sub}
singularity exec /software/alice/fenics.simg poisson.py
```

If you are using MPI to run the code, the MPI command needs to go before 
the singularity command, like so: 

``` {.sub}
mpirun -np 40 singularity exec /software/alice/fenics.simg poisson.py
```