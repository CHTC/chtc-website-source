---
highlighter: none
layout: guide
title: Known Issues on the HPC
guide:
    order: 8
    category: Basics and Policies
    tag:
        - hpc
---

This page documents some common and known issues encountered on the HPC system. While this page can be beneficial in troubleshooting, it does not contain a comprehensive list of errors.

Visit our [Get Help](get-help) page to find more resources for troubleshooting.

{% capture content %}
1. [[Software] When compiling code, I get multiple errors such as "[library], needed by [library] not found" and "undefined reference to [library]".](software-when-compiling-code-i-get-multiple-errors)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}


<hr width="100%" size="2">

<h3 style="color:#c5050c" id="software-when-compiling-code-i-get-multiple-errors">[Software] When compiling code, I get multiple errors such as "[library], needed by [library] not found" and "undefined reference to [library]".</h3>

#### Cause:
This occurs when you try to compile code on the login server. System-installed libraries are only for use on the execute servers, not the login server. When trying to use the modules, the compilation fails because the login server does not have the same libraries as the execut servers.
#### Solution:
Make sure you are compiling your code in an interactive job on the HPC.

<hr width="100%" size="2">

## Can't find your issue?
Visit our [Get Help](get-help) page.