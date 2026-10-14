---
layout: guide
title: Use CST
guide:
  category: Software
  tag:
    - htc
description: >-
  This guide describes how to run jobs that use CST 2025 on CHTC's high
  throughput computing (HTC) system.
legacy_url: /uw-research-computing/cst.html
---
## Introduction

This guide describes how to run jobs that use CST 2025 on CHTC's high throughput computing (HTC) system.


<div class="uw-toc">
<p class="uw-toc-title">Table of Contents</p>

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Running CST](#running-cst)
- [Related pages](#related-pages)

</div>


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
* [Licensed software](/uw-research-computing/licensed-software/)
