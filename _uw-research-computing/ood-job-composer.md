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

You will need the **path to a directory** containing:
* Your job submission script
* Other supporting files

For example, the path `/scratch/netid/ase` points to a directory with the submit script `submit-N2Cu.sh` and a Python script used in the job, `N2Cu.py`.
```
/scratch/netid/ase
├── N2Cu.py
└── submit-N2Cu.sh
```
{:.term}

> ### 💡 Tip: Remove extra files
{:.tip-header}
> Job Composer will **copy the entire directory** to a new location, so you should remove any extra files that aren't needed to start your job.
{:.tip}

## Create and submit a new job

1. In the navigation bar, click **Jobs** then **Job Composer**.
    <p style="text-align:center; margin:10px"><img src="/images/uw-research-computing/ood-job-composer-01.png" style="border: 1px solid #000; max-width: 500px; max-height: 300px"></p>
1. In the Job Composer, click the **+New Job** dropdown menu. Select **From Specified Path**.
    <p style="text-align:center; margin:10px"><img src="/images/uw-research-computing/ood-job-composer-02.png" style="border: 1px solid #000; max-width: 500px; max-height: 300px"></p>
1. You will see a new page. Fill each field with your job information.
    * **Source Path**. Path to the directory containing your job submission script and supporting files.
    * **Name**. Name for your job.
    * **Script name**. File name for your job submission script.
    * **Cluster**. Select *CHTC Spark Cluster*.
    * **Account**. Leave this blank.
    <p style="text-align:center; margin:10px"><img src="/images/uw-research-computing/ood-job-composer-03.png" style="border: 1px solid #000; max-width: 500px; max-height: 500px"></p>
    Click **Save**.
1. Review the details of your job (located on the right-hand side). If needed, use the editor to edit your submit script.
    <p style="text-align:center; margin:10px"><img src="/images/uw-research-computing/ood-job-composer-05.png" style="border: 1px solid #000; max-width: 500px; max-height: 300px"></p>
1. When you are ready to submit your job, click the green **▶ Submit** button.

## Save your job as a template

You can save jobs submitted from the Job Composer as a template, so that you can easily modify and re-submit similar jobs.

1. In the *Job* view, select a job to use as a template.
1. Click **☆ Create Template**.
    <p style="text-align:center; margin:10px"><img src="/images/uw-research-computing/ood-job-composer-06.png" style="border: 1px solid #000; max-width: 500px; max-height: 300px"></p>
1. Fill out each field.
    <p style="text-align:center; margin:10px"><img src="/images/uw-research-computing/ood-job-composer-07.png" style="border: 1px solid #000; max-width: 500px; max-height: 500px"></p>
1. Click **Save**. You will be redirected to the *Templates* view of the Job Composer.
1. Edit template files. Delete any extra files that should not be part of the template, such as standard output, error, or other output files. To delete, click the **Open Dir** button.
    <p style="text-align:center; margin:10px"><img src="/images/uw-research-computing/ood-job-composer-08.png" style="border: 1px solid #000; max-width: 500px; max-height: 300px"></p>
1. In the file browser, select and delete extra files.
    <p style="text-align:center; margin:10px"><img src="/images/uw-research-computing/ood-job-composer-09.png" style="border: 1px solid #000; max-width: 500px; max-height: 300px"></p>
1. Now you can submit a job with your template! From the *Template* view, select your new template and click **Create New Job**.
    <p style="text-align:center; margin:10px"><img src="/images/uw-research-computing/ood-job-composer-10.png" style="border: 1px solid #000; max-width: 500px; max-height: 300px"></p>
    This creates a new directory in `/scratch/$USER/ondemand/projects/default`, from which you can use the file browser/text editor to modify files before you submit.


### Notes
* The `manifest.yml` file describes information about your template. You can edit this manually in the text editor.
* When you create a new job from the template, it copies all contents from the template directory (except `manifest.yml`) to the job directory.

## Related pages
* [Open OnDemand Overview](ood)