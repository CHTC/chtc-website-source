


HTC Getting Started Guidelines
====================================


1. Introduction to the the High Throughput Computing System
2. Log on to an OSG Access Point

3. Learn to submit HTCondor jobs
Computational work is run on the OSPool by submitting it as “jobs” to the HTCondor scheduler. Jobs submitted to HTCondor are then scheduled and run on different resources that are part of the Open Science Pool. Before submitting your own computational work, it is important to understand how HTCondor job submission works. The following guides show how to submit basic HTCondor jobs.

Overview: Submit Jobs to the OSPool using HTCondor

4. Test a First Job¶



   
<details>
<summary>Software</summary>
<br>
Our “Software Solutions” guides contain information about how to install and use software on the HTC system.
<br>
<br>
<b>Software Containers</b>
In general, we recommend installing your software into a "container" if your software relies on a specific version of R/Python, if your software has many dependencies, or if it already has a pre-existing container (which many common software packages do). There are many advantages to using a software container; one example is that software containers contain their own operating system, users with software containers have the most flexibility with where their jobs run on CHTC or the OSPool.
<br>
<br>
<b>Use Pre-installed Software in Modules</b>
CHTC's infrastructure team has provided a limited collection of software as modules, which users can load and then use in their jobs. This collection includes tools shared across domains, including COMSOL, ANSYS, ABAQUS, GUROBI, and others. To learn how to load these software into your jobs, visit ______.
<br>
<br>
<b>Access Software Building Tools: Log into Software Building Machines</b>
The HTC system contains several machines designed for users to use when building their software. These machines have access to common compilers (e.g., gcc) that are necessary to install many software packages. To learn how to submit an interactive job to log into these machines to build your software, see _____.  

Conda environments: It is possible to install software using miniconda.
<br>
</details>


<details>
<summary>Access your Data on the HTC system</summary>
<br>
<b>Upload data to CHTC</b>
When getting started on the HTC system, it is typically necessary to upload your data files to our system so that they can be used in jobs. For users that do not want to upload data to our system, it is possible to configure your HTCondor jobs to pull/push files using `s3` file transfer, or pull data using standard unix commands (`wget`). 
<br>
To learn how to upload data from different sources, including your laptop, see: 
   <br>
Transfer Files between CHTC and your Computer
   <br>
Transferring Files Between CHTC and ResearchDrive
   <br>
Using Globus to Transfer Files to and from CHTC
   <br>
Remotely Access a Private GitHub Repository

When uploading data to the HTC system, users need to choose a location to store that data on our system. There are two primary locations: /home and /staging. 
<br>
/home is more efficent at handling "small" files, while /staging is more effient at handling "large" files. For more information on what is considered "small" and "large" data files, see _____. 
<br>
</details>


<details>
<summary>Learn to run HTCondor jobs</summary>
<br>
















