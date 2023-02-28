
[title]: - "Optimizing HTCondor Submit File Resource Requests"

[TOC]

# Overview

Much of HTCondor's HTC power comes from the ability to run a large number of jobs simulateously. 
To optimize your work with a high-throughput computing (HTC)
approach, you will need to test and optimizing the resource requests of those jobs, by 
only requesting the amount of memory, disk, and cpus truly needed.
This is an important practice that will maximize your throughput by optimizing the 
number of potential 'slots' that your jobs can match to, reducing the overall 
turnaround time for completing a whole batch.

If you have questions or are unsure if and how your work can be broken up, please contact us at 
<chtc@cs.wisc.edu>.

# Requesting the Number of CPUs, Memory, and Disk Space for the HTCondor Submit File

In the HTCondor submit file, you must explicitly request the number of 
CPUs (i.e. cores), and the amount of disk and memory that the job needs 
to complete successfully.
When you submit a job for the 
first time you may not know just how much to request and that's okay. 
Below are some suggestions for making resource requests for initial test 
jobs. **As always, reviewing the HTCondor `log` file from past jobs is 
a great way to learn about the resource needs of your jobs.**

**Requesting CPU Cores**

- For **requesting CPU cores start by requesting a single cpu**. With single-cpu jobs, you will see 
your jobs start sooner. Ultimately you will be able to achieve 
greater throughtput with single cpus jobs compared to jobs that request 
and use multiple cpus. 

    - **Keep in mind, requesting more CPU cores for a job 
    does not mean that your jobs will use more cpus.** Rather, you want to make sure 
    that your CPU request matches the number of cores (i.e. 'threads' or 'processes') 
    that you expect your software to use. (Most softwares only use 1 CPU core, by default.)

    - There is limited support for multicore work in our high throughput system. For large-scale multicore jobs, contact a Research Computing Facilitator at <chtc@cs.wisc.edu>. 
    
**Requesting Disk Space**

- To inform initial disk requests always look at the size of your input 
files. At a minimum, you need to request enough disk to support all 
of the input files, executable, and the output you expect, but don't forget that the standard 'error' and 'output'
files you specify will capture 'terminal' output that may add up, too.
      
    - If many of your input and output files are compressed 
(i.e. zipped or tarballs) you will need to factor that into your 
estimates for disk usage as these files will take up additonal space once uncompressed 
in the job.
      
    - For your initial tests it is okay to request more disk than 
your job may need so that the test completes successfully. **The key 
is to adjust disk requests for subsequent jobs based on the results 
of these test jobs.**
 
**Requesting Memory**

- Estimating **memory requests** can sometimes be tricky. If you've performed the 
same or similar work on another computer, consider using the amount of 
memory (i.e. RAM) from that computer as a starting point. For instance, 
most laptop computers these days will have 8 or 16 GB of memory, which is okay to start 
with if you know a single job will succeed on your laptop.

	- For your initial tests it is okay to request more memory than 
your job may need so that the test completes successfully. **The key 
is to adjust memory requests for subsequent jobs based on the results 
of these test jobs.** To fine tune your requests, make sure to run test jobs - see below for a recommended process.

**Importance of Test Jobs**

- Once you have run a test job using a small number of jobs, **Review the bottom of the HTCondor `log` files from your test jobs to see how many cpus and how much memory and disk space were used.** HTCondor will report 
the memory, disk, and cpu usage of your jobs in a table at the *bottom* of this file. You can use these values to inform the parameters for future jobs. For example, the bottom of a `.log` file may look like this: 

        Partitionable Resources :    Usage  Request Allocated 
           Cpus                 :        1        1         1 
           Disk (KB)            :   860878  1048576   1808522 
           IoHeavy              :                           0 
           Memory (MB)          :      960     1024      1024

*Memory is listed in units of megabytes (MB) and disk usage is listed in units of kilobytes (KB). A quick Google search yields many calculators to help convert between differnt computing size measurements.*


# Always Start With Test Jobs

Submitting test jobs is an important first step for optimizing 
the resource requests of your jobs. We always recommend the following approach whether this is your first time 
using HTC or you are an experienced user starting a new workflow:

**Step 1: Submit a single test job**
      - Use a single test job to confirm the job was completed successfully and the results are what you expected.

**Step 2: Submit a few (3-10) test jobs using a single submit file**
      - Once you have a single test job that completes successfully, the next 
        step is to submit a small batch of test jobs (e.g. 3 - 10 jobs) 
        [**using a single submit file**](https://chtc.cs.wisc.edu/uw-research-computing/multiple-jobs). Use this small-scale 
        multi-job submission test to ensure that all jobs complete successfully, produce the 
        desired output, and do not conflict with each other when submitted together. Additionally, by running test jobs, it provides an opportunity to review the `.log` files after each submission to optimize resource requests for future submissions as described above.
       
**Step 3: Scale up**
      - If your workflow requires submission of 500 jobs or less, proceed with submitting your entire batch of jobs. If you plan to submit
      more than 500 jobs, we recommend submitting an intermediate test of 100-1,000 jobs to catch any 
      failures or holds that may mean your jobs have additional `requirements` they may need to specify 
      (and which CHTC staff can help you to identify, based upon your tests). 

Some general tips for test jobs:

- Select smaller data sets or subsets of data for your first test jobs. Using 
smaller data will keep the resource needs of your jobs low which will help get 
test jobs to start, and complete, sooner, when you're just making sure that your submit file 
and other logistical aspects of jobs submission are as you want them.

- If possible, submit test jobs that will reproduce results you've gotten 
using another system, this makes for a good "sanity check", as you'll be able 
to compare the results of the test to those previously obtained.

- Give your test jobs, and associated HTCondor `log`, `error`, `output`, 
and `submit` files meaningful names so you know which results refer to which tests.

- After initial tests complete successfully, scale up to larger or full-size 
data sets; **if your jobs may span a range of input file sizes, submit tests using the smallest 
and largest inputs to examine the range of resources that these jobs may need.**

# Get Help

For assistance or questions, please email the CHTC team at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu). 

