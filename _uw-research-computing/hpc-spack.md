---
highlighter: none
layout: hpc_layout
title: Installing Software using Spack
guide:
  order: 1
  category: Software Solutions
  tag:
    -hpc
---

CHTC uses Spack ([https://github.com/spack/spack](https://github.com/spack/spack)) for installing and managing software packages on the HPC cluster for all users to use, via the `module` command (see [Using Software on the HPC Cluster](hpc-software.md)). Recently, Spack has developed a feature that allows for users to integrate their local installation of Spack with the system-wide installation. This means that when a user installs software with their local installation of Spack, they can automatically incorporate the system-wide packages to satisfy their software's dependencies. This guide describes how to install a local copy of Spack, integrate it with the system installation, and install and manage software using their local installation. 

> If your group has already set up a shared group installation of Spack, you can skip to the end of this guide: [Using a shared group installation](#using-a-shared-group-installation).

# Contents

1. [Installing Spack](#1-installing-spack) 
2. [Configuring Spack](#2-configuring-spack) 
3. [Installing Software using Spack](#3-installing-software-using-spack)
4. [Using Software Installed using Spack](#4-using-software-installed-using-spack)

# 1. Installing Spack

Spack is a package manager for installing and - more importantly - compiling software. To get started, first log in to the HPC cluster. You can then install Spack following its [documentation](https://spack.readthedocs.io/en/latest/getting_started.html):

```
git clone -c feature.manyFiles=true https://github.com/spack/spack.git
. spack/share/spack/setup-env.sh
```
{:.term}

That's it! You can test that Spack has been installed by entering `spack` and you should see the help text print out.

> For installing Spack to be shared across a group, you should run these commands in the group's home directory, i.e. `/home/groups/yourGroupDirectory/`. Note this path for use throughout this guide, and communicate it to your group members for configuring their access to the installation.

# 2. Configuring Spack

## A. Using Spack in Future Sessions

While Spack has been installed, for each session that you want to use it you will need to rerun the command

```
. spack/share/spack/setup-env.sh
```
{:.term}

A more convenient option is simply to update your account to run this command whenever you log in. Add the command to the end of the `.bash_profile` file in your home directory, e.g. `nano ~/.bash_profile`, with the full path to the file.  If you ran the `git clone` command in your home directory, then the line you add should be

```
. /home/yourNetID/spack/share/spack/setup-env.sh
```

> For a group installation of Spack, the line that you add to your `.bash_profile` should look like
>
> ```
> . /home/yourGroupDirectory/spack/share/spack/setup-env.sh
> ```
>
> Have the other members of your group also add this line to their `.bash_profile` to get access to the group installation.

## B. Create a Directory for the Configuration Files

By default, Spack will look for the user's configuration files within the hidden folder `.spack` located in your home directory, i.e. `/home/yourNetID/.spack`. Before proceeding, you need to create this directory:

```
mkdir ~/.spack
```
{:.term}

> For a group installation of Spack, you should create this directory in the same location that you ran the `git clone` command, i.e.
>
> ```
> mkdir /home/groups/yourGroupDirectory/.spack
> ```
> {:.term}
>
> Wherever you create it, you will need to instruct Spack on where to find the configuration files. Do this by running the command 
>
> ```
> export SPACK_USER_CONFIG_PATH=/home/groups/yourGroupDirectory/.spack
> ```
> {:.term}
>
> and modify the path as necessary. Then you and your group members should add this command to the end of the `.bash_profile` file in your respective home directories, similar to that done in the [previous section](#a-using-spack-in-future-sessions). 

## C. Link to the System Installation

At this point, your copy of Spack doesn't know that there is a system installation of Spack that it can use for installing your software packages. You can confirm this by running

```
spack find
```
{:.term}

and you will see that there are no packages installed at this time.

### i. Link system packages

In the `.spack` directory that you created in the [previous section](#b-create-a-directory-for-the-configuration-files), create a file called `upstreams.yaml`. Add the following lines to the file:

```
upstreams:
	spack-instance-1:
		install_tree: /software/chtc/spack/software
```

Now if you run `spack find` again, you should see a list of system-wide installed packages.  Spack can use these packages to satisfy the dependencies for installing your own software.

>  For a group installation of Spack, this configuration will be automatically found if the `SPACK_USER_CONFIG_PATH` is properly set, as described [above](#b-create-a-directory-for-the-configuration-files).

### ii. Link system compilers

In the `.spack` directory that you created in the [previous section](#b-create-a-directory-for-the-configuration-files), create the directory `linux` and move into it:

```
mkdir linux
cd linux
```
{:.term}

Then run the following command to generate the configuration file needed to access the system compilers:

```
/software/chtc/spack/software/spack/v0.19/bin/spack config get compilers > compilers.yaml
```
{:.term}

Confirm that Spack has access to the system compilers by running `spack compiler list`, which should show `aocc@=3.2.0` and `gcc@=11.3.0` in the printout.

> For a group installation of Spack, this configuration will be automatically found if the `SPACK_USER_CONFIG_PATH` is properly set, as described [above](#b-create-a-directory-for-the-configuration-files).

## D. Configure Installation Paths

Next, decide where in your home directory you want to have your programs installed (remember that the `/home` directory is for storing software programs). We recommend that you create a directory `spack_programs` in your home directory to hold the software you install using Spack. You will need to communicate this location to Spack with another configuration file. 

In the `.spack` directory that you created [above](#b-create-a-directory-for-the-configuration-files), create the file `config.yaml` and add the following lines:

```
config:
	install_tree:
		root: /home/yourNetID/spack_programs
	build_stage:
		- /local/$user/spack_build
		- /scratch/$user/spack_build
```

The path listed after `root:` under the `install_tree` section is the directory where you want to have your programs installed; modify as you desire. The paths listed under the `build_stage` section should not be modified.

> For a group installation of spack, the installation directory should be within `/home/groups/yourGroupDirectory`. Modify the path after `root:` to match this location. This configuration will be automatically found if the `SPACK_USER_CONFIG_PATH` is properly set, as described [above](#b-create-a-directory-for-the-configuration-files).

# 3. Installing Software using Spack

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

You can see a list of your available environments using 

```
spack env list
```
{:.term}

and you can see which environment you are currently using with

```
spack env status
```
{:.term}

To deactivate the environment, run

```
spack env deactivate
```
{:.term}

or close the terminal session. 

You will need to activate the environment when you wish to use the software that was installed in that environment.

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

This will print out information about the program, including a short description of the program, a link to the developer's website, the available versions of the program and its dependencies.

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

> **Note regarding compilers**: Using the configuration files above, Spack will attempt to install these packages using the system compilers, most likely `gcc@=11.3.0`. If your program requires that a specific compiler be used, you will need to first add *and* install the compiler before adding the other packages. To use version 9 of `gcc`, you would find which exact versions are available and decide which to use. For example,
>
> ```
> spack add gcc@=9.5.0
> ```
> {:.term}
>
> Then follow the instructions in the [next section](#d-installing-a-package) to install the compiler. Once the compiler has been installed, you then need to add the compiler to Spack's list of available compilers using
>
> ```
> spack compiler add "$(spack location -i gcc@=9.5.0)"
> ```
> {:.term}
>
> Once the compiler has been installed and recognized, you can now add the packages that need to be compiled with it. Use the compiler specification `%` to specify this compiler for use during installation. For example,
>
> ```
> spack add python@=3.10 %gcc@=9.5.0
> ```
> {:.term}
>
> will use `gcc` version 9.5.0 to compile Python 3.10 when installing the package. As a general rule, you should use the same compiler for installing all of your packages within an environment, unless your program's installation instructions say otherwise.

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

#### v. Finishing the installation

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

## 4. Using Software Installed using Spack

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

### Using a shared group installation

Users who want to use a shared group installation of Spack, but who did not set up the installation, only need to modify their `~/.bash_profile` file with instructions regarding the path to the shared group installation and its configuration files.

1. Log in to the HPC cluster ([Connecting to CHTC](connecting.md)).
   ```
   ssh yourNetID@hpclogin3.chtc.wisc.edu
   ```
   {:.term}

2. Edit the `.bash_profile` file in your home directory (`/home/yourNetID`).
   You should be able to simply add the following two lines to the end of the file

   ```
   . /home/groups/yourGroupDirectory/spack/share/spack/setup-env.sh
   export SPACK_USER_CONFIG_PATH=/home/groups/yourGroupDirectory/.spack
   ```

   where `yourGroupDirectory` should be replaced with the name of your group directory. Confirm the exact commands with the user who installed Spack for your group. 

   > You should be able to find the requisite paths if necessary. For the first line, the command
   > ```
   > find /home/groups/yourGroupDirectory -type d -name spack | grep "share/spack"
   > ```
   > {:.term}
   >
   > should give the path you need; simply add "setup-env.sh" to the end of the path. For the second line, the command 
   > ```
   > find /home/groups/yourGroupDirectory -type d -name .spack | sort -n | head -n 1
   > ```
   > {:.term}
   >
   > should give the path you need. If it doesn't, try again without `| sort -n | head -n 1` to see the full list of matches, and choose the appropriate one.

3. Source the `.bash_profile` with
   ```
   . ~/.bash_profile
   ```
   {:.term}

   or else close the terminal and log in again.

Once configured, you can follow the instructions in this section to use the shared installation.
