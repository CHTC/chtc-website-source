---
highlighter: none
layout: default
title: Using CHTC's HTC Submit Servers 
---

**If you have not yet requested a CHTC account and met with a Research
Computing Facilitator, please fill out [this form](/form.shtml).**

Recently created CHTC accounts will use our submit server 
*submit1.chtc.wisc.edu*. Accounts older than March 2021 may be on 
either *submit1.chtc.wisc.edu* or *submit2.chtc.wisc.edu*. 
Access to other submit servers is granted for
specific purposes and will have been indicated to you by CHTC staff.

Connecting to CHTC Submit Servers
---------------------------------

When your CHTC account is active, you can connect to one of our submit
servers with an SSH connection (\"Putty\" for Windows, putty.org;
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
guide](/connecting.shtml).

Data Practices
--------------

**We do not back up data on CHTC submission points**, and users should
treat CHTC compute systems as temporary storage locations for *active*,
currently-queued computational work. Users should remove data from CHTC
systems upon completion of a batch of computational work and keep copies of
all essential files in a non-CHTC location. CHTC staff reserve the right
to delete data from any CHTC file systems at at any time, to preserve
performance, and are not responsible for data loss for file system
corruption, which are possible, especially in the absence of back-ups.

**CHTC is not HIPAA-compliant** and users should not bring HIPAA data into 
CHTC services. If you have data security concerns or any questions about 
data security in CHTC, please get in touch! We'll be happy to discuss.

Submit Server User Policies
---------------------------

Because our submit servers are shared by many CHTC users, anyone with an
account on CHTC\'s submit servers should follow the below policies, in
order to keep the submit servers functional and usable by everyone:

-   **Do not share accounts**. We are happy to make new a new account
    for any user. Sharing accounts is against campus policy and,
    therefore, CHTC policy. Accounts that we notice being shared will be
    immediately disabled and a meeting with the PI (faculty advisor)
    will be necessary to reinstate the account.
-   **Do not run programs on the submit server.** The submit server is
    kept plenty busy just managing HTCondor jobs. Computational work,
    like compiling code, should be submitted as HTCondor jobs. See our
    [online guides](/guides.shtml) for the best compiling practices.
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
    to submit thousands of jobs from one submit file. However,
    submitting too many jobs at once provides no extra benefit to the
    submitter and can make the queue work more slowly. If you are
    submitting <u>over 10,000 jobs per submit file</u> or have
    submitted over <u>50,000 jobs at once as a single user</u>,
    please [email us](mailto:chtc@cs.wisc.edu) as we have strategies to
    submit that many jobs in a way that will ensure you have as many
    jobs running as possible without also compromising the queue.
-   **There is a 20 GB disk quota** in your `/home` directory, by
    default. You can track your use of disk space, and your quota value,
    using our [Quota Guide](/check-quota.shtml). If you need more space
    for concurrent work, please send an email to chtc@cs.wisc.edu.
-   **Submitting jobs with \"large\" files:** Please do not submit jobs
    that require single input files larger than 100 MB using HTCondor\'s
    normal file transfer mechanism (\"transfer\_input\_files\"), or that
    produce output files greater than a few GB. For such jobs with large
    files, please see our guide on [File
    Availability](/file-availability.shtml) Options, and contact us to
    make arrangements.
-   **No scheduled jobs.** Local execution and job submission should be
    manual, or use a DAG. Do not use cron to schedule jobs, and do not
    submit jobs with a script that uses \"sleep\" or otherwise doesn\'t
    complete while you are logged in. Contact us if you need job
    scheduling.
