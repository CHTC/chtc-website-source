---
highlighter: none
layout: markdown-page
title: Connecting to CHTC 
---

This guide assumes
that you have already gotten a CHTC account for either our high
throughput or high performance compute systems. If you haven\'t, see our
[getting started](get-started.html) page.

{% capture content %}
1.  [Accessing the Submit Servers]()
2.  [Logging In](#login)
    -   [On the command line (Mac/Linux)](#login-ssh)
    -   [Using an SSH program (Windows/Mac)](#login-putty)
    -   [Re-using SSH connections](#reuse-ssh)
3.  [Transferring Files](#transfer)
    -   [On the command line (Mac/Linux)](#transfer-scp)
    -   [Using a file transfer program (Windows/Mac)](#transfer-winscp)
    -   [Transferring Multiple Files](#transfer-winscp)
4.  [Creating and Editing Files](#files)
5.  [Learning about the command line](#learn)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

<a name="access"></a>

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
  | `submit1.chtc.wisc.edu` - typically for accounts created between Aug 2018 - June 2019, or between March 2021 - June 2022 |
  | `submit2.chtc.wisc.edu` - typically for accounts created between June 2019 - February 2021 or after July 1, 2022 |

  {:.gtable}
  | HPC Cluster - starting October 15, 2020 |
  | --- |
  | `hpclogin1.chtc.wisc.edu` and/or `hpclogin2.chtc.wisc.edu` |

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


<a name="login"></a>

**2. Logging In**
=============

Using the information described above, you can log in to servers two
different ways \-- from the command line or using an SSH program:


<a name="login-ssh"></a>

A. On the command line (Mac/Linux)
----------------------------------

On a Mac or Linux system, you can use the \"Terminal\" application to
log in. Open a terminal window and use the following command to connect
to the appropriate server:

``` 
$ ssh username@hostname
```
{:.term}

You will be prompted for your password, and then for Duo 
authentication. 

<a name="login-putty"></a>

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

<!-- <a name="ssh-keys"></a>

C. Logging in automatically
---------------------------

Tired of typing your password everytime you log in? It\'s possible to
set up a file on your local computer called an ssh key, that allows you
to log into CHTC and transfer files without entering your password. [See
this guide](http://www.howtogeek.com/66776/how-to-remotely-copy-files-over-ssh-without-entering-your-password/)
for instructions on how to do this, starting at the section titled
**\"SSH and SCP Without Passwords\"**. -->

<a name="reuse-ssh"></a>

C. Re-Using SSH Connections
---------------------------

To reduce the number of times it is necessary to enter your credentials, it’s 
possible to customize your SSH configuration in a way that allows you to "reuse" 
a connection for logging in again or moving files. More details are shown 
in this guide: [Automating CHTC Log In](/uw-research-computing/configure-ssh.html)


<a name="transfer"></a>

**3. Transferring Files**
=====================

To transfer files to and from CHTC, you will need the same username and
hostname information for [logging in](#login), as well as understanding
where your files are and where you would like them to go.


<a name="transfer-scp"></a>

A. On the command line (Mac/Linux)
----------------------------------

On a Mac or Linux system, you can use the \"Terminal\" application and
the `scp` command to copy files between your computer and CHTC servers.

**Your computer to CHTC**

First, open the \"Terminal\" application and navigate to the directory
with the files or directories you want to transfer. Then, use this
command to copy these files to CHTC:

``` 
$ scp file username@hostname:/home/username
```
{:.term}

If you would like these files to end up in a different directory inside
your home directory, just add it to the path at the end of the command.

**CHTC to your computer**

Open the \"Terminal\" application. Do NOT log into CHTC. Instead,
navigate to where you want the files to go on your computer. Then, use
this command to copy these files there:

```
$ scp username@hostname:/home/username/file ./
```
{:.term}

Again, for many files, it will be easiest to create a compressed tarball
(.tar.gz file) of your files and transfer that instead of each file
individually. 


<a name="transfer-winscp"></a>

B. Using a file transfer program (Windows/Mac)
----------------------------------------------

Windows and Mac users can also use special programs to help them
transfer files between their computers and CHTC. For Windows, we
recommend [WinSCP](https://winscp.net/eng/download.php). It requires the
same information as Putty (hostname, username), and once it\'s set up,
looks like this:

![](/images/WinSCPPortable.png)

The left window is a directory on your computer, the right window is
your home directory in CHTC. To move files between the two, simply drag
and drop.

There are other programs besides WinSCP that do this. Another that works
on Mac and Windows is called [Cyberduck](https://cyberduck.io).

<a name="transfer-many"></a>

C. Transferring Multiple Files
------------------------------

If you are transferring many files, it is advantageous to compress them
into a single compressed file, in order to facilitate transferring them.
Place all the files you need in a directory, and then either zip it or
use the \"tar\" command to compress them:

``` 
$ tar czf data_files.tar.gz file_directory/
```
{:.term}

To untar or unzip files on the submit server or head nodes, you can use
either:

```
[alice@submit]$ tar xzf data_files.tar.gz
```
{:.term}

or

``` 
[alice@submit]$ unzip data_files.zip
```
{:.term}

<a name="files"></a>

**4. Creating and Editing Files in CHTC**
=====================================

Once you have logged in to a CHTC server, you can edit files from the
command line, by using a command line file editor. Some common editing
programs are:

-   nano
-   vi
-   emacs

`nano` is the most beginner-friendly, and `emacs` is the most advanced.
[This Software Carpentry
lesson](http://swcarpentry.github.io/shell-novice/03-create/) describes
how to use `nano`, and there are many other resources online with
instructions for these text editors.

Some of the file transfer programs mentioned [above](#transfer-winscp)
allow you to edit files on CHTC servers through the interface.


<a name="learn"></a>

**5. Learning About the Command Line**
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
    Files and
    Directories](http://swcarpentry.github.io/shell-novice/02-filedir/))
-   tab-completion (section entitled \"Nelle\'s Pipeline, Organizing
    Files\", in [Navigating Files and
    Directories](http://swcarpentry.github.io/shell-novice/02-filedir/))
-   creating files ([Working With Files and
    Directories](http://swcarpentry.github.io/shell-novice/03-create/))
-   using the star wildcard (first part of [Pipes and
    Filters](http://swcarpentry.github.io/shell-novice/04-pipefilter/))
-   writing shell scripts ([Shell
    Scripts](http://swcarpentry.github.io/shell-novice/06-script/))
