---
highlighter: none
layout: default
title: Create a Portable Python Installation with Miniconda
---

The Anaconda/miniconda distribution of Python is a common tool for 
installing and managing Python-based and other tools. This guide 
describes how to use the miniconda installer to create a conda 
environment inside your job. 

# 1. Download the Miniconda Installer and Test Installation

https://docs.conda.io/en/latest/miniconda.html#linux-installers

wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# 2. Create an Executable Script

Our plan here is to 

```
#!/bin/bash

# installation steps for Miniconda
export HOME=$PWD
sh [installer] -b
export PATH=$PWD/miniconda3/bin:$PATH

# install packages
conda install numpy matplotlib

# run your python script, which will be provided 
# as an argument in the submit file. 
python3 $@
```
{:.file}

# 3. Submit File

In your submit file, include the executable you wrote (as described above)
and in `transfer_input_files` include the Miniconda installer and any other scripts 
or data files you want to include with the job: 

```
executable = run_with_conda.sh
arguments = myscript.py

transfer_input_files = Miniconda3-latest-Linux-x86_64.sh, script.py, other_input.file
```
{:.sub}