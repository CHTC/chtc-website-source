---
layout: guide
title: Transfer Files between CHTC and your Computer
guide:
  category: Manage data
  tag:
    - htc
    - hpc
description: >-
  To transfer files to and from CHTC, you will need: Your username and hostname
  information for logging in The location on the file system of the files to be
  transferred (also referred to as the…
legacy_url: /uw-research-computing/transfer-files-computer.html
---
## Introduction
This guide shows how to transfer (upload/download) files between a local computer and CHTC's file systems. Two options are presented: the `scp` command line utility, and a file transfer program. Additionally, we present tarballs as a way to transfer multiple files easily.


<div class="uw-toc">
<p class="uw-toc-title">Table of Contents</p>

- [Introduction](#introduction)
- [Before you transfer](#before-you-transfer)
- [Option 1: Transfer files with the `scp` command line utility](#option-1-transfer-files-with-the-scp-command-line-utility)
- [Option 2: Transfer files with a file transfer program](#option-2-transfer-files-with-a-file-transfer-program)
- [Transfer multiple files using tarballs](#transfer-multiple-files-using-tarballs)
- [Related pages](#related-pages)

</div>


## Before you transfer

To transfer files to and from CHTC, you will need:
* Your username and hostname information for [logging in](/uw-research-computing/connecting/)
* The location on the file system of the files to be transferred (also referred to as the "path")
* The location on the file system where you'd like to transfer your files to.
* Basic skills in [navigating file systems](/uw-research-computing/basic-shell-commands/#navigate-directories)


## Option 1: Transfer files with the `scp` command line utility

On Mac, Linux, or modern Windows (10+) systems, you can use the \"Terminal\" application and
the `scp` command to copy files between your computer and CHTC servers.

### Upload files from your computer to CHTC

First, open the "Terminal" application and navigate to the directory with the files or directories you want to transfer using the `cd` command or opening it from your computer's file browser.


<div class="md-tip-header">

> ### 🎞️ Demo: Open a folder on the terminal from File Explorer

</div>


<div class="md-tip">

> Right-click the folder background and select "Open in Terminal". Similar methods are available on [MacOS](https://support.apple.com/guide/terminal/open-new-terminal-windows-and-tabs-trmlb20c7888/mac) and Linux computers.
> <iframe width="560" height="315" src="https://www.youtube.com/embed/FIkTC46fMbo?si=KOHXBOp2YKsSflIm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

</div>


Then, use this command to copy these files to CHTC:


<div class="md-term">

``` 
scp file username@hostname:/home/username
```

</div>


If you would like these files to end up in a different directory inside
your home directory, just add it to the path at the end of the command.

<p style="text-align:center"><img src="/images/scp01.png" width=800px alt="The scp command explained. The first argument is the source, and the second argument is the destination."></p>
<caption>Diagram of the scp command. Replace the source with the name of your file, and destination with where you'd like the file to be copied.</caption>


<div class="md-tip-header">

> ### 🎞️ Demo: Upload a file to CHTC with the scp command

</div>


<div class="md-tip">

> <iframe width="560" height="315" src="https://www.youtube.com/embed/YCs40UW6rSo?si=aaXDrh4ERy4EJBn_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

</div>


### Download files from CHTC to your computer

Open the "Terminal" application on your computer. Do NOT log into CHTC. Instead,
navigate to where you want the files to go on your computer. Then, use
this command to copy these files there:


<div class="md-term">

```
scp username@hostname:/home/username/file ./
```

</div>



<div class="md-tip-header">

> ### 🎞️ Demo: Download a file from CHTC with the scp command

</div>


<div class="md-tip">

> <iframe width="560" height="315" src="https://www.youtube.com/embed/4Ri1w1f7u2g?si=wNIu6WXZe8I3t7Dm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

</div>


For transferring many files, it will be easiest to [create a compressed tarball (.tar.gz file)](#transfer-multiple-files-using-tarballs) of your files and transfer that instead of each file individually.


## Option 2: Transfer files with a file transfer program

Users can download programs with a graphical user interface to help them
transfer files between their computers and CHTC. For Windows, we
recommend [WinSCP](https://winscp.net/eng/download.php). It requires the
same information as Putty (hostname, username), and once it\'s set up,
looks like this:

![](/images/WinSCPPortable.png)

The left window is a directory on your computer, the right window is
your home directory in CHTC. To move files between the two, simply use your mouse to drag
and drop the files.

Another popular file transfer utility available for Mac and Windows is [Cyberduck](https://cyberduck.io). See our [SSH programs](/uw-research-computing/connecting/#ssh-programs) table for a list of similar software.


## Transfer multiple files using tarballs

If you are transferring many files and/or large data, we recommend compressing them
into a single file. Move all the files you need into a separate directory, and use the \"tar\" command to compress them:


<div class="md-term">

``` 
tar -czf data_files.tar.gz file_directory/
```

</div>


<p style="text-align:center"><img src="/images/tar01.png" width=800px alt="The tar compression command explained. The first argument is the tarball to be created, and the second argument is the directory or list of files to be compressed."></p>
<caption>Diagram of the tar compression command. The first argument (blue) is the name of the tar.gz to be created, and the second argument (green) is the directory of files to be compressed.</caption><br>

Afterwards, you may transfer the single tarball file as usual.

To untar files, use the tar command again:


<div class="md-term">

```
tar -xzf data_files.tar.gz
```

</div>



<div class="md-tip-header">

> ### 🎞️ Demo: Tar and upload multiple files to CHTC

</div>


<div class="md-tip">

> <iframe width="560" height="315" src="https://www.youtube.com/embed/2s29VCayOEE?si=tTqf-hegZXWchryd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

</div>


## Related pages
* [Log in to CHTC](/uw-research-computing/connecting/)
* [Basic shell commands](/uw-research-computing/basic-shell-commands/)
* [Transfer files between CHTC and ResearchDrive](/uw-research-computing/transfer-data-researchdrive/)
