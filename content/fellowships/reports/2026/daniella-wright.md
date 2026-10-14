---
layout: character_optimized
---

# Bytes of Knowledge

#### Fellow: Daniella Wright Nogueda
#### Mentors: Amber Lim & Christina Koch
#### Fellowship Dates: June 1, 2026 to August 14, 2026

## Background

Documentation is an important connection between users and computing resources. It empowers users to understand how to access and apply those resources to their own work. In CHTC’s documentation, we see explanations on research computing concepts, available services, and guides that together aim to guide users through technical tasks in their research projects. However, technical accuracy alone does not guarantee that documentation is useful. Users must also be able to locate the information they are looking for, understand how it relates to their work, and determine what steps to take next.

Some of the existing CHTC documentation is presented through text-heavy pages containing technical jargon and limited visual guidance. Regardless of a user’s technical background, these characteristics can make information difficult to navigate and absorb. The objective of this project was to make targeted improvements to CHTC documentation while establishing principles for improving navigation, comprehension, and usability for everyone who relies on CHTC documentation.

## Project Description

This project looked at how CHTC’s documentation could better communicate research computing information. I reviewed existing pages, identified areas where users might experience confusion or difficulty navigating the content, and developed structural, written, and visual improvements. These changes included reorganizing information so that it is presented more clearly, rewriting explanations using plain-language principles, creating original graphics to help visualize technical concepts, adding visual cues such as icons and text boxes, and creating video tutorials.

### Project Scope

The project focused on selected documentation pages where changes to structure, visual hierarchy, wording, and navigation could make technical information easier to understand and apply. Pages selected for improvement included the Roadmap to Getting Started, checkpointing documentation, and pages about connecting to CHTC with VS Code and transferring files. These topics offered opportunities for improvement through restructuring content, adding visual learning tools, and, in some cases, developing video tutorials. The project did not attempt to dumb down or oversimplify technical concepts, nor did it remove detailed information that may be required by experienced users. Instead, it focused on improving how existing information is explained and presented.

### Project Challenge

One challenge of this project was using the available data to confidently decide which documentation pages to focus on. I looked at page-view data to see which pages received the most traffic and categorized support tickets to identify common issues. However, high traffic did not necessarily show whether users were having difficulty with a page and the problems reported in support tickets were often specific to individual situations, varied widely, and did not correlate with page views. This made it difficult for me to determine which pages users might be struggling with and could benefit most from changes, as well as how to meaningfully quantify the success of changes in documentation.

We also implemented event trackers to collect more specific data about how users interacted with my additions to the documentation, but because of the length of the fellowship project, we did not have enough time to collect and analyze meaningful results from them.

### Project Vision

The project aims to make CHTC documentation easier to parse, understand, and apply so that researchers can more confidently use CHTC resources to support their work. The idea is to help users identify the information that is relevant to them, understand what action to take, and move through a process without needing to read every related page or already be familiar with research computing terminology.

By adding graphics, icons, text boxes, consistent visual hierarchy, and explanations using plain-language, the documentation can present complex information in smaller and more manageable sections. These elements are intended to help users easily recognize the most important information and find additional details when they need them.

## Project Deliverables

The first project deliverable was a revised version of the Roadmap to Getting Started. I implemented changes that included rewriting explanations using plain-language principles, reorganizing the information into a more structured progression based on the steps users follow when beginning their work with CHTC.

I also created 10 graphics to illustrate concepts such as connecting to an access point, preparing software with containers, and understanding how data and jobs move through the CHTC workflow. Creating these graphics showed me how visuals can help reinforce understanding of technical concepts. It also gave me an opportunity to learn more about the processes I was creating visuals for, as I made sure that each graphic was technically accurate.

In another major project deliverable, I restructured the checkpointing documentation by rewriting the introduction to help users quickly understand what checkpointing is, when to use it, and how it works in HTCondor. To make the process more practical, I added a try-it-yourself example that guides users through configuring and running a checkpointable job. The example provides commands that users can copy and run themselves, along with explanations of the results they should expect to see. The goal of examples like these is to give users an opportunity to become familiar with processes in a guided setting so they can apply it with more confidence to their own projects.

Additional work included developing research computing FAQ content and creating video tutorials. The tutorials focused on connecting to CHTC through VS Code and troubleshooting common connection issues, transferring files with ResearchDrive and Globus, and remotely accessing private GitHub repositories. All website changes were implemented through Git branches and pull requests so they could be reviewed before publication.

## Project Outcome

The project achieved its primary goal of developing and implementing practical documentation strategies to make CHTC’s resources more usable. Through interviews with researchers, I received feedback that the graphics helped break up large sections of text, made pages easier to scan, and supported the understanding of technical processes. Feedback on the organization of the documentation also highlighted the value of including troubleshooting guidance.

We also implemented event trackers on selected additions to begin collecting more specific data about how users interact with the revised documentation. Although the length of the fellowship did not allow enough time to collect and analyze meaningful results, these trackers will provide a way to evaluate the engagement of my changes over a longer period of time.

