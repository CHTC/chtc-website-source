---
highlighter: none
layout: guide
title: Log in to CHTC
alt_title: Log in to CHTC
guide:
    category: Get started
    tag:
        - htc
        - hpc
---

## Introduction

This guide outlines login information for CHTC services, including how to log in to CHTC servers after your account has been created, access point information, and how to re-use ssh connections to reduce the frequency of using Duo Multi-factor Authentication (MFA).

If you don't have an account, see our [getting started](get-started.html) page.

{% capture content %}
- [Introduction](#introduction)
- [Before you log in](#before-you-log-in)
- [Log in](#log-in)
   * [Option 1: Log in with a terminal](#option-1-log-in-with-a-terminal)
   * [Option 2: Log in with PuTTY, an SSH program for Windows](#option-2-log-in-with-putty-an-ssh-program-for-windows)
- [Log out](#log-out)
- [SSH programs](#ssh-programs)
- [Hostname / Access point information](#hostname--access-point-information)
- [Summary](#summary)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Before you log in

After obtaining a CHTC account, you will need the following to log into our CHTC access points:

* [Duo Multi-factor authentication (MFA)](https://it.wisc.edu/services/duo-multi-factor-authentication-mfa/)
* [a connection to the campus network or Virtual Private Network (VPN)](https://it.wisc.edu/services/wiscvpn/)
* a username and password (typically your UW-Madison NetID and password)
* an [SSH program](#ssh-programs), such as a terminal


## Log in

You can log in to the access points two different ways — from a terminal program or using an SSH program.

See [this table](#ssh-programs) for a list of terminal/SSH programs.

### Option 1: Log in with a terminal

1. Open a terminal window. Enter the following command, where `user` is your username (typically your NetID) and `hostname.chtc.wisc.edu` is [your assigned access point](#hostname--access-point-information) in your welcome email.

    ``` 
    ssh username@hostname.chtc.wisc.edu
    ```
    {:.term}

2. You will be prompted for your password, then for Duo MFA authentication.

> ### 🎞️ Demo: Log into a CHTC access point
{:.tip-header}

> This video demonstrates how to log into CHTC and authenticate with Duo MFA.
> <iframe width="560" height="315" src="https://www.youtube.com/embed/J-wxsrQ3v04" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
{:.tip}

### Option 2: Log in with PuTTY, an SSH program for Windows

There are multiple programs to connect to remote servers for Windows. We recommend "PuTTy", which can be downloaded [here](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).

1. To log in, run the PuTTy executable (`putty.exe`). The PuTTY Configuration options will load in a new window.

    ![The PuTTY Configuration window](/images/putty-7.jpeg)

2. Fill in the hostname with the [hostname for your access point](#hostname). Use Port 22 and the "SSH" connection type — these are usually the defaults.

3. After clicking "Open", you will be prompted to fill in your username and password, then to authenticate with Duo. 

## Log out

Log out by entering `exit` into the command line. Any submitted jobs will run and return output without you needing to be connected.

## SSH programs

This is a non-exhaustive list of programs that can be used to log into CHTC servers or transfer files.

| Operating system | Program | Type | Supports [persistent connections](configure-ssh) | Notes |
| --- | --- | --- | --- |
| Linux | Terminal | terminal | ✓ | pre-installed |
| MacOS | Terminal | terminal | ✓ | pre-installed |
| | [Cyberduck](https://cyberduck.io/) | file-transfer utility | ✓ | |
| Windows | Terminal (PowerShell) | terminal | X | pre-installed |
| | [Terminal (Windows Subshell for Linux)](https://learn.microsoft.com/en-us/windows/wsl/install) | terminal | ✓ | recommended for users familiar with the Unix shell |
| | [MobaXTerm](https://mobaxterm.mobatek.net/) | terminal, SSH client, file-transfer utility | ✓ | |
| | [WinSCP](https://winscp.net/eng/index.php) | file-transfer utility | ✓ |
| | [PuTTY](https://www.putty.org/) | SSH client | ✓ | |
| Linux, MacOS, Windows | [VSCode](https://code.visualstudio.com/) | terminal, limited file-transfer utility, integrated code editor | only on MacOS/Linux/WSL | [setup](https://code.visualstudio.com/docs/remote/ssh-tutorial) (ignore steps on creating a virtual machine) |
| Linux, MacOS, Chrome, and more | [Mosh](https://mosh.org/) | terminal | X | |

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


## Summary

From this guide, users should know:
* the information and connections necessary to log in
* hostname of their access point
* how to log in to their CHTC access point
* how to log out of their access point
* programs they can use to log in to CHTC

## Related pages

* [Automate CHTC log in](configure-ssh)
* [Basic shell commands](basic-shell-commands)
* [Transfer files to/from CHTC and your computer](transfer-files-computer)