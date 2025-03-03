---
layout: character_optimized
---

# Integrating Pelican with Pytorch

#### Fellow: Kristina Zhao
#### Mentor(s): Emma Turetsky, Ian Ross
#### Timeline: 2024/06/03 - 2024/08/23

# **Background**

The Open Science Data Federation (OSDF) is an essential service developed by the Open Science Grid (OSG) to facilitate the sharing of large-scale datasets across distributed high-throughput computing (dHTC) environments, such as the Open Science Pool (OSPool). OSDF allows users and institutions to stage files in autonomous “origins” for efficient access via a global namespace and network of caches. This architecture significantly reduces wide-area network consumption, load on data origins, and latency of data access.

Pelican, a software platform developed within this framework, enhances the ability to distribute and utilize data across the nation’s computing infrastructure. It works in tandem with HTCondor, a high-throughput computing system that manages large volumes of computational tasks, to streamline data engineering processes.

In the context of machine learning, where efficient data management is critical for scaling training tasks from small, tutorial-scale problems to cutting-edge research, integrating Pelican with PyTorch provides a powerful solution. This project aims to better integrate Pelican into the PyTorch community by developing technical mechanisms and comprehensive documentation, including tutorials for scaling PyTorch-based training using a combination of HTCondor and Pelican. Through this integration, we hope to simplify and enhance the process of managing and processing large datasets in distributed computing environments.

# **Project Description**

The project aimed to integrate Pelican, a platform for efficient distributed data management, with PyTorch, a leading machine learning framework, to optimize the handling and processing of large datasets in high-throughput computing environments managed by HTCondor. The integration sought to enhance the accessibility and scalability of machine learning workflows, ensuring that data could be efficiently accessed and processed from distributed origins, thereby reducing latency and improving overall computational throughput.

## **Project Scope**

The scope of the project involved developing and testing the integration of Pelican with PyTorch, focusing on the following key areas:

1. **Data Integration:** Establishing a seamless connection between Pelican’s distributed data management system and PyTorch’s data ingestion processes to streamline access to large-scale datasets in machine learning jobs.
2. **Workflow Optimization:** Embedding these processes within HTCondor’s managed workflow to optimize computational tasks across distributed environments.
3. **Benchmark and Testing**: Benchmark model performance using varied datasets and record metrics. Analyze system performance under different conditions.
4. **Documentation and Tutorials:** Creating comprehensive guides and tutorials to encourage the widespread adoption of Pelican within the research and PyTorch community.

## **Project Challenge**

The integration poses distinct challenges. One of the main challenges was achieving seamless integration between Pelican’s data management capabilities and PyTorch’s data processing requirements without compromising performance or scalability. Ensuring efficient data transfer and reducing latency across a distributed network posed technical difficulties, particularly in balancing the load between various systems.

An additional challenge was integrating multiple complex systems—PyTorch, Pelican, and HTCondor—into a cohesive workflow that could efficiently handle large-scale machine learning tasks. This required overcoming technical difficulties in establishing seamless communication between these systems.  
Compounding these issues was the fact that Pelican is a newly developed system, under development for less than a year. This introduced potential stability concerns and increased the likelihood of encountering problems during use. The documentation and materials for Pelican were also incomplete, which heightened the learning curve for fellows and made it more difficult to effectively utilize the system.

Finally, developing accessible, thorough documentation and tutorials to facilitate widespread adoption within the PyTorch community required a deep understanding of both frameworks and their application in large-scale research endeavors. It took significant effort to distill complex processes into clear, actionable steps.

Balancing these needs within the limited timeframe of the fellowship added to the project’s complexity, necessitating focused prioritization and iterative problem-solving.

## **Project Vision**

The long-term vision of this project is to develop a streamlined and extensible framework that seamlessly integrates advanced machine learning workflows with distributed data management systems like Pelican, particularly within high-throughput computing environments managed by HTCondor. By enhancing efficiency, the framework aims to reduce both time and resource consumption, enabling research teams to complete projects more rapidly and with less computational overhead. This efficiency ultimately drives more impactful results, delivered in a shorter time frame.

