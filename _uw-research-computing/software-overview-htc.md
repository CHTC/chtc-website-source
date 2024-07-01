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
<script type="text/javascript" src="{{ '/assets/js/pages/software-overview.js' | relative_url }}" defer></script>

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

<div class="row no-gutters">
{% for page in site.uw-research-computing %}
    {% if page.software_icon.size > 0 %}
        <div class="col col-6 col-md-2 no-gutters">
        <button class="btn btn-guide mb-lg-0 {% if page.software_icon.first %}btn-guide-highlighted{% endif %}" href="#quickstart" onclick="showExcerpt('{{ page.title | slugify }}', 'side-divider')"><img class="img-btn-guide" src="{{ page.software_icon }}" alt="{{ page.title }}">{{ page.software }}</button>
        </div>
    {% endif %}
{% endfor %}
</div>

  <div class="card-body side-divider" style="display: block;">
      {% for page in site.uw-research-computing %}
        {% if page.software_icon.size > 0 %}
            <div class="excerpt" id="{{ page.title | slugify }}" style="display: {% if forloop.first %}block{% else %}none{% endif %};">
              {{ page.excerpt | markdownify }}
              <a href="{{ page.url }}" style="font-weight: bold; text-decoration: underline;">More Information</a>
            </div>
        {% endif %}
    {% endfor %}
    </div>