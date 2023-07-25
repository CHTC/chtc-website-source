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

CHTC uses Spack ([https://github.com/spack/spack](https://github.com/spack/spack)) for installing and managing software packages on the HPC cluster for all users to use, via the `module` command. Recently, Spack has developed a feature that allows for users to integrate their local installation of Spack with the system-wide installation. This means that when a user installs software with their local installation of Spack, they can automatically incorporate the system-wide packages to satisfy their software's dependencies (similar to Conda and Miniconda). 

**This guide describes how to create and use custom personal and shared modules for software packages installed using Spack.** For instructions on how to install software using Spack for you and/or your research group, see our guide [Installing Software Using Spack](hpc-spack-install.md). 


# Contents

1. [Location of the Module Files](#1-location-of-the-module-files)
2. [Using Custom Modules](#2-using-custom-modules)
3. [Creating Custom Modules Using Spack](#3-creating-custom-modules-using-spack)
4. [Working with Multiple Environments](#4-working-with-multiple-environments)
5. [Using Hierarchy Based Modules](#5-using-hierarchy-based-modules)

# 1. Location of the Module Files

In order to load a software package using the `module` command, there must be a corresponding "module file" containing the information that the `module` command needs in order to load the software package. Spack will automatically generate the required content of the module files, but Spack will need to know where these module files should be saved. Similarly, the `module` command will need to know where the module files are stored.

If you followed the instructions in [Setting Up Spack on HPC](hpc-spack-setup.md), then **the default location of your module files is `/home/yourNetID/spack_modules`** where `yourNetID` is your NetID. 

> **If you are using a shared installation of Spack for a group**, and if the person who set up the installation followed the instructions in [Setting Up Spack on HPC](hpc-spack-setup.md), then the default location of the shared module files is likely `/home/groups/yourGroupName/spack_modules`. You can confirm this by running the command `spack config get modules | grep -A 2 'roots'` and examining the listed paths (make sure you do not have a Spack environment activated when you do so). If the paths are `/home/$user/spack_modules`, then you should follow the instructions in [iii. Updating location of module files](hpc-spack-setup.md#iii-updating-location-of-module-files) in [Setting Up Spack on HPC](hpc-spack-setup.md) before proceeding.

# 2. Using Custom Modules

Spack will automatically create module files for the packages that you explicitly install, in the location described above.

To update the `module` command with the default location of the new module files, run the command

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

***Note**: Spack will not automatically create module files for the "upstream" dependencies (packages already installed on the system). If your `module load` test does not work, follow the instructions in the next section to generate these additional module files.*

To have your custom modules found automatically by the `module` command, add the above `module use` command to the end of your `~/.bash_profile` file. 

# 3. Creating Custom Modules Using Spack

You may need to manually create the custom module files, especially after editing any of the modules configuration for Spack. To create the module files, first activate the desired environment with 

```
spack env activate yourEnvironmentName
```
{:.term}

(where you should replace `yourEnvironmentName` with the your environment name) and then enter the following command:

```
spack module tcl refresh
```
{:.term}

Spack will print out a list of all the packages installed in the current environment, and you'll be asked to confirm if you wish to create module files for all of these packages. 

To remove old module files, or to update the directory structure, add the option `--delete-tree`, i.e.

```
spack module tcl refresh --delete-tree
```
{:.term}

If you tried to load a module but received the error(s) *'Executing this command requires loading "{module file}" which failed while processing the following...'*, then you will need to generate the "upstream" module files in order to use your desired module. In this case, the following command should resolve the issue:

```
spack module tcl refresh --upstream-modules
```
{:.term}

> **Note**: You should only run this command inside of an activated Spack environment, otherwise you will be prompted to create module files for ALL Spack packages, including those installed system-wide, regardless of whether they are required dependencies!

Lastly, note that Spack will not directly create module files for software installed independently of Spack (for example, using `pip install`). 

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

# 5. Using Hierarchy Based Modules

There are two "flavors" of the `module` system: `tcl` and `lmod`. We use `tcl` for managing the system modules, and have recommended using `tcl` throughout this guide. The main difference between the two "flavors" of modules is that `tcl` uses a "flat" directory structure (all the module files are located in the same central directory) whereas `lmod` uses a "hierarchy" directory structure (where the module files are grouped by their compiler or MPI version). The hierarchal structure of `lmod` can be very useful in organizing duplicate module files that differ only by how they were compiled. 

To use the `lmod` style module files, you should first edit your modules configuration to enable `lmod` and disable `tcl`, then refresh your module files. 

```
spack config add 'modules:default:enable:lmod'
spack config remove 'modules:default:enable:tcl'
spack module refresh lmod --delete-tree
```
{:.term}

More advanced options regarding the naming and structure of the `lmod` module files can be configured by editing the `modules.yaml` (described in  [iii. Updating location of module files](hpc-spack-setup.md#iii-updating-location-of-module-files) in [Setting Up Spack on HPC](hpc-spack-setup.md)). See the Spack documentation for more information on how to configure module files: https://spack.readthedocs.io/en/latest/module_file_support.html#.