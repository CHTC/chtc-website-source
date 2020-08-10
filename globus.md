---
highlighter: none
layout: default
title: Using Globus to Transfer Files to and from CHTC
---

[Globus](https://www.globus.org/) is a data management service that lets you
move files files between **endpoints**, computers that are connected to the
Globus file transfer network.
CHTC maintains a Globus endpoint that can serve as either the
source or destination of a Globus file transfer
(i.e., you can move your files out of CHTC to some other Globus endpoint,
or from some other Globus endpoint to CHTC).

All file transfer via Globus at CHTC is based out of the
[`/staging`](/file-avail-largedata.shtml) directory.
Therefore, to use Globus, you will need access to `/staging` 
(instructions for requesting access are 
[here](/file-avail-largedata.shtml#1-policies-and-intended-use)).

## Finding the CHTC Globus Endpoint


## Running a Personal Globus Endpoint

The CHTC Globus endpoint is a "Globus Connect Server", designed for shared use
on a dedicated machine.
It is also possible to run 
[Globus Connect Personal](https://www.globus.org/globus-connect-personal),
a lighter-weight package that adds a Globus endpoint to your own computer,
like a laptop or lab computer.
Installers are available at that link for Mac, Linux, and Windows.

We only recommend using Globus Connect Personal if you are also working with
some other Globus endpoint (not just CHTC and your computer).
If you are just moving files between CHTC and your own computer, traditional
file transfer tools like `rsync` will likely be more efficient.
