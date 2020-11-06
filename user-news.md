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
## Limited Job Starts on Previous HPC Cluster
### Thursday, November 5, 2020
Greetings CHTC users, 

*The below pertains to users of CHTC's HPC Cluster, for which users submit jobs via the [aci-service-1.chtc.wisc.edu](http://aci-service-1.chtc.wisc.edu) login node. Users of only the HTC System are welcome to ignore the below.*

As [previously announced](https://chtc.cs.wisc.edu/user-news.shtml)**, **next week we will be transitioning all remaining hardware from the previous HPC cluster configuration to the new configuration. This means: 

-   We are currently draining jobs from all remaining nodes in the old cluster configuration. **Jobs requesting 7 days (or any time request that cannot be completed by Nov 10) will not start.** Jobs can still run on the old cluster nodes, but only if their time request ("--time=" in the submit file) indicates that they will complete before next Tuesday, November 10. 
-   **If you have not already logged into the new cluster configuration and tried to run test jobs, please do so** as soon as possible! After next week, the old cluster will not be available to run jobs -- you are less likely to experience interruptions to your work if you make sure everything is running smoothly on the new cluster now.

In addition, we are hoping to have user modules for the Intel compilers and libraries within the next few weeks, and we will send a separate email when these are available.

Please send any questions to <chtc@cs.wisc.edu>, as always, or join us at office hours (Tu/Th 3-5pm, see emails from CHTC staff or login to a CHTC server for links to the office hours virtual room).

Thank you,

Your CHTC Team

------------------------------------------------------------------------
## Delayed Email Replies, No Office Hours on November 3
### Monday, November 2, 2020
Greetings CHTC users,

We are writing to let you know that our **Research Computing Facilitators will be out of the office on Nov. 3, so** **[CHTC Office Hours](https://chtc.cs.wisc.edu/get-help.shtml) are canceled,** and users can expect delayed replies to support conversations via <chtc@cs.wisc.edu> for that day. (We'll send out a reminder and appreciate your patience.)

As a reminder, we are working **this week to transition researcher-owned hardware in the [HPC Cluster](https://chtc.cs.wisc.edu/hpc-overview) to the new cluster configuration** and operating system, [per prior communication](https://chtc.cs.wisc.edu/user-news.shtml). Users with HPC accounts already have access to the new configuration and should see researcher-owned hardware partitions appearing there by the end of the week.

Please send any questions to <chtc@cs.wisc.edu>, as always, and join us at office hours (Tu/Th 3-5pm, <https://go.wisc.edu/chtc-officehours>).

Thank you, 

Your CHTC Team 

------------------------------------------------------------------------
## New HPC Cluster Configuration NOW OPEN
### Thursday, October 15, 2020
Greetings CHTC users, 

*The below pertains to users of CHTC's HPC Cluster, for which users submit jobs via the [aci-service-1.chtc.wisc.edu](http://aci-service-1.chtc.wisc.edu) login node. Users of only the HTC System are welcome to ignore the below.*

Researchers with accounts on the old configuration of the HPC cluster can now access the new cluster configuration. 

**Please FIRST read through the instructions below andour new overview page, with related software and job submission guides: **[**http://chtc.cs.wisc.edu/hpc-overview**](http://chtc.cs.wisc.edu/hpc-overview)**.** Then, login via the new login nodes using your UW NetID and associated password.

Please first try to install the software that you most commonly use on the cluster, and submit a few, small test jobs. We've expanded the interactive partition (or scheduled jobs) for installation and testing, which can otherwise be carried out in other partitions and/or with non-interactive jobs, such that users should not compile on head nodes. (Note: We are currently working with Campus Software on options for new licenses for the Intel compilers, and will have updates later on when they might be available relative to the below timeline.)

As a reminder, not all of the cluster hardware has been transitioned to the new configuration; remaining hardware will be transitioned on the following schedule: 

-   Oct 27-28: all researcher-owned hardware transitioned
-   Nov 10-11: all remaining (univ2) hardware transitioned
-   Nov 24: accounts disabled on aci-service-1/2; accounts/data subsequently deleted;

Please continue to contact us at <chtc@cs.wisc.edu> with any issues or questions that come up.

Thank you, 

Your CHTC Team

------------------------------------------------------------------------
## Reminder: HPC Cluster transition beginning Tuesday, Oct 13
### Friday, October 9, 2020

Greetings CHTC users, 

The below pertains to users of CHTC’s HPC Cluster, for which users currently submit jobs via the `aci-service-1.chtc.wisc.edu` login node. Users of only the HTC System are welcome to ignore the below.

We are less than one week away from opening up accounts on the updated HPC cluster configuration!  As a reminder, the new configuration of the cluster will include an updated operating system (CentOS7), version of Slurm, new head nodes, all-new modules, and a new filesystem with a separate location for user software installation. Execute nodes from the old cluster configuration will be swapped to the new configuration (leaving the old cluster) on the following planned schedule: 

Oct 13-14:	`univ` (retired) and half of `univ2` partition nodes transitioned to new configuration
Oct 15:		users granted access to new login nodes (hpclogin1/2.chtc.wisc.edu);
Oct 27-28:	all researcher-owned hardware transitioned
Nov 10-11:	all remaining (univ2) hardware transitioned
Nov 24:	 accounts disabled on aci-service-1/2; accounts/data subsequently deleted;

Contact us at [chtc@cs.wisc.edu](mailto:chtc.cs.wisc.edu) with any questions or concerns. 

Best, \
Your CHTC team

------------------------------------------------------------------------
## Info Sessions for HPC Cluster Upgrade
### Tuesday, September 29, 2020
Greetings,

*The below pertains to users of CHTC's HPC Cluster, for which users submit jobs via the aci-service-1.chtc.wisc.edu login node. **Users of only the HTC System are welcome to ignore the below.***

In anticipation of the HPC cluster upgrade in October, CHTC facilitators will be hosting two virtual information sessions for users on **Tues Oct. 6 at 11 am** and **Wed Oct 7 at 3 pm**. Each info session will provide an overview of the new HPC configuration and include time for Q & A.

Registration for an info session is required. After registering, you will receive a confirmation email containing information about joining the session and the option of adding the session to your calendar. You can register beforehand, or as the meeting is starting; the registration is simple and sends the connection details right away. To register, see the links below:

-   Oct 6, 2020 11:00 AM Central Time

-   <https://uwmadison.zoom.us/meeting/register/tJUvcOuoqDoqG9Vm-l50N2cRy2lKmC-vNuJH> 

-   Oct 7, 2020 03:00 PM Central Time

-   <https://uwmadison.zoom.us/meeting/register/tJIlfumhpj4rG9JcVjhzafZJp25CEJDTfDOp> 

Cheers,

Your CHTC Team

------------------------------------------------------------------------
## HPC Cluster Upgrade Shifted to October 15
### Friday, September 11, 2020
Greetings,

*The below pertains to users of CHTC's HPC Cluster, for which users submit jobs via the [aci-service-1.chtc.wisc.edu](http://aci-service-1.chtc.wisc.edu) login node. Users of only the HTC System are welcome to ignore the below.*

Due to recent and unforeseen issues in transitioning servers to the new cluster configuration, we are delaying the HPC Cluster transition by four weeks (see the updated timeline, below). Additionally, based upon discussions with some users thus far, we would like to provide clear indications of the work that every HPC Cluster user can anticipate in migrating to the new configuration.

**HOW TO MIGRATE YOUR WORK TO THE 'NEW' CONFIGURATION**

When users are allowed onto the new cluster configuration, they should be prepared to:

-   Re-install software to the new /software location, compiled against the cluster's new MPI modules and CentOS7 operating system.
-   Migrate all output from prior runs off of the old configuration.
-   Migrate submit files, inputs, and other files for future work to the /home location on the new cluster configuration.
-   Modify submit files in light of new Slurm features (if desired), new modules, and commands pointing to newly-installed user software.

The above are all addressed in our guide on [Transitioning to the New HPC Cluster Configuration](http://chtc.cs.wisc.edu/hpc-transition.shtml). **We will email at a later date with details for planned informational sessions, which will include opportunities for Q&A about the transition process.**

**UPDATED HPC Cluster Transition Timeline:**

Oct 13-14: 'univ' and half of 'univ2' partition nodes transitioned to new configuration

Oct 15: users granted access to new login nodes (hpclogin1/[2.chtc.wisc.edu](http://2.chtc.wisc.edu));

 [new documentation](http://chtc.cs.wisc.edu/hpc-overview) made prominent on [chtc.cs.wisc.edu](http://chtc.cs.wisc.edu)

Oct 27-28:  all researcher-owned hardware transitioned

Nov 10-11:  all remaining (univ2) hardware transitioned

Nov 24:     accounts disabled on aci-service-1/2; accounts/data subsequently deleted; old documentation removed

Thank you, in advance, for your patience with the timeline shift. We are hoping to avoid further delays, and will communicate all updates as soon as possible.

As always, please get in touch with any questions by emailing <chtc@cs.wisc.edu>.

Cheers,\

Your CHTC Team

------------------------------------------------------------------------
## Facilitators out of Office 9/7 and 9/11; Fall Workshops
### Friday, September 4, 2020
Greetings CHTC users,

Two quick announcements before the long weekend:

1) The CHTC team will have a short week next week; **we are out of the office on Monday, September 7** for the Labor Day holiday, **and on Friday, September 11** for a group retreat. Based on these outages, responses to email sent over this weekend and next Friday will be delayed.

2) The Data Science Hub is running a series of workshops this fall that include topics that are relevant to CHTC users, including command line skills, version control with git, and an introduction to Docker containers. If you are interested in joining, see the dates and registration information on this page: <https://uw-madison-datascience.github.io/2020-09-16-uwmadison-mini/>

As always, the best way to reach us is <chtc@cs.wisc.edu>.  Have a great holiday weekend!

Best,\
Your CHTC Team

------------------------------------------------------------------------
## Jobs on submit2.chtc.wisc.edu Inadvertently Removed; Please Resubmit
### Wednesday, September 2, 2020
Greetings,

*This email only pertains to users of the HTC System submitting through [submit2.chtc.wisc.edu](http://submit2.chtc.wisc.edu)*.

We are sorry to report that **all jobs in the HTCondor queue on [submit2.chtc.wisc.edu](http://submit2.chtc.wisc.edu) were inadvertently removed at about 10:50am** while staff were doing work on the submit server. We apologize for the inconvenience, as **users will need to resubmit jobs.**

If you need help determining which jobs may have completed already (and which need to be resubmitted), you'll be able to see removed jobs and recently completed jobs by running the following (inserting your username for <username>):

condor_history <username>

The 'condor_history' output will show an 'X' (in the 'ST' column) for jobs that were removed, and a 'C' for jobs that completed (could be with or without errors). Please get in touch via <chtc@cs.wisc.edu> if we might be able to help you.

Thank you,

------------------------------------------------------------------------
## HPC Cluster Upgrades, starting September 15
### Monday, August 24, 2020
Greetings,

*The below pertains to users of CHTC's HPC Cluster, for which users submit jobs via the [aci-service-1.chtc.wisc.edu](http://aci-service-1.chtc.wisc.edu) login node. Users of only the HTC System are welcome to ignore the below.*

This email provides an overview of plans for **major upgrades to the HPC Cluster,** which will take place in several phases **beginning September 15**, as described below.

The upgrades will include:

-   upgrade of all cluster nodes to the CentOS 7 operating system
-   new /home filesystem and a new /software location
-   new job queue with the latest version of Slurm
-   new login nodes with all of the above

We have already implemented the new filesystems, login nodes, queue, and [documentation](http://chtc.cs.wisc.edu/hpc-overview), and will gradually transition sets of compute nodes and enable access to the new configuration, described above, according to the following timeline.

**Moving Jobs to the New Configuration**

We have constructed the above timeline to give users four weeks in Sept/Oct to transition their software and other files for job submission to the new CentOS 7 configuration and Slurm queue. Guides are available with instructions on using our [revamped software modules](http://chtc.cs.wisc.edu/hpc-software) and [updated version of Slurm](http://chtc.cs.wisc.edu/hpc-job-submission) when the cluster is available for login in September.

**Moving Data to the New Configuration**

The new configuration will offer [separate locations for job data (/home) and software (/software)](http://chtc.cs.wisc.edu/hpc-overview#data-storage-and-management) along with new quotas for each. Data in the existing HPC Cluster filesystem (/home via aci-service-1/2 nodes) will be unavailable in the new configuration and will be deleted after Oct 13. Importantly, users should use the upgrade as an opportunity to review and only transition data that will be necessary for future work (moving data from completed work to non-CHTC locations, as per CHTC data policies).

**New Documentation**

Documentation is now available on the CHTC website detailing the new HPC configuration, job submission, software use, and user policies which can be accessed at the following links:

-   [HPC Cluster Configuration and Policies](http://chtc.cs.wisc.edu/hpc-overview)
-   [Submitting and Managing Jobs Using SLURM](http://chtc.cs.wisc.edu/hpc-job-submission)
-   [Using Software on the HPC Cluster](http://chtc.cs.wisc.edu/hpc-software)

The information in this email will also be posted to the [CHTC User News page](http://chtc.cs.wisc.edu/user-news). We will send additional notices prior to key phases in the timeline above. If the above timeline presents any major difficulties for your computational work, or for any other questions regarding the HPC Cluster upgrade, please email <chtc@cs.wisc.edu>.

Thank you,\
Your CHTC Team

------------------------------------------------------------------------
## Potential Interruption to HTC Services on Thursday, August 27
### Thursday, August 20, 2020
Hello CHTC users,

This message is for users of our high throughput computing (HTC) system.

There will be a network upgrade on Thursday, August 27 at 10am, impacting connections to some
of our HTC servers. 

Affected services include: 
- submit-1.chtc.wisc.edu and some researcher-owned submit servers
- About half of our HTC execute servers, including high memory and GPU servers
- The large data /staging file system
- Our centrally installed software in /software
- The /squid folder that represents data on our web server

While the upgrade should be brief and may not cause noticeable disruptions, potential impacts
during the network outage include: 
- Running jobs on affected execute nodes will not be able to access the internet.
- Running jobs on affected execute nodes will not be able to access /staging or /software.
- Any jobs that start and fetch a files from SQUID may fail.
- Some jobs may be interrupted if the outage is longer than expected.
- submit-1 and other affected group submit servers may be inaccessible.

Jobs that are unable to access files from the internet, SQUID or /staging will either go on
hold or fail with an error message in the standard error file. These will need to be released
or resubmitted to run again. Jobs that are interrupted will return to an idle state and be
automatically rerun. 

To minimize disruption to your HTC jobs, we recommend you:
Avoid submitting new jobs during the 24 hours preceding the upgrade.
Plan to check for jobs holds or errors on Thursday afternoon if you have jobs in the queue
during the upgrade window.

Email us with any questions or concerns at chtc@cs.wisc.edu. 

-----------------------------------------------------------------------
## Limited CHTC Email Support on Monday, August 17
### Friday, August 14, 2020
Hello CHTC users,

CHTC email support will be unavailable Monday, August 17, as all of CHTC's Research Computing
Facilitators will be out of the office or otherwise unavailable.

The best way to reach us is still <chtc@cs.wisc.edu> and email support will resume Tuesday
August 18.

Cheers,\
Christina, Jess and Lauren

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
