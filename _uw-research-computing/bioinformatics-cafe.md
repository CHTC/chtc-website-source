---
highlighter: none
layout: content
title: Bioinformatics Café @ CHTC
---

{% capture content %}

<img src="/images/20240308_Morgridge_3767_2x1.jpg" alt="Researchers gathered with laptops, collaborating in a casual setting" loading="eager">

## Connect and find resources with the Bioinformatics community

Welcome to the **Bioinformatics Café**—a monthly, hands‑on meetup for life‑science researchers using CHTC resources. Come for a short tutorial, stay to co‑work on your analyses with Facilitator support, and meet peers solving similar problems. Bring a laptop, a dataset, and your questions.

> Whether you’re brand new to high‑throughput computing or a seasoned CHTC user, the Café is your place to share knowledge, troubleshoot together, and learn best practices for using computing resources for your research.

- **New to CHTC?** Learn about research computing with step-by-step guidance, introductions to core tools, and a supportive environment to build your skills.
- **Are you an experienced user?** Find opportunities to refine workflows, exchange advanced tips, and contribute your expertise to the community.

{% endcapture %}
{% include /components/markdown-container.html %}


<div class="container-xxl">
    <div class="row justify-content-center ">
        <div class="col-sm-3 mw-1000">
            <div class="h-100 uw-card d-flex flex-direction-column mb-auto">
                <div class="uw-card-content">
                    <img src="{{ '/uw-research-computing/guide-icons/noun_open book_1179297.png' | relative_url }}" alt="Book icon" style="max-height: 200px; width: auto;">
                    <div class="uw-card-copy">
                        <h2 class="uw-mini-bar">Resources</h2>
                        <p>Get oriented and level up fast:</p>
                        <ul>
                          <li><a href="/uw-research-computing/htc-roadmap">Roadmap to getting started on CHTC</a></li>
                          <li><a href="/uw-research-computing/transfer-files-computer">Moving data to/from CHTC</a></li>
                          <li><a href="/uw-research-computing/software-overview-htc#quickstart">Containers & reproducible software</a></li>
                          <!--<li><a href="/uw-research-computing/tutorials#Bioinformatics">CHTC Bioinformatics Tutorials</a></li>-->
                          <!--<li><a href="https://github.com/CHTC/recipes/tree/main/software">Café GitHub Repository</a></li>-->
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-3 mw-1000">
            <div class="h-100 uw-card d-flex flex-direction-column mb-auto">
                <div class="uw-card-content">
                    <img src="{{ '/uw-research-computing/guide-icons/noun_people_1188645.png' | relative_url }}" alt="People icon" style="max-height: 200px; width: auto;">
                    <div class="uw-card-copy">
                        <h2 class="uw-mini-bar">Community</h2>
                        <p>Join our community and stay in the loop:</p>
                        <ul>
                          <li><a href="https://forms.gle/zMTZtgxGdxyGui2Q8">Join the mailing list!</a></li>                        <!--<li><a href="https://community.chtc.wisc.edu">Join the Community Discourse</a></li>-->
                          <li><a href="/uw-research-computing/get-help.html#office-hours">CHTC Office Hours</a></li>
                          <li><a href="https://go.wisc.edu/schedule-chtc">Schedule a 1-on-1 consultation</a></li>
                          <li><a href="/events">Event calendar</a></li>
                          <!-- Optional: add Slack/Teams or mailing list when ready -->
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-3 mw-1000">
            <div class="h-100 uw-card d-flex flex-direction-column mb-auto">
                <div class="uw-card-content">
                    <img src="{{ '/uw-research-computing/guide-icons/calendar-text.svg' | relative_url }}" alt="Calendar icon" style="max-height: 200px; width: auto;">
                    <div class="uw-card-copy">
                        <h2 class="uw-mini-bar">Upcoming events</h2>
                        {% include get/future_events.liquid %}
                        {% assign biocafe_events = future_events | where: "tags", "bioinformatics-cafe" %}
                        {% for event in biocafe_events limit:2 %}
                          {% include event/event-card.html %}
                        {% endfor %}
                        <p><a href="/events.html">See all events</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{% capture content %}

<h2 class="uw-mini-bar">Get Involved</h2>

