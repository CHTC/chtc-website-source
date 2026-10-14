---
layout: guide
title: Transfer Files Between CHTC and ResearchDrive
guide:
  category: Manage data
  tag:
    - htc
    - hpc
description: 'You will need: Access to your PI''s ResearchDrive A CHTC account'
legacy_url: /uw-research-computing/transfer-data-researchdrive.html
---
## Introduction
This guide shows how to transfer (upload/download) files between CHTC's file systems and [ResearchDrive](https://it.wisc.edu/services/researchdrive/), a shared data storage service for research at UW Madison. The instructions in this guide may also work for accessing other data services on campus from CHTC that interface with the `smbclient` tool. For UWDF/ResearchDrive integration, [see this page](/uw-research-computing/htc-uwdf-researchdrive/).


<div class="uw-toc">
<p class="uw-toc-title">Table of Contents</p>

- [Introduction](#introduction)
- [Before you transfer](#before-you-transfer)
- [Transfer files](#transfer-files)
- [Transfer a batch of files](#transfer-a-batch-of-files)
- [Related pages](#related-pages)

</div>


## Before you transfer

You will need:
* Access to your PI's ResearchDrive
* A CHTC account

## Transfer files

To transfer data between ResearchDrive and CHTC, do the following: 

1. **Log in:** 
	1. If you are transferring files to or from a `/staging` directory, log in to `transfer.chtc.wisc.edu`. 
	2. If you are transferring files and or from your `/home` directory, log into your usual submit server (typically `ap2001.chtc.wisc.edu` or `ap2002.chtc.wisc.edu`). 
2. **Choose a folder:** Navigate to the folder in CHTC (`/staging` or `/home`) where you would like to transfer files. 
3. **Connect to ResearchDrive:** Run the following command to connect to ResearchDrive, filling in the username of 
your PI: 


    <div class="md-term">

    ```
    [alice@server]$ smbclient -k //research.drive.wisc.edu/PI-Name
    ```

    </div>


    Your prompt should change to look like this:


    <div class="md-term">

    ```
    smb: \> 
    ```

    </div>



    <div class="md-tip-header">

    > ### Note about NetIDs

    </div>


    <div class="md-tip">

    > If your CHTC account is not tied to your campus NetID or you are accessing a data 
    > storage service that doesn't use your NetID, you'll need to omit the `-k` flag above

    </div>


4. **Choose a folder, part 2:** If you type `ls` now, you'll see the files in ResearchDrive, not CHTC. 
Navigate through ResearchDrive (using `cd`) until you are at the folder where you would 
like to get or put files. 
5. **Move files:** To move files, you will use the `get` and `put` commands: 
    - To move files from CHTC to ResearchDrive, run: 


        <div class="md-term">

        ```
        smb: \> put filename
        ```

        </div>


    - To move files from ResearchDrive to CHTC, run: 


        <div class="md-term">

        ```
        smb: \> get filename
        ```

        </div>


6. **Finish:** Once you are done moving files, you can type `exit` to leave the connection to ResearchDrive. 

## Transfer a batch of files

The steps described above work well for transferring a single file, or tar archive of 
many files, at a time and is best for transferring a few files in a session. However, 
`smbclient` also provides options for transferring many individual files in a single command 
using the `*` wildcard character.

To transfer multiple files at once, first you must turn off the `smbclient` file transfer prompt, 
then use either `mget` or `mput` for your file transfer.

1. Follow steps 1-4 above.

1. **Turn off Prompting**. This turns off a prompt that appears for every file you want to download.


    <div class="md-term">

    ```
    smb: \> prompt
    ```

    </div>


1. **Move files**

    - **Download with `mget`**.
        The example below uses the wildcard character `*` to download a group of files that end with ".fastq.gz" to CHTC. 


        <div class="md-term">

        ```
        smb: \> mget *.fastq.gz
        ```

        </div>

 
    - **Upload with `mput`**.
        The example below uses the wildcard character `*` to upload a group of files that end with ".tar.gz" to CHTC. 


        <div class="md-term">

        ```
        smb: \> mput *.tar.gz
        ```

        </div>


## Related pages
* [Log in to CHTC](/uw-research-computing/connecting/)
* [Transfer files between CHTC and your Computer](/uw-research-computing/transfer-files-computer/)
* [Directly transfer files between ResearchDrive and your jobs](/uw-research-computing/htc-uwdf-researchdrive/)
