---
highlighter: none
layout: guide
title: Log In to CHTC Resources
alt_title: Connect to CHTC
guide:
    order: 2
    category: Basics and Policies
    tag:
        - htc
        - hpc
---

# Introduction

This guide outlines login information for CHTC services, including how to log in to CHTC servers after your account has been created, access point information, and how to re-use ssh connections to reduce the frequency of using Duo Multi-factor Authentication.

If you don't have an account, see our [getting started](get-started.html) page.

{% capture content %}
1.  [Access points](#access)
2.  [Logging In](#login)
    -   [On the command line](#login-ssh)
    -   [Using an SSH program (Windows/Mac)](#login-putty)
    -   [Re-using SSH connections](#c-re-using-ssh-connections)
3.  [Learning about the command line](#learn)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

# 1. Before you log in

After obtaining a CHTC account, you will need the following to log into our CHTC access points:

## Duo Multi-factor authentication (MFA)

- [Set up Duo Multi-factor authentication](https://it.wisc.edu/services/duo-multi-factor-authentication-mfa/)

## Connection to the campus network or Virtual Private Network (VPN)

All of our CHTC acccess points are firewalled to block log-ins from off-campus. If you are off-campus and want to log in, you can either:
* Activate the campus Virtual Private Network (VPN) (see [DoIT's VPN webpage](https://it.wisc.edu/services/wiscvpn/)). This will allow you join the campus network when working off-campus. 
* Log into another computer that is on campus (typically by SSH-ing into that computer) and then SSH to our access point. 

## Username and Password

- UW-Madison NetID and password

## Hostname / Access point information

Please use the access point specified in your welcome email.

  {:.gtable}
  | High Throughput Computing (HTC) System |
  | --- |
  | `ap2001.chtc.wisc.edu` |
  | `ap2002.chtc.wisc.edu` |

  {:.gtable}
  | High Performance Computing (HPC) System |
  | --- |
  | `spark-login.chtc.wisc.edu` |


# 2. Log in

You can log in to the access points two different ways — from the command line or using an SSH program.

## Log in with the command line

On Mac, Linux, and modern Windows (10+) systems, you can use the "Terminal" application to log in. Open a terminal window and use the following command to connect to the appropriate server:

``` 
ssh username@hostname
```
{:.term}

You will be prompted for your password, then for Duo authentication. 

<a name="login-putty"></a>

## Log in with an SSH program (Windows)

There are multiple programs to connect to remote servers for Windows. We recommend "PuTTy", which can be downloaded [here](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html). To log in, run the PuTTy executable (`putty.exe`). The PuTTY Configuration options will load in a new window.

![The PuTTY Configuration window](/images/putty-7.jpeg)

Fill in the hostname with the [hostname for your access point](#hostname). Use Port 22 and the "SSH" connection type — these are usually the defaults.

After clicking "Open", you will be prompted to fill in your username and password, then to authenticate with Duo. 

## Demo

See the following video for a demonstration of logging into CHTC and authenticating with Duo Multi-factor Authentication.

<iframe width="560" height="315" src="https://www.youtube.com/embed/J-wxsrQ3v04" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Log out

Log out by entering `exit` into the command line. Any submitted jobs will run and return output without you needing to be connected.


# 3. Re-using SSH Connections

To reduce the number of times it is necessary to enter your credentials, you can customize your SSH configuration in a way that allows you to "reuse" a connection for logging in again or moving files.


# 3. Learning About the Command Line

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

