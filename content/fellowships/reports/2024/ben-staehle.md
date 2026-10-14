---
layout: character_optimized
---

# Tracking Server Inventory and Elevation

#### Fellow: Ben Staehle
#### Mentor: Joe Bartkowiak
#### Timeline: 6-3-2024 to 8-30-2024

## Background  
A central goal of the Center for High Throughput Computing (CHTC) is to provide tools for accelerating scientific research by developing the HTCondor Software Suite for scheduling High Throughput Computing (HTC) workloads. Additionally, the CHTC also provides computing resources to UW-Madison researchers through an instance of HTCondor deployed by the CHTC Infrastructure Services Team on local computing hardware. Furthermore, these HTC resources are contributed to researchers across the US via the OSPool. Keeping accurate inventory records is an important component of maintaining our computing resources, and presents the non-trivial task of accounting for several hundred servers across five local data centers. The Tracking Server Inventory and Elevation project provides a system designed to simplify inventory management while helping to encourage data completeness and accuracy.

## Project Description  
Overall, our project’s scope included three main goals. To provide a more trustworthy source of inventory data, to create a system that better integrated with existing system administrator workflows, and to encourage data accuracy by design. We sought to accomplish these goals in three main ways. Firstly, to move existing inventory data from its current home in a centralized spreadsheet to a Git repository containing a collection of YAML files, each representing one asset. This provided formal version control and history for inventory data. Included is also a tool to assist with managing inventory data and adhering to the YAML schema adopted by our project. Our second objective was to develop a system that detects integrity issues within the data and reports them to system administrators. Lastly, the project sought to provide external integrations that allow YAML asset data to be consumed in a user-friendly way. To work towards this goal, we developed an integration with Google Sheets that allows inventory data to be published automatically in a read-only spreadsheet.  
One main challenge of this project was iterating design goals and overall objectives along the way, while also sticking to a timeline that allowed us to accomplish a viable final product by the end of the fellowship. This project also served as my first significant project in Python, which presented challenges with regards to learning a new programming language in conjunction with developing the project itself.  
Our vision for this project originally consisted of a suite of Python, Ruby, and Bash scripts with the main goals of performing the initial import of inventory data, as well as a wider range of integrations, including a Puppet module, Google Sheets scripts, and a planned integration with CHTCs monitoring system \- Icinga. Naturally, as the project progressed our vision changed in favor of developing a more solid and complete system, including scripts for managing and editing data, data integrity checking, and a GitHub action to provide automation, rather than embark upon the range of planned external integrations.

## Project Deliverables  
This project delivers a suite of tools to manage, store, and access inventory data. The first of these deliverables is a Python script designed to extract inventory data from the existing spreadsheet and transfer it to a collection of YAML files. This script was designed with the intention of doing only one initial import, but could be used in the future for transferring data from a spreadsheet if necessary. Second, the project provides a script for performing integrity checks on inventory data. As it stands, the script checks for data that is either missing, or conflicts with other assets. In addition, the design allows more checks to be implemented in the future. Finally, the project implements an integration with Google Sheets to publish an automatically generated spreadsheet from the inventory data repository. The spreadsheet is updated automatically whenever data is added, removed, or modified, in a way that preserves its built-in history feature. Such a spreadsheet allows more user-friendly and convenient access to data, and makes inventory accessible to people who may prefer working in a graphical environment. For maintaining data the system provides tools that, when used to perform common asset actions, will adhere to the project’s schema and perform some automatic actions such as generating Git commit messages.

## Project Outcome  
As a result of this project, we have developed and implemented a schema for storing inventory data in YAML format. Implementation was accomplished by exporting data from its original spreadsheet into YAML files, and developing a set of tools that adhere to the employed schema automatically in order to reduce overhead in adopting and using the system. The project also focused on identifying integrity issues within the data, and providing a system to alert users that issues exist automatically, as underlying inventory data changes. A third outcome takes the form of a read-only spreadsheet, which is automatically updated as repository data changes. This allows us to keep a user-friendly, graphical representation of the data, ensure it is synchronized with the main repository, and avoid the need to perform integrity checks on a spreadsheet directly. Finally, this project aims to be expandable, allowing for adaptation and expansion as needs change.

## Lessons Learned  
In the process of developing and implementing this project, I have been fortunate enough to gain experiences and knowledge that I am confident will prove invaluable in my future career. First of all is effective time management and planning. Throughout the fellowship, our project underwent various detours from the original plan. These deviations proved worthwhile for the project, and also provided me with experience with readjusting goals on the fly while not losing sight of the intended final product. Over the course of the summer, I also gained experience with writing production quality code intended to be adopted by the Infrastructure Services Team. I believe this is a particularly valuable experience for someone who has mainly been exposed to college computer science courses, where code you produce is not typically tested in a production environment and does not command production quality. Finally, among the many other learning experiences I had during the fellowship, I was able to gain experience with new technical skills such as data design, Python, and GitHub actions as well as practice existing ones such as Git and designing command line interfaces.

## Project Resources and Materials  

Final Project Presentation \-  
[https://docs.google.com/presentation/d/1P0OGooOSbHuHIjPt6-YpCCO2kS20-fhW-OU6Oh7f4lY/edit?usp=drive\_link](https://docs.google.com/presentation/d/1P0OGooOSbHuHIjPt6-YpCCO2kS20-fhW-OU6Oh7f4lY/edit?usp=drive_link)   
Project Repository \-   
[https://github.com/benito2268/chtc\_inventory](https://github.com/benito2268/chtc_inventory)   
Python 3.9 \-   
[https://docs.python.org/release/3.9.19/](https://docs.python.org/release/3.9.19/)  
PYYaml \-   
[https://pyyaml.org/](https://pyyaml.org/)  
GitPython \-   
[https://github.com/gitpython-developers/GitPython](https://github.com/gitpython-developers/GitPython)   
YAML Specification \-   
[https://yaml.org/spec/1.2.2/](https://yaml.org/spec/1.2.2/)  
Google Sheets API \-   
[https://developers.google.com/sheets/api/guides/concepts](https://developers.google.com/sheets/api/guides/concepts)  
GitHub Actions \-   
[https://docs.github.com/en/actions](https://docs.github.com/en/actions)  
	

