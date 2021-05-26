---
highlighter: none
layout: content
title: The HTC System is Transitioning to a Newer Linux Version (CentOS 7)
---

CHTC staff have upgraded the default operating system on our high
throughput compute system from Scientific Linux 6 (SL6) to a newer and
slightly different Linux version - CentOS 7.

**1. Current Status**
=================

As of May 16, 2019, over 95% of our HTC system is running CentOS 7. We
have a few \"legacy servers\" running Scientific Linux 6, including one
build server.

**2. Default Operating System**
===========================

As of May 16, 2017, CHTC-managed submit servers automatically add a
requirement to jobs that requests the now-current operating system,
CentOS 7. To override this default, see below: [Requesting a Specific
Operating System](#request).

Many jobs in our high throughput system that were compiled and run on
our old operating system (Scientific Linux 6) should be able to run
effectively on the new operating systems (CentOS 7) without any issues.
If you experience any issues with your jobs that you cannot diagnose,
please let CHTC facilitators know immediately by emailing
[chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu).


<a name="get-started"/>
<a name="request"/>

**3. Requesting a Specific Operating System**
=========================================

If your job requires an older operating system, you can override the
default requirement that requests servers running CentOS 7. You can also
change your job\'s requirements so that they can run on a variety of
operating systems.

-   To request that your jobs run on *both* Scientific Linux 6 and
    CentOS 7, add the following requirements line to your submit file:

    ``` {.sub}
    requirements = (OpSysMajorVer == 6) || (OpSysMajorVer == 7)
    ```

    The advantage of this option is that you may be able to access a
    larger number of computers in CHTC. Note that code compiled on a
    newer version of Linux may not run older versions of Linux. Make
    sure to test your jobs specifically on both CentOS 7 (our default)
    and Scientific Linux 6 (using the option below) before using the
    option above.

-   To request that your jobs run on Scientific Linux 6 *only* add the
    following requirements line to your submit file:

    ``` {.sub}
    requirements = (OpSysMajorVer == 6)
    ```

    Note that using this version of Linux only will severely limit the
    number of servers available to run your jobs, as nearly our entire
    system is running a newer version of Linux. If you have questions
    about this or how to get your jobs to run on a newer version of
    Linux, talk to CHTC\'s Research Computing Facilitators: [contact us
    or stop by office hours](/get-help.shtml).

> **Combining Requirements**\
> Does your job already have a requirements statement? If so, you can
> add the requirements above to the pre-existing requirements by using
> the characters `&&`. For example, if your jobs already require large
> data staging:
>
> ``` {.submit}
> requirements = (Target.HasCHTCStaging == true) 
> ```
>
> You can add the requirements for using Scientific Linux 6 like so:
>
> ``` {.submit}
> requirements = (Target.HasCHTCStaging == true) && (OpSysMajorVer == 6)
> ```
