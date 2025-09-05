---
highlighter: none
layout: guide
title: "Staging directory transition"
guide:
    category: General
    tag:
        - htc
--- 

## Announcement

This fall, we are transitioning to a new directory structure for personal staging directories. **This affects all users on the HTC system**.

Personal staging directories will now be located in **alphabetized subdirectories** based on the first letter of your NetID. For example:


| Previous `/staging` directory path | New `/staging` directory path |
| --- | --- |
| `/staging/netid` | `/staging/n/netid` |
| `/staging/bucky` | `/staging/b/bucky` |

Group `/staging` directories are not affected, and will remain in the `/staging/groups` subdirectory.

## Transition timeline and process

We will start transitioning users' personal `/staging` directories to this new structure **starting Thursday, September 11, 2025**.

CHTC will:

1. Copy your files to your new `/staging` directory.
2. Create a symlink at your previous `/staging` directory path that points to the new `/staging` directory path.

We will complete this transition on **Wednesday, December 31** and delete all symlinks.

### What you should do

If you have an existing `/staging` directory, **between September 11 and December 31**, please review all your files that reference your `/staging` directory. This may include but are not limited to:

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

## Get support

If you have questions or concerns, please email us at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu).