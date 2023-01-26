---
highlighter: none
layout: markdown-page
title: Compiling or Testing Code with an Interactive Job
---

**To best understand the below information, users should already have an
understanding of:**

-   Using the command line to: navigate within directories,
    create/copy/move/delete files and directories, and run their
    intended programs (aka \"executables\").
-   [The CHTC\'s Intro to Running HTCondor
    Jobs](helloworld.html)

Overview
========

This guide provides a generic overview of steps required to install
scientific software for use in CHTC. If you are using Python, R, or
Matlab, see our specific installation and use guides here: [Guides for
Matlab, Python and R](howto_overview.html).

It is helpful to understand a little bit about normal "batch" HTCondor jobs 
before submitting interactive jobs. Just like batch jobs, interactive jobs 
can transfer input files (usually copies of source code or the software you 
want to install) and will transfer new/updated files in the main working directory 
back to the submit node when the job completes. 

> One exception to the file transfers working as usual is when running an interactive 
> job that uses a Docker container. If any output files are generated inside an 
> interactive Docker job, they will not be copied back to the submit node when you 
> exist the interactive job. Contact the facilitation team for workarounds to this behavior. 

<a name="build"></a>

**1. Building a Software Installation**
===================================

You are going to start an interactive job that runs on the HTC build
servers. You will then install your packages to a folder and zip those
files to return to the submit server.

<a name="version"></a>

A. Submit an Interactive Job
----------------------------

First, download the source code for your software to the submit server.
Then create the following special submit file on the submit server,
calling it something like `build.sub`.

Note that you'll want to use `+IsBuildJob = true` to specifically match to CHTC's servers designated for compiling code (which include Matlab compilers and other compiling tools you may need). Compiling servers do not include specialized resources like GPUs, extreme amounts of RAM/disk, etc.; to build/test software in these cases, submit an interactive job without `+IsBuildJob`.

``` {.sub}
# Software build file

universe = vanilla
log = interactive.log

# change the name of the file to be the name of your source code
transfer_input_files = source_code.tar.gz

+IsBuildJob = true
# requirements = (OpSysMajorVer =?= 8)
request_cpus = 1
request_memory = 4GB
request_disk = 2GB

queue
```

The only thing you should need to change in the above file is the name
of the source code `tar.gz` file - in the \"transfer\_input\_files\"
line.

Once this submit file is created, you will start the interactive job by
running the following command:

``` 
[alice@submit]$ condor_submit -i build.sub
```
{:.term}

The interactive build job should start in about a minute. Once it has
started, the job has a time limit of four hours - if you need more time
to compile a particular code, talk to CHTC\'s Research Computing
Facilitators.

B. Install the Software
-----------------------

Software installation typically goes through a set of standard steps \--
configuration, then compilation (turning the source code into binary
code that the computer can understand), and finally \"installation\",
which means placing the compiled code into a specific location. In most
install instructions, these steps look something like:

```
./configure
make
make install
```
 {:.other}

There are two changes we make to this standard process. Because you are
not an administrator, you will want to create a folder for the
installation in the build job\'s working directory and use an option in
the configuration step that will install the software to this folder.

In what follows, **note that anything in italics is a name that you can
(and should!) choose to be more descriptive**. We use general names as
an example; see the LAMMPS case study lower down to see what you might
fill in for your own program.

1.  In the interactive job, create a new directory to hold your final
    software installation:

    ``` 
    [alice@build]$ mkdir program
    ```
    {:.term}

2.  You\'ll also want to un-tar the source code that you brought along,
    and `cd` into the source code folder.

    ``` 
    [alice@build]$ tar -xzf source_code.tar.gz
    [alice@build]$ cd source_code/
    ```
    {:.term}

3.  Our next step will be to configure the installation. This involves
    changing into the un-tarred source code directory, and running a
    configuration script. It\'s at this step that we change the final
    installation location of the software from its default, to be the
    directory we created in the previous step. In a typical configure
    script, this option is called the \"prefix\" and is given by the
    `--prefix` flag.

    ``` 
    [alice@build]$ ./configure --prefix=$_CONDOR_SCRATCH_DIR/program
    ```
    {:.term}

    Note that there are sometimes different options used. Some program
    use a helper program called `cmake` as their configuration script.
    Often the installation instructions for a program will indicate what
    to use as a prefix option, or, you can often run the configure
    command with the `--help` flag, which will have all the options
    which can be added to the configure command.

4.  After the configuration step, you\'ll run the steps to compile and
    install your program. This is usually these two commands:

    ``` 
    [alice@build]$ make
    [alice@build]$ make install
    ```
    {:.term}

5.  After this step, you can `cd` back up to the main working directory.

    ``` 
    [alice@build]$ cd ..
    ```
    {:.term}

6.  Right now, if we exit the interactive job, nothing will be
    transferred back because we haven\'t created any new **files** in
    the working directory, just the new sub-folder with our software
    installation. In order to transfer back our installation, we will
    need to compress it into a tarball file - not only will HTCondor
    then transfer back the file, it is generally easier to transfer a
    single, compressed tarball file than an uncompressed set of
    directories.

    Run the following command to create your own tarball of your
    packages:

    ``` 
    [alice@build]$ tar -czf program.tar.gz program/
    ```
    {:.term}

We now have our packages bundled and ready for CHTC! You can now exit
the interactive job and the tar.gz file with your software installation
will return to the submit server with you (this sometimes takes a few
extra seconds after exiting).

``` {.term}
[alice@build]$ exit 
```
{:.term}

<a name="case-study"></a>

**2. Case Study, Installing LAMMPS**
================================

First download a copy of LAMMPS and copy it to the submit server \-- in
this example, we\'ve used the \"stable\" version under \"Download a
tarball\": [LAMMPS download
page](https://lammps.sandia.gov/download.html)

Then, make a copy of the submit file above on the submit server,
changing the name of the file to be transferred to
`lammps-stable.tar.gz`. Submit the interactive job as described.

While waiting for the interactive build job to start, take a look at the
installation instructions for LAMMPS:

-   [LAMMPS Install
    Instructions](https://lammps.sandia.gov/doc/Build_cmake.html)

You\'ll see that the install instructions have basically the same steps
as listed above, with two changes:

1.  Instead of the \"configure\" step, LAMMPS is using the \"cmake\"
    command. This means that we\'ll need to find the equivalent to the
    `--prefix` option for cmake. Reading further down in the
    documentation, you can see that there\'s this option:

    ``` 
    -D CMAKE_INSTALL_PREFIX=path
    ```
    {:.other}

    This is exactly what we need to set the installation prefix.

2.  There\'s extra steps before the configure step \-- that\'s fine,
    we\'ll just add them to our list of commands to run.

With all these pieces together, this is what the commands will look like
to install LAMMPS in the interactive build job and then bring the
installed copy back to the submit server.

Create the folder for the installation:

``` 
[alice@build]$ mkdir lammps
```
{:.term}

Unzip and `cd` into a build directory:

```
[alice@build]$ tar -xf lammps-stable.tar.gz
[alice@build]$ cd lammps-stable
[alice@build]$ mkdir build; cd build 
```
{:.term}

Run the installation commands:

``` 
[alice@build]$ cmake -D CMAKE_INSTALL_PREFIX=$_CONDOR_SCRATCH_DIR/lammps ../cmake 
[alice@build]$ make
[alice@build]$ make install 
```
{:.term}

Move back into the main job directory and create a tar.gz file of the
installation folder.

``` 
[alice@build]$ cd ../..
[alice@build]$ tar -czf lammps.tar.gz lammps
[alice@build]$ exit
```
{:.term}

