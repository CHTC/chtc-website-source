---
highlighter: none
layout: hpc_layout
title: Using Custom Modules with Spack
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

1. [Location of the Module Files](#1-location-of-the-module-files)
2. [Creating Custom Modules Using Spack](#2-creating-custom-modules-using-spack)
3. [Using Custom Modules](#3-using-custom-modules)
4. [Working with Multiple Environments](#4-working-with-multiple-environments)

# 1. Location of the Module Files

In order to load a software package using the `module` command, there must be a corresponding "module file" containing the information that the `module` command needs in order to load the software package. Spack will automatically generate the required content of the module files, but Spack will need to know where these module files should be saved. Similarly, the `module` command will need to know where the module files are stored.

If you followed the instructions in [Setting Up Spack on HPC](hpc-spack-setup.md), then **the default location of your module files is `/home/yourNetID/spack_modules`** where `yourNetID` is your NetID. 

> **If you are using a shared installation of Spack for a group**, and if the person who set up the installation followed the instructions in [Setting Up Spack on HPC](hpc-spack-setup.md), then the default location of the shared module files is likely `/home/groups/yourGroupName/spack_modules`. You can confirm this by running the command `spack config get modules | grep -A 2 'roots'` and examining the listed paths (make sure you do not have a Spack environment activated when you do so). If the paths are `/home/$user/spack_modules`, then you should follow the instructions in [iii. Updating location of module files](hpc-spack-setup.md#iii-updating-location-of-module-files) in [Setting Up Spack on HPC](hpc-spack-setup.md) before proceeding.

# 2. Creating Custom Modules Using Spack

***Spack will automatically create the module files for you when you install your software packages, and save the files to the location described above.*** 

If you'd like to manually update the module files, you should first activate the Spack environment in which you installed the packages as instructed in [Installing Software Using Spack](hpc-spack-install.md). Then, to create or update the module files, simply enter the following command:

```
spack module tcl refresh
```
{:.term}

Spack will print out a list of all the packages installed in the current environment, and you'll be asked to confirm if you wish to create module files for all of these packages. If you have made changes to the Spack configuration for module files, then you may need to include the `--delete-tree` option, i.e.

```
spack module tcl refresh --delete-tree
```
{:.term}

which will make sure to remove the older module files. This is especially necessary if you have changed the configuration for where the module files 

# 3. Using Custom Modules

To update the `module` command with the location of the new module files, run the command

```
module use ~/spack_modules
```
{:.term}

> For a group installation of Spack, you'll need to modify the `module use` command to specify the path to your group's directory. The following should work if your group followed our instructions when setting up Spack:
>
> ```
> module use /home/groups/yourGroupName/spack_modules
> ```
> {:.term}

Now if you run `module avail` you should see the your custom modules listed in the first section, with the system modules listed in the following section. You can then use the `module load` command as usual to load your custom module for use in the current terminal session.

To have your custom modules found automatically by the `module` command, add the above `module use` command to the end of your `~/.bash_profile` file. 


# 4. Working with Multiple Environments

If you have more than one Spack environment that you wish to create modules for, we recommend that you modify the above procedure in order to better organize the list of modules.

For each environment that you wish to create module files for, activate the environment and then edit the configuration so that the module files are saved into a sub-directory named for that environment. For example,

```
spack env activate my-first-env
spack config add modules:default:roots:tcl:/home/\$user/spack_modules/my-first-env
```
{:.term}

first activates `my-first-env` and then updates the configuration to save the module files to `/home/yourNetID/spack_modules/my-first-env`. 

> For a group installation of Spack, you should instead specify the path to your group's directory. For example,
>
> ```
> spack env activate my-first-env
> spack config add modules:default:roots:tcl:/home/groups/yourGroupName/spack_modules/my-first-env
> ```
> {:.term}
>
> You should similarly modify the following commands to account for the different paths.

Repeat the process for your other environments.

To use the modules for a particular environment, run the `module use` command but specify the path to the environment's subdirectory. Continuing with our example,

```
module use ~/spack_modules/my-first-env
```
{:.term}

will update the `module` command with the location of the modules for using `my-first-env`. 

If you want to switch environments, we recommend that you "unuse" the first environment and then "use" the second, i.e.

```
module unuse ~/spack_modules/my-first-env
module use ~/spack_modules/my-second-env
```
{:.term}

While you can have more than one environment in "use" by the `module` command, this increases the chance of loading modules with conflicting dependencies that could result in unexpected behavior.
