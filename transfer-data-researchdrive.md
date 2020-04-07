---
highlighter: none
layout: default
title: Transferring Files Between CHTC and Research Drive
---

UW Madison provides a shared data storage for research called [ResearchDrive](https://it.wisc.edu/services/researchdrive/). It 
is possible to transfer files directly between Research Drive and CHTC's HTC large data system. 

## A. Pre-Requisites

In order to follow the steps in this guide, you need: 
1. Access to a Research Drive share, either as PI or member of your PI's group. 
2. Access to CHTC's "transfer" server, `transfer.chtc.wisc.edu`. 

Note that, for now, these instructions are mainly aimed at people transferring files to 
and from CHTC's large data location on the HTC System, `/staging/`. In the future, it may be possible to 
transfer files directly between a submit server `/home` directory and Research Drive. 

## B. Transferring Files

To transfer data between Research Drive and `/staging`, do the following: 

1. **Log in:** Log into the transfer server, `transfer.chtc.wisc.edu`. 
2. **Choose a folder:** Navigate to the folder in `/staging` where you would like to get or put files. 
3. **Connect to Research Drive:** Run the following command to connect to Research Drive, filling in the username of 
your PI: 
    ```
    [alice@transfer]$ smbclient //research.drive.wisc.edu/PI-Name
    ```
    {: .term}
    This should then ask for your password for your Wisc ID account. After entering it, your prompt should change to look like this: 
    ```
    smb: \> 
    ```
    {: .term}
4. **Choose a folder, part 2:** If you type `ls` now, you'll see the files in Research Drive, not CHTC. 
Navigate through Research Drive (using `cd`) until you are at the folder where you would 
like to get or put files. 
5. **Move files:** To move files, you will use the `get` and `put` commands: 
    - To move files from CHTC to Research Drive, run: 
        ```
        smb: \> put filename
        ```
        {: .term}
    - To move files from Research Drive to CHTC, run: 
        ```
        smb: \> get filename
        ```
        {: .term}
6. **Finish:** Once you are done moving files, you can type `exit` to leave the connection to Research Drive. 
