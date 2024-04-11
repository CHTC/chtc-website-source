---
highlighter: none
layout: guide
title: "Overview: Software"
guide:
    order: 0
    category: Software Solutions
    tag:
        - htc
---
<script>
    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    function softwareDropdown() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
</script>
<a name="top"></a>
While our High Throughput system has little in the way of pre-installed software, 
we've created resources to help users set up the software they want to use for running their jobs.

{% capture content %}

[Quickstart](#quickstart)

[CHTC Recipes Repository](#chtc-recipes-repository)

[Containers](#containers)

{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Quickstart

Click the link in the table below to jump to the instructions for the language/program/software that you want to use.
More information is provided in the [CHTC Recipes Repository](#chtc-recipes-repository) and [Containers](#containers) sections.

<div class="dropdown">
    <button onclick="softwareDropdown" class="dropbtn"></button>
    <div id="softwareInfoDropdown" class="dropdown-content">
        <div markdown="1">{{ page.excerpt }}</div>
    </div>
</div>
<div class="dropdown">
    <button onclick="softwareDropdown" class="dropbtn"></button>
    <div id="softwareInfoDropdown" class="dropdown-content">
        <div markdown="1">{{ page.excerpt }}</div>
    </div>
</div>
<div class="dropdown">
    <button onclick="softwareDropdown" class="dropbtn"></button>
    <div id="softwareInfoDropdown" class="dropdown-content">
        <div markdown="1">{{ page.excerpt }}</div>
    </div>
</div>

<div class="dropdown">
    <button onclick="softwareDropdown" class="dropbtn"></button>
    <div id="softwareInfoDropdown" class="dropdown-content">
        <div markdown="1">{{ page.excerpt }}</div>
    </div>
</div>
<div class="dropdown">
    <button onclick="softwareDropdown" class="dropbtn"></button>
    <div id="softwareInfoDropdown" class="dropdown-content">
        <div markdown="1">{{ page.excerpt }}</div>
    </div>
</div>
<div class="dropdown">
    <button onclick="softwareDropdown" class="dropbt"></button>
    <div id="softwareInfoDropdown" class="dropdown-content">
        <div markdown="1">{{ page.excerpt }}</div>
    </div>
</div>