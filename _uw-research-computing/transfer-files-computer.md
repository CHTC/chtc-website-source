---
highlighter: none
layout: guide
title: Transfer Files between CHTC and your Computer
guide:
    category: Manage data
    tag:
        - htc
        - hpc
---

## Introduction
This guide shows how to transfer (upload/download) files between a local computer and CHTC's file systems. Two options are presented: the `scp` command line utility, and a file transfer program. Additionally, we present tarballs as a way to transfer multiple files easily.

{% capture content %}
- [Introduction](#introduction)
- [Before you transfer](#before-you-transfer)
- [Option 1: Transfer files with the `scp` command line utility](#option-1-transfer-files-with-the-scp-command-line-utility)
- [Option 2: Transfer files with a file transfer program](#option-2-transfer-files-with-a-file-transfer-program)
- [Transfer multiple files using tarballs](#transfer-multiple-files-using-tarballs)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Before you transfer

To transfer files to and from CHTC, you will need:
* Your username and hostname information for [logging in](connecting)
* The location on the file system of the files to be transferred (also referred to as the "path")
* The location on the file system where you'd like to transfer your files to.
* Basic skills in [navigating file systems](basic-shell-commands#navigate-directories)


## Option 1: Transfer files with the `scp` command line utility

On Mac, Linux, or modern Windows (10+) systems, you can use the \"Terminal\" application and
the `scp` command to copy files between your computer and CHTC servers.

**Upload files from your computer to CHTC**

First, open the \"Terminal\" application and navigate to the directory with the files or directories you want to transfer using the [`cd` command](basic-shell-commands#navigate-directories). Then, use this
command to copy these files to CHTC:

``` 
scp file username@hostname:/home/username
```
{:.term}

If you would like these files to end up in a different directory inside
your home directory, just add it to the path at the end of the command.

**Download files from CHTC to your computer**

Open the \"Terminal\" application. Do NOT log into CHTC. Instead,
navigate to where you want the files to go on your computer. Then, use
this command to copy these files there:

```
scp username@hostname:/home/username/file ./
```
{:.term}

For transferring many files, it will be easiest to create a compressed tarball
(.tar.gz file) of your files and transfer that instead of each file
individually.


## Option 2: Transfer files with a file transfer program

Windows and Mac users can also use special programs to help them
transfer files between their computers and CHTC. For Windows, we
recommend [WinSCP](https://winscp.net/eng/download.php). It requires the
same information as Putty (hostname, username), and once it\'s set up,
looks like this:

![](/images/WinSCPPortable.png)

The left window is a directory on your computer, the right window is
your home directory in CHTC. To move files between the two, simply use your mouse to drag
and drop the files.

Another popular file transfer utility available for Mac and Windows is [Cyberduck](https://cyberduck.io). See our [SSH programs](connecting#ssh-programs) table for a list of similar software.


## Transfer multiple files using tarballs

If you are transferring many files, we recommend compressing them
into a single file. Move all the files you need into a separate directory, and use the \"tar\" command to compress them:

``` 
tar czf data_files.tar.gz file_directory/
```
{:.term}

Afterwards, you may transfer the single tarball file as usual.

To untar files, use the tar command again:

```
tar xzf data_files.tar.gz
```
{:.term}

## Related pages
* [Log in to CHTC](connecting)
* [Basic shell commands](basic-shell-commands)
* [Transfer files between CHTC and ResearchDrive](transfer-data-researchdrive)
