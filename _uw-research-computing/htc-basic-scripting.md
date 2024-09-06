---
highlighter: none
layout: guide
title: "Basic scripting with arguments"
guide:
    order: 2
    category: Job Submission
    tag:
        - htc
---
<script type="text/javascript" src="{{ '/assets/js/pages/software-overview.js' | relative_url }}" defer></script>

{% capture content %}

- [Purpose](#purpose)
- [What is an argument?](#what-is-an-argument)
- [What is a wrapper script, and why should I write one?](#what-is-a-wrapper-script-and-why-should-i-write-one)
- [Using arguments in different programming languages](#using-arguments-in-different-programming-languages)
- [Next steps](#next-steps)
- [See also](#see-also)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Purpose

Many executables require arguments to perform tasks. This page shows you basic examples of how different programming languages take arguments, and how wrapper scripts can be written to pass arguments.

## What is an argument?

In a computational workflow, how do you tell the computer what script to run, what data file to read, or which parameters to use? These inputs are typically passed as *arguments*, which your program is configured to read.

For example, on the command line, the `sleep` program takes in one argument, a non-negative number, then pauses for that number of seconds. If we run the following code,
```
sleep 60
```
the computer pauses for 60 seconds. In this example:
* `sleep` is the executable.
* `60` is the argument.

## What is a wrapper script, and why should I write one?

While the above example is simple, what if you need something more complex, like a workflow? Your workflow might need some pre- or post-processing, if/else statements, or iterations.

> **Wrapper scripts** are a way to package simple computational workflows in one executable script, allowing computations to be run in noninteractive batches.

## Using arguments in different programming languages

Let's see how different programming languages might take an argument. Each tab contains different expressions of simple program, `echo-next`, that prints our next argument (we'll use `data.csv`) to the terminal. Example wrapper scripts and HTCondor submit files are also included.

<div class="shadow p-3 border rounded">
    <div class="row gx-1">
        {% assign pages = site.uw-research-computing | where_exp: "x", "x.basic_scripting" %}
        {% for page in pages %}
            <div class="col col-6 col-md-2">
               <button class="btn btn-guide mb-lg-0 d-flex flex-column {% if forloop.first %}btn-guide-highlighted{% endif %}" href="#code" onclick="showExcerpt('{{ page.title | slugify }}', 'side-divider')">
                  <img class="img-btn-guide mx-auto" src="{{ page.icon }}" alt="{{ page.title }}">
                  <span class="mx-auto">{{ page.software }}</span>
               </button>
            </div>
        {% endfor %}
    </div>
    <div class="card-body side-divider" style="display: block;">
        {% for page in pages %}
            <div class="excerpt" id="{{ page.title | slugify }}" style="display: {% if forloop.first %}block{% else %}none{% endif %};">
                {{ page.excerpt | markdownify }}
            </div>
        {% endfor %}
    </div>
</div>

## Next steps
Practice with a more complex example, including submitting multiple jobs with different arguments: [Practice: Passing Arguments from the Submit File to the Executable Script](htc-passing-arguments)

## See also
* [Submitting Multiple Jobs Using HTCondor](multiple-jobs)
* [Overview: How to Use Software](software-overview-htc)