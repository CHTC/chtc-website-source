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

## Introduction

This guide outlines login information for CHTC services, including how to log in to CHTC servers after your account has been created, access point information, and how to re-use ssh connections to reduce the frequency of using Duo Multi-factor Authentication.

If you don't have an account, see our [getting started](get-started.html) page.

{% capture content %}
- [Introduction](#introduction)
- [1. Before you log in](#1-before-you-log-in)
   * [Hostname / Access point information](#hostname--access-point-information)
- [2. Log in](#2-log-in)
   * [Log in with the command line](#log-in-with-the-command-line)
   * [Log in with an SSH program (Windows)](#log-in-with-an-ssh-program-windows)
   * [Log out](#log-out)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Before you log in

After obtaining a CHTC account, you will need the following to log into our CHTC access points:

### Duo Multi-factor authentication (MFA)

- [Set up Duo Multi-factor authentication](https://it.wisc.edu/services/duo-multi-factor-authentication-mfa/)

### Connection to the campus network or Virtual Private Network (VPN)

All of our CHTC acccess points are firewalled to block log-ins from off-campus. If you are off-campus and want to log in, you can either:
* Activate the campus Virtual Private Network (VPN) (see [DoIT's VPN webpage](https://it.wisc.edu/services/wiscvpn/)). This will allow you join the campus network when working off-campus. 
* Log into another computer that is on campus (typically by SSH-ing into that computer) and then SSH to our access point. 

### Username and Password

- UW-Madison NetID and password

### Hostname / Access point information

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


## Log in

You can log in to the access points two different ways — from the command line or using an SSH program.

### Log in with the command line

On Mac, Linux, and modern Windows (10+) systems, you can use the "Terminal" application to log in. Open a terminal window and use the following command to connect to the appropriate server:

``` 
ssh username@hostname
```
{:.term}

You will be prompted for your password, then for Duo authentication. 

<a name="login-putty"></a>

### Log in with an SSH program (Windows)

There are multiple programs to connect to remote servers for Windows. We recommend "PuTTy", which can be downloaded [here](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html). To log in, run the PuTTy executable (`putty.exe`). The PuTTY Configuration options will load in a new window.

![The PuTTY Configuration window](/images/putty-7.jpeg)

Fill in the hostname with the [hostname for your access point](#hostname). Use Port 22 and the "SSH" connection type — these are usually the defaults.

After clicking "Open", you will be prompted to fill in your username and password, then to authenticate with Duo. 

### Demo

See the following video for a demonstration of logging into CHTC and authenticating with Duo Multi-factor Authentication.

<iframe width="560" height="315" src="https://www.youtube.com/embed/J-wxsrQ3v04" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Log out

Log out by entering `exit` into the command line. Any submitted jobs will run and return output without you needing to be connected.

## Reuse SSH connections to reduce login frequency

You can reuse an SSH connection to 

To reduce the number of times it is necessary to enter your credentials, it’s possible 
to customize your SSH configuration in a way that allows you to “reuse” a connection 
for logging in again or moving files.  This configuration is optional, and 
most useful if you will connect to 
the same server multiple times in a short window, for example, when uploading or 
downloading files. 

**WARNING:** This guide describes how to configure your local machine to not require 
reentering your NetID password or Duo authentication each time you login. 
This should **ONLY** be used on secure devices that you manage - **it should 
not be used on any shared laptop, desktop, or research group resource. Users 
found violating this policy risk having their CHTC account permanently deactivated.** 

The instructions below are meant for users who can use a terminal (Mac, Linux, newer Windows operating systems): 

1. Open a terminal window.

1. Create (or edit) your personal SSH configuration file at `~/.ssh/config` to use 
what’s called "ControlMaster"
This is the text that should be added to a file called `config` in the `.ssh` directory in your computer's home directory: 

	```	
	Host *.chtc.wisc.edu
	  # Turn ControlMaster on
	  ControlMaster auto
	  # ControlMaster connection will persist
	  # for 2 hours of idleness, after which
	  # it will disconnect
	  ControlPersist 2h
	  # Where to store files that represent
	  # the ControlMaster persistent connections
	  ControlPath ~/.ssh/connections/%r@%h:%p
	```
	If you're not able to find or create the config file, executing the code below from a terminal on your computer
	will add the right information to the `config` file
	```	
	# Let's create (or add to) our SSH client configuration file. 
	echo "
	Host *.chtc.wisc.edu
	  # Turn ControlMaster on
	  ControlMaster auto
	  # ControlMaster connection will persist
	  # for 2 hours of idleness, after which
	  # it will disconnect
	  ControlPersist 2h
	  # Where to store files that represent
	  # the ControlMaster persistent connections
	  ControlPath ~/.ssh/connections/%r@%h:%p" >> ~/.ssh/config
	```
	{:.term}

1. You also create a directory that will be used to track connections. In 
the same .ssh directory, make a folder called `connections` by typing: 
	```
	mkdir -p ~/.ssh/connections
	```
	{: .term}
	
	Once you login to a CHTC server, this is where the system will store information 
	about your previous connection information so that you do not have to reenter your 
	password or Duo authenticate. 

4. Now, log into your CHTC submit server or login node as normal. The first time you log in, you will need to use 
two-factor authentication, but subsequent logins **to that machine** will not require 
authentication as long as they occur within the time value used in 
the `ControlPersist` configuration option (so in this example, 2 hours). 

For Windows users who use PuTTY to log in, you need to go to 
the `Connection -> SSH` section in the “Category” menu on the left side, 
and then check the “Share SSH Connection if possible” box. If you don’t 
see this option, try downloading a newer version of PuTTY.  

#### Ending “Stuck” Connections

Sometimes a connection goes stale and you can’t reconnect using it, even if 
it is within the timeout window. In this case, you can avoid using the existing 
connection by removing the relevant file in `~/.ssh/connections`; This will probably 
look something like: 

```
$ ls ~/.ssh/connections/
alice@submit.chtc.wisc.edu:22
$ rm ~/.ssh/connections/alice@submit.chtc.wisc.edu:22
```
{:.term}

#### Connection settings

Note that all port forwarding, including X display forwarding, must be setup by 
the initial connection and cannot be changed. If you forget to use `-Y` on the initial 
connection, you will not be able to open X programs on subsequent connections.