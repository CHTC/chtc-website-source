---
highlighter: none
layout: default
title: HTC Recipe - Multiple Files
---


# Identify components of the job

## What's shared? 

Identify files in common (scripts, software, shared data)

## What varies? 

What changes among jobs? Probably different input files

## How do you express what varies as input? As output? 

Argument to command line for input, Script uses that filename to name output. 

# Organize Files

## Create input directory

Two divisions: common and unique files

## Create output directories

For logging files (log, stdout, stderr) and also job output

## Create script at top level

Script and submit file (more details later) to submit and run each task. 

## Final version: 

```
project/
  input/
    common/
      script.py
      alldata.csv
    sample1.csv
    sample2.csv
    sample3.csv
  output/
  log/
  stderr/
  stdout/
  job.submit
  run.sh
```

> Have a picture of this also... 

# Set up an HTC submission with HTCondor

## Make a list of input files

create list.txt

## Sample submit file

```
## Set project directory
projectdir = $ENV(PWD)

## What to run
executable = run.sh
arguments = python3 script.py $(infile)

## Input files
should_transfer_files = YES
transfer_input_files = $(projectdir)/input/common/, $(projectdir)/input/$(infile)

## Output files
when_to_transfer_output = ON_EXIT
initialdir = $(projectdir)/output
log = $(projectdir)/log/job.$(Cluster).$(Process).log
output = $(projectdir)/stdout/job.$(Cluster).$(Process).out
error = $(projectdir)/stderr/job.$(Cluster).$(Process).err

## Request compute resources per job
request_cpus = 1
request_memory = 1GB
request_disk = 1GB

queue infile from list.txt
```

## Sample script

```
#!/bin/bash

# software and data setup (later)

# variable that will run your command (in the arguments line)
$@
```

# Run a test

This is where the software piece needs to go