Moreover, the project aspires to make a significant contribution to the broader scientific community by creating a reusable and adaptable integrated model that can be applied to various data management and computing environments. Through the provision of a robust framework that simplifies data distribution and management, Pelican fosters wider adoption of PyTorch across diverse research projects, encouraging the exploration of innovative ideas and methodologies. This capability empowers researchers to tackle more complex and resource-intensive challenges in machine learning, pushing the boundaries of what can be achieved in the field.

# **Project Deliverables**

**Integrated System**: Successfully integrated PyTorch with Pelican, enabling seamless data access and processing within distributed computing environments.

**Enhanced Pelican File System:** During the implementation, several issues were identified and resolved. For example, in the process of benchmarking Pelican’s performance, we improved data handling capabilities by solving a bug within the recursive download function of Pelican, including a 90% increase in download speed.

**Comprehensive Documentation**: Developed detailed documentation and tutorials to guide researchers in utilizing the integrated system effectively.

**Benchmarking Notebooks**: Wrote Jupyter Notebooks that not only showcase the results but also allow users to run and experiment with them.

**Benchmarking Results:** Conducted extensive benchmarking to evaluate the performance of the integrated system.

# **Project Outcome**

The project successfully achieved its primary objectives, resulting in a robust integration between PyTorch and Pelican. This integration not only validates the performance and feasibility of using Pelican in machine learning tasks but also provides a valuable resource for AI researchers.

The benchmarking tests demonstrated the system’s capability to handle large-scale datasets effectively, confirming the viability of this integration for future research projects. The detailed documentation and tutorials produced as part of this project will begin to support other researchers in leveraging this improved infrastructure, laying a strong foundation for continued advancements in high-throughput computing.

# **Lessons Learned**

This project has been an invaluable learning experience, both technically and professionally. When I started this internship, I had no prior knowledge of Pelican, HTCondor, or distributed high-throughput computing. Through this project, I developed a deep understanding of these technologies and became more proficient in PyTorch and its related tools, significantly enhancing my technical skills.

Working in a research-oriented environment revealed that advancing work can be more challenging than anticipated. Unexpected issues in various systems, often beyond my control, sometimes caused progress to stagnate. However, these challenges taught me the importance of adaptability, persistence, and problem-solving in a professional setting.

Discussions with Miron, Frank, and Mats provided me with valuable insights into career planning, the differences between academia and industry, and strategies for personal development. These interactions broadened my understanding of the professional landscape and helped refine my career goals. Additionally, the learning sessions conducted by staff offered deeper insights into popular technology stacks, further enhancing my knowledge.

Moreover, I learned the importance of effective communication and collaboration, which are critical in a research environment. Participating in the HTC24 conference further developed my social and presentation skills and allowed me to learn about the latest developments in the field and the experiences of other researchers. This project not only expanded my technical expertise but also deepened my appreciation for the complexities and nuances of conducting research in a collaborative, academic-like environment.

# **Project Material Links and Descriptions**


1\. GitHub Repository: [Pelican PyTorch Tutorial](https://github.com/PelicanPlatform/PelicanPytorchTutorial)

This repository contains all the source code, scripts, and files developed during the project. It includes the benchmarking scripts for Pelican and PyTorch, tools, and setup instructions.  It also includes a comprehensive guide detailing the integration process, including step-by-step tutorials for setting up and using Pelican with PyTorch and HTCondor. It covers everything from basic setup, and links more detailed documentation for reference.

2\. HTC24 Conference Presentation: [https://agenda.hep.wisc.edu/event/2175/sessions/3200/\#20240709](https://agenda.hep.wisc.edu/event/2175/sessions/3200/#20240709)

Presentation and recordings from the HTC24 conference. 