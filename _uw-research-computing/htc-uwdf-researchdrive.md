---
highlighter: none
layout: guide
title: Directly transfer files between ResearchDrive and your jobs
guide:
    category: Manage data
    tag:
        - htc
---

## Introduction

CHTC is launching a pilot program in which users can directly transfer files between ResearchDrive and their jobs. This can remove the additional step of uploading or downloading data to and from CHTC data storage locations.

> ### ⚗️ UWDF/ResearchDrive Pilot Program
{:.tip-header}

> Currently the UWDF/ResearchDrive feature is in its pilot phase and is not yet widely available to CHTC users. This file transfer feature is still under testing and may have occasional issues or bugs.
>
> If you are interested in testing this feature, contact us at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu).
{:.tip}

{% capture content %}
- [Introduction](#introduction)
- [Overview](#overview)
- [Is UWDF/ResearchDrive right for me?](#is-uwdfresearchdrive-right-for-me)
   * [Other considerations](#other-considerations)
- [Enable CHTC integration for your PI's ResearchDrive](#enable-chtc-integration-for-your-pis-researchdrive)
- [Transfer input files from ResearchDrive to jobs](#transfer-input-files-from-researchdrive-to-jobs)
- [Transfer output files from jobs to ResearchDrive](#transfer-output-files-from-jobs-to-researchdrive)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Overview

Users can transfer files directly between [ResearchDrive](https://it.wisc.edu/services/researchdrive/) and their jobs by using the UW Data Federation (UWDF) and the [Pelican Platform](https://docs.pelicanplatform.org/about-pelican) (which also powers the `osdf:///` file transfer plugin). This integration can remove the additional step of uploading or downloading data to and from CHTC data storage locations, saving time and disk space.

In this way, ResearchDrive behaves as a "staging" location for data to be used in jobs.

<p style="text-align:center"><img src="/images/uwdf-researchdrive-diagram.png" width=800px alt="A diagram illustrating data transfer between CHTC data spaces, ResearchDrive, and Execution Points (where jobs are run)."></p>
<caption>
    A diagram illustrating data transfer between CHTC data spaces, ResearchDrive, and Execution Points (where jobs are run).
</caption>

## Is UWDF/ResearchDrive right for me?

This feature is ideal for researchers who:
* Have existing access to their PI's ResearchDrive
* Need to run computations with data already on ResearchDrive
* Work with large datasets
* Need to transfer the same data to multiple jobs

### Other considerations
* Restricted ResearchDrives are ineligible for this service.
* CHTC will only be able to access files within a “CHTC” subdirectory within the PI's ResearchDrive. Any files outside of this directory are inaccessible to our systems.
* ResearchDrive has a hard limit of 25 TB for its free service. Your PI can pay to have the cap increased but they will only be charged for the amount over the 25 TB that is used.
* The Pelican Platform uses a [caching](https://en.wikipedia.org/wiki/Cache_(computing)) mechanism for input files to reduce file transfers over the network. The caching mechanism enables faster transfers for frequently used files/containers; however, older versions of frequently modified files may be transferred instead of the latest version. **If you are changing the contents of the input files frequently, you should rename the file or change its path to ensure the new version is transferred.**

## Enable CHTC integration for your PI's ResearchDrive

To use this feature, we will need to integrate your PI's ResearchDrive with CHTC systems. The PI should send an email to us at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) giving permission for this integration, as well as a list of CHTC users who are allowed to use this integration. Once we have this permission, we will complete the integration process within 3-5 business days. You will be notified when this integration is ready to use.

## Transfer input files from ResearchDrive to jobs

Any file you place in the "CHTC" directory in the top-level directory of your PI's ResearchDrive is accessible to your CHTC jobs. Your jobs are unable to access any data outside of this directory.

To transfer input files from ResearchDrive to your jobs, specify input files with the `pelican://` plugin:

```
transfer_input_files = pelican://chtc.wisc.edu/researchdrive/<PI Netid>/CHTC/inputfile1.txt
```

## Transfer output files from jobs to ResearchDrive

To transfer output files from jobs to ResearchDrive, you will need to use `transfer_output_remaps` or `output_destination` with the `pelican://` plugin in your submit file.

For example, if you specify which output files to transfer:

```
transfer_output_files = outputfile1.txt, outputfile2.txt, outputfile3.txt
```

You can use `transfer_output_remaps` to place files in different locations:

```
transfer_output_remaps = "outputfile1.txt = pelIican://chtc.wisc.edu/researchdrive/<PI NetID>/CHTC/outputfile1.txt; outputfile2.txt = osdf:///chtc/staging/<NetID>/outputfile2.txt"
```

The example above remaps the output files such that only `outputfile1.txt` is placed in ResearchDrive, `outputfile2.txt` is placed in `/staging`, and `outputfile3.txt` is placed in the submit directory on `/home`.

If you want to remap ALL of your outputs to ResearchDrive, instead of `transfer_output_remaps`, use `output_destination`:

```
output_destination = pelican://chtc.wisc.edu/researchdrive/<PI Netid>/CHTC/<path to subdirectory>
```

For more information about transferring output files using HTCondor, [read our guide](/uw-research-computing/htc-job-file-transfer#transfer-output-data-from-jobs).

> ## 💡 Tip: Define the ResearchDrive path as a variable
{:.tip-header}

> Because the Pelican plugin and ResearchDrive path is lengthy, it's useful to define the path as a variable. This variable can then be used in `transfer_input_files`, `transfer_output_files`, and `output_destination` with the `$(variable)` syntax.
>
> For example:
> 
> ```
> ResearchDrive = pelican://chtc.wisc.edu/researchdrive/<PI NetID>/CHTC
> 
> transfer_input_files = $(ResearchDrive)/inputfile1.txt
> ```
{:.tip}

## Related pages
- [Use and transfer data in jobs on the HTC system](/uw-research-computing/htc-job-file-transfer)
- [Manage large data in HTC jobs](/uw-research-computing/file-avail-largedata)
- [Transfer files between CHTC and ResearchDrive](/uw-research-computing/transfer-data-researchdrive)