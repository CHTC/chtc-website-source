---
layout: character_optimized
---

# Enhancing The OSG Container Image Build System

#### Fellow: Pratham Patel
#### Mentor: Brian Lin
#### Timeline: 06/03/2024 - 08/23/2024

## Overview

The OSG relies heavily on a container build system to automate and manage the creation and deployment of container images. However, the current setup, primarily based on GitHub Actions, has significant limitations in terms of flexibility. This limitation stems from the monolithic design of the existing workflow, which does not allow for custom configurations or integration with external repositories, and lacks support for ARM architectures. As the demand from image developers for more tailored and dynamic builds increased, it became evident that the existing system required significant enhancements to meet these needs.

The goal of this project was to enhance the OSG container build system through a three-phase approach. This approach aimed to introduce a configurable mechanism for custom build instructions, integrate the system with external repositories such as Pelican, and ensure capability to build images on ARM-based systems. However, due to the complexities and challenges encountered, only the initial phase was completed during the fellowship period.

## Project Design

In the first phase, we planned to introduce a per-image configuration within the OSG images repository. This mechanism would allow for custom build instructions to be defined for each image through a configuration file. In cases where no custom configuration was provided, the system would revert to default instructions, allowing for both flexibility in customization.

The project envisioned a comprehensive transformation of the OSG container build system, one that would not only support custom configurations but also integrate seamlessly with external repositories, such as the Pelican repository which can be found linked below this report. This integration would involve creating a trigger mechanism within the OSG images repository that would automatically kick off updates between the OSG and Pelican repositories. Additionally, the project aimed to ensure compatibility with ARM architectures, enabling the build system to support a broader range of platforms.

## Results

I was able to successfully complete Phase 1 of the project, resulting in the implementation of a configurable build mechanism that allowed for customized instructions within the OSG images repository. This new system expanded the workflow to incorporate per-image parameters . Each image directory contains a configuration file with parameters specific to that image's build process. If this file is not present, the workflow falls back to a default configuration file located in the entire images directory, ensuring that images without a per-image configuration file can still be built. To support this, I wrote a Python script to process all images and read their configuration files. This script generates a JSON string that includes the image name and all the variations the image can be built for, based on parameters such as base operating system, OSG Software series, and repository type. The JSON output is then passed to the workflow, where it is used to create a dynamic matrix for building each image configuration.

The goal was successfully met and I implemented dynamic matrices within the GitHub Actions workflow to efficiently build container images. The existing workflow was monolithic and built the same combinations of operating system, software repository, and software repository version for each image, which could result in up to 18 different builds per image. This often led to the creation of redundant images, as many of the images needed to hardcode the operating system or OSG Software series. The challenge with dynamic matrices arose because GitHub Actions has limitations in handling complex, nested JSON structures within matrix configurations. However, these restrictions in GitHub Actions made it difficult to implement this feature as initially intended. As a result, the project timeline was impacted, and the dynamic matrix with nested JSON could not be fully realized, ultimately preventing the completion of the later phases.

## Conclusions

This project highlighted several key lessons, particularly the importance of understanding the limitations of the tools used in a project. Recognizing these constraints early on is crucial for setting realistic goals and timelines. The experience also underscored the benefits of modularization in complex systems like container image builds, as it greatly aids in maintainability and scalability. Furthermore, the importance of comprehensive and clear documentation was evident, as it ensures that the system is easily understandable and usable by other team members or future developers.

Throughout the project, I learned a great deal about effective collaboration using Git and GitHub. One of the key challenges was managing the complexities of version control, especially when dealing with multiple contributors and branches. I gained valuable experience in making clean, well-documented commits and managing pull requests. This included learning how to efficiently review and merge changes, as well as resolving conflicts that arose during the process. Additionally, I encountered various challenges with git rebase, which required countless late night hours to ensure that the history remained clean and the integration of changes was smooth. I also learned the importance of clear and consistent communication in making collaborative decisions, such as when to rebase and how to handle pull requests.

By working through these challenges, I improved my ability to manage a collaborative codebase and contribute effectively to the project. These experiences have given me a deeper understanding of the importance of version control in a development workflow and enhanced my skills in using Git and GitHub for collaborative software development.

The GitHub repository for the OSG images, including the configuration files implemented during Phase 1, is available for review along with my personal GitHub profile via the repositories linked below:

OSG Images: https://github.com/PPathu/osg-images

Personal Github Profile: [https://github.com/PPathu](https://github.com/PPathu)

Pelican repository: https://github.com/PelicanPlatform/pelican

