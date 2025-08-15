---
layout: character_optimized
---

# Integrating Pelican and Globus

#### Fellow: William Jiang
#### Mentors: Emma Turetsky & Justin Hiemstra
#### Fellowship Dates: 5/19/25 to 8/8/25

## Background

The Pelican Platform is an open-source software platform designed to create data federations by unifying diverse data repositories (e.g. POSIX filesystems, S3) under a single architecture. It is used primarily as a service to accelerate data transfer for HTCondor jobs, which can run on the same data distributed across the globe. It differs from the Globus project, whose main goal is to facilitate peer-to-peer data transfer, and it thus lacks the means to plug into cluster scheduling frameworks like HTCondor.

## Project Description

### Project Scope
- Support all Pelican commands (GET, PUT, LS, STAT, DELETE) against Globus endpoints
- Set up integration testbed (ITB) and write HTCondor script to do integration testing and system profiling

### Project Challenge
- Globus expertise vacuum: no one at CHTC had in-depth knowledge of Globus including its APIs, authentication system, or infrastructure. The developer who last worked on the integration project and had done the authentication piece left prior to my arrival, thus I needed to become the sole expert on Globus 
- C++ systems development: while I knew of such C++ primitives as threads, smart pointers, lifetimes, and so on from course materials and self-studying, using them in practice was challenging
- Integration with existing infrastructure: in particular, Pelican is an existing software package with its own intricacies, and in order to integrate with Globus, I needed to also become familiar with the whole Pelican system (which was more straightforward because of available help)

### Project Vision
The vision of the project was to have a fully functional Globus integration, which users could use to set up their own Pelican origins that can read and write directly to Globus endpoints. From these origins, researchers that desire to do computation on data backed by a Globus endpoint can do so directly, rather than transferring to an object store served by a Pelican origin first.

Additionally, the project team identified a need within Pelican to automate large scale integration testing, simply because no such infrastructure existed prior to my project. So questions like “what happens if there are a large number of simultaneous reads and writes to the same Globus endpoint”, or “how does Pelican behave under stress” are unanswerable. The hope is that with such infrastructure operationalized, the Pelican team can detect more issues that arise with scale prior to shipping to users.

## Project Deliverables
- A complete implementation of the Globus integration, in particular support for all five aforementioned Pelican commands against Pelican origins configured to serve Globus endpoints
- An ITB consisting of a pre-configured Pelican origin with a dedicated Globus collection and endpoint for internal testing
- A testing script for stress and integration testing against the ITB


## Project Outcome

I was able to implement all previously enumerated Pelican commands, set up the ITB, and write a testing script. In addition, I documented nearly everything I learned over the course of the fellowship for knowledge transfer and posterity.

## Shortcomings and Limitations

- Configuring the Pelican origin to interface with Globus requires some duplicative set up for the XRootD layer. Ideally this XRootD set up would be automatically configured on origin start up, but I didn’t have time to figure it out and implement it. The steps to implement this are well-trodden though, and should be straightforward for any current Pelican developer to do
- Running the testing script is not tied to any sort of automatic/recurring process like pull requests or commits to neither the Pelican nor XRootD plugin repositories, so it has limited utility for detecting regressions and performance issues

## Recommendations for Next Phase of Project 

1. Automate XRootD config and integration test running as previously mentioned
2. After determining that the new development is stable, work with interested parties for some beta testing
3. Release to the public!

## Lessons Learned
1. It pays to understand all pieces of software deeply so that when issues arise, you know where to look first to troubleshoot. Additionally, learning systems is the most transferable skill out of any hard skill like actual programming or knowing some obscure piece of tech, so it is good to practice doing so.
2. You can’t have technical discussions with others or communicate your work without being precise with your language. Otherwise you will disagree about very basic things and it is impossible to have any discussion period.

## Project Material Links and Descriptions
PRs: [https://github.com/PelicanPlatform/xrootd-s3-http/pull/104](https://github.com/PelicanPlatform/xrootd-s3-http/pull/104) and [https://github.com/PelicanPlatform/xrootd-s3-http/pull/106](https://github.com/PelicanPlatform/xrootd-s3-http/pull/106)  
Pelican Documentation: [https://docs.pelicanplatform.org/getting-data-with-pelican/client](https://docs.pelicanplatform.org/getting-data-with-pelican/client)  
Globus API Reference: [https://docs.globus.org/globus-connect-server/v5.4/https-access-collections/#supported_http_methods](https://docs.globus.org/globus-connect-server/v5.4/https-access-collections/#supported_http_methods)
