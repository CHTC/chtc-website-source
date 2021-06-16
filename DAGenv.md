---
highlighter: none
layout: markdown-page
title: Submitting Jobs Using the ChtcRun Package
---

To facilitate the submission of large batches of jobs, especially
batches for Matlab, Python, and R, the CHTC has created the ChtcRun
package of scripts, files, and directories that will allow you to easily
construct your own HTCondor workflow (or \"DAG\" batch). By following
the ordered set of directions given here, you\'ll be able to easily set
up and run a set of high-throughput computing jobs on CHTC-available
resources, including those outside of the CHTC HTCondor Pool in the UW
Grid and national Open Science Grid.

1.  From within your home directory on the submit node, in a directory
    of your choice, download the ChtcRun package:

        wget http://chtc.cs.wisc.edu/downloads/ChtcRun.tar.gz

    Unpack the ChtcRun package. This will create a `ChtcRun`
    subdirectory.

        tar xzf ChtcRun.tar.gz

    After unpacking the package, within the `ChtcRun` directory will be:

    -   `chtcjobwrapper`
    -   `process.template`
    -   `postjob.template`
    -   `mkdag`
    -   `Matlabin/` (example Matlab setup)
    -   `Rin/` (example R setup)
    -   other directories and files

    You do not need to download a separate copy of `ChtcRun` for every
    batch of jobs you submit - each project will be submitted from its
    own directory from within `ChtcRun`. However, the operations of
    downloading and unpacking `ChtcRun` may be repeated to obtain
    updated versions of the scripts and supporting files. Doing so will
    overwrite existing, but updated material, without harming other
    files and directories already in place.

2.  Stage files specific to your set of jobs into correctly-named
    directories within `ChtcRun`.

    **For Matlab, Python, and R jobs, it is first essential to have
    completed the steps to compile your code dependencies, according to
    our [\"Compiling Matlab, Python and R Code\"
    page.](/MATLABandR)**

    Make a directory within `ChtcRun` to house the project\'s input
    files and executables. For purposes of this example, assume that the
    directory has been named `proj1data`, which is otherwise equivalent
    to the example `Matlabin` and `Rin` directories.

    Within `proj1data`, create one directory for each job to be run.
    Within each of these run-specific directories, place the input files
    used for that specific job. If the work does not require any per-job
    input files, then nothing will be in these directories. The files
    might include input files and parameter files. These directories can
    be given any name, but the file names may not contain whitespace
    characters, notably spaces, in their name. And, the file name
    `shared` is already used for the files shared among job submissions.

    Each of these directories will create an individual job within the
    single DAG. When the job starts, its current working directory on
    the machine where the job executes will contain copies of all files
    placed in the run-specific directory on the submit machine, as well
    as copies of all files placed in the `shared` directory on the
    submit machine.

    Input files, shared libraries, and all executables shared by all
    jobs go into a directory with the name `shared`. Create the
    directory `shared` within `proj1data`. Place the executable and any
    input files common to the set of jobs that will be submitted into
    directory `shared`. The `shared` directory will not become an
    individual job.

    For example, you might want to run several jobs on data you have for
    several midwestern states, where there is one job per state. Each
    state has its own input data file, called `state.dat`. There is also
    a shared input data file of US-wide averages for comparison, called
    `us.dat`, as well as a single executable (program). For each job
    submission, assume this program `compare-states` will compare
    contents of `us.dat` to `state.dat`. Given this, a portion of the
    directory hierarchy might look like this:

        proj1data/
           shared/
              us.dat
              compare-states
           wi/
              state.dat
           il/
              state.dat
           mn/
              state.dat
           ia/
              state.dat

3.  Modify `process.template` (a template submit file) in `ChtcRun` with
    respect to the following lines:

        request_cpus = 1    (or other integer)
        request_disk = (insert KB value)
        request_memory = (insert MB value)
        +WantFlocking = true    (to send jobs shorter than 4 hours to the UW Grid)
        +WantGlidein = true (to send jobs shorter than 2 hours to the OSG)

    **If you are not aware of how much disk or memory your jobs need, it
    is ESSENTIAL to first test 5-10 jobs**, and then look at the
    resulting `process.log` file for each test job to determine the
    amounts that should be requested for your jobs. For more information
    on testing, Flocking, and Glidein, please see the bottom of our
    [\"Run Your First HTC Jobs\"
    guide](/helloworld).

4.  With a current working directory of `ChtcRun`, run `mkdag` with a
    job-specific set of command line arguments. The output from from
    running `mkdag` will be a directory to hold eventual output from
    running the project\'s job(s), as well as control files: a DAG input
    file for describing the DAG (called `mydag.dag`) and an HTCondor job
    submit description files for each of the node jobs within the DAG.
    One of the command line arguments to `mkdag` will specify the name
    of this directory.

    **The command line arguments to `mkdag` are viewable by running the
    following command**, which includes full `mkdag` commands for the
    `Matlabin`, `Rin`, `Pythonin`, and `Binin` examples that come within
    `ChtcRun`:

        ./mkdag --help

    -   `--cmdtorun=NameOfJobExecutable`\
        This required argument identifies which file within the `shared`
        directory should be executed. It should be only the base name of
        the file (for example, `compare-states`); do not include
        directory information.
    -   `--data=DirectoryName`\
        This required argument identifies the relative path to and name
        of the directory that contains the `shared` directory. The path
        is specified as relative to the directory containing the `mkdag`
        script. The string used instead of `DirectoryName` for this
        presented example would be `proj1data`.
    -   `--outputdir=DirectoryName`\
        This required argument identifies where the output from your
        jobs will be placed. This is the relative path to and specifies
        a name for the directory within `ChtcRun` that will be created,
        and within which the directories and files produced by the
        `mkdag` script will go. Do not create this directory before
        running `mkdag`. The directory will be created by `mkdag`, and
        it will contain one subdirectory for each of the jobs within the
        DAG.
    -   `--pattern=SubString`\
        This required argument helps identify if a job ran successfully.
        For a variety of reasons, we cannot necessarily trust the return
        code from MATLAB or R to tell us if the job was successful. We
        determine if a job was successful by checking if at least one
        file was created that includes the pattern \"SubString\" in
        it\'s filename, for each HTCondor job submitted. This check is
        identical to running

            ls *SubString*

        in a job\'s output folder after the job completes to see that at
        least one file is returned.

    -   `--parg=ArgumentString`\
        This optional argument identifies a command line argument that
        is to be passed to each invocation (as an HTCondor job) of the
        executable. This argument will be listed multiple times to
        define more than one command line argument. Optionally, you can
        use \"\--parg=*unique*\" to pass the name of the job directory
        as an argument to your code for each job.
    -   `--type`\
        The `--type` argument is required, and must be set to one of 3
        values.
        -   `--type=Matlab`\
            For MATLAB jobs. It ensures that necessary MATLAB supporting
            libraries are made available to the job.
        -   `--type=R`\
            For R jobs. It ensures that the R runtime environment is
            made available to the job.
        -   `--type=Other`\
            For jobs that are neither MATLAB or R. \"Other\" *should* be
            specified for Python jobs.
    -   `--version=VersionNumber`\
        This argument is required for R and some Matlab jobs. It
        specifies the version of R needed. Possible values are listed
        below:
        -   `sl6-R-2.10.1` (version R-2.10.1 on Scientific Linux)
        -   `sl6-R-2.13.1` (version R-2.13.1 on Scientific Linux)
        -   `sl6-R-2.14.1` (version R-2.14.1 on Scientific Linux)
        -   `sl6-R-2.15.1` (version R-2.15.1 on Scientific Linux)
        -   `sl6-R-2.15.2` (version R-2.15.1 on Scientific Linux)
        -   `sl6-R-2.15.3` (version R-2.15.1 on Scientific Linux)
        -   `sl6-R-3.0.1` (version R-3.0.1 on Scientific Linux)
        -   `sl6-R-3.1.0` (version R-3.1.0 on Scientific Linux)
        -   `sl6-R-3.2.0` (version R-3.2.0 on Scientific Linux)
        -   `R2011b` (Matlab version R2011b on Scientific Linux)
        -   `R2013b` (Matlab version R2013b on Scientific Linux)

    For example, assume that the `compare-states` program is a compiled
    MATLAB program that takes two arguments: the files to compare. It
    produces a file called `output.dat`. The command line for `mkdag`:

        ./mkdag --cmdtorun=compare-states --data=proj1data \
          --outputdir=proj1output --pattern=output.dat --parg=us.dat \
          --parg=state.dat --type=Matlab 

    (The backslashes above are used to break a long command across three
    lines. You can omit the backslashes and enter your command as a
    single line.)

5.  From the `outputdir` directory created by the `mkdag` command, run

        condor_submit_dag mydag.dag

    This submits and runs the batch of job(s) you setup in the
    \"`data`\" directory (`proj1data` in this example).  
    **Output, log,
    and error files for each job will also be placed within newly
    created folders for each job, within the \"`outputdir`\" you
    specified.**
