---
highlighter: none
layout: guide
title: Remote Access a Private GitHub Repository
guide:
    order: 6
    category: Basics and Policies
    tag:
        - htc
        - hpc
---

This guide describes how to remotely access a private GitHub repository from the HTC and HPC clusters, specifically
* how to generate an SSH key pair

* how to add a public SSH key to your GitHub account

* how to remotely access your private GitHub repository

You will need to have access to a CHTC cluster.  You will also need to have a GitHub account  with access to the private repository of interest.

## A. Generate the SSH Key Pair

We will be following the instructions provided by GitHub to generate the SSH key pair ([Generating a new SSH key...](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)).

1. Log in to the submit node as usual ([Connecting to CHTC](connecting.html)).

2. Generate the SSH key by running the following command, where the example email is replaced with the email that you use for your GitHub account. 
   ```
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   {:.term}

   A message will appear stating that the key pair is being generated.

3. A second message will appear prompting you to enter the location where the SSH keys should be stored:
   ```
   Enter a file in which to save the key (/home/your_NetID/.ssh/ed25519):
   ```
   {:.term}

   Simply hit the enter key to accept the specified file path.
   > *Note*: If a SSH key already exists at the displayed path it will be overwritten by this action.
   > This can be avoided by typing in an alternate path before pressing the enter key.

4. You will be prompted to create a passphrase.  Type your desired passphrase and then hit enter.  Repeat a second time when asked to confirm your passphrase.
   > **Warning**: If you leave the passphrase empty (hit enter without typing anything), a passphrase will not be created nor required for using the SSH connection.  In principle, this means anyone with access to the private key can access and modify your GitHub account remotely.

5. A message will appear confirming the creation of the SSH key pair, as well as the paths and names of the private and public keys that were generated.  Make note of these paths for use in the following steps.


## B. Add the SSH Key to Your GitHub Account

Now we will be adding the SSH public key to your GitHub account, following the instructions provided by GitHub ([Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)).

1. Copy the contents of the public SSH key file (`id_ed25519.pub`) created in Part A.  There are several ways of doing this.

   > If you provided an alternate file name in Step 3. of Part A., then the public SSH key will be the name of that file plus the `.pub` extension.

   * Print the contents of the file to the screen by entering the following command, replacing `your_NetID` with your actual NetID. 
      ```
      cat /home/your_NetID/.ssh/id_ed25519.pub
      ```
      {:.term}
   * Use a terminal editor (`nano`, `vi`, etc.) to open and view the file
   * Use a file transfer method to transfer the file to your local computer ([Transferring Files](connecting.html#transfer)).

2. Next, log in to [github.com](https://github.com/) using the same email that you used in Step 2. of Part A.
3. Go to your account settings by clicking on your profile icon in the top right corner of the webpage, then click on **Settings** within the drop-down menu.  *If your browser window is small, the **Settings** button can be found by clicking the menu button at the top left of the webpage.*
4. Go to the **SSH and GPG keys** section.  Under the **SSH keys** section, click **New SSH key**.
5. Paste the contents of the SSH public key from Step 1. into the **Key** textbox.
6. Name the SSH key using the **Title** textbox.  We recommend "CHTC" plus the name of the submit node.  For example: "CHTC submit1".
7. Click **Add SSH key**.  The SSH key will now appear in the **SSH keys** section in your GitHub account settings.

## C. Accessing Your Private GitHub Repository from the Cluster
Once the SSH key has been added to your GitHub account, you can access your private repository using the repository's SSH address.

1. In your web browser and while logged in to your GitHub account, go to webpage for the private repository.
2. Click the **<>Code** button, then select the **Local** tab and then the **SSH** tab.
3. Copy the SSH address that is shown.
4. On the CHTC submit node, you can now access the repository using `git` commands by using the SSH address in place of the HTTPS address.  For example,

   ```
   git clone git@github.com:username/user-private-repository.git
   ```
   {:.term}

5. If prompted for a passphrase when running commands with the SSH address, provide the passphrase you created in Step 4. of Part A.

### From an interactive job

Because the interactive job takes place on a different node than the submit node, it will not know about the SSH key that you set up above.  Use the following instructions to transfer and use the private identity key in the interactive job (see [Compiling or Testing Code with an Interactive Job](inter-submit.html) for more information on interactive jobs).

1. When creating the submit file for your interactive job, include the path to the private SSH key identity file as a value for the `transfer_input_files` keyword.  This will ensure that the identity file is copied to the interactive job directory.  For example,

   ```
   transfer_input_files = /home/your_NetID/.ssh/id_ed25519, /path/to/include/other/files
   ```

   >*Note:* Make sure that you are transferring the *private* SSH key file, not the *public*.  The public SSH key should have the `.pub` extension, while the private SSH key does not.

2. Once your submit file is set up, start the interactive job using `condor_submit -i` and then the name of your submit file.  When the interactive job has started, you will see that the private SSH key file is included in the initial directory.  The SSH program, however, still needs to be told to use it.
3. Initialize an SSH agent using the command 

   ```
   eval "$(ssh-agent -s)"
   ```
   {:.term}

4. Add the private SSH to the SSH agent by using the `ssh-add` command followed by the name of the private SSH key file that you transferred.  You will be prompted to enter the passphrase that you created when you created the SSH key pair.  For example,

   ```
   ssh-add id_ed25519
   ```
   {:.term}

   You will now be able to access the repository during the interactive job.


## Additional Notes

* If you forget the passphrase you created in Step 4. of Part A., you will need to repeat this guide to create a new SSH key pair to replace the previous one.
* When using the SSH address to your repository with non-`git` commands, you may need to replace the colon (`:`) in the address with a forward slash (`/`).  For example,

   **Original SSH address**
   ```
   git@github.com:username/user-private-repository.git
   ```
   {:.term}

   **Modified SSH address**
   ```
   git@github.com/username/user-private-repository.git
   ```
   {:.term}
