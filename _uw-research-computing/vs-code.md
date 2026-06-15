---
highlighter: none
layout: guide
title: Connect to CHTC with VS Code
guide:
    category: Get started
    tag:
        - hpc
        - htc
---

VS Code and similar "IDE" programs make it easy to develop and manage coding projects.
This familiar interface can also make it easier to login and interact with CHTC.

This guide explains how to connect to CHTC using VS Code, best practices for using the interface, and how to troubleshoot issues.

{% capture content %}
- [Requirements](#requirements)
- [Initial set-up](#initial-set-up)
- [Connect again](#connect-again)
- [Use VS Code on CHTC](#use-vs-code-on-chtc)
- [Troubleshooting](#troubleshooting)
- [Other IDEs](#other-ides)
- [Related pages](#related-pages)
{% endcapture %}
{% include /components/directory.html title="Table of Contents" %}

## Requirements

* VS Code or similar IDE installed on your local computer
* Login access to the HTC or HPC system (requires a [CHTC account](form.md))
* How to use VS Code's "command palette"

> ### Confirm access
{:.tip-header}

> Before starting, make sure that you can login to CHTC "normally" via a plain terminal, as described in our [Log in to CHTC guide](connecting.md).
{:.tip}

## Initial set-up

1. Install the "Remote-SSH" extension
2. Add access point as a new SSH host
3. Login
4. Login with the file viewer

### Install the Remote-SSH extension

Open VS Code and navigate to the "Extensions" menu.
(Click on the "View" menu and select "Extensions", or use the `Ctrl`+`Shift`+`X` shortcut.)

Search for the "Remote - SSH" extension, it will likely be the first extension listed. 
**The publisher should be "Microsoft".**
Install this extension.

### Add access point as a new SSH host

Use the "Command Palette" to search for the "Remote-SSH: Add New SSH Host" command.

You will be prompted to enter your SSH command.
Enter the same command that you would normally use to login to your access point.

For example, if your NetID is `bbadger` and you are logging into `ap2002`, you would use

```
ssh bbadger@ap2002.chtc.wisc.edu
```
{:.term}

You will then be prompted to choose an SSH configuration file that you wish to update.
Several options will be provided for you; select the location you wish to save the SSH settings. 

> If you want to save the settings to a different location, then you will need to specify that location in the VS Code settings.
> Go to the settings menu and search for "Remote.SSH: Config File", then enter the desired absolute path in the text box.
> Then repeat the above instructions and this location will be the only available choice.

### Login

After adding the access point as a host, VS Code will automatically log you in.

1. VS Code will ask you to confirm the authenticity of the host; enter "yes" to confirm and proceed.
   (Contact the facilitation team if you want to verify the authenticity.)
2. You'll be prompted for a password - enter your NetID password.
3. You'll be prompted to complete DUO authentication; either (a) enter `1` to receive a push notification to your DUO app, or (b) enter the current sequence from your app or fob.

The rest of the process should be automatic, as VS Code sets things up in your personal directory to work with VS Code.

You are successful in the first login if there are no error messages.
You should also see "SSH: server_name" in the very bottom left corner of the window.

### Login with the file viewer

To see your files on the access point via VS Code, you will need to login a second time.

Open the "Explorer" toolbar and click the "Open Folder" button.
A pop-up interface will prompt you to provide a path; just hit the enter key to accept the default value (your home directory).

You will be prompted to login again - do so.
The window will refresh, after which you should be able to see your home directory in the file explorer.

## Connect again

> This assumes that you've already completed the initial set-up on the current device!

1. "Open Recent"

or

1. "Connect to Host"
2. Login with file viewer

### Open recent

If the connection to CHTC was a recent session, you should be able to find it in the "Open Recent" menu.

You can find the "Open Recent" menu 

* on the VS Code start-up page, 
* under "File > Open Recent",
* searching for "File: Open Recent" in the command palette, or
* using the keyboard shortcut `Ctrl`+`R`. 

### Connect to host

If the connection to CHTC is not in your recents list, you can also find it in the "Connect to Host" menu.

You can find the "Connect to Host" menu

* clicking the "><" icon in the very bottom left corner of the window, or
* searching for "Remote-SSH: Connect to Host" in the command palette.

You can select or search for the access point from this menu.
If you don't see the access point in the menu, you probably need to follow the instructions in [Initial set-up](#initial-set-up) again.

Once you've connected to your access point, open the "Explorer" toolbar and click the "Open Folder" button.
Hit the enter key to accept the default value (your home directory) or navigate to only have access to a sub-directory.

## Use VS Code on CHTC

VS Code is connected to the **access point**. 

To run calculations, you will still need to submit a job!

> ### ⚠️ Intensive work
{:.tip-header}

> Do not run intensive commands or scripts via the VS Code connection to CHTC.
> (This includes anything your AI Agent may run!)
{:.tip}

### Find and edit files

If you've set up the file viewer ("explorer"), then you can find and edit files that are on the access point just like you would with VS Code and the files on your computer.

### Submit jobs

Regardless of whether you are using HTCondor or Slurm, you will still need to submit jobs via the terminal.

To access the built-in terminal with VS Code, 

* go to "Terminal" and click "New Terminal",
* use the `Ctrl`+`\`` keyboard shortcut, or
* right-click a file or directory and select "Open in integrated terminal". 

This will open a terminal in your VS Code window.

In this terminal window, you can run the usual HTCondor or Slurm commands for submitting jobs and interacting with the system as usual.
Remember to `cd` into the correct directory first!

> ### ⚠️ Interactive jobs
{:.tip-header}

> When you submit an interactive job via the terminal, **only that terminal** is connected to the interactive job.
> The rest of the VS Code interface (including new terminals) are still connected to the access point!
{:.tip}

### Extensions

If there are extensions you want to use in the remote session, you may need to install them again through the "Extensions" toolbar.

Avoid installing extensions that use a lot of computing power (e.g., that cause your computer to run more slowly), as this will cause the login server to run more slowly as well.

### HTCondor VS Code Extension

HTCondor provides a VS Code extension.

You can find the extension by searching for "Htcondor", **published by htcondor**.

Current features include syntax highlighting for submit files, documentation tooltips on hover over submit commands, and submit file templates.
Create a file that ends with `.sub` and test it out!

This extension is not fully developed. 
Contact the facilitation team if you have feedback about the extension.

### AI integration

VS Code supports integration with AI Agents.

You are not discouraged from using said Agents, but you should be sure to supervise them responsibly.
**You are ultimately responsible for anything your AI Agent does on the access point!**

For more guidance on working with AI Agents on the access point, see our guide here: 

<div class="d-flex mb-3">
	<div class="p-3 m-auto">
		<a class="btn btn-primary" href="https://chtc.cs.wisc.edu/uw-research-computing/agent-recommendations">AI Agents on CHTC</a>
	</div>
</div>

## Troubleshooting

The most common issue is not being able to login. 

| Intervention | Notes |
| ------------ | ----- |
| Confirm regular login access | If you can't login with a plain terminal, you won't be able to using VS Code |
| "Kill VS Code Server on Host" | Built-in command that attempts to login and automatically shut-down VS Code on the remote server |
| "Uninstall VS Code Server from Host" | Built-in command that attempts to login, shut-down, and uninstall VS Code on the remote server | 
| Manual clean-up | You login with a plain terminal to shut-down and uninstall VS Code from the remote server |
| Ask for help | If nothing else works, ask a facilitator for help! | 

When you connect to the access point, VS Code installs a "remote server" on the access point, allowing you to use VS Code to write and manipulate files directly.
Most issues occur when there is a problem connecting to or restarting this remote server. 

### "Kill VS Code Server on Host"

In VS Code, use the command palette and search for the command `Remote-SSH: Kill VS Code Server on Host` and select the server that you are having issues connecting to.
You will be prompted to log in to the access point and VS Code will automatically run the necessary commands before logging out again.

This command can only work if you are able to login to the access point with a plain terminal.

### "Uninstall VS Code Server from Host"

In VS Code, use the command palette and search for the command `Remote-SSH: Uninstall VS Code Server from Host` and select the server that you are having issues connecting to.
You will be prompted to log in to the access point and VS Code will automatically run the necessary commands before logging out again.

This can only work if you are able to login to the access point with a plain terminal.

The next time you login with VS Code, it should automatically set up what it needs to work.

### Manual clean-up

VS Code isn't always able to clean-up after itself like it should, in which case a manual clean-up may fix the problem. 

Log in to the access point using a plain terminal.
Then, run the following command:

```
kill -9 $(ps aux | grep VS Code-server | grep $USER | grep -v grep | awk '{print $2}')
```
{:.term}

This command looks for left-over processes from your VS Code on the server and then removes ("kill") them.
(If you don't have any VS Code processes running on the server, then you may get the help text for the `kill` command.)

Next, remove the VS Code directory from your home directory:

```
rm -rf ~/.vscode-server
```
{:.term}

This removes the items that VS Code automatically uploaded to set up the remote server, which may be responsible for causing problems.
The next time you try to connect with VS Code, it should automatically set up what it needs to work.

### Lots of files

If you have a lot of files in your directory on the access point, then VS Code may struggle to list and scan those files for the file viewer.

If this is causing you problems, here are some things to try:

* Reduce the number of files on the server.
* Open a specific directory in the file viewer, instead of the default home directory. ("Connect to host" then "Open Folder" and select a sub-directory in the dialog.)
* Configure VS Code to ignore the directories that contain a lot of files. 

## Other IDEs

If the program you want to use is a derivative of VS Code (e.g., Google's Antigravity), then the Remote SSH extension is likely already built-in.
The instructions in this guide should map nearly perfectly to that program.

Other IDE programs usually include an equivalent feature. 
There should be instructions in the program's documentation about the process.
Look for "remote server" or "ssh" or the like. 
The overall process should be similar.

The facilitation team may be able to help you figure out the process, but keep in mind that we do not explicitly support these tools.

## Related pages

* [Log in to CHTC](connecting.md)
* [Transfer Files between CHTC and your Computer](transfer-files-computer.md)
* [VS Code Remote SSH manual](https://code.visualstudio.com/docs/remote/ssh)
