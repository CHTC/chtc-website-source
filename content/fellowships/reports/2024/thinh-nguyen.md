---
layout: character_optimized
---

# Machine Learning for OSPool Failure Classification

#### Fellow: Thinh Nguyen
#### Mentor(s): Justin Hiemstra
#### Fellowship Dates: June 3rd - August 23, 2024

# Background

The OSPool is an ever-changing network of computing resources that supports researchers in scientific discovery. Given the large number of daily computing jobs, errors are only inevitable. To reduce the cost of debugging from the end-users or research facilitators, we set out to develop a machine-learning model that helps with making inferences in the case of job failures. In general, users of OSPool need to focus on their research projects to create and discover knowledge rather than debugging their computing jobs. This is the core philosophy of CHTC.

# Project Description

## Project Scope

This project aims to build a model that can infer whether a held job if released, will succeed or end up on hold again. This leverages the power of machine learning to help facilitators and end-users make an inference when debugging their jobs. When a job goes on hold for various reasons, it is the discretion of the user to decide whether to release the job for another execution attempt or to remove it. A wrong choice such as releasing it when it is certain to fail leads to wasted time, especially for large workflows. The dual, however, may be worse – the user removed the job thinking it was the job’s fault – but it was a transient problem in the OSPool, and their time spent searching for errors in their code is in limbo. In essence, it is about giving users more information to help them make their own decisions; as often when they encounter black box errors, there is no one to turn to other than the Research Computing Facilitators, which means they’re often busy.

## Project Challenge

The challenge when creating any model lies in determining the relevant data and how to preprocess it such that the model of our choosing can learn what it needs to make accurate inferences. This means a great obstacle was learning about the lifetime of a job’s life cycle and how that information is represented via job logs. The textual information had to be translated into a scheme that could be ingested by a numerical model – a long short-term memory (LSTM) neural network. The training portion took some time as we had to figure out a distributed workflow that utilizes the network of computers that CHTC provides. Once there is a model, how do we evaluate it and validate that it is well-performing? This involves human interpretation of the entire pipeline in regards to the data that is fed and that it is learning non-trivial patterns.

## Project Vision

Once a model is built, our vision is to have an interface for the facilitators and end-users to seamlessly query the model. A simple use case would be when a user has a failed job with a unique job identifier, the user makes a query to the model given the ID, and the model returns whether the user should release the job or remove it.

# Project Deliverables

The main components in the pipeline are data gathering, data preprocessing, model training, and model evaluation.

In the data-gathering phase, we created a script that stores event logs from all jobs submitted on the access point the script is running on. In the data preprocessing pipeline, it takes in raw job logs that the Condor records and parses them into our designed tensor format, ready to be passed through a model during the training phase.

The model training is in a distributed environment that utilizes multiple compute nodes to train and evaluate the model performance. The software involved are DAGMan, Weight & Biases, and PyTorch.

* DAGMan is a distributive workflow manager that enables the construction of direct acyclic graphs (DAGS), representing tasks and their dependencies.
* Weight & Biases is a model tracking cloud service. In our case, it was also used for hyperparameter tuning. An important feature of W\&B is the visualization in which researchers can see how the model evolves and changes throughout its lifecycle.
* PyTorch was the framework for creating the model and training it on GPUs on CHTC.

A link to the project repository can be found at the end of this report, which contains all the deliverables with documentation of the machine learning pipeline.

# Project Outcome

The current pipeline produces a model with near-perfect accuracy; however, further verification of results is needed.

The pipeline is designed as a DAG workflow with modular components for working with different tensors and model architectures. Additionally, with *Weight & Biases* integration, the model is tracked through time for visualization and hyperparameter tuning which is important in the process of developing models. This approach also creates parallel ML experiments, and as such, we can train dozens or hundreds of models concurrently and fetch the best-performing model out of the batch. This general workflow sets an example of how distributed machine learning can be done on the OSPool for AI researchers and developers.

# Lessons Learned

Throughout the fellowship, I frequently presented our work to diverse audiences, which sharpened my ability to translate complex technical concepts into accessible ideas. These presentations not only helped clarify our work but also sparked new approaches to problem-solving. Over time, I found myself enjoying not just the technical challenges but also the opportunity to communicate our project's impact and share the knowledge I had gained.

Our fellowship consisted of eight members, each working on distinct projects, yet all connected by a shared purpose. We were closely gathered in a corner of the Morgridge Institute, where the dual configuration of our cubicles encouraged constant interaction. The lively chatter, the exchange of ideas, and the rhythmic tapping of keyboards became the soundtrack of our daily work. This environment taught me the importance of community in driving motivation and collaboration. Being part of something bigger than myself fueled my work ethic and reinforced the belief that our collective efforts have the power to change the world.

# Project Material Links and Descriptions

[GitHub repository \- Machine Learning for OSPool Failure Classification](https://github.com/super10099/Machine-Learning-for-OSPool-Failure-Classification)