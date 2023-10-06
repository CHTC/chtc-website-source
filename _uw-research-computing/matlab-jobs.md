---
highlighter: none
layout: guide
title: Running Matlab Jobs
guide:
    order: 1
    category: Software Solutions
    tag:
        - htc
---


**To best understand the below information, users should already have an understanding of:**

-   Using the command line to: navigate within directories, create/copy/move/delete files and directories, and run their intended programs (aka \"executables\").
-   [The CHTC's Intro to Running HTCondor Jobs](helloworld.html)

Overview
========

Like most programs, Matlab is not installed on CHTC\'s high throughput
compute system. One way to run Matlab where it isn\'t installed is to
compile Matlab `.m` files into a binary file and run the binary by using
a set of files called the Matlab runtime. In order to run Matlab in
CHTC, it is therefore necessary to perform the following steps which
will be detailed in the guide below (click on the links to go to the
relevant section):

1.  [Prepare your Matlab program](#prepare)
    -   [Compile your Matlab code](#compile)
    -   [Edit the script that runs Matlab](#script)
2.  [Write a submit file that uses the compiled code and script](#submit)

If your Matlab code depends on random number generation, using a
function like `rand` or `randperm`, please see the section on [ensuring
randomness](#random) below.


<span name="supported"></span>

Supported Versions of Matlab
============================

{:.gtable}
  | Matlab version  |
  | --- |
  | Matlab 2015b | 
  | Matlab 2018b |
  | Matlab 2022b | 


**A. Preparing Your Matlab Program** 
============================
<a name="prepare"></a>
You can compile `.m` files into a Matlab binary yourself by requesting
an interactive session on one of our build machines. The session is
essentially a job without an executable; **you** are the one running the
commands instead (in this case, to compile the code).


<span name="compile"></span>

**1. Start an Interactive Build Job**
---------------------------------

Start by uploading all of the Matlab code files (usually `.m`, *not*,
`.mat` files) that you need to run your code to the submit server.

> If you have many of Matlab code files (more than 1-5), it\'s a good
> idea to combine them into a `.tar.gz` file (like a zip file), so that
> you can simply transfer the single `.tar.gz` file for compiling the
> code. You can create a tar file by running this command:
> `tar -czf code.tar.gz files and folders`

Create the following special submit file on the submit server, calling
it something like `build.sub`.

``` {.sub}
# Matlab build file

universe = vanilla
log = interactive.log

# List all of your .m files, or a tar.gz file if you've combined them.
transfer_input_files = script.m, functions.tar.gz

+IsBuildJob = true
requirements = (OpSysMajorVer =?= 8)
request_cpus = 1
request_memory = 4GB
request_disk = 2GB

queue
```

Fill in the \"transfer\_input\_files\" line with *your* Matlab .m files,
or a tar.gz file with all of the Matlab files your code uses.

Once this submit file is created, you will start the interactive job by
running the following command:

```
[alice@submit]$ condor_submit -i build.sub
```
{:.term}

It may take a few minutes for the build job to start.

<span name="compile"></span>


**2. Compile Matlab Code and Exit Interactive Job**
-----------------------------------------------

Once the interactive job has started, you can compile your code. In this
example, `script.m` represents the name of the primary Matlab script;
you should replace `script.m` with the name of your own primary script.
Note that if your main script references other `.m` files, as long as
they are present in the working directory, they will all be compiled
together with the main script into one binary.

> If you combined your Matlab `.m` files into one `.tar.gz` file, make
> sure to \"un-tar\" that file before running the compiling steps below.

To access the Matlab compiler on the build node, you\'ll need to load a
the appropriate Matlab module. For Matlab 2015b, the module load command
will look like this:

``` 
[alice@build]$ module load MATLAB/R2015b
```
{:.term}

If you want to use a different version of Matlab, change the name after the `load` command. Once the
module is loaded, run the compilation command:

``` 
[alice@build]$ mcc -m -R -singleCompThread -R -nodisplay -R -nojvm script.m
```
{:.term}

> **Compilation Options**
>
> There are other options for the `mcc` Matlab compiler that might be
> necessary for specific compiling situations. For example, if your main
> .m script uses a set of Matlab functions or .m files that are
> contained in a subdirectory (called, say, `functions`), then your
> compiling command will need to use the `-a` flag at the end of the
> command like so:
>
> ``` 
> [alice@build]$ mcc -m \
>                 -R -singleCompThread -R -nodisplay -R -nojvm \
>                 script.m -a functions/
> ```
> {:.term}
>
> (The backslashes, \\, are there just to break up the full command.)
>
> If you have questions about compiling your particular code, [contact a
> facilitator](mailto:chtc@cs.wisc.edu) or see the [Matlab
> documentation](http://www.mathworks.com/help/compiler/mcc.html) for
> more information about using `mcc`.

Exit the interactive session after you have compiled your code:

``` 
[alice@build]$ exit
```
{:.term}

Condor will transfer your compiled code and its scripts back
automatically.

Back on the submit node, you should now have the following files:

``` 
[alice@submit]$ ls -l 

-rw-rw-r-- 1 user user 581724 Feb 19 14:21 mccExcludedFiles.log
-rwxrw-r-- 1 user user  94858 Feb 19 14:21 script
-rwxrw-r-- 1 user user   1024 Feb 19 14:00 script.m
-rw-rw-r-- 1 user user   3092 Feb 19 14:21 readme.txt
-rw-rw-r-- 1 user user 581724 Feb 19 14:21 requiredMCRProducts.txt
-rwxrw-r-- 1 user user   1195 Feb 19 14:21 run_script.sh
```
{:.term}

The file `script` is the compiled Matlab binary. You will not need the
`mccExcludedFiles.log`, `requiredMCRProducts.txt` or `readme.txt` to run
your jobs.

<span name="script"></span>

**3. Modifying the Executable**
---------------------------

The `mcc` command should have created a script called `run_*.sh` (where
\* is the name of your Matlab script; our example uses the name
`script`). This `run_*.sh` script will be the executable for your Matlab
jobs and already has almost all the necessary commands for running your
Matlab code.

You\'ll need to add one line at the beginning of the `run_*.sh` script
that unpacks the Matlab runtime. We\'ll also add some extra options to
ensure Matlab runs smoothly on any Linux system.

The commands that need to be added, and their location looks like this
(**replace `r2015b.tar.gz` with the appropriate version of Matlab, if
you used something different to compile**):

``` 
#!/bin/sh
# script for execution of deployed applications
#
# Sets up the MATLAB Runtime environment for the current $ARCH and executes 
# the specified command.

# Add these lines to run_script.sh
tar -xzf r2015b.tar.gz
mkdir cache
export MCR_CACHE_ROOT=$PWD/cache

# Rest of script follows
```
{:.file}




**B. Running Matlab Jobs**
======================
<span name="submit"></span>
This section shows the important elements of creating a submit file for
Matlab jobs. The submit file for your job will be different than the one
used to compile your code. As a starting point for a submit file, see
our \"hello world\" example:
[http://chtc.cs.wisc.edu/helloworld](helloworld.html). In what
follows, replace our example `script` and `run_script.sh` with the name
of your binary and scripts.

1. Use `run_script.sh` as the executable:
```{.sub}
executable = run_script.sh
```
2.  In order for your Matlab code to run, you will need to use a Matlab
    runtime package. This package is easily downloaded from CHTC\'s web
    proxy; the version **must** match the version you used to compile
    your code. Options available on our proxy include:
    
    -   `r2015b.tar.gz`
    -   `r2018b.tar.gz`
    -   `r2022b.tar.gz`<br>
    
    To send the runtime package to your jobs, list a link to the
    appropriate version in your `transfer_input_files` line, as well as
    your compiled binary and any necessary input files:
    ``` {.sub}
    transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/r2015b.tar.gz,script,input_data
    ```
3.  The `run_script.sh` will expect the runtime directory name to be
    provided as an argument specified in the submit file (as described
    in `readme.txt`).


    {:.gtable}
      | Matlab version | Runtime directory name |
      | --- | --- |
      | `r2015b.tar.gz` | `v90` |
      | `r2018b.tar.gz` | `v95` |
      | `r2022b.tar.gz` | `R2022b` | 
 
    So to run a Matlab job using `r2015b` and no additional arguments, the arguments line in the submit file should read:
    ```{:.sub}
    arguments = v90
    ```
    If you *are* passing additional arguments to the script, they can go after the first \"runtime\" argument:

    ``` {.sub}
    arguments = v90 $(Cluster) $(Process) 
    ```
    **If you are passing numerical values as arguments to your Matlab binary, you will need to revise your Matlab 
    code so that the values are interpreted as numbers instead of as characters (the default).** To do this, you can use that Matlab 
    `str2num` function, more information is available at [Matlab Str2num](https://www.mathworks.com/help/matlab/ref/str2num.html).
    
4.  As always, test a few jobs for disk space/memory usage in order to
    make sure your requests for a large batch are accurate! Disk space
    and memory usage can be found in the log file after the job
    completes. **If you are using Matlab 2018b or 2022b, request at least 8-10GB
    of DISK** as the runtime is very large for this version of Matlab.

<span name="random"></span>

Ensuring Randomness
===================

This section is only relevant for Matlab scripts that use Matlab\'s
random number functions like `rand`.

Whenever Matlab is started for the first time on a new computer, the
random number generator begins from the same state. When you run
multiple Matlab jobs, each job is using a copy of Matlab that is being
used for the first time \-- thus, every job will start with the same
random number generator and produce identical results.

There are different ways to ensure that each job is using different
randomly generated numbers. [This Mathworks
page](http://www.mathworks.com/help/matlab/math/why-do-random-numbers-repeat-after-startup.html?refresh=true)
describes one way to \"reset\" the random number generator so that it
produces different random values when Matlab runs for the first time.
Deliberately choosing your own different random seed values for each job
can be another way to ensure different results.

