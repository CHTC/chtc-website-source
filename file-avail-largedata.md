---
highlighter: none
#layout: default
layout: file_avail
title: Managing Large Data in HTC Jobs
---

# Data Transfer Solutions By File Size

Due to the distributed nature of CHTC's High Throughput Computing (HTC) system, 
your jobs will run on a server (aka an execute server) that is separate and 
distinct from the server that your jobs are submitted from (aka the submit server). 
This means that a copy of all the files needed to start your jobs must be 
made available on the execute server. Likewise, any output files created 
during the execution of your jobs, which are written to the execute server, 
will also need to be transferred to an acessible location after your jobs complete. 
**How input files are copied to the execute server and how output files are 
copied back will depend on the size of these files.**

CHTC's data filesystem called "Staging" is a distinct location for 
temporarily hosting files that are too large to be handled in a 
high-throughput fashion via the default HTCondor file transfer 
mechanism which is otherwise used for small files hosted in your `/home` 
directory on your submit server. 

CHTC's `/staging` location is specifically intended for:

- any individual input files >100MB   
- input files totaling >500MB per job
- individual output files >4GB
- output files totaling >4GB per job 

# Quick Links

- [Who Should Use Staging](#use)    
- [Policies and User Responsibilities](#policies-and-user-responsibilities)      
- [Get Access To Staging](#access)       
- [Use The Transfer Server To Move Files To/From Staging](#transfer)       
- [Submit Jobs With Input Files in Staging](#large-input)     
	- [Prepare Input Files For Staging](TBD)
- [Staging Large Data](#staging-large-data)    
- [Using Staged Files in a Job](#using-staged-files-in-a-job)    
	- [Accessing Large Input Files](#accessing-large-input-files)    
	- [Moving Large Output Files](#moving-large-output-files)    
- [Submit Jobs Using Staged Data](#submit-jobs-using-staged-data)    
- [Checking your Quota, Data Use, and File Counts](#checking-your-quota-data-use-and-file-counts)    

<a name="use"></a>
# Who Should Use `/staging`

`/staging` is a location specifically for hosting singularly larger input (>100MB) 
and/or larger ouput (>4GB) files or when jobs need 500MB or more of total input 
or will produce 4GB or more of total output. Job input and outupt of these 
sizes are too large to be managed by CHTC's other data movement methods. 

**Default CHTC account creation does not include access to `/staging`.** 
Access to `/staging` is provided as needed for supporting your data management 
needs. If you think you need access to `/staging`, or would 
like to know more about managing your data needs, please contact us at 
<chtc@cs.wisc.edu>.

Files hosted in `/staging` are only excessible to jobs running in the CHTC pool. 
About 50% of CHTC execute servers have access to `/staging`. Users will get 
better job throughput if they are able to break up their work into smaller jobs 
that each use or procude input and output files that do not require `/staging`.

# Policies and User Responsibilities

**USERS VIOLATING ANY OF THE POLICIES IN THIS GUIDE WILL
HAVE THEIR DATA STAGING ACCESS AND/OR CHTC ACCOUNT REVOKED UNTIL CORRECTIVE
MEASURES ARE TAKEN. CHTC STAFF RESERVE THE RIGHT TO REMOVE ANY
PROBLEMATIC USER DATA AT ANY TIME IN ORDER TO PRESERVE PERFORMANCE**

<p style="background-color:yellow;"> Jobs should <b>NEVER</b> be submitted from 
<code>/staging</code>. All HTCondor job submissions must be performed from your 
<code>/home</code> directory on the submit server and job <code>log</code>, 
<code>error</code>, and <code>output</code> files should never be 
written to <code>/staging</code>.</p>

- **Backup your files**: As with all CHTC file spaces, CHTC does not back 
up your files in `/staging`.

- **Use bash script commands to access files in `/staging`**: Files placed in `/staging` 
should **NEVER** be listed in the submit file, but rather accessed 
via the job's executable (aka .sh) script. More details provided 
[below](TBD).

- **Use the transfer server**: We expect that users will only use our dedicated 
transfer server, transfer.chtc.wisc.edu, instead of the submit server,
to upload and download appropriate files to and from `/staging`. Transferring 
files to `/staging` with the submit server can negatively impact job submission for 
you and other users. More details provide [below](#transfer-server).

- **Quota control**:`/staging` directories include disk space and 
items (i.e. directories and files) quotas. Quotas are necessary for 
maintaning the stability and reliability of `/staging`. Quota changes can 
be requested by emailing <chtc@cs.wisc.edu> and 
users can monitor quota settings and usage as described [below](TBD)

- **Reduce file size and count**: We expect that users will use `tar` and 
compression to reduce data size and file counts such that a single tarball 
is needed and/or produced per job. More details provided [below](TBD).

- **Shared group data**: `/staging` directories are owned by the user, 
and only the user's own jobs can access these files. We can create shared group 
`/staging` directories for sharing larger input and output files as needed. 
[Contact us](mailto:chtc@cs.wisc.edu) to learn more.

- **Remove data**: We expect that users will remove data from `/staging` AS
SOON AS IT IS NO LONGER NEEDED FOR ACTIVELY-RUNNING JOBS. 

- CHTC staff reserve the right to remove data from '/staging` 
(or any CHTC file system) at any time.

<a name="access"></a>
# Get Access To `/staging`

<details><summary>Click to learn more</summary>
<p>
Space in our data staging area is granted by request. If you think you need 
a directory, please contact us at <chtc@cs.wisc.edu>. So we can process 
your request more quickly, please include details regarding the number and size of 
the input and/or output files you plan to host in `/staging`. You will also be 
granted access to out dedicated transfer server upon creation of your 
`/staging` directory.

*What is the path to my `/staging` directory?*
- Individual directories will be created at `/staging/username`
- Group directories will be created at `/staging/groups/group_name`

</p>
</details>

<a name="transfer"></a>
# Use The Transfer Server To Move Large Files To/From `/staging`

<details><summary>Click to learn more</summary>
<p>
Our dedicated transfer server, `transfer.chtc.wisc.edu`, should be used to 
upload your files to `/staging` and/or to download your output from 
`/staging`. 

The transfer server is a separate server that is independent of the submit 
server you otherwise use for job submission. By using the transfer server 
for `/staging` data upload and download, you are helping to reduce network 
bottlenecks on the submit server that could otherwise negatively impact 
the submit server's performance and ability to manage and submit jobs. 

**Users should not use their submit server to upload or download files 
to/from `staging` unless otherwise directed by CHTC staff.**

*How do I connect to the transfer server?*    
Users can access the transfer server the same way they access their 
submit server (i.e. via Terminal app or PuTTY) using the following 
hostname: `transfer.chtc.wisc.edu`.

*How do I upload/download files to/from `staging`?*    
Several options exist for moving data to/from `staging` including:

- `scp` and `rsync` can be used from the terminal to move data 
to/from your own computer or *another server*. For example:

	```
	$ scp large.file username@transfer.chtc.wisc.edu:/staging/username/
	$ scp username@serverhostname:/path/to/large.file username@transfer.chtc.wisc.edu:/staging/username/ 
	```
	{:.term}

	**Be sure to use the username assigned to you on the other submit server for the first 
	argument in the above example for uploading a large file from another server.**

- GUI-based file transfer clients like WinSCP, FileZilla, and Cyberduck 
can be used to move files to/from your personal computer. Be 
sure to use `transfer.chtc.wisc.edu` when setting up the connection.

- Globus file transfer can be used to transfer files to/from a Globus Endpoint. 
See our guide [Using Globus To Transfer Files To and From CHTC](globus.shtml) 
for more details.

- `smbclient` is available for managing file transfers to/from file 
servers that have `smbclient` installed, like DoIT's ResearchDrive. See our guide 
[Transferring Files Between CHTC and ResearchDrive](transfer-data-researchdrive.shtml) 
for more details.
</p>
</details>

<a name="input"></a>
# Submit Jobs With Input Files in `/staging`

<details><summary>Click to learn more</summary>
<p>
`/staging` is a distinct location for temporarily hosting your 
individually larger input files >100MB in size or in cases when jobs 
will need >500MB of total input. First, a copy of 
the appropriate input files must be uploaded to your `/staging` directory 
before your jobs can be submitted. As a reminder, individual input files <100MB 
in size should be hosted in your `/home` directory.

Both your submit file and bash script 
must include the necessary information to ensure successful completion of 
jobs that will use input files from `/staging`. The sections below will 
provide details for the following steps: 

1. Prepare your input before uploading to `/staging` 
2. Prepare your submit files for jobs that will use large input 
files hosted in `/staging`
3. Prepare your executable bash script to access and use large input 
files hosted in `/staging`, delete large input from job

## Prepare Large Input Files For `\staging`

As described in our policies, data placed in `/staging` should be 
stored in as few files as possible. Before uploading input files 
to `/staging`, use file compression (`zip`, `gzip`, `bzip`) and `tar` to reduce 
file sizes and total file counts such that only a single, or as few as 
possible, input "tarball" will be needed per job.

If your large input will be uploaded from your personal computer 
Mac and Linux users can create input tarballs by using the command `tar -czf` 
within the Terminal. Windows users may also use a terminal if installed, 
else several GUI-based `tar` applications are available, or ZIP can be used 
inplace of `tar`.

The following examples demonstrate how to make a compressed tarball 
from the terminal for two large input files named `file1.lrg` and 
`file2.lrg` which will be used for a single job:

```
my-computer username$ tar -czf large_input.tar.gz file1.lrg file2.lrg
my-computer username$ ls
file1.lrg
file2.lrg
large_input.tar.gz
```
{: .term}

Alternatively, files can first be moved to a directory which can then 
be compressed:

```
my-computer username$ mkdir large_input
my-computer username$ mv file1.lrg file2.lrg large_input/
my-computer username$ tar -czf large_input.tar.gz large_input
my-computer username$ ls -F
large_input/
large_input.tar.gz
```
{: .term}

**Organize and prepare your large input such that each job will use a single, 
or as few as possible, large input tarballs.** After preparing your input, 
use the transfer server to upload the tarballs to `/staging`. Instructions for 
using the transfer server are provide in the above section 
[Use The Transfer Server To Move Large Files To/From Staging](#transfer-server).

## Prepare HTCondor Submit File For Jobs With Input in `/staging`

Not all CHTC execute servers have access to `/staging`. If your job needs access 
to files in `/staging`, you must tell HTCondor to run your jobs on the approprite servers 
via the `requirements` submit file attribute. **Be sure to request sufficient disk 
space for your jobs in order to accomodate all job input and output files.**

An example submit file for submitting a job that requires access to `/staging` 
and which will transfer a smaller, <100MB, input file from `/home`:

```{.sub}
# job with files in staging and input in home example

log = my_job.$(Cluster).$(Process).log
error = my_job.$(Cluster).$(Process).err
output = my_job.$(Cluster).$(Process).out

...other submit file details...

# transfer small files from home
transfer_input_files = my_smaller_file

requirements = (HasCHTCStaging =?= true)
```
{:.file}

If your job has any other requirments defined in the submit file, you should 
combine them into a single `requirements` statement:

```{.sub}
# job with files in staging and other requirements

log = my_job.$(Cluster).$(Process).log
error = my_job.$(Cluster).$(Process).err
output = my_job.$(Cluster).$(Process).out

...other submit file details...

#define multiple job requirements
requirements = (HasCHTCStaging =?= true) && other requirements
```

## Use Job Executable Bash Script To Access Input In `/staging`

Unlike your smaller, <100MB files that are transferred from your home directory 
using `transfer_input_files`, files placed in `/staging` should **NEVER** 
be listed in the submit file. Instead, you must include additional 
commands in the job's executable bash script that will copy (via `cp` or `rsync`) 
your input in `/staging` to the job's working directory and extract ("untar") and 
uncompress the data.

**Additional commands should be included in your bash script to remove 
any input files copied from `/staging` before the job terminates.** 
HTCondor will think the files copied from `/staging` are newly generated 
output files and thus, HTCondor will likely transfer these files back 
to your home directory with other, real output. This can cause your `/home` 
directory to quickly exceed its disk quota causing your jobs to 
go on hold with all progress lost.

Continuing our example, a bash script to copy and extract 
`large_input.tar.gz` from `/staging`:

```	
#!/bin/bash
	
# copy tarball from staging to current working dir
cp /staging/username/large_input.tar.gz ./

# extract tarball
tar -xzf large_input.tar.gz

...additional commands to be executed by job...

# delete large input
rm large_input.tar.gz file1.lrg file2.lrg

END
```
{:.file}

As shown in the exmaple above, \*both\* the original tarball, `large_input.tar.gz`, and 
the extracted files are deleted as a final step in the script. If untarring 
`large_input.tar.gz` insteads creates a new subdirectory, then only the original tarball 
needs to be deleted.

**Speed up jobs with larger input data**

If the files >20GB, then the `rm` step can take a while to complete which 
can add unnecessary runtime to your job. In this case, you can create a 
subdirectory and move (`mv`) the large input to it. Because these files will be 
in a subdirectory, HTCondor will ignore them when determining with output files 
to transfer back to the submit server.

For example:

```
# more large input to subdirectory
mkdir ignore/
mv large_input.tar.gz file1.lrg file2.lrg ingore/
```

## Remove Files From `/staging` After Jobs Complete

Files in `/staging` are not backed up and `/staging` should not 
be used as a general purpose file storage service. As with all 
CHTC file spaces, data should be removed from `/staging` **AS
SOON AS IT IS NO LONGER NEEDED FOR ACTIVELY-RUNNING JOBS**. Even if it
will be used in the future, your data should be deleted and copied
back at a later date. Files can be taken off of `/staging` using similar 
mechanisms as uploaded files (as above). 
</p>
</details>

# Submit Jobs That Transfer Output Files To `/staging`

<details><summary>Click to learn more</summary>
<p>
If a job will produce >4GB worth of output or if a jobs files, have 
your executable write the output file(s) to a location within
the working directory, and then make sure to move this large file to
the `/staging` folder, so that it's not transferred back to the home directory, as
all other "new" files in the working directory will be.

Example, if executable is a shell script:

```
#!/bin/bash
# 
# Command to save output to the working directory:
./myprogram myinput.txt output_dir/
#
# Tar and mv output to staging, then delete from the job working directory:
tar -czvf large_output.tar.gz output_dir/ other_large_files.txt
mv large_output.tar.gz /staging/username/
rm other_large_files.txt
#
# END
```
{: .file}

## C. Handling Standard Output (if needed)

In some instances, your software may produce very large standard output
(what would typically be output to the command screen, if you ran the
command for yourself, instead of having HTCondor do it). Because such
standard output from your software will usually be captured by HTCondor
in the submit file "output" file, this "output" file WILL still be
transferred by HTCondor back to your home directory on the submit
server, which may be very bad for you and others, if that captured
standard output is very large.

In these cases, it is useful to redirect the standard output of commands
in your executable to a file in the working directory, and then move it
into `/staging` at the end of the job.

Example, if "`myprogram`" produces very large standard output, and is
run from a script (bash) executable:

```
#!/bin/bash
#
# script to run myprogram,
# 
# redirecting large standard output to a file in the working directory:
./myprogram myinput.txt myoutput.txt > large_std.out
# 
# tar and move large files to staging so they're not copied to the submit server:
tar -czvf large_stdout.tar.gz large_std.out
cp large_stdout.tar.gz /staging/username/subdirectory
rm large_std.out large_stdout.tar.gz
# END
```
{: .file}

# 4. Submit Jobs Using Staged Data

In order to properly submit jobs using staged large data, always do the following:

- **Submit from `/home`**: ONLY submit jobs from within your home directory
    (`/home/username`), and NEVER from within `/staging`.

In your submit file: 

- **No large data in the submit file**:  Do NOT list any `/staging` files in any of the submit file
    lines, including: `executable, log, output, error, transfer_input_files`. Rather, your
    job's ENTIRE interaction with files in `/staging` needs to occur
    WITHIN each job's executable, when it runs within the job (as shown [above](#3-using-staged-files-in-a-job))
- **Request sufficient disk space**: Using `request_disk`, request an amount of disk 
space that reflects the total of a) input data that each job will copy into
    the job working directory from `/staging,` and b) any output that
    will be created in the job working directory.
- **Require access to `/staging`**: Include the CHTC specific attribute that requires 
servers with access to `/staging`

See the below submit file, as an example, which would be submitted from
within the user's `/home` directory:

``` {.sub}
### Example submit file for a single job that stages large data
# Files for the below lines MUST all be somewhere within /home/username,
# and not within /staging/username

executable = run_myprogram.sh
log = myprogram.log
output = $(Cluster).out
error = $(Cluster).err

## Do NOT list the large data files here
transfer_input_files = myprogram

# IMPORTANT! Require execute servers that can access /staging
Requirements = (Target.HasCHTCStaging == true)

# Make sure to still include lines like "request_memory", "request_disk", "request_cpus", etc. 

queue
```

# 5. Checking your Quota, Data Use, and File Counts

You can use the command `get_quotas` to see what disk 
and items quotas are currently set for a given directory path. 
This command will also let you see how much disk is in use and how many 
items are present in a directory:

```
[username@transfer ~]$ get_quotas /staging/username
```
{:.term}

Alternatively, the `ncdu` command can also be used to see how many 
files and directories are contained in a given path:

``` 
[username@transfer ~]$ ncdu /staging/username
```
{:.term}

When `ncdu` has finished running, the output will give you a total file
count and allow you to navigate between subdirectories for even more
details. Type `q` when you\'re ready to exit the output viewer. More
info here: <https://lintut.com/ncdu-check-disk-usage/>
