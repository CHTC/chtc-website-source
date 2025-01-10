---
layout: guide
title: Automate CHTC login
guide:
    order: 4
    category: Basics and Policies
    tag:
        - htc
        - hpc
---

## Introduction

This guide describes how to set your login (SSH) configuration to reuse an authenticated connection over a certain period of time, also known as a persistent connection. Terminals and applications that are known to support persistent connections are also listed on this page.

{% capture content %}
- [Introduction](#introduction)
- [Reuse SSH connections to reduce login frequency](#reuse-ssh-connections-to-reduce-login-frequency)
- [End hanging or stuck connections](#end-hanging-or-stuck-connections)
- [Port forwarding](#port-forwarding)
- [Enable persistent connections in other programs](#enable-persistent-connections-in-other-programs)
   * [WinSCP](#winscp)
   * [Cyberduck](#cyberduck)
   * [Unsupported programs](#unsupported-programs)
- [Other Tools](#other-tools)
- [Summary](#summary)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Reuse SSH connections to reduce login frequency

In this optional configuration, you can reuse an SSH connection to reduce the number of times you need to re-enter your credentials and authenticate with Duo MFA. This can be useful when connecting to the same server multiple times within a short period of time, for example, when uploading or downloading files. 

> ### ⚠️ Caution!
{:.tip-header}

> This guide should ***ONLY*** be used on secure devices that you manage. It should ***not*** be used on any shared laptop, desktop, or research group resource. **Users found violating this policy risk having their CHTC account permanently deactivated.** 
{:.tip}

### Configure SSH to reuse connections

1. Open a terminal window.

1. Create (or edit) your personal SSH configuration file at `~/.ssh/config`. The configuration file is a text-based file. Within this file, we will enable some "ControlMaster" options. 

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

	If you're not able to find or create the config file, executing the code below from the command line on your computer will add the right information to the `config` file

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

1. You should also create a directory that will be used to track connections. In the same `.ssh` directory, make a folder called `connections` by typing: 

	```
	mkdir -p ~/.ssh/connections
	```
	{:.term}
	
	Once you log in to a CHTC server, your computer will store previous connection information in the `connections` directory so that you do not have to re-enter your password or Duo authenticate. 

4. Log into your CHTC access point. The first time you log in, you will need to use Duo MFA, but subsequent logins **to that machine** will not require authentication as long as they occur within the time value used in the `ControlPersist` configuration option (in this example, 2 hours). 

### PuTTY users

1. Go the `Connection -> SSH` section in the “Category” menu on the left side.
2. Check the “Share SSH Connection if possible” box. If you don’t see this option, try downloading a newer version of PuTTY.

## End hanging or stuck connections

Sometimes, a connection goes stale. When trying to reconnect, the terminal hangs or gets stuck. This may occur even if within the timeout window. To fix this, we will need to remove the existing connection by removing the relevant file in `~/.ssh/connections`.

1. If the connection is hanging or stuck, use `CTRL + C` to cancel connecting.

2. Locate the connection in the `~/.ssh/connections` directory.

    ```
    [user@local]$ ls ~/.ssh/connections
    user_ap2002_22
    ```
    {:.term}

3. Remove the connection.
    
    ```
    [user@local]$ rm ~/.ssh/connections/user_ap2002_22
    ```
    {:.term}

4. Log in again.

## Port forwarding

All port forwarding, including X display forwarding, must be set up by the initial connection and cannot be changed. If you forget to use `-Y` on the initial connection, you will not be able to open X programs on subsequent connections.

## Enable persistent connections in other programs

### WinSCP
    
Adjust preferences in WinSCP:
    
1. Go to Options, then Preferences, and click on Background under the Transfer section.  
2. Set 'Maximal number of transfers at the same time:' to 1.
3. Make sure 'Use multiple connections for single transfer' checkbox is checked.
4. Click 'OK' to save.

### Cyberduck

Cyberduck does not use SSH configurations but can be set to enable persistent connections. (Steps based off [these docs](https://southernmethodistuniversity.github.io/hpc_docs/)).

1. Select Preferences, then the Transfers button, and then the General section.
2. Under “Transfers”, use the “Transfer Files” drop-down to select “Use browser connection”.

### Unsupported programs

* Windows PowerShell
* File transfer tools from [Panic](https://panic.com/), like Transmit and Nova

## Other Tools

For those on spotty wireless or those who move a lot with their connection, then the open source shell [Mosh](https://mosh.org/) has capabilities to keep sessions open as you change connections. Note that Mosh doesn’t support the following SSH features:

* ControlMaster (connection multiplexing) 
* X11 forwarding
* Port forwarding

## Summary

Users should know:

* the benefits of persistent connections
* how to enable persistent connections in their SSH configuration file
* how to enable persistent connections in programs like WinSCP and Cyberduck
* how to enable persistent connections during port forwarding

## Related pages

* [Log in to CHTC](connecting)