<div class="row" style="padding: 0 0 2em;">
  <div class="col-md-6">
    <h3>When & Where (Fall 2025)</h3>
    <p>Second Wednesday of each month</p>
    <ul>
      <li><strong>Time:</strong> 2:30–4:30 PM CST</li>
      <li><strong>Location:</strong> Discovery Building, <strong>Orchard View Room (Rm. 3820)</strong> (posted on the <a href="/events">events page</a>)</li>
      <li><strong>Dates:</strong>
        <ul>
          <li><a href="/events/2025/09/10/Bioinformatics-Cafe">Wed, September 10, 2025<br>Getting Started with CHTC</a></li>
          <li><a href="/events/2025/10/08/Bioinformatics-Cafe">Wed, October 8, 2025<br>Genomics using CHTC</a></li>
          <li><a href="/events/2025/11/12/Bioinformatics-Cafe">Wed, November 12, 2025<br>Microbiome Analysis on CHTC</a></li>
          <li><a href="/events/2025/12/10/Bioinformatics-Cafe">Wed, December 10, 2025<br>TBD</a></li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="col-md-6" style="border-left: 5px solid #c5050c;">
    <h3>Format</h3>
    <ol>
      <li><strong>Mini‑tutorial:</strong> topics include intro to advanced computing, high‑throughput read mapping, genome assembly at scale, and microbiome analysis.</li>
      <li><strong>Project clinic:</strong> quick 1‑on‑1 check‑ins to set goals and unblock your next steps.</li>
      <li><strong>Co‑working:</strong> with Facilitators and fellow bioinformaticians on hand for troubleshooting.</li>
      <li><strong>Show & tell:</strong> optional lightning talks where participants share progress, tools, or workflows.</li>
      <li><strong>Peer networking:</strong> informal time to connect with other researchers, exchange ideas, and form collaborations.</li>
    </ol>
  </div>
</div>

**Bring:** your laptop and your ideas! We welcome all levels of experience, from beginners to advanced users.

**New here?** Start with the <a href="/uw-research-computing/htc-roadmap">HTC Roadmap</a> and come anyway—we’ll help you get set up.

<!--
**Keep the conversation going online** on our Community Discourse! Share your resources or ask questions on our forum.

<div class="d-flex mb-3">
	<div class="p-3 m-auto">
		<a class="btn btn-primary" href="">Join the Community Discourse - Coming Soon</a>
	</div>
</div>
-->


<h2 class="uw-mini-bar">FAQ</h2>

<details>
<summary><strong>Do I need prior command line or Linux experience?</strong></summary>
<p>No. We’ll meet you where you are! We offer step‑by‑step guidance. Some good places to start are the <a href="/uw-research-computing/htc-roadmap">HTC Roadmap</a> and starter tutorials.</p>
</details>

<details>
<summary><strong>I don’t have data yet, is the Café still right for me?</strong></summary>
<p>Absolutely! Bring your research question. We can help you plan workflows, set up environments, and practice on example datasets.</p>
</details>

<details>
<summary><strong>I missed the first session, can I still join?</strong></summary>
<p>Yes. We'll work with you to catch up. While it is best to join the Café early in the semester, the Café is designed to be accessible throughout the semester.</p>
</details>

<details>
<summary><strong>Can I get 1‑on‑1 help?</strong></summary>
<p>Yes. Each session includes a dedicated project co-working time and check‑ins with the facilitators. For more in-depth help, we may have you <a href="https://go.wisc.edu/schedule-chtc">book a 1‑on‑1 consultation</a> or visit <a href="/uw-research-computing/get-help.html#office-hours">Office Hours</a>.</p>
</details>

<details>
<summary><strong>What should I bring?</strong></summary>
<p>Bring your laptop, project notes, and (if available) small test inputs or scripts. We can help stage larger data and set up containers.</p><p><b>Don't have a project or data yet?</b><br>You should still come and bring your computational ideas, our facilitators will be able to help you get started and familiarized with the system for when you are ready to submit your research analysis workflows.</p>
</details>

<br>
If have any questions or have ideas for topics, [reach out](get-help.html#help-via-email) and mention “Bioinformatics Café.”


{% endcapture %}
{% include /components/markdown-container.html %}
