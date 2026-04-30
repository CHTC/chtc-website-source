---
layout: guide
title: Security Policies for Using CHTC
alt_title: Security Policies for Using CHTC
---

*For the full list of usage policies, see [Policies and Expectations for Using CHTC](user-expectations)*

**Users of CHTC agree to follow cybersecurity policies** to ensure the security of CHTC servers.
This includes

* instructions detailed in this guide,
* [Universities of Wisconsin cybersecurity policies](https://www.wisconsin.edu/regents/policies/acceptable-use-of-information-technology-resources/),
* any applicable local, state, or federal laws.

These policies apply to any "AI agents" acting on the user's behalf.

## Highlights

1. Do not use untrusted software or programs on CHTC.
   [*more info*](#trust-your-software)
2. Do not share your login credentials with anyone else.
   [*more info*](#login-credentials)
3. Do not hack or willingly compromise the security of CHTC.
   [*more info*](#hacking)
4. Report known or suspected security issues to CHTC staff.
   [*more info*](#reporting)
5. Do not store unencrypted secrets on CHTC.
   [*more info*](#unencrypted-secrets)

The importance of these policies is discussed at the end of this page.
[*more info*](#why-security-matters)

## Trust your software

**Do not use untrusted software or programs on CHTC**.

Make sure that the software you want to use on CHTC comes from a trusted source.
A common attack is to embed malicious code into innocent-sounding software.

* For "major" programs, always go to straight to the source:
  the developer's website or Git repository
* For specialized programs, check the authorship - who wrote the code?
  Are they a recognized name in your field?

CHTC facilitators are happy to help you verify the authenticity of software that you want to use.

If you ran software on CHTC that you believe might be compromised, please report it as described in the [Reporting](#reporting) section below.

## Login credentials

**Do not share your login credentials**.

Your login credentials for CHTC use your university NetID.

These same NetID credentials give you access to **all** personal and private information recorded by the University, including

* email
* personal address
* banking information

**If your NetID is compromised, email [help@doit.wisc.edu](mailto:help@doit.wisc.edu)**.

If you believe your compromised NetID was used to access a CHTC service,
please report the incident to use as described below in the [Reporting](#reporting) section.

## Hacking

**Do not hack or willing compromise the security of CHTC**.

Hacking or otherwise compromising system security is strictly forbidden,
**regardless of the intent or purpose**.

Obviously, we don't want any users to hack CHTC for malicious purposes.
But even a well-meaning "ethical" hacker can open up the system to third-party (malicious) actors.

If you think there is an exploit that can be used on CHTC systems, **report it, don't use it!**
See the [Reporting](#reporting) section below for more information.

## Reporting

**Report known or suspected security issues to CHTC staff**.

When in doubt, please report the issue.
Early reporting helps staff respond quickly to limit the impact of potential security threats.

**To report a security issue to CHTC**, please email us at [chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) and use `Security Report` in the subject.

In your email, please include:

* The "who, what, when, and where" of the security incident
* Your name, email, and NetID
* Your affiliation with CHTC (research group, department, etc.)
* Any additional questions or concerns

**To report a security issue to campus**, please email [help@doit.wisc.edu](mailto:help@doit.wisc.edu).

For more information on reporting issues to campus IT, see the [Office of Cybersecurity's Reporting page](https://it.wisc.edu/about/division-of-information-technology/enterprise-information-security-services/office-of-cybersecurity/reporting-an-incident-to-it-security/).

### Example report - NetID compromise

```text
To: chtc@cs.wisc.edu
Subject: Security Report - NetID compromise

Dear CHTC staff,

I believe that my NetID has been compromised.

Yesterday at <time>, someone used my NetID to login to CHTC <server> to submit jobs, with JobIDs <list of IDs>.
I have already informed campus IT at help@doit.wisc.edu of the issue.

My name is Jordan Doe, my NetID is "jdoe4".
I'm part of Prof. B. Badger's lab in the Department of Computer Sciences. 
```

### Example report - Linux exploit

```text
To: chtc@cs.wisc.edu
Subject: Security Report - Linux exploit

Dear CHTC staff,

I found a security exploit online that I think may apply to CHTC servers.

The exploit is described at <link> and allows a user to access another user's data.
Letting you know in case you weren't already aware of it.

My name is Jordan Doe, my NetID is "jdoe4".
I'm part of Prof. B. Badger's lab in the Department of Computer Sciences. 
```

## Unencrypted secrets

**Do not store unencrypted secrets on CHTC**.

A "secret" is something that gives you privileged access to another service. 

If the secret is stored as plain text (unencrypted), then anyone who can access that file can impersonate you!
Here, "anyone" can be a system administrator or a malicious actor who has gained root access to the server.

You should always encrypt the secret (usually with a password) so that only you can access the information.

## Why security matters

Our goal is to make it convenient for you, the researcher, to use CHTC resources to advance your research.

At the same time, however, we have to make sure that these resources are not used for malicious purposes,
and to make sure that your research is not leaked or otherwise compromised.

By following the above policies, you help ensure the security of everyone who uses CHTC.

Please feel free to reach out to the facilitation team for any issues or concerns regarding our security policies.

