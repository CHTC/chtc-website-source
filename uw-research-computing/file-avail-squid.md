---
highlighter: none
layout: file_avail
title: Large File Availability Via Squid
---

<style type="text/css">
    ol { list-style-type: upper-alpha; }
</style>

SQUID Web Proxy
===============

CHTC maintains a SQUID web proxy from which pre-staged input files and
executables can be downloaded into jobs using CHTC\'s proxy HTTP
address.

{% capture content %}
1. [Applicability](#Appli)
2.  [Using SQUID to Deliver Input Files](#use)
    * [Request a directory in SQUID](#request)
    * [Place files within your home directory](#place)
    * [Have HTCondor download the file to the working job](#have)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

<a name="Appli"></a>

**1. Applicability**
----------------

* Intended Use:  
    The SQUID web proxy is best for cases where many jobs will use the
    same large file (or few files), including large software. It is not
    good for cases when each of many jobs needs a *different* large
    input file, in which case [our large data staging
    location](file-avail-largedata.html) should be used. Remember that
    you\'re always better off by pre-splitting a large input file into
    smaller job-specific files if each job only needs some of the large
    files\'s data. If each job needs a large set of many files, you
    should create a `.tar.gz` file containing all the files, and this
    file will still need to be less than 1 GB.

* Access to SQUID:  
    is granted upon request to [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu). A user on CHTC submit
    servers may will be granted a user directory within `/squid`, which
    users should transfer data into via the CHTC transfer server
    (transfer.chtc.wisc.edu). As for all CHTC file space, users should
    minimize the amount of data on the SQUID web proxy, and should clean
    files from the `/squid` location regularly. CHTC staff reserve the
    right to remove any file from `/squid` when needed to preserve
    availability and performance for all users.

* Advantages:  
    Files placed on the SQUID web proxy can be downloaded by jobs
    running anywhere, because the files are world-readable.

* **Limitations and Policies**:  
    -   SQUID cannot be used for job output, as there is no way to
        change files in SQUID from within a job.
    -   SQUID is also only capable of delivering individual files up to
        1 GB in size.
    -   A change you make to a file within your `/squid` directory may
        not take effect immediately on the SQUID web proxy if you use
        the same filename. Therefore, it is important to use a **new
        filename** when replacing a file in your `/squid` directory.
    -   Jobs should still ALWAYS and ONLY be submitted from within the
        user\'s `/home` location.
    -   Only the \"http\" address should be listed in the
        \"`transfer_input_files`\" line of the submit file. File
        locations starting with \"`/squid`\" should NEVER be listed in
        the submit file.
    -   Users should only have data in /squid that is being use for
        currently-queued jobs; CHTC provides no back ups of any data in
        CHTC systems, and our staff reserve the right to remove any data
        causing issues. It is the responsibility of users to keep copies
        of all essential data in preparation for potential data loss or
        file system corruption.  
<br>
* Data Security:  
    Files placed in SQUID can only be edited by the owner of the user
    directory within `/squid`, but will end up being world-readable on
    the SQUID web proxy in order to be readily downloadable by jobs
    (with the proper HTTP address); thus, large files that should be
    \"private\" should not be placed in your user directory in `/squid`,
    and should instead use CHTC\'s [large data staging
    space](file-avail-largedata.html) for large-file staging.


<a name="use"></a>

**2. Using SQUID to Deliver Input Files**
-------------------------------------
<a name="request"></a>
1. **Request a directory in SQUID**. Write to [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) describing the data you\'d like to place in SQUID, and indicating your username and submit server hostname (i.e. submit-5.chtc.wisc.edu).<a name="place"></a>  

2.  **Place files within your `/squid/username` directory** via a CHTC
    transfer server (if from your laptop/desktop) or on the submit
    server.   

    From your laptop/desktop:  
    ``` 
    [username@computer]$ scp large_file.tar.gz username@transfer.chtc.wisc.edu:/squid/username/
    ```
    {:.term}
    

    If the file already exists within your /home directory on a submit
    server:

    ``` 
    [username@submit]$ cp large_file.tar.gz /squid/username/
    ```
    {:.term}

    Check the file from the submit server:

    ``` 
    [username@submit]$ ls /squid/username/
    ```
    {:.term}

3.  **Have HTCondor download the file to the working job** using the
    `http://proxy.chtc.wisc.edu/SQUID` address in the <a name="have"></a>
    transfer\_input\_files line of your submit file:

    ``` {.sub}
    transfer_input_files = other_file1,other_file2,http://proxy.chtc.wisc.edu/SQUID/username/large_file.txt
    ```

    **Important:**Make sure to replace \"username\" with your username
    in the above address. All other files should be staged before job
    submission.\
    \
    If your large file is a `.tar.gz` file that untars to include other
    *files*, remember to remove such files before the end of the job;
    otherwise, HTCondor will think that such files are new output that
    needs to be transferred back to the submit server. (HTCondor will
    not automatically transfer back *directories*.)
