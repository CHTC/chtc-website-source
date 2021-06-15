---
highlighter: none
layout: markdown-page
title: Compiling Matlab, Python, and R Code
---


Running MAgit pTLAB, Python, or R under CHTC almost always requires a
two-step process. The first step, described here, compiles or builds the
executable code (R libraries, Python modules, or MATLAB m files)
specific to the job. The second step allows you to submit many jobs
using the built program or program components you\'ve created here. For
this second step, see our guide for setting up and submitting multiple
jobs with the [ChtcRun Package](DAGenv.shtml).

When and Why to Compile Code for CHTC Jobs
------------------------------------------

R jobs must be compiled if additional R libraries not in the basic R
environment are needed. Simiarly, Python code will need to be compiled
if additional modules not in our supported Python environment are
needed. All MATLAB jobs run at the CHTC must be compiled in order to be
run on multiple machines (per Matlab\'s license requirements).\
**All other code compiling for CHTC jobs needs to be completed on one of
our designated \"build machines\" using an interactive submit file and
instructions that you can find [here](inter-submit.shtml).**\
\
The tools below (chtc\_mcc, chtc\_buildRlibs, and
chtc\_buildPythonmodules) are part of the \"chtc-utils\" suite of tools.
These are installed on all CHTC-owned submit nodes, but may also be
installed on YOUR submit node. See the bottom of the page for more
details.

-R-
===

From any submit node in the CHTC, run the script `chtc_buildRlibs`,
using command line arguments to specify to the needed R libraries and
version of R required. This script produces a compressed tar file,
`sl6-RLIBS.tar.gz`, which will contain the R library files necessary for
running R code with the ChtcRun package or `chtcjobwrapper`.\
\
There are two necessary arguments to `chtc_buildRlibs`:

-   `--rversion` allows you to specify the needed version of R. The
    current list of versions available is
    -   sl6-R-2.10.1 (version R-2.10.1 on Scientific Linux)
    -   sl6-R-2.13.1 (version R-2.13.1 on Scientific Linux)
    -   sl6-R-2.14.1 (version R-2.14.1 on Scientific Linux)
    -   sl6-R-2.15.1 (version R-2.15.1 on Scientific Linux)
    -   sl6-R-2.15.2 (version R-2.15.1 on Scientific Linux)
    -   sl6-R-2.15.3 (version R-2.15.1 on Scientific Linux)
    -   sl6-R-3.0.1 (version R-3.0.1 on Scientific Linux)
    -   sl6-R-3.1.0 (version R-3.1.0 on Scientific Linux)
    -   sl6-R-3.2.0 (version R-3.2.0 on Scientific Linux)

    \
    If you are using an unlisted version, you will likely be able to use
    the next version down out of the list above. If a necessary version
    of R is not listed here, please request it by email to
    [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu).
-   `--rlibs` lists the R source packages to be included,
    comma-separated. **You will need to have copied the source
    \".tar.gz\" files for each library to the submit node in the same
    folder where you run the \"chtc\_buildRlibs\" command.**\
    \
    **The ordering of libraries in the list matters:** Libraries that
    are called by other libraries should be listed first.

As an example that will produce the necessary `tar` packages of R
libraries (always produced as `sl6-RLIBS.tar.gz`):

    chtc_buildRlibs --rversion=sl6-R-2.10.1 --rlibs=lme4_0.999375-39.tar.gz,pedigreemm_0.2-4.tar.gz

Usage information for the `chtc_buildRlibs` script can be listed with
the command:

    chtc_buildRlibs --help

-Python-
========

Our NEW supported Python version (2.7.7) includes the full SciPy Stack
except for iPython, as iPython (interactive) is not compatible with
batch jobs. The following modules and their dependiences are included by
default in our Python 2.7.7 capabilities (when using
[ChtcRun](http://chtc.cs.wisc.edu/DAGenv.shtml)):

-   numpy-1.8.1
-   scipy-0.14.0
-   matplotlib-1.3.1
-   pandas-0.14.0
-   sympy-0.7.5
-   nose-1.3.1

If you need additional modules, you can use `chtc_buildPythonmodules` to
create a portable package suitable for use in the CHTC.

Here are the steps to prepare your python code
----------------------------------------------

**1. Modify your main python script.**\
\
It is essential that the first line of your Python script be:\
`#!./python277/bin/python`

**2. From any submit node in the CHTC, run the script
`chtc_buildPythonmodules`,** as shown below, using command line
arguments to specify necessary modules.

As an example, to build additional Python modules not listed above in
our default list:

    chtc_buildPythonmodules --pversion=2.7.7 --pmodules=mymodule-1.1.0.tar.gz,othermodule-1.1.0.tar.gz

**The output will be one package named `sl6-SITEPACKS.tar.gz` and one
named `SLIBS.tar.gz` (NEW).** NOTE: It may take up to 5 minutes, or so,
for the command to complete.\
\
The `chtc_buildPythonmodules` has two required arguments:

-   `--pversion` specifies the required version of Python. The current
    list of versions available is
    -   \"2.7.7\" (we may add more versions in the future)
-   `--pmodules` is a comma seperated list of module source packages in
    the xxxxxx.tar.gz format.

The ordering of modules in the list matters. The first one listed may
not contain any references to modules specified by the remainder of
modules in the list. As the modules get built, they become available in
the site packages in the build python. This ordering presumes that there
may be no equivalent to a forward declaration in the list.

Usage information for the `chtc_buildPythonmodules` script can be listed
with the command

    chtc_buildPythonmodules --help

Setting up your built Python code in the [ChtcRun package](http://chtc.cs.wisc.edu/DAGenv.shtml).
-------------------------------------------------------------------------------------------------

The ChtcRun folder includes a `Pythonin` directory, which has it\'s own
`SLIBS.tar.gz` file included. You\'ll need both this file *AND* the
`SLIBS.tar.gz` file created by `chtc_buildPythonmodules`, above, when
you set up your own data directory in `ChtcRun` (similar to the
`Pythonin` directory):

-   In your own `shared` directory, copy `SLIBS.tar.gz` from
    `Pythonin/shared/` and un-tar it (`tar -zxvf SLIBS.tar.gz`) to
    produce an `SS` directory.
-   Copy in the `SLIBS.tar.gz` produced in the build step above to your
    own `shared` directory and un-tar it to add in your desired built
    modules to the `SS` directory.
-   Create a new enhanced `SLIBS.tar.gz` from the combined `SS`
    directory (`tar -zcvf SLIBS.tar.gz SS`).
-   Copy the `ENV` and `URLS` files into your `shared` directory from
    the `Pythonin/shared/` directory, and finish setting up your data
    directory in `ChtcRun`.

-Matlab-
========

From any submit machine in CHTC, run the script `chtc_mcc`, specifying
required command line arguments with values specific to the MATLAB job.
There are two required arguments:

-   `--mtargets` specifies the entry point into the compiled MATLAB
    executable(s). This is the file normally passed to MATLAB. The
    executable produced will have the same file name, but without the
    `.m` extension.
-   `--mfiles` is a comma-separated list of all *m* and *mex* files
    needed by your program, including the file listed in `--mtargets`.
    **You will need to have copied these files to the submit node for
    the chtc\_mcc script to use them.**
-   `--version=R2013b` should be used to specify our newer supported
    Matlab version instead of the default R2011b. We will soon be
    changing this tool to default to \"R2013b\" instead, and will email
    users when that change has been made. NOTE: If you are using a
    non-CHTC submit node, you\'ll need to update your version of
    chtc-utils to get the latest version of `chtc_mcc` that is
    consistent with this guide. (See the bottom of this web page.)

The below example will produce a compiled MATLAB executable called
`target1` using five *m* files.

    chtc_mcc --mtargets=target1.m --mfiles=a.m,b.m,c.m,d.m,target1.m 

Full usage information for the `chtc_mcc` script can be listed with the
command.

    chtc_mcc --help

There are additional options available using the `--moptions` argument
as well. For example:

-   `--moptions=java` turns on java runtime support
-   `--moptions=mex` builds a mex file from c files listed as `mfiles`
    list from entry point in `mtargets` list
-   `--moptions=deep` turns on deep compiling into multiple folders of
    *m* files.

**Detailed examples of all options are now within the program\'s help
file.**

Obtaining and Updating the `chtc_mcc`, `chtc_buildRlibs`, and `chtc_buildPythonmodules` Scripts for Your Group Submit Node
==========================================================================================================================

The scripts `chtc_mcc`, `chtc_buildRlibs`, and `chtc_buildPythonmodules`
are installed on all CHTC submit nodes. These scripts (and other
supporting files) are distributed for use on other computers as a YUM
RPM. It is important to update these RPMs at least twice a year as we
improve the build scripts.

To determine whether the scripts are already installed on your submit
node, try

    which chtc_mcc

The message `Command not found` indicates that the scripts are *not*
installed.

The scripts must be obtained and installed as root. From directory
`/etc/yum.repos.d/`, issue the command

    wget http://chtc.cs.wisc.edu/repo/chtc-packages.repo

To install the `chtc-utils` package, issue the command

    yum install chtc-utils

After installation, the scripts will be in `/usr/bin`.
