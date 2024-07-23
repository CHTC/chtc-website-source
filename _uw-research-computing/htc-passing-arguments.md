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
- [Sample calculation: A linear least squares regression on life expectancy data](#sample-calculation-a-linear-least-squares-regression-on-life-expectancy-data)
- [Writing a submit file for a single sample calculation](#writing-a-submit-file-for-a-single-sample-calculation)
- [Leveraging $(Process)/$(ProcID) as arguments](#leveraging-processprocid-as-arguments)
- [Filenames as arguments using queue \<variable\> from \<list\>](#filenames-as-arguments-using-queue-from-)
- [Summary](#summary)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Purpose

Many executables require arguments to perform tasks. This exercise will show you how to pass arguments from the HTCondor submit file to these executables.

## Sample calculation: A linear least squares regression on life expectancy data

In this exercise, we will perform a linear least squares regression analysis on life expectancy data for each country. This exercise was adapted from the work by the [Software Carpentry](https://software-carpentry.org/) under the [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/).

1.  In your working directory on the access point, download gapminder-life-expectancy.csv data.
    ```
    [user@ap2002]$ wget [insert link here]
    ```
    {:.term}

2.	Create a file called `least_squares.py`. In it, paste the following code:

	```
	#!/usr/bin/env python3
	# Usage: least_squares.py [CSV] [Country] [Year, optional]

	import os, sys, time
	import csv

	# Calculates least squares
	def least_squares(years, data):
		# Check length of data
		assert len(years) == len(data)
		x_sum = 0
		y_sum = 0
		x_sq_sum = 0
		xy_sum = 0
		n = len(data)
		# Least squares regression calculation
		for i in range(0, n):
			x = int(years[i])
			y = float(data[i])
			x_sum = x_sum + x
			y_sum = y_sum + y
			x_sq_sum = x_sq_sum + (x ** 2)
			xy_sum = xy_sum + (x * y)
		m = ((n*xy_sum)-(x_sum*y_sum))/((n*x_sq_sum)-(x_sum ** 2))
		b = (y_sum-m*x_sum)/n
		# Return results
		print("Linear regression (y = mx + b):")
		print("m =", format(m, '.3f'), "b =", format(b, '.3f'))
		return m, b


	# Extract life expectancy data for a country
	def extract_data(filename, country):
		header = []
		data = []
		with open(filename, 'r') as csvfile:
			csvreader = csv.reader(csvfile)
			for row in csvreader:
				if len(row) > 1:
					header.append(row[0])
					data.append(row[1:-1])
		years = data[0]
		i = header.index(country)
		country_data = data[i]
		return years, country_data

	# Check arguments
	# Usage: least_squares.py [CSV] [Country] [Year, optional]
	if len(sys.argv) < 3 or len(sys.argv) > 4:
		print(f'Usage: {os.path.basename(sys.argv[0])} [CSV] [Country] [Year, optional]')
		sys.exit(1)

	# Least squares on a country
	filename = sys.argv[1]
	country = sys.argv[2]
	years, country_data = extract_data(filename, country)
	m, b = least_squares(years, country_data)

	# Estimated life expectancy from year
	if len(sys.argv) == 4:
		x = int(sys.argv[3])
		print('Estimated life expectancy for', country, 'in the year', x)
		print(format(m*x+b, '.3f'))
	```

3.	For this exercise, it’s not necessary to understand each line of code, but in essence, this code reads a .csv file and performs a linear least squares regression on a specified country’s data. Let’s see how to use this code. 

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

## Writing a submit file for a single sample calculation

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


## Leveraging $(Process)/$(ProcID) as arguments
   
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
	* We want to estimate life expectancy between 2000 and 2009, so we set a custom variable `processplus = $(Process) + 2000`. This is a string, i.e. “0 + 2000”. This isn’t what we want! We convert it to a useful integer value in the next line: `year = $INT(processplus,%d)`. Each calculation can now use the variable `$(year)`, which will now range from 2000 to 2009.
	* In our arguments, we append our new variable `$(year)`.
	* To prevent HTCondor from rewriting outputs from each calculation over each other, `_$(year)` is appended to the filenames of the log, error, and output files.

3. 	Submit the job.
	```
	[user@ap2002]$ condor_submit least_squares_process.sub
	```
	{:.term}
	
	Monitor the job with `condor_q`.

4. Once the job is fully complete, you can check your outputs to see if it worked as expected.

## Filenames as arguments using queue \<variable\> from \<list\>

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

4. Once the job is fully complete, you can check your outputs to see if it worked as expected.
	```
	[user@ap2002]$ cat *2024.out
	```
	{:.term}

## Summary

* In the submit script, arguments are passed to the executable with the `arguments = ` attribute.
* Custom variables can be created within the submit script and utilized in arguments with the `$(variable)` syntax.
* HTCondor’s default variables, such as `$(Process)` can be leveraged in arguments.
* The `queue` attribute can be used to submit multiple jobs from one submit file that pass various arguments.
