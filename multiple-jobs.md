---
highlighter: none
layout: content
title: Submitting Multiple Jobs Using HTCondor
---


**To best understand the below information, users should already
have an understanding of:**

1.  Using the command line to: navigate within directories,
    create/copy/move/delete files and directories, and run their
    intended programs (aka \"executables\").  

2.  [The CHTC\'s Intro to Running HTCondor
    Jobs](http://chtc.cs.wisc.edu/helloworld.shtml)
3.  The importance of indicating the below submit file lines, which are
    left out of the below examples for simplicity:

    ``` {.sub}
    universe = vanilla    # or other
    request_memory = < MB >
    request_disk = < KB >
    request_cpus = < positive integer >
    should_transfer_files = YES
    when_to_transfer_output = ON_EXIT    # or other
    ```

Overview
========

One of HTCondor\'s features is the ability to submit many similar jobs
using one submit file. This is accomplished by using:

> -   a \"queue\" keyword, that indicates how many jobs to run
> -   *variables* in the submit file, taking the place of information
>     that will change with each job, such as input files, input
>     directories, or code arguments. Variables in an HTCondor submit
>     file look like this: `$(variable_name)`

There are different ways to \"queue\" multiple jobs and indicate the
difference between them using variables.

1.  **[Using Integer-Numbered Input Files](#process)** - assumes that
    each job needs a different (numbered) input file
2.  **[Using Any Unique Input File Names](#foreach)** - assumes that
    each job needs a different input file
3.  **[Variations Beyond Input Files](#discussion)**  
    A.  **[Varying arguments](#args)** - assumes that each job needs a
        different set of input arguments  
    B.  **[Supplying multiple variables per job](#multiple-args)** -
        assumes that multiple items (input files, arguments,
        directories) are changing for each job
4.  **[Organizing Jobs in Individual Directories](#initialdir)** -
    another option that can be helpful in organizing job submissions.

These options are also described in this video from HTCondor Week 2020: 
* [Submitting Multiple Jobs Using HTCondor](https://www.youtube.com/watch?v=m7dQChJH5LU)


Many options exist for streamlining your submission of multiple jobs,
and this guide only covers a few such options of what is truly possible with
HTCondor. If you are interested in a particular approach that isn't listed here, [contact a Research
Computing Facilitator](mailto:chtc@cs.wisc.edu) and we can advise on the
best implementation.


<a name="process"></a>

**1. Submitting Multiple Jobs Using Integer-Numbered Input Files**
==============================================================

> This example is most similar to our [Intro to Running HTCondor
> Jobs](http://chtc.cs.wisc.edu/helloworld.shtml).

This method addresses an example where you have multiple, numbered input
files and want to run a job for each one. On the submit server, this
might look like this:

``` 
[alice@submit]$ ls 
0.data  1.data  2.data  my_exec  reference.data
```
{:.term}

Suppose we want to run \"my\_exec\" three times, once for each \".data\"
file, and where every job needs the \"reference.data\" file. We will use
HTCondor\'s built in `$(Process)` variable to create multiple numbered
jobs, each using a different input file. In a submit file, this will
look like this:

``` {.sub}
# Submit File
executable = my_exec
transfer_input_files = $(Process).data, reference.data
output = $(Process).out

queue 3
```

Here the `queue 3` line will create 3 jobs. Each job will be assigned a
unique \"Process\" number, starting at 0 and ending at 2. For each job,
the appropriate number will replace `$(Process)` in the submit file
above. This means that each job will get a unique input file.

More generally, for \"queue *N*\" in the submit file, the \$(Process)
variable will start with \"0\" and end with *N*-1, such that you can use
\$(Process) to indicate unique filenames and filepaths.

Once the job(s) finishes running, the directory on the submit server
should look like this:

``` 
[alice@submit]$ ls
0.data  0.out  1.data  1.out  2.data  2.out  my_exec  reference.data
```
{:.term}


> ### Starting at One
>
> What if your files are numbered 1 - 100 instead of 0 - 99? Instead of
> renaming your files, you can do the following. In your submit file,
> use:
>
> ``` {.sub}
> plusone = $(Process) + 1
> NewProcess = $INT(plusone, %d)
> ```
>
> Then use `$(NewProcess)` anywhere in the submit file that you would
> have normally used `$(Process)`.
>
> Note that there is nothing special about the names `plusone` and
> `NewProcess` - you can use any names you want as variables.


<a name="foreach"></a>

**2. Submitting Multiple Jobs Using Unique Input Files**
====================================================

[The previous examples](#process) are great for numbered files but it\'s
not always convenient to use this naming scheme. It is possible to write
a single submit file that uses different non-numbered files or
directories by using a different `queue` statement.

Suppose we have a program called `compare_states` and we want to run it
on data from three different states, Iowa, Missouri and Wisconsin. In
our submit directory, that looks like this:

``` 
[alice@submit]$ ls
compare_states  iowa.data  missouri.data  united-states.data  wisconsin.data
```
{:.term}

Here, we want to create a job for each state, and use the
`united-states.data` file for all three jobs.

First, we will make a list of each data file that we want to use in an
individual job:

**`state_list.txt`**

``` 
iowa.data
missouri.data
wisconsin.data
```
{:.file}

Then, in the submit file, we will use that list as part of the `queue`
statement. We will choose a name for the items in the list; in this
case, we\'ve chosen the word \"state\".

``` {.sub}
# Submit File
executable = compare_states
transfer_input_files = $(state),united-states.data
out = $(state).out

queue state from state_list.txt
```

That final \"queue\...from\" statement will create a job for every file
in our list. It will assign each file to the \"state\" variable in turn.
In the rest of the submit file, `$(state)` will be replaced by the
values in the list, one value for each job. Here we\'ve used the values
from the list to transfer the appropriate input file and name the log
file. When the job completes, the home directory would look like this:

``` 
[alice@submit]$ ls
compare_states  iowa.data.out  missouri.data.out   wisconsin.data
iowa.data       missouri.data  united-states.data  wisconsin.data.out
```
{:.term}


> **Tips for creating a list**
>
> If you want a quick way to create a list of files like
> \"state\_list.txt\", use the shell command `ls` and the greater-than
> symbol `>` to list your files and then save them. For example:
>
> ``` 
> [alice@submit]$ ls *.data > my_files.txt
> ```
> {:.term}
>
> Will list all files that end with the \".data\" extension and save
> them to a file called \"my\_files.txt\".

> **Naming Variables**
>
> You can use any names you like in the \"queue \... from\" statement:
>
> ``` {.sub}
> queue year from list.txt
> queue state from list.txt
> queue x from list.txt
> ```
>
> We recommend using a descriptive name so that it is easier to read
> your submit file.


<a name="list"></a>

Other Ways of Listing Files
---------------------------

There are two other ways to provide a list, where you would like each
item in the list to create its own job. In the examples below, we are
assuming the same program and files as above.

<a name="matching"></a>

**a. Create jobs \"matching\" a file pattern**

This method of submission creates a job for each file or directory that
matches the pattern provided in your submit file.

``` {.sub}
# Submit File
executable = compare_states
transfer_input_files = $(state),united-states.data
out = $(state).out

queue state matching *.data
```

In this case, we have generated a list by using the pattern `*.data`; a
job will be created for each file that ends with the \"data\" suffix.


<a name="in"></a>

 **b. Create jobs from a list written into the submit file**

In this final example, the list of desired items is written directly
into the submit file using the syntax \"queue \... in ( \... )\"

``` {.sub}
# Submit File
executable = compare_states
transfer_input_files = $(state),united-states.data
out = $(state).out

queue state in (iowa.data 
                missouri.data 
                wisconsin.data)
```


<a name="discussion"></a>

**3. Customizing Multiple Job Submissions**
=======================================

If your code doesn\'t require unique input files to run multiple jobs,
keep reading to find other ways to provide many jobs with a different
value: either an argument or combination of values.


<a name="args"></a>

A. Varying arguments
--------------------

Suppose we want to analyze a particular state over several years, and
this option is set using a command line argument:

``` 
$ compare_states -y 2015 -i wisconsin.data -o wisconsin_2015.out
```
{:.term}

For this example, the year will be changing, not the state, so we will
create a list of the years to analyze.

**`year_list.txt`**

``` 
2013
2014
2015
```
{:.file}

In the submit file, we use the same \"queue \... from\" syntax as
before, but with a different variable name (\"year\") and fill in the
arguments line with a variable.

``` {.sub}
executable = compare_states
arguments = -y $(year) -i wisconsin.data -o wisconsin_$(year).out
transfer_input_files = wisconsin.data, united-states.data

queue year from year_list.txt
```


<a name="multiple-args"></a>

B. Using Multiple Arguments
---------------------------

The method of job submission shown above in a [queue \...
from](#foreach) statement can also be used to submit jobs using multiple
values. Suppose that we want to run two jobs for each state file - one
for 2013 and one for 2015, using the same syntax as [before](#args):

``` 
$ compare_states -y 2015 -i wisconsin.data -o wisconsin_2015.out
```
{:.term}

We will create a list of each combination that we want to run:

**`states_list.txt`**

``` 
2013, wisconsin
2015, wisconsin
2013, missouri
2015, missouri
2013, iowa
2015, iowa
```
{:.file}

Then, in the submit file, we use the same \"queue \... from\" syntax as
before, but we include two variables (one for each value in the line)
that we can use in the submit file.

``` {.sub}
executable = compare_states
arguments = -y $(year) -i $(state).data -o $(state)_$(year).out
transfer_input_files = $(state).data, united-states.data

queue year,state from states_list.txt
```

This setup will create six jobs, one for each line in the
`states_list.txt` file.


<a name="initialdir"></a>

**4. Dividing Jobs Into Multiple Directories**
==========================================

One way to organize jobs is to assign each job to its own directory,
instead of putting files in the same directory with unique names. To
continue our \"compare\_states\" example, suppose there\'s a directory
for each state you want to analyze, and each of those directories has
its own input file, like so:

``` 
[alice@submit]$ ls -F
compare_states  iowa/  missouri/  united-states.data  wisconsin/

[alice@submit]$ ls -F wisconsin/
input.data

[alice@submit]$ ls -F missouri/
input.data

[alice@submit]$ ls -F iowa/
input.data
```
{:.term}

We will use two features to submit jobs. First, like we have done for
the previous examples, create a list of the items that are changing for
each job. In this case, it will be each directory.

**`states_list.txt`**

``` 
iowa
missouri
wisconsin
```
{:.file}

There will be a \"queue \... from\" statement to create a job for each
directory in the list. However, we will add another item to the submit
file called \"initialdir\" that will submit each job out of its own
directory:

``` {.sub}
# Submit File
executable = compare_states
initialdir = $(state)
transfer_input_files = input.data, ../united-states.data
out = job.out

queue state from states_list.txt
```

Here, HTCondor will create a job for each state in the list and use that
state\'s directory as the \"initialdir\" - the directory where the job
will actually be submitted. Therefore, in `transfer_input_files`, we can
use `input.data` without using the directory name in the path, and to
use the `united-states.data` file, we need to indicate it is in the
directory above the state directory. The output file will also go into
the state directory.

After the job runs, the job directories would look like this:

``` 
[alice@submit]$ ls -F
compare_states  iowa/  missouri/  united-states.data  wisconsin/

[alice@submit]$ ls -F wisconsin/
input.data  job.out

[alice@submit]$ ls -F missouri/
input.data  job.out

[alice@submit]$ ls -F iowa/
input.data  job.out
```
{:.term}
