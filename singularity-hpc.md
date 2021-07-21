---
highlighter: none
layout: markdown-page
title: Using Software in a Container on the HPC Cluster
---


Software that is packaged in a \"container\" (Docker or Singularity) can
be run on the HPC cluster.

1.  [Put the container on the cluster](#container)
2.  [Run a job that uses the container](#command)

<a name="container"></a>

**1. Downloading Containers**
-------------------------

> **Note:** Until the HPC Cluster can be upgraded to a new version of
> Singularity, the container that you use on the HPC cluster **must**
> contain a home directory with your username. For now this means that
> you\'ll need to create your own container that includes a command to
> create this folder.

We assume that there is a Docker or Singularity container (either found
or created by you) online that you want to use. We recommend downloading
the container you want to use to your home directory in the HPC cluster.

To do this:

1.  Log in to `aci-service-2.chtc.wisc.edu`.
2.  Download the container into a file.
    -   To download a container that\'s on DockerHub, run:

        ``` 
        [alice@service-2]$ singularity build name.simg docker://user/image:version
        ```
        {:.term}

For example, if user \"Alice\" wanted to use the [\"Fenics\" container
provided on DockerHub](https://hub.docker.com/r/fenicsproject/stable),
and save it to a file named `fenics.simg`, she would run:

``` 
[alice@service-2]$ singularity build fenics.simg docker://fenicsproject/stable:latest
```
{:.term}

<a name="command"></a>

**2. Using Containers**
===================

To use a container in a job, the submit file will remain mostly the
same; what will change is the job\'s primary command at the end of the
file. This command will run your primary program inside the container
file you\'ve downloaded.

``` {.sub}
#!/bin/sh
#SBATCH --partition=univ
#SBATCH --time=0-04:30:00
#SBATCH --nodes=2
#SBATCH --ntasks-per-node=16
#SBATCH --mem-per-cpu=4000
#SBATCH --error=job.%J.err
#SBATCH --output=job.%J.out

singularity exec /path/to/container/file command-to-run
```

For example, if Alice wanted to run a script she had written
(`poisson.py`) inside the downloaded fenics container, she would use the
following command at the end of her submit file:

``` {.sub}
singularity exec /home/alice/containers/fenics.simg poisson.py
```
