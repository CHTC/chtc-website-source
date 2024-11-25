---
highlighter: none
layout: guide
title: "CHTC /staging and /projects Next Steps"
published: true
guide: 
    button_class: bg-warning
    order: 0
    category: Basics and Policies
    tag:
        - hpc
        - htc
---

On Thursday, November 21, CHTC personnel were alerted to data issues in our `/staging` and `/projects` directories. We took immediate action on Thursday afternoon and have been working on it through the weekend. 

The underlying cause has been identified and affected the `/squid`, `/staging`, `/projects` and HTC `/software` directories. We are able to prevent it from recurring; however, **it resulted in significant data loss in /staging, /projects, HTC /software and /squid** before CHTC personnel were able to react. All data in `/squid` is unrecoverable. Any remaining data in `/projects` and `/staging` is currently inaccessible as we work to recover whatever additional data we can. We hope to recover at least 50% of `/staging` and 60% of `/projects`. 

We recognize that this ongoing outage and accompanying data loss is disruptive to important work. Our plan to bring systems and data back online is outlined below. 

## CHTC Next Steps and Timeline

* Nov 25 - 27: New data backend for /staging and /projects
	* This week (Nov 25-27), we will create a new data store to serve the `/staging` and `/projects` directories. Initially, _there will be no data inside these directories._ This new data backend for the `/staging` and `/projects` directories will be used for CHTC data storage moving forward and will be usable in jobs _immediately_ once it is available. 
* Nov 25 - Dec 9: Recovering data from `/staging` directories
	* We will run multiple recovery processes on the old data store over the next 1-2 weeks. Once each recovery process is complete, CHTC users will be able to access recovered data and copy it to the new data store. CHTC will not overwrite or replace data created in the meantime.  _We are still developing the mechanism for this process and will provide more information as it becomes available._
* Dec 9 onward: Recovering data from `/projects`
	* This will be the same process as recovering data from `/staging`. 

**Note that this timeline means that you will not know how much of your data from the previous data store was lost or recovered until after Dec 2, at the earliest.**  Consider re-transferring or reproducing the data instead of waiting for potential recovery.

Evaluation and restoration of HTC `/software` directories will happen after the process above is complete. 

## User Next Steps

### Resume Running Jobs

By Tuesday, November 26, all HTC users should have access to a empty `/staging` directory with a default quota of 100GB / 1000 items. This space can be used exactly like the previous `/staging` directories to run jobs. 

A few notes about special circumstances: 
* **Quota changes:** Quotas from the previous file system will not transfer over, so if you anticipate needing space beyond the default quota, especially in the short term, please fill out our [Quota Request Form](https://chtc.cs.wisc.edu/uw-research-computing/quota-request)
* **Immediate deadlines:** If you have a short-term deadline (within the next 2-3 weeks) please reach out to see how we can support you. Email chtc@cs.wisc.edu with the following: 
	* Include your name and the deadline date in the subject line
	* Cc your PI or advisor
	* Describe the nature of the deadline (paper submission, thesis defense, conference deadline, etc.)
	* Describe what specific computational or data capacity you need in order to meet the deadline (how many jobs, how many resources per job, how much data, etc.)

### Access Recovered Data

Instructions coming the week of Dec 2 or Dec 9.

## Stay Informed

In order to find out when the new file system is available and when recovered data is available, we recommend following the relevant incident(s) on the CHTC status page: [https://status.chtc.wisc.edu/](https://status.chtc.wisc.edu/)

This web guide will also be updated as changes occur. 

## Contact Us

We appreciate the challenge of restarting your work after an event like this. If you have any questions or specific concerns after reading through this guide, please contact us at chtc@cs.wisc.edu. We will do our best to help all CHTC users get up and running again as soon as possible. 