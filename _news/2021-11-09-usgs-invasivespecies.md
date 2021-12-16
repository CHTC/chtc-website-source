---
title: "Protecting ecosystems with HTC" 
date: 2021-11-09T12:00:00+00:00
excerpt: Researchers at the USGS are using HTC to pinpoint potential invasive species for the United States.
image_src: images/USGS-collage.jpg
image_alt: Sattelite image collage graphic
author: Josephine Watkins
---   

***Researchers at the USGS are using HTC to pinpoint potential invasive species for the United States.***

By Josephine Watkins

<figure>
  <img src="{{ '/images/USGS-collage.jpg' | relative_url }}" alt="Sattelite image collage graphic"/>
  <figcaption class="figure-caption">From left to right: Mississippi River Delta, Colorado Rocky Mountains, Kansas’s Milford Lake. Images by <a href="https://unsplash.com/@usgs">USGS on Unsplash.</a><br/></figcaption>
</figure>  


Benjamin Franklin famously advised that an ounce of prevention is worth a pound of cure, and researcher [Richard Erickson](https://www.usgs.gov/staff-profiles/richard-erickson?qt-staff_profile_science_products=0#qt-staff_profile_science_products) has taken this advice to heart in his mission to protect our lakes and wildlife from invasive species. As a research ecologist at the United States Geological Survey’s (USGS) Upper Midwest Environmental Sciences Center, Erickson uses computation to identify invasive species before they pose a threat to U.S. ecosystems. 

Instrumental to his preventative mission is the [HTCondor Software Suite](https://research.cs.wisc.edu/htcondor/) (HTCSS) and consulting from UW-Madison’s [Center for High Throughput Computing](https://chtc.cs.wisc.edu/) (CHTC), which have been integral to the USGS’s in-house computing infrastructure. Equipped with the management capabilities of HTCSS and guidance from CHTC, Erickson recently completed a high-throughput horizon scan of over 8000 different species in less than two days. 

Explaining how his team was able to accomplish such a feat in merely one weekend, Erickson reasons: ”High throughput computing software allows [big problems] to be broken into small jobs. Rather than having to worry about everything, I just have to worry about a small thing, and then high throughput computing does the small thing many times over, to solve big problems through small steps.”

Erickson’s big problem first began to take shape in 2020 when the [U.S. Fish and Wildlife Service](https://www.fws.gov/) (FWS) provided the USGS with a list of over 8000 species currently being bought and sold in the United States, from Egyptian Geese, to Algerian hedgehogs, to Siberian weasels. If these animals proliferate in U.S. environments, they could potentially threaten native species, the ecosystem as a whole, and the societal and economic value associated with it. Erickson’s job? To determine which species are a threat, and to what areas –– a tall order when faced with 8000 unique species and roughly 900 different ecological regions across the United States.

With HTC, Erickson could approach this task by breaking it down into small, manageable steps. Each species was independent of one another, meaning that the colossal collection of 8000 plants and animals could be organized into 8000 different jobs for HTCSS to run in parallel. Each job contained calculations comparing the US and non-US environments across sixteen different climate metrics. Individually, the jobs took anywhere from under thirty minutes to over two hours to run.  

To analyze this type of data, the team created their own R package, [climatchR](https://doi.org/10.5066/P9Q28JVU). The package was released to the public in early September, and the team plans to make their HTCondor code publicly available after it undergoes USGS review.

But the HTC optimization didn’t end there. Because the project also required several complex GIS software dependencies, the group used Docker to build a container that could hold the various R and GIS dependencies in the context of a preferred operating system. Such containers make the software portable and consistent between diverse users and their computers, and can also be easily distributed by HTCSS to provide a consistent and custom environment for each computed job running across a cluster.

By the end of their computing run, the 8000 jobs had used roughly a year of computing in less than two days. The output included a climate score between zero and ten for each of the 8000 species, corresponding to how similar a species’ original climate is to the climates of the United States.

Currently, different panels of experts are reviewing species with climate scores above 6 to determine which of them could jeopardize US ecosystems. This expert insight will inform FWS’s regulation and management of the species traded in the United States, ultimately preventing the arrival of those that are likely to be invasive.

Invasive species disrupt ecological interactions, contributing to the population decline and extinction of native species. But beyond their environmental consequences, these non-native species impact property values, tourism activities, and agricultural yields. Hopefully, the results of Erickson’s high-throughput horizon screen will prevent these costs before they’re endured –– all by using HTC to solve big problems, through small steps.

… 

*Erickson co-authored an open-access [tutorial](https://doi.org/10.1371/journal.pcbi.1006468) to help other environmental scientists and biologists who are getting started with HTCondor.
Erickson’s team hopes to make the results from this project publicly available in 2022.*
