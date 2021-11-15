---
title: "Antimatter: Using HTC to study very rare processes" 
date: 2021-08-19T12:00:00+00:00
excerpt: Anirvan Shukla, a User School participant in 2016, spoke at this year's Showcase about how high throughput computing has transformed his research of antimatter in the last five years.
publish: true
image_src: images/Anirvan-Showcase-1.png
image_alt: Proton-proton collision
author: Josephine Watkins
--- 

By Josephine Watkins

<figure>
  <img src="{{ '/images/Anirvan-Showcase-1.png' | relative_url }}" alt="Proton-proton collision"/>
  <figcaption class="figure-caption">Two protons colliding. (Image credit: NA61/SHINE collaboration)<br/></figcaption>
</figure>


The final speaker at the [OSG User School Showcase](https://path-cc.io/news/2021-08-19-Showcase/) was Anirvan Shukla, a graduate student at the University of Hawai’i Mānoa, and this wasn’t his first school event. In 2016, Anirvan attended as a participant, but today he assumed the role of presenter and had the opportunity to explain how high throughput computing (HTC) has transformed his research in the last five years.

Anirvan studies antimatter and the extremely rare processes that produce it. Hypothetical dark matter decays into different matter and antimatter particles, like protons, antiprotons, deuterons, and anti-deuterons. When these particles are detected, they suggest that there may be dark matter inside or outside our galaxy. However, these matter and antimatter particles are also produced by the regular collisions of cosmic rays with the particles that make up the interstellar medium. 

Given their rarity, such events can only really be studied with simulations, where they’re still extremely rare. In order to determine whether antimatter particles can be attributed to the decay of dark matter –– or if they’re merely a product of regular cosmic interactions –– Anirvan would need to simulate trillions of collisions.

Leveraging what he learned at the OSG School, Anirvan knew he would only be able to tackle these computations using the capacity of the [Open Science Pool](https://opensciencegrid.org/about/open_science_pool/) (OSPool). Capturing the impact of the OSG’s computing resources, Anirvan attests, “this project definitely would not have been possible on any other cluster that I have access to.”

For instance, to observe antihelium particles, a researcher must simulate approximately 100 trillion events, in this case proton-proton collisions. One million of such events typically require about one CPU hour of computation. Therefore, a researcher needs roughly 100 million CPU hours in order to see a few antihelium particles –– that’s equal to 12,000 years on a single CPU. So, Anirvan divided his work into chunks of 10 hour jobs, each containing 10 million simulations. Within each job, the final output file was also analyzed and all the relevant data was extracted and placed in a histogram. This reduces the total size of the output files, which are then transferred over to the server at the University of Hawai’i by an automated workflow that Anirvan created with HTCondor’s DAGMan feature.

In his presentation at the OSG School, Anirvan noted that over the last two years, he submitted more than 8 million jobs to the OSPool and used nearly 50 million core hours. [The results](https://doi.org/10.1103/PhysRevD.102.063004) from his simulations generated a spectra that had never been produced before, shown below.

<figure>
  <img src="{{ '/images/Anirvan-Showcase-2.png' | relative_url }}" alt="Chart" width="500px" >
  <figcaption class="figure-caption">Image credit: Shukla, A. Datta, A. Doetinchem, P. Gomez-Coral, D. Kanitz, C. (2020). Large-scale simulations of antihelium production in cosmic-ray interactions. Phys. Rev. D. <a href="https://doi.org/10.1103/PhysRevD.102.063004">https://doi.org/10.1103/PhysRevD.102.063004</a><br/></figcaption>
</figure> 





If Anirvan had tried to run these simulations on his own laptop, he would still be searching for dark matter in the year 14,021. Even the available computing resources at [CERN](https://home.cern/) and the [University of Hawai’i](https://manoa.hawaii.edu/) weren’t enough for this colossal project –– the OSPool was necessary. 

...

*This article is part of a [series of articles](https://path-cc.io/news/2021-08-19-Showcase/) from the 2021 OSG Virtual School Showcase. [OSG School](https://opensciencegrid.org/virtual-school-2021/) is an annual education event for researchers who want to learn how to use distributed high throughput computing methods and tools. The Showcase, which features researchers sharing how HTC has impacted their work, is a highlight of the school each year.*
