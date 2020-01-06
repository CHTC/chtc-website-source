# CHTC Website

Source repository for CHTC website

[![Build Status](https://travis-ci.org/CHTC/chtc-website-source.svg?branch=master)](https://travis-ci.org/CHTC/chtc-website-source)

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

## Testing Changes Locally

1. Install Docker if you don't already have it on your computer and open a terminal. 
2. Pull the `jekyll` container

		docker pull jekyll/jekyll
3. `cd` to your local copy of the `chtc-website-source` repository
4. Start Docker: 

		docker run -it --rm=true -v $PWD:/srv/jekyll --publish 8080:8080 clk/jekyll jekyll serve -P 8080
	The first time you do this, you'll have to wait for about 3-5 minutes for jekyll to 
build all its dependencies and then render the website. 
5. The website should appear at `localhost:8080`. 

## Formatting

### Markdown Reference and Style

This is a useful reference for most common markdown features: https://daringfireball.net/projects/markdown/

To format code blocks, we have the following special formatting tags: 

	```

	```
	{:.sub}

`.sub` will generate a "submit file" styled block; `.term` will create a terminal, and `.file` can 
be used for any generic text file. 

We will be using the pound sign for headers, not the `==` or `--` notation. 

### Converting HTML to Markdown

Right now, most of our pages are written in html and have a `.shtml` extension. We are 
gradually converting them to be formatted with markdown. To easily convert a page, you 
can install and use the `pandoc` converter: 

	pandoc <filename>.shtml --from html --to markdown > <filename>.md