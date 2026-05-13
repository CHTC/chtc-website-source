---
highlighter: none
layout: guide
title: Use CST
guide:
    category: Software
    tag:
        - htc
---

## Introduction

This guide describes how to run jobs that use CST 2025 on CHTC's high throughput computing (HTC) system.

{% capture content %}
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Running CST](#running-cst)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Prerequisites

You must belong to an approved research group in the ECE department. Contact [CHTC facilitators](mailto:chtc@cs.wisc.edu) for more information.

## Running CST

In your submit file, add:

```
container_image = /software/groups/ece_cst/cst2025.sif
transfer_container = false
requirements = (HasCHTCSoftware == true)
```

In your executable script, to run CST, use:

```
cst_design_environment <arguments>
```

## Related pages
* [Licensed software](licensed-software)