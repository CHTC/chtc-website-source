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

## Register for HTCondor Week May 23 - 27th; CHTC Office Hours Canceled and Limited Email Access; Outage Updates
### Tuesday, May 17, 2022

Greetings CHTC users, 

### All CHTC users are welcome and encouraged to attend HTCondor Week! 

HTCondor Week is an annual conference hosted by CHTC’s HTCondor Software Suite development team. It includes tutorials, technical talks, and research talks; highlights for CHTC users include the learning talks and tutorials on Monday morning and researcher talks on Thursday. 

CHTC users can register to view all talks online through Monday, May 23, with a cost of $25 for the whole conference. CHTC users are also welcome to join in-person for free (food/drinks not included) on Monday and Thursday morning. To join in-person, please register on Monday and Thursday morning at the CHTC booth at the Fluno Center. 

See details here: htcondor.org/HTCondorWeek2022

### Limited Staff Availability, May 23-27th

The Research Computing Facilitators will be out of the office the week of May 23-27th due to HTCondor Week. During this time, we will have limited access to email and our Tuesday/Thursday office hours will be canceled. 

### GPU Maintenance Nearly Complete

Almost all GPU machines are functioning as usual and are now accepting jobs. If you had GPU jobs in the queue earlier this week, please check your jobs for failure or holds. 

### HPC Maintenance Complete

The maintenance on the HPC cluster is now complete. Jobs in the queue should begin matching as usual. Please contact us with any concerns. 

The best way to reach us is still chtc@cs.wisc.edu should you have any questions. 

Best, 

Your CHTC Team

------------------------------------------------------------------------

## HTC Capacity Restored; GPU Configuration Error
### May 12, 2022

Greetings CHTC users, 

This message is for users of CHTC’s HTC System, especially those using GPUs. 

1. Earlier today, a change in the configuration of CHTC’s GPU nodes resulted in a mismatch between the underlying GPU (CUDA) drivers and libraries. This likely caused jobs to fail.  If you had GPU jobs in the queue today, please check your jobs for failures or holds. The GPU nodes will not execute any GPU-dependent jobs until we have resolved this configuration issue. 

1. The HTC system upgrades that began last Wednesday (5/4) and may have caused jobs to experience lower throughput are complete. Excluding GPU nodes, the HTC cluster has returned to full capacity. 

Contact us with questions at chtc@cs.wisc.edu, especially if you are seeing unexplained errors from recent jobs that could be related to the above. 

Best, 

Your CHTC Team

------------------------------------------------------------------------

## Planned maintenance for HPC Cluster on Tuesday, May 17
### May 11, 2022

Greetings CHTC users, 

This message is for users of CHTC’s HPC Cluster (log in to hpclogin1.chtc.wisc.edu or hpclogin2.chtc.wisc.edu).

There will be a maintenance outage for the HPC Cluster next Tuesday, May 17. Most cluster components will remain on, but users will not be able to submit new jobs during the maintenance and any currently running jobs will be interrupted. 

