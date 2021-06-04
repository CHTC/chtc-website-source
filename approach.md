---
highlighter: none
layout: markdown-page
title: About Our Approach
---

CHTC's specialty is High
*Throughput* Computing (HTC), which involves breaking up a single large
computational task into many smaller tasks for the fastest overall
turnaround. Most of our users find HTC to be invaluable 
in accelerating their computational work and thus their research. 
We support thousands of multi-core computers and use the task
scheduling software called HTCondor, developed right here in Madison, to
run thousands of independent jobs on as many total processors as
possible. These computers, or "machines", are distributed across several 
collections that we call *pools* (similar to "clusters"). Because machines are
assigned to individual jobs, many users can be running jobs on a pool at any
given time, all managed by HTCondor.

The diagram below shows some of the largest pools on campus and also
shows our connection to the US-wide Open Science Grid where UW computing
work can "backfill" available computers all over the country. The number
under each resource name shows an approximate number of computing hours
available to campus researchers for a typical week in Fall 2013. As
demonstrated in the diagram, we help users to submit their work not only
to our CHTC-owned machines, but to improve their throughput even further
by seamlessly accessing as many available computers as possible, all
over campus *AND* all over the country.

The vast majority of the computational work that campus researcher have
is HTC, though we are happy to support researchers with a variety of
beyond-the-desktop needs, including tightly-coupled computations (e.g.
MPI), high-memory work (e.g. metagenomics), and specialized
hardware like GPUs.

<img alt="chtc-pools" src="{{ '/includes/chtc-pools.png' | relative_url }}" width="500" style = "float:right; margin:20px; margin-right:0;"/>


## What kinds of applications run best in the CHTC?

"Pleasantly parallel" tasks, where *many* jobs can run independently,
is what works best in the CHTC, and is what we can offer the greatest
computational capacity for. 
Analyzing thousands of images, inferring statistical significance of hundreds of
thousands of samples, optimizing an electric motor design with millions
of constraints, aligning genomes, and performing deep linguistic search
on a 30 TB sample of the internet are a few of the applications that
campus researchers run every day in the CHTC. If you are not sure if
your application is a good fit for CHTC resources, [get in
touch](mailto:chtc@cs.wisc.edu) and we will be happy to help you figure it out.

Within a single compute system, we also support GPUs, high-memory
servers, and specialized hardware owned by individual research groups.
For tightly-coupled computations (e.g. MPI and similar programmed
parallelization), our resources include an HPC Cluster, with faster
inter-node networking.


## How to Get Access

While you may be excited at the prospect of harnessing 100,000 compute
hours a day for your research, the most valuable thing we offer is,
well, us. We have a small, yet dedicated team of professionals who eat,
breathe and sleep distributed computing. [Request an
account](get-started.shtml), and one of our dedicated Research Computing
Facilitators will follow up to provide specific recommendations to
accelerate YOUR science.


<p style="margin-bottom: 120px;"> </p>