---
highlighter: none
layout: guide
title: Basic shell commands
alt_title: Basic shell commands
guide:
    order: 4
    category: Basics and Policies
    tag:
        - htc
        - hpc
---

# Introduction



{% capture content %}

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

# Basic shell commands (quick reference)

## Navigate directories

| Command | Use | Notes |
| --- | --- | --- |
| `cd <directory>` | change current directory to `directory` | `.` - the current directory |
| | | `..` - one level above the current directory |
| | | `~` - your home directory (`/home/username/`) |
| `pwd` | prints path of the working (current) directory |
| `ls` | list files in current directory| `-lh` prints human-readable information |
| | | `-a` prints hidden files |
| `mkdir <directory>` | creates a directory |
| `rmdir <directory>` | removes a directory (must be empty) |

## Inspect files

| Command | Use | Notes |
| `cat <file>` | prints contents of `file` |
| `head <file>` | prints the first ten lines of `file` |
| `tail <file>` | prints the last ten lines of `file` |
| `grep <phrase> <file>` | grabs and prints every instance of `phrase` in `file` |

## Edit files

| Command | Use |
| `nano <file>` | opens or creates `file` in the `nano` text editor |
| `vim <file>` | opens or creates `file` in the `vim` text editor |

## Copy, move, and remove files

| Command | Use |
| `cp <file1> <file2>` | copies `file1` to `file2` |
| `mv <file1> <file2>` | moves or renames `file1` to `file2` |
| `rm <file1>` | removes `file1` |

# Learn about the command line

**Why learn about the command line?** If you haven\'t used the command
line before, it might seem like a big challenge to get started, and
easier to use other tools, especially if you have a Windows computer.
However, we strongly recommend learning more about the command line for
multiple reasons:

-   You can do most of what you need to do in CHTC by learning a few
    basic commands.
-   With a little practice, typing on the command line is significantly
    faster and much more powerful than using a point-and-click graphic
    interface.
-   Command line skills are useful for more than just large-scale
    computing.

For a good overview of command line tools, see the [Software Carpentry
Unix Shell](http://swcarpentry.github.io/shell-novice/) lesson. In
particular, we recommend the sections on:

-   understanding the filesystem and how to navigate it ([Navigating
    Files and Directories](https://swcarpentry.github.io/shell-novice/02-filedir.html))
-   tab-completion (section entitled \"Nelle\'s Pipeline, Organizing
    Files\", in [Navigating Files and
    Directories](https://swcarpentry.github.io/shell-novice/02-filedir.html))
-   creating files ([Working With Files and
    Directories](https://swcarpentry.github.io/shell-novice/03-create.html))
-   using the star wildcard (first part of [Pipes and
    Filters](https://swcarpentry.github.io/shell-novice/04-pipefilter.html))
-   writing shell scripts ([Shell
    Scripts](https://swcarpentry.github.io/shell-novice/06-script.html))

