---
highlighter: none
layout: markdown-page
title: Automating CHTC Log In
---

Something about two factor

## SSH Keys


## Connections

```
Host *
    ControlMaster auto
    ControlPersist 20m
    ControlPath ~/.ssh/connections/%r@%h:%p
```
