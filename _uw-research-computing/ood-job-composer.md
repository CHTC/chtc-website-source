---
highlighter: none
layout: guide
title: Submit jobs and create templates with the Job Composer
alt_title: Submit jobs and create templates with the Job Composer
guide:
    category: Submit jobs
    tag:
        - hpc
---

## Introduction

This guide shows how to use Open OnDemand's Job Composer to submit jobs and create job templates.

{% capture content %}
- [Introduction](#introduction)
- [Before you start](#before-you-start)
- [Create and submit a new job](#create-and-submit-a-new-job)
- [Save your job as a template](#save-your-job-as-a-template)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

> ### ⚠️ Be aware of Open OnDemand's working directories
{:.tip-header}
> ***All jobs*** submitted through the Job Composer are saved in a new working subdirectory under:<br> `/scratch/$USER/ondemand/projects/default`<br>
>
> All user-created templates are saved under:<br> `/scratch/$USER/ondemand/templates`
>
> Currently, there is no way to change these locations.
{:.tip}

## Before you start

You will need the following:

* Path to a directory containing:
    * Job submission script
    * Other supporting files

## Create and submit a new job

1. In the Job Composer, click the **+New Job** dropdown menu.
1. Select **From Specified Path**.
1. You will see a new page. Fill each field with your job information.
    * **Source Path**. Path to the directory containing your job submission script and supporting files.
    * **Name**. Name for your job.
    * **Script name**. File name for your job submission script.
    * **Cluster**. Select *CHTC Spark Cluster*.
    * **Account**. You may leave this blank.
1. Click **Save**.
1. Review the details of your job (located on the right-hand side). If needed, use the editor to edit your submit script.
1. When you are ready to submit your job, click the green **▶ Submit** button.

## Save your job as a template

You can save jobs submitted from the Job Composer as a template, so that you can easily modify and re-submit similar jobs.

1. In the *Job* view, select a job to use as a template.
1. Click **☆ Create Template**.
1. Fill out each field.
1. Click **Save**. You will be redirected to the *Templates* view of the Job Composer.
1. Edit template files. Delete any extraneous outputs that should not be part of the template.

Notes:
* The `manifest.yml` file describes information about your template.
* When you create a new job from the template, it copies all contents from the template directory (except `manifest.yml`) to the job directory.

## Related pages
* [Open OnDemand Overview](ood)