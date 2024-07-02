---
highlighter: none
layout: guide
title: Known Issues
guide:
    order: 3
    category: Troubleshooting
    tag:
        - htc
---

{% capture content %}
1. [General](#general)  
2. [Containers](#containers)
3. [GPUs](#gpus)
{% endcapture %}
{% include /components/directory.html title="Sections" %}

# General
### When submitting a job, it doesn't run / goes on hold and shows the error "Job credentials are not available".
#### Cause:
This is a complicated bug that can strike randomly. We're working on a fix.
#### Solution:
To work around this issue, run the following command on the access point before resubmitting the job.
```
echo | condor_store_cred add-oauth -s scitokens -i -
```
{:.term}

# Containers
### When building an Apptainer, "apt" commands in the %post block fail to run.
#### Example error message:
```
Couldn't create temporary file /tmp/apt.conf.9vQdLs for passing config to apt-key
```
{:.term}
#### Cause:
The container needs global read/write permissions in order to update or install packages using the `apt` command.
#### Solution:
Add `chmod 777 /tmp` to the front of your %post block. See the example below:
```
Bootstrap: docker
From: ubuntu:22.04

%post
    chmod 777 /tmp
    apt-get update -y
```
We also recommend using the `-y` option to prevent installation from hanging due to interactive prompts.

### When attempting to run a Docker container, it fails with the error message "[FATAL tini (7)] exec ./myExecutable.sh failed: Exec format error".
#### Cause:
The Docker container is likely built on an Apple computer using an ARM processor, which is incompatible with Linux machines.
#### Solution:
To resolve this, when building your Docker container, use the command:
```
docker build --platform linux/amd64 .
```
{:.term}

# GPUs
### My GPU job has been in the queue for a long period of time and is not starting.
#### Cause:
Jobs default to using CentOS9, but most GPU nodes are currently running CentOS8.
#### Solution:
To your submit file, add the following line and resubmit:
```
requirements = (OpSysMajorVer > 7)
```