---
highlighter: none
layout: hpc_layout
title: Installing Software Using Spack
guide:
  order: 2
  category: Software Solutions
  tag:
    -hpc
---

CHTC uses Spack ([https://github.com/spack/spack](https://github.com/spack/spack)) for installing and managing software packages on the HPC cluster for all users to use, via the `module` command (see [Using Software on the HPC Cluster](hpc-software.md)). Recently, Spack has developed a feature that allows for users to integrate their local installation of Spack with the system-wide installation. This means that when a user installs software with their local installation of Spack, they can automatically incorporate the system-wide packages to satisfy their software's dependencies. 

**This guide describes how to install and manage software using Spack, including how to install and use a specific compiler.** If you or your group still need to set up your local installation of spack, see our other guide, [Setting Up Spack on HPC](hpc-spack-setup.md).

> If your group has already set up a shared group installation of Spack, make sure that you have followed the instructions in [3. Using a Shared Group Installation](hpc-spack-setup.md#3-using-a-shared-group-installation) in [Setting Up Spack on HPC](hpc-spack-setup.md) before using this guide.

# Contents

1. [Installing Software Using Spack](#1-installing-software-using-spack)
2. [Using Software Installed in Spack](#2-using-software-installed-in-spack)
5. [Installing and Using a Specific Compiler](#3-installing-and-using-a-specific-compiler)

# 1. Installing Software Using Spack

Once your local installation of Spack has been properly configured, you are now ready to install software using Spack. The following describes the general process for installing program packages with Spack. Check the documentation for the program you want to install to see if they have instructions for installation using Spack. Even if your program can't be installed using Spack, you can still use it to install the dependencies that your program needs. 

## A. Creating and Using a Spack Environment

Software installations with Spack should be done inside of a Spack environment, to help manage the shell and the paths to access programs and libraries needed for a particular software installation. 

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

*If you need to install a compiler, or need to use a specific compiler to install the desired packages, see section [3. Installing and Using a Specific Compiler](#3-installing-and-using-a-specific-compiler).*

## D. Installing Packages in an Environment

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

Using the default configuration from [Setting Up Spack on HPC](hpc-spack-setup.md), Spack will try to use the machine's local disk space for staging and compiling files before transferring the finished results to the final installation directory.  Using this space will greatly improve the speed of the installation process. Create the local directory with the command

```
mkdir /local/yourNetID/spack_build
```
{:.term}

where you should replace `yourNetID` with your NetID. At the end of the session, remember to delete this directory so that other people can use the disk space in their jobs. 

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

(the first letter after the hyphen is a lowercase "L" and the second letter is an uppercase "i").

This command identifies what dependencies Spack needs in order to install your desired packages along with how it will obtain them.  Assuming their are no problems, then it will print a list of the packages and their dependencies, where entries that begin with a green `[+]` have already been installed somewhere in your local Spack installation, while those that begin with a green `[^]` are referencing the system installation, and those beginning with a gray `-` will need to be downloaded and installed.  

If you are satisfied with the results, then you can proceed to install the programs.

### iv. Install the environment packages

Assuming that you are in an interactive Slurm session and have activated the desired environment containing the package specifications, you can run

```
spack install -j 4
```
{:.term}

to install the packages inside of the Spack environment, where the number that comes after `-j` needs to match the number that you noted from when you started the interactive session (the one after `-n` when you ran the `srun` command for the interactive session). You can also add the `-v` option to have the installation be verbose, which will cause Spack to print the compile and make outputs in addition to the standard Spack output.

Depending on the number and complexity of the programs you are installing, and how much can be bootstrapped from the system installation, the installation step can take anywhere from several minutes to several hours. 

> If something goes wrong or your connection is interrupted, the installation process can be resumed at a later time without having to start over from the beginning. Make sure that you are in an interactive Slurm session and that you have activated the Spack environment, then simply rerun the `spack install` command again.

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

Once you are satisfied that the programs have been installed properly, you can remove packages that are build-only (not used for running the packages you installed) using the command

```
spack gc
```
{:.term}

Finally, remove the local build directory that Spack used during the installation with

```
rm -rf /local/yourNetID/spack_build
```
{:.term}

and then enter `exit` to end the interactive session.

To use the packages that you installed, follow the instructions in the next section, [2. Using Software Installed in Spack](2-using-software-installed-in-spack). If you want to create custom modules using the installed packages, see our guide [Creating Custom Modules Using Spack](hpc-spack-modules.md).

## E. Removing an Environment and Uninstalling Unneeded Packages

You may find it necessary to remove a Spack environment, or packages installed using Spack. To uninstall a package, simply run

```
spack uninstall yourPackageName
```
{:.term}

where you should replace `yourPackageName` with the name of the package that you want to remove. This command will only work for packages that you 'added' to the Spack environment, as described above. 

To remove an environment, first make sure that you have deactivated the environment with

```
spack env deactivate
```
{:.term}

and then run

```
spack env rm yourEnvironmentName
```
{:.term}

where you should replace `yourEnvironmentName` with the name of the environment that you want to remove. Note that this will not necessarily remove the packages that were installed in the environment! After the environment has been removed, you can uninstall the packages that are no longer needed using the command

```
spack gc
```
{:.term}

# 2. Using Software Installed in Spack

If your account is configured correctly for using Spack, and the software has been installed inside of a Spack environment, then to use the software all you need to do is activate the corresponding environment. Simply use the command

```
spack env activate yourEnvironmentName 
```
{:.term}

and Spack will update your shell accordingly. (Remember that you can see the available Spack environments by running the command `spack env list`).  Once the environment has been activated, you should be able to use the packages just as normal. You can confirm you are using a command installed using Spack by running

```
which nameOfYourCommand
```
{:.term}

where you replace `nameOfYourCommand` with the name of the command. The command will output a path, and you should see something like `spack/var/spack/environments/yourEnvironmentName/` in that path.

**For submitting jobs using Slurm**, you will need to make sure that you activate the Spack environment near the beginning of your `sbatch` file before the `srun` command. For example,

```
#!/bin/sh
# This file is called submit-script.sh
#SBATCH --partition=shared       # default "shared", if not specified
#SBATCH --time=0-04:30:00        # run time in days-hh:mm:ss
#SBATCH --nodes=1                # require 1 nodes
#SBATCH --ntasks-per-node=64     # cpus per node (by default, "ntasks"="cpus")
#SBATCH --mem-per-cpu=4000       # RAM per node in megabytes
#SBATCH --error=job.%J.err
#SBATCH --output=job.%J.out

# v---Remember to activate your Spack environment!! 
spack env activate yourEnvironmentName

srun --mpi=pmix -n 64 /home/username/mpiprogram
```

When you submit this job to Slurm and it executes the commands in the `sbatch` file, it will first activate the Spack environment, and then your program will be run using the programs that are installed inside that environment.

> Some programs include explicit `module load` commands in their execution, which may override the paths provided by the Spack environment. If your program appears to use the system versions of the packages instead of the versions installed in your Spack environment, you may need to remove or modify these explicit commands. Consult your program's documentation for how to do so. You may want to create your own custom modules and modify your program to explicitly load your custom modules. See [Creating Custom Modules Using Spack](hpc-spack-modules.md) for more information on how to create your own modules using Spack.

# 3. Installing and Using a Specific Compiler

By default, Spack will attempt to compile packages it installs using one of the system compilers, most likely with GCC version 11.3.0. Some programs, however, may need to be compiled using a specific compiler, or require that their dependencies be built using a specific compiler. While this is possible using Spack, the process for installing and using a compiler is a bit more complicated than that for installing "regular" packages as was described above. 

In brief, you will first create a separate environment for installing the compiler. Then you will add that compiler to the list of available compilers that Spack can use. Finally, you can install your desired packages as in a new environment, but you will need to specify which compiler to use.

## A. Install the Compiler in its Own Environment

### i. Identify the compiler and version

The first step is to identify the compiler and version you need for your program. Consult your program's documentation for the requirements that it has. Then follow the instructions in [B. Finding Program Packages in Spack](#b-finding-program-packages-in-spack) to find the package name and confirm the version is available.

### ii. Create the compiler's environment

Next, create and activate an environment for installing the desired compiler. For example,

```
spack env create compilerName_compilerVersion
spack env activate compilerName_compilerVersion
```
{:.term}

where you should replace `compilerName` and `compilerVersion` with the name and version of the desired compiler.

### iii. Add the compiler specification to its environment

Once you've activated the environment, add the exact specification for the compiler to the Spack environment with

```
spack add compilerName@=compilerVersion
```
{:.term}

where you need to replace `compilerName` and `compilerVersion` with the name and version of the compiler that you identified above. 

### iv. Install the compiler in its environment

Next, follow the instructions in [D. Installing Packages in an Environment](#d-installing-packages-in-an-environment) to install the desired compiler in this environment. Installing the compiler may take several hours, so consider increasing the number of threads to speed up the installation.

## B. Add the Compiler to Spack

### i. Identify the compiler's installation path

After installing the compiler, you need to find its location. First, activate the compiler's environment with `spack env activate compilerName_compilerVersion`. Next, use the following command to save the path to the compiler as the shell variable `compilerPath`:

```
compilerPath=$(spack location -i compilerName@=compilerVersion)
```
{:.term}

where you need to replace `compilerName` and `compilerVersion` with the name and version of the compiler that you installed. You can see print out the path using the command `echo $compilerPath`. 

### ii. Give the compiler's path to Spack

Now that you know where the compiler is installed, deactivate the environment with `spack env deactivate`. Then run the following command to tell Spack to add the compiler to its list of available compilers:

```
spack compiler add $compilerPath
```
{:.term}

### iii. Confirm compiler has been added to Spack

The command

```
spack compiler list
```
{:.term}

will print out the list of compilers that Spack can use, and should now show `compilerName@compilerVersion` in the results.

## C. Install Packages Using the New Compiler

Once the compiler has been installed and recognized by Spack, you can now create and activate a new environment for installing your desired packages, following the instructions in [Installing Software Using Spack](#1-installing-software-using-spack). 

**To make sure the packages are installed using your desired compiler**, you need to include the compiler when you add the package specification to the environment ([C. Adding Package Specifications to the Environment](#c-adding-package-specifications-to-the-environment)). To include the compiler in the specification, you need to add the symbol `%` followed by the compiler name and version to the end of the `spack add` command. For example,

```
spack add python@=3.10 %gcc@=9.5.0
```
{:.term}

will use GCC version 9.5.0 to compile Python 3.10 when installing the package. As a general rule, you should use the same compiler for installing all of your packages within an environment, unless your program's installation instructions say otherwise.
