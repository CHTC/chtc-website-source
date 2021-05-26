---
highlighter: none
layout: content
title: Windows / Linux Incompatibility
---


If your job is running a bash or shell script (includes the header
`#!/bin/bash`), and it goes on hold, you might be experiencing a
Windows/Linux incompability error. Files written in Windows (based on
the DOS operating system) and files written in Mac/Linux (based on the
UNIX operating system) use different invisible characters to mean \"end
of a line\" in a file. Normally this isn\'t a problem, *except* when
writing bash scripts; bash will not be able to run scripts if they have
the Windows/DOS line endings.

To find why the job went on hold, look for the hold reason, either by
running

``` 
[alice@submit]$ condor_q -af HoldReason
```
{:.term}

or by looking in the log file.

If a Windows/Linux incompatibility is the problem, the hold reason will
look something like this:

``` 
Error from slot1_11@e189.chtc.wisc.edu: Failed to execute 
'/var/lib/condor/execute/slot1/dir_4086540/condor_exec.exe' with 
arguments 2: (errno=2: 'No such file or directory')
```
{:.file}

To check if this is the problem, you can open the script in the vi text
editor, using its \"binary\" mode:

``` 
[alice@submit]$ vi -b hello-chtc.sh
```
{:.term}

(Replace `hello-chtc.sh` with the name of your script.) If you see `^M`
characters at the end of each line, those are the DOS line endings and
that\'s the problem.\
(Type `:q` to quit vi)

Luckily, there is an easy fix! To convert the script to unix line
endings so that it will run correctly, you can run:

``` 
[alice@submit]$ dos2unix hello-chtc.sh
```
{:.term}

on the submit node and it will change the format for you. If you release
your held jobs (using `condor_release`) or re-submit the jobs, you
should no longer get the same error.
