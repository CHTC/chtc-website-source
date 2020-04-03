---
highlighter: none
layout: default
title: User News
---

Below is a list of important user news updates, sorted by date. Please
stay up to date with news which is relevant to you, as CHTC policy
changes may affect the jobs of users.

For older updates not shown on this page, see our [user mailing list
archives](https://www-auth.cs.wisc.edu/lists/chtc-users/).

------------------------------------------------------------------------
## Additional HPC Cluster and HTC System servers down
### Thursday, April 2, 2020
<br/>
Greetings CHTC Users,  

Additional CHTC services have been turned off due to an unexpected failure in the backup cooling system for the server room currently undergoing maintenance. In addition to our previously communicated outages (described in our original email, below), the following services are impacted:

**High Performance Cluster**
-   Everything in the cluster, including head nodes ([aci-service-1.chtc.wisc.edu](http://aci-service-1.chtc.wisc.edu/) and [aci-service-2.chtc.wisc.edu](http://aci-service-2.chtc.wisc.edu/)) and the file system, is currently down. Users are unable to log in to the head nodes or access files.

**High Throughput Computing System**
-   One submit server ([submit3.chtc.wisc.edu](http://submit3.chtc.wisc.edu/)) is down; users with accounts on this server are not able to log in or submit jobs.
-   Jobs using links to SQUID ([proxy.chtc.wisc.edu/SQUID](http://proxy.chtc.wisc.edu/SQUID)) will fail if running outside CHTC.

We don't yet know if the situation will improve to the point where we can turn certain key services back on. If any additional servers go down, or we're able to bring other servers back up, we will let you know via the chtc-users mailing list.  

Again, please get in touch at [chtc@cs.wisc.edu](chtc@cs.wisc.edu) with any questions or concerns, especially if this outage means that you won't make a hard deadline.

Best,  
Your CHTC team

------------------------------------------------------------------------
## Immediate: HPC Cluster and portions of HTC System down April 1 - 5
### Wednesday, April 1, 2020
<br/>
Greetings CHTC Users,  

Due to a campus chilled-water maintenance announced this afternoon, CHTC needs to turn off major components of our computing services for the next 4 days (our server rooms depend heavily on chilled water for server cooling). We’ve already begun powering down a number of servers, with more to come as described for the below categories.

**The HPC Cluster will be down:**

* All cluster execute servers will be turned off; no jobs will be able to run.
* Jobs that were running on the cluster as of this afternoon (April 1) will be interrupted and re-queued to run again after the downtime.
* HPC cluster users will still be able to log into the cluster head node (which will remain up) in order to access data. **As a reminder, users should NEVER run computational work on the head nodes.** Restrict all head node operations to data perusal and transfers to/from your non-CHTC storage. Users violating this policy will have their HPC Cluster login access deactivated for the remaining duration of the downtime.

**Portions of the HTC System will be down:**

* Roughly ¼ of the execute servers will be turned off. Any jobs running on these servers this afternoon (April 1) will be evicted, but will remain in the queue to re-run. 
* Many of our researcher-owned GPU servers are included in the group of execute servers that will be shut down. 
* The HTC System will otherwise continue to function normally (including SQUID, /staging, and the transfer server), albeit with a smaller number of execute servers. Users of the HTC system may see fewer jobs running than they would normally, with full throughput returning following the downtime.

There is a chance that we will need to turn off more servers; we will endeavor to provide immediate (or advanced) notice if this becomes necessary.

The campus maintenance is expected to conclude by Sunday, April 5 at 8pm CDT. We will send an email via this address (chtc-users@cs.wisc.edu) confirming when our systems are back online.

Please get in touch at [chtc@cs.wisc.edu](chtc@cs.wisc.edu) with any questions or concerns, especially if this outage means that you won’t make a hard deadline. We’ll do our best to help you with potential alternative solutions.

Best,  
Your CHTC Team

------------------------------------------------------------------------
## Reminder: Files in Gluster deleted April 20
### Monday, March 30, 2020
<br/>
Greetings Users,  
 
This message is for users of our HTC system who use our Gluster file share to stage large data files.  

We are replacing Gluster with a new system for large data. As a reminder:
-   Next week (April 6) - HTC jobs requiring Gluster will no longer run.
-   April 20 - **All data in the Gluster file share is deleted.**

Please remove all data from Gluster as soon as possible. If you are currently running jobs that require large data (input files > 100MB, output files > 3-4GB), please contact us [chtc@cs.wisc.edu](chtc@cs.wisc.edu) to set up a large data folder in the new system. Details on the information you should provide are below.  

As always, direct any questions to our support email: [chtc@cs.wisc.edu](chtc@cs.wisc.edu) or stop by our (online) office hours between 3:00 - 5:00pm on Tuesdays and Thursdays: [go.wisc.edu/chtc-officehours](http://go.wisc.edu/chtc-officehours)

All the best,  
Your CHTC team 


------------------------------------------------------------------------
## CHTC Going Strong; Support for COVID-19 Research
### Thursday, March 19, 2020
<br/>
Greetings Users,  
  
You have probably gathered from our recent frequency of emails that CHTC is continuing strong in light of the COVID-19 pandemic, and it looks like our users are too! (Computing can be done from home, after all.) We appreciate your patience with the short-term email volume and would like to also inform you of the below:  
  
**Please contact us at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) if you have computing and/or data needs for research relevant to the COVID-19 pandemic.** We'll follow up to discuss your objectives and how CHTC or other relevant resources might help.  
  
We hope that other researchers and organizations are sympathetic to CHTC's prioritization of research relevant to COVID-19, though we don't currently expect any significant disruptions to the work of other researchers and will provide updates as appropriate.

  

**We also understand that this may be an important time to invest in - or ramp up - the computational aspects of your research, and we're here to help you succeed.** Please continue to email [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) with any issues or questions, especially any pertaining to using CHTC while working remotely. We are equipped with virtual meeting tools and can share screens to give the same level of support as with in-person consultations and office hours (Tu/Th 3-5pm, [here](https://go.wisc.edu/chtc-officehours)).  
  
Thank You, and Stay Healthy!   
CHTC Leadership and Staff
  

------------------------------------------------------------------------
## New modules for MPI and licensed software on the HTC system
### Thursday, March 19, 2020
<br/>
Greetings CHTC users,  
  
This message is for users of our HTC system who use CHTC-supported modules for MPI compilers or licensed software.  
  
We are updating the set of CHTC-supported modules for licensed software and MPI tools on the HTC system. This upgrade will provide users with access to updated versions of software and libraries and will change which modules are available for running jobs.  
  
The old modules and corresponding software installations will be retired on April 15, 2020. If you use our modules to access licensed software or MPI tools on the HTC system, please start transitioning your jobs to the new modules immediately.  
  
The following CHTC "how to" pages have been updated to reflect these changes, including more information on how to view and use the new modules:  

*   Using Licensed Software on the HTC System: [http://chtc.cs.wisc.edu/licensed-software.shtml](http://chtc.cs.wisc.edu/licensed-software.shtml)
*   MPI Jobs on the HTC system: [http://chtc.cs.wisc.edu/mpi-jobs](http://chtc.cs.wisc.edu/mpi-jobs)

Email us at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) with any questions or concerns.  
  
All the best,  
Your CHTC team

------------------------------------------------------------------------
## The CHTC GPU Lab is Open - shared-use GPUs in the HTC system
### Monday, March 16, 2020
<br/>
Greetings CHTC users,  
  
This message is for users of our HTC system who are interested in using GPUs to run jobs.  
  
CHTC has been expanding its GPU capacity via [UW 2020 funding](https://research.wisc.edu/funding/uw2020/round-5-projects/enabling-graphics-processing-unit-based-data-science/) for a [CHTC GPU Lab](http://chtc.cs.wisc.edu/gpu-lab). Now that our capacity to run GPU jobs has increased, we will be implementing special policies on the GPU servers in order to maximize how many researchers can benefit from this investment.  
  
The changes are described on our [GPU Jobs page](http://chtc.cs.wisc.edu/gpu-jobs.shtml); a quick summary:  

*   To use CHTC's shared-use GPUs (part of the funded CHTC GPU Lab), you will need to add a specific flag to your job's submit file.
*   Time limits on the GPU servers will be different than the usual limits across the HTC system; jobs will default to 24 hours unless a different time range is specified via a submit file flag.

If you have any questions about these changes, or are interested in more information about GPUs in CHTC, please email us at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu). Even more GPU capacity will be added over the next two years!  
  
Best,   
Your CHTC Team


------------------------------------------------------------------------

## Transition to Virtual CHTC Office Hours and Meetings
### Wednesday, March 11, 2020
<br/>
For all CHTC Users,

Following the universitys decision to [suspend in-person classes and campus events](https://covid19.wisc.edu/updates-to-campus-operations/) after Friday, March 13, the CHTC Research Computing Facilitators will be switching from in-person meetings and office hours to virtual options for the foreseeable future, starting tomorrow, Thursday, March 12. Virtual office hours are available on Tuesdays and Thursdays (discontinuing Wednesday office hours), which should also allow off-site CHTC users to join in!

  
The below information has been added to the Get Help page on our website: [http://chtc.cs.wisc.edu/get-help.shtml](http://chtc.cs.wisc.edu/get-help.shtml)

  
**Virtual Office Hours**

We will hold virtual office hours on Tuesday/Thursday, with an extended duration of 3:00-5:00pm in a WebEx room. You can join the room via the link viewable upon logging into a CHTC submit server or head node.

  
**Individual Meetings**

For future one-to-one meetings, facilitators will provide videoconferencing information, individually, via email conversation through [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu).

  

**Email Support**

Email support continues as usual! Youre always welcome to email [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) with questions or concerns.

  


Stay safe everyone! Take care of yourself and others by staying home when sick and following the advice of trusted health organizations, including resources on the universitys COVID-19 response page: [https://covid19.wisc.edu/](https://covid19.wisc.edu/)

  

All the best,  
Your CHTC Team

------------------------------------------------------------------------

## Migrate from Gluster to new large-file staging system on HTC
### Wednesday, March 04, 2020
<br/>
Greetings CHTC users,

This message is for users of our HTC System who use our Gluster file share to stage large files, e.g.
*   input files per job, greater than 100MB, each
*   output per job, greater than a few GB, total

We are transitioning from our Gluster file share for large data to a new system, with the goal of providing improved performance and stability.

**Important Dates**
*   March 4 - Applications open for space on the new large-data system.  
*   April 6 - Jobs that require Gluster will no longer run.
*   April 20 - Gluster file share is removed and all files in Gluster are deleted.
    

**Actions to Take**

If you use Gluster on our HTC system, here are the actions you need to take:
*   **Remove all data from Gluster as soon as possible.** Data in Gluster will be deleted on April 20.
*   **When you need to run new jobs with large input or output files,** request a directory on the new large-data system by sending an email our support address ([chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu)) with the following information:
	*   How many jobs you typically have queued at once, and how many files of what sizes those jobs will require in the large-data system; therefore ...
	*   Total space needed and how many total files/folders that will include
*   Note that you can request a directory for large data at any time; if you're not currently running jobs, you can just email us when the need next arises.    
*   **Follow the online guide for the new large-data system**: [http://chtc.cs.wisc.edu/file-avail-largedata](http://chtc.cs.wisc.edu/file-avail-largedata)

Our software modules on the HTC System (for licensed software or compilers/MPI) will also be transitioning off of Gluster (where they currently live) over the next few weeks; we will send an update about the replacement modules and updated documentation next week, so stay tuned if this applies to you.

As always, direct any questions to our support email: [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu).

All the best,  
Your CHTC team


------------------------------------------------------------------------

## CHTC Website Content Now in GitHub
### Wednesday, January 08, 2020
<br/>
Happy New Year!


**We'd like to announce that the [CHTC website](http://chtc.cs.wisc.edu/) content (including online guides) are now [hosted publicly in a GitHub repository](https://github.com/CHTC/chtc-website-source).** Among other plans for improving the website over the coming year, we have made this change to make it easier for the extended CHTC community to contribute and suggest changes to page content.

**Therefore, we'd like to formally invite YOU to contribute to the CHTC website in the following ways:**

1. Especially, because we're still transitioning the source file format for each page (from raw .shtml to Markdown), **you can let us know if you see any formatting problems we haven't caught** by emailing [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) (as always), or for GitHub enthusiasts, describe the problem as a [GitHub issue](https://github.com/CHTC/chtc-website-source/issues) or submit a [pull request](https://github.com/CHTC/chtc-website-source/pulls) with the correction.
2. **You can otherwise contribute typo fixes, content clarifications, and content suggestions via GitHub issues and pull requests!** (Or, continue to report any thoughts in email to [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu), at office hours, etc., per your preference.)

We look forward to getting more of your input for the CHTC website!  
Your CHTC Team


------------------------------------------------------------------------


<center><a class="twitter-timeline" data-width="800" data-height="500" data-theme="light" data-link-color="#2B7BB9" href="https://twitter.com/CHTC_UW?ref_src=twsrc%5Etfw">Tweets by CHTC_UW</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></center>

