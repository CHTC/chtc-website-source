---
highlighter: none
layout: default
title: Welcome to the CHTC GPU Lab
---

The CHTC GPU Lab is a [UW2020-funded project][uw2020] that will expand shared GPU 
computing infrastructure at UW-Madison.  It will include:

 <link rel = "stylesheet"
   type = "text/css"
   href = "bootstrap.css" />

<div class="card-deck">
	<div class="card border-secondary h-100" >    
		 <h5 class="card-title text-center">Hardware</h5>
		 <img alt="Card image cap" class="card-img-top img-responsive" src="guide-icons/noun_gpu_2528527.png" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<p style="padding:10px">A pool of shared GPU servers managed by CHTC.</p>
	</div>
	<div class="card border-secondary h-100" >    
		 <h5 class="card-title text-center">Expertise</h5>
		 <img alt="Card image cap" class="card-img-top img-responsive" src="guide-icons/noun_people_1188645.png" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<p style="padding:10px">A community of technical experts.</p>
	</div>
	<div class="card border-secondary h-100" >    
		 <h5 class="card-title text-center">Documentation</h5>
		 <img alt="Card image cap" class="card-img-top img-responsive" src="guide-icons/noun_open book_1179297.png" style="margin-left: auto;margin-right: auto;width: 30%;"/>
		<p style="padding:10px">A library of sharable software and documentation.</p>
	</div>
</div>

## Get Involved

If you want to use GPU resources in CHTC for your research: 

- Apply for a CHTC account if you do not already have one: [Account Request Page][account]
- See what GPUs are available and how to use them in the [GPU jobs guide][gpu-jobs]
- See the instructions below to opt-in to use the CHTC GPU Lab servers
- See our guide with specific machine learning related tips: [Running Machine Learning Jobs on HTC][ml-guide]
- For more extended examples, see the following: [Runnable examples on GitHub][gpu-examples]

The CHTC GPU Lab mailing list is used to announce new GPU hardware availability and 
GPU-related events, solicit feedback from GPU users, and share best practices for 
GPU computing in CHTC. Any CHTC user can subscribe to the list by 
emailing [join-chtc-gpu-lab@lists.wisc.edu](mailto:join-chtc-gpu-lab@lists.wisc.edu).
Their subscription request will be reviewed by the list administrators.

## CHTC GPU Lab policies

There are a limited number of shared use GPUs available through the CHTC GPU
Lab. Therefore, these servers have different policies about job runtimes and
the maximum number of running jobs per user than general CHTC servers.
These GPUs are a special investment from the UW2020 program, and the policies
aim to maximize how many researchers can benefit from this investment.

By opting-in to use the CHTC GPU Lab servers, you agree to be contacted by the
project leaders occasionally to discuss your GPU computing and help improve the
GPU Lab.

### Job types, runtimes, and per-user limitations

{:.gtable}
  | Job type | Submit file name (?) | Maximum runtime | Per-user limitation |
  | --- |
  | Short | ? | 12 hrs | 2/3 of CTHC GPU Lab GPUs |
  | Medium | ? | 24 hrs | 1/3 of CTHC GPU Lab GPUs |
  | Long | ? | 7 days | 1 job with 1-2 GPUs |
  | Interactive | ? | 4 hours | 1 job with 1 GPU |
  | Pre-emptable (backfill) | ? | None | None |

These job types, runtimes, and per-user limitations are subject to change with
short notice as the CHTC GPU Lab studies usage patterns.

### Modifying the submit file

To accept the CHTC GPU Lab policies and opt-in to use these GPUs, add the
following line to your submit file:

``` {.sub}
+WantGPULab = true
```
**<todo: finalize the syntax>**

To specify the job type... **<todo: finalize the syntax>**

``` {.sub}
???
```

If you do not specify a job type, the Medium job type will be used as the default.

> The CHTC GPU Lab is led by Anthony Gitter, Lauren Michael, Brian Bockelman, and Miron Livny.

> UW2020 is funded by the Office of the Vice Chancellor for Research and Graduate 
Education and the Wisconsin Alumni Research Foundation.

For more information about the CHTC GPU Lab project contact [Anthony Gitter][gitter]. 

[account]: form.shtml
[gpu-examples]: https://github.com/CHTC/templates-GPUs
[gpu-jobs]: gpu-jobs.shtml
[gitter]: https://www.biostat.wisc.edu/~gitter/index.html
[ml-guide]: machine-learning-htc.shtml
[uw2020]: https://research.wisc.edu/funding/uw2020/round-5-projects/enabling-graphics-processing-unit-based-data-science/