## Shortcomings and Limitations

I was not able to fully measure the long-term effects of these changes during my fellowship. Identifying meaningful changes in page views, engagement, or user retention would require collecting and analyzing data over several months.

Although I did speak with a few researchers, which gave me useful feedback on the value of the graphics and the organization of the documentation, these conversations represented a limited group of users. I was not able to interview researchers with a wider range of experience levels, so the feedback could not fully reflect the range of experiences of people who use CHTC documentation.

## Recommendations for Next Phase of Project

I think developing a more consistent process for creating and reviewing documentation would be valuable. CHTC already has a style guide, but it could also be helpful to have guidance for how content should be structured. My proposal is to use a general structure that first introduces why a user might need something, shows how to do it, provides an example, explains how it works in more detail, and ends with troubleshooting guidance if relevant. I think this structure could be adapted to much of the documentation already found on the website.

If I had more time as a fellow, I would have liked to code and create reusable website components for the documentation found on the CHTC website. Examples could include interactive step-by-step sections that organize instructions into clear stages, process flows where contributors can enter different steps and have them automatically displayed in a consistent visual format, and a “next step” navigation component at the end of a page that directs users to the most relevant documentation based on what they just viewed. Having these components available could make it easier for future contributors to keep pages organized and visually consistent. Over time, I think that consistency could also make the website more familiar to returning CHTC users and help them find the information they need more quickly.

## Lessons Learned

### Project

The project reinforced for me that every element in documentation should have a purpose. That can include a graphic, text box, heading, or even white space. These documentation practices all work together to make information easier to scan and understand. The book *Don’t Make Me Think* by Steve Krug further reinforced that users should not need to figure out how a page is organized before they can find what they need. A clear visual structure and straightforward wording can reduce that extra effort. This helps users spend less time figuring out documentation and more time working on their research.

More broadly, the project taught me that when working to improve something, it is important to make sure each change actually responds to the problem in some way and has a clear purpose. The project also showed me that there is not always one solution that works for every user, especially when users have different backgrounds, goals, and levels of experience. Meaningful improvement often takes time and is built gradually through feedback, testing, and small changes along the way.

### Personal

The project allowed me to learn more about how user experience principles can be applied to technical documentation. Having interests in both technology and art, I had been looking forward to exploring how these areas could come together in a meaningful way. Throughout the project, I gained experience translating technical concepts into visual and structural designs while paying close attention to the accuracy and usefulness of the information.

Regarding the technical aspects of the project, I strengthened my understanding of high-throughput computing, high-performance computing, and HTCondor. Working within a large, established website repository for the first time expanded my experience with Git and GitHub, particularly through creating branches, submitting pull requests, responding to code reviews, and revising my work based on feedback from mentors.

## Project Material Links and Descriptions

Slides shown during CHTC Team Meeting, where I gave an introduction of myself and my fellows project.
- [CHTC Presentation Daniella](https://docs.google.com/presentation/d/19NWQ2phWvsrSDzi5TQKPi2-ih6enYy64Bwv6ozNPUCE/edit?usp=sharing)

Slides shown during HTC26 Lightning Talk, where I gave an overview of my fellows project.
- [CHTC Lightning Talk Presentation](https://docs.google.com/presentation/d/14VbRhO25bxLdcF2b39zro-6vRXBLac997ChJLKOSPoQ/edit?usp=sharing)

Slides shown during the final presentation at CHTC Staff Meeting, where I shared my project’s deliverables, challenges, and outcome.
- [CHTC Final Presentation](https://docs.google.com/presentation/d/1kpRg6yHusnF2YhSrq14l809KTo7Y8F61mORKd8f42bo/edit?usp=sharing)

Folder contains the Adobe Illustrator (.ai) and After Effects (.aep) project files for the graphics/animations I created as part of my fellows project. These graphics are currently live on the CHTC website pages I worked on.
- [daniellawright folder in Fellows GitHub repository](https://github.com/CHTC/2026-Fellows-Projects/tree/main/daniellawright)

Pages Revised
- [Roadmap to Getting Started](https://chtc.cs.wisc.edu/uw-research-computing/htc-roadmap)
- [Checkpointing Documentation](https://chtc.cs.wisc.edu/uw-research-computing/checkpointing)
- [What is High Throughput Computing?](https://chtc.cs.wisc.edu/htc.html)

Pages Identified for Video Tutorials
- [Connect to CHTC with VS Code](https://chtc.cs.wisc.edu/uw-research-computing/vs-code)
- [Transfer Files Between CHTC and ResearchDrive](https://chtc.cs.wisc.edu/uw-research-computing/transfer-data-researchdrive)
- [Transfer Files with Globus](https://chtc.cs.wisc.edu/uw-research-computing/globus)
- [Access a Private GitHub Repository Remotely](https://chtc.cs.wisc.edu/uw-research-computing/github-remote-access)
