


HTC Getting Started Summary
====================================

<b>Step One</b>

<details>
<summary>Introduction to the High Throughput Computing Strategy</summary>
<br>
Like nearly all large-scale compute systems, users of both CHTC's High Throughput and High Performance systems prepare their computational work and submit them as tasks called "jobs" to run on execution points. 
<br>
   <br>
High Throughput Computing systems specialize in running many small, independent jobs (< ~20 CPUs/job). On the other hand, High Performance Computing systems speicalize in running a few, very large jobs that run on more than one node (~30+ CPUs/job).
<br>
   <br>
It is best to keep this distinction in mind when setting up your jobs. On the HTC system, smaller jobs (i.e., those requesting smaller amounts of CPU, memory, and disk resources per job) are easier to find a slot to run on. This means that users will notice they will have jobs start quicker and will have more running simultaneously It is almost always beneficial to break up your analysis pipeline into smaller pieces to take advantage of getting more jobs up and running, quicker. 
<br>
   <br>
Unlike the High Performance System, CHTC staff do not limit the number of jobs a user can have running in parallel, thus it is to your advantage to strategize your workflow to take advantage of as many compute resources as possible. 
<br>
   <br>
More detailed information regarding CHTC's HTC system can be found in the <a href="https://chtc.cs.wisc.edu/uw-research-computing/htc-overview">HTC Overview Guide</a>.
</details>


<b>Step Two</b>

<details>
<summary>Log on to an HTCondor HTC Access Point</summary>
<br>
Once your request for an account has been approved by a Research Computing Facilitator, you will be emailed your login information.
<br>
   <br>
For security purposes, every CHTC user is required to be connected to either a University of Wisconsin internet network or campus VPN and to use two-factor authentication when logging in to your HTC access point (also called a "submit server").  
<br>
</details>


<b>Step Three</b>

<details>
<summary>Understand the Basics of Submitting HTCondor Jobs</summary>
<br>
Computational work is run on the the High Throughput Computing system's execution machines by submitting tasks as “jobs” to the HTCondor job scheduler. Before submitting your own computational work, it is necessary to understand how HTCondor job submission works. The following guide is a short step-by-step tutorial on how to submit basic HTCondor jobs: <a href="https://chtc.cs.wisc.edu/uw-research-computing/htcondor-job-submission">Practice: Submit HTC Jobs using HTCondor</a>. <b>It is highly recommended that every user follow this short tutorial as these are the steps you will need to know to complete your own analyses.</b>
</details>


<b>Step Four</b>

<details>
<summary>Learn to Run Many HTCondor Jobs using one Submit File</summary>
<br>
After following this tutorial, we <b>highly recommend</b> users review the <a href="https://chtc.cs.wisc.edu/uw-research-computing/multiple-jobs">Easily Submit Multiple Jobs</a> guide to learn how you can configure HTCondor to automatically pass files or parameters to different jobs, return output to specific directories, and other easily automated organizational behaviors. 
<br>
</details>


<b>Step Five</b>

<details>
<summary>Install your Software</summary>
<br>
Our <a href="https://chtc.cs.wisc.edu/uw-research-computing/htc/guides.html">Software Solutions</a> guides contain information about how to install and use software on the HTC system.
<br>
<br>
<b>Software Containers</b>
   <br>
In general, we recommend installing your software into a "container" if your software relies on a specific version of R/Python, can be installed with `conda`, if your software has many dependencies, or if it already has a pre-existing container (which many common software packages do). There are many advantages to using a software container; one example is that software containers contain their own operating system. As a result, jobs with software containers have the most flexibility with where they run on CHTC or the OSPool. The CHTC website provides several guides on building, testing, and using software containers.
<br>
<br>
<b>Use Pre-installed Software in Modules</b>
   <br>
CHTC's infrastructure team has provided a limited collection of software as modules, which users can load and then use in their jobs. This collection includes tools shared across domains, including COMSOL, ANSYS, ABAQUS, GUROBI, and others. To learn how to load these software into your jobs, our <a href="https://chtc.cs.wisc.edu/uw-research-computing/htc-modules">Use Software Available in Modules</a> and <a href="https://chtc.cs.wisc.edu/uw-research-computing/licensed-software">Use Licensed Software</a> guides. 
<br>
<br>
<b>Access Software Building Tools on CHTC's Software Building Machines</b>
   <br>
The HTC system contains several machines designed for users to use when building their software. These machines have access to common compilers (e.g., gcc) that are necessary to install many software packages. To learn how to submit an interactive job to log into these machines to build your software, see <a href="https://chtc.cs.wisc.edu/uw-research-computing/inter-submit">Compiling or Testing Code with an Interactive Job</a>.  
</details>


<b>Step Six</b>

