---
highlighter: none
layout: markdown-page
title: About CHTC Resources
---


As you saw from the [About Our Approach](approach) document, the
CHTC\'s resources are distributed across campus in several *pools*. A
sample of resources (slots) available on a typical day in February of
2012 is shown in this table:


{:.gtable}
  | Platform | GLOW | CHTC | CS | CAE | Total |
  | -------------- | -------- | ------- | ----- | ------- | -------- |
  | 32-bit Linux | 331 | 0 | 199 | 0 | 530 |
  | 64-bit Linux | 10,168 | 1,976 | 904 | 392 | 13,440 |
  | Windows 7 | 0 | 18 | 0 | 1,206 | 1,224 |


**Of nodes, CPUS and slots**

In the 1990s things were so simple. A node was the same as a CPU, and on
one of those CPUs HTCondor would run one job. When hyper-threaded and
multi-core CPUs came on the scene, things got a little more complicated.
In order to complicate things more (because that\'s what we do at
research universities, right?), we decided to coin a new term, the
*slot*. The one thing that is simple is that 1 job runs on 1 slot. What
is more complicated is understanding what a slot is, because it turns
out that the answer is \"it depends.\"

Let\'s say that we have a 16 core, 64 Gbyte RAM machine. If we did it
the old way, we could run 1 job on this machine. With a slot, we can
make an arbitrary assignment of machine resources. For example, we could
say that 1 slot is 1 CPU with 4 Gbyte RAM. Then we could \'provision\'
16 slots on that machine and run 16 jobs simultaneously. We could
instead provision 8 such slots and create a 9^th^ slot that used the
remainder of the machine, which would be 8 cores with 32 Gbyte RAM. So,
the slot concept gives us more flexibility in dividing physical machine
resources into logical machine resources.

**How many slots are available in the CHTC, and with how much RAM?**

Because of the way we can configure slots with arbitrary amounts of
available memory, this is a bit of a tricky question. We try to maximize
the number of available slots given \_most\_ jobs\' needs. We can
adjust, so if you have needs beyond what is currently offered, please
get in touch with us. Speaking of adjustments, we are working on an
automated way to configure machine resources to match current job needs.
We use a technique that we call *dynamic slots*. Hopefully in the near
future, you will not have to ask this question, because we will just
make enough properly configured slots to meet the needs of your jobs.

**How are priorities determined?**

We use a concept called *fair share*. This means that your priority
decreases as you use more resources over time in order to let newer,
less frequent users access the resources too. We can override the
automatic priority scheme if you need high priority in order to meet a
paper or other deadline.

**How long are jobs allowed to run?**

Maybe forever, as long as a higher priority user does not need the same
resources you have claimed. When there is competition for resources, we
guarantee that your jobs will run for at least 24 hours. If you need
longer run times, the best approach is to make sure that your jobs can
produce a *checkpoint*. In a checkpoint, a job records its progress, and
when that job restarts, it can utilize a checkpoint to pick up where it
left off and continue. We can help you understand how you might
implement making and using checkpoints, if you feel this is something
you need.

**How much local disc space is available for jobs?**

15 GBytes per slot is the average.

**How fast is the network that connects all these nodes?**

Due to the distributed nature of our resources, and the fact that they
fall under different administrative domains all over campus, this is a
trickier question to answer than you probably hoped. Most compute nodes
have 1 Gbit per second network interfaces. We generally have 10 Gbit per
second interfaces between pools.

**When do you expand these resources?**

We monitor the use of all our campus pools, as well as the OSG, to see
if we are delivering all the cycles that UW researchers need. When total
demand exceeds total supply, we will add resources. We also add
resources when researchers have additional requirements that cannot be
met with our current resources.
