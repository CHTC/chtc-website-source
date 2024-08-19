---
highlighter: none
layout: guide
title: Profiling with Tensorboard
published: false
---

# Overview
This guide will walk you through using tensorboard to profile the gpu, and cpu usage of your machine learning model written in pytorch or tensorflow and run on HTConder. Furthermore, this guide will show you how to use ssh tunneling to view the results off chtc from your local machine.

## 1: Modify code
pytorch sourced from pytorch website
```
with torch.profiler.profile(
    activities=[
        torch.profiler.ProfilerActivity.CPU,
        torch.profiler.ProfilerActivity.CUDA,
    ]
) as p:
    code_to_profile()

# Non-default profiler schedule allows user to turn profiler on and off
# on different iterations of the training loop;
# trace_handler is called every time a new trace becomes available
def trace_handler(prof):
    print(prof.key_averages().table(
        sort_by="self_cuda_time_total", row_limit=-1))
    # prof.export_chrome_trace("/tmp/test_trace_" + str(prof.step_num) + ".json")

with torch.profiler.profile(
    activities=[
        torch.profiler.ProfilerActivity.CPU,
        torch.profiler.ProfilerActivity.CUDA,
    ],

    # In this example with wait=1, warmup=1, active=2,
    # profiler will skip the first step/iteration,
    # start warming up on the second, record
    # the third and the forth iterations,
    # after which the trace will become available
    # and on_trace_ready (when set) is called;
    # the cycle repeats starting with the next step

    schedule=torch.profiler.schedule(
        wait=1,
        warmup=1,
        active=2),
    on_trace_ready=trace_handler
    # on_trace_ready=torch.profiler.tensorboard_trace_handler('./log')
    # used when outputting for tensorboard
    ) as p:
        for iter in range(N):
            code_iteration_to_profile(iter)
            # send a signal to the profiler that the next iteration has started
            p.step()
```
Note: sourced fromt he pytorch website https://pytorch.org/tutorials/intermediate/tensorboard_profiler_tutorial.html

## 2: Ensure the following Python Packages and correct versions are specified in your environment.yml file
```
name: pytorch-gpu
channels:
    - defaults
dependencies:
    - nvida::cudatoolkit=11.1
    - numpy=1.20
    - python=3.9
    - pytorch::pytorch=1.9
    - pytorch::torchvision=0.10
```
Tensorboard profiling is supported from Pytorch 1.8 onward.

## 3: Install Python Packages to Submit Node
Install following: tensorboard, tensorflow, torch_tb_profiler

## 4: Install Python Packages Locally
Install following: tensorboard, tensor flow, torch_tb_profiler

## 5: Summit your job to CHTC

## 6: Connect to CHTC with SSH Tunneling

ssh -4 -N -f -L 16006:127.0.0.1:6006 user@submit1.chtc.wisc.edu
                       -4: ssh uses ipv4 addresses only
                       -N: Do not execute remote commands
                       -f: opens ssh in background
                       -L: Bonds port for forwarding
## 7: Run Tensorboard on CHTC and view results locally
*ssh to submit node

Run `tensorboard —logdir=log` on the commandline.

Back on your desktop open a web browser window and connect to https://localhost:6006 .

You should see a dashboard similar to this:

NOTE: If for some reason you are unable to tunnel into CHTC, you can still use tensorboard by copying the log directory using scp to your local machine and execute step #7 locally.

One particular question I have for the meeting tomorrow is what specific ports should be used for ssh tunneling.

**If having difficulties with tunneling just scp the directory and run tensorboard locally
