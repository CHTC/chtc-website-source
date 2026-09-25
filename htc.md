---
highlighter: none
layout: character_optimized
title: What is High Throughput Computing?
---

In computing, **throughput** is a measure of the number of computing tasks a system can complete over time. 

**High Throughput Computing (HTC)** is an approach to computing that focuses on completing as much work as possible, integrated over weeks or months.  Rather than focusing on making an individual task faster, throughput computing tries to run as many **independent tasks** as possible across **multiple computers** as they become available.

<p style="text-align:center">
  <img src="/images/htc-workflow.gif" alt="Animation showing independent computing tasks being distributed across multiple available computers." width=600px>
</p>

<p style="text-align:center"><em>In high throughput computing, independent tasks are distributed across available computers to complete more work over time.</em></p>

### What kinds of computations work well with the HTC approach?

Throughput Computing approaches work particularly well with workloads that can be expressed as groups of independent tasks. Tasks that do not rely on one another can run efficiently across available computing resources.

<table>
  <thead>
    <tr>
      <th>Workload Examples</th>
      <th>Why HTC?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🧬 Genomics</td>
      <td>Samples can be analyzed independently.</td>
    </tr>
    <tr>
      <td>🖼️ Image Processing</td>
      <td>Each image can be processed separately.</td>
    </tr>
    <tr>
      <td>🤖 Machine Learning</td>
      <td>Training runs or model settings can be tested at the same time.</td>
    </tr>
    <tr>
      <td>🔬 Parameter Sweeps</td>
      <td>Each set of parameters can run as its own job.</td>
    </tr>
  </tbody>
</table>

### Where did HTC come from?

The concept of **High Throughput Computing (HTC)** was developed by researchers at the University of Wisconsin-Madison in the 1990s.

<p style="text-align:center">
  <img src="/images/team/team_photos/team-1998.jpg" alt="Members of the HTCondor team in 1998" width=600px>
</p>

<p style="text-align:center"><em>The HTCondor team in 1998, during the early development of High Throughput Computing.</em></p>

At the time, much of the computing community focused on High Performance Computing (HPC) and measuring how quickly a computer could perform calculations using a metric called *floating point operations per second (FLOPS)*.

Researchers recognized that some scientists cared less about the number operations the environment can provide them per second or minute and more about how many operations can be completed per month or per year. This idea led to the development of High Throughput Computing (HTC).

In 1996, researchers first explained the difference between High Throughput Computing (HTC) and High Performance Computing (HPC) during a <a href="https://web.archive.org/web/20000229050436/http://cesdis.gsfc.nasa.gov/admin/cesdis.seminars/71196.html">seminar</a> at NASA's Goddard Space Flight Center and CERN. In 1997, HPCWire published an <a href="https://www.hpcwire.com/1997/06/27/high-throughput-computing-an-interview-with-miron-livny">interview</a> on High Throughput Computing. 

### Ongoing work at CHTC

Today, the [Center for High Throughput Computing (CHTC)](https://chtc.cs.wisc.edu/) continues to build on the principles of High Throughput Computing and help researchers around the world accomplish more scientific work. CHTC is the home of the [HTCondor Software Suite](https://htcondor.org/) and [Pelican Platform](https://pelicanplatform.org/), two technologies that support HTC on large collections of distributively owned heterogeneous computing resources. CHTC was also the original home of the term Research Computing Facilitation, a methodology developed to support end-users of computing approaches like HTC. 

* Learn more about our technologies: [Our Technologies](technologies)
* See CHTC's research in HTC: [Our Research](research)