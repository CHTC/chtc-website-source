---
title: "Scaling virtual screening to ultra-large virtual chemical libraries" 
date: 2021-08-19T12:00:00+00:00
excerpt: Kicking off last week’s OSG User School Showcase, Spencer Ericksen, a researcher at the University of Wisconsin-Madison’s Carbone Cancer Center, described how high throughput computing (HTC) has made his work in early-stage drug discovery infinitely more scalable.
publish: true
image_src: images/Spencer-Showcase.jpg
image_alt: Liquid Handler
author: Josephine Watkins
--- 

By Josephine Watkins

<figure>
  <img src="{{ '/images/Spencer-Showcase.jpg' | relative_url }}" alt="Liquid Handler"/>
  <figcaption class="figure-caption">Image by the National Cancer Institute on Unsplash<br/></figcaption>
</figure>


Kicking off last week’s [OSG User School Showcase](https://path-cc.io/news/2021-08-19-Showcase/), Spencer Ericksen, a researcher at the University of Wisconsin-Madison’s Carbone Cancer Center, described how high throughput computing (HTC) has made his work in early-stage drug discovery infinitely more scalable. Spencer works within the Small Molecule Screening Facility, where he partners with researchers across campus to search for small molecules that might bind to and affect the behavior of proteins they study. By using a computational approach, Spencer can help a researcher inexpensively screen many more candidates than possible through traditional laboratory approaches. With as many as [10<sup>33</sup> possible molecules](https://doi.org/10.1007/s10822-013-9672-4), the best binders from computational ‘docking’ might even be investigated as potential drug candidates.

With traditional laboratory approaches, researchers might test just 100,000 individual compounds using liquid handlers like the one pictured above. However, this approach is expensive, imposing limits both on the number of molecules tested and the number of researchers able to pursue potential binders of the proteins they study.

Spencer’s use of HTC allows him to take a different approach with virtual screening. By using computational models and machine learning techniques, he can inexpensively filter the masses of molecules and predict which ones will have the highest potential to interfere with a certain biological process. This reduces the time and money spent in the lab by selecting a subset of binding candidates that would be best to study experimentally. 

“HTC is a fabulous resource for virtual screening,” Spencer attests. “We can now effectively validate, develop, and test virtual screening models, and scale to ever-increasing ultra-large virtual chemical libraries.” Today, Spencer is able to screen approximately 3.5 million molecules each day thanks to HTC.

There are a variety of virtual screening programs, but none of them are all that reliable individually. Instead of opting for a single program, Spencer runs several programs on the [Open Science Pool](https://opensciencegrid.org/about/open_science_pool/) (OSPool) and calculates a consensus score for each potential binder. “It’s a pretty old idea, basically like garnering wisdom from a council of fools,” Spencer explains. “Each program is a weak discriminator, but they do it in different ways. When we combine them, we get a positive effect that's much better than the individual programs. Since we have the throughput, why not run them all?”

And there’s nothing stopping the Small Molecule Screening Facility from doing just that. Spencer’s jobs are independent from each other, making them “pleasantly parallelizable” on the OSPool’s distributed resources. To maximize throughput, Spencer splits the compound libraries that he’s analyzing into small increments that will run in approximately 2 hours, reducing the chances of a job being evicted and using the OSPool more efficiently.

...

*This article is part of a [series of articles](https://path-cc.io/news/2021-08-19-Showcase/) from the 2021 OSG Virtual School Showcase. [OSG School](https://opensciencegrid.org/virtual-school-2021/) is an annual education event for researchers who want to learn how to use distributed high throughput computing methods and tools. The Showcase, which features researchers sharing how HTC has impacted their work, is a highlight of the school each year.*
