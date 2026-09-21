---
layout: default
title: The Center for High Throughput Computing Fellows Program
---

<div class="bg-light overflow-hidden">
    <picture>
        <source srcset="{{ 'images/CHTC_Fellows.webp' | relative_url }}">
        <img style="max-height: 300px" id="hero-image-ultrawide" src="{{ 'images/CHTC_Fellows.png' | relative_url }}"  alt="CHTC Logo" />
    </picture>
</div>

<div class="container-xxl">
<div class="row justify-content-center">
<div class="col-12 col-sm-11 col-md-9 col-lg-8" markdown="1">
<h1 class="uw-mini-bar mb-4">
{{ page.title }}
</h1>

<div class="alert alert-info" role="alert">
<strong>Applications for the Summer 2026 CHTC Fellows Program are now closed. Application for the Summer 2027 Fellows Program will open in November 2026.</strong> 
</div>


The CHTC Fellows Program trains students in the development and use of cyberinfrastructure through a summer program where participants will work with mentors on delivering a project that will make an impact on the nation’s science.

The Program aims to provide opportunities for undergraduate and graduate students to connect with mentors within the community. Projects opportunities for students include collaboratively developing software for high throughput computing and cyberinfrastructure, operating complex service environments, and facilitating the use of large-scale computational services. It provides students with insight into how scientists use research computing as a tool to advance their research.

## How it Works

Applicants can apply for a CHTC Fellowship for Summer 2027 beginning in mid-September 2026. Interviews will begin November 2026. Following a successful interview, Fellows candidates will be matched with a potential fellows project to consider based upon their interests and qualifications. With the help of mentor(s), the Fellows candidate will have the opportunity to flesh out and develop a project proposal for investigation and execution during the summer. 

During the summer, the Fellows will work on their project on the guidance of their mentor(s) and with the support of the CHTC team. The Fellows will also collaborate with their Fellows cohort and have educational and social activities during the program. 

Fellows will receive a stipend for participating in the Program, during their fellowship. In-person participation at CHTC is required to maximize interaction with mentors and others in the cohort. 

## Applying

To apply, send an email to <chtc-fellows@g-groups.wisc.edu> with the following information:

A resume/CV (in PDF format) with contact information. Be sure to include your full name, email address, the name of your university or college and your current or planned major and/or area of study.

A cover letter that describes your interest in the internship program. For example, you may wish to expand on 3 or 4 topics from the following list: your background, your skills, and strengths; what software, computing or scientific topics appeal to you; previous research experience, if any; what you may want to pursue as a future career; and what benefits you would like to gain from this program. Successful applicants will be connected to mentors to flesh out their projects following this application and interview process. 

The CHTC Fellows Program aims to be inclusive of students at all levels of experience and skill sets; a willingness to learn and interest in science is prioritized over past accomplishments.

## Duration of Fellowship and Total Stipend
-  The upcoming Fellowship Program will last from May 17 to August 6, 2026. During the Program, 5 days are allocated as personal days (with no stipend provided for those days) for the Fellows to use at their discretion, except for the required participation in Throughput Computing Week 2027 (HTC27).
-  The Program provides $680/week stipend. 
-  It is expected that a Fellow working on a  project is available full time during the fellowship period and will not have another significant activity (such as classes, another trainee position or a job) in the same time period.

 
## Eligibility 

-  You must be enrolled in an undergraduate or graduate program at an accredited University or College within the US for the duration of the fellowship, or, if graduating in May of 2026, have accepted an offer for a graduate program starting in the fall of 2027.
-   You must have completed at least 1 academic year by the start of the Fellowship.
-   U.S. citizenship is not required to participate. However, F-1 students will need to apply for Curricular Practical Training (CPT) and per CPT requirements enroll in an associated 1-credit course (at their own expense).   
-   In-person participation sponsored by the CHTC Fellows Program in Throughput Computing Week 2027 (HTC27) in Madison during the Fellowship is required. HTC27 will be held June 8 - 1, 2027.


## Developing a project 

-   With the help of the mentor, the students will develop and submit a short 2-page project proposal and timeline for the summer. 
-   During the Fellowship, you will work with your mentor and other collaborators. You will also make a short presentation about your project to other Fellows and Mentors as you start your Fellowship, another midway through the project to show your progress and a final presentation about your results at the very end.


## Featured Fellow
{% include get/team.liquid %}
{% assign member = team | where_exp: "staff", "staff contains 'fellowship'" | sort: "name" | sample %}
{% include /components/fellow-card.html %}

[View all fellows](/fellowships/fellows)


### Possible Projects?

Following the interview, successful applicants will be paired with potential mentors based upon their interests to develop their project proposal. Project submissions are due prior to the start of the summer.

For Summer 2027, Fellows projects (likely 4) will primarily be focused on software development. Projects have been available in the following areas in the past:


<div class="rounded px-4 py-1 mb-3 shadow" markdown="1">
### [Research Facilitation](/fellowships/list#research-facilitation)

Are you interested in and comfortable with collaborative problem-solving, documentation and training, and community building? Are you looking for opportunities to learn about technologies, collaborate with teammates, and develop skills to communicate about technical concepts to a general audience?
</div>

<div class="rounded px-4 py-1 mb-3 shadow" markdown="1">
### [Infrastructure Services](/fellowships/list#infrastructure-services)

Are you interested in state of the art hardware, complex systems and leading technologies? Are you interested in expanding your skills by learning about these diverse technologies, including Linux servers, networking, Kubernetes, distributed file systems, batch systems, and databases?
</div>

<div class="rounded px-4 py-1 mb-3 shadow" markdown="1">
### [Software Development](/fellowships/list#software-development)

Are you comfortable with programming skills acquired from coursework or dedicated training activities? Are you interested in building on those skills to gain experience in a project in support of scientific research?
</div>


## Funding

External funding support for the CHTC Fellows Program is provided by the National Science Foundation through Cooperative Agreement [OAC-2030508](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2030508) and Grants [OAC-2030508](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2331480) and [0AC-2609485](https://www.nsf.gov/awardsearch/show-award/?AWD_ID=2609485). Support for this program is also provided by UW-Madison and the Morgridge Institute for Research.

## Other Scientific Fellowships

-   [**IRIS-HEP Fellows Program**](https://iris-hep.org/fellows.html){:target="_blank"}

</div>
</div>
</div>
