---
highlighter: none
layout: markdown-page
title: HPC Clsuter Scheduled Downtime
---


*\... if you only use CHTC\'s high-throughput computing (HTC) system via
HTCondor submission, you can ignore the following information \...*



In order to upgrade the file system version and modify configurations to
improve filesystem performance

The HPC Cluster will be down for upgrade starting on Tuesday, Nov. 17
=====================================================================

with a return of functionality by **Friday, Nov. 20**


To Prepare for and Reduce Cluster Downtime,
-------------------------------------------


### we ask ALL users to do the following by Friday, Nov. 6:

1.  remove all data from the `/scratch` directory (otherwise, it will be
    deleted for you; see below)
2.  remove AS MUCH DATA AS POSSIBLE from the entire filesystem (**the
    more data removed, the shorter the downtime**)
3.  remember: we have no backups, and filesystem downtime may lead to
    file loss/corruption, so have a copy of essential files, elsewhere

The Below Policy Changes Will Take Effect after Nov. 17
-------------------------------------------------------

1.  **The entire `/scratch` location will be deleted**, so make sure to
    delete ALL data in `/scratch/user` off of the cluster and/or copy it
    to another location. Only the `/home` location will persist.
    (Neither `/home` nor `/scratch` have ever been automatically
    cleaned, and we don\'t intend to do so for `/home` in the future.)
2.  **A default disk quota of 100 GB will be set for all users.**
    Though, [current users with more than 200 GB]{.underline} will be
    contacted individually prior to Nov. 6 to discuss extra measures and
    quota arrangements. In the future, users needing more than their
    quota for [*current and active compute jobs*]{.underline} may ask
    for a quota increase by emailing
    [chtc\@cs.wisc.edu](chtc@cs.wisc.edu) and explaining the situation.
    Based upon past filesystem performance issues, we must all be
    committed to reducing the amount of leftover data and the overall
    *number of files* on the HPC Cluster filesystem, both of which
    impact filesystem performance for running jobs and for users who are
    logged in.
3.  **The new quota will *not* delete any of your data in `/home`**, but
    *will* keep you and your jobs from adding new data until you are
    using less than your quota.

CHTC Staff Are:
---------------

1.  updating the [HPC Cluster Use Guide](HPCuseguide) to reflect
    the above policy changes. (already done)
2.  emailing researchers who have significant *total data* and/or a
    *large numbers of files* on the filesystem, in preparation for the
    upgrade.

Please understand that all of the above changes are aimed at improving
filesystem performance for everyone, based upon common complaints in the
last 6 months. We do our best to minimize cluster downtime (including
quick response after recent power outages[\*](#power)) and have come to
the above decision after considerable conversation with specific users
and based upon suggestions from other cluster-providing organizations.

We appreciate your cooperation and feedback. As always, please send any
questions or comments to [chtc\@cs.wisc.edu](chtc@cs.wisc.edu).


\* While we would have preferred to perform this upgrade sooner, the
three campus power outages this fall created significant delays, and we
wanted to give you time to get some work done, before yet another
interruption.
