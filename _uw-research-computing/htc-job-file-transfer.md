---
highlighter: none
layout: file_avail
title: Data Storage Locations on the HTC
guide:
    order: 1
    category: Handling Data in Jobs
    tag:
        - htc
---

{% capture content %}
- [Data Storage Locations](#data-storage-locations)
   * [/home](#home)
   * [/staging](#staging)
- [Transferring Data to Jobs with `transfer_input_files`](#transferring-data-to-jobs-with-transfer_input_files)
   * [Important Note: File Transfers and Caching with `osdf://`](#important-note-file-transfers-and-caching-with-osdf)
- [Transferring Data Back from Jobs to `/home` or `/staging`](#transferring-data-back-from-jobs-to-home-or-staging)
   * [Default Behavior for Transferring Output Files](#default-behavior-for-transferring-output-files)
   * [Specify Which Output Files to Transfer with `transfer_output_files` and `transfer_output_remaps`](#specify-which-output-files-to-transfer-with-transfer_output_files-and-transfer_output_remaps)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Data Storage Locations
The HTC system has two primary locations where users can place their files:
### /home
* The default location for files and job submission
* Efficiently handles many files
* Smaller input files (<100 MB) should be placed here

### /staging
* Expandable storage system but cannot efficiently handle many small (few MB or less) files
* Larger input files (>100 MB) should be placed here, including container images (.sif)

The data management mechanisms behind `/home` and `/staging` are different and are optimized to handle different file sizes and numbers of files. It's important to place your files in the correct location, as it will improve the speed and efficiency at which your data is handled and will help maintain the stability of the HTC filesystem.

> If you need a `/staging` directory, [request one here](quota-request).


## Transferring Data to Jobs with `transfer_input_files`

In the HTCondor submit file, `transfer_input_files` should always be used to tell HTCondor what files to transfer to each job, regardless of if that file originates from your `/home` or `/staging` directory. However, the syntax you use to tell HTCondor to fetch files from `/home` and `/staging` and transfer to your job will change depending on the file size.

| Input Sizes | File Location |  Submit File Syntax to Transfer to Jobs |
| ----------- | ----------- | ----------- | ----------- |
| 0 - 100 MB      | `/home`       | `transfer_input_files = input.txt`       |
| 100 MB - 30 GB   | `/staging`        | `transfer_input_files = osdf://chtc/staging/NetID/input.txt`        | 
| > 30 GB   | `/staging`        | `transfer_input_files = file:///staging/NetID/input.txt`        | 

Multiple input files and file transfer protocols can be specified and delimited by commas, as shown below:

```
# My job submit file

transfer_input_files = file1, osdf://chtc/staging/username/file2, file:///staging/username/file3, dir1, dir2/

... other submit file details ...
```
{:.sub}

Ensure you are using the correct file transfer protocol for efficiency. Failure to use the right protocol can result in slow file transfers or overloading the system.

### Important Note: File Transfers and Caching with `osdf://`
The `osdf://` file transfer protocol uses a [caching](https://en.wikipedia.org/wiki/Cache_(computing)) mechanism for input files to reduce file transfers over the network. This can affect users who refer to input files that are frequently modified.

*If you are changing the contents of the input files frequently, you should rename the file or change its path to ensure the new version is transferred.*

## Transferring Data Back from Jobs to `/home` or `/staging`

### Default Behavior for Transferring Output Files
When a job completes, by default, HTCondor will return **newly created or edited files only in top-level directory** back to your `/home` directory. **Files in subdirectories are *not* transferred.** Ensure that the files you want are in the top-level directory by moving them or [creating tarballs](transfer-files-computer#c-transferring-multiple-files).

### Specify Which Output Files to Transfer with `transfer_output_files` and `transfer_output_remaps`
If you don't want to transfer all files but only *specific files*, in your HTCondor submit file, use
```
transfer_output_files = file1.txt, file2.txt
```
{:.sub}

To transfer a file or folder back to `/staging`, you will need an additional line in your HTCondor submit file:
```
transfer_output_remaps = "output1.txt = file:///staging/NetID/output1.txt"
```
{:.sub}

where `output1.txt` is the name of the output file or folder you would like transferred back to a `/staging` directory. Ensure you have the right file transfer syntax (`osdf://` or `file:///` depending on the anticipated file size).

If you have multiple files or folders to transfer back to `/staging`, use a semicolon (;) to separate each object: 
```
transfer_output_remaps = "output1.txt = file:///staging/NetID/output1.txt; output2.txt = file:///staging/NetID/output2.txt"
```
{:.sub}

Make sure to only include one set of quotation marks that wraps around the information you are feeding to `transfer_output_remaps`. 

## Related pages
- [Managing Large Data in HTC Jobs](/uw-research-computing/file-avail-largedata)
- [Transfer files between CHTC and your computer](/uw-research-computing/transfer-files-computer)
- [Transfer files between CHTC and ResearchDrive](/uw-research-computing/transfer-data-researchdrive)