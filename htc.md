---
highlighter: none
layout: character_optimized
title: What is High Throughput Computing?
---

In computing, **throughput** is a measure of the number of computing tasks a system can complete over time. 

**High Throughput Computing (HTC)** is an approach to computing that focuses on completing as much work as possible by focusing on running multiple independent tasks in parallel across available computers.

### What kinds of work are good for HTC?

A workload is often a good fit for HTC if it can be divided into multiple independent tasks. Tasks that do not rely on one another can run efficiently across available computing resources.

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

At the time, much of the computing community focused on High Performance Computing (HPC) and measuring how quickly a computer could perform calculations using a metric called *floating point operations per second (FLOPS)*.

Researchers recognized that some scientists cared less about the number operations the environment can provide them per second or minute and more about how many operations can be completed per month or per year. This idea led to the development of High Throughput Computing (HTC).

In 1996, researchers first explained the difference between High Throughput Computing (HTC) and High Performance Computing (HPC) during a <a href="https://web.archive.org/web/20000229050436/http://cesdis.gsfc.nasa.gov/admin/cesdis.seminars/71196.html">seminar</a> at NASA's Goddard Space Flight Center and CERN. In 1997, HPCWire published an <a href="https://www.hpcwire.com/1997/06/27/high-throughput-computing-an-interview-with-miron-livny">interview</a> on High Throughput Computing. Today, the Center for High Throughput Computing (CHTC) and HTCondor continue to build on these ideas and help researchers around the world accomplish more scientific work.