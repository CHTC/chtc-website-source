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

1. [Location of the Module Files](#1-location-of-the-module-files)
2. [Creating Custom Modules Using Spack](#2-creating-custom-modules-using-spack)
3. [Using Custom Modules](#3-using-custom-modules)

# 1. Location of the Module Files

In order to load a software package using the `module` command, there must be a corresponding "module file" containing the information that the `module` command needs in order to load the software package. Spack will automatically generate the required content of the module files, but Spack will need to know where these module files should be saved. Similarly, the `module` command will need to know where the module files are stored.

If you followed the instructions in [Setting Up Spack on HPC](hpc-spack-setup.md), then **the default location of your module files is `/home/yourNetID/spack_modules`** where `yourNetID` is your NetID. 

> **If you are using a shared installation of Spack for a group**, and if the person who set up the installation followed the instructions in [Setting Up Spack on HPC](hpc-spack-setup.md), then the default location of the shared module files is likely `/home/groups/yourGroupName/spack_modules`. You can confirm this by running the command `spack config get modules | grep -A 2 'roots'` and examining the listed paths. If the paths are `/home/$user/spack_modules`, then you should follow the instructions in [iii. Updating location of module files](hpc-spack-setup.md#iii-updating-location-of-module-files) in [Setting Up Spack on HPC](hpc-spack-setup.md) before proceeding.

# 2. Creating Custom Modules Using Spack

# 3. Using Custom Modules

