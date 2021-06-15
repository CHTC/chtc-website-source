---
highlighter: none
layout: markdown-page
title: Using Dask at CHTC
---

[Dask](https://docs.dask.org/en/latest/) 
is a Python library for parallel computing.
Though it is not the 
[traditional HTCondor workflow](helloworld), it is possible to use
Dask on the CHTC pool through a special adapter package provided by CHTC.
This guide describes the situations in which you should consider using
Dask instead of the traditional workflow, and will point you toward the
documentation for the adapter package (which will guide you through
actually using it).

> This is a new *how-to* guide on the CHTC website. Recommendations and 
> feedback are welcome via email ([chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu)) or by creating an 
> issue on the CHTC website GitHub repository: [Create an issue](https://github.com/CHTC/chtc-website-source/issues/new)


## What is Dask?

[Dask](https://docs.dask.org/en/latest/) 
is a Python library that can "scale up" Python code in two ways:
- "Low-level" parallelism, through transparently-parallel calculations on familiar interfaces like `numpy` arrays.
- "High-level" parallelism, through an explicit run-functions-in-parallel interface.

Both kinds of parallelism can be useful, depending on your work.
For example, Dask could be used to perform data analysis on a single multi-TB
dataframe stored in distributed memory, as if it was all stored locally.
It could also be used to run thousands of independent simulations across
a cluster, aggregating their results locally as they finish.
Dask can also smoothly handle cases between these extremes (perhaps each of your
independent simulations also needs a large amount of memory?).

Dask also "scales down": it runs the same way on your laptop as it does on
a cluster thereby providing a smooth transition between running on
local resources and running on something like the CHTC pool.


## When should I use Dask at CHTC?

Several use cased are described below for considering the use of Dask for parallelism 
in CHTC instead of the [traditional HTCondor workflow](helloworld.shtml) 
of creating jobs and DAGs:

- You are already using Dask for parallelism and want to smoothly scale
  up your computing resources. Note that many foundational libraries in the
  scientific Python ecosystem, like [xarray](https://xarray.pydata.org/en/stable/),
  now use Dask internally.
- You are already using something like 
  [multiprocessing](https://docs.python.org/3/library/multiprocessing.html) or
  [joblib](https://joblib.readthedocs.io/en/latest/)
  for high-level parallelism. 
  Dask's high-level parallelism interface is fairly similar to these libraries,
  and switching from them to Dask should not involve too much work.
- You can make your overall workflow more efficient by adjusting it based
  on intermediate results.
  For example,
  [adaptive hyperparameter optimization](https://ml.dask.org/hyper-parameter-search.html#adaptive-hyperparameter-optimization)
  can be significantly more efficient than something like a random grid search,
  but requires a "controller" to guide the process at every step.
- You want to operate on single arrays or dataframes that are larger 
  than can be stored in the memory of a single average CHTC worker 
  (more than a few GB). Dask can store this kind of data in "chunks" on workers
  and seamlessly perform calculations on the chunks in parallel.
- You want your workflow to "scale down" to local resources. Being able to run
  your workflow locally may make developing and testing it easier.
- You want a more interactive way of using the CHTC pool. 
  The adapter package provides tools for running Jupyter Notebooks on the
  CHTC pool, connected to your Dask cluster.
  This can be useful for debugging or inspecting the progress of your workflows.

You may also be interested in Dask's own 
["Why Dask?"](https://docs.dask.org/en/latest/why.html) page.

If you are unsure whether you should use Dask or the traditional workflow,
please get in touch with a research computing facilitator by emailing 
[chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu) to set up a consultation.


## How do I use Dask at CHTC?

Dask integration with the CHTC pool is provided by the
[Dask-CHTC](https://dask-chtc.readthedocs.io/) package.
See that package's [documentation](https://dask-chtc.readthedocs.io/) 
for details on how to get started.
