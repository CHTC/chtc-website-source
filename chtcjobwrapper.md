---
highlighter: none
layout: markdown-page
title: Submitting Jobs Using chtcjobwrapper
---

<p class="underconstruction">This section is under construction</p>

Getting your job to run requires submitting an HTCondor job. All
HTCondor jobs specify details about the job in a file called a submit
description file. These details include the executable\'s name, file
names of input files to the job, and where to place the output, Thus,
job submission will require a submit description file that you construct
to specify details of the job.

It may be helpful to have an example submit file. You can follow the
directions given at [Submitting Jobs Using the DAG
Environment](DAGenv.shtml) through step 4, which runs the script
`mkdag`. Running this script creates HTCondor submit description files.
There are four working examples in that environment which combine the 4
most common jobs types and thus submit files for each. There are Matlab,
R, Python or some Binary. Downloading this environment will also get you
the needed perl script, called `chtcjobwrapper`.

Since the submitted job may run on a machine at a site elsewhere in the
world, and managed by OSG, there are quite a few details that need to be
taken care of. As a job submitter, these details are taken care of on
your behalf, such that you will never see them or need to be aware of
them. But, in order to do so, a level of abstraction is introduced into
the specification. Instead of directly submitting your executable as an
HTCondor job, you submit a Perl script, called `chtcjobwrapper` as an
HTCondor job, and this Perl script does all the right things to get your
job to run. The submit description file tells the `chtcjobwrapper`
script everything it needs to know to be able to run your executable.

Once the submit description file has been generated, and all needed
files associated with the job have been staged, job submission is
accomplished by issuing a command of the form

    condor_submit jobwrapper.submit

where `jobwrapper.submit` is substituted with the name of the submit
description file.

### Example Submit Description File

<p class="underconstruction">This section is under construction</p>

The submit description file that goes with the the `chtcjobwrapper`
script specifies details about the HTCondor job. Here is a simple but
complete submit description file that may be copied and altered for a
specific job. Examples specific to Matlab, R, Python, and other uses can
be

    # Assume the location is in the current directory.
    executable = chtcjobwrapper

    # Lots of information is specified as command line arguments to chtcjobwrapper:
    # The executable to be run is "smalljob".
    # This is a MATLAB job.
    # The --unique value helps to to ensure that output files for multiple jobs 
    # do not overwrite each other.  
    # The value of $(Cluster).$(Process) given is a reasonable default.
    arguments = --type=Matlab --version=r2011b --cmdtorun=smalljob --unique=$(Cluster).$(Process)

    # If I wanted to pass the argument "--my-argument=foo" to my program, 
    # I could do this.  Anything after the bare "--" is handed off to my
    # program unmodified.
    #arguments = --type=Matlab --version=r2011b --cmdtorun=smalljob --unique=$(Cluster).$(Process) -- --myargument=foo

    # Need to specify the executable and all other input files
    transfer_input_files = smalljob,sample_file.txt

    universe = vanilla

    # A file name for where stdout output of the job will go.
    output = myjob.out
    # A file name for where stderr output of the job will go.
    error = myjob.err
    # A file name for where a list of logged events about the job will go.
    log = myjob.log

    # Invoke the HTCondor file transfer mechanism, because there will not
    # be support for a shared file system.
    should_transfer_files = YES
    when_to_transfer_output = ON_EXIT

    notification = never

    # While optional, this makes it easier for CHTC staff to monitor 
    # our workload and make policy decisions based on what our users
    # are doing.
    +Matlab = "r2011b"
    # Similarly, for R it would be something like this:
    #+R = "R-2.10.1"

    queue

### chtcjobwrapper details

You get the chtcjobwrapper by downloading the ChtcRun environment from
the URL above. Don\'t be fooled by the simplicity of that script. All
that the chtcjobwrapper does is collect the arguments, download the real
wrapper (chtcinnerwrapper) and call it with the collected arguments. You
can see a short amount of help by going: `chtcjobwrapper --help`

**Why do we use nested wrappers like this?** This question came up
recently and the answer is simple. The logistics of getting everyone who
is currently using chtcjobwrapper a new improved version is a tough
problem. When one considers the thousands of jobs using it at any one
moment, this makes it even harder. This way we can replace the inner
wrapper at anytime and the next time you use chtcjobwrapper the new
functionality will be there.

