---
highlighter: none
layout: default
title: Transferring Files Between CHTC and ResearchDrive
---

UW Madison provides a shared data storage for research called [ResearchDrive](https://it.wisc.edu/services/researchdrive/). It 
is possible to transfer files directly between ResearchDrive and CHTC's large data system. The 
instructions in this guide may also work for accessing other data services on campus; contact us if you 
would like to know more.

## A. Pre-Requisites

In order to follow the steps in this guide, you need: 
1. Access to a ResearchDrive share, either as PI or member of your PI's group. 
2. Access to CHTC's "transfer" server, `transfer.chtc.wisc.edu`. 

The instructions provided here are for transferring large input and output files to 
and from CHTC's large data location on the HTC System, `/staging/`. However, it is also 
possible to transfer files directly between a submit server `/home` directory and ResearchDrive 
using the same steps. 

## B. Transferring Files

To transfer data between ResearchDrive and `/staging`, do the following: 

1. **Log in:** Log into the transfer server, `transfer.chtc.wisc.edu`. 
2. **Choose a folder:** Navigate to the folder in `/staging` where you would like to get or put files. 
3. **Connect to ResearchDrive:** Run the following command to connect to ResearchDrive, filling in the username of 
your PI: 
    ```
    [alice@transfer]$ smbclient -k //research.drive.wisc.edu/PI-Name
    ```
    {: .term}
    Your prompt should change to look like this:
    ```
    smb: \> 
    ```
    {: .term}
    > ## Note about NetIDs
    > If your CHTC account is not tied to your campus NetID or you are accessing a data 
    > storage service that doesn't use your NetID, you'll need to omit the `-k` flag above
4. **Choose a folder, part 2:** If you type `ls` now, you'll see the files in ResearchDrive, not CHTC. 
Navigate through ResearchDrive (using `cd`) until you are at the folder where you would 
like to get or put files. 
5. **Move files:** To move files, you will use the `get` and `put` commands: 
    - To move files from CHTC to ResearchDrive, run: 
        ```
        smb: \> put filename
        ```
        {: .term}
    - To move files from ResearchDrive to CHTC, run: 
        ```
        smb: \> get filename
        ```
        {: .term}
6. **Finish:** Once you are done moving files, you can type `exit` to leave the connection to ResearchDrive. 

## Transferring A Batch of Files

The steps described above work well for transferring a single file, or tar archive of 
many files, at a time and is best for transferring a few files in a session. However 
`smbclient` also provides options for transferring many individual files in a single command 
using the `*` wildcard character.

To transfer multiple files at once, first you must turn off the `smbclient` file transfer prompt, 
then use either `mget` or `mput` for your file transfer. For example, if you have multiple `fastq.gz` 
to transfer to `/staging`:

1. **Log in:** Log into the transfer server, `transfer.chtc.wisc.edu`. 
2. **Choose a folder:** Navigate to the folder in `/staging` where you would like transfer your files to. 
3. **Connect to ResearchDrive:** Run the following command to connect to ResearchDrive, filling in the username of 
your PI: 
    ```
    [alice@transfer]$ smbclient -k //research.drive.wisc.edu/PI-Name
    ```
    {: .term}
4. **Navigate to appropriate ResearchDrive directory**
    ```
    smb: \> cd path/to/files
    ```
    {: .term}
5. **Turn of Prompting**
    ```
    smb: \> prompt
    ```
    {: .term}
6. **Use `mget` instead of `get`**
    ```
    smb: \> mget *.fastq.gz
    ```
    {: .term}
    
As another example, use `smbclient` to transfer multiple `tar.gz` output files 
after your jobs complete:

1. **Log in:** Log into the transfer server, `transfer.chtc.wisc.edu`. 
2. **Choose a folder:** Navigate to the appropriate directory in `/staging` where your output is located.
3. **Connect to ResearchDrive:** Run the following command to connect to ResearchDrive, filling in the username of 
your PI: 
    ```
    [alice@transfer]$ smbclient -k //research.drive.wisc.edu/PI-Name
    ```
    {: .term}
4. **Navigate to appropriate ResearchDrive directory**
    ```
    smb: \> cd path/to/directory
    ```
    {: .term}
5. **Turn off Prompting**
    ```
    smb: \> prompt
    ```
    {: .term}
6. **Use `mput` instead of `put`**
    ```
    smb: \> mput *.tar.gz
    ```
    {: .term}
