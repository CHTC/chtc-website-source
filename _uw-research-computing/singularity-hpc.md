---
highlighter: none
layout: guide
title: Using Software in a Container on the HPC Cluster
---


Software that is packaged in a \"container\" can
be run on the HPC cluster. This guide assumes that you are starting with 
an existing Docker container and shows how to use it to run a job on the HPC cluster. 

Note that you may need to install a version of MPI to your container 
when it is initially created. See the [notes](#notes) about this below. 

The two steps to run a container on the HPC cluster: 
1.  [Convert the container to a Singularity image file](#image)
2.  [Run a job that uses the container](#command)

<span name="notes"></span>
Notes about MPI and Containers
==================

There are two ways to run a Singularity container integrated with MPI: `hybrid` 
mode and `bind` mode. 

In `hybrid` mode, the container has its own copy of MPI **that is compatible 
with a version of MPI already installed on the cluster**. 

In `bind` mode, the code in the container has been compiled with MPI that 
exists outside the container and there is no MPI installation in the container itself. 
Again, **the version of MPI used needs to be compatible with one already installed
on the cluster.**

This will be relevant in how the job is executed later on: [Using Singularity Container Images](#command)

<span name="image"></span>

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

1. Once the Singularity command completes, type `exit` to leave the interactive job. 

<span name="command"></span>

**2. Using Singularity Container Images**
===================

To use a Singularity container in a job, the SLURM submit file will remain mostly the
same; what will change is the job's primary command at the end of the
file. This command will run your primary program inside the container
file you\'ve downloaded. The main MPI command will still be part of the 
singularity command: 

``` {.sub}
#!/bin/sh
#SBATCH options

module load MPI/version
mpirun -np ## singularity exec /path/to/container/file command-to-run
```

For example, if Alice wanted to run a script she had written
(`poisson.py`) inside the downloaded fenics container, using 40 cores, she would use the
following command at the end of her submit file:

``` {.sub}
mpirun -np 40 singularity exec /software/alice/fenics.simg ./poisson.py
```

The example shown above uses the "hybrid" model for running MPI, which assumes 
that there is a copy of MPI installed **in the container** that matches what already 
exists on the cluster. 

If your container does **not** have it's own copy of MPI installed, you need 
to use the "bind" model for running MPI which requires an additional flag and 
the location of the main MPI directory: 


``` {.sub}
#!/bin/sh
#SBATCH options

module load MPI/version
mpirun -np ## singularity exec --bind /path/to/cluster/MPI/dir/ /path/to/container/file command-to-run
```

On CHTC's cluster, the GCC based version of OpenMPI is installed at the path:
` /software/chtc/easybuild/v2/software/OpenMPI/4.0.5-GCC-9.3.0/`
So the command(s) to run the "Alice" example above would be: 

``` {.sub}
MPI_DIR=/software/chtc/easybuild/v2/software/OpenMPI/4.0.5-GCC-9.3.0/
mpirun -np 40 singularity exec --bind $MPI_DIR /software/alice/fenics.simg ./poisson.py
```

More details on the difference between using the "hybrid" and "bind" model 
for MPI and Singularity is here: https://sylabs.io/guides/3.8/user-guide/mpi.html