<details>
<summary>Access your Data on the HTC System</summary>
   <br>
<b>Upload your data to CHTC</b>
   <br>
When getting started on the HTC system, it is typically necessary to upload your data files to our system so that they can be used in jobs. For users that do not want to upload data to our system, it is possible to configure your HTCondor jobs to pull/push files using `s3` file transfer, pull data using standard unix commands (`wget`), among other transfer mechanisms. 
<br>
   <br>
To learn how to upload data from different sources, including your laptop, see: 
   <ul>
      <li><a href="https://chtc.cs.wisc.edu/uw-research-computing/transfer-files-computer">Transfer Files between CHTC and your Computer</a></li>
      <li><a href="https://chtc.cs.wisc.edu/uw-research-computing/transfer-data-researchdrive">Transferring Files Between CHTC and ResearchDrive</a></li>
      <li><a href="https://chtc.cs.wisc.edu/uw-research-computing/globus">Using Globus to Transfer Files to and from CHTC</a></li>
      <li><a href="https://chtc.cs.wisc.edu/uw-research-computing/github-remote-access">Remotely Access a Private GitHub Repository</a></li>
   </ul>
   <br>
<b>Choose a Location to Stage your Data</b>
   <br>
When uploading data to the HTC system, users need to choose a location to store that data on our system. There are two primary locations: `/home` and `/staging`. 
   <br>
   <br>
`/home` is more efficient at handling "small" files, while `/staging` is more efficient at handling "large" files. For more information on what is considered "small" and "large" data files and to learn how to use files stored in these locations for jobs, visit our <a href="https://chtc.cs.wisc.edu/uw-research-computing/htc/guides.html">HTC Data</a> guides. 
   <br>
   </details>

   

<b>Step Seven</b>

<details>
<summary>Run Test Jobs</summary>
<br>
Once you have your data, software, code, and HTCondor submit file prepared, you should submit several test jobs. The table created by HTCondor in the `.log` file will help you determine the amount of resources (CPUs/GPUs, memory, and disk) your job used, which is beneficial for understanding future job resource requests as well as troubleshooting. The standard out`.out` file will contain all text your code printed to the terminal screen while running, while the standard error `.err` file will contain any standard errors that your software printed out while running. 
<br>
   <br>
Things to look for: 
   <ul>
      <li>Jobs being placed on hold (hold messages can be viewed using `condor_q jobID -hold`)</li>
      <li>Jobs producing expected files</li>
      <li>Size and number of output files (to make sure output is being directed to the correct location and that your quota is sufficient for all of your output data as you submit more jobs)</li>
   </ul>
</details>


<b> Step Eight</b>
<details>
   <summary>Submit Your Workflow</summary>
<br>
Once your jobs succeed and you have confirmed your quota is sufficient to store the files your job creates, you are ready to submit your full workflow. For researchers interested in queuing many jobs or accessing GPUs, we encourage you to consider accessing additional CPUs/GPUs outside of CHTC. Information is provided in the following step. 
</details>

<b> Step Nine</b>
<details>
   <summary>Access Additional Compute Capacity</summary>
   <br>
   Researchers with jobs that run for less than ~10 hours, use less than ~20GB of data per job, and do not require CHTC modules, can take advantage of additional CPUs/GPUs to run there jobs. These researchers can typically expect to have more jobs running simultaneously. 
   <br>
   <br>
   To opt into using this additional capacity, your jobs will run on hardware that CHTC does not own. Instead, your jobs will "backfill" on resources owned by research groups, UW-Madison departments and organizations, and a national scale compute system: the OSG's Open Science Pool. This allows researchers to access capacity beyond what CHTC can provide. To learn how to take advantage of additional CPUs/GPUs, visit <a href="https://chtc.cs.wisc.edu/uw-research-computing/scaling-htc">Scale Beyond Local HTC Capacity</a>.
</details>

<b>Step Ten</b>
<details>
   <summary>Move Your Data off CHTC</summary>
   <br>
   Data stored on CHTC systems is not backed up. While CHTC staff try to maintain a stable compute environment, it is possible for unexpected outages to occur that may impact your data on our system. <b>We highly recommend all CHTC users maintain copies of important scripts and input files on another compute system (your laptop, lab server, ResearchDrive, etc.) throughout their analysis. Additionally, as you complete your analysis on CHTC servers, we highly recommend you move your data off our system to a backed up storage location.</b>
   <br>
   <br>
   CHTC staff periodically delete data of users that have not logged in or submitted jobs in several months to clear up space for new users. <b>Eventually, all users should expect their data to be deleted off CHTC servers and should plan accordingly. Data on CHTC is meant to be used for analyses actively being carried out - CHTC is not a long-term storage solution for your data storage needs. 
</details></b> 
</details>
