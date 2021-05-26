---
highlighter: none
layout: content
title: Using Java Code in CHTC
---

Overview
========

If your code uses Java via a `.jar` file, it is easy to run on CHTC and
beyond. There are two ways to run Java code from a CHTC submit server:

-   [Run jobs in CHTC only, using the default Java version
    (1.8)](#default)
-   [Use a newer version of Java and/or run jobs beyond CHTC (on the UW
    Grid or Open Science Grid) (recommended)](#portable)

You should only use \*one\* of these options to run Java code, not both.

<a name="default"></a>

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


<a name="portable"></a>

Portable Java
=============

To use a newer version of Java and/or to run outside of CHTC on the UW
Grid and/or Open Science Grid:

1. Download the Linux x64 Java/JDK tar file (the .tar.gz ending \*not\*
.rpm) from the [Oracle
website](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
You\'ll need to click on a button to \"Accept License Agreement\" to
download.

2. Add the downloaded tar file to the `transfer_input_files` line of your
submit file:

    ``` {.sub}
    transfer_input_files = jdk-8u121-linux-x64.tar.gz
    ```
3. Write a script that unpacks the jdk tar file, sets the environment to
find the java software, and then runs your program. This script will be
your job\'s executable. See this example for what the script should look
like:

    ``` 
    #!/bin/bash

    tar -xzf jdk-8u121-linux-x64.tar.gz
    export PATH=$(pwd)/jdk-8u121-linux-x64/bin:$PATH
    export JAVA_HOME=$(pwd)/jdk-8u121-linux-x64
    java -jar program.jar
    ```
    {:.file}

    As in Step 2 above, the final line will vary, depending on your program.
