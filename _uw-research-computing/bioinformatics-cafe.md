---
highlighter: none
layout: content
title: Bioinformatics Café @ CHTC
---

{% capture content %}

<img src="/images/20240308_Morgridge_3767_2x1.jpg" alt="People having a discussion with their laptops open">

## Connect and find resources with the Bioinformatics community

Insert information about the bioinformatics community here. Have a heart-warming blurb! Please stop using the HPC for HTC tasks.

ETCETERA

ETCETERA

ETCETERA

{% endcapture %}
{% include /components/markdown-container.html %}


<div class="container-xxl">
    <div class="row justify-content-center ">
        <div class="col-sm-3 mw-1000">
            <div class="h-100 uw-card d-flex flex-direction-column mb-auto">
                <div class="uw-card-content">
                    <img src="{{ '/uw-research-computing/guide-icons/noun_open book_1179297.png' | relative_url }}" alt="Book Icon" style="max-height: 200px">
                    <div class="uw-card-copy">
                        <h2 class="uw-mini-bar">Resources</h2>
                        <p>Add Links here:</p>
                        <ul>
                        <li>item 1</li>
                        <li>item 2</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-3 mw-1000">
            <div class="h-100 uw-card d-flex flex-direction-column mb-auto">
                <div class="uw-card-content">
                    <img src="{{ '/uw-research-computing/guide-icons/noun_people_1188645.png' | relative_url }}" alt="People Icon" style="max-height: 200px">
                    <div class="uw-card-copy">
                        <h2 class="uw-mini-bar">Community</h2>
                        <p>Join our community!</p>
                        <p>Add Links here:</p>
                        <ul>
                        <li>item 1</li>
                        <li>item 2</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-3 mw-1000">
            <div class="h-100 uw-card d-flex flex-direction-column mb-auto">
                <div class="uw-card-content">
                    <img src="{{ '/uw-research-computing/guide-icons/calendar-text.svg' | relative_url }}" alt="Calendar icon" style="max-height: 200px">
                    <div class="uw-card-copy">
                        <h2 class="uw-mini-bar">Upcoming events</h2>
                        {% include get/future_events.liquid %}
                        {% assign biocafe_events = future_events | where: "tags", "bioinformatics-cafe" %}
                        {% for event in biocafe_events limit:2 %}
                            {% include event/event-card.html %}
                        {% endfor %}
                        <p><a href="/events">See all events</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{% capture content %}

## Get Involved

Add extra text down here

{% endcapture %}
{% include /components/markdown-container.html %}
        


