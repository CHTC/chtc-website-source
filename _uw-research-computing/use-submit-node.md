---
highlighter: none
layout: markdown-page
title: Policies for Using HTC Submit Servers
alt_title: Using CHTC's HTC Submit Nodes
category: Basics and Policies
tag:
    -htc
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

Data Practices
--------------

**CHTC data locations are not backed up**, and users should
treat CHTC compute systems as temporary storage locations for *active*,
currently-queued computational work. Users should remove data from CHTC
systems upon completion of a batch of computational work and keep copies of
all essential files in a non-CHTC location. CHTC staff reserve the right
to delete data from any CHTC data location at at any time, to preserve
performance, and are not responsible for data loss or file system
corruption, which are possible in the absence of back-ups.

**Note: CHTC is not HIPAA-compliant** and users should not bring HIPAA data into 
CHTC services. If you have data security concerns or any questions about 
data security in CHTC, please get in touch! We'll be happy to discuss.

Submit Server User Policies
---------------------------

Because our submit servers are shared by many CHTC users, anyone with an
account on CHTC\'s submit servers should follow the below policies, in
order to keep the submit servers functional and usable by everyone:

-   **Do not share accounts**. We are happy to make a new account
    for any user. Sharing accounts is against campus policy and,
    therefore, CHTC policy. Accounts that we notice being shared will be
    immediately disabled and a meeting with the PI (faculty advisor)
    will be necessary to reinstate the account.
-   **Do not run programs on the submit servers.** The submit server is
    kept plenty busy just managing HTCondor jobs. Computational work,
    like compiling or testing code, should be submitted as HTCondor jobs. See our
    [online guides](guides.html) for the best compiling practices.
    Small scripts and commands (to compress data, create directories,
    etc.) that run within a few minutes on the submit server are okay,
    but their use should be minimized when possible.
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
-   **The default disk quota is 20 GB** in your `/home` directory, as a 
    starting point. You can track your use of disk space and your quota value,
    using our [Quota Guide](check-quota.html). If you need more space
    for concurrent work, please send an email to chtc@cs.wisc.edu.
-   **Submitting jobs with \"large\" files:** HTCondor\'s
    normal file transfer mechanism (\"transfer\_input\_files\") is good for 
    files up to 100MB in size (or 500MB total, per job). For jobs with larger
    files, please see our guide on [File Availability](file-availability.html) 
    Options, and contact us to make arrangements.
-   **No scheduled jobs.** Local execution and job submission should be
    manual (using `condor_submit`), or use a DAG or other approved workflow tool. Do not use cron 
    or other scripts that run on the submit server to automate job submission. 
    Contact us if you need help with job scheduling or workflows.
