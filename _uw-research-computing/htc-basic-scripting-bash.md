---
highlighter: none
layout: guide
title: Basic scripting in shell script
software: Shell script
guide:
    tag:
        - htc
excerpt_separator: <!--more-->
published: true
basic_scripting: true
icon: /uw-research-computing/guide-icons/bash-icon.svg
---

### Code
Our executable written in shell, `echo-next.sh`:
```
#!/bin/bash
echo $1
```

We can use it on the command line after changing the file permissions to executable:
```
[user@login]$ chmod +x echo-next.sh
[user@login]$ ./echo-next.sh data.csv
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
./echo-next.sh ${filename}

echo 'Post-processing could go here.'
```

Ensure `wrapper.sh` is executable with `chmod +x wrapper.sh` before running it on the command line:
```
[user@login]$ chmod +x wrapper.sh
[user@login]$ ./wrapper.sh
Please use one argument. Usage: wrapper.sh [arg]
[user@login]$ ./wrapper.sh data.csv
Pre-processing could go here
data.csv
Post-processing could go here
```
{:.term}

### Passing arguments with the HTCondor submit file

Now that we've understood how arguments work in shell script and how to write simple wrapper scripts that pass those arguments, we can pass arguments in HTCondor's submit file by specifying the `arguments` attribute, as shown in this excerpt:

```
# Create custom variable called "data"
data = data.csv

# Specify the executable & arguments
executable = wrapper.sh
arguments = $(data)
```
<!--more-->