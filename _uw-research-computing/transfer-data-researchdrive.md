---
layout: guide
title: Transfer Files Between CHTC and ResearchDrive
guide:
    category: Manage data
    tag:
        - htc
        - hpc
---

## Introduction
This guide shows how to transfer (upload/download) files between CHTC's file systems and [ResearchDrive](https://it.wisc.edu/services/researchdrive/), a shared data storage service for research at UW Madison. The instructions in this guide may also work for accessing other data services on campus from CHTC; contact us if you would like to know more. 

{% capture content %}
- [Introduction](#introduction)
- [Before you transfer](#before-you-transfer)
- [Transfer Files](#transfer-files)
- [Transfer a Batch of Files](#transfer-a-batch-of-files)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Before you transfer

In order to follow the steps in this guide, you need access to a **ResearchDrive share**, either as PI or member of your PI's group, as well as a **CHTC account**. In what follows, 
we assume that you are transferring files to and from our HTC system, but you can 
use the same process to transfer files to and from the HPC cluster if you first log 
in to one of the HPC login nodes. 

## Transfer Files

To transfer data between ResearchDrive and CHTC, do the following: 

1. **Log in:** 
	1. If you are transferring files to or from a `/staging` directory, log in to `transfer.chtc.wisc.edu`. 
	2. If you are transferring files and or from your `/home` directory, log into your usual submit server (typically `ap2001.chtc.wisc.edu` or `ap2002.chtc.wisc.edu`). 
2. **Choose a folder:** Navigate to the folder in CHTC (`/staging` or `/home`) where you would like to transfer files. 
3. **Connect to ResearchDrive:** Run the following command to connect to ResearchDrive, filling in the username of 
your PI: 

    ```
    [alice@server]$ smbclient -k //research.drive.wisc.edu/PI-Name
    ```
    {:.term}

    Your prompt should change to look like this:

    ```
    smb: \> 
    ```
    {:.term}

    > ### Note about NetIDs
    {:.tip-header}
    > If your CHTC account is not tied to your campus NetID or you are accessing a data 
    > storage service that doesn't use your NetID, you'll need to omit the `-k` flag above
    {:.tip}

4. **Choose a folder, part 2:** If you type `ls` now, you'll see the files in ResearchDrive, not CHTC. 
Navigate through ResearchDrive (using `cd`) until you are at the folder where you would 
like to get or put files. 
5. **Move files:** To move files, you will use the `get` and `put` commands: 
    - To move files from CHTC to ResearchDrive, run: 

        ```
        smb: \> put filename
        ```
        {:.term}

    - To move files from ResearchDrive to CHTC, run: 

        ```
        smb: \> get filename
        ```
        {:.term}

6. **Finish:** Once you are done moving files, you can type `exit` to leave the connection to ResearchDrive. 

## Transfer a Batch of Files

The steps described above work well for transferring a single file, or tar archive of 
many files, at a time and is best for transferring a few files in a session. However, 
`smbclient` also provides options for transferring many individual files in a single command 
using the `*` wildcard character.

To transfer multiple files at once, first you must turn off the `smbclient` file transfer prompt, 
then use either `mget` or `mput` for your file transfer.

1. Follow steps 1-4 above.

1. **Turn off Prompting**. This turns off a prompt that appears for every file you want to download.

    ```
    smb: \> prompt
    ```
    {:.term}

1. **Move files**

    - **Download with `mget`**.
        The example below uses the wildcard character `*` to download a group of files that end with ".fastq.gz" to CHTC. 

        ```
        smb: \> mget *.fastq.gz
        ```
        {:.term}
 
    - **Upload with `mput`**.
        The example below uses the wildcard character `*` to upload a group of files that end with ".tar.gz" to CHTC. 

        ```
        smb: \> mput *.tar.gz
        ```
        {:.term}

## Related pages
* [Log in to CHTC](connecting)
* [Transfer files between CHTC and your Computer](transfer-files-computer)