Once you have created the submit files for the kind of jobs you want to
run using the ChtcRun environment you can either use that environment of
submit your jobs some other way. Below are explanations for advanced
usage of the chtcjobwrapper:

#### Arguments

##### \--

This argument is first because it is **very important**. There is a lot
of command line processing within **chtcjobwrapper**. Yet there are
times the program you want to run requires its own very specific
argument syntax.

This argument is placed after the last chtcjobwrapper argument and this
turns off its argument parsing and passes everything which follws
directly to your program.

    chtcjobwrapper --type=Other --cmdtorun=bowtie --unique=666 -- -q  -n 2 -e 99999999 -l 25 -p 1 -a -m 200

##### \--help

Print a short description of the accepted arguments.

##### \--type=xxxxxx

Required. This command allows changing the environment for the different
types of jobs.

-   `--type=Matlab`\
    For MATLAB jobs. `chtcjobwrapper` will fetch and set up a MATLAB
    runtime environment for your job.
-   `--type=R`\
    For R jobs. `chtcjobwrapper` will fetch and set up an R runtime
    environment for your job.
-   `--type=Other`\
    For jobs that are neither MATLAB or R. `chtcjobwrapper` will set up
    a basic environment for your job. Python jobs are use the Other
    type. Note: the capital O in Other is mandatory.

##### \--cmdtorun=xxxxxx

Required. The executable invoked by the `chtcjobwrapper` script.

