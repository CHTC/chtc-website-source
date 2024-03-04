---
highlighter: none
layout: guide
title: Transfer Files between CHTC and your Computer
guide:
    order: 2
    category: Basics and Policies
    tag:
        - htc
        - hpc
---

{% capture content %}
1.  [Transferring Files](#transfer)
    -   [On the command line](#transfer-scp)
    -   [Using an SSH program (Windows/Mac)](#transfer-winscp)
    -   [Re-using SSH connections](#transfer-many)
3.  [Creating and Editing Files in CHTC](#files)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

<a name="transfer"></a>

**1. Transferring Files**
=====================

To transfer files to and from CHTC, you will need the same username and
hostname information for [logging in](#login), as well as understanding
where your files are and where you would like them to go.


<a name="transfer-scp"></a>

A. On the command line
----------------------------------

On Mac, Linux, or modern Windows (10+) systems, you can use the \"Terminal\" application and
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

**2. Creating and Editing Files in CHTC**
=====================================

Once you have logged in to a CHTC server, you can edit files from the
command line, by using a command line file editor. Some common editing
programs are:

-   nano
-   vi
-   emacs

`nano` is the most beginner-friendly, and `emacs` is the most advanced.
[This Software Carpentry
lesson](https://swcarpentry.github.io/shell-novice/03-create.html) describes
how to use `nano`, and there are many other resources online with
instructions for these text editors.

Some of the file transfer programs mentioned [above](#transfer-winscp)
allow you to edit files on CHTC servers through the interface.
