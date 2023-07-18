---
highlighter: none
layout: hpc_layout
title: Setting Up Spack on HPC
guide:
  order: 1
  category: Software Solutions
  tag:
    -hpc
---

CHTC uses Spack ([https://github.com/spack/spack](https://github.com/spack/spack)) for installing and managing software packages on the HPC cluster for all users to use, via the `module` command (see [Using Software on the HPC Cluster](hpc-software.md)). Recently, Spack has developed a feature that allows for users to integrate their local installation of Spack with the system-wide installation. This means that when a user installs software with their local installation of Spack, they can automatically incorporate the system-wide packages to satisfy their software's dependencies.

**This guide describes how to set up a local copy of Spack and integrate it with the system installation, either for an individual user or for a group of users.** For instructions on how to install packages with Spack, see our other guide, [Installing Software Using Spack](hpc-spack-install.md).

> If your group has already set up a shared group installation of Spack, you can skip to the end of this guide: [3. Using a Shared Group Installation](#3-using-a-shared-group-installation).

# Contents

1. [Setting Up Spack for Individual Use](#1-setting-up-spack-for-individual-use) 
2. [Setting Up Spack for Group Use](#2-setting-up-spack-for-group-use)
3. [Using a Shared Group Installation](#3-using-a-shared-group-installation)

# 1. Setting Up Spack for Individual Use

## A. Downloading Spack (Individual)

First, log in to the HPC cluster. 

You can then install Spack following its [documentation](https://spack.readthedocs.io/en/latest/getting_started.html). Download the Spack code from their GitHub repository:

```
git clone -c feature.manyFiles=true https://github.com/spack/spack.git
```
{:.term}

and then activate Spack by sourcing the setup script with the `.` command

```
. spack/share/spack/setup-env.sh
```
{:.term}

That's it! You can test that Spack has been installed by entering `spack` and you should see the help text print out. But before trying to install packages using your Spack installation, you should configure it to recognize the system installation of Spack.

> This guide assumes that you ran the `git clone` command in your home directory, i.e. `/home/yourNetID`. If you did not, then run the following command to print the full path to your Spack installation.  
>
> ```
> echo $SPACK_ROOT
> ```
> {:.term}
>
> We will refer to this path as the `SpackRootPath` and you will need to use this path where noted in the instructions below.

## B. Using Spack in Future Sessions (Individual)

While Spack has been installed, for each session that you want to use it you will need to rerun the command

```
. /home/yourNetID/spack/share/spack/setup-env.sh
```
{:.term}

A more convenient option is simply to update your account to run this command whenever you log in. Add the command to the end of the `.bash_profile` file in your home directory, e.g. `nano ~/.bash_profile`, with the full path to the file.  If you ran the `git clone` command in your home directory, then the line you add should be

```
. /home/yourNetID/spack/share/spack/setup-env.sh
```

where you need to replace `yourNetID` with your NetID.

> If Spack was not installed to your home directory, use the following command instead, where you need to replace `SpackRootPath` with the path that you noted above.
>
> ```
> . SpackRootPath/share/spack/setup-env.sh
> ```

## C. Obtain the Provided Configuration Files (Individual)

To simplify the process of configuring your local installation of Spack, we have provided a folder with the necessary configuration files. All that you need to do is copy it to your home directory using the following command.

```
cp -R /software/chtc/spack/chtc-user-config/ ~/.spack
```
{:.term}

Your local Spack installation will automatically find the configuration files and will now recognize the packages that are installed system-wide. You can confirm this with the command

```
spack find
```
{:.term}

This should show a list of packages, including those you see when you run the `module avail` command. A total of ~120 packages should be listed.

You are now ready to use Spack for installing the packages that you need! See the instructions in [Installing Software Using Spack](hpc-spack-install.md).

# 2. Setting Up Spack for Group Use

The following instructions for a group installation of Spack assumes that shared directories have already been set up for your group, and that you have access to the group. We also recommend getting permission from your colleagues before proceeding.

## A. Downloading Spack (Group)

First, log in to the HPC cluster, and navigate to your group's shared directory in `/home` with

```
cd /home/groups/yourGroupName
```
{:.term}

where you should replace `yourGroupName` with your group's name. Note this path for use throughout this guide, and communicate it to your group members for configuring their access to the installation.

You can then install Spack following its [documentation](https://spack.readthedocs.io/en/latest/getting_started.html). Download the Spack code from their GitHub repository:

```
git clone -c feature.manyFiles=true https://github.com/spack/spack.git
```
{:.term}

and then activate Spack by sourcing the setup script with the `.` command.

```
. spack/share/spack/setup-env.sh
```
{:.term}

That's it! You can test that Spack has been installed by entering `spack` and you should see the help text print out. But before trying to install packages using your Spack installation, you should configure it to recognize the system installation of Spack.

> This guide assumes that you ran the `git clone` command in your group's home directory, i.e. `/home/groups/yourGroupName`. If you did not, then run the following command to obtain the full path to your Spack installation.  We will refer to this path as the `SpackRootPath` and you will need to use this path where noted in the instructions below.
>
> ```
> echo $SPACK_ROOT
> ```
> {:.term}

## B. Using Spack in Future Sessions (Group)

While Spack has been installed, for each session that you want to use it you will need to rerun the command

```
. /home/groups/yourGroupName/spack/share/spack/setup-env.sh
```
{:.term}

A more convenient option is simply to update your account to run this command whenever you log in. You and your group members should add the command to the end of the `.bash_profile` file in your respective home directories, e.g. `nano ~/.bash_profile`, with the full path to the file.  For a group installation, the line should look like

```
. /home/groups/yourGroupName/spack/share/spack/setup-env.sh
```

where you need to replace `yourGroupName` with the name of your group.

> If Spack was not installed in your group's home directory, use the following command instead, where you will need to replace `SpackRootPath` with the path that you noted above.
>
> ```
> . SpackRootPath/share/spack/setup-env.sh
> ```

## C. Obtain the Provided Configuration Files (Group)

### i. Copy the configuration files

To simplify the process of configuring your local installation of Spack, we have provided a folder with the necessary configuration files. All that you need to do is copy it to your home directory using the following command.

```
cp -R /software/chtc/spack/chtc-user-config/ /home/groups/yourGroupName/.spack
```
{:.term}

where you need to replace `yourGroupName` with your group's name. 

### ii. Updating location of configuration files

The group installation of Spack needs to be instructed on where to find these configuration files. You can do this by running the command 

```
export SPACK_USER_CONFIG_PATH=/home/groups/yourGroupName/.spack
```
{:.term}

and Spack should now recognize the packages that are installed system-wide. You can confirm this with the command

```
spack find
```
{:.term}

This should show a list of packages similar to what you see when you run the `module avail` command.

To ensure that the configuration files are found in future terminal sessions, you and your group members need to edit your respective `~/.bash_profile` files to include the above `export` command. That is, use a command-line text editor to open the file at `~/.bash_profile` and add the following line to the end of the file:

```
export SPACK_USER_CONFIG_PATH=/home/groups/yourGroupName/.spack
```

### iii. Updating location of module files

If you or someone in your group is interested in creating custom modules following the instructions in the guide [Creating Custom Modules Using Spack](hpc-spack-modules.md), then you should update the location where the module files will be saved. You can update the location with the following commands

```
spack config add 'modules:default:roots:lmod:/home/groups/yourGroupName/spack_modules'
spack config add 'modules:default:roots:tcl:/home/groups/yourGroupName/spack_modules'
```
{:.term}

where you replace `yourGroupName` with your group's name. 

You are now ready to use Spack for installing the packages that you need! See the instructions in [Installing Software Using Spack](hpc-spack-install.md).

# 3. Using a Shared Group Installation

Users who want to use a shared group installation of Spack, but who did not set up the installation, only need to modify their `~/.bash_profile` file with instructions regarding the path to the shared group installation and its configuration files.

1. Log in to the HPC cluster ([Connecting to CHTC](connecting.md)).
   ```
   ssh yourNetID@hpclogin3.chtc.wisc.edu
   ```
   {:.term}

2. Edit the `.bash_profile` file in your home directory (`/home/yourNetID`).
   You should be able to simply add the following two lines to the end of the file

   ```
   . /home/groups/yourGroupName/spack/share/spack/setup-env.sh
   export SPACK_USER_CONFIG_PATH=/home/groups/yourGroupName/.spack
   ```

   where `yourGroupName` should be replaced with the name of your group. Confirm the exact commands with the user who installed Spack for your group. 

   > You should be able to find the requisite paths if necessary. For the first line, the command
   > ```
   > find /home/groups/yourGroupName -type d -name spack | grep "share/spack"
   > ```
   > {:.term}
   >
   > should give the path you need; simply add "setup-env.sh" to the end of the path. For the second line, the command 
   > ```
   > find /home/groups/yourGroupName -type d -name .spack | sort -n | head -n 1
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

Once configured, you can follow the instructions in our guide [Installing Software Using Spack](hpc-spack-install.md) to install or use already-installed packages in Spack.

## A. Switching Between Spack Installations

You can easily switch between different Spack installations by creating scripts containing the commands listed in Step 2. above, and then sourcing the one that you want to use.

For example, let's say you want to use a personal installation of Spack for an independent research project, but want to use a group installation of Spack as part of a collaboration. In that case, you would create two scripts, `load-my-spack.sh` and `load-group-spack.sh`, and save them to some central location like `~/bin`. In each script, you provide the path to the `setup-env.sh` file and the `.spack` configuration directory for the respective Spack installations. The example contents of these scripts are provided below, where you should replace `yourNetID` with your NetID and `yourGroupName` with the group name of your collaboration.

**load-my-spack.sh**

```
. /home/yourNetID/spack/share/spack/setup-env.sh
export SPACK_USER_CONFIG_PATH=/home/yourNetID/.spack
```

**load-group-spack.sh**

```
. /home/groups/yourGroupName/spack/share/spack/setup-env.sh
export SPACK_USER_CONFIG_PATH=/home/groups/yourGroupName/.spack
```

To activate the your personal Spack installation, simply run

```
. path/to/load-my-spack.sh
```
{:.term}

To activate the group Spack installation, run

```
. path/to/load-group-spack.sh
```
{:.term}

For submitting jobs, remember to load the correct Spack installation at the start of the submission script.



