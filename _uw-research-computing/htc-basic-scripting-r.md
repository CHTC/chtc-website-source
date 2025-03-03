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
filename <- args[1]
cat(filename,"\n")
```

The output of `commandArgs` is a vector -- if you have multiple arguments, you can reference each 
item using R's usual notation (`args[1]`, `args[2]`, etc.). 
See [R documentation on commandArgs](https://search.r-project.org/CRAN/refmans/R.utils/html/commandArgs.html) for details.

We can use the script on the command line, assuming R is installed and on the `PATH`:
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

Now that we've understood how arguments work in R and how to write simple wrapper scripts that pass those arguments, we can pass arguments in HTCondor's submit file by specifying the `arguments` attribute, as shown in this excerpt:

```
# Create custom variable called "data"
data = data.csv

# Specify the executable & arguments
executable = wrapper.sh
arguments = $(data)
```
<!--more-->
