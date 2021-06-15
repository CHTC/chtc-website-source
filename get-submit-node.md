---
highlighter: none
layout: markdown-page
title: Getting a Submit Node
---


In order to submit jobs to our campus-wide collection of resources, you
will need access to a submit node. There are several options for getting
access to a submit node:

1.  **[Use ours](use-submit-node.shtml).** We operate a submit node that
    is shared by many researchers. This is a great way to get started
    quickly, and it is sufficient if you do not need to run tens of
    thousands of jobs with heavy data transfer requirements.
2.  **Use your department\'s.** Perhaps your department already has its
    own submit node, in which case you can contact your local
    administrator for an account. You will still need to provide all the
    info requested on the [getting started](get-started.shtml) form, so
    we can set up things on our end. The benefits of using a
    departmental or group submit node are: access to data on local file
    systems; limited impact from other, potentially new users; and,
    greater scalability in the number of simultaneous jobs you can run,
    as well as the amount of data you can transfer.
3.  **Set up a new submit node on a server.** If you do not already have
    one and need access to data on local file systems, or if you believe
    that you will have a significant job and/or data volume, getting
    your own submit node is probably the best way to go. Here\'s an
    example system configuration that we\'ve found works well for a
    variety of submit work loads. You can expect to spend around
    \$4,000 - \$5,000 for such a system.

    **Typical submit node configuration**

    -   A 1U rack-mount enclosure, like a Dell PowerEdge 410.
    -   Two processors with 12 cores total, for example Intel Xeon
        E5645, 2.4GHz 6-core processors
    -   24GB of 1.3 GHz RAM
    -   Two drives for the operating system. 500GB each is enough. You
        can use mirroring or a RAID configuration like RAID-6 for
        reliability.
    -   Two or more 2-3TB drives for data, depending on your needs.

4.  **Use your desktop.** Depending on your department\'s level of
    system adminstration support, you may be able to have HTCondor
    installed on your desktop and configured to submit into our campus
    resources. Another option that is under development is
    [Bosco](https://twiki.grid.iu.edu/bin/view/CampusGrids/BoSCO), a
    user-installable software package that lets you submit jobs into
    resources managed by HTCondor, PBS or SGE.

Still not sure what option is right for you? No worries. This is one of
the topics we discuss in our initial consultation. To schedule an
initial consultation, fill out our [getting started](get-started.shtml)
form.
