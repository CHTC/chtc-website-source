---
layout: guide
title: AI Agents on CHTC APs and Login Nodes
alt_title: AI Agents on CHTC APs and Login Nodes
guide:
    order: 2
    category: Basics and Policies
---

## 

Agentic AI tools can be useful for editing scripts, explaining errors, generating submit files, and troubleshooting workflows. However, these tools can also create excessive temporary files, run commands automatically, repeatedly query shared services, or start long-running processes. Use them carefully on the Access Point.

Agentic AI tools should be used to help prepare and troubleshoot jobs, not to run the scientific workload directly. If a command would normally belong in an HTCondor job, **do not let an agent run it directly on the Access Point.**

Avoid starting agents from the top level of your home directory unless necessary. Run them from the specific project directory where you want them to work, and review commands before allowing them to execute.

Do not allow agents to run large computations, install large software environments, perform large recursive file operations, poll condor\_q in tight loops, or run unattended for long periods. Users are responsible for commands run by agentic tools under their account, including storage use, scheduler load, file changes, and any exposed credentials.

### Avoid background services and local servers

Some agentic tools may start background services, language servers, file watchers, indexing processes, or local web servers. These can continue consuming resources after you are done.

Avoid running persistent services on the Access Point unless they are lightweight, temporary, and necessary for your immediate work. The Access Point should not be used as a general-purpose server for agentic tools, dashboards, notebooks, or web applications.

### User responsibility

Users are responsible for commands run by agentic AI tools under their account. “The agent did it” does not remove responsibility for excessive resource use, data deletion, credential exposure, scheduler load, or storage problems.

Use agentic AI tools as guided assistants. Review their suggestions, limit their scope, test carefully, and make sure computational work is still submitted through HTCondor rather than run directly on the Access Point.

### Using an `AGENTS.md` or `CLAUDE.md` file with your agents

If you use an agentic AI tool on the Access Point, consider adding an `AGENTS.md`, `CLAUDE.md`, or similar instruction file in your project directory. These files can tell the agent how it should behave in that specific workflow.

Use this file to set clear boundaries, such as:

* Do not run computationally intensive commands on the Access Point.  
* Do not use system `/tmp`; use `/home/$USER/tmp` instead.  
* Do not run `condor_q` in loops or use frequent polling.  
* Do not install large software environments without confirmation.  
* Do not edit, move, or delete files outside this project directory.  
* Ask before running recursive commands or commands that modify many files.

These instruction files are not a substitute for reviewing agent actions, but they can help reduce accidental misuse of shared Access Point resources.
