---
highlighter: none
layout: guide
title: Basic scripting in R script
software: R
guide:
    tag:
        - htc
excerpt_separator: <!--more-->
published: true
basic_scripting: true
icon: /uw-research-computing/guide-icons/r-icon.png
---

### Code
Our executable written in R, `echo-next.R`:
```
args <- commandArgs(trailingOnly = TRUE)
cat(args[1],"\n")
```
See [R documentation on commandArgs](https://search.r-project.org/CRAN/refmans/R.utils/html/commandArgs.html) for details.

We can use it on the command line, assuming R is installed and on the `PATH`:
```
[user@login]$ Rscript echo-next.R data.csv
data.csv
```
{:.term}

### Wrapper script

We can now write a wrapper script! This script checks that one argument is passed, and also allows room for pre- and post-processing in this simple workflow.

Our wrapper script written in bash, `wrapper.sh`:
```
#!/bin/bash

# Check if an argument is provided
if [ $# -ne 1 ]; then
    echo 'Please use one argument. Usage: wrapper.sh [arg]'
    exit 1
fi

# Set filename variable to the first argument to the bash script
filename=$1

echo 'Pre-processing could go here.'

# Run code
Rscript echo-next.R ${filename}

echo 'Post-processing could go here.'
```

Ensure `wrapper.sh` is executable with `chmod +x wrapper.sh` before running it on the command line:
```
[user@login]$ chmod +x wrapper.sh
[user@login]$ ./wrapper.sh
Please use one argument. Usage: wrapper.sh [arg]
[user@login]$ ./wrapper.sh data.csv
Pre-processing could go here.
data.csv
Post-processing could go here.
```
{:.term}

### Passing arguments with the HTCondor submit file

Now that we've understood how arguments work in R and how to write simple wrapper scripts that pass those arguments, we can pass arguments in HTCondor's submit file by specifying the `arguments` attribute.

Our HTCondor submit file, `echo-next.sub`:
```
# HTCondor submit file

# Create custom variable called "data"
data = data.csv

# Use official R 4.4.0 container
container_image = docker://r-base:4.4.0

# Specify the executable & arguments
executable = wrapper.sh
arguments = $(data)

# Specify files to transfer
# We want to transfer our R script and data
# The R executable is already included in the container, so no need to transfer it
transfer_input_files = echo-next.R, $(data)

log = echo-next.log
output = echo-next.out
error = echo-next.err

# Requirements
request_cpus = 1
request_memory = 1GB
request_disk = 1GB

queue
```

You can test this submit file!

First, create an empty `data.csv` file with the `touch` command. We need to create this file as it is our "data" that will be transferred, as specified by `transfer_input_files` attribute.
```
[user@login]$ touch data.csv
```
{:.term}

Submit the job with the `condor_submit` command.
```
[user@login]$ condor_submit echo-next.sub
Submitting job(s).
1 job(s) submitted to cluster 1916134.
```
{:.term}

Check the job status with `condor_q`. Once it's complete, check the out file to ensure it runs as expected! You should see:
```
Pre-processing could go here.
data.csv
Post-processing could go here.
```
<!--more-->