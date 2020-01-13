---
highlighter: none
layout: default
title: Exploring a Docker Container on Your Computer
---

Linux containers are a way to build a self-contained environment that
includes software, libraries, and other tools. This guide shows how to
explore and test a Docker container on your own computer. 

A. Overview
============

**Note that all the steps below should be run on your own computer, not
in CHTC.**

This guide has two sections: 

* [Explore Docker Containers](#b-explore-docker-containers)
* [Simulate a CHTC Docker Job](#c-simulate-a-chtc-docker-job)

If you've never used Docker before, and/or are getting ready to build your own 
container image, we recommend starting with the first part of the 
guide. 

If you've explored Docker already or built your own image and you want to test if it 
will work successfully in CHTC's HTC system, 
you can follow the directions in the second section. 

A. Set Up Docker on Your Computer
=================================

{% include install_docker.md %}

B. Explore Docker Containers
============================

## 1. Get a Docker Container Image

We need to have a local copy of the Docker container image in order to
test it. You can see what container images you already have on your 
computer by running: 

```
$ docker image ls
```
{:.term}

If you just installed Docker on your computer 
and are using it for the first time, this list is probably empty. 
If you want to use a pre-made container from Docker Hub, 
you will need to "pull" it down to your computer. 
If you created a container on your computer, it should already 
be in the list of container images. 

If using a container from Docker Hub, find the container and its name, which 
will be of the format: `username/imagename:tag`. Then pull a copy of the container
image to your computer by running the following from either a Terminal
(Mac/Linux) or Command Prompt (Windows):

```
$ docker pull username/image:tag
```
{:.term}

If you run `docker image ls` again, you should see the container you downloaded 
listed. 

## 2. Explore the Container Interactively

To actually explore a container, run this command: 

```
$ docker run -it --rm=true username/image:tag /bin/bash
```
{:.term}

This will start a running copy of the container and start a command line shell 
inside. You should see your command line prompt change to something like: 

```
root@2191c1169757:/#
```
{:.term}

> **What Do All the Options Mean?**
> 
> * `-it`: interactive flag
> * `--rm=true`: after we exit, this will clean up the runnining container so Docker uses less disk space. 
> * `username/image:tag`: which container to start
> * `/bin/bash`: tells Docker that when the container starts, we want a command line (`bash`) inside to run commands

If you explore the container using `cd` and `ls`, you'll see that this is a whole, 
self-contained file system, separate from your computer.  Try running commands with their
 `--help` or `--version` options to see what's installed. If you're planning to create 
 your own container, try following a few of the installation instructions for the software 
 you want to use and see what happens. 
 
## 3. Exit the Container

Once you're done exploring, type `exit` to leave the container. 

```
root@2191c1169757:/# exit
```
{:.term}

Note that any changes or 
commands you ran in the container won't be saved! Once you exit the 
running container is shut down and removed (although the container image will still be 
on your computer, which you can see if you type `docker image ls` again). 


# C. Simulate a CHTC Docker Job

The directions above were about simply exploring a container. If you want to 
simulate what happens in a CHTC job more specifically, we'll want to do a few things:
 
- create a test working directory, with needed files
- have a list of commands to run or a script you want to use as the executable. 
- use some extra options when running the container. 

## 1. Create Working Directory

For testing, we need a folder on your computer to stand in for the
working directory that HTCondor creates for running your job. Create a folder
for this purpose on your Desktop. The folder's name shouldn't include
any spaces. Inside this folder, put all of the files that are normally
inside the working directory for a single job -- data, scripts, etc. If
you're using your own executable script, this should be in the folder.

Open a Windows Command Prompt or Mac/Linux Terminal to access that
folder, replacing "folder" with the name of the folder you created.

-   Mac/Linux:
```
$ cd ~/Desktop/folder
```
{:.term}
-   Windows:
```
$ cd %HOMEPATH%\Desktop\folder
```
{:.term}

## 2. Plan What to Run

Once the container starts, you have a few options for testing your job: 

* **Run Commands Directly**
    * When you start the container, you'll be able to run each command you 
    want to use, step-by-step. If you have multiple commands, these will eventually 
    need to be put into a shell script as your executable. 
    * Example: Running multiple steps of a bioinformatics pipeline
* **Run an Executable**
    * If you've already written a script with all your commands or code, you can 
    test this in the container. 
    * Examples: Running a shell script with multiple steps, running a machine learning Python script
* **Run a Single Command**
    * If you only want to run one command, using a program installed in the Docker 
    container, you can run this in the container. 
    * Example: Running GROMACS from a container

## 3. Start the Docker Container

We'll use a similar `docker run` command to start the Docker container, 
with a few extra options to better emulate how containers are run in 
the HTC system with HTCondor. 

This command can be run verbatim except for the
`username`, `imagename` and `tag`; these should be whatever you used to
pull or tag the container image.

-   Mac/Linux:
```
$ docker run --user $(id -u):$(id -g) --rm=true -it \
  -v $(pwd):/scratch -w /scratch \
  username/imagename:tag /bin/bash
```
{:.term}
-   Windows:
```
$ docker run --rm=true -it -v %CD%:/scratch -w /scratch username/imagename:tag /bin/bash
```
{:.term}

For Windows users, a window may pop up, asking for permission to share
your main drive with Docker. This is necessary for the files to be
placed inside the container. As in the previous section, the `docker run` command 
will start a running copy of the container and start a command line shell 
inside. 

> **What Do All the Options Mean? Part 2**
> 
> The options that we have added for this example are used in CHTC to make jobs run
> successfully and securely. 
> 
> * `--user $(id -u):$(id -g)`: runs the container with more restrictive permissions
> * `-v $(pwd):/scratch`: Put the current working directory (`pwd`) into the container but call it `/scratch`. 
> In CHTC, this working directory will be the job's usual working directory. 
> * `-w /scratch`: when the container starts, make `/scratch` the working directory


## 4. Test the job

Your command line prompt should have changed to look like this: 

```
I have no name!@5a93cb:/scratch$
```
{:.term}

We can now see if the job would complete successfully! 

If you have a single command or list of commands to run, start running them one by one. 
If you have an executable script, you can run it like so:

```
I have no name!@5a93cb:/scratch$ ./exec.sh
```
{:.term}

If your "executable" is software already in the container, run the
appropriate command to use it.

> **Permission Errors**
> 
> The following commands may not be necessary, but if you see messages
> about "Permission denied" or a bash error about bad formatting, you
> may want to try one (or both) of the following (replacing `exec.sh` 
> with the name of your own executable.)
>
> You may need to add executable permissions to the script for it to run
> correctly:
>
>     I have no name!@5a93cb:/scratch$ chmod +x exec.sh
>
> Windows users who are using a bash script may also need to run the
> following two commands:
>
>     I have no name!@5a93cb:/scratch$ cat exec.sh | tr -d \\r > temp.sh
>     I have no name!@5a93cb:/scratch$ mv temp.sh exec.sh 

When your test is done, type `exit` to leave the container:

If the program didn't work, try searching for the cause of the error
messages, or email CHTC's Research Computing Facilitators.

If your local test did run successfully, you are now ready to set up
your Docker job to run on CHTC. 

* [Docker Jobs](docker-jobs.shtml)

