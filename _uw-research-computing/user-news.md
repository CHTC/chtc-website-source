---
highlighter: none
layout: markdown-page
title: Status
---

Below is a list of important user news updates, sorted by date. Please
stay up to date with news which is relevant to you, as CHTC policy
changes may affect the jobs of users.

For older updates not shown on this page, see our [user mailing list
archives](https://www-auth.cs.wisc.edu/lists/chtc-users/).

------------------------------------------------------------------------

## Delayed email responses, no Thursday office hours
### November 22, 2022

Dear CHTC users,

Due to the upcoming Thanksgiving holiday, users should expect delayed responses to emails the week of November 21st-25th. Additionally, office hours will be canceled on Thursday, November 24th.

Best,
Your CHTC Team

------------------------------------------------------------------------

## Updated Transition Timeline for HTC System Linux Changes; Take Advantage of New HTC Hardware
### September 13, 2022

Greetings CHTC users, 

This email is for users of our high throughput computing (HTC) system. 

In a previous email (copied below), we announced that our HTC system is undergoing an operating system upgrade, with most of our capacity using CentOS Stream 8 Linux. We planned to change the default Linux version required by jobs to CentOS Stream 8 this Thursday, September 15. However, because users have noticed some impacts to compiling new software, programs, and libraries on this new operating system, **we have decided to push back this milestone to Thursday, September 29**. This will allow us additional time to ensure minimal impact to user’s jobs upon transitioning to CentOS Stream 8 as the default Linux version on the HTC system. This change has been reflected in our [operating system transition page](/uw-research-computing/os-transition-htc). 

**HTC Users should test your jobs on servers running CentOS Stream 8 as soon as possible**, if you have not already done so. For more information on testing your jobs, see our [operating system transition page](/uw-research-computing/os-transition-htc). 

If you have tested your jobs on CentOS 8, we recommend using the job options that allow your jobs to run on servers with either operating system version, as this will maximize the capacity of the HTC system that you can access. As [previously announced](https://chtc.cs.wisc.edu/Technology-Refresh.html), the CHTC Infrastructure team has been busy incorporating new hardware into our HTC system and we want all of our HTC users to take advantage of these new resources!

If you have any questions about our operating system transition or hardware refresh, don’t hesitate to reach out to us at chtc@cs.wisc.edu.

Best, 

Your CHTC Team

------------------------------------------------------------------------

## HTC users: start planning and testing for operating system transition
### August 13, 2022

Greetings CHTC users, 

For users of our high throughput computing (HTC) system: over the next several weeks, we will be transitioning all of our HTC system servers to run a new version of Linux. We currently use CentOS 7 Linux and will be switching to CentOS Stream 8 Linux. 

**This transition may impact the ability of some software, library, and executable code to run.** We highly recommend all HTC system users begin testing jobs on the updated CentOS Stream 8 servers in case they need to recompile their software or modify their jobs to run successfully on the new operating system. 

Complete information about the transition, including important dates, current available capacity, and how to request servers with different operating systems is on this page: [HTC System Transitioning to a New Linux Version (CentOS Stream 8)](https://chtc.cs.wisc.edu/uw-research-computing/os-transition-htc)

This page will be updated as the transition progresses. 

For users of our HPC Cluster: the default Linux version running on the HPC Cluster servers will also be upgraded from CentOS 7 Linux to CentOS Stream 8 Linux in the future. We are still planning a timeline for this transition and will provide 

If you have any questions about this transition, contact chtc@cs.wisc.edu.

Best, 

Your CHTC Team

------------------------------------------------------------------------

## Disruptions to CHTC systems on Tues, Aug 23
### Thursday, August 11

Greetings CHTC users, 
 
On Tuesday, August 23, many different components of CHTC systems will be updated with a needed 
operating system patch. We anticipate disruptions across all CHTC services, including (but not 
limited to) the submit servers and /staging file space on the HTC system as well as the login nodes 
and home directories on the HPC cluster. 
 
Potential issues that may occur include: 

* Not being able to log in
* Job failures due to not being able to read or write files
* Job interruptions due to login node maintenance
 
This is also an opportune time to remind all CHTC users that our file systems are not backed up and 
it is your responsibility to make backups of important files and to move files that you are no longer 
using off CHTC systems. 
 
Please contact us at chtc@cs.wisc.edu with any questions or concerns in advance of this planned 
maintenance.
 
Best,
 
Your CHTC team

------------------------------------------------------------------------

## New requirement syntax for GPU jobs on HTC system
### Tuesday, June 28, 2022

Dear CHTC GPU users, 
 
This message is for users of our high throughput computing (HTC) system who are using GPUs in their jobs. 
 
Due to recent updates in HTCondor, specific GPU qualities like GPU Memory and GPU compute “capability” are being utilized by HTCondor in a different manner. **If your jobs require specific GPU qualities like these, the mechanism and syntax for requesting them in jobs has changed.**
 
See our updated GPU Jobs guide for more details: [GPU Jobs Guide](https://chtc.cs.wisc.edu/uw-research-computing/gpu-jobs)
 
The old syntax for requesting certain GPU qualities using a “requirements” statement in the submit file will continue to work, with plans to phase it out by fall 2022. **The old syntax may limit the number of servers your jobs match to, so we recommend transitioning to the new syntax to maximize the GPU capacity available to your jobs.**
 
If your jobs simply request any GPUs (no additional requirements), then nothing needs to be changed in your job submission. 
 
We are happy to answer any questions about this transition. As always, we can be reached at chtc@cs.wisc.edu.
 
Best, 

Your CHTC team

------------------------------------------------------------------------

<center><a class="twitter-timeline" data-width="800" data-height="500" data-theme="light" data-link-color="#2B7BB9" href="https://twitter.com/CHTC_UW?ref_src=twsrc%5Etfw">Tweets by CHTC_UW</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></center>
