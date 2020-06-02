---
highlighter: none
layout: default
title: Computing Guides
---

 <link rel = "stylesheet"
   type = "text/css"
   href = "bootstrap.css" />

<p>
Below is a list of guides for some of the most common tasks our users need to
carry out as they begin and continue to use the resources at the CHTC. 
Some of these are general computing solutions; others are specific to HTCondor
or to the configuration of CHTC computing resources.
<br />
Guides will be added to the list as we can provide them. Please contact us
(email at bottom of page) if you find any of the information to be incorrect.
</p>


<div class="card-deck">
	<div class="card border-secondary h-100 text-center">  
		<a href="#gen"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">General Computing</li></a>
	</div>
	<div class="card border-secondary h-100 text-center">  
		<a href="#htc"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">HTC System</li></a>
	</div>
	<div class="card border-secondary h-100 text-center">  
		<a href="#hpc"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">HPC Cluster</li></a>
	</div>
	<div class="card border-secondary h-100 text-center">  
		<a href="#ext"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">External Resources</li></a>
	</div>
</div>

			

<hr>
<a name="gen"></a>
<h1>General Computing</h1>

<br>
<div class="card border-secondary text-center" style="width: 60%; margin: auto;">  
	<a href="/approach.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Our Approach: High Throughput Versus High Performance Computing</li></a>
</div>


<hr>
<a name="htc"></a>
<h1>Use the HTC System</h1>

<!-- <h2>HTC Roadmap</h2>

<p>If you are new to high throughput computing, our <a href="/roadmap.shtml">HTC roadmap</a> walks you 
through the process of creating your own large-scale job submission, step-by-step.</p> -->

<h2>Guides by Topic</h2>
<div class="card-deck">
	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="guide-icons/checkmark.png" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">Basics and Policies</h5>
		<ul class="list-group list-group-flush" style="height: auto !important; border-radius: 1px;">
			<a href="/use-submit-node.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Using CHTC's HTC Submit Nodes</li></a>
			<a href="/connecting.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Connecting to CHTC</li></a>
			<a href="/check-quota.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Checking Disk Quota and Usage</li></a>
			<a href="/get-help.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Get Help</li></a>
		</ul>
	</div>
			
	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="guide-icons/laptop_arrow.png" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">Job Submission</h5>
		<ul class="list-group list-group-flush" style="height: auto; border-radius: 1px;">
			<a href="/helloworld.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Running Your First HTC Jobs</li></a>
			<a href="/condor_q.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Learning About Your Jobs Using <code>condor_q</code></li></a>
			<a href="/multiple-jobs.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Submitting Multiple Jobs</li></a>
			<a href="/multiple-job-dirs.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Submitting Multiple Jobs in Different Directories</li></a>
			<a href="/os-transition.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Opting Into a Specific Operating System</li></a>
		</ul>
	</div>
		
	
	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="guide-icons/data.png" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">Handling Data in Jobs</h5>
		<ul class="list-group list-group-flush" style="height: auto !important; border-radius: 1px;">
			<a href="/file-availability.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">HTCondor File Transfer</li></a>
        	<a href="/file-avail-squid.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">File Availability with Squid Web Proxy</li></a>
        	<a href="/file-avail-largedata.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">File Availability for Large Data</li></a>
		</ul>
	</div>
			
</div>

<br>
<div class="card-deck">
	
	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="guide-icons/gear.png" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">Software Solutions</h5>
		<ul class="list-group list-group-flush" style="height: auto !important; border-radius: 1px;">
			<a href="/inter-submit.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Compiling Software in an Interactive Job</li></a>
			<a href="/matlab-jobs.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Running Matlab Jobs</li></a>
			<a href="/python-jobs.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Running Python Jobs</li></a>
			<a href="/conda-installation.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Using Conda Environments to Run Python Jobs</li></a>
			<a href="/r-jobs.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Running R Jobs</li></a>
			<a href="/java-jobs.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Running Java jobs</li></a>
			<a href="/docker-jobs.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Using Software Installed in a Docker Container</li></a>
			<a href="/docker-build.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Create a Docker Container</li></a>
			<a href="/licensed-software.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Licensed Software on the HTC system</li></a>
			<a href="/mpi-jobs.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Submitting Jobs that use MPI</li></a>
		</ul>
	</div>				
			
	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="guide-icons/processor.png" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">Special Use Cases</h5>
		<ul class="list-group list-group-flush" style="height: auto !important; border-radius: 1px;">
			<a href="/machine-learning-htc.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Run Machine Learning Jobs</li></a> 
			<a href="/scaling-htc.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Scaling Beyond Local HTC Capacity</li></a> 
			<a href="/high-memory-jobs.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Submitting High Memory Jobs</li></a>
			<a href="/gpu-jobs.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Submitting Jobs that use GPUs</li></a>
			<a href="/mpi-jobs.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Submitting Jobs that use MPI</li></a>
		</ul>
	</div>
			
	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="guide-icons/trouble.png" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">Troubleshooting</h5>
		<ul class="list-group list-group-flush" style="height: auto !important;">
        	<a href="/dos-unix.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Windows/Linux Incompatibility</li></a>
        	<a href="/docker-test.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Explore and Test Docker Containers</li></a>
		</ul>
	</div>						
</div>

<hr>
<a name="hpc"></a>
<h1>Use the HPC Cluster</h1>

<!--<h2>HPC Roadmap</h2>

<p>Our <a href="/roadmap.shtml">HPC Cluster roadmap</a> walks you 
through the process of using the cluster, step-by-step.</p> -->

<h2>Guides by Topic</h2>


<br>
<div class="card border-secondary" style="width: 31.5%;" >    
	<img alt="Card image cap" class="card-img-top img-responsive" src="guide-icons/servers.png" style="margin-left: auto;margin-right: auto;width: 30%;"/>
	<h5 class="card-title text-center">All Cluster Guides</h5>
	<ul class="list-group list-group-flush" style="height: auto !important;">
		<a href="/connecting.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Connecting to CHTC</li></a>
		<a href="/HPCuseguide.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">HPC Cluster Basic Use Guide</li></a>
		<a href="/MPIuseguide.shtml"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">MPI Use Guide</li></a>
	</ul>
</div>	


<hr>
<a name="ext"></a>
<h1>External Resources</h1>

<br>
<div class="list-group border-secondary" style="width: 70%; height: auto !important;">
		<a href="http://software-carpentry.org/lessons/" class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Software Carpentry (online courses and videos; readings)</a>
		<a href="http://research.cs.wisc.edu/htcondor/manual/" class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">HTCondor Manual</a>
		<a href="http://slurm.schedmd.com/" class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Slurm Manual</a>
		<a href="http://www.doit.wisc.edu/training/student/" class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">DoIT Software Training for Students (free on-campus courses)</a> 
</div>
			

<br />

<hr>
<a href="/icon_credits.shtml">Icon Credits</a>

