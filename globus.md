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


## Using the CHTC Globus Endpoint

The CHTC Globus endpoint's name is `chtc#staging`.
It can be found in the Globus web interface 
[here](https://app.globus.org/file-manager/collections/d0bae6da-db3b-11ea-85a2-0e1702b77d41/overview?back=endpoints).
If you  need the actual endpoint UUID, it is listed on that page near the bottom
of the "Overview".

To use an endpoint, you must first **activate** it.
Activations are usually time-limited, and transfers can only proceed while
both the source and destination endpoints are activated.
Activating an endpoint generally requires logging in.
For the `chtc#staging` endpoint, you should log in using
the same username and password you use to log in to your submit node.
You can see how long your activation will last on the endpoint information page
in the Globus web interface.

To begin a file transfer, go to the 
[File Manager](https://app.globus.org/file-manager).
In the top-right corner of the page, make sure you are in the "two panel" view.
Select the two endpoints you want to transfer between
(they are called "Collections" on this page).
You should see a directory listing appear in the middle of each of the panes;
select a directory or file and click "Start" at the bottom of the page to
move that directory or file to the other endpoint.
The item will be moved to the currently-selected directory on the other endpoint.

Globus transfers are *asynchronous*, and you do not need to leave the web
interface open while they run.
You will receive emails updates on the progress of the transfer, and you can
view the status of in-progress and historical transfers
[on the Activity page](https://app.globus.org/activity).

You may find some of the "transfer settings", available by clicking the
"Transfer & Sync Options" dropdown, useful.
In particular, `sync` will help reduce the amount of time it takes to transfer
when some data has already been transferred.


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


## Non-Interactive File Transfer

As the scale of your research increases, you will probably want to move away
from the interactive web interface and toward a more automated way of launching
transfers.
We recommend using
[this tool](https://github.com/JoshKarpel/globus-transfer),
which can be used at the command line to launch and manage Globus file transfers,
and can generate HTCondor submit descriptions for the same purpose.
These submit descriptions could be run as standalone jobs
or as integrated parts of a 
[larger workflow](https://htcondor.readthedocs.io/en/latest/users-manual/dagman-workflows.html)).
