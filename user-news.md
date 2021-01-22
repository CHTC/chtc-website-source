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
## Unexpected outage of HTC large data file share (/staging, /projects,	HTC /software)
### Tuesday, January 19, 2021

Greetings CHTC users, 

*This message is for users of our high throughput computing (HTC) system.*

The large data file share that supports /staging, /projects and HTC /software directories recently began experiencing failures, and in response we have temporarily taken it offline. Jobs that copy input or output files from /staging or /projects will either fail or hang without completing. Any jobs which use software modules on the HTC system will also fail. 

We are working to resolve these issues and will send another email once the system is running and stable again. 

Please direct any questions or concerns to chtc@cs.wisc.edu. 

Best, 
Your CHTC team

------------------------------------------------------------------------
## Impacts to http file transfers resolved
### Wednesday, January 13, 2021

Greetings CHTC user, 
 
This message is for users of our high throughput computing (HTC) system.
 
CHTC staff identified an issue causing some http transfers to fail and jobs to go on hold as a result. We believe we have identified and fixed the problem and have released all impacted jobs submitted from submit-1, and submit2/3.
 
If you have jobs, submitted from another submit server, that have gone on hold due to this issue, you can release them using the following HTCondor command:
 
condor_release -constraint '(HoldReasonCode == 12) && (HoldReasonSubCode == 0)'
 
Please direct any questions or concerns to chtc@cs.wisc.edu. 
 
Best,
 
Your CHTC Team

------------------------------------------------------------------------
## CHTC Facilitator holiday availability
### Monday, December 21, 2020

Greetings CHTC users, 

This is an annual reminder that CHTC staffing will be somewhat reduced at times during the next two weeks

- Office Hours are cancelled starting this Thursday through next week (Dec. 24 - Jan 1), 
and email responses will be delayed during this period. *Office Hours are still on for tomorrow, Dec. 22.*
- **Normal office hours and email response times will resume on Monday, January 4th.**

Please remember that your work on CHTC's shared compute systems can affect 
other users. You should review and continue to follow CHTC policies for 
our [HTC System](https://chtc.cs.wisc.edu/use-submit-node) and [HPC Cluster](https://chtc.cs.wisc.edu/hpc-overview) to 
ensure that you are acting in consideration of others, especially since 
CHTC staff may not be able to respond as quickly to user-caused issues.

As always, the best way to get in touch with us is through our designated email address (chtc@cs.wisc.edu). 

Best wishes during the holiday season!

Christina, Jess, Lauren, and the rest of the CHTC team

------------------------------------------------------------------------
## HPC Cluster Queue Restored; Users Advised to Proceed with Caution
### Wednesday, December 2, 2020

Hello again,

The cluster queue and Slurm functions have been restored; the incident was traced to a malfunctioning Infiniband switch. While some jobs continued to run during the downtime and others have begun running again, others may have failed and left the queue. Users are advised to review their error/output files and the queue to determine whether any jobs will need to be resubmitted.

While we believe full network capabilities are restored, the cluster is at reduced capacity while we work to reinstate some nodes (marked as `down` in Slurm's `sinfo` command output). Additionally, we would like to caution users that cluster functionality is at risk for lower reliability, at least until we can observe stable behavior of the affected hardware over the coming hours and days.\
As always, if you notice any errors that you're unsure of how to address, please send an email to <chtc@cs.wisc.edu> with details.

Thank you,

Your CHTC Team

------------------------------------------------------------------------
## HPC Cluster Queue and Execute Nodes are Down Due to Network Issues
### Wednesday, December 2, 2020

As of 5:30PM CDT on December 2nd The HPC cluster queue is restored, users are advised to proceed with caution
~~Greetings,~~

~~*This message is for users of CHTC's HPC Cluster. Users of only the HTC System can ignore.*~~

~~We are currently working to understand and fix a networking issue affecting many of the execute nodes in the HPC Cluster, as well as the server that operates the queue. **As a result of this outage, the cluster's queue and all Slurm commands are failing**, though users are still able to log into the main head node ([hpclogin1.chtc.wisc.edu](http://hpclogin1.chtc.wisc.edu)). The full extent of impact to queued jobs is yet unclear.~~

~~While we are still investigating on-site, we are unsure of how long it will take to diagnose and fix the issue, and to restore the cluster to functionality. We appreciate your patience, and will provide updates with any changes to functionality or timeline.~~

~~Thank you,~~

~~Your CHTC Team~~

------------------------------------------------------------------------
## Tuesday, November 24 is the Last Day to Access Previous HPC Cluster
### Thursday, November 19, 2020
Greetings CHTC users,

*The below pertains to users of CHTC's HPC Cluster. Users of only the HTC System are welcome to ignore the below.*

We have completed the transition of all compute hardware from the old HPC Cluster configuration to the new configuration. **Next week, on Tuesday, November 24, will be the last day for users to access former head nodes** (aci-service-1.chtc.wisc.edu, aci-service-2.chtc.wisc.edu), as we prepare to fully retire all hardware and the filesystem, deleting all user data. If you have files on the old cluster configuration that you have not yet backed up or copied off the cluster, please do so immediately. **Users will no longer be able access the head nodes or data on the 'old' HPC Cluster after November 24.**

For those who have already logged into the new cluster, we have a new tool that will allow you to check your directory quotas and usage. See [this section of our cluster overview guide](https://chtc.cs.wisc.edu/hpc-overview#tools-for-managing-home-and-software-space) for details.

Please send any questions to <chtc@cs.wisc.edu>, as always, and join us at office hours (Tu/Th 3-5pm).

Thank you,

Your CHTC Team


------------------------------------------------------------------------


<center><a class="twitter-timeline" data-width="800" data-height="500" data-theme="light" data-link-color="#2B7BB9" href="https://twitter.com/CHTC_UW?ref_src=twsrc%5Etfw">Tweets by CHTC_UW</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></center>
