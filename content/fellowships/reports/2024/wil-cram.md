---
layout: character_optimized
---

# Monitoring Schedd Performance

##### Fellow: Wil Cram
##### Mentor: Greg Thain
##### Timeline: May-August 2024

## Background

In a typical Condor system, a Schedd instance runs on each access point (submit node). This process is responsible for handling various user commands, the two most well-known being condor\_q and condor\_submit. The Schedd, being an event-driven system with a single thread, is prone to blocking on expensive operations such as file system flushes (see [fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)).

There is currently a lack of monitoring surrounding the Schedd; when it becomes slow or unresponsive, it is difficult to troubleshoot. The goal of this project is to give admins a better view of the internals of the Schedd and help diagnose issues more effectively.

## Project Description

### Project Scope

Because the Schedd is such a complicated system (schedd.cpp clocks in at over 18,000 lines), our initial goal was to get some simple runtime information back to the end user. Once this was completed, we could make the data collection more generic, allowing us to define certain categories such as *Commands, Timers,* and *Reapers*, and bucket function calls into these to provide a broad overview of where cycles go. In the vein of keeping “unknown unknowns” explicit, we also provide the *Other* runtime that is currently unaccounted for.

### Project Challenge

Quickly gaining familiarity with the codebase was an initial hurdle to get over, but once I figured out exactly where I should be timing certain functions, the actual C++ code to write was mostly trivial. I had some bad memory accesses that were initially hard to debug, as the pointers were being passed around through multiple function calls and macros. Switching to auto-free pointers alleviated this issue.

Once the C++ changes were made, the script code had a much faster iteration process. One major problem I ran into was that the internal usernames of Reapers weren’t compatible with Python’s UTF-8 implementation, so I had to write a special case for Reaper runtimes to discard the names and just report the total.

Because a majority of what **condor\_diagnostics** does is dictionary handling, creating generalized utility functions to **map, zip,** and **reduce** diff-dictionaries was an interesting challenge that I think resulted in more fluent code in the long run.

### Project Vision

Greg’s ultimate vision for Schedd observability is being able to trace a Condor job system-wide and all of the observability benefits that accompany it. This project is focused on getting a per-machine breakdown of runtime information; distilling metrics further by job ID and having access points communicate this runtime information with each other is a logical next step towards this goal.

## Project Deliverables

The main deliverable for this project is the **condor\_diagnostics** script that is added to the bin directory. This Python script queries the Schedd periodically for runtime snapshots and “diffs” these snapshots together to paint a picture of the runtime composition of a given moment in time.

The console mode of the script was the first to be written, and displays a hierarchical overview of the runtime categories and the users within them, with color to highlight certain calls that take a high proportion of runtime. Many flags are included to tweak things like sample window, minimum print threshold, and parameterizing the weighted moving average. The graphical mode renders an interactive [flame-graph](https://www.brendangregg.com/flamegraphs.html) of this data in a window, and otherwise is as configurable as the console mode.

An additional phase of the project was creating a proof-of-concept for a pipeline that can transform the output of **condor\_diagnostics** into a prometheus data format, then send it to Grafana for visualization. This was accomplished using a Docker-Compose stack that runs on an access point.

## Project Outcome

The goal of “observability” is broad enough in scope that it is difficult to determine quantitatively what constitutes improvement, but it is now possible to connect to a Schedd by name, and determine:

* What commands, timers or tasks are hogging the process
* Who could be overloading the system with commands like **watch condor\_q**
* When problems occur (transiently? periodically?) using Grafana

There is also an opportunity to use this script to monitor “test suites” of jobs for performance bottlenecks and other improvements.

## Lessons Learned

This project has taught me a lot about dealing with large codebases and the challenges that come with them. I had never seen so many macros in use before, and cataloging them in a notebook was invaluable in understanding what certain functions were actually *doing* under the syntax. Further, taking notes on sections of Schedd and DaemonCore code was invaluable for being able to chunk parts of the system in my head.

Per Greg’s reading list, I read “Fluent Python” throughout the process of writing **condor\_diagnostics** and tried to actively implement what I read about. I noticed myself using list and dictionary comprehensions much more often, and I felt that this resulted in much more readable code.

In the second phase of the project, I learned a lot of Docker tidbits from tying everything together. I was functional with it before, but after debugging network and file system errors for a while I am much more confident in writing Dockerfiles in the future.

## Project Material Links and Descriptions

[condor\_diagnostics\_prometheus](https://github.com/wmcram/condor_diagnostics_prometheus): The proof-of-concept Docker stack  
[https://www.brendangregg.com](https://www.brendangregg.com/): The holy grail of performance monitoring  
[Category Theory For Programmers](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/): Not used directly, but made me think a lot about reducing computation, types, and transformations to their purest form.