-   `--cmdtorun=compiledmatlabprogram`\
    For Matlab jobs, this is your compiled Matlab program.
    [Documentation on compiling your Matlab program is available
    here.](http://chtc.cs.wisc.edu/MATLABandR.shtml)
-   `--cmdtorun=myRentryscript.R`\
    For R jobs, this will be your entry script which may call other R
    files.
-   `--cmdtorun=myPythonscript`\
    For Python jobs, this will be your entry script which may call other
    Python files.\
    The entry script *must* start with this line:\
    `#!./python273/bin/python`

You will have to add the file specified with \--cmdtorun to the
transfer\_input\_files list.

##### \--version=xxxxxx

Require for MATLAB and R jobs; unused otherwise. This identifies the
version of MATLAB or R your job requires.

For MATLAB jobs, the only currently supported version is specified with
the argument

    --version=r2011b

For R jobs, there are currently 4 versions supported; identify the
correct one with one of these arguments:

-   --version=sl5-R-2.10.1

-   --version=sl5-R-2.13.1

-   --version=sl5-R-2.14.0

-   --version=sl5-R-2.15.0

##### \--unique=xxxxxx

Optional. Specify a unique identifier for your job, used to avoid
multiple jobs writing to the same file and potentially losing
information. You can use \$(Cluster).\$(Process) as a reasonable
default:

    --unique=$(Cluster).$(Process)

The `chtcjobwrapper` creates a log of everything that happens on the
execute node. It creates a file called `ChtcWrapper.out`. Should you
have more then one job submitted from the same folder, the last job to
return this file wins and the information from the other jobs is lost.

    --unique=1

Using this would have this job write the file **ChtcWrapper1.out**.

##### \--locateto=xxxxxx

Optional. If specified, chtjobwrapper will change to this directory
before starting the program specified with cmdtorun. Most jobs will not
use this option.

For example, if you need to run your job inside of the subdirectory
`./myrunenv`, then you would use:

    --locateto=myrunenv

##### \--prescript=xxxxxx

Optional. Specifies an additional command to run on the execution
computer before launching the program specified in cmdtorun. Provides a
last moment opportunity to do setup for your job.

    --prescript=myprescript

You will have to add the file specified with \--prescript to the
transfer\_input\_files list.

##### \--prearg=xxxxxx

Optional. Specifies an additional argument to be passed to your
prescript. You can pass multiple arguments by specifying \--prearg
multiple times. For example, to invoke `myprescript 1 2 3` you could
use:

    --prescript=myprescript --prearg=1 --prearg=2 --prearg=3

##### \--postscript=xxxxxx

Optional. Specifies an additional command to run on the execution
computer after running the program specified in cmdtorun. Provides a
final opportunity to do work like compressing results.

    --postscript=mypostscript

You will have to add this file to the transfer\_input\_files list.

##### \--postarg=xxxxxx

Optional. Specifies an additional argument to be passed to your
postscript. You can pass multiple arguments by specifying \--postarg
multiple times. For example, to invoke `mypostscript 1 2 3` you could
use: If your postscript needs arguments, they will be given in the order
in which you use \--postarg.

    --postscript=mypostscript --postarg=1 --postarg=2 --postarg=3
:::

#### Special Files

Special files will need to be added to the transfer\_input\_files list.


##### URLS

A list of relative URLs for files on our web cache to be downloaded
before your job starts.

We offload the movement of large files to a proxy server so that the
file can be requested from the execute node. Files that get used over
and over might even get cached at a remote site for reuse. If your user
name were `friendly` and we had given you a directory in /squid called
`friendly` and you wanted access to the file `bigfile` The entry in the
file **URLS** would be:

    friendly/bigfile

The above will get the file, bigfile, to the execute node before your
job runs and before the prescript would be called. Every line in the
file will generate a fetch of a file.

NOTE: files fetched in this manner are added to the remove list and
deleted before your results come back. See **REMOVE** file below for how
to keep other files from coming back

You will have to add this file to the transfer\_input\_files list.

##### REMOVE

A list of files, one per line, that will be deleted after you jobs
finishes.

Frequently jobs generate files, some very big, which we do not need
back. Or it may generate a file that we can run a postscript on to cut
from the file all we care about from the file. These large files which
you don\'t want can cause you to lack enough space for the data you do
care about. So to get rid of the file `bigunwantedfile`, the entry in
the file **REMOVE** would be:

    bigunwantedfile

As with URLS, multiple lines can be used to remove multiple files.

You will have to add this file to the transfer\_input\_files list.

##### SLIBS.tar.gz

Additional libraries used by your program. This archive must contain a
single directory named \"SS\" containing the libraries needed. If
present, chtcjobwrapper will extract the archive and automatically add
the directory SS to your library search path (LD\_LIBRARY\_PATH).

To create an SLIBS.tar.gz, place all of the required libraries in a
directory called \"SS\", then from the directory above run this command:

    tar -zcvf SLIBS.tar.gz SS

You will have to add this file to the transfer\_input\_files list.

##### CONTROL

A list of programs and arguments, one per line, to be run.

Sometimes we want to do either a number of short jobs on an execute node
or perhaps three different processing steps. We can explicitly place a
program to run and its arguments on each line. This works for each
`--type`.

As with URLS and REMOVE, multiple lines can be used to run multiple
programs.

You will have to add this file to the transfer\_input\_files list.

##### ENV

Some software requires changes to the environment space on the execute
node. This is often true of the **\--type=Other** so we have a file
which lets you set things directly in the environment. One of the
methods lets you set these variables relative to the HTCondor sandbox
where your jobs run on an execute node. The syntax is like this:

-   **ENVVAR1,DIR-path/to/set**: This sets this variable to sub
    directory on the execute node via a full path from / on the execute
    node.
-   **ENVVAR2,ENV-settothis**: This sets the variable exacly as set

If you set the environment variable **PATH**, this new path will be
added at the beginning of your default path on the execute node. A good
example is Python. Below is the ENV file we use for our Python runtime:

    PYTHONHOME,DIR-python273
    PYTHONPATH,DIR-python273
    PATH,DIR-python273/bin

You will have to add this file to the transfer\_input\_files list.

##### RLIBS.tar.gz

This file is produced by **chtc\_buildRlibs** which prepares
non-standard R libraries to run with your R in our runtime for R. When
chtcjobwrapper sees this file, it untars it and places the resulting
folder into the places our R runtime is looking for R Libraries.

You will have to add this file to the transfer\_input\_files list.

##### SITEPACKS.tar.gz

This file is produced by **chtc\_buildPythonmodules** which prepares
non-standard Python modules. When chtcjobwrapper sees this file, it
untars it and places those built modules into the site-packages of our
Python runtime.

You will have to add this file to the transfer\_input\_files list.

