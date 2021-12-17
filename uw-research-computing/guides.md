---
highlighter: none
layout: markdown-page
title: Computing Guides
---

 <link rel = "stylesheet"
   type = "text/css"
   href = "bootstrap.css" />

<p>
Below is a list of guides for some of the most common tasks our users need to
carry out as they begin and continue to use the resources at the CHTC. 
Some of these are general computing solutions; others are specific to <a href="http://research.cs.wisc.edu/htcondor/">HTCondor</a>
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
	<a href="{{ '/approach' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Our Approach: High Throughput Versus High Performance Computing</li></a>
</div>


<hr>
<a name="htc"></a>
<h1>Use the HTC System</h1>

<!-- <h2>HTC Roadmap</h2>

<p>If you are new to high throughput computing, our <a href="{{ 'roadmap' | relative_url }}">HTC roadmap</a> walks you 
through the process of creating your own large-scale job submission, step-by-step.</p> -->

<h2>Guides by Topic</h2>
<div class="card-deck">
	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="{{ '/uw-research-computing/guide-icons/checkmark.png' | relative_url }}" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">Basics and Policies</h5>
		<ul class="list-group list-group-flush" style="height: auto !important; border-radius: 1px;">
			<a href="{{ '/uw-research-computing/use-submit-node' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Using CHTC's HTC Submit Nodes</li></a>
			<a href="{{ '/uw-research-computing/connecting' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Connecting to CHTC</li></a>
			<a href="{{ '/uw-research-computing/check-quota' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Checking Disk Quota and Usage</li></a>
			<a href="{{ '/uw-research-computing/get-help' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Get Help</li></a>
		</ul>
	</div>
			
	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="{{ '/uw-research-computing/guide-icons/laptop_arrow.png' | relative_url }}" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">Job Submission</h5>
		<ul class="list-group list-group-flush" style="height: auto; border-radius: 1px;">
			<a href="{{ '/uw-research-computing/helloworld' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Running Your First HTC Jobs</li></a>
			<a href="{{ '/uw-research-computing/condor_q' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Learning About Your Jobs Using <code>condor_q</code></li></a>
			<a href="{{ '/uw-research-computing/multiple-jobs' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Submitting Multiple Jobs</li></a>
			<a href="{{ '/uw-research-computing/dagman-workflows' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Workflows with HTCondor's DAGMan</li></a>
			<a href="{{ '/uw-research-computing/multiple-job-dirs' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Submitting Multiple Jobs in Different Directories</li></a>
			<a href="{{ '/uw-research-computing/os-transition' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Opting Into a Specific Operating System</li></a>
		</ul>
	</div>
		
	
	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="{{ '/uw-research-computing/guide-icons/data.png' | relative_url }}" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">Handling Data in Jobs</h5>
		<ul class="list-group list-group-flush" style="height: auto !important; border-radius: 1px;">
			<a href="{{ '/uw-research-computing/file-availability' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Small Input and Output File Transfer</li></a>
        	<a href="{{ '/uw-research-computing/file-avail-squid' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Large Input File Availability Via Squid</li></a>
        	<a href="{{ '/uw-research-computing/file-avail-largedata' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Large Input and Output File Availability Via Staging</li></a>
        	<a href="{{ '/uw-research-computing/transfer-data-researchdrive' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Transferring Files Between CHTC and Research Drive</li></a>
        	<a href="{{ '/uw-research-computing/globus' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Using Globus to Transfer Files to and from CHTC</li></a>
		</ul>
	</div>
			
</div>

<br>
<div class="card-deck">
	
	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="{{ '/uw-research-computing/guide-icons/gear.png' | relative_url }}" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">Software Solutions</h5>
		<ul class="list-group list-group-flush" style="height: auto !important; border-radius: 1px;">
			<a href="{{ '/uw-research-computing/inter-submit' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Compiling Software in an Interactive Job</li></a>
			<a href="{{ '/uw-research-computing/matlab-jobs' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Running Matlab Jobs</li></a>
			<a href="{{ '/uw-research-computing/python-jobs' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Running Python Jobs</li></a>
			<a href="{{ '/uw-research-computing/conda-installation' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Using Conda Environments to Run Python Jobs</li></a>
			<a href="{{ '/uw-research-computing/r-jobs' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Running R Jobs</li></a>
			<a href="{{ '/uw-research-computing/julia-jobs' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Running Julia Jobs</li></a>
			<a href="{{ '/uw-research-computing/java-jobs' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Running Java Jobs</li></a>
			<a href="{{ '/uw-research-computing/docker-jobs' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Using Software Installed in a Docker Container</li></a>
			<a href="{{ '/uw-research-computing/docker-build' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Create a Docker Container</li></a>
			<a href="{{ '/uw-research-computing/licensed-software' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Licensed Software on the HTC System</li></a>
			<a href="{{ '/uw-research-computing/mpi-jobs' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Submitting Jobs that use MPI</li></a>
		</ul>
	</div>				
			
	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="{{ '/uw-research-computing/guide-icons/processor.png' | relative_url }}" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">Special Use Cases</h5>
		<ul class="list-group list-group-flush" style="height: auto !important; border-radius: 1px;">
			<a href="{{ '/uw-research-computing/machine-learning-htc' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Run Machine Learning Jobs</li></a> 
			<a href="{{ '/uw-research-computing/scaling-htc' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Scaling Beyond Local HTC Capacity</li></a> 
			<a href="{{ '/uw-research-computing/high-memory-jobs' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Submitting High Memory Jobs</li></a>
			<a href="{{ '/uw-research-computing/gpu-jobs' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Submitting Jobs that use GPUs</li></a>
			<a href="{{ '/uw-research-computing/mpi-jobs' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Submitting Jobs that use MPI</li></a>
		</ul>
	</div>
			
	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="{{ '/uw-research-computing/guide-icons/trouble.png' | relative_url }}" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">Troubleshooting</h5>
		<ul class="list-group list-group-flush" style="height: auto !important;">
        	<a href="{{ '/uw-research-computing/dos-unix' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Windows/Linux Incompatibility</li></a>
        	<a href="{{ '/uw-research-computing/docker-test' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">Explore and Test Docker Containers</li></a>
		</ul>
	</div>						
</div>

<hr>
<a name="hpc"></a>
<h1>Use the HPC Cluster</h1>

<!--<h2>HPC Roadmap</h2>

<p>Our <a href="{{ '/roadmap' | relative_url }}">HPC Cluster roadmap</a> walks you 
through the process of using the cluster, step-by-step.</p> -->

<h2>Guides by Topic</h2>
<div class="card-deck">

	<div class="card border-secondary h-100" >    
		 <img alt="Card image cap" class="card-img-top img-responsive" src="{{ '/uw-research-computing/guide-icons/servers.png' | relative_url }}" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<h5 class="card-title text-center">HPC Cluster Guides</h5>
		<ul class="list-group list-group-flush" style="height: auto !important;">
			<a href="{{ '/uw-research-computing/connecting' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">Connecting to CHTC</li></a>
			<a href="{{ '/uw-research-computing/hpc-overview' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">HPC Cluster Overview Guide</li></a>
			<a href="{{ '/uw-research-computing/hpc-software' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important; border-radius: 1px;">HPC Software</li></a>
			<a href="{{ '/uw-research-computing/hpc-job-submission' | relative_url }}"><li class="list-group-item list-group-item-action list-group-item-dark h-100" style="width: auto; height: auto !important;">HPC Job Submission</li></a>
		</ul>
	</div>

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
<a href="{{ '/icon_credits' | relative_url}}">Icon Credits</a>
