---
highlighter: none
layout: guide
title: "Practice: Passing Multiple Arguments to Multiple Jobs with One Submit File"
guide:
    order: 7
    category: Job Submission
    tag:
        - htc
---

{% capture content %}

- [Purpose](#purpose)
- [Submit multiple jobs by leveraging $(Process)/$(ProcID) as numerical arguments](#submit-multiple-jobs-by-leveraging-processprocid-as-numerical-arguments)
- [Submit multiple jobs with custom arguments using queue \<variable\> from \<list\>](#submit-multiple-jobs-with-custom-arguments-using-queue-variable-from-list)
- [Summary](#summary)
- [See also](#see-also)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Purpose

This guide is a continuation of [Practice: Passing Arguments from the Submit File to the Executable Script](htc-passing-arguments). In the previous example, we wrote and submitted a single submit file, which passed arguments to a single job.

What if you want to submit a list of jobs, each with unique arguments? Instead of tediously 
creating separate submit files for each job, we can utilize attributes in the submit file to 
pass various arguments to multiple jobs. On this page, we will introduce two methods: using 
numerical arguments, and using custom arguments. While this guide shows specific scripts and 
examples, we hope that you can apply the underlying principles to your own jobs. For more 
general descriptions of using arguments and submitting multiple jobs, see: 
* [Basic Scripting and Job Submission with Arguments](htc-basic-scripting)
* [Submitting Multiple Jobs Using HTCondor](multiple-jobs)


## Submit multiple jobs by leveraging $(Process)/$(ProcID) as numerical arguments
   
One of the default variables in an HTCondor submit file is `$(Process)` or `$(ProcID)`. This is assigned an integer that numbers N instances of the calculation, starting from 0 and ending at N-1. `$(Process)`/`$(ProcID)` can be useful for distinguishing filenames of outputs of different calculations within a job to prevent rewriting over outputs (also `$(Cluster)`/`$(ClusterID)`), but it may also be used as an argument for an executable.

In this exercise, we will use `$(Process)` to estimate the life expectancy within the years 2000-2009.

1.	Create a new submit file, `least_squares_process.sub`.

	```
	# least_squares_process.sub - an example HTCondor submit file for passing arguments
	# with the $(Process) variable

	# Custom variables can be specified
	country = Brazil
	processplus = $(Process)+2000
	year = $INT(processplus,%d)

	# Specify your executable and your arguments
	# Usage: least_squares.py [CSV] [Country] [Year, optional]
	executable = least_squares.py
	arguments = gapminder-life-expectancy.csv $(country) $(year)

	# Specify the log, standard error, and standard output (or screen output) files
	log = $(country)_$(year).log
	error = $(country)_$(year).err
	output = $(country)_$(year).out

	# We need to also transfer the csv file for the calculation
	transfer_input_files = gapminder-life-expectancy.csv

	# Requirements for our calculation
	request_cpus = 1
	request_memory = 1GB
	request_disk = 1GB

	# Tell HTCondor to run 10 instances of our calculation
	queue 10
	```
	{:.sub}

	Notice the differences between this submit script and the previous one:
	* At the bottom of the script, `queue 10` tells HTCondor to run 10 instances of our calculation. Each calculation will be assigned a number `$(Process)`, which will range from 0 to 9.
	* We want to estimate life expectancy between 2000 and 2009, so we set a custom variable `processplus = $(Process) + 2000`. This returns a string, i.e. “0 + 2000”, but this isn’t what we want! In the next line, we convert it to a useful integer value: `year = $INT(processplus,%d)`, which will now range from 2000 to 2009.
	* In our arguments, we append our new variable `$(year)`.
	* To prevent HTCondor from rewriting outputs from each calculation over each other, `_$(year)` is appended to the filenames of the log, error, and output files.

3. 	Submit the job.

	```
	[user@ap2002]$ condor_submit least_squares_process.sub
	```
	{:.term}
	
	Monitor the job with `condor_q`.

4. Once the job is fully complete, you can check your outputs to see if it worked as expected.

## Submit multiple jobs with custom arguments using queue \<variable\> from \<list\>

Let’s say we want to perform our analysis on a few countries in the year 2024, but not all. Instead of creating separate submit files from each country, we can utilize HTCondor’s `queue <variable> from <list>` function.

1.	Create text file called `countries.txt`. Within it, paste the following:

	```
	Argentina
	Brazil
	Chile
	```

2.	Create a new submit script, `least_squares_list.sub`.

	```
	# least_squares_list.sub - an example HTCondor submit file for passing arguments

	# Specify your executable and your arguments
	# Usage: least_squares.py [CSV] [Country] [Year, optional]
	executable = least_squares.py
	arguments = gapminder-life-expectancy.csv $(country) 2024

	# Specify the log, standard error, and standard output (or screen output) files
	log = $(country)_2024.log
	error = $(country)_2024.err
	output = $(country)_2024.out

	# We need to also transfer the csv file for the calculation
	transfer_input_files = gapminder-life-expectancy.csv

	# Requirements for our calculation
	request_cpus = 1
	request_memory = 1GB
	request_disk = 1GB

	# Tell HTCondor to run instances of our calculation from a list
	queue country from countries.txt
	```

	Notice differences between this submit file and the previous examples.
	* At the bottom of the submit file, we now use `queue country from countries.txt`. This tells HTCondor to iterate over `countries.txt` and in each iteration, set the variable `country` to the value on that line.
	* In our arguments line, we use the `$(country)` variable.

3. 	Submit the job.

	```
	[user@ap2002]$ condor_submit least_squares_process.sub
	```
	{:.term}
	
	Monitor the job with `condor_q`.

4. Once the job is fully complete, check the outputs to see if it worked as expected.

	```
	[user@ap2002]$ cat *2024.out
	```
	{:.term}


## Summary

* In the submit script, arguments are passed to the executable with the `arguments = ` attribute.
* Custom variables can be created within the submit script and utilized in arguments with the `$(variable)` syntax.
* HTCondor’s default variables, such as `$(Process)` can be leveraged in arguments.
* The `queue` attribute can be used to submit multiple jobs from one submit file that pass various arguments.
* Wrapper scripts are useful for performing pre-/post- calculation commands or complex operations and can take and pass arguments.

## See also
* [Practice: Submit HTC Jobs using HTCondor](/uw-research-computing/htcondor-job-submission)
* [Submitting Multiple Jobs Using HTCondor](/uw-research-computing/multiple-jobs)
* [HTCondor Docs: Submitting a Job](https://htcondor.readthedocs.io/en/latest/users-manual/submitting-a-job.html)
