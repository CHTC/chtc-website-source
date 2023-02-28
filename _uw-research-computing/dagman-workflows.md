---
highlighter: none
layout: markdown-page
title: Workflows with HTCondor's DAGMan
category: Job Submission
tag:
    - htc
---

## Overview

If your work requires jobs that run in a particular sequence, you may benefit 
from a workflow tool that submits and monitors jobs for you in the correct 
order. A simple workflow manager that integrates with HTCondor is DAGMan, 
or "DAG Manager" where DAG stands for the typical picture of a workflow, a 
directed acyclic graph. 

## Learning Resources

This talk (originally presented at HTCondor Week 2020) gives a good overview of 
when to use DAGMan and its most useful features: 

<a href="https://www.youtube.com/watch?v=1MvVHxRs7iU">
<img alt="DAGMan Talk" src="https://github.com/OSGConnect/connectbook/blob/master/images/dagman-talk-screenshot.png" width="360" height="204">
</a>

For full details on various DAGMan features, see the HTCondor manual page: 

* [DAGMan Manual Page](https://htcondor.readthedocs.io/en/latest/users-manual/dagman-workflows.html)
