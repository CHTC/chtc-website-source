---
highlighter: none
layout: markdown-page
title: Automating CHTC Log In
category: Basics and Policies
tag:
    - htc
    - hpc
---

This guide describes 
* how to authenticate with Duo when logging into CHTC's HTC and HPC systems
* how to set your login (SSH) configuration to “reuse” a two-factor authenticated 
connection over a certain period of time. 

## Authentication with Duo

As of December 2022, accessing CHTC resources 
now requires two-factor authentication. The first “factor” uses your NetID password 
(or SSH keys) and the second “factor” is authentication using Duo, via either a 
Duo fob or the Duo app. 

See the following video for an demonstration of two-factor authentication with Duo 
when logging into CHTC: 

<iframe width="560" height="315" src="https://www.youtube.com/embed/J-wxsrQ3v04" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Re-Using SSH Connections

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
what’s called "[ControlMaster](https://www.anchor.com.au/blog/2010/02/ssh-controlmaster-the-good-the-bad-the-ugly/)" (link: third party blog resource). 
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
	$ mkdir -p ~/.ssh/connections
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

### Ending “Stuck” Connections

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

### Connection settings

Note that all port forwarding, including X display forwarding, must be setup by 
the initial connection and cannot be changed. If you forget to use `-Y` on the initial 
connection, you will not be able to open X programs on subsequent connections.

## File Transfer Tools

There are a variety of tools that people use for transferring and editing files 
like WinSCP and MobaXTerm. Some of these tools are able to use ssh configuration 
or have options that do not require Duo 2FA every time a file is uploaded or 
downloaded or edited, but some do not. 

### Known to support persistent connections

* WinSCP (by default)

* Cyberduck (taken from [these docs](https://s2.smu.edu/hpc/documentation/access.html)

    Cyberduck does not use SSH configurations, therefore the following setting 
    can be used to enable connection persistence. Within Cyberduck:

    1. Select Preferences, then the Transfers button, and then the General section.
    1. Under “Transfers”, use the “Transfer Files” drop-down to select “Use browser 
connection”.

### Known to NOT support `ControlMaster` or similar persistent connections

* File transfer tools from [Panic](https://panic.com/), like Transmit and Nova
do not support the `ControlMaster` config described above. 

## Other Tools

For those on spotty wireless or those who move a lot with their connection 
(and on \*nix) then the open source shell Mosh (https://mosh.org/) has capabilities 
to keep sessions open as you change connections. Note that Mosh doesn’t support the 
following SSH features:
* ControlMaster (connection multiplexing) 
* X11 forwarding
* Port forwarding

