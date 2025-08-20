---
highlighter: none
layout: content
title: Bioinformatics Café @ CHTC
---

{% capture content %}

<img src="/images/20240308_Morgridge_3767_2x1.jpg" alt="Researchers gathered with laptops, collaborating in a casual setting" loading="eager">

## Connect and find resources with the Bioinformatics community

Welcome to the **Bioinformatics Café**—a monthly, hands‑on meetup for life‑science researchers using CHTC. Come for a short tutorial, stay to co‑work on your analyses with Facilitator support, and meet peers solving similar problems. Bring a laptop, a dataset, and your questions.

> Whether you’re brand new to high‑throughput computing or a seasoned CHTC user, the Café is your place to share knowledge, troubleshoot together, and learn approaches that make your research run more efficiently.

The Café blends quick, practical lessons (read mapping, assembly at scale, microbiome workflows) with time to make real progress on your project. **New to CHTC?** You’ll gain step-by-step guidance, introductions to core tools, and a supportive environment to build your skills. **Experienced?** You’ll find opportunities to refine workflows, exchange advanced tips, and contribute your expertise to strengthen the community.

{% endcapture %}
{% include /components/markdown-container.html %}


<div class="container-xxl">
    <div class="row justify-content-center ">
        <div class="col-sm-3 mw-1000">
            <div class="h-100 uw-card d-flex flex-direction-column mb-auto">
                <div class="uw-card-content">
                    <img src="{{ '/uw-research-computing/guide-icons/noun_open book_1179297.png' | relative_url }}" alt="Book icon" style="max-height: 200px">
                    <div class="uw-card-copy">
                        <h2 class="uw-mini-bar">Resources</h2>
                        <p>Get oriented and level up fast:</p>
                        <ul>
                          <li><a href="/uw-research-computing/htc-roadmap">HTC Roadmap: how CHTC works</a></li>
                          <li><a href="/uw-research-computing/transfer-files-computer">Moving data to/from CHTC</a></li>
                          <li><a href="/uw-research-computing/software-overview-htc#quickstart">Containers & reproducible software</a></li>
                          <li><a href="/uw-research-computing/tutorials#Bioinformatics">CHTC Bioinformatics Tutorials</a></li>
                          <li><a href="https://github.com/CHTC/recipes/tree/main/software">Cafe GitHub Repository</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-3 mw-1000">
            <div class="h-100 uw-card d-flex flex-direction-column mb-auto">
                <div class="uw-card-content">
                    <img src="{{ '/uw-research-computing/guide-icons/noun_people_1188645.png' | relative_url }}" alt="People icon" style="max-height: 200px">
                    <div class="uw-card-copy">
                        <h2 class="uw-mini-bar">Community</h2>
                        <p>Join our community and stay in the loop:</p>
                        <ul>
                          <li><a href="/uw-research-computing/get-help.html#office-hours">CHTC Office Hours</a></li>
                          <li><a href="https://go.wisc.edu/schedule-chtc">Request a 1-on-1 consult</a></li>
                          <li><a href="https://community.chtc.wisc.edu">Join the Community Discourse</a></li>
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
                    <img src="{{ '/uw-research-computing/guide-icons/calendar-text.svg' | relative_url }}" alt="Calendar icon" style="max-height: 200px">
                    <div class="uw-card-copy">
                        <h2 class="uw-mini-bar">Upcoming events</h2>
                        {% include get/future_events.liquid %}
                        {% assign biocafe_events = future_events | where: "tags", "bioinformatics-cafe" %}
                        {% for event in biocafe_events limit:2 %}
                          {% include event/event-card.html %}
                        {% endfor %}
                        <p><a href="/events">See all events</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{% capture content %}

## Get Involved


<div class="row">
  <div class="col-md-6">
    <h3>When & Where (Fall 2025)</h3>
    <p>Second Wednesday of each month</p>
    <ul>
      <li><strong>Time:</strong> 2:30–4:30 PM CT</li>
      <li><strong>Location:</strong> Discovery Building, <strong>Orchard View Room (Rm. 3820)</strong> (posted on the <a href="/events">events page</a>)</li>
      <li><strong>Dates:</strong>
        <ul>
          <li>Wed, September 10, 2025</li>
          <li>Wed, October 8, 2025</li>
          <li>Wed, November 12, 2025</li>
          <li>Wed, December 10, 2025</li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="col-md-6">
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

### FAQ

<details>
<summary><strong>Do I need prior command‑line or Linux experience?</strong></summary>
<p>No. We’ll meet you where you are. Beginners get step‑by‑step guidance and pointers to the <a href="/uw-research-computing/htc-roadmap">HTC Roadmap</a> and starter tutorials.</p>
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
<summary><strong>Will I get 1‑on‑1 help?</strong></summary>
<p>Yes. Each session includes a dedicated project co-working time and check‑ins with the facilitators. For deeper dives, we may have you <a href="https://go.wisc.edu/schedule-chtc">book a 1‑on‑1 consult</a> or visit <a href="/uw-research-computing/get-help.html#office-hours">Office Hours</a>.</p>
</details>

<details>
<summary><strong>What should I bring?</strong></summary>
<p>Your laptop, project notes, and (if available) small test inputs or scripts. We can help stage larger data and set up containers. <br><b>Don't have a project or data yet?</b><br>You should still come and bring your computational ideas, our facilitators will be able to help you get started and familiarized with the system for when you are ready to submit your research analysis workflows.</p>
</details>

If have any questions or have ideas for topics, <a href="/uw-research-computing/get-help.html#help-via-email">reach out</a> and mention “Bioinformatics Café.”


{% endcapture %}
{% include /components/markdown-container.html %}
