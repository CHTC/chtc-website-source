---
title: "Harnessing HTC-enabled precision mental health to capture the complexity of smoking cessation" 
date: 2021-12-16T12:00:00+00:00
excerpt: Collaborating with CHTC research computing facilitation staff, UW-Madison researcher Gaylen Fronk is using HTC to improve cigarette cessation treatments by accounting for the complex differences among patients.
image_src: images/Gaylen-Fronk-square.jpg
image_alt: Gaylen Fronk
author: Josephine Watkins
---   

***Collaborating with CHTC research computing facilitation staff, UW-Madison researcher Gaylen Fronk is using HTC to improve cigarette cessation treatments by accounting for the complex differences among patients.***

By Josephine Watkins

<figure class="figure float-right" style="margin-left: 1em">
  <img src="{{ 'images/Gaylen-Fronk-square.jpg' | relative_url }}" class="figure-img img-fluid rounded" alt="Gaylen Fronk" width="250px">
  <figcaption class="figure-caption">Gaylen Fronk. Image credit: <a href="https://arc.psych.wisc.edu/">UW ARC</a>.<br/></figcaption>
</figure> 


Working at the crossroads of mental health and computing is [Gaylen Fronk](https://arc.psych.wisc.edu/staff/fronk-gaylen/), a graduate student at the University of Wisconsin-Madison’s [Addiction Research Center](https://arc.psych.wisc.edu/). By examining treatments for substance use disorders with machine learning models that are enabled by High Throughput Computing (HTC), Fronk captures the array of differences among individuals while still ensuring that her models are applicable to new patients. Her work is embedded within the larger context of precision mental health, an emerging field that relies on computational tools to evaluate complex, individual-level data in determining the fastest and most effective treatment plan for a given patient.

Fronk’s pursuit of precision mental health has recently led her to the world of computing that involves high-throughput workloads. Currently, she’s using HTC to predict treatment responses for people who are quitting cigarette smoking. 

“I feel like [HTC] has been critical for my entire project,” Fronk reasons. “It removes so many constraints from how I have to think about my research. It keeps so many possibilities open because, within reason, I just don't have to worry about computational time –– it allows me to explore new questions and test out ideas. It allows me to think bigger and add complexity rather than only having to constrain.”

Embarking on this project in August of 2019, Fronk began by reaching out to the research computing facilitators at UW-Madison’s [Center for High Throughput Computing](https://chtc.cs.wisc.edu/) (CHTC). Dedicated to bringing the power of HTC to all fields of research, CHTC staff provided Fronk with the advice and resources she needed to get up and running. Soon, she was able to access hundreds of concurrent cores on CHTC’s HTC system through the [HTCondor Software Suite](https://htcondor.org/) (HTCSS), which was developed at UW-Madison and is used internationally for automating and managing batch HTC workloads. This computing capacity has been undeniably impactful on Fronk’s research, yet when reflecting on the beginnings of her project today, Fronk considers the collaborative relationships she’s developed along the way to be particularly powerful. 

“I am never going to be a computer scientist,” explains Fronk. “I’m doing my best and I’m learning, but that’s not what my focus is and that’s never going to be my area of expertise. I think it's really wonderful to be able to lean on people for whom that is their area of expertise, and have those collaborative relationships.” This type of collaboration among computing experts and researchers will be vital as computational advances continue to spread throughout the social sciences. Computing staff like CHTC’s research computing facilitators help researchers to transform, expand, and accelerate their work; and specialized researchers like Fronk provide their domain expertise to ensure these computational methods are incorporated in ways that preserve the conceptual and theoretical basis of their discipline. 

<figure class="figure float-right" style="margin-left: 1em">
  <img src="{{ 'images/christina-koch-square.jpg' | relative_url }}" class="figure-img img-fluid rounded" alt="Christina Koch" width="250px">
  <figcaption class="figure-caption">Christina Koch.<br/></figcaption>
</figure> 

CHTC research computing facilitator [Christina Koch](https://wid.wisc.edu/people/christina-koch/) has worked closely with Fronk since the beginning of her project, and elaborates on the benefits arising from this synergistic relationship: “Instead of every research group on campus needing to have their own in-house large-scale computing expert, they can meet with our facilitation team and we provide them with the information they need to expand their research computing vision and apply it to their work. But we also learn a lot ourselves from the wide variety of researchers we consult with. Since our experience isn't siloed to a particular research domain, we take lessons learned from one group and share them with another group, where normally those groups would never have thought to connect with each other.”

For fellow social scientists who are considering reaching out to people like Christina and incorporating HTC into their work, Fronk urges them to do just that: “There’s a lot you can teach yourself, but you also don’t have to be on your own. Reach out to the people who know more than you. For me, people like Christina and others on the CHTC team have been invaluable.”

Fronk’s collaborations with Christina all have revolved around the ongoing project that she first began in August of 2019 –– predicting which cigarette cessation treatments will be most effective for a given individual. Data from a [Center for Tobacco Research and Intervention](https://ctri.wisc.edu/) (CTRI) 6-month clinical trial serve as a rich and comprehensive foundation to begin building machine learning models from. With the CTRI data in hand, Fronk not only has access to the treatment type and whether it was successful at the end of the trial, but also to approximately 400 characteristics that capture the fine-tuned individual differences among patients. These include demographic information, physical and mental health records, smoking histories, and social pressures, such as the smoking habits of a patient’s friends, roommates, or spouse.

All these individual-level differences paint valuable complexity onto the picture, and Fronk is able to embrace and dive into that complexity with the help of HTC. Each job she sends over to CHTC’s cores contains a unique model configuration run against a single cross-validation iteration, meaning that part of the CTRI data is used for model fitting while the unused, ‘new’ data is used for model evaluation. For instance, Fronk might start with as many as 200 unique configurations for a given model. If each of these model configurations is fit and evaluated using a cross-validation technique that has 100 unique splits of data, Fronk would then submit the resulting 20,000 jobs to CHTC. 

Before submitting, Fronk alters her code so that each job runs just a single configuration, single iteration context; effectively breaking the comprehensive CTRI data down into small, manageable pieces. Ultimately, when delegated to hundreds of CHTC cores in concurrent use, Fronk’s largest submissions finish in mere hours, as opposed to days on a local computer. 

Thousands of small jobs are handled easily by HTCSS and CHTC’s distributed resources, after which Fronk can aggregate this multitude of output files on her own computer to average the performance of the model configuration across the array of cross-validation iterations. This aggregated output represents how accurately the model predicts whether a certain cigarette cessation treatment will work for a specific individual. After receiving the output, Fronk evaluates it, learns from it, and repeats –– but this time with new insight. 

After her experience with HTC, Fronk now sees computing as an integral part of her work. In fact, the ideal of precision mental health as a compelling alternative to traditional treatment methods has actually been around for a while –– though scalable computing methods that enable it are just beginning to enter the toolboxes of mental health researchers everywhere. “I feel like high-throughput computing really fills a lot of the holes that are needed to move precision mental health forward,” Fronk expresses. “It makes me really excited to be working at that intersection.”

And at that intersection, Fronk isn’t alone. As computational resources are becoming more accessible, increasingly more researchers are investigating the frontiers of precision mental health and its potential to improve treatment success. But before this approach moves from the research space and into a clinical setting, careful thought is needed to assess how these experimental models will fare in the real world. 

Approaches that require intensive and expensive data, like neuroimaging or genetic analysis for instance, may not be feasible –– especially for clinics located in low-income communities. Elaborating on this idea, Fronk explains, “It’s really exciting to think that neuroimaging or genetic data might hold a lot of predictive potential –– yet if a person can’t get genotyped or imaged, then they’re not going to be able to be split into treatments. And those problems get compounded in lower income areas, or for people who have been historically excluded and underrepresented both in terms of existing research and access to healthcare.” 

It will take time, research, and ethical forethought before precision mental health approaches can reach local clinics, but when that time comes –– the impact will ripple through the lives of people seeking treatment everywhere. “I think precision mental health can really help people on a much shorter timeline than traditional treatment approaches, and that feels very meaningful to me,” says Fronk. In terms of her focus on cigarette smoking cessation, timing is everything. Cigarette smoking –– as well as other substance use disorders like it –– have extremely high costs of failed treatments at both the personal and societal level. If someone is given the right treatment from the start when they’re most motivated to quit, it mitigates not only their own health and financial risks, but also those of society’s.   

Ultimately, these impacts stem from the collaborative relationships seen today between researchers like Fronk and computing facilitators like Christina at CHTC. There’s still much to be done before precision mental health approaches can be brought to bear in the clinical world, but high-throughput computing is powering the research to move that direction in a way that never was possible before. Complexity –– which used to limit Fronk’s research –– now seems to be absolutely central to it.

…

*A research article about Fronk’s project is forthcoming. In the meantime, watch [her presentation from HTCondor Week 2021](https://youtu.be/pqqv270RM6Y) or check out the [UW-Madison Addiction Research Center](https://arc.psych.wisc.edu/) to learn more.*
