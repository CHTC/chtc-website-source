---
layout: character_optimized
---

# Pool Exerciser

#### Fellow: Ryan Boone  
#### Mentors: Cole Bollig & Rachel Lombardi  
#### Timeline: 05/28 \- 08/23

# Background

The Open Science Pool ([OSPool](https://osg-htc.org/services/open_science_pool.html)) is a dynamic high throughput system of heterogeneous resources  from over 60 institutions around the United States. Due to the immense amount of distributed resources, issues with provided resources--like a bad storage point or downed network--become difficult to pinpoint.

# Project Objective

The long term goal of the Pool Exerciser is to provide an infrastructure to run test jobs targeting specific functionality and pool resources. In order to get to the position of being able to add new tests as needed, the base Exerciser infrastructure must be developed around being able to answer the following questions:

1. How does the Exerciser know which available groupings of resources exist?
2. How does the Exerciser target specific groupings of resources?
3. How can it be verified that the Exerciser ran on all targeted resource groups?

# Project Outcome

The final product of this fellowship is the base infrastructure of a tool–named the Pool Exerciser–that constructs a live view of the OSPool resources and runs selected tests as HTCondor jobs ([figure 2](#diagrams)). The Exerciser works by querying the Central Manager Collector for a list of all currently available resources in the pool at runtime. These resources are defined by the organizations they belong to, but most institutions have a single resource ([figure 1](#diagrams)). The Exerciser then prepares the tests selected by the user by creating a unique timestamped execution directory where all tests contents are copied into as a working directory for the actual tests execution. The Exerciser then submits each test as HTCondor jobs to the OSPool resources that were queried from the Central Manager. When submitting jobs into the OSPool, the Exerciser also modifies them to help track the jobs and prevent them from running forever, in case resources go down, or other problems occur. Once all tests have been started by the Exerciser, each test’s associated jobs will produce metadata in the form of job records and possible output that can then be utilized to help understand what and where things may not be functioning as intended.  The project also provides a secondary tool to actively monitor an execution of the Exerciser for the current status of tests being run in the OSPool. The Exerciser was designed to be able to add new tests with minimal effort. Most HTCondor jobs with a single submit file can be turned into Exerciser tests, allowing users to test specific functionality in the OSPool for their own problems.

# Lessons Learned

Through this fellowship, I’ve learned much about software development in the “real world”. Computer science classes at UW Madison have taught me a lot, but working on a single software project for 12 weeks has introduced me to new ideas and considerations. I think one of the most important is the idea of “future proofing”. All the projects I’ve worked on at college have lasted no more than a few weeks, with no intention to use them beyond that time frame. Because of this, important aspects of programming are swept under the rug. Things like commenting and documentation are often completely ignored. Code tends to be written to the standard of “well, if it works”. Thought is not given to what might happen if someone should return to the code later and try to understand or expand upon it. However, all these things are important when writing a piece of software. When developing this project, I gave more consideration to things that I hadn’t before. I spent more time writing an argument parser than I ever had, because I knew that I wouldn’t be the only one who had to use it. I tried to make sure my code was properly commented and documented, so that anyone attempting to understand this project in the future could do so. I wrote code with the thought in mind that someone would expand upon it in the future, and I tried to make it so that that process would be as smooth as possible. These are things that are relatively new to me, and I thoroughly enjoyed the process of figuring them out.

Beyond the lessons I learned from developing a larger software project, I also gained valuable knowledge from working at CHTC. Before starting this fellowship, I was unaware of the idea of high throughput computing. As I worked here, I began to understand the benefits of a system like HTCondor. Allowing researchers to decrease their real world computational time by parallelizing their work is a fascinating concept. Additionally, as the work being done at CHTC directly helps accelerate research, I am proud that the work I was doing was in some small way contributing to that effort.

# Project Material Links and Descriptions

* [Pool Exerciser](https://github.com/Ryan-Boone/Pool_Exerciser) GitHub repository
* This project was inspired by the [IGWN Pool Exorciser](https://git.ligo.org/computing/distributed/igwn-pool-exorciser) by James Clark
* Neha Talluri’s “Where Am I?” project: [GitHub Repo](https://github.com/ntalluri/where-am-i) and [Glidein Wrapper Script](https://github.com/opensciencegrid/osg-flock/blob/master/ospool-pilot/itb/pilot/where-am-i)

# Diagrams {#diagrams}

Figure 1: OSPool hierarchy

![OSPool Hierarchy](/images/fellowship_writeup/ryan_boone/figure-1.png)

Figure 2: Pool Exerciser architecture

![Pool Exerciser architecture](/images/fellowship_writeup/ryan_boone/figure-1.png)
