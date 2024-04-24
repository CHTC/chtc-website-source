---
highlighter: none
layout: guide
title: Run Java Jobs
guide:
    tag:
        - htc
---

Overview
========

If your code uses Java via a `.jar` file, it is easy to run on CHTC and
beyond. There are two ways to run Java code from a CHTC submit server:

-   [Use a newer version of Java, running jobs anywhere in CHTC and beyond (on the UW
    Grid or OSG) (recommended)](#portable)
-   [Run jobs in CHTC only, using the default Java version
    (1.8)](#default)

You should only use \*one\* of these options to run Java code, not both.


<span name="portable"></span>

Portable Java (recommended)
=============

To use a newer version of Java and/or to run outside of CHTC on the UW
Grid and/or OS Pool:

1. **Get a copy of Java/JDK.** Access the the Java Development Kit (JDK) from 
the [JDK website](https://jdk.java.net/). First select the link to the 
JDK that's listed as "Ready for Use" and then download the Linux/x64 
version of the tar.gz file. The downloaded file should end up in your 
home directory on a CHTC submit server. 

2. **Include Java in Input Files.**  Add the downloaded tar file to the `transfer_input_files` line of your
submit file, along with the `.jar` file and any other input files the job needs:

    ``` {.sub}
transfer_input_files = openjdk-17.0.1_linux-x64_bin.tar.gz, program.jar, other_input
    ```


3. **Setup Java inside the job.** Write a script that unpacks the JDK tar file, sets 
the environment to
find the java software, and then runs your program. This script will be
your job\'s executable. See this example for what the script should look
like:
    ``` {.sub}
    #!/bin/bash
    
    # unzip the JDK
    tar -xzf openjdk-17.0.1_linux-x64_bin.tar.gz
    # Add the unzipped JDK folder to the environment
    export PATH=$PWD/jdk-17.0.1/bin:$PATH
    export JAVA_HOME=$PWD/jdk-17.0.1
    
    # run your .jar file
    java -jar program.jar
    ```

    Note that the exact name of the unzipped JDK folder and the JDK tar.gz file will 
    vary depending on the version you downloaded. You should unzip the JDK tar.gz 
    file in your home directory to find out the correct directory name to add to 
        the script. 
	
<span name="default"></span>

Pre-installed Java
==================

To run in CHTC only, using the default version of java (1.8):

1.  Add this line to your submit file:

    ``` {.sub}
    requirements = (Target.HasJava == true) 
    ```

2.  Your executable should be a wrapper script that executes your
    program.

    ``` 
    #!/bin/bash

    java -jar program.jar
    ```
    {:.file}
