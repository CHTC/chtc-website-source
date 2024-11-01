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


<div class="primary-callout mt-3">
<h2 class="mt-1">Applications are now open!</h2>

<p class="pb-3"><a href="#how-do-you-find-a-project">View open projects below</a></p>

<p>To apply, send an email to <a href="mailto:chtc-jobs@g-groups.wisc.edu">chtc-jobs@g-groups.wisc.edu</a> with the following information:</p>

<ul class="mb-2">
<li>A resume/CV (in PDF format) with contact information. Be sure to include your full name, email address, the name of your university or college and your current or planned major and/or area of study.</li>
<li>A cover letter that describes your interest in the Fellowship Program. For example, you may wish to expand on 3 or 4 topics from the following list: your background, your skills, and strengths; what software, computing or scientific topics appeal to you; previous research experience, if any; what you may want to pursue as a future career; and what benefits you would like to gain from this program. If you already have a potential project which interests you from the project list, you can also mention them here. It is however not required to have a mentor/project finalized to submit an application. Successful applicants will be connected to mentors to select and define their projects in a 2nd step following this application.</li>
</ul>
</div>

The CHTC Fellows Program trains students in the development and use of cyberinfrastructure through a summer program where participants will work with mentors on delivering a project that will make an impact on the nation’s science.

The Program aims to provide opportunities for undergraduate and graduate students to connect with mentors within the community. Projects opportunities for students include collaboratively developing software for high throughput computing and cyberinfrastructure, operating complex service environments, and facilitating the use of large-scale computational services. It provides students with insight into how scientists use research computing as a tool to advance their research.

## Featured Fellow
{% include get/team.liquid %}
{% assign member = team | where_exp: "staff", "staff contains 'fellowship'" | sort: "name" | sample %}
{% include /components/fellow-card.html %}

[View all fellows](/fellowships/fellows)


### How do you find a project?

As part of the application process, students will be paired with potential mentors to develop the project ideas from the suggested [projects list](./list.html); project submissions are due prior to the start of the summer.

The CHTC Fellows Program aims to be inclusive of students at all levels of experience and skill sets; a willingness to learn and interest in science is prioritized over past accomplishments.

Projects have been available in the following areas in the past:


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


## How it Works

Fellows work with a mentor to develop a project relevant to one of the areas listed. Fellows will receive a monthly stipend for participating in the Program, during their fellowship. In-person participation at CHTC is required to maximize interaction with mentors and others in the cohort.

**Eligibility:**

-   You must be enrolled in an undergraduate or graduate program at an accredited University or College within the US.
-   You must have completed at least 1 academic year by the start of the Fellowship.
-   U.S. citizenship is not required to participate.
-   In order to ensure the safety of the workplace, proof of COVID-19 vaccination is required unless an exemption is granted for medical, disability or religious reasons. 
-   In-person participation sponsored by the CHTC Fellows Program in Throughput Computing Week 2025 (HTC25) in Madison during the Fellowship is required. HTC25 will be held June 2 - 6, 2025.


**Developing a project**

-   After you apply, we will make a first selection of candidates and reach out to you for a “matchmaking discussion” with a mentor to discuss possible projects.
-   It is not necessary to prepare a project proposal before application, however including information on your potential interests as part of the application will help us match you with a mentor.
-   With the help of the mentor, the students will develop and submit a short 2-page project proposal and timeline. Based on that, we will make a final fellows selection.
-   During the Fellowship, you will work with your mentor and other collaborators. You will also make a short presentation about your project to other Fellows and Mentors as you start your Fellowship, another midway through the project to show your progress and a final presentation about your results at the very end.

### For reference, the 2024 timeline is below::

-   **Friday 8 March, 2024** - Final deadline for applications (applications will be reviewed on a rolling basis as they arrive.)
-   **Friday 15 March, 2024** - End of selection period for applications. Those selected will be matched to work with mentors on developing a proposal - this may involve a short interview and other follow-up. (Interviews for selected applicants will occur on a rolling basis.)
-   **Monday 1 April, 2024** - Deadline for submission of proposals. (Proposals will be reviewed on a rolling basis.)
-   **By 15 April, 2023** - Final selection of Fellows for summer 2024
-   **June-August** - Fellows work on projects.

## Funding

External funding support for the CHTC Fellows Program is provided by the National Science Foundation through Cooperative Agreement [OAC-2030508](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2030508) and Grant [OAC-2331480](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2331480). Support for this program is also provided by UW-Madison and the Morgridge Institute for Research.

## Other Scientific Fellowships

-   [**SciAuth Student Fellows**](https://sciauth.org/fellows/){:target="_blank"}
-   [**IRIS-HEP Fellows Program**](https://iris-hep.org/fellows.html){:target="_blank"}

</div>
</div>
</div>
