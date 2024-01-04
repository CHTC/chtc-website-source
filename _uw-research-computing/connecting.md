---
highlighter: none
layout: guide
title: Log In to CHTC Resources
alt_title: Connecting to CHTC
guide:
    order: 2
    category: Basics and Policies
    tag:
        - htc
        - hpc
---

This guide assumes
that you have already gotten a CHTC account for either our high
throughput or high performance compute systems. If you haven\'t, see our
[getting started](get-started.html) page.

{% capture content %}
1.  [Accessing the Submit Servers](#access)
2.  [Logging In](#login)
    -   [On the command line](#login-ssh)
    -   [Using an SSH program (Windows/Mac)](#login-putty)
    -   [Re-using SSH connections](#c-re-using-ssh-connections)
3.  [Learning about the command line](#learn)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

<span name="access"></span>

**1. Accessing the Submit Servers**
===============================

You will need the following information to log into our CHTC submit
servers or head nodes:

**Username and Password**

- UW - Madison NetId and password

**Hostname**

  {:.gtable}
  | HTC System |
  | --- |
  | `submit1.chtc.wisc.edu` - typically for accounts created before June 2019, between March 2021 - June 2022, or after Feb 1, 2023 |
  | `submit2.chtc.wisc.edu` - typically for accounts created between June 2019 - February 2021 or between July 1, 2022 - Jan 31, 2023 |

  {:.gtable}
  | HPC Cluster |
  | --- |
  | `hpclogin3.chtc.wisc.edu`
  | `hpclogin1.chtc.wisc.edu` and/or `hpclogin2.chtc.wisc.edu` - access the old HPC cluster until February 28, 2023 |

As of December 2022, we also require two-factor authentication with Duo to 
access CHTC resources. 

> **Are you off-campus?**\
> All of our CHTC submit servers and head nodes are firewalled to block
> log-ins from off-campus. If you are off-campus and want to log in, you
> can either:
>
> -   Activate the campus VPN (more details on how to set this up
>     [here](https://it.wisc.edu/services/wiscvpn/)).
> -   Log into another computer that is on campus.
>
> In either case, it will appear like you are on-campus, and you should
> then be able to log into CHTC as usual.


<span name="login"></span>

**2. Logging In**
=============

Using the information described above, you can log in to servers two
different ways \-- from the command line or using an SSH program:


<span name="login-ssh"></span>

A. On the command line
----------------------------------

On Mac, Linux, and modern Windows (10+) systems, you can use the \"Terminal\" application to
log in. Open a terminal window and use the following command to connect
to the appropriate server:

``` 
$ ssh username@hostname
```
{:.term}

You will be prompted for your password, and then for Duo 
authentication. 

<span name="login-putty"></span>

B. Using an SSH program (Windows)
---------------------------------

There are multiple programs to connect to remote servers for Windows. We
recommend \"PuTTy\", which can be downloaded
[here](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).
To log in, click on the PuTTy executable (`putty.exe`). You should see a
screen like this:

![](/images/putty-7.jpeg)

Fill in the hostname as described in part 1. You should use Port 22 and
connect using \"ssh\" \-- these are usually the defaults. After you
click \"connect\" you will be prompted to fill in your username and
password, and then to authenticate with Duo. 

Note that once you have submitted jobs to the queue, you can leave your
logged in session (by typing `exit`). Your jobs will run and return
output without you needing to be connected.

<!-- <span name="ssh-keys"></span>

C. Logging in automatically
---------------------------

Tired of typing your password everytime you log in? It\'s possible to
set up a file on your local computer called an ssh key, that allows you
to log into CHTC and transfer files without entering your password. [See
this guide](http://www.howtogeek.com/66776/how-to-remotely-copy-files-over-ssh-without-entering-your-password/)
for instructions on how to do this, starting at the section titled
**\"SSH and SCP Without Passwords\"**. -->


C. Re-Using SSH Connections
---------------------------

To reduce the number of times it is necessary to enter your credentials, it’s 
possible to customize your SSH configuration in a way that allows you to "reuse" 
a connection for logging in again or moving files. More details are shown 
in this guide: [Automating CHTC Log In](/uw-research-computing/configure-ssh.html)


<span name="transfer"></span>

**3. Learning About the Command Line**
==================================

**Why learn about the command line?** If you haven\'t used the command
line before, it might seem like a big challenge to get started, and
easier to use other tools, especially if you have a Windows computer.
However, we strongly recommend learning more about the command line for
multiple reasons:

-   You can do most of what you need to do in CHTC by learning a few
    basic commands.
-   With a little practice, typing on the command line is significantly
    faster and much more powerful than using a point-and-click graphic
    interface.
-   Command line skills are useful for more than just large-scale
    computing.

For a good overview of command line tools, see the [Software Carpentry
Unix Shell](http://swcarpentry.github.io/shell-novice/) lesson. In
particular, we recommend the sections on:

-   understanding the filesystem and how to navigate it ([Navigating
    Files and Directories](https://swcarpentry.github.io/shell-novice/02-filedir.html))
-   tab-completion (section entitled \"Nelle\'s Pipeline, Organizing
    Files\", in [Navigating Files and
    Directories](https://swcarpentry.github.io/shell-novice/02-filedir.html))
-   creating files ([Working With Files and
    Directories](https://swcarpentry.github.io/shell-novice/03-create.html))
-   using the star wildcard (first part of [Pipes and
    Filters](https://swcarpentry.github.io/shell-novice/04-pipefilter.html))
-   writing shell scripts ([Shell
    Scripts](https://swcarpentry.github.io/shell-novice/06-script.html))

