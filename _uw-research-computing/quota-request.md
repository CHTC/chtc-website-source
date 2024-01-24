---
layout: guide
title: Request a Quota Change
alt_title: Request a Quota Change
---

To request a change in quota(s) for data storage locations on CHTC systems, please fill out the form below.
This form applies to the following locations for both individual and shared (group) directories:

  {:.gtable}
  | Location | Purpose | More Information |
  | --- | --- | --- |
  | HTC `/home` | For files less than 1 GB for jobs on the HTC system | [Checking Disk Quota and Usage](check-quota.md) |
  | HTC `/staging` | For files greater than 1 GB for jobs on the HTC system | [Staging](file-avail-largedata.md) |
  | HPC `/home` | For repeatedly used files for jobs on the HPC system | [HPC Data Storage and Management](hpc-overview.md#data-storage-and-management) |
  | HPC `/scratch` | For working data for jobs on the HPC system | [HPC Data Storage and Management](hpc-overview.md#data-storage-and-management) |

For other locations, please email us at [chtc@cs.wisc.edu](Mailto:chtc@cs.wisc.edu). 
Remember, **CHTC data locations are not for long-term storage and are NOT backed up**.
Please review our data policies on the [Policies and Expectations for Users](user-expectations.html#data-policies) page.

## How to Check Your Quotas

The form asks for the current quotas of the folders you wish to change.
For individual directories, your quotas are printed on login.
For group directories at HTC `/staging`, HPC `/home`, HPC `/scratch`, you can retrieve your quotas using the command

```
get_quotas /path/to/group/directory
```

## Quota Request Form

The following link leads to a Qualtrics form that we use for requesting quota changes.

<div class="d-flex mb-3">
	<div class="p-3 m-auto">
		<a class="btn btn-primary" href="https://uwmadison.co1.qualtrics.com/jfe/form/SV_0JMj2a83dHcwX5k">Request a Quota Change</a>
	</div>
</div>

If you do not receive an automated email from chtc@cs.wisc.edu within a few hours of completing the form,
 OR if you do not receive a response from a human within two business days (M-F), please email [chtc@cs.wisc.edu](Mailto:chtc@cs.wisc.edu).
 
