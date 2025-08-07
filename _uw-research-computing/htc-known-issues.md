---
highlighter: none
layout: guide
title: Known Issues on the HTC
guide:
    category: Troubleshooting
    tag:
        - htc
---

This page documents some common and known issues encountered on the HTC system. While this page can be beneficial in troubleshooting, it does not contain a comprehensive list of errors.

Visit our [Get Help](get-help) page to find more resources for troubleshooting.

{% capture content %}
   * [[General] When submitting a job, it doesn't run / goes on hold and shows the error "Job credentials are not available".](#general-when-submitting-a-job-it-doesnt-run-goes-on-hold-and-shows-the-error-job-credentials-are-not-available)
   * [[General] My job exits with an "Illegal instructions" error.](#general-my-job-exits-with-an-illegal-instructions-error)
   * [[General] I used generative AI to create my submit file and the job is stuck on "Idle".](#general-i-used-generative-ai-to-create-my-submit-file-and-the-job-is-stuck-on-idle)
   * [[Container] When building an Apptainer, "apt" commands in the %post block fail to run.](#container-when-building-an-apptainer-apt-commands-in-the-post-block-fail-to-run)
   * [[Container] When attempting to run a Docker container, it fails with the error message "[FATAL tini (7)] exec ./myExecutable.sh failed: Exec format error".](#container-when-attempting-to-run-a-docker-container-it-fails-with-the-error-message-fatal-tini-7-exec-myexecutablesh-failed-exec-format-error)
   * [[Container] My interactive Apptainer job is failing with the error message, "Can't open master pty Bad file descriptor".](#container-my-interactive-apptainer-job-is-failing-with-the-error-message-cant-open-master-pty-bad-file-descriptor)
   * [[GPU] My GPU job has been in the queue for a long period of time and is not starting.](#gpu-my-gpu-job-has-been-in-the-queue-for-a-long-period-of-time-and-is-not-starting)
   * [[General, Python] My job has an error that mentions `/home/netid/`.](#general-python-my-job-has-an-error-that-mentions-homenetid)
- [Can't find your issue?](#cant-find-your-issue)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}


<hr width="100%" size="2">

<h3 style="color:#c5050c" id="general-when-submitting-a-job-it-doesnt-run-goes-on-hold-and-shows-the-error-job-credentials-are-not-available">[General] When submitting a job, it doesn't run / goes on hold and shows the error "Job credentials are not available".</h3>

#### Cause:
This is a complicated bug that can strike randomly. We're working on a fix.
#### Solution:
To work around this issue, run the following command on the access point before resubmitting the job.
```
echo | condor_store_cred add-oauth -s scitokens -i -
```
{:.term}

<hr width="100%" size="2">

<h3 style="color:#c5050c" id="#general-my-job-exits-with-an-illegal-instructions-error">[General] My job exits with an "Illegal instructions" error.</h3>

#### Cause:
The instructions for communicating with the processor does not match between software and hardware.
#### Solution:
In the submit file, try adding **one** of the following to your requirements line:
```
requirements = (has_avx || has_avx2)
requirements = has_avx2
requirements = (Microarch > x86-64-v3)
```
Then resubmit and check if this resolves the issue.

<hr width="100%" size="2">

<h3 style="color:#c5050c" id="general-i-used-generative-ai-to-create-my-submit-file-and-the-job-is-stuck-on-idle">[General] I used generative AI to create my submit file and the job is stuck on "Idle".</h3>

#### Cause:
Generative AI (such as Copilot, ChatGPT, etc.) may be inaccurate. 
In our experience, generative AI almost always gets something wrong when it comes to an HTCondor submit file. 
This is because HTCondor has significantly changed since its creation over 40 years ago, and is highly configurable.
This means that while there is a lot of information online in forums and site-specific documentation, the information is not always relevant to our local HTC system.
As such, submit files created by generative AI are usually not applicable to our HTC system.
#### Solution:
The CHTC website provides documentation - including example submit files - for how to submit jobs on the HTC system. 

* Learn the basics of job submission here: [chtc.cs.wisc.edu/uw-research-computing/htcondor-job-submission](https://chtc.cs.wisc.edu/uw-research-computing/htcondor-job-submission).
* For submitting jobs requesting GPUs, see our dedicated GPU guide here: [chtc.cs.wisc.edu/uw-research-computing/gpu-jobs](https://chtc.cs.wisc.edu/uw-research-computing/gpu-jobs).

<hr width="100%" size="2">

<h3 style="color:#c5050c" id="containers-when-building-an-apptainer-apt-commands-in-the-post-block-fail-to-run">[Container] When building an Apptainer, "apt" commands in the %post block fail to run.</h3>

#### Example error message:
```
Couldn't create temporary file /tmp/apt.conf.9vQdLs for passing config to apt-key
```
{:.term}
#### Cause:
The container needs global read/write permissions in order to update or install packages using the `apt` command.
#### Solution:
Add `chmod 777 /tmp` to the front of your `%post` block. See the example below:
```
Bootstrap: docker
From: ubuntu:22.04

%post
    chmod 777 /tmp
    apt-get update -y
```
We also recommend using the `-y` option to prevent installation from hanging due to interactive prompts.


<hr width="100%" size="2">

<h3 style="color:#c5050c" id="containers-when-attempting-to-run-a-docker-container-it-fails-with-the-error-message-fatal-tini-7-exec-myexecutablesh-failed-exec-format-error">[Container] When attempting to run a Docker container, it fails with the error message "[FATAL tini (7)] exec ./myExecutable.sh failed: Exec format error".</h3>

#### Cause:
The Docker container is likely built on an Apple computer using an ARM processor, which is incompatible with Linux machines.
#### Solution:
To resolve this, when building your Docker container, use the command:
```
docker build --platform linux/amd64 .
```
{:.term}

<hr width="100%" size="2">

<h3 style="color:#c5050c" id="container-my-interactive-apptainer-job-is-failing-with-the-error-message-cant-open-master-pty-bad-file-descriptor">[Container] My interactive Apptainer job is failing with the error message, "Can't open master pty Bad file descriptor". </h3>

#### Cause:
Interactive Apptainer jobs are incompatible with CentOS7 machines.
#### Solution:
To your submit file, add the following line and resubmit:
```
requirements = (OpSysMajorVer > 7)
```

<hr width="100%" size="2">

<h3 style="color:#c5050c" id="gpus-my-gpu-job-has-been-in-the-queue-for-a-long-period-of-time-and-is-not-starting">[GPU] My GPU job has been in the queue for a long period of time and is not starting. </h3>

#### Cause:
To use our shared use GPU machines, you must opt into the GPU Lab.
#### Solution:
To your submit file, add the following line and resubmit:
```
+WantGPULab = true
```

<br>
<hr width="100%" size="2">

<h3 style="color:#c5050c" id="general-python-my-job-has-an-error-that-mentions-homenetid">[General, Python] My job has an error that mentions `/home/netid/`. </h3>

#### Cause:
Sometimes programs assume that they can write into the `/home` directory. However, the Execution Point's `/home` directory is not writable.
#### Solution:
To your executable (`.sh` script), add the following line and resubmit:
```
export HOME=$PWD
```
This will change the `HOME` environment variable to the working directory on the Execution Point.

<br>
<hr width="100%" size="2">


## Can't find your issue?
Visit our [Get Help](get-help) page.
