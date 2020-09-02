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
## Jobs on submit2.chtc.wisc.edu Inadvertently Removed; Please Resubmit
### Wednesday, September 2, 2020
Greetings,

*This email only pertains to users of the HTC System submitting through [submit2.chtc.wisc.edu](http://submit2.chtc.wisc.edu)*.

We are sorry to report that **all jobs in the HTCondor queue on [submit2.chtc.wisc.edu](http://submit2.chtc.wisc.edu) were inadvertently removed at about 10:50am** while staff were doing work on the submit server. We apologize for the inconvenience, as **users will need to resubmit jobs.**

If you need help determining which jobs may have completed already (and which need to be resubmitted), you'll be able to see removed jobs and recently completed jobs by running the following (inserting your username for <username>):

condor_history <username>

The 'condor_history' output will show an 'X' (in the 'ST' column) for jobs that were removed, and a 'C' for jobs that completed (could be with or without errors). Please get in touch via <chtc@cs.wisc.edu> if we might be able to help you.

Thank you,

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
## Licensed Software Interruption, Monday, June 29
### Tuesday, June 23, 2020
Greetings CHTC users,

This message is for CHTC users who use licensed software on any CHTC systems.

On Monday, June 29, we will have a short maintenance window affecting the server which
provides licenses for the following programs:

-   Comsol
-   Lumerical
-   Matlab (necessary for compiling Matlab code)

Licenses for these programs will be unavailable for up to a 30-minute period on Monday, shortly
after 5pm. Jobs requiring licenses from the license server that start while the license server
is down will fail and need to be resubmitted. Some currently-running jobs dependent on these
licenses may also be interrupted during this time.

As always, email us at <chtc@cs.wisc.edu> with any questions.

Cheers,\
Your CHTC Team

------------------------------------------------------------------------
## All CHTC services, including the HPC Cluster, are restored
### Wednesday, June 17, 2020
Greetings CHTC users, 


Cooling has been restored to all CHTC server rooms and all of our services, including the HPC Cluster and all execute nodes of the HTC system are now available.


Because some of the HPC Cluster nodes were shut off abruptly last week, please email us at chtc@cs.wisc.edu if you experience any unexpected issues. 


Thanks for your patience during this unexpected downtime. 


Cheers,

Your CHTC team

------------------------------------------------------------------------
## Current Status of CHTC services; HPC cluster still down
### Thursday, June 11, 2020
Greetings CHTC users,

The campus chilled water outage is continuing; the current status of CHTC services is:

-   The HPC cluster is completely down, including the login nodes.
-   The HTC system is mostly up. All submit nodes should be accessible; a subset of our
    execute nodes (including a few nodes with GPUs) are still down.

At the moment we do not know when we will be able to restore access to these services. If
you have questions about what CHTC services are available, please email
<chtc@cs.wisc.edu>.

Cheers,\
Your CHTC team

------------------------------------------------------------------------
## CHTC services down due to campus chilled water outage
### Tuesday, June 9, 2020
Greetings CHTC users,

The campus is experiencing an unplanned chilled water outage, impacting multiple server
rooms containing CHTC servers.

So far, impacted services include:
-   Execute nodes are down in both the HPC cluster and HTC system.
-   Jobs on both the HPC cluster and HTC system have been interrupted.

We don't yet know the full extent of the chilled water outage and how it will continue to
impact CHTC services. Our team is monitoring the situation closely. We will provide a more
detailed update to this list when more information is available.

Cheers,\
Your CHTC Team

------------------------------------------------------------------------
## Resolved! Was: Emails to chtc@cs.wisc.edu delayed since May 30
### Tuesday, June 2, 2020
Hi Everyone,

Thank you for your patience while we were unable to reply to your incoming emails to
chtc@cs.wisc.edu. The issue has been resolved and we will make sure to reply to you ASAP, today! You
can continue to email chtc@cs.wisc.eedu for support, including time-sensitive requests.

Best,\
Your CHTC Team

------------------------------------------------------------------------
## CHTC Office Hours Canceled May 19 for HTCondor Week 2020
### Thursday, May 15, 2020
Greetings CHTC users,

Office hours are canceled next Tuesday (May 19), as CHTC staff will be hosting [HTCondor Week 2020](https://agenda.hep.wisc.edu/event/1440/). We will continue with regular office hours on Thursday (May 21) and regular email support will continue to be available through the week. Our current office hours schedule is from 3 - 5pm on Tuesdays and Thursdays, via WebEx: [go.wisc.edu/chtc-officehours](http://go.wisc.edu/chtc-officehours).

**All CHTC users are welcome and encouraged to attend HTCondor Week!**\
Registration is FREE, and will ensure that you receive links to virtual rooms for participation: <https://agenda.hep.wisc.edu/event/1440/>\
CHTC staff will be out of the office on Monday, May 25 for the Memorial Day holiday, which we'll send a reminder about, later.

Please continue to email <chtc@cs.wisc.edu> for help during the above times, and we'll get back to you ASAP!

Cheers,\
Your CHTC Team

------------------------------------------------------------------------
## Join the first Virtual HTCondor Week, May 19-20!
### Monday, May 4, 2020
<br/>
Greetings CHTC users,

We are excited to invite you to [HTCondor Week 2020](http://htcondor.org/HTCondorWeek2020), HTCondor's annual user conference! It's a great opportunity to connect with CHTC staff and other users of HTCondor, and to expand your awareness of HTCondor capabilities.

This virtual conference will take place on Tuesday, May 19 and Wednesday, May 20.

-   Tuesday May 19 will include a series of online **presentations on the latest HTCondor capabilities and achievements**, including presentations from the HTCondor team and from worldwide HTCondor users like Dreamworks (11am-4pm CT).
-   Wednesday May 20 will focus on **tutorial presentations (11am-1pm CT) and office hours discussions (2-4pm)** hosted by HTCondor developers and other CHTC staff.

Registration is FREE and will ensure that we can email you with details, like virtual meeting room coordinates. More information, including a detailed schedule, is on the website:

<http://htcondor.org/HTCondorWeek2020>

Email us at <chtc@cs.wisc.edu> with any questions.

Best,\
Your CHTC Team

------------------------------------------------------------------------
## COVID-19 research; Thurs (4/23) office hour canceled; Gluster deletion
### Monday, April 20, 2020
<br/>
Greetings CHTC users,

We have a series of updates for your Monday!

**Office hours are canceled this Thursday (4/23) **due to prior commitments for CHTC's research computing facilitators. You can normally join office hours on Tuesdays and Thursdays from 3 - 5pm at [go.wisc.edu/chtc-officehours](http://go.wisc.edu/chtc-officehours). We will still have office hours this Tuesday (4/21) and continue as usual next week.


**Do you have computing and/or data needs for research relevant to the COVID-19 pandemic?** If so, please get in touch at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu). We'll follow up to discuss your objectives and how CHTC or other relevant resources might help.

**Files on Gluster to be deleted**: as [previously announced](https://www-auth.cs.wisc.edu/lists/chtc-users/2020-March/msg00001.shtml), we are retiring the Gluster file share previously used for large data staging and software modules on the HTC system. As of today (4/20), files and software in Gluster are unavailable and will be deleted shortly.

Email [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) with any questions or concerns.

Cheers,

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

