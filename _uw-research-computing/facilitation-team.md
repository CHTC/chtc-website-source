---
highlighter: none
layout: markdown-page
title: The Facilitation Team
---

## Meet CHTC's Research Computing Facilitators

<div class="row justify-content-around d-none d-sm-flex">
    {% assign facilitators = site.data.team | where: "is_facilitator", "1" %}
    {% for facilitator in facilitators %}
        <div class="col-auto">
            <figure class="p-3 d-flex flex-column">
                <img style="object-fit: cover; border-radius: 50%; width: 12rem; height: 12rem" class="mx-auto" src="/staff-list/{{ facilitator.image | relative_url}}" alt="{{ facilitator.name}}'s Headshot">
                <figcaption class="mt-1 text-center"><b>{{ facilitator.name }}</b><br>{{facilitator.title}}</figcaption>
            </figure>
        </div>
    {% endfor %}
</div>

## What We Do

To help researchers effectively utilize computing resources, our
Research Computing Facilitators (RCFs) not only assist in implementing
computational work on CHTC compute resources resources, but can also
point researchers to other on- and off-campus services related to
research computing and data needs. Our primary activities include the
following.

## Regular Support

We are available to answer questions via an email “ticket” system. We
aim to provide a first response (although not necessarily a solution!)
within 1-2 business days.

In addition to email, we host drop-in “office hours” online twice a
week. No appointment is needed, just show up during the available times!

To email us or drop by office hours, see the information on our [get
help page](get-help.html).

## Course and Group Visits 

The Facilitation Team is
available to provide guest lectures and introductory presentations to
campus courses, regular department or program seminars, or individual
lab group meetings.

* [UW Statistics Course Using CHTC](https://chtc.cs.wisc.edu/Gillett.html)

## Training

The Facilitation Team offers occasional training sessions for CHTC
users. Upcoming training events are announced via the CHTC Users email
list and are listed on the CHTC events page:

* [Upcoming Events](https://chtc.cs.wisc.edu/events.html)

## Other Events 

Are you hosting an
event where the audience might benefit from CHTC services? Let us know
at chtc@cs.wisc.edu.

