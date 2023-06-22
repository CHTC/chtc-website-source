---
highlighter: none
layout: hpc_layout
title: Creating Custom Modules Using Spack
guide:
  order: 3
  category: Software Solutions
  tag:
    -hpc
---

CHTC uses Spack ([https://github.com/spack/spack](https://github.com/spack/spack)) for installing and managing software packages on the HPC cluster for all users to use, via the `module` command (see [Using Software on the HPC Cluster](hpc-software.md)). Recently, Spack has developed a feature that allows for users to integrate their local installation of Spack with the system-wide installation. This means that when a user installs software with their local installation of Spack, they can automatically incorporate the system-wide packages to satisfy their software's dependencies. 

**This guide describes how to create and use custom modules for software packages installed using Spack.** For instructions on how to install software using Spack, see our guide [Installing Software Using Spack](hpc-spack-install.md). 

> If your group has already set up a shared group installation of Spack, make sure that you have followed the instructions in [3. Using a Shared Group Installation](hpc-spack-setup.md#3-using-a-shared-group-installation) in [Setting Up Spack on HPC](hpc-spack-setup.md) before using this guide.

# Contents

1. [Creating Custom Modules Using Spack](#3-creating-custom-modules-using-spack)
4. [Using Custom Modules](#4-using-custom-modules)

# 1. Location of the Module Files

In order to load a software package using the `module` command, there must be a corresponding "module file" containing the information that the `module` command needs in order to load the software package. Spack will automatically generate the required content of the module files, but Spack will need to know where these module files should be saved. Similarly, the `module` command will need to know where the module files are stored.

If you followed the instructions in [Setting Up Spack on HPC](hpc-spack-setup.md), then **the default location of your module files is `/home/yourNetID/spack_modules`** where `yourNetID` is your NetID. 

> **If you are using a shared installation of Spack for a group**, and if the person who set up the installation followed the instructions in [Setting Up Spack on HPC](hpc-spack-setup.md), then the default location of the shared module files is likely `/home/groups/yourGroupName/spack_modules`. You can confirm this by running the command `spack config get modules | grep -A 2 'roots'` and examining the listed paths. If the paths are `/home/$user/spack_modules`, then you should follow the instructions in [iii. Updating location of module files](hpc-spack-setup.md#iii-updating-location-of-module-files) in [Setting Up Spack on HPC](hpc-spack-setup.md) before proceeding.

# 1. Installing Software Using Spack

Once your local installation of Spack has been properly configured, you are now ready to install software using Spack. The following describes the general process for installing program packages with Spack. Check the documentation for the program you want to install to see if they have instructions for installation using Spack. Even if your program can't be installed using Spack, you can still use it to install the dependencies that your program needs. 

## A. Creating and Using a Spack Environment

Software installations with Spack should be done inside of a Spack environment, to help manage the shell and paths to access programs and libraries needed for a particular software installation. 

To create a Spack environment, run the command

```
spack env create yourEnvironmentName
```
{:.term}

where you should replace `yourEnvironmentName` with your desired name for the environment. You can then activate the environment with 

```
spack env activate yourEnvironmentName
```
{:.term}

You will need to activate the environment when you wish to use the software that was installed in that environment.

> You can see a list of your available environments using 
> 
> ```
> spack env list
> ```
> {:.term}
> 
> and you can see which environment you are currently using with
> 
> ```
> spack env status
> ```
> {:.term}
> 
> To deactivate the environment, run
> 
> ```
> spack env deactivate
> ```
> {:.term}
> 
> or close the terminal session. 

## B. Finding Program Packages in Spack

To see what packages are installed in the current Spack environment, run the command

```
spack find
```
{:.term}

For a new environment, this will show that there are no programs installed.  The output of this command will update after you install program packages in the environment.

To search for packages to install using Spack, use the command

```
spack list nameOfProgram
```
{:.term}

where you should replace `nameOfProgram` with the program that you are interested in finding. Spack will search for the package and print out a list of all the packages that match that name. (The first time you run this command may take several minutes while Spack downloads a current list of packages that can be installed.) Alternatively, you can browse their website for currently available packages: [https://spack.readthedocs.io/en/latest/package_list.html](https://spack.readthedocs.io/en/latest/package_list.html). 

To learn more about an available package, use the exact name of the program and run

```
spack info exactNameOfProgram
```
{:.term}

This will print out information about the program, including a short description of the program, a link to the developer's website, and the available versions of the program and its dependencies.

## C. Adding Package Specifications to the Environment

Once you find the packages that you want to install, add their specifications to the environment using

```
spack add exactNameOfProgram
```
{:.term}

Spack will automatically decide which version of the program to use at installation time based on the other packages that you've added. 

If you want a specific version of a package, you can specify it by appending `@=` to the end of the package name, followed by the version number. For example, 

```
spack add python@=3.10
```
{:.term}

will tell the environment that you want to install version 3.10 of Python. There are additional ways of defining specifications for package versions, the compiler to be used, and dependencies. The [documentation for Spack](https://spack.readthedocs.io/en/latest/basic_usage.html#specs-dependencies) provides the details on how this is done. 

*If you need to install a compiler, or need to use a specific compiler to install the desired packages, see the section [E. Installing and Using a Specific Compiler](#e-installing-and-using-a-specific-compiler).*

## D. Installing a Package

Once you have identified the package(s) you would like to install and have added the specifications to your environment, you should start an interactive Slurm session for the actual installation and compilation of the package. 

### i. Start an interactive session

Use the following command to start the interactive session:

```
srun --mpi=pmix -n4 -N1 -t 240 -p int --pty bash
```
{:.term}

Note the number associated with `-n`, as that is the number of processors you are requesting to use. This number will be used later in the install command itself to specify the number of threads to use for the installation and compiling.  For large and complex installations, you may want to increase the number of processors (and correspondingly the number of threads) to speed up the process.

Next, remember to reload the Spack environment

```
spack env activate yourEnvironmentName
```
{:.term}

since the interactive session will start with the environment deactivated.

### ii. Create the local scratch directory

Using the configurations we defined above, Spack will try to use the machine's local disk space for staging and compiling files before transferring the finished results to the final installation directory.  Using this space will greatly improve the speed of the installation process.

```
mkdir /local/yourNetID/spack_build
```
{:.term}

At the end of the session, remember to delete this directory so that other people can use the disk space in their jobs. 

> If the directory already exists, that means you forgot to remove it after one of your previous Spack installation sessions.  Simply remove the directory and make it again.
>
> ```
> rm -rf /local/yourNetID/spack_build
> mkdir /local/yourNetID/spack_build
> ```
> {:.term}

### iii. Check the programs/packages to be installed

If you've added the installation specifications to the environment, then you can check the installation plan using the command

```
spack spec -lI
```
{:.term}

(the first letter after the hyphen is lowercase "L" and the second letter is the uppercase "i").

This command identifies what dependencies Spack needs in order to install your desired packages along with how it will obtain them.  Assuming their are no problems, then it will print a list of the packages and their dependencies, where entries that begin with a green `[+]` have already been installed somewhere in your local copy, while those that begin with a green `[^]` are referencing the system installation, and those beginning with a gray `-` will need to be downloaded and installed.  

If you are satisfied with the results, then you can proceed to install the programs.

### iv. Install the environment packages

Assuming that you are in an interactive Slurm session & have activated the desired environment containing the package specifications, you can run

```
spack install -j 4
```
{:.term}

to install the packages inside of the Spack environment, where the number that comes after `-j` needs to match the number that you noted from when you started the interactive session (the one after `-n` when you ran the `srun` command for the interactive session). You can also add the `-v` option to have the installation be verbose, which will cause Spack to print the compile & make outputs in addition to the standard Spack output.

Depending on the number & complexity of the programs you are installing, and how much can be bootstrapped from the system installation, the installation step can take anywhere from several minutes to several hours. 

> If something goes wrong or your connection is interrupted, the installation process can be resumed at a later time without having to start from scratch. Make sure that you are in an interactive Slurm session & that you have activated the Spack environment, then simply rerun the `spack install` command again.

### v. Finishing the installation

After the installation has successfully finished, you should be able to see that the programs have been installed by running 

```
spack find
```
{:.term}

which should list the programs under the compiler heading used for installing the programs.

You may need to deactivate and reactivate the environment in order to properly use the programs that have been installed.

```
spack env deactivate
spack env activate yourEnvironmentName
```
{:.term}

Once you are satisfied that the programs have been installed properly, you can remove the local build directory that Spack used during the installation with

```
rm -rf /local/yourNetID/spack_build
```
{:.term}

and then enter `exit` to end the interactive session.

To use the packages that you installed, follow the instructions in [4. Using Software Installed using Spack](4-using-software-installed-using-spack).

# 2. Using Software Installed Using Spack

If your account is configured correctly for using Spack, and the software has been installed inside of a Spack environment, then to use the software all you need to do is activate the corresponding environment. Simply use the command

```
spack env activate yourEnvironmentName 
```
{:.term}

and Spack will update your shell accordingly. If you want to see the available Spack environments, enter `spack env list`. 

For submitting jobs through Slurm, you will need to add this command to the beginning of your `sbatch` file before the `srun` command. For example,

```
#!/bin/sh
#This file is called submit-script.sh
#SBATCH --partition=shared       # default "shared", if not specified
#SBATCH --time=0-04:30:00       # run time in days-hh:mm:ss
#SBATCH --nodes=1               # require 1 nodes
#SBATCH --ntasks-per-node=64    # cpus per node (by default, "ntasks"="cpus")
#SBATCH --mem-per-cpu=4000             # RAM per node in megabytes
#SBATCH --error=job.%J.err
#SBATCH --output=job.%J.out

spack env activate yourEnvironmentName

srun --mpi=pmix -n 64 /home/username/mpiprogram
```

When Slurm executes this `sbatch` file, it will first activate the Spack environment, and then your program will be run using the programs that are installed inside that environment.

# 3. Creating Custom Modules Using Spack

# 4. Using Custom Modules

# 5. Installing and Using a Specific Compiler

***!!!Needs to be updated!!!***

Using the configuration files above, Spack will attempt to install these packages using the system compilers, most likely `gcc@=11.3.0`. If your program requires that a specific compiler be used, you will need to first add *and* install the compiler before adding the other packages. To use version 9 of `gcc`, you would find which exact versions are available and decide which to use. For example,

```
spack add gcc@=9.5.0
```

{:.term}

Then follow the instructions in the [next section](#d-installing-a-package) to install the compiler. Once the compiler has been installed, you then need to add the compiler to Spack's list of available compilers using

```
spack compiler add "$(spack location -i gcc@=9.5.0)"
```

{:.term}

Once the compiler has been installed and recognized, you can now add the packages that need to be compiled with it. Use the compiler specification `%` to specify this compiler for use during installation. For example,

```
spack add python@=3.10 %gcc@=9.5.0
```

{:.term}

will use `gcc` version 9.5.0 to compile Python 3.10 when installing the package. As a general rule, you should use the same compiler for installing all of your packages within an environment, unless your program's installation instructions say otherwise.
