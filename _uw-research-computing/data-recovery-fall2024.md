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

## User Next Steps

### Resume Running Jobs

All HTC users should now have access to a empty `/staging` directory with a default quota of 100GB / 1000 items. This space can be used exactly like the previous `/staging` directories to run jobs ([See our staging guide](https://chtc.cs.wisc.edu/uw-research-computing/file-avail-largedata)). 

A few notes about special circumstances: 
* **Group and project directories:** Group and project directories will need to be created manually -- contact the facilitators at chtc@cs.wisc.edu or fill out our [quota request form](https://chtc.cs.wisc.edu/uw-research-computing/quota-request) to have a group directory created. 
* **Quota changes:** Quotas from the previous file system will not transfer over, so if you anticipate needing space beyond the default quota, especially in the short term, please fill out our [Quota Request Form](https://chtc.cs.wisc.edu/uw-research-computing/quota-request)
* **Immediate deadlines:** If you have a short-term deadline (within the next 2-3 weeks) please reach out to see how we can support you. Email chtc@cs.wisc.edu with the following: 
	* Include your name and the deadline date in the subject line
	* Cc your PI or advisor
	* Describe the nature of the deadline (paper submission, thesis defense, conference deadline, etc.)
	* Describe what specific computational or data capacity you need in order to meet the deadline (how many jobs, how many resources per job, how much data, etc.)

### Access Recovered Data

#### Recover `/staging` and `/software` data

The data recovery process for `/staging` and `/software` was completed on 12/11. We believe we have recovered about 50% of the data that was originally present in these directories. Some of the metadata for files (like file creation date) may be incorrect; **_we strongly recommend validating any data that you copy from the recovered file system._**

Any recovered data is available at this path: 
  * `/recovery/staging/<your username>`
  * `/recovery/software/<your username>`

Users should **copy** any recovered files they want to save into their new `/staging` directories. 

References to data using the paths to recovered staging directories should ***not*** be used in job submission. The directories for recovered data are read-only, and you will not be able to write into them. 

**_If your directory doesn’t exist in the recovery path, that means that none of your data was recovered._**


#### Updated `/projects` timeline

We are now working on data recovery for `/projects` folders. Due to the large size of this data store, we anticipate that the recovery process will take longer than `/staging` and likely stretch into January. 


## CHTC Next Steps and Timeline

* Nov 25 - 27: New data backend for /staging and /projects
	* This week (Nov 25-27), we will create a new data store to serve the `/staging` and `/projects` directories. Initially, _there will be no data inside these directories._ This new data backend for the `/staging` and `/projects` directories will be used for CHTC data storage moving forward and will be usable in jobs _immediately_ once it is available. 
* Nov 25 - Dec 10: Recovering data from `/staging` directories
	* We will run multiple recovery processes on the old data store over the next 1-2 weeks. Once each recovery process is complete, CHTC users will be able to access recovered data and copy it to the new data store. CHTC will not overwrite or replace data created in the meantime.  _We are still developing the mechanism for this process and will provide more information as it becomes available._
* Dec 11 onward: Recovering data from `/projects`
	* This will be the same process as recovering data from `/staging`. 

## Stay Informed

In order to find out when the new file system is available and when recovered data is available, we recommend following the relevant incident(s) on the CHTC status page. You can subscribe to the status page for the latest updates: [https://status.chtc.wisc.edu/](https://status.chtc.wisc.edu/)

This web guide will also be updated as changes occur. 

## Contact Us

We understand the challenge of restarting your work after an event like this. If you have any questions or specific concerns after reading through this guide, please contact us at chtc@cs.wisc.edu. We will do our best to help all CHTC users get up and running again as soon as possible. 
