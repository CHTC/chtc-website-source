---
layout: guide
title: Policies for Using HTC Submit Servers
alt_title: Using CHTC's HTC Submit Nodes
guide:
    order: 1
    category: Basics and Policies
    tag:
        - htc
---

**If you have not yet requested a CHTC account and met with a Research
Computing Facilitator, please fill out [this form](form.html).**

Recently created CHTC accounts will use our submit server 
*submit1.chtc.wisc.edu*. Accounts created before Feb 1, 2023 may be on 
either *submit1.chtc.wisc.edu* or *submit2.chtc.wisc.edu*. See our 
[connecting guide](connecting.html) for additional information. 

Access to other submit servers is granted for
specific purposes and will have been indicated to you by CHTC staff.

Connecting to HTC Submit Servers
---------------------------------

Once your account is active, you can connect to your designated submit
server with an SSH connection (\"Putty\" for Windows, putty.org;
\"Terminal\" for Linux/Max). Note, however, that our submit servers only
accept connections from campus networks. Off-campus connections have
been disabled for security purposes. If you need to connect from off
campus, you can first SSH to a computer in your department, and then SSH
to our submit server. You may also be able to use a Virtual Private
Network (VPN) to join the campus network when working off-campus. DoIT
provides [information on using a
VPN](https://it.wisc.edu/services/wiscvpn/).

For more detailed information on connecting to CHTC services, both
logging in and transferring files, see our [Connecting to CHTC
guide](connecting.html).

## General User Policies

See our [User Policies and Expectations](user-expectations.html) for details on general CHTC policies. 

## HTC System Specific Limits

Below are some of the default limits on CHTC's HTC system. Note that as a large-scale 
computing center, we want you to be able to run at a large scale - often much larger 
than these defaults. Please contact the facilitation team whenever you encounter one 
of these limits so we can adjust your account settings or discuss alternative ways to 
achieve your computing goals. 

-   **Jobs with long runtimes.** There is a default run limit of 72
    hours for each job queued in the HTC System, once it starts running.
    Jobs longer than this will be placed in HTCondor\'s \"hold\" state.
    If your jobs will be longer, please [email
    us](mailto:chtc@cs.wisc.edu), and we\'ll help you to determine the
    best solution.
-   **Submitting many jobs from one submit file.** HTCondor is designed
    to submit thousands (or more) jobs from one submit file. If you are
    submitting <u>over 10,000 jobs per submit file</u> or want to queue 
    more than <u>50,000 total jobs as a single user</u>,
    please [email us](mailto:chtc@cs.wisc.edu) as we have strategies to
    submit that many jobs in a way that will ensure you have as many
    jobs running as possible without also compromising queue performance.
-   **Submitting many *short* jobs from one submit file.** While HTCondor
    is designed to submit thousands of jobs at a time, many *short* jobs
    can overwhelm the submit server, resulting in other jobs taking much
    longer to start than usual. <u> If you plan on submitting over
    1000 jobs per submit file, we ask that you ensure each job has a
    minimum run time of 10 minutes (on average). <u>
-   **The default disk quota is 20 GB** in your `/home` directory, as a 
    starting point. You can track your use of disk space and your quota value,
    using our [Quota Guide](check-quota.html). If you need more space
    for concurrent work, please send an email to chtc@cs.wisc.edu.
-   **Submitting jobs with \"large\" files:** HTCondor\'s
    normal file transfer mechanism (\"transfer\_input\_files\") is good for 
    files up to 100MB in size (or 500MB total, per job). For jobs with larger
    files, please see our guide on [File Availability](file-availability.html) 
    Options, and contact us to make arrangements.
