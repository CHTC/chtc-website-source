---
highlighter: none
layout: guide
title: "Practice: Passing Arguments from the Submit File to the Executable Script"
guide:
    order: 2
    category: Job Submission
    tag:
        - htc
---

{% capture content %}

- [Purpose](#purpose)
- [Understand and test the script with arguments](#understand-and-test-the-script-with-arguments)
- [Write and submit an HTCondor submit file with arguments](#write-and-submit-an-htcondor-submit-file-with-arguments)
- [Pass arguments through a wrapper script](#pass-arguments-through-a-wrapper-script)
- [Summary](#summary)
- [Next steps](#next-steps)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Purpose

Many executables require arguments to perform tasks. As a user, you may need to specify specific files or parameters for your calculations. This exercise will show how arguments are used in a simple calculation and walk through how to write an HTCondor submit file to pass these arguments to the executable.

## Understand and test the script with arguments

In this exercise, we will perform a linear least squares regression analysis on life expectancy data for a country.We will need to understand how the script utilizes arguments.

This exercise was adapted from the work by the [Software Carpentry](https://software-carpentry.org/) under the [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/).

1.  In your working directory on the access point, download the data: `gapminder-life-expectancy.csv`.

    ```
    [user@ap2002]$ wget https://chtc.cs.wisc.edu/uw-research-computing/files/gapminder-life-expectancy.csv
    ```
    {:.term}

2.	Download the script: `least_squares.py`.
	```
    [user@ap2002]$ wget https://chtc.cs.wisc.edu/uw-research-computing/files/least_squares.py
    ```
    {:.term}

3.	For this exercise, it’s not necessary to understand each line of code, but in summary, this code reads a .csv file and performs a linear least squares regression on a specified country’s data. Let’s see how to use this code. 

	First we need to make our code executable:

	```
	[user@ap2002]$ chmod +x least_squares.py
	```
	{:.term}

	From the terminal, we can run the code to preview its usage:

	```
	[user@ap2002]$ ./least_squares.py
	Usage: least_squares.py [CSV] [Country] [Year, optional]
	```
	{:.term}

	From the returned line, we see how to use it. The executable is `least_squares.py`. The arguments are:
	* `[CSV]`: The .csv file containing our data
	* `[Country]`: The name of the country we want to analyze
	* `[Year]`: An optional argument that lets us estimate the life expectancy of the country for that year.

4. Let’s run the code to see what the output should look like. In the terminal, type:

	```
	[user@ap2002]$ ./least_squares.py gapminder-life-expectancy.csv Brazil
	```
	{:.term}

	This should return the following:

	```
	Linear regression (y = mx + b):
	m = 0.205 b = -348.495
	```
	{:.term}

5.	If we put in the year 2000 as an optional argument:

	```
	[user@ap2002]$ ./least_squares.py gapminder-life-expectancy.csv Brazil 2000
	Linear regression (y = mx + b):
	m = 0.205 b = -348.495
	Estimated life expectancy for Brazil in the year 2000
	61.280
	```
	{:.term}

## Write and submit an HTCondor submit file with arguments

Now that we know how to run our script and what to expect, let’s translate this into a job for HTCondor.

1. Create a submit file for the job called `least_squares.sub.`
	
	```
	# least_squares.sub - an example HTCondor submit file for passing arguments

	# Custom variable can be specified
	country = Brazil

	# Specify your executable and your arguments
	# Usage: least_squares.py [CSV] [Country] [Year, optional]
	executable = least_squares.py
	arguments = gapminder-life-expectancy.csv $(country)

	# Specify the log, standard error, and standard output (or screen output) files
	log = $(country).log
	error = $(country).err
	output = $(country).out

	# We need to also transfer the csv file for the calculation
	transfer_input_files = gapminder-life-expectancy.csv

	# Requirements for our calculation
	request_cpus = 1
	request_memory = 1GB
	request_disk = 1GB

	# Tell HTCondor to run 1 instance of our calculation
	queue
	```
	{:.sub}

	Important notes:
	* In this submit file, we created a custom variable called `country` set to the value “Brazil”, which we use later when specifying arguments.
	* We tell the job manager that our executable is `least_squares.py`.
	* In a separate line, we pass the arguments `gapminder-life-expectancy.csv $(country)` in the order that is required by `least_squares.py`.
	* We also need to transfer the csv with our data, which we do with `transfer_input_files = gapminder-life-expectancy.csv`

2. 	Submit the file.

	```
	[user@ap2002]$ condor_submit least_squares.sub
	```
	{:.term}
	
	We can monitor the job with `condor_q`.

3.	Once the job is completed, we can check `least_sq_Brazil.out` to see that the arguments passed to `least_squares.py` and works as expected.

	```
	[user@ap2002]$ cat least_sq_Brazil.out
	Linear regression (y = mx + b):
	m = 0.205 b = -348.495
	```
	{:.term}

## Pass arguments through a wrapper script
A wrapper script can be useful in jobs, enabling more complex operations and simple pre- and post- calculation commands. Wrapper scripts can also take and pass on arguments. Let's see how to write a simple wrapper script for our calculation.

In this exercise, we will obtain data for multiple countries between the years 2024 and 2033 and return them in tarballs organized by country.

1.  Create `least_squares_range.sh`.
	
	```
	#!/bin/bash

	# This wrapper script takes in four arguments:
	# Usage: ./least_squares_range.sh [CSV] [Country] [Start Year] [End Year]

	# Assign variables for readability
	CSV=$1
	Country=$2
	StartY=$3
	EndY=$4

	# Loop least_squares.py over start and end years
	for i in $(seq $StartY $EndY);
	do
		./least_squares.py ${CSV} $Country $i > ${Country}_${i}.txt
	done

	# Create tarball
	tar -czf ${Country}.tar.gz ${Country}*.txt

	# Delete text files
	rm *.txt
	```

	In a shell script, arguments are assigned integers according to their order. The executable script itself, `least_squares_range.sh`, is assigned `$0`.

	While not necessary, it's useful to assign descriptive variables to input arguments to keep track of what's happening in the wrapper script. `Country=$2` assigns the variable `$Country` with the same value as the second argument. Note that there must be no spaces around the `=` sign.

	The script then uses a simple `for` loop to run `least_squares.py` over a range of years and writes them to text files.

	Once the loop is complete, the text files are consolidated into a tarball. Since this object is in the top-level directory of the job, it will automatically be transferred back to the submit server.

2.	Create a new submit script, `least_squares_range.sub`.

	```
	# least_squares_range.sub - an example HTCondor submit file for passing arguments

	# Custom variables can be specified
	country = Brazil

	# Specify your executable and your arguments
	# Usage: ./least_squares_range.sh [CSV] [Country] [Start Year] [End Year]
	executable = least_squares_range.sh
	arguments = gapminder-life-expectancy.csv $(country) 2024 2033

	# Specify the log, standard error, and standard output (or screen output) files
	log = $(country)_24_33.log
	error = $(country)_24_33.err
	output = $(country)_24_33.out

	# We need to also transfer the csv file for the calculation
	transfer_input_files = gapminder-life-expectancy.csv, least_squares.py

	# Requirements for our calculation
	request_cpus = 1
	request_memory = 1GB
	request_disk = 1GB

	# Tell HTCondor to run instances of our calculation
	queue
	```

	Key highlights:
	* The `executable` is now our wrapper script, `least_squares_range.sh`
	* We edit the `arguments` line according to the usage of the wrapper script we wrote.
	* `transfer_input_files` now includes `least_squares.py`. We now need to specify this file to be transferred over, since it is no longer our executable.

3. Submit the job.
	```
	[user@ap2002]$ condor_submit least_squares_process.sub
	```
	{:.term}
	
	Monitor the job with `condor_q`.

4. If your job executed correctly, you should now have `Brazil.tar.gz`.
	```
	[user@ap2002]$ ls
	Brazil_24_33.err
	Brazil_24_33.log
	Brazil_24_33.out
	Brazil.tar.gz
	least_squares_range.sh
	least_squares_range.sub
	```
	{:.term}

## Summary

* In the submit script, arguments are passed to the executable with the `arguments = ` attribute.
* Custom variables can be created within the submit script and utilized in arguments with the `$(variable)` syntax.
* Wrapper scripts are useful for performing pre-/post- calculation commands or complex operations and can take and pass arguments.

## Next steps
In the next part of this guide, we will submit multiple jobs with different arguments with just one submit file.

[Practice: Passing Multiple Arguments to Multiple Jobs with One Submit File](htc-passing-arguments-2)