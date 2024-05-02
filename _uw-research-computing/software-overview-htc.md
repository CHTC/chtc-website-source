---
highguideer: none
layout: guide
title: "Overview: Software"
guide:
    order: 0
    category: Software Solutions
    tag:
        - htc
---
<script>
function showExcerpt(id, sideDividerClass, buttonId) {
    console.log("Button clicked with ID:", id);
    
    // Hide all excerpts
    var excerpts = document.querySelectorAll('.excerpt');
    excerpts.forEach(function(excerpt) {
        excerpt.style.display = 'none';
    });

    // Show specific excerpt with sidebar
    var specificExcerpt = document.getElementById(id);
    var sideDivider = document.querySelector('.' + sideDividerClass);
    if (specificExcerpt && sideDivider) {
        console.log("Showing excerpt for ID:", id);
        specificExcerpt.style.display = 'block';
        sideDivider.style.display = 'block';
        var btn = document.getElementById(buttonId);
        if (btn) {
            btn.style.backgroundColor ='#F9E6E7'; // Set background color
            btn.style.borderColor = '#B1050B'; // Set border color
        }
    } else {
        console.log("No excerpt found for ID:", id);
    }

    var buttons = document.querySelectorAll('.btn-guide');
    buttons.forEach(function(btn) {
        btn.style.backgroundColor = '#f8f9fa'; // Reset background color
        btn.style.borderColor = '#e2e6ea'; // Reset border color
    });
    // Add button colors to clicked button
    event.currentTarget.style.backgroundColor = '#F9E6E7'; // Set background color on click
    event.currentTarget.style.borderColor = '#B1050B'; // Set border color on click
}

document.addEventListener('DOMContentLoaded', function() {
    // Call showExcerpt function for Python button
    showExcerpt('running-python-jobs', 'side-divider');
});
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

<div class="card-body">
    <button class="btn btn-guide mb-lg-0 active" onclick="showExcerpt('running-python-jobs', 'side-divider')"><img src="/uw-research-computing/guide-icons/python-icon.png" alt="pythonlogo"> Python</button>
    <button class="btn btn-guide mb-lg-0" href="#quickstart" onclick="showExcerpt('running-java-jobs', 'side-divider')"><img src="/uw-research-computing/guide-icons/java-icon.png" alt="javalogo"> Java</button>
    <button class="btn btn-guide mb-lg-0" href="#quickstart" onclick="showExcerpt('running-r-jobs', 'side-divider')"><img src="/uw-research-computing/guide-icons/r-icon.png" alt="rlogo"> R</button>
    <button class="btn btn-guide mb-lg-0" href="#quickstart" onclick="showExcerpt('running-julia-jobs', 'side-divider')"><img src="/uw-research-computing/guide-icons/julia-icon.png" alt="julialogo"> Julia</button>
    <button class="btn btn-guide mb-lg-0" href="#quickstart" onclick="showExcerpt('running-matlab-jobs', 'side-divider')"><img src="/uw-research-computing/guide-icons/matlab-icon.png" alt="matlablogo"> Matlab</button>
    <button class="btn btn-guide mb-lg-0" href="#quickstart" onclick="showExcerpt('create-a-portable-python-installation-with-miniconda', 'side-divider')"><img src="/uw-research-computing/guide-icons/miniconda-icon.png" alt="minicondalogo"> Miniconda</button>
</div>
  <div class="card-body side-divider">
      {% for page in site.uw-research-computing %}
        {% if page.link == 'software' %}
            <div class="excerpt" id="{{ page.title | slugify }}" style="display: none;">
              {{ page.excerpt | markdownify }}
              <a href="{{ page.url }}" style="font-weight: bold; text-decoration: underline;">More Information</a>
            </div>
        {% endif %}
    {% endfor %}
    </div>