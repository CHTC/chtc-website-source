---
highlighter: none
layout: guide
title: Connect to CHTC using VS Code
guide:
    category: Troubleshooting
    tag:
        - hpc
        - htc
---

# Connect to CHTC using VS Code

VS Code and similar "IDE" programs make it easy to develop and manage coding projects.
This familiar interface can also make it easier to login and interact with CHTC.

This guide explains how to connect to CHTC using VS Code, best practices for using the interface, and how to troubleshoot issues.

## Table of contents

## Requirements

* VS Code or similar IDE installed on your local computer
* Login access to a CHTC access point (requires a [CHTC account](form.md))

#### Confirm access
{:.tip-header}

> Before starting, make sure that you can login to CHTC "normally" via a plain terminal, as described in our [Log in to CHTC guide](connecting.md).
{:.tip}

## Initial set-up

## Connecting again

## Extensions

## AI integration

## Troubleshooting

| Intervention | Notes |
------------------------
| **Confirm regular login access** | If you can't login with a plain terminal, you won't be able to using VS Code |
| **"Kill VS Code Server on Host"** | Attempts to login and automatically shut-down VS Code on the remote server |
| **"Uninstall VS Code Server from Host"** | Attempts to login, shut-down, and uninstall VS Code on the remote server | 
| **Manual clean-up** | You login with a plain terminal to shut-down and uninstall VS Code from the remote server |
| **Ask for help** | If nothing else works, ask a facilitator for help! | 

The most common issue is not being able to login. 

## Adapting to other IDE programs



## 1. Install VS Code

Go to the VS Code website and download the version appropriate for your own computer: https://code.visualstudio.com/. Follow the instructions there for how to install VS Code on your own computer. During the installation process, you may be asked to choose how to configure VS Code; the default options will suffice but you can change them as you see fit. When you open VS Code, you will be greeted with a welcome message and short guide on how to set up and use VS Code. 

> If you have already downloaded VS Code for your computer, we recommend that you update VS Code to the most current version.

## 2. Install the "Remote SSH" Extension

Navigate to the "Extensions" menu. (You should be able to find it by going to the "View" menu and select "Extensions".)

Search for the "Remote - SSH" extension, it will likely be the first extension listed. The publisher should be "Microsoft". Install this extension.

Next, you need to adjust one of the settings for the extension. Go to the Settings menu and search for "Remote.SSH: Show Login Terminal". Check the box to enable "Always reveal the SSH login terminal". **This setting is required to in order to authenticate with Duo after entering your password!**

## 3. Set up the Connection to the Access Point

Use the "Command Palette" to search for the "Remote-SSH: Add New SSH Host" command. (Go to the "View" menu and select "Command Palette".) You'll be prompted to enter the SSH command. Enter the same command that you would normally use to login to your access point, e.g.

```
ssh yourNetID@submit###.chtc.wisc.edu
```
{:.term}

You will then be prompted to choose an SSH configuration file that you wish to update. Several default options will be provided for you; select the location you wish to save the SSH settings. 

> If you want to save the settings to a different location, then you will need to specify that location in the VS Code settings. Go to the settings menu and search for "Remote.SSH: Config File", then enter the desired absolute path in the text box. Then repeat the above instructions and this location will be the only available choice.

## 4. Connecting VS Code to the Access Point for the First Time

Use the command palette and search for the "Remote-SSH: Connect to Host" command. You will prompted with a list of your known SSH hosts as well as options to add a new host or configure them. Choose your access point from the list and select "Connect in Current Window" option to initiate the connection. The first time that you have connected to the access point while using VS Code, you will be prompted to confirm the authenticity of the SSH key; enter "yes" to confirm and proceed. 

After selecting the "Remote-SSH: Connect to Host" command, you will be prompted to enter your password and Duo authenticate as usual. Once authenticated, this terminal prompt remain open but you will not be able to use it for running commands (this is the "install" process that manages VS Code's connection to the server). Instead, you should open a new terminal to run commands. 

> You may be prompted to install a newer version of `git` or other software; dismiss these prompts as you do not have permissions to modify the software installed on the access point.	

## 5. Viewing Files on the Access Point

Once you have connected to the access point via VS Code, you will need to login a second time to see your files. Open the "Explorer" toolbar (it should be listed under the "View" menu). Click the "Open Folder" button, which will prompt you to provide the path; hit the enter key to accept the default value (your home directory on the access point). You will then be prompted to login again, after which you will be able to see and manipulate your files on the access point in VS Code's file explorer toolbar. 

## 6. Install the HTCondor VS Code Extension

Log in to your access point. Then open the Extensions toolbar and search for "Htcondor", published by htcondor, and install the extension. 

This extension is under active development. Current features include syntax highlighting for submit files, documentation tooltips on hover over submit commands, and submit file templates. Create a file that ends with `.sub` and test it out!

## Best Practices

The process(es) that VS Code runs on the access point when it is connected can be more intensive than a "regular" SSH connection. Therefore, if you have multiple separate VS Code connections to the access point, you may slow down the server. We recommend that you only have one VS Code connection to the access point at a time, i.e., do not log in to the access point using VS Code unless you have closed the previous session. 

## Troubleshooting

When you connect to the access point, VS Code installs a "remote server" on the access point, allowing you to use VS Code to write and manipulate files directly. This will occur every time you connect to the submit server using VS Code, but VS Code should be able to find its previous installation. Sometimes, however, this process may not work correctly. If you are having issues connecting to the access point using VS Code, but are able to login via SSH as usual, then there are a couple steps that you can try.

1. *Kill the VS Code process on the access point*: Use the command palette and search for the command "Remote-SSH: Kill VS Code Server on Host" and select the server that you are having issues connecting to. You will be prompted to log in (in order to send the kill command) but you will not connect to the access point. If this doesn't fix the issue, continue to the next step.

2. *Remove the VS Code remote server from the access point*: Use the command palette and search for the command "Remote-SSH: Uninstall VS Code Server from Host". You will be prompted to log in (in order to send the uninstall command) but you will not connect to the access point. If this doesn't fix the issue, continue to the next step.

3. *Manually kill and remove VS Code remote server on the access point*: This process does not use VS Code. Log in to the access point using SSH as you would normally do when not using VS Code. Then, run the following command:

   ```
   kill -9 $(ps aux | grep VS Code-server | grep $USER | grep -v grep | awk '{print $2}')
   ```
   {:.term}

   If there are VS Code processes running on the server, this command will find only yours and then kill them. If you don't have any VS Code processes running on the server, then you may get the help text for the `kill` command.

   Next, remove the VS Code directory from your home directory:

   ```
   rm -rf ~/.vscode-server
   ```
   {:.term}

   At this point, VS Code should have been completely removed from you account on the access point, and you should be able to repeat the steps in this guide to setup and connect again. 
