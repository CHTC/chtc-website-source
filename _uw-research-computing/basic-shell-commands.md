---
highlighter: none
layout: guide
title: "Quick reference: Basic shell commands"
alt_title: "Quick reference: Basic shell commands"
guide:
    category: Get started
    tag:
        - htc
        - hpc
---

## Introduction

This page contains quick references for basic shell commands and links to more detailed resources. You should learn basic shell commands to navigate directories and modify files on CHTC systems. Reference this page to learn or refresh your knowledge of shell commands.

{% capture content %}
- [Introduction](#introduction)
- [Learn about the command line](#learn-about-the-command-line)
- [Quick reference: Basic shell commands](#quick-reference-basic-shell-commands)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Learn about the command line
### Why should you learn about the command line?

If you haven't used the command line before, it may be challenging to get started. However, we strongly recommend learning more about the command line for multiple reasons:

* You only need to know **a few basic commands** to submit jobs.
* With practice, using the command line is **significantly faster and much more powerful** than using a point-and-click graphic interface.
* Command line skills are useful for more than just large-scale computing!

> ### For beginning users: Get started with the command line
{:.tip-header}

> For a good overview of command line tools, see the [Software Carpentry Unix Shell](http://swcarpentry.github.io/shell-novice/) lesson. We recommend that you learn how to:
> 
> -   [understand the filesystem and how to navigate it](https://swcarpentry.github.io/shell-novice/02-filedir.html)
> -   [use tab-completion](https://swcarpentry.github.io/shell-novice/02-filedir.html#nelles-pipeline-organizing-files)
> -   [create files](https://swcarpentry.github.io/shell-novice/03-create.html)
> -   [use the star wildcard](https://swcarpentry.github.io/shell-novice/04-pipefilter.html)
> -   [write shell scripts](https://swcarpentry.github.io/shell-novice/06-script.html)
{:.tip}


## Quick reference: Basic shell commands
Note: Bracketed items (`<>`) denote where to place your input. *Do not* include the brackets in your command.

### Navigate directories

| Command | Use | Notes |
| --- | --- | --- |
| `cd <path/to/directory>` | changes current directory to `path/to/directory` | `.` - the current directory |
| | | `..` - one level above the current directory |
| | | `~` - your home directory (`/home/username/`) |
| `pwd` | prints path of the working (current) directory |
| `ls <directory>` | lists files in `directory` | `-lh` prints human-readable information |
| `ls` | list files in current directory | `-a` prints hidden files |
| `mkdir <directory>` | creates a directory |
| `rmdir <directory>` | removes a directory (must be empty) |

### Inspect files

| Command | Use |
| --- | --- |
| `cat <file>` | prints contents of `file` |
| `less <file>` | views contents of `file` (similar to `vim`, but without edit capabilities) |
| `head <file>` | prints the first ten lines of `file` |
| `tail <file>` | prints the last ten lines of `file` |
| `grep <phrase> <file>` | grabs and prints every instance of `phrase` in `file` |

### Edit files

| Command | Use | Notes |
| --- | --- | --- |
| `nano <file>` | opens or creates `file` in the `nano` text editor | [cheatsheet for nano commands](https://www.nano-editor.org/dist/latest/cheatsheet.html) |
| `vim <file>` or `vi <file>` | opens or creates `file` in the `vim` text editor | [cheatsheet for vim commands](https://vimsheet.com/) |

### Copy, move, and remove files

| Command | Use |
| --- | --- |
| `cp <file1> <file2>` | copies `file1` to `file2` |
| `mv <file1> <file2>` | moves or renames `file1` to `file2` |
| `rm <file1>` | removes `file1` |
| `scp <file> <destination>` | moves files between machines. See how to [transfer files to/from your local computer](transfer-files-computer) |

### Wildcards

| Wildcard | Use | Notes |
| --- | --- | --- |
| `?` | matching any character | Example: `rm ?.txt` removes `1.txt` and `b.txt` but not `24.txt` | 
| `*` | matching any characters of any length | Example: `rm *.txt` removes all files with the `.txt` extension |

[Read more](https://tldp.org/LDP/GNU-Linux-Tools-Summary/html/x11655.htm) about wildcards.

### Other commands

| Commmand | Use | Notes |
| --- | --- | --- |
| `echo <$var>` | prints the value of `$var` | Example: `echo $PWD` returns the current directory |
| `chmod +x` | adds executable permissions to a file |

## Related pages

Browse these resources for learning basic shell commands and the command line.

* [Cornell Virtual Workshop: An Introduction to Linux](https://cvw.cac.cornell.edu/linux/intro/index)
* [Software Carpentry Unix Shell](http://swcarpentry.github.io/shell-novice/)
* [Ubuntu tutorial: The Linux command line for beginners](https://ubuntu.com/tutorials/command-line-for-beginners#1-overview)
* [Unix/Linux Command Reference cheat sheet](https://files.fosswire.com/2007/08/fwunixref.pdf)