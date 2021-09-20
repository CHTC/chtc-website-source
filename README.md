# CHTC Website

Source repository for CHTC website

![Build Status](https://github.com/CHTC/chtc-website-source/workflows/Build%2Fdeploy%20web%20pages/badge.svg)

## How to Edit

### Setup (one time, or anytime you want to start fresh)

1. "Fork" the Github source repository (look for the fork button at the 
top right of this page: https://github.com/CHTC/chtc-website-source). 
1. Clone the source repository to your own computer. 

		git clone https://github.com/CHTC/chtc-website-source
1. `cd` into the `chtc-website-source` folder and add your Github fork to the list of 
remotes: 

		git remote add mycopy https://github.com/myusername/chtc-website-source

### Submit a Pull Request (each major change)

1. Create a branch for new work and switch to it: 

		git branch feature-name
		git checkout feature-name
	Your changes will now be saved in this branch. 
1. Make changes to files and add/commit them, following the usual git add/commit workflow. You 
can test your changes at any time by following the [instructions below](#testing-changes-locally). 
1. Once you're satisfied with your changes and have committed them, push the branch 
to **your fork**:

		git push mycopy feature-name
1. On Github, go to your fork of the repo. There will likely be a message prompting you 
to open and submit a pull request.  

If you need to update the pull requests, make the necessary changes on your computer, 
commit them, and then push the same branch to your fork. 

### Update your copy

To update your local copy of the source repository, make sure that you're on the `master` 
branch; then pull from the original CHTC Github repository: 

	git checkout master
	git pull origin master

## Testing Changes on Remote

:exclamation: This is a new feature!

To test changes on a publicly viewable development location do the following steps.

- Populate a branch with the changes you would like to preview and prepend the name of the branch with 'preview-'
  - For this example we will call our branch 'preview-helloworld'
- Push the branch to the remote repository at 'https://github.com/CHTC/chtc-website-source.git'
- View the changes at:
	- https://chtc.github.io/web-preview/<preview-branch>/
	- In this demo we would look in https://chtc.github.io/web-preview/preview-helloworld/
	
**You can continue to push commits to this branch and have them populate on the preview at this point!**

- When you are satisfied with these changes you can create a PR to merge into master
- Delete the preview branch and Github will take care of the garbage collection!

## Testing Changes Locally

### Quickstart (Unix Only)

1. Install Docker if you don't already have it on your computer.
2. Open a terminal and `cd` to your local copy of the `chtc-website-source` repository
3. Run the `./edit.sh` script.
4. The website should appear at [http://localhost:8080](http://localhost:8080). Note that this system is missing the secret sauce of our setup that converts 
the pages to an `.shtml` file ending, so links won't work but just typing in the name of a page into the address bar (with no 
extension) will. 

### Run Docker Manually

1. Install Docker if you don't already have it on your computer and open a terminal. 
2. Pull the `jekyll` container

		docker pull jekyll/jekyll
3. `cd` to your local copy of the `chtc-website-source` repository
4. Start Docker: 

		docker run -it --rm=true -v $PWD:/srv/jekyll --publish 8080:8080 jekyll/jekyll jekyll serve -P 8080
	The first time you do this, you'll have to wait for about 3-5 minutes for jekyll to 
build all its dependencies and then render the website. 
5. The website should appear at [http://localhost:8080](http://localhost:8080). Note that this system is missing the secret sauce of our setup that converts 
the pages to an `.shtml` file ending, so links won't work but just typing in the name of a page into the address bar (with no 
extension) will. 

## Formatting

### Markdown Reference and Style

This is a useful reference for most common markdown features: https://daringfireball.net/projects/markdown/

To format code blocks, we have the following special formatting tags: 

	```
	Pre-formatted text / code goes here
	```
	{:.sub}

`.sub` will generate a "submit file" styled block; `.term` will create a terminal style, and `.file` can 
be used for any generic text file. 

We will be using the pound sign for headers, not the `==` or `--` notation. 

For internal links (to a header inside the document), use this syntax: 
* header is written as
	```
	## A. Sample Header
	```
* the internal link will look like this: 
	```
	[link to header A](#a-sample-header)
	```

### Converting HTML to Markdown

Right now, most of our pages are written in html and have a `.shtml` extension. We are 
gradually converting them to be formatted with markdown. To easily convert a page, you 
can install and use the `pandoc` converter: 

	pandoc hello.shtml --from html --to markdown > hello.md

You'll still want to go through and double check / clean up the text, but that's a good starting point. Once the 
document is converted from markdown to html, the file extension should be `.md` instead. If you use the 
command above, this means you can just delete the `.shtml` version of the file and commit the new `.md` one. 
