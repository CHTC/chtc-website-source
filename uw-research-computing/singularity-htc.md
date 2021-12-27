---
highlighter: none
layout: markdown-page
title: Using Software in a Singularity Container on the HTC System
---

If you have software packaged in an existing Docker or Singularity 
container, you can run it on CHTC's HTC system using Singularity. 

The two steps to run a container using Singularity
1.  [(if needed) Convert the Docker image to a Singularity image file](#image)
2.  [Run a job that uses the container](#command)

<a name="image"></a>

**1. Convert Container to Singularity Format**
===================

To run a Singularity container in the HTC system, the container needs 
to be in the Singularity image file format. If your container was 
created as a Docker container, follow the following steps to convert 
it to a Singularity image format. 

1. Start an interactive job following the instructions on this page. You won't
 have any input files, so you can comment out the `transfer_input_files` option. 
[Running an interactive build job](inter-submit)

1.  Once the interactive job starts, you'll need to unset a shell environment
variable that prevents download of the Docker container. 
	```
	[alice@build]$ unset HTTPS_PROXY
	```

1. Then, save the Docker container to a Singularity image. You'll need the name of 
the Docker image on DockerHub or (the link to it at another location) and you will 
provide the name you want to use for the saved Singularity image file: 
	``` 
	[alice@build]$ singularity build /software/alice/name.simg docker://user/image:version
	```
	{:.term}
	
	For example, if user \"Alice\" wanted to use the ["Rocker" geospatial container
	provided on DockerHub](https://hub.docker.com/r/rocker/geospatial),
	and save it to a file named `fenics.simg`, she would run:

	``` 
	[alice@build]$ singularity build /software/alice/rocker-geo.simg docker://rocker/geospatial:4.1.1
	```
	{:.term}

1. Once the Singularity command completes, type `exit` to leave the interactive job. The 
Singularity image file should be copied back to your home directory. 

<a name="command"></a>

**2. Using Singularity Container Images in Jobs**
===================

To use the Singularity image file to run jobs, the submit file will include a 
`+SingularityImage = ` option and a requirement to run on computers with Singularity. 
How these two options appear will depend on the size of your image file. 

- **For Image Files < 100MB use HTCondor File Transfer**

If the Singularity image file is less than 100MB, it can be copied 
to the job from the home directory using HTCondor file transfer. 

The submit file options should look like this: 

``` {.sub}
transfer_input_files = image.simg
+SingularityImage = "./image.simg"

requirements = (HasSingularity == true)
```

- **For Image Files < 1GB use SQUID**

If the Singularity image file is larger than 100MB but less than 1GB, it can be 
placed on our SQUID web server and downloaded into the job. Follow the instructions 
on this page to gain access to SQUID and upload your data: [File Availability with SQUID](file-avail-squid)

Once the image is staged in SQUID, use the following submit file options: 

``` {.sub}
transfer_input_files = http://proxy.chtc.wisc.edu/SQUID/user/image.simg
+SingularityImage = "./image.simg"

requirements = (HasSingularity == true)
```

- **For Image Files > 1GB use Shared Software Directory**

If the Singularity image file is larger than 1GB, request a shared `/software` directory 
from the CHTC facilitators by emailing chtc@cs.wisc.edu. 

Once the image is placed in `/software`, use the following submit file options: 

``` {.sub}
+SingularityImage = "/software/user/image.simg"

requirements = (HasSingularity == true) && (HasCHTCSoftware == true)
```
