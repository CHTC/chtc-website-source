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

