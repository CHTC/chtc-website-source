---
highlighter: none
layout: guide
title: Create and manage custom modules
guide:
    category: Software
    tag:
        - hpc
---

## Introduction

CHTC uses the [module system](https://tacc.utexas.edu/research/tacc-research/lmod/), which allows users to load and manage their software environments on the HPC system. Experienced HPC users who use a range of software environments can create and manage their own custom modules, which makes it easier to switch between different environments for different types of jobs.

> ### ⚠️ Caution: You may break your HPC environment if you do not know what you are doing.
{:.tip-header}
>
> To create custom modules, **we recommend that you have *strong* foundational knowledge** in:
> * File systems (e.g., `/home` vs. `/scratch`, directory structure)
> * Software installation (e.g., Linux package management, libraries, using compilers)
> * Environment variables (e.g., `PATH`, `LD_LIBRARY_PATH`)
> 
> If you are unfamiliar with these concepts, we recommend [asking for help](get-help) before you try creating custom modules on your own.
{:.tip}

{% capture content %}
- [Introduction](#introduction)
- [Why create custom modules?](#why-create-custom-modules)
- [Before you start](#before-you-start)
- [Create your own modules](#create-your-own-modules)
   * [Create directories for your module files](#create-directories-for-your-module-files)
   * [Create a custom module file](#create-a-custom-module-file)
- [Use your custom modules](#use-your-custom-modules)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Why create custom modules?

Custom modules are a convenient way to "load" and "unload" software environments on the HPC cluster, allowing you to switch between different software or versions of software without having to manually modify your environment variables.

For example, loading and unloading the `matlab` module modifies `LD_LIBRARY_PATH` and `PATH` environment variables:

```
[netid@spark-login ~]$ env | grep -i matlab

[netid@spark-login ~]$ module load matlab

[netid@spark-login ~]$ env | grep -i matlab

__LMOD_REF_COUNT_PATH=/software/chtc/manual/el9/installs/matlab/R2024a:1;/software/chtc/manual/el9/installs/matlab/R2024a/bin/glnxa64:1;/software/chtc/manual/el9/installs/matlab/R2024a/bin:1;/home/netid/spack/bin:1;/home/netid/.local/bin:1;/home/netid/bin:1;/usr/local/bin:1;/usr/bin:1;/usr/local/sbin:1;/usr/sbin:1;/opt/puppetlabs/bin:1
LOADEDMODULES=matlab/R2024a
LD_LIBRARY_PATH=/software/chtc/manual/el9/installs/matlab/R2024a/extern/bin/glnxa64
PATH=/software/chtc/manual/el9/installs/matlab/R2024a:/software/chtc/manual/el9/installs/matlab/R2024a/bin/glnxa64:/software/chtc/manual/el9/installs/matlab/R2024a/bin:/home/netid/spack/bin:/home/netid/.local/bin:/home/netid/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/opt/puppetlabs/bin
_LMFILES_=/software/chtc/manual/el9/modules/matlab/R2024a
__LMOD_REF_COUNT_LD_LIBRARY_PATH=/software/chtc/manual/el9/installs/matlab/R2024a/extern/bin/glnxa64:1

[netid@spark-login ~]$ module unload matlab

[netid@spark-login ~]$ env | grep -i matlab

```
{:.term}

Custom modules may be a good option if you
* Use different software stacks in different jobs
* Manage custom installations for a group
* Want to keep your default environment variables simple and uncluttered

## Before you start

Make sure that you already have your software installed on the system.

> ### 📝 Follow along
{:.tip-header}
> In this guide, we'll be using [Julia](https://julialang.org/) as an example.
> 
> If you'd like to follow along, use the commands below to install Julia 1.12.1 in your `/home` directory on `spark-login`.
> 
> ```
> cd $HOME
> wget https://julialang-s3.julialang.org/bin/linux/x64/1.12/julia-1.12.1-linux-x86_64.tar.gz
> tar -xzf julia-1.12.1-linux-x86_64.tar.gz
> ```
> {:.term}
> You should now have a `julia-1.12.1` directory in your `/home` directory.
{:.tip}

## Create your own modules

### Create directories for your module files

In your `/home` directory, create a directory for your custom module files.

```
mkdir -p ~/custom_modules
```
{:.term}

> ### ⚠️ Only put module files in this directory!
{:.tip-header}
> You can *only* put module files in this directory. Do not put any other types of files here, or it may break your module setup.
{:.tip}

Next, create a subdirectory for the software you want to create a module for. **Do not put the version number in the directory name.** For example:

```
mkdir -p ~/custom_modules/julia
```
{:.term}

### Create a custom module file

In the subdirectory for your software, create a new file with a name in the following format:

`<version>.lua`

For example, for Julia 1.12.1, you should create a file called `1.12.1.lua`.

The module file is written in the [Lua programming language](https://www.lua.org/). The module file contains information about our module and how to load it.

Below is an example module file, `1.12.1.lua`:

```
help([[
Julia 1.12.1
]])
whatis("Name: Julia")
whatis("Version: 1.12.1")
whatis("Keywords: Julia")
whatis("URL: https://julialang.org/")
whatis("Description: The Julia programming language and CLI.")

prepend_path("PATH","/home/NetID/julia-1.12.1/bin")
```

| Module file options | What it does |
| --- | --- |
| `prepend_path("<PATH>","<value>")` | Prepends `<value>` to the `<PATH>` variable. Use this to point to the location of executables, or load libraries into `LD_LIBRARY_PATH`. |
| `setenv("<variable>", "<value>")` | Sets the environment variable `<variable>` to the given `<value`> |
| `whatis()` | Provides information about the module to users. Use this to also provide help text or simple instructions. |
| `help([[]])` | Printed when a user uses the command `module help <module name>` |

Visit the [official documentation](https://lmod.readthedocs.io/en/latest/015_writing_modules.html) on more guidance for writing module files.

## Use your custom modules

To use your custom module, you need to tell the module system where to look for your custom module files. Use the `module use` command to point to the parent directory (not the software directory) for your custom modules.

```
module use ~/custom_modules
```
{:.term}

Now when you use `module avail`, you should see your custom module listed. You can now use `module load` to load your custom module!

> ### 💡 Tip
{:.tip-header}

> To save yourself from using the `module use` command every time you log into the HPC system, append the `module use` command to your `.bashrc` file.
{:.tip}

## Related pages

* [Lmod official documentation](https://lmod.readthedocs.io/en/latest/)
    * [An introduction to writing modulefiles](https://lmod.readthedocs.io/en/latest/015_writing_modules.html)
    * [Advanced user guide for personal modulefiles](https://lmod.readthedocs.io/en/latest/020_advanced.html)
* [Software overview and policies](hpc-software)