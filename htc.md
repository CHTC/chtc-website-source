---
highlighter: none
layout: markdown-page
title: What is High Throughput Computing?
---

## High Throughput Computing (HTC)

For many experimental scientists, scientific progress and quality  of
research are strongly linked to computing throughput. In other words,
most scientists are concerned with how many floating point operations 
per month or per year they can extract from their computing
environment  rather than the number of such operations the
environment can provide  them per second or minute. Floating point
operations per second (FLOPS)  has been the yardstick used by most
High Performance Computing (HPC) efforts to evaluate their systems. 
Little attention has been devoted  by the computing community to
environments that can deliver large amounts  of processing capacity
over long periods of time.  We refer to such  environments as High
Throughput Computing (HTC) environments.

For more than a decade, the HTCondor team at the Computer Sciences 
Department at the University of Wisconsin-Madison has been developing and
evaluating mechanisms and policies that support HTC on large collections
of distributively owned heterogeneous computing resources. We first introduced the 
distinction between High Performance Computing (HPC) and High Throughput Computing 
(HTC) in a
[seminar](http://cesdis.gsfc.nasa.gov/admin/cesdis.seminars/71196.html) at the NASA Goddard Flight Center
in July of 1996 and a month later 
at the European Laboratory for Particle Physics (CERN). In June of 1997 HPCWire
published an [interview](https://research.cs.wisc.edu/htcondor/doc/HPCwire.1) on High Throughput Computing.

The key to HTC is effective management and exploitation of all
available  computing resources. Since the computing needs of most
scientists can be  satisfied these days by commodity CPUs and memory,
high efficiency is  not playing a major role in a HTC environment.
The main challenge a  typical HTC environment faces is how to
maximize the amount of resources  accessible to its customers. 
Distributed ownership of computing resources  is the major obstacle
such an environment has to overcome in order to  expand the pool of
resources it can draw from.  Recent trends in the  cost/performance
ratio of computer hardware have placed the control  (ownership) over
powerful computing resources in the hands of individuals  and small
groups. These distributed owners will be willing to include  their
resources in a HTC environment only after they 
are convinced that  their needs will be addressed and their rights protected.
