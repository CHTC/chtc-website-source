---
highlighter: none
layout: guide
title: HTC Modules Transition to EL9
guide:
    category: Software
    tag:
        - htc
---

**This announcement concerns users of the HTC system who rely on modules for their software needs.**

As part of our operating system transition, we are deprecating modules that are compiled for EL7 and EL8 operating systems on **Monday November 18**. See the below table for affected modules and their corresponding solutions.

## Affected modules 

| Module name | Old version (EL7/EL8) | Solution |
| :--- | :--- | :--- |
| abaqus | 6.14.4, 2018-hotfix-1904 | Use abaqus/2024 module |
| ansys | 2019r2, 2021r1, 17.2 | Use ansys/2024r1 module |
| cmake | 3.16.5 | [Use containers](software-overview-htc.html#build-your-own-container) |
| comsol | 5.4, 5.5, 5.6, 6.0, 6.1, 6.2 | *Installation in progress* |
| gcc | 8.3.0 | [Use containers](software-overview-htc.html#build-your-own-container) |
| gurobi | 9.5.1 | [Use containers](software-overview-htc.html#build-your-own-container) ([recipe](https://github.com/CHTC/recipes/tree/main/software/Gurobi)) |
| lumerical | 2019b-R6, 2021-r2.4 | *Installation in progress* |
| openmpi | 3.1.4-GCC-8.3.0 | [Use containers](software-overview-htc.html#build-your-own-container) |

## Unaffected modules

| Module name | Version |
| :--- | :--- |
| abaqus | 2024 |
| ansys | 2024r1 |
| comsol | 6.0-physics |
| cst | ece-2022 |
| wims | wims_11b_ru0, wimsbuilder3b_ru0 |

## More information and next steps

Users can also view the list of modules using the `module avail` command.

Modules to be deprecated are listed under `/software/chtc/modules`.

Unaffected modules are listed under `/software/chtc/manual/el9/modules`.

```
[user@ap2002 ~]$ module avail
-------------------------------------- /software/chtc/modules ---------------------------------------
ABAQUS/6.14.4            ANSYS/2021r1  COMSOL/5.6  GCC/8.3.0            OpenMPI/3.1.4-GCC-8.3.0
ABAQUS/2018-hotfix-1904  CMake/3.16.5  COMSOL/6.0  GUROBI/9.5.1
ANSYS/17.2               COMSOL/5.4    COMSOL/6.1  Lumerical/2019b-R6
ANSYS/2019r2             COMSOL/5.5    COMSOL/6.2  Lumerical/2021-r2.4

--------------------------------- /software/chtc/manual/el9/modules ---------------------------------
abaqus/2024   comsol/6.0-physics  wims/wims_11b_ru0
ansys/2024r1  cst/ece-2022        wims/wimsbuilder3b_ru0
```
{:.term}

If your computations rely on an affected module, please switch to an unaffected module or container solution, or contact us ([chtc@cs.wisc.edu](mailto:chtc@cs.wisc.edu)) for assistance in planning your software transition.