---
highlighter: none
layout: guide
title: "Staging directory transition"
guide:
    category: General
    tag:
        - htc
--- 


<p style="text-align:center"><img src="/images/staging-transition.svg" alt="Illustration of the `/staging` directory structure transition. On the left hand panel, the `/staging` directories has the subdirectories `alice`, `alison`, `bucky`, and `cathy`. An arrow points to the right hand panel, which has the `/staging` directory with the subdirectories `a`, `b`, and `c`. Subdirectories `alice` and `alison` are in the `a` subdirectory, `bucky` in the `b` subdirectory, and `cathy` in the `c` subdirectory." width=500px></p>
<p style="text-align:center"><caption>Illustration of the <code>/staging</code> directory structure transition.</caption></p>


## Transition to a new `/staging` directory structure

Starting Thursday, September 11, 2025, we are transitioning to a new directory structure for personal staging directories. **This affects all users on the HTC system**.

Personal staging directories will now be located in **alphabetized subdirectories** based on the first letter of your NetID. For example:


| Previous `/staging` directory path | New `/staging` directory path |
| --- | --- |
| `/staging/netid` | `/staging/n/netid` |
| `/staging/bucky` | `/staging/b/bucky` |

Group `/staging` directories are not affected and will remain in the `/staging/groups` subdirectory.

## Transition process

CHTC will:

1. Copy your files to your new `/staging` directory.
2. Create a [symlink](https://en.wikipedia.org/wiki/Symbolic_link) at your previous `/staging` directory path that points to the new `/staging` directory path.

## Timeline

* **September 11, 2025**. Transition begins. Users may begin using their new `/staging` directory.
* **December 31, 2025**. Transition ends. Symlinks at previous `/staging` directory paths will be deleted.

## What you should do

If you have an existing `/staging` directory, **between September 11 and December 31**, please review all your files that reference your `/staging` directory. This may include but is not limited to:

* HTCondor submit files
* Executables and scripts
* Environment variables
* DAGMan files

Please change any reference to your personal `/staging` directory to the new path.

For example, in an HTCondor submit file, change:

```
container_image = osdf:///chtc/staging/netid/my-container.sif
```

to:

```
container_image = osdf:///chtc/staging/n/netid/my-container.sif
```

## Why we are transitioning

Our `/staging` directories are backed by the Ceph File System, which has [slower performance when it must load very large directories](https://docs.ceph.com/en/reef/cephfs/app-best-practices/#very-large-directories). To mitigate large loads on the file system, we are sorting users personal `/staging` directories into alphabetized subdirectories. 

## Get support

If you have questions or concerns, please email us at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu).