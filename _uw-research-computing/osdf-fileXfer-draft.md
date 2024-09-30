---
highlighter: none
layout: guide
title: HTC Data Storage Locations
guide:
    order: 4
    category: Handling Data in Jobs
    tag:
        - htc
---

{% capture content %}
- [Data Storage Locations](#data-storage-locations)
- [Transfer Data to Jobs](#transfer-data-to-jobs)
- [Transfer Data Back from Jobs to `/home` or `/staging`](#transfer-data-back-from-jobs-to-home-or-staging)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Data Storage Locations
The HTC system has two primary locations where users can store files: `/home` and `/staging`.

The data management mechanisms behind `/home` and `/staging` that are different and are optimized to handle different file sizes. `/home` is more efficient at managing small files, while `/staging` is more efficient at managing larger files. It's important to place your files in the correct location, as it will improve the speed and efficiency at which your data is handled and will help maintain the stability of the HTC filesystem. 


## Transfer Data to Jobs
The HTCondor submit file `transfer_input_files` line should always be used to tell HTCondor what files to transfer to each job, regardless of if that file originates from your `/home` or `/staging` directory. However, the syntax you use to tell HTCondor to fetch files from `/home` and `/staging` and transfer to your running job will change:


| Input Sizes | File Location |  Submit File Syntax to Transfer to Jobs |
| ----------- | ----------- | ----------- | ----------- |
| 0-500 MB      | /home       | `transfer_input_files = input.txt`       |
| 500-10GB   | /staging        | `transfer_input_files = osdf:///chtc/staging/NetID/input.txt`        | 
| 10GB +   | /staging        | `transfer_input_files = file:///staging/NetID/input.txt`        | 

***What's the situation for osdf:/// or file:///? If we are going to leave this as-is, we will probably need to explain why there's a difference.


## Transfer Data Back from Jobs to `/home` or `/staging`

When a job completes, by default, HTCondor will return newly created or edited files on the top level directory back to your `/home` directory. Files in subdirectories are *not* transferred. Ensure that the files you want are in the top level directory by moving them or creating tarballs.

If you don't want to transfer all files but only *specific files*, in your HTCondor submit file, use
```
transfer_output_files = file1.txt, file2.txt
```
{:.sub}

To transfer files or folders back to `/staging`, in your HTCondor submit file, use 
```
transfer_output_remaps = "output1.txt = file:///staging/NetID/output1.txt"
```
{:.sub}
where `output1.txt` is the name of the output file or folder you would like transfered back to a `/staging` directory. 

If you have more than one file or folder to transfer back to `/staging`, use a semicolon (;) to seperate multiple files for HTCondor to transfer back like so: 
```
transfer_output_remaps = "output1.txt = file:///staging/NetID/output1.txt; output2.txt = file:///staging/NetID/output2.txt"
```
{:.sub}

Make sure to only include one set of quotation marks that wraps around the information you are feeding to `transfer_output_remaps`. 

## Related pages
- [Managing Large Data in HTC Jobs](/uw-research-computing/file-avail-largedata)
- [Transfer files between CHTC and your computer](/uw-research-computing/transfer-files-computer)
- [Transfer files between CHTC and ResearchDrive](/uw-research-computing/transfer-data-researchdrive)