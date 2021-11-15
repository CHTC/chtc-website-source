---
title: "Using HTC for a simulation study on cross-validation for model evaluation in psychological science" 
date: 2021-08-19T12:00:00+00:00
excerpt: During the OSG School Showcase, Hannah Moshontz, a postdoctoral fellow at UW-Madison’s Department of Psychology, described her experience of using high throughput computing (HTC) for the very first time, when taking on an entirely new project within the field of psychology.
publish: true
image_src: images/Hannah-Showcase.jpg
image_alt: Brain Model
author: Josephine Watkins
--- 

By Josephine Watkins

<figure>
  <img src="{{ '/images/Hannah-Showcase.jpg' | relative_url }}" alt="Brain Model"/>
  <figcaption class="figure-caption">Image by Robina Weermeijer on Unsplash<br/></figcaption>
</figure>


During the [OSG School Showcase](https://path-cc.io/news/2021-08-19-Showcase/), Hannah Moshontz, a postdoctoral fellow at UW-Madison’s Department of Psychology, described her experience of using high throughput computing (HTC) for the very first time, when taking on an entirely new project within the field of psychology. While Hannah’s research generally focuses on understanding goal pursuit in everyday life, she and her colleagues had noticed that  there seemed to be a lack of “best practices” for evaluating the quality of results from the field's recent integration of machine learning approaches.

Describing the motivation behind the project, Hannah explains: “We were seeing a lot of published papers in top outlets that were incorrectly understanding and interpreting cross-validated model performance estimates. These models were described as usable for making diagnoses and clinical decisions.” This project, a simulation study, aimed to understand cross-validated performance estimates in psychology, and give guidance on how future psychological science researchers should use cross validation in their data.

While a typical machine learning study entails running tens of thousands models –– Hannah’s study required 144,000 times this number in order to evaluate results from numerous studies. With the total estimated compute time for the project being over one million hours, Hannah understood from the beginning that “high throughput computing was going to be essential.”

The [Center for High Throughput Computing](https://chtc.cs.wisc.edu/) at UW-Madison worked with Hannah to help get her team’s simulations distributed on the [Open Science Pool](https://opensciencegrid.org/about/open_science_pool/). Hannah used the programming software R to simulate data and train, select, and evaluate machine learning models. The output from each simulation batch came in the form of a zipped file that included a summary of the best model performance along with information about the model. Throughout the process, Hannah and her team tracked jobs in a spreadsheet to stay organized.

Reflecting on the impact of HTC on the study as a whole, she reasons, “without HTC, we couldn't have conducted this study in my lifetime.” While this project was Hannah’s first taste of HTC, today she’s integrated it into many different facets of her work.

...

*This article is part of a [series of articles](https://path-cc.io/news/2021-08-19-Showcase/) from the 2021 OSG Virtual School Showcase. [OSG School](https://opensciencegrid.org/virtual-school-2021/) is an annual education event for researchers who want to learn how to use distributed high throughput computing methods and tools. The Showcase, which features researchers sharing how HTC has impacted their work, is a highlight of the school each year.*

