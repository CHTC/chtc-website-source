---
highlighter: none
layout: content
title: Welcome to the CHTC GPU Lab
---

{% capture content %}

The CHTC GPU Lab was created by a <a href="https://research.wisc.edu/funding/uw2020/round-5-projects/enabling-graphics-processing-unit-based-data-science/">UW2020-funded project</a> to expand shared GPU 
computing infrastructure at UW-Madison.  It includes:

{% endcapture %}
{% include /components/markdown-container.html %}

<div class="uw-full-row uw-pad-tb uw-light-grer-bg">
	<div class="uw-row mw-1000">
		<div class="uw-card">
			<div class="uw-card-content">
				<img src="{{ '/uw-research-computing/guide-icons/noun_gpu_2528527.png' | relative_url }}" alt="Hardware Icon">
				<div class="uw-card-copy">
					<h2 class="uw-mini-bar">Hardware</h2>
                    <p>A pool of shared GPU servers managed by CHTC.</p>
				</div>
			</div>
		</div>
		<div class="uw-card">
			<div class="uw-card-content">
				<img src="{{ '/uw-research-computing/guide-icons/noun_people_1188645.png' | relative_url }}" alt="People Icon">
				<div class="uw-card-copy">
					<h2 class="uw-mini-bar">Expertise</h2>
                    <p>A community of technical experts.</p>
				</div>
			</div>
		</div>
		<div class="uw-card">
			<div class="uw-card-content">
				<img src="{{ '/uw-research-computing/guide-icons/noun_open book_1179297.png' | relative_url }}" alt="Book Icon">
				<div class="uw-card-copy">
					<h2 class="uw-mini-bar">Documentation</h2>
                    <p>A library of sharable software and documentation.</p>
				</div>
			</div>
		</div>
	</div>
</div>

{% capture content %}

## Get Involved

If you want to use GPU resources in CHTC for your research:

- Apply for a CHTC account if you do not already have one: [Account Request Page][account]
- See what GPUs are available and how to use them in the [GPU jobs guide][gpu-jobs].
- See our guide with specific machine learning related tips: [Running Machine Learning Jobs on HTC][ml-guide]
- For more extended examples, see the following: [GPU job templates on GitHub][gpu-examples].

The CHTC GPU Lab mailing list is used to announce new GPU hardware availability and
GPU-related events, solicit feedback from GPU users, and share best practices for
GPU computing in CHTC. Any CHTC user can subscribe to the list by
emailing [chtc-gpu-lab+managers@g-groups.wisc.edu](mailto:chtc-gpu-lab+managers@g-groups.wisc.edu)
and asking to join.
Their subscription request will be reviewed by the list administrators.

> The CHTC GPU Lab is led by Anthony Gitter, Christina Koch, Brian Bockelman, and Miron Livny.

> The original UW2020 project was led by Anthony Gitter, Lauren Michael, Brian Bockelman, and Miron Livny and
funded by the Office of the Vice Chancellor for Research and Graduate
Education and the Wisconsin Alumni Research Foundation.

For more information about the CHTC GPU Lab project contact [Anthony Gitter][gitter].

[account]: form.html
[gpu-examples]: https://github.com/CHTC/templates-GPUs
[gpu-jobs]: gpu-jobs.html
[gitter]: https://www.biostat.wisc.edu/~gitter/index.html
[ml-guide]: machine-learning-htc.html
[uw2020]: https://research.wisc.edu/funding/uw2020/round-5-projects/enabling-graphics-processing-unit-based-data-science/

{% endcapture %}
{% include /components/markdown-container.html %}
        