In order to minimize disruption, starting today, idle jobs in the queue will ONLY start if their indicated run time (#SBATCH --time=) will complete before the maintenance next Tuesday. 

Email us at chtc@cs.wisc.edu with any questions. 

Cheers,
Your CHTC Team 

------------------------------------------------------------------------

## Office hours canceled Thursday (4/7) for Illuminating Connections event
### April 5, 2022

Greetings CHTC Users,

Since the Research Computing Facilitators will be attending the Illuminating Connections event on Thursday (4/7), office hours will be canceled that day. 

If you would like to learn more about CHTC resources and meet other members of our team, please come visit us at the event held at the Wisconsin Institute for Discovery from 3-6pm. More information about the event can be found here: https://wid.wisc.edu/illuminating-connections-2022/

We hope to see you there!

Your CHTC Team

------------------------------------------------------------------------

## HTC Squid proxy issue resolved; No office hours next Tuesday (3/15)
### March 11, 2022

Greetings CHTC Users,
 
### Squid Proxy Issue Resolved 

We have resolved the Squid proxy issue that was causing jobs to be held with the following error code: 
``` 
Error from <SLOTNAME>: FILETRANSFER:1:non-zero exit (1) from 
/usr/libexec/condor/curl_plugin. Error: Aborted due to lack 
of progress using http_proxy=http://squid-cs-b240.chtc.wisc.edu:3128 
(http://proxy.chtc.wisc.edu/SQUID/chtc/R361.tar.gz)
```
 
If your jobs have gone on hold with this error code, you can now release them (just one time) to re-enter the queue using the following command: 

``` 
$ condor_release -constraint 'HoldReasonCode == 12 && HoldReasonSubCode == 256'
```

If you have jobs held for this reason after today, or have any other issues transferring files from /squid, do not hesitate to reach out to the Research Computing Facilitators by emailing chtc@cs.wisc.edu. 
 
### No Office Hours on Tuesday 

Since CHTC staff will be attending a conference next week, office hours on Tuesday (3/15) are canceled. We will still be available by email at chtc@cs.wisc.edu but response times may be longer than usual.
 
Happy computing! 

Your CHTC Team

------------------------------------------------------------------------

## CHTC outage concluded on March 10; Unrelated HTC Squid proxy issue (jobs held)
### March 11, 2022

Greetings CHTC Users,

All CHTC services (HPC cluster, all HTC execute nodes) were brought back up on Thursday (3/10) after server room maintenance was completed.

**Separately, we’re working on a new issue impacting HTC jobs that transfer files via Squid**, resulting in *some* Squid-dependent jobs going on hold for a reason like the following (visible in job log files for with ‘condor_q -hold’:

```
Error from <SLOTNAME>: FILETRANSFER:1:non-zero exit (1) from 
/usr/libexec/condor/curl_plugin. Error: Aborted due to lack of progress 
using http_proxy=http://squid-cs-b240.chtc.wisc.edu:3128 
(http://proxy.chtc.wisc.edu/SQUID/chtc/R361.tar.gz)
```

Users can view jobs held for this specific reason by using the following command:
```
$ condor_q -constraint 'HoldReasonCode == 12 && HoldReasonSubCode == 256'
```

Once we have resolved this issue, we will follow up with instructions on how users can release just the impacted jobs to run again. Please otherwise leave them held in the queue, for now.

As always, please let us know if you notice any other issues by emailing chtc@cs.wisc.edu.

Best,

Your CHTC Team

------------------------------------------------------------------------

## CHTC outages starting 5pm today (3/9)
### March 9, 2022

Greetings CHTC Users,
 
Due to short-notice maintenance for the cooling infrastructure in one of CHTC’s server rooms, we will have an outage starting tonight (3/9) that will impact our HPC cluster and certain HTC execute nodes. 
 
HPC Cluster
* The HPC cluster, including execute nodes, head nodes, and filesystem, will be down starting at 6:00pm on Wednesday (3/9) with services expected to be restored by the end of the day on Thursday (3/10). 
* The HPC cluster is configured to not start new jobs that will not complete before the start of the scheduled downtime. Already-running jobs that do not complete by tonight will be interrupted and re-queued once systems are operational. Users may want to remove any jobs that will be negatively impacted by this process. 
 
HTC System
* Some HTC execute nodes, including some researcher-owned GPU nodes, will be down starting at 5:00pm on Wednesday (3/9) with services expected to be restored by the end of the day on Thursday (3/10). Jobs running on these nodes will be evicted and remain in the queue to be re-run. 
* We do not expect the HTC system submit servers, transfer server, or Staging filesystem to be impacted at this time. 
 
We appreciate your patience as the ongoing maintenance in this room has meant a lot of extra announcements to this list, and not always with our usual amount of notice.
 
As always, email us at chtc@cs.wisc.edu with any questions. 
 
Regards,
Your CHTC Team

------------------------------------------------------------------------

## Minimal CHTC email support tomorrow (March 4)
### March 3, 3022

Dear CHTC users, 

CHTC's Research Facilitation staff are spending dedicated time this Friday 
(March 4th) to improve our user guides on the CHTC website. 

Due to this effort, we will not be answering support requests on Friday. We 
will reply to emails received on Friday by Monday, March 7th. If you have 
questions or concerns, our support email (chtc@cs.wisc.edu) is still the best way to contact us. 

Best regards, 
Research Facilitation Team

------------------------------------------------------------------------

## CHTC Office Hours canceled Thursday, February 24
### February 23, 2022

Greetings CHTC users, 

Due to limited staffing this week, office hours on Thursday, February 24 are canceled. 
Our normal office hours schedule will continue on Tuesday, March 1. 

Best, 
The CHTC facilitation team

------------------------------------------------------------------------


## CHTC Facilitator Holiday Availability; New Office Hour Times in 2022
### December 22, 2021

Greetings CHTC users, 

This is an annual reminder that CHTC staffing will be somewhat reduced during the next week. 

- Office Hours are cancelled next week (Dec. 27 - 31), and email responses will also be delayed during 
this period. *Office Hours are still on for tomorrow, Dec. 23.*
- Normal email response times will resume on Monday, January 3rd. 

**We will have a new office hours schedule in 2022.** Starting the week of January 3rd, office hours will be on: 

- Tuesdays: **10:30am - 12pm** (note the different time!)
- Thursdays: 3pm - 4:30pm

Please remember that your work on CHTC's shared compute systems can affect other users. You should review and 
continue to follow CHTC policies for our [HTC System](use-submit-node.html) and [HPC Cluster](hpc-overview.html) to ensure that you are 
acting in consideration of others, especially since CHTC staff may not be able to respond as quickly to user-caused issues.

As always, the best way to get in touch with us is through our designated email address (chtc@cs.wisc.edu). 

Best wishes during the holiday season!

Christina, Lauren, Rachel and the rest of the CHTC team

------------------------------------------------------------------------

<center><a class="twitter-timeline" data-width="800" data-height="500" data-theme="light" data-link-color="#2B7BB9" href="https://twitter.com/CHTC_UW?ref_src=twsrc%5Etfw">Tweets by CHTC_UW</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></center>
