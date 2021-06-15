---
highlighter: none
layout: markdown-page
title: Running Julia Jobs on CHTC
---

# Overview

This guide documents steps for submitting jobs that will execute 
Julia code, including preliminary steps for installing specific Julia 
packages that may be required for your work.

# Table of Contents
1.  [Quickstart Instructions](#quickstart-instructions)
1.  [Install Julia Packages](#install-julia-packages)
1.  [Submit Julia Jobs](#submit-julia-jobs)

# Quickstart Instructions

1. Download the precompiled Julia software from <https://julialang.org/downloads/>. 
You will need the 64-bit, tarball compiled for general use on a Linux x86 system. The 
file name will resemble something like `julia-#.#.#-linux-x86_64.tar.gz`.

    * Tip: use `wget` to download directly to your `/home` directory on the 
submit server, **OR** use `transfer_input_files = url` in your HTCondor submit files.

1. Submit an "interactive build" job to create a Julia project and 
install packages, else skip to the next step.

    * For more details, see the section on installing Julia 
    packages below: [Installing Julia Packages](#install-julia-packages)

1. Submit a job that executes a Julia script using the Julia precompiled binary
with base Julia and Standard Library.

	```
	#!/bin/bash

	# extract Julia binaries tarball
	tar -xzf julia-#.#.#-linux-x86_64.tar.gz

	# add Julia binary to PATH
	export PATH=$_CONDOR_SCRATCH_DIR/julia-#-#-#/bin:$PATH

	# run Julia script
	julia my-script.jl
	```
	{: .file}

    * For more details, including how to use Julia packages with your job, see the 
    section on installing Julia packages below: [Installing Julia Packages](#install-julia-packages)

# Install Julia Packages

If your work requires additional Julia packages, you will need to peform a one-time 
installation of these packages within a Julia project. A copy of the project 
can then be saved for use in subsequent job submissions. For more details, 
please see Julia's documentation at [Julia Pkg.jl](https://julialang.github.io/Pkg.jl).

## Create An Interactive Build Job Submit File

To install your Julia packages, first create an HTCondor submit for 
submitting an "interactive build" job which is a job that will run 
interactively on one of CHTC's servers dedicated for building 
(aka compiling) software. 

Using a text editor, create the following file, which can be named `build.sub`

``` {.sub}
# Julia build job submit file

universe = vanilla
log = julia-build.log

# have job transfer a copy of precompiled Julia software
# be sure to match the name of the version 
# that you have downloaded to your home directory
transfer_input_files = julia-#.#.#-linux-x86_64.tar.gz

+IsBuildJob = true
requirements = (OpSysMajorVer =?= 7)
request_cpus = 1
request_memory = 4GB
request_disk = 2GB

queue
```

The only thing you should need to change in the above file is the name
of the Julia tarball file in the \"transfer\_input\_files\" line.

## Submit Your Interactive Build Job

Once this submit file is created, submit the job using the following command:

``` 
[alice@submit]$ condor_submit -i build.sub
```
{:.term}

It may take a few minutes for the build job to start.

## Install Julia Packages Interactively

Once the interactive jobs starts you should see the following
inside job's the working directory:

``` 
bash-4.2$ ls -F
julia-#.#.#-linux-x86_64.tar.gz   tmp/    var/
```
{:.term}

Run the following commands to extract the Julia software, 
add Julia to your `PATH`, create a `my-project/` directory to 
install your packages to, tell Julia where to install your 
packages, and start the Julia REPL.

``` 
bash-4.2$ tar -xzf julia-#.#.#-linux-x86_64.tar.gz
bash-4.2$ export PATH=$_CONDOR_SCRATCH_DIR/julia-#.#.#/bin:$PATH
bash-4.2$ mkdir my-project
bash-4.2$ export JULIA_DEPOT_PATH=$PWD/my-project
bash-4.2$ julia --project=my-project
```
{:.term}

You can choose whatever name to use for this directory \-- if you have
different projects that you use for different jobs, you could
use a more descriptive name than "my-project".

Once you've started up the Julia REPL (interpreter), start the Pkg REPL 
by typing `]`. Then install and test packages:

```
               _
   _       _ _(_)_     |  Documentation: https://docs.julialang.org
  (_)     | (_) (_)    |
   _ _   _| |_  __ _   |  Type "?" for help, "]?" for Pkg help.
  | | | | | | |/ _` |  |
  | | |_| | | | (_| |  |  Version 1.0.5 (2019-09-09)
 _/ |\__'_|_|_|\__'_|  |  Official https://julialang.org/ release
|__/                   |

julia> ]
(my-project) pkg> add Package
(my-project) pkg> test Package
```
{:.term}

If you have multiple packages to install they can be combined 
into a single command, e.g. `(my-project) pkg> add Package1 Package2 Package3`.

**If you encounter issues getting packages to install successfully, please 
contact us at <chtc@cs.wisc.edu>.**

Once you are done, you can exit the Pkg REPL by typing the Delete key and then 
`exit()`

```
(my-project) pkg> 
julia> exit()
```
{:.term}

## Save Installed Packages For Later Jobs

To use this project, and the associated installed packages, in 
subsequent jobs, we need to have HTCondor return some files to 
the submit server by converting the `my-project/` directory
to a tarball, before exiting the interactive job session:

```
bash-4.2$ tar -czf my-project.tar.gz my-project/
bash-4.2$ exit
```
{:.term}

After the job exits, you will be returned to your `/home` directory on the 
submit server (specifically where ever you were located when you submitted 
the interactive build job). A copy of `packages.tar.gz` will be present. **Be 
sure to check the size of the project tarball before proceeding to subsequent job 
submissions.** If the file is >100MB please contact us at <chtc@cs.wisc.edu> so 
that we can get you setup with access to our SQUID web proxy. More details 
are available on our SQUID guide: [File Availability with SQUID](file-avail-squid)

```
[alice@submit]$ ls 
build.sub     julia-#.#.#-linux-x86_64.tar.gz   julia-build.log
my-project.tar.gz
[alice@submit]$ ls -sh my-project.tar.gz
```
{:.term}

# Submit Julia Jobs

To submit a job that runs a Julia script, create a bash 
script and HTCondor submit file following the examples in this section.

## Create Executable Bash Script

Your job will use a bash script as the HTCondor `executable`. This script 
will contain all the steps needed to unpack the Julia binaries and 
execute your Julia script (`script.jl`). Below are two example bash script, 
one which can be used to execute a script with base Julia, and one that 
will use packages installed in Julia project (see [Install Julia Packages](#install-julia-packages)).

### Example Bash Script For Base Julia Only

If your Julia script can run without additional packages (other than base Julia and 
the Julia Standard library) use the example script directly below.

```
#!/bin/bash

# julia-job.sh

# extract Julia binaries tarball
tar -xzf julia-#.#.#-linux-x86_64.tar.gz

# add Julia binary to PATH
export PATH=$_CONDOR_SCRATCH_DIR/julia-#-#-#/bin:$PATH

# run Julia script
julia my-script.jl
```
{:.file}

### Example Bash Script For Julia With Installed Packages

```
#!/bin/bash

# julia-job.sh

# extract Julia binaries tarball
tar -xzf julia-#.#.#-linux-x86_64.tar.gz
tar -xzf my-project.tar.gz

# add Julia binary to PATH
export PATH=$_CONDOR_SCRATCH_DIR/julia-#-#-#/bin:$PATH
# add Julia packages to DEPOT variable
export JULIA_DEPOT_PATH=$_CONDOR_SCRATCH_DIR/my-project

# run Julia script
julia --project=my-project my-script.jl
```
{:.file}

## Create HTCondor Submit File 

After creating a bash script to run Julia, then create a submit file 
to submit the job to run. 

More details about setting up a submit file, including a submit file template, 
can be found in our hello world example page at [Run Your First CHTC Jobs](helloworld.md).

``` {.sub}
# julia-job.sub

universe = vanilla

log = job_$(Cluster).log
error = job_$(Cluster)_$(Process).err
output = job_$(Cluster)_$(Process).out

executable = julia-job.sh

should_transfer_files = YES
when_to_transfer_output = ON_EXIT
transfer_input_files = julia-#.#.#-linux-x86_64.tar.gz, script.jl

request_cpus = 1
request_memory = 2GB
request_disk = 2GB

queue 1
```

If your Julia script needs to use packages installed for a project, 
be sure to include `my-project.tar.gz` as in input file in `julia-job.sub`. 
For project tarballs that are <100MB, you can follow the below example:

``` {.sub}
transfer_input_files = julia-#.#.#-linux-x86_64.tar.gz, script.jl, my-project.tar.gz
```

Modify the CPU/memory request lines to match what is needed by the job. 
Test a few jobs for disk space/memory usage in order to make sure your 
requests for a large batch are accurate! Disk space and memory usage can be found in the 
log file after the job completes.

## Submit Your Julia Job

Once you have created an executable bash script and submit file, you can 
submit the job to run using the following command:

```
[alice@submit]$ condor_submit julia-job.sub
```
{:.term}
