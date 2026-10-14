/**
 * The publication list: the legacy research page's HTML, kept here as JSX
 * so the page is self-contained. Section anchors are the `<span id>`s, which
 * the page's topic navigation links to.
 */
export default function Publications() {
  return (
    <div>
      <span id="overview"></span>
      <h3>Overview</h3>
      <ul>
      <li>
      Douglas Thain, Todd Tannenbaum, and Miron Livny,
      &quot;Distributed Computing in Practice: The Condor Experience&quot;
      <em>Concurrency and Computation: Practice and Experience</em>,
      Vol. 17, No. 2-4, pages 323-356, February-April, 2005.
      <a href="/doc/condor-practice.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#condor-practice">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Douglas Thain and Miron Livny,
      &quot;Building Reliable Clients and Servers&quot;,
      in Ian Foster and Carl Kesselman, editors,
      <em>The Grid: Blueprint for a New Computing Infrastructure</em>,
      Morgan Kaufmann, 2003, 2nd edition. ISBN: 1-55860-933-4.
      <a href="/doc/grid2-ch19.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#grid2-ch19">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Douglas Thain, Todd Tannenbaum, and Miron Livny,
      &quot;Condor and the Grid&quot;,
      in Fran Berman, Anthony J.G. Hey, Geoffrey Fox, editors,
      <em>Grid Computing: Making The Global Infrastructure a Reality</em>,
      John Wiley, 2003.
      ISBN: 0-470-85319-0
      <a href="http://media.wiley.com/product_data/excerpt/90/04708531/0470853190.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#grid%20chapter%201">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Todd Tannenbaum, Derek Wright, Karen Miller, and Miron Livny,
      &quot;Condor - A Distributed Job Scheduler&quot;,
      in Thomas Sterling, editor,
      <em>Beowulf Cluster Computing with Linux</em>,
      The MIT Press, 2002.
      ISBN: 0-262-69274-0
      <a href="/doc/beowulf-chapter-rev1.ps">[Postscript]</a>
      <a href="/doc/beowulf-chapter-rev1.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#beowulfbook-condor">[BibTeX Source for Citation]</a>
      <a href="https://mitpress.mit.edu/">[MIT Press&apos; Web Page]</a>
      The MIT Press is pleased to present material from a preliminary draft of
      <em>Beowulf Cluster Computing with Linux</em>.
      This material is Copyright 2002 Massachusetts Institute of Technology, and
      may not be used or distributed for any commercial purpose without the
      express written consent of The MIT Press.  Because
      this material was a draft chapter, neither
      The MIT Press nor the authors can be held liable for changes or
      alternations in the final edition.
      </li>
      <li>
      Jim Basney and Miron Livny,
      &quot;Deploying a High Throughput Computing Cluster&quot;,
      <em>High Performance Cluster Computing</em>,  Rajkumar Buyya, Editor,
      Vol. 1, Chapter 5, Prentice Hall PTR, May 1999.
      <a href="/doc/hpcc-chapter.ps">[Postscript]</a>
      <a href="/doc/hpcc-chapter.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#htc-deployment-chapter">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Miron Livny, Jim Basney, Rajesh Raman, and Todd Tannenbaum,
      &quot;Mechanisms for High Throughput Computing&quot;,
      <em>SPEEDUP Journal</em>, Vol. 11, No. 1, June 1997.
      <a href="/doc/htc_mech.ps">[Postscript]</a>
      <a href="/doc/htc_mech.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#htc-mechanisms">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Jim Basney, Miron Livny, and Todd Tannenbaum,
      &quot;High Throughput Computing with Condor&quot;,
      <em>HPCU news</em>, Volume 1(2), June 1997.
      </li>
      <li>
      D. H. J Epema, Miron Livny, R. van Dantzig, X. Evers, and Jim Pruyne,
      &quot;A Worldwide Flock of Condors : Load Sharing among Workstation Clusters&quot;
      <em>Journal on Future Generations of Computer Systems</em>, Volume 12, 1996
      <a href="/doc/flock.ps">[Postscript]</a>
      <a href="/doc/flock.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#condor-flock">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Scott Fields,
      &quot;Hunting for Wasted Computing Power&quot;,
      1993 Research Sampler, University of Wisconsin-Madison.
      <a href="/doc/WiscIdea.html">[HTML]</a>
      </li>
      <li>
      Michael Litzkow, Miron Livny, and Matt Mutka,
      &quot;Condor - A Hunter of Idle Workstations&quot;,
      <em> Proceedings of the 8th International Conference of Distributed Computing Systems, </em>
      pages 104-111, June, 1988.
      <a href="/doc/icdcs1988.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#condor-hunter">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Michael Litzkow,
      &quot;Remote Unix - Turning Idle Workstations into Cycle Servers&quot;,
      <em>Proceedings of Usenix Summer Conference</em>, pages 381-384, 1987.
      <a href="/doc/remoteunix.ps">[Postscript]</a>
      <a href="/doc/remoteunix.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#litzkow-cycles">[BibTeX Source for Citation]</a>
      </li>
      </ul>
      <span id="match"></span>
      <h3>Matchmaking and ClassAds</h3>
      <ul>
      <li>
      Nicholas Coleman, &quot;Distributed Policy Specification and Interpretation with
      Classified Advertisements&quot;, Practical Aspects of Declarative Languages, Lecture
      Notes in Computer Science Volume 7149, 2012, pp 198-211, January 2012.
      <a href="/doc/distributed_policy_2012.pdf">[PDF]</a>
      </li>
      <li>
      Rajesh Raman, Miron Livny, and Marvin Solomon,
      &quot;Policy Driven Heterogeneous Resource Co-Allocation with Gangmatching&quot;,
      Proceedings of the Twelfth IEEE International Symposium on
      High-Performance Distributed Computing, June, 2003, Seattle, WA
      <a href="/doc/gangmatching-hpdc12.ps">[Postscript]</a>
      <a href="/doc/gangmatching-hpdc12.pdf">[PDF]</a>
      </li>
      <li>
      Nicholas Coleman, Rajesh Raman, Miron Livny and Marvin Solomon,
      &quot;Distributed Policy Management and Comprehension with Classified
      Advertisements&quot;,
      University of Wisconsin-Madison Computer Sciences Technical Report #1481,
      April 2003.
      <a href="/doc/ncoleman_tr1481.ps">[Postscript]</a>
      <a href="/doc/ncoleman_tr1481.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#ncoleman-tr1481">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Nicholas Coleman, &quot;An Implementation of Matchmaking Analysis in Condor&quot;,
      <em>Masters&apos; Project report</em>,University of Wisconsin, Madison, May 2001.
      <a href="/doc/match_analysis.ps">[Postscript]</a>
      <a href="/doc/match_analysis.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#ncoleman-mr">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Rajesh Raman, Miron Livny, and Marvin Solomon,
      &quot;Resource Management through Multilateral Matchmaking&quot;,
      <em>Proceedings of the Ninth  IEEE Symposium on High Performance Distributed Computing (HPDC9)</em>,
      Pittsburgh, Pennsylvania, August 2000, pp 290-291.
      <a href="/doc/gangmatching.ps">[Postscript]</a>
      <a href="/doc/gangmatching.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#raman-hpdc9">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Rajesh Raman, Miron Livny, and Marvin Solomon,
      &quot;Matchmaking: Distributed Resource Management for High Throughput Computing&quot;,
      <em>Proceedings of the Seventh IEEE International Symposium on High Performance Distributed Computing</em>, July 28-31, 1998, Chicago, IL.
      <a href="/doc/hpdc98.ps">[Postscript]</a>
      <a href="/doc/hpdc98.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#raman-hpdc7">[BibTeX Source for Citation]</a>
      </li>
      </ul>
      <span id="workflow"></span>
      <h3>Workflow and DAGMan</h3>
      <ul>
      <li>Peter Couvares, Tevik Kosar, Alain Roy, Jeff Weber and Kent
      Wenger, &quot;Workflow in Condor&quot;, in <em>In Workflows for e-Science</em>, Editors: I.Taylor, E.Deelman, D.Gannon,
      M.Shields, Springer Press, January 2007 (ISBN: 1-84628-519-4)
      <a href="/doc/workflow_condor_2007.pdf">[PDF]</a>
      </li>
      </ul>
      <span id="resource"></span>
      <h3>Resource Management</h3>
      <ul>
      <li>
      Zhe Zhang, Brian Bockelman, Dale Carder, and Todd Tannenbaum,
      &quot;Lark: Bringing Network Awareness to High Throughput Computing&quot;,
      <em>Proceedings of the 15th IEEE/ACM International Symposium on Cluster, Cloud and Grid Computing (CCGrid 2015)</em>, Shenzhen, Guangdong, China, May 2015.
      <a href="/doc/lark-ccgrid2015.pdf">[PDF]</a>
      </li>
      <li>
      Jim Basney and Miron Livny,
      &quot;Managing Network Resources in Condor&quot;,
      <em>Proceedings of the Ninth  IEEE Symposium on High Performance Distributed Computing (HPDC9)</em>,
      Pittsburgh, Pennsylvania, August 2000, pp 298-299.
      <a href="/doc/netman-hpdc9.ps">[Postscript]</a>
      <a href="/doc/netman-hpdc9.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#basney-hpdc9">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Jim Basney and Miron Livny,
      &quot;Improving Goodput by Co-scheduling CPU and Network Capacity&quot;,
      <em>International Journal of High Performance Computing Applications</em>,
      Volume 13(3), Fall 1999.
      <a href="/doc/goodput.ps">[Postscript]</a>
      <a href="/doc/goodput.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#basney-goodput">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Miron Livny and Rajesh Raman,
      &quot;High Throughput Resource Management&quot;,
      chapter 13 in <em>The Grid: Blueprint for a New Computing Infrastructure</em>,
      Morgan Kaufmann, San Francisco, California, 1999.
      <a href="/doc/hpdc-chapter.ps">[Postscript]</a>
      <a href="/doc/hpdc-chapter.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#gridbook-htc">[BibTeX Source for Citation]</a>
      Morgan Kaufmann is pleased to present material from a preliminary draft of
      <em>High Performance Distributed Computing: Building a Computational Grid</em>;
      the material is Copyright 1997 Morgan Kaufmann Publishers.  This
      material may not be used or distributed for any commercial purpose without the
      express written consent of Morgan Kaufmann Publishers.  Please note that
      this material is a draft of forthcoming publication, and as such neither
      Morgan Kaufmann nor the author can be held liable for changes or
      alternations in the final edition.
      </li>
      <li>
      Matt Mutka and Miron Livny,
      &quot;The Available Capacity of a Privately Owned Workstation Environment&quot;,
      <em>Performance Evaluation</em>, vol. 12, no. 4 pp. 269-284, July, 1991.
      <a href="/doc/condor-bibtex.html#mutka-pe">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Matt Mutka and Miron Livny,
      &quot;Profiling Workstations&apos; Available Capacity for Remote Execution&quot;,
      <em>Performance &apos;87</em>,12th IFIP WG 7.3, pp. 529-544, December 1987.
      <a href="/doc/profiling_availability.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#mutka-p87">[BibTeX Source for Citation]</a>
      </li>
      </ul>
      <span id="checkpoint"></span>
      <h3>Checkpointing</h3>
      <ul>
      <li>
      Joe Meehean and Miron Livny,
      &quot;A Service Migration Case Study: Migrating the Condor Schedd&quot;,
      <em>Midwest Instruction and Computing Symposium</em>, April 2005.
      <a href="/doc/schedd-migration-mics.ps">[Postscript]</a>
      <a href="/doc/schedd-migration-mics.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#meehean-mics2005">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Jim Basney, Miron Livny, and Paolo Mazzanti,
      &quot;Utilizing Widely Distributed Computational Resources Efficiently with Execution Domains&quot;,
      <em>Computer Physics Communications</em>, 2001.
      (This is an extended version of the CHEP 2000 paper below.)
      <a href="/doc/cpc.ps">[Postscript]</a>
      <a href="/doc/cpc.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#basney-cpc">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Jim Basney, Miron Livny, and Paolo Mazzanti,
      &quot;Harnessing the Capacity of Computational Grids for High Energy Physics&quot;,
      <em>Proceedings of the International Conference on Computing in High Energy and
      Nuclear Physics (CHEP 2000)</em>,
      February 2000, Padova, Italy.
      <a href="/doc/exec-domains.ps">[Postscript]</a>
      <a href="/doc/exec-domains.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#basney-chep2000">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Michael Litzkow, Todd Tannenbaum, Jim Basney, and Miron Livny,
      &quot;Checkpoint and Migration of UNIX Processes in the Condor Distributed Processing System&quot;,
      University of Wisconsin-Madison Computer Sciences Technical Report #1346,
      April 1997.
      <a href="/doc/ckpt97.ps">[Postscript]</a>
      <a href="/doc/ckpt97.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#litzkow-tr1346">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Jim Pruyne and Miron Livny,
      &quot;Managing Checkpoints for Parallel Programs&quot;,
      Workshop on Job Scheduling Strategies for Parallel Processing IPPS &apos;96.
      <a href="/doc/ckpt_mgmt.ps">[Postscript]</a>
      <a href="/doc/ckpt_mgmt.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#pruyne-ipps96">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Todd Tannenbaum and Michael Litzkow,
      &quot;Checkpointing and Migration of UNIX Processes in the Condor Distributed Processing System&quot;,
      <em>Dr Dobbs Journal</em>, Feb 1995.
      <a href="http://www.ddj.com/184409496;jsessionid=0KNAZGZXTH0RMQSNDLPSKH0CJUNN2JVN?pgno=8">[HTML]</a>
      <a href="/doc/dobbs_95.ps">[Postscript]</a>
      <a href="/doc/condor-bibtex.html#tannenba-dobbs">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Michael Litzkow and Marvin Solomon,
      &quot;Supporting Checkpointing and Process Migration Outside the UNIX Kernel&quot;,
      <em>Usenix Conference Proceedings</em>,
      San Francisco, CA, January 1992, pages 283-290.
      <a href="/doc/usenix_1.92.ps">[Postscript]</a>
      <a href="/doc/usenix_1.92.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#litzkow-usenix">[BibTeX Source for Citation]</a>
      </li>
      </ul>
      <span id="data_intensive"></span>
      <h3>Data Intensive Computing</h3>
      <ul>
      <li>
      Parag Mhashilkar, Zachary Miller, Rajkumar Kettimuthu, Gabriele Garzoglio, Burt
      Holzman, Cathrin Weiss, Xi Duan, and Lukasz Lacinski, &quot;End-To-End Solution for
      Integrated Workload and Data Management using GlideinWMS and Globus Online&quot;,
      <em>Journal of Physics: Conference Series, Volume 396, Issue 3, Year 2012</em>
      <a href="/doc/globus-online-JPhysics-2012.pdf">[PDF]</a>
      </li>
      <li>
      Ian T. Foster, Josh Boverhof, Ann Chervenak, Lisa Childers, Annette DeSchoen,
      Gabriele Garzoglio, Dan Gunter, Burt Holzman, Gopi Kandaswamy, Raj Kettimuthu,
      Jack Kordas, Miron Livny, Stuart Martin, Parag Mhashilkar, Zachary Miller,
      Taghrid Samak, Mei-Hui Su, Steven Tuecke, Vanamala Venkataswamy, Craig Ward,
      Cathrin Weiss,
      &quot;Reliable high-performance data transfer via Globus Online&quot;,
      <em>in Proc. SciDAC 2011, Denver, CO, July 10-14.</em>
      <a href="/doc/globus-online-SciDAC-2011.pdf">[PDF]</a>
      </li>
      <li>
      Ann Chervenak, Ewa Deelman, Miron Livny, Mei-Hui Su, Rob Schuler, Shishir Bharathi, Gaurang Mehta, Karan Vahi,
      &quot;Data Placement for Scientific Applications in Distributed Environments&quot;,
      In <em> Proceedings of the 8th IEEE/ACM International Conference on Grid
      Computing (Grid 2007)</em>, Austin, TX, September 2007.
      <a href="/doc/grid2007.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#chervenak-grid2007">[BibTeX Source for Citation]</a>
      </li>
      <li>
      George Kola, Tevfik Kosar, Jaime Frey, Miron Livny, Robert J. Brunner and Michael Remijan,
      &quot;DISC: A System for Distributed Data Intensive Scientific Computing&quot;,
      In <em> Proceedings of the First Workshop on Real, Large Distributed Systems (WORLDS&apos;04)</em>, San Francisco, CA, December 2004, in conjunction with OSDI&apos;04
      <a href="/doc/disc-worlds2004.ps">[PostScript]</a>
      <a href="/doc/disc-worlds2004.pdf">[PDF]</a>
      </li>
      <li>
      George Kola, Tevfik Kosar and Miron Livny,
      &quot;Profiling Grid Data Transfer Protocols and Servers&quot;,
      In Euro-Par 2004, Pisa, Italy, September 2004.
      <a href="/doc/profiling-europar2004.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#profiling-europar2004">[BibTeX Source for Citation]</a>
      </li>
      <li>
      George Kola, Tevfik Kosar and Miron Livny,
      &quot;A Fully Automated Fault-tolerant System for Distributed Video Processing and Off-site Replication&quot;,
      In <a href = "http://www.nossdav.org/2004/">
      The 14th ACM International Workshop on Network and Operating Systems Support for Digital Audio and Video (NOSSDAV 2004)</a>, Kinsale, Ireland, June 2004.
      <a href="/doc/video_pipeline-nossdav2004.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#kola-nossdav2004">[BibTeX Source for Citation]</a>
      </li>
      <li>
      George Kola, Tevfik Kosar and Miron Livny,
      &quot;Run-time Adaptation of Grid Data-placement Jobs&quot;,
      In <em>Parallel and Distributed Computing Practices</em>, 2004.
      <a href="/doc/runtime_adaptation-pdcp2004.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#runtime-pdcp">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Tevfik Kosar and Miron Livny, &quot;Stork: Making Data Placement a First Class Citizen in the Grid&quot;,
      In <em>Proceedings of 24th IEEE Int. Conference on Distributed Computing Systems (ICDCS2004)</em>, Tokyo, Japan, March 2004.
      <a href="/doc/stork-icdcs2004.pdf">[PDF]</a>
      </li>
      <li>
      Tevfik Kosar, George Kola and Miron Livny, &quot;A Framework for Self-optimising, Fault-tolerant, High Performance Bulk Data Transfers in a Heterogeneous Grid Environment&quot;,
      <em>Proceedings of 2nd Int. Symposium on Parallel and Distributed Computing (ISPDC2003)</em>, Ljubljana, Slovenia, October 2003.
      <a href="/doc/bulkdata_framework-ispdc2003.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#kosar-ispdc2003">[BibTeX Source for Citation]</a>
      </li>
      <li>
      George Kola, Tevfik Kosar and Miron Livny,
      &quot;Run-time Adaptation of Grid Data-placement Jobs&quot;,
      <em>Proceedings of Int. Workshop on Adaptive Grid Middleware (AGridM2003)</em>, New Orleans, LA, September 2003.
      <a href="/doc/runtime_adaptation-agridm2003.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#runtime-agridm2003">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Tevfik Kosar, George Kola and Miron Livny,
      &quot;Building Data Pipelines for High Performance Bulk Data Transfers in a Heterogeneous Grid Environment&quot;,
      <em>Technical Report CS-TR-2003-1487, University of Wisconsin-Madison Computer Sciences</em>, August 2003.
      <a href="/doc/building_pipelines-TR1487.pdf">[PDF]</a>
      </li>
      </ul>
      <span id="grid"></span>
      <h3>Grid Computing</h3>
      <ul>
      <li>
      C. Acosta-Silva, A. Delgado Peris, J. Flix, J. Frey, J.M. Hern&aacute;ndez, A. P&eacute;rez-Calero Yzquierdo, and T. Tannenbaum
      &quot;Exploitation of network-segregated CPU resources in CMS&quot;,
      <em>Proceedings of the 25th International Conference on Computing in High Energy and Nuclear Physics (CHEP 2021)</em>, May 2021.
      <a href="/doc/epjconf_chep2021_02020.pdf">[PDF]</a>
      </li>
      <li>
      Brian Bockelman, Miron Livny, Brian Lin, Francesco Prelz
      &quot;Principles, technologies, and time: The translational journey of the HTCondor-CE&quot;,
      <em>Journal of Computational Science</em>, 2020
      <a href="/doc/jocs20-principles.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#jocs20-principles">[BibTeX Source for Citation]</a>
      </li>
      <li>
      B Bockelman, T Cartwright, J Frey, E M Fajardo, B Lin, M Selmeci, T Tannenbaum and M Zvada
      &quot;Commissioning the HTCondor-CE for the Open Science Grid&quot;,
      <em> Journal of Physics: Conference Series</em>, Vol. 664, 2015
      <a href="/doc/jphys15-commissioning.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#jphys15-commissioning">[BibTeX /Source for Citation]</a>
      </li>
      <li>
      I Sfiligoi, D C Bradley, Z Miller, B Holzman, F W&uuml;rthwein, J M Dost, K Bloom,
      and C Grandi, &quot;glideinWMS experience with glexec&quot;,
      <em>Journal of Physics: Conference Series, Volume 396, Issue 3, Year 2012</em>
      <a href="/doc/glideinWMS-JPhysics-2012.pdf">[PDF]</a>
      </li>
      <li>
      W Andrews, B Bockelman, D Bradley, J Dost, D Evans, I Fisk, J Frey, B Holzman, M Livny, T Martin, A McCrea, A Melo, S Metson, H Pi, I Sfiligoi, P Sheldon, T Tannenbaum, A Tiradani, F W&uuml;rthwein and D Weitzel,
      &quot;Early experience on using glideinWMS in the cloud&quot;,
      <em> Journal of Physics: Conference Series</em>, Vol. 331, No. 6, 2011
      <a href="/doc/jphys11-early-exerience.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#jphys11-early-experience">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Igor Sfiligoi, Greg Quinn, Chris Green, Greg Thain,
      &quot;Pilot Job Accounting and Auditing in Open Science Grid&quot;,
      The 9th IEEE/ACM International Conference on Grid Computing,
      Tsukuba, Japan, 2008
      <a href="/doc/grid-08-pilot-accounting.pdf">[PDF]</a>
      </li>
      <li>
      Alexandru Iosup, Dick H.J. Epema, Todd Tannenbaum, Matthew Farrellee, Miron Livny,
      &quot;Inter-Operating Grids through Delegated MatchMaking&quot;,
      in proceedings of the International Conference for High Performance
      Computing, Networking, Storage and Analysis (SC07),
      Reno, Nevada, November 2007.
      <a href="/doc/SC07-Iosup.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#SC07-Iosup">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Sander Klous, Jamie Frey, Se-Chang Son, Douglas Thain, Alain Roy,
      Miron Livny, and Jo van den Brand, &quot;Transparent Access to Grid
      Resources for User Software&quot;, in <em>Concurrency and Computation:
      Practice and Experience</em>, Volume 18, Issue 7, pages 787-801, 2006.
      </li>
      <li>
      Sechang Son, Matthew Farrellee, and Miron Livny,
      &quot;A Generic Proxy Mechanism for Secure Middlebox Traversal&quot;,
      CLUSTER 2005,
      Boston, MA, September 26-30, 2005.
      <a href="/doc/XRAY_paper.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#Sonny-CLUSTER2005">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Bruce Beckles, Sechang Son, and John Kewley,
      &quot;Current methods for negotiating firewalls for the Condor system&quot;,
      Proceedings of the 4th UK e-Science All Hands Meeting 2005,
      Nottingham, UK, September 19-22, 2005.
      <a href="/doc/CondorandFirewalls.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#AHM2005">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Sechang Son, Bill Allcock and Miron Livny,
      &quot;CODO: Firewall Traversal by Cooperative On-Demand Opening&quot;,
      Proceedings of the 14th IEEE Symposium on High Performance Distributed Computing (HPDC14),
      Research Triangle Park, NC, July 24-27, 2005.
      <a href="/doc/CODO-hpdc.pdf">[PDF]</a>
      <a href="/doc/CODO-hpdc.doc">[MS Word]</a>
      <a href="/doc/condor-bibtex.html#CODO-hpdc-2005">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Clovis Chapman, Paul Wilson, Todd Tannenbaum, Matthew Farrellee, Miron Livny, John Brodholt, and Wolfgang Emmerich,
      &quot;Condor services for the global grid: Interoperability between Condor and OGSA&quot;,
      <em>Proceedings of the 2004 UK e-Science All Hands Meeting</em>, ISBN 1-904425-21-6, pages 870-877, Nottingham, UK, August 2004.
      <a href="/doc/condor-ogsa-2004.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#condor-ogsa-2004">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Clovis Chapman, Charaka Goonatilake, Wolfgang Emmerich, Matthew Farrellee, Todd Tannenbaum, Miron Livny, Mark Calleja, and Martin Dove,
      &quot;Condor BirdBath: Web Service interfaces to Condor&quot;,
      <em>Proceedings of the 2005 UK e-Science All Hands Meeting</em>, ISBN 1-904425-53-4, pages 737-744, Nottingham, UK, September 2005.
      <a href="/doc/birdbath.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#birdbath2005">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Sriya Santhanam, Pradheep Elango, Andrea Arpaci-Dusseau, and Miron Livny,
      &quot;Deploying Virtual Machines as Sandboxes for the Grid&quot;,
      WORLDS 2005, San Francisco, CA, December 2004
      <a href="/doc/SandboxingWorlds053.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#santhanam-worlds05">[BibTeX Source for Citation]</a>
      </li>
      <li>
      George Kola, Tevfik Kosar and Miron Livny,
      &quot;Phoenix: Making Data-intensive Grid Applications Fault-tolerant&quot;,
      In <em>Grid 2004</em>, Pittsburgh, PA, November 2004
      <a href="/doc/phoenix-grid2004.ps">[PostScript]</a>
      <a href="/doc/phoenix-grid2004.pdf">[PDF]</a>
      </li>
      <li>
      Andrew Baranovski, Gabriele Garzoglio, Igor Terekhov, Alain Roy and Todd Tannenbaum,
      &quot;Management of Grid Jobs and Data within SAMGrid&quot;,
      <em>Proceedings of the 2004 IEEE International Conference on Cluster Computing</em>,
      pages 353-360,
      San Diego, CA, September 2004.
      <a href="/doc/samgrid-cluster2004.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#samgrid-cluster2004">[BibTeX Source for Citation]</a>
      </li>
      <li>
      George Kola, Tevfik Kosar and Miron Livny,
      &quot;A Client-centric Grid Knowledgebase&quot;,
      <em>Proceedings of the 2004 IEEE International Conference on Cluster Computing</em>,
      pages 431-438,
      San Diego, CA, September 2004.
      <a href="/doc/gridknowledgebase.ps">[PostScript]</a>
      <a href="/doc/gridknowledgebase.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#gridknowledgebase-cluster2004">[BibTeX Source for Citation]</a>
      </li>
      <li>
      George Kola, Tevfik Kosar and Miron Livny,
      &quot;Profiling Grid Data Transfer Protocols and Servers&quot;,
      In Euro-Par 2004, Pisa, Italy, September 2004.
      <a href="/doc/profiling-europar2004.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#profiling-europar2004">[BibTeX Source for Citation]</a>
      </li>
      <li>
      John Bent, Douglas Thain, Andrea Arpaci-Dusseau, Remzi Arpaci-Dusseau, and Miron Livny,
      &quot;Explicit Control in a Batch Aware Distributed File System&quot;,
      <em>Proceedings of the First USENIX/ACM Conference on Networked Systems Design and Implementation</em>,
      San Francisco, CA, March 2004.
      <a href="/doc/badfs-nsdi04.ps">[Postscript]</a>
      <a href="/doc/badfs-nsdi04.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#badfs-nsdi04">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Sechang Son and Miron Livny, &quot;Recovering Internet Symmetry in Distributed Computing&quot;,
      <em>Proceedings of the 3rd International Symposium on Cluster Computing and the Grid</em>, Tokyo, Japan, May 2003.
      <a href="/doc/CCGRID2003.pdf">[PDF]</a>
      <a href="/doc/CCGRID2003.doc">[MS Word]</a>
      <a href="/doc/condor-bibtex.html#son-ccgrid03">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Douglas Thain, John Bent, Andrea Arpaci-Dusseau, Remzi Arpaci-Dusseau and Miron Livny,
      &quot;Pipeline and Batch Sharing in Grid Workloads&quot;,
      in Proceedings of the Twelfth IEEE Symposium on High Performance Distributed Computing,
      Seattle, WA, 2003.
      <a href="/doc/profiling.ps">[Postscript]</a>
      <a href="/doc/profiling.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#thain-hpdc12-sharing">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Douglas Thain and Miron Livny,
      &quot;The Ethernet Approach to Grid Computing&quot;,
      in Proceedings of the Twelfth IEEE Symposium on High Performance Distributed Computing,
      Seattle, WA, 2003.
      <a href="/doc/ethernet-hpdc12.ps">[Postscript]</a>
      <a href="/doc/ethernet-hpdc12.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#thain-hpdc12-ethernet">[BibTeX Source for Citation]</a>
      </li>
      <li>
      John Bent, Venkateshwaran Venkataramani, Nick LeRoy,
      Alain Roy, Joseph Stanley, Andrea Arpaci-Dusseau,
      Remzi Arpaci-Dusseau, and Miron Livny, &nbsp;
      &quot;NeST - A Grid Enabled Storage Appliance&quot;,
      in Jan Weglarz and Jarek Nabrzyski and Jennifer Schopf and
      Macief Stroinkski, editors,
      <em>Grid Resource Management</em>,
      Kluwer Academic Publishers, 2003.
      <a href="/doc/nest-chapter.ps">[Postscript]</a>
      <a href="/doc/nest-chapter.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#nest-bookchapter">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Douglas Thain, Todd Tannenbaum, and Miron Livny,
      &quot;Condor and the Grid&quot;,
      in Fran Berman, Anthony J.G. Hey, Geoffrey Fox, editors,
      <em>Grid Computing: Making The Global Infrastructure a Reality</em>,
      John Wiley, 2003.
      ISBN: 0-470-85319-0
      <a href="http://media.wiley.com/product_data/excerpt/90/04708531/0470853190.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#condor-grid">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Francesco Giacomini,
      Francesco Prelz,
      Massimo Sgaravatto,
      Igor Terekhov,
      Gabriele Garzoglio,
      and Todd Tannenbaum,
      &quot;Planning on the Grid: A Status Report [DRAFT]&quot;,
      Technical Report PPDG-20,
      Particle Physics Data Grid collaboration (http://www.ppdg.net),
      October 2002.
      <a href="/doc/grid-planning.ps">[Postscript]</a>
      <a href="/doc/grid-planning.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#ppdg-20">[BibTeX Source for Citation]</a>
      </li>
      <li>
      John Bent, Venkateshwaran Venkataramani,
      Nick LeRoy,
      Alain Roy,
      Joseph Stanley,
      Andrea Arpaci-Dusseau,
      Remzi H. Arpaci-Dusseau,
      and Miron Livny, &nbsp;
      &quot;Flexibility, Manageability, and Performance in a Grid Storage Appliance&quot;,
      <em>Proceedings of the Eleventh IEEE Symposium on High Performance Distributed Computing</em>,
      Edinburgh, Scotland, July 2002.
      <a href="http://www.cs.wisc.edu/wind/Publications/nest-hpdc-02.html">[Abstract]</a>  &nbsp;
      <a href="/doc/nest-hpdc-02.ps">[Postscript]</a>  &nbsp;
      <a href="/doc/nest-hpdc-02.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#storage-hpdc11">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Douglas Thain and Miron Livny,
      &quot;Error Scope on a Computational Grid: Theory and Practice&quot;,
      <em>Proceedings of the Eleventh IEEE Symposium on High Performance Distributed Computing (HPDC11)</em>,
      Edinburgh, Scotland, July 2002.
      <a href="/doc/error-scope.ps">[Postscript]</a>
      <a href="/doc/error-scope.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#thain-hpdc11">[BibTeX Source for Citation]</a>
      <em>(This paper also describes aspects of Condor&apos;s Java Universe)</em>
      </li>
      <li>
      Douglas Thain, John Bent, Andrea Arpaci-Dusseau,  Remzi Arpaci-Dusseau, and Miron Livny,
      &quot;Gathering at the Well: Creating Communities for Grid I/O&quot;,
      in <em>Proceedings of Supercomputing 2001</em>,
      Denver, Colorado, November 2001.
      <a href="/doc/community-sc2001.ps">[Postscript]</a>
      <a href="/doc/community-sc2001.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#thain-sc2001">[BibTeX Source for Citation]</a>
      </li>
      <li>
      James Frey, Todd Tannenbaum, Ian Foster, Miron Livny, and Steven Tuecke,
      &quot;Condor-G: A Computation Management Agent for Multi-Institutional Grids&quot;,
      <em>Journal of Cluster Computing</em>
      volume 5, pages 237-246, 2002.
      <a href="/doc/condor-bibtex.html#condor-g-jcc">[BibTeX Source for Citation]</a>
      </li>
      <li>
      James Frey, Todd Tannenbaum, Ian Foster, Miron Livny, and Steven Tuecke,
      &quot;Condor-G: A Computation Management Agent for Multi-Institutional Grids&quot;,
      <em>Proceedings of the Tenth IEEE Symposium on High Performance Distributed Computing (HPDC10)</em>
      San Francisco, California, August 7-9, 2001.
      <a href="/doc/condorg-hpdc10.ps">[Postscript]</a>
      <a href="/doc/condorg-hpdc10.pdf">[PDF]</a>
      <a href="/doc/condorg-hpdc10.doc">[MS Word]</a>
      <a href="/doc/condor-bibtex.html#condor-g-hpdc10">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Douglas Thain, Jim Basney, Se-Chang Son, and Miron Livny,
      &quot;The Kangaroo Approach to Data Movement on the Grid&quot;,
      in <em>Proceedings of the Tenth IEEE Symposium on High Performance Distributed Computing (HPDC10)</em>,
      San Francisco, California, August 7-9, 2001.
      <a href="/doc/kangaroo-hpdc10.ps">[Postscript]</a>
      <a href="/doc/kangaroo-hpdc10.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#kangaroo-hpdc10">[BibTeX Source for Citation]</a>
      </li>
      <li>
      John Bent, &quot;Building Storage Appliances for the Grid and Beyond&quot;,
      <em>Masters&apos; Project report</em>, University of Wisconsin, Madison, May 2001.
      <a href="/doc/grid-storage.ps">[Postscript]</a>
      <a href="/doc/grid-storage.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#bent-mr">[BibTeX Source for Citation]</a>
      </li>
      </ul>
      <span id="mw"></span>
      <h3>Master-Worker Computing (MW, PVM, MPI, CARMI)</h3>
      <ul>
      <li> Elisa Heymann, Miquel A. Senar, Emilio Luque, and Miron Livny,
      &quot;Adaptive Scheduling for Master-Worker Applications on the Computational Grid&quot;.
      in Proceedings of the First IEEE/ACM International Workshop on Grid Computing (GRID 2000), Bangalore, India, December 17, 2000.
      <a href="/doc/camera.ps">[Postscript]</a>
      <a href="/doc/camera.pdf">[PDF]</a>
      <a href="/doc/camera.doc">[MS Word]</a>
      <a href="/doc/condor-bibtex.html#mw-grid2000">[BibTeX Source for Citation]</a>
      </li>
      <li> Elisa Heymann, Miquel A. Senar, Emilio Luque, and Miron Livny,
      &quot;Evaluation of an Adaptive Scheduling Strategy for Master-Worker Applications on Clusters of Workstations&quot;.
      in Proceedings of the 7th International Conference on High Performance Computing (HiPC 2000), Bangalore, India, December 17, 2000.
      <a href="/doc/recorte.ps">[Postscript]</a>
      <a href="/doc/recorte.pdf">[PDF]</a>
      <a href="/doc/recorte.doc">[MS Word]</a>
      <a href="/doc/condor-bibtex.html#mw-hipc2000">[BibTeX Source for Citation]</a>
      </li>
      <li> Jeff Linderoth, Sanjeev Kulkarni, Jean-Pierre Goux, and Michael Yoder,
      &quot;An Enabling Framework for Master-Worker Applications on the Computational Grid&quot;,
      <em>Proceedings of the Ninth IEEE Symposium on High Performance Distributed Computing (HPDC9)</em>,
      Pittsburgh, Pennsylvania, August 2000, pp 43-50.
      <a href="/doc/mw-hpdc9.ps">[Postscript]</a>
      <a href="/doc/mw-hpdc9.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#mw-hpdc9">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Jeff Linderoth, Jean-Pierre Goux, and Michael Yoder,
      &quot;Metacomputing and the Master-Worker Paradigm&quot;,
      Preprint ANL/MCS-P792-0200,
      Mathematics and Computer Science Division, Argonne National Laboratory, February 2000.
      <a href="/doc/mw-preprint.ps">[Postscript]</a>
      <a href="/doc/mw-preprint.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#mw-tr">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Jim Pruyne and Miron Livny,
      &quot;Providing Resource Management Services to Parallel Applications&quot;,
      <em>Proceedings of the Second Workshop on Environments and Tools for Parallel Scientific Computing</em>, May, 1994.
      <a href="/doc/condor_pvm_framework.ps">[Postscript]</a>
      <a href="/doc/condor-bibtex.html#pruyne94">[BibTeX Source for Citation]</a>
      </li>
      </ul>
      <span id="java"></span>
      <h3>Java</h3>
      <ul>
      <li>
      Douglas Thain and Miron Livny,
      &quot;Error Scope on a Computational Grid: Theory and Practice&quot;,
      <em>Proceedings of the Eleventh IEEE Symposium on High Performance Distributed Computing (HPDC11)</em>,
      Edinburgh, Scotland, July 2002.
      <a href="/doc/error-scope.ps">[Postscript]</a>
      <a href="/doc/error-scope.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#thain-hpdc11">[BibTeX Source for Citation]</a>
      <em>(This paper describes aspects of error handling in Condor&apos;s Java Universe)</em>
      </li>
      <li>
      Al Globus, Eric Langhirt, Miron Livny, Ravishankar Ramamurthy, Marvin Solomon, and Steve Traugott,
      &quot;JavaGenes and Condor: cycle-scavenging genetic algorithms&quot;,
      <em>Proceedings of the ACM Conference on JavaGrande</em>,
      San Francisco, California, 2000.
      <a href="/doc/javagenes.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#javagenes">[BibTeX Source for Citation]</a>
      <em>(This paper describes checkpointing Java applications for opportunistic computing.)</em>
      </li>
      </ul>
      <span id="remote"></span>
      <h3>Remote Execution and Interposition Agents</h3>
      <ul>
      <li>Douglas Thain and Miron Livny,
      &quot;Parrot: Transparent User-Level Middleware for Data-Intensive
      Computing&quot;,
      <em>Scalable Computing: Practice and Experience</em>,
      Volume 6, Number 3, Pages 9-18, 2005.
      <a href="/doc/parrot-scpe.pdf">[PDF]</a>
      </li>
      <li>
      Douglas Thain and Miron Livny,
      &quot;Parrot: Transparent User-Level Middleware for Data-Intensive Computing&quot;,
      <em>Workshop on Adaptive Grid Middleware</em>,
      New Orleans, Louisiana,
      September 2003.
      <a href="/doc/parrot-agm2003.ps">[Postscript]</a>
      <a href="/doc/parrot-agm2003.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#parrot-agm2003">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Douglas Thain and Miron Livny,
      &quot;Error Management in the Pluggable File System&quot;,
      Technical Report 1448,
      Computer Sciences Department, University of Wisconsin, October 2002.
      <a href="/doc/pfs-tr.ps">[Postscript]</a>
      <a href="/doc/pfs-tr.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#thain-tr1448">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Douglas Thain and Miron Livny,
      &quot;Multiple Bypass: Interposition Agents for Distributed Computing&quot;,
      <em>The Journal of Cluster Computing</em>,
      Volume 4, 2001, pp 39-47.
      <a href="/doc/bypass-jcc-preprint.ps">[Postscript]</a>
      <a href="/doc/bypass-jcc-preprint.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#bypass-jcc">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Douglas Thain and Miron Livny,
      &quot;Bypass: A Tool for Building Split Execution Systems&quot;,
      <em>Proceedings of the Ninth  IEEE Symposium on High Performance Distributed Computing (HPDC9)</em>,
      Pittsburgh, Pennsylvania, August 2000, pp 79-86.
      <a href="/doc/bypass-hpdc9.ps">[Postscript]</a>
      <a href="/doc/bypass-hpdc9.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#bypass-hpdc9">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Victor C. Zandy, Barton P. Miller, and Miron Livny,
      &quot;Process Hijacking&quot;,
      <em>The Eighth IEEE International Symposium on High Performance Distributed Computing (HPDC8)</em>,
      Redondo Beach, California, August 1999, pp. 177-184.
      <a href="/doc/hijack-hpdc8.ps">[Postscript]</a>
      <a href="/doc/hijack-hpdc8.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#hijack-hpdc8">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Miron Livny and Michael Litzkow,
      &quot;Making Workstations a Friendly Environment for Batch Jobs&quot;,
      <em>Third IEEE Workshop on Workstation Operating Systems</em>,
      April 1992, Key Biscayne, Florida.
      <a href="/doc/friendly-wos3.ps">[Postscript]</a>
      <a href="/doc/friendly-wos3.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#batch-friendly">[BibTeX Source for Citation]</a>
      </li>
      </ul>
      <span id="security"></span>
      <h3>Security</h3>
      <ul>
      <li>
      Zach Miller, Dan Bradley, Todd Tannenbaum, Igor Sfiligoi,
      &quot;Flexible Session Management in a Distributed Environment&quot;,
      <em>Journal of Physics: Conference Series Volume 219, Issue 4, Year 2010.</em>,
      <a href="/doc/flexible_sessions.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#zmiller-sessions">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Gabriele Garzoglio, Ian Alderman, Mine Altunay, Rachana Ananthakrishnan, Joe
      Bester, Keith Chadwick, Vincenzo Ciaschini, Yuri Demchenko, Andrea Ferraro,
      Alberto Forti, David L. Groep, Ted Hesselroth, John Hover, Oscar Koeroo, Chad
      La Joie, Tanya Levshina, Zach Miller, Jay Packard, Håkon Sagehaug, Valery
      Sergeev, Igor Sfiligoi, Neha Sharma, Frank Siebenlist, Valerio Venturi, John
      Weigand,
      &quot;Definition and Implementation of a SAML-XACML Profile for Authorization
      Interoperability Across Grid Middleware in OSG and EGEE&quot;,
      <em>Journal of Grid Computing, Volume 7, Issue 3, Year 2009.</em>
      <a href="/doc/SAML-XACML-profile-JGridComputing-2009.pdf">[PDF]</a>
      </li>
      <li>
      Hao Wang, Somesh Jha, Miron Livny, and Patrick D. McDaniel,
      &quot;Security Policy Reconciliation in Distributed Computing Environments&quot;,
      <em>IEEE Fifth International Workshop on Policies for Distributed
      Systems and Networks (POLICY 2004)</em>,
      June 2004, Yorktown Heights, New York.
      <a href="/doc/policy_2004.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#wang-security">[BibTeX Source for Citation]</a>
      </li>
      </ul>
      <span id="scalability"></span>
      <h3>Scalability and Performance</h3>
      <ul>
      <li>
      E M Fajardo, J M Dost, B Holzman, T Tannenbaum, J Letts, A Tiradani, B Bockelman, J Frey and D Mason,
      &quot;How much higher can HTCondor fly?&quot;,
      <em>Journal of Physics: Conference Series</em>, Vol. 664, 2015
      <a href="/doc/jphys15-how-much-higher.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#jphys15-how-much-higher">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Dan Bradley, Timothy St Clair, Matthew Farrellee, Ziliang Guo, Miron Livny, Igor Sfiligoi,
      and Todd Tannenbaum,
      &quot;An update on the scalability limits of the Condor batch system&quot;,
      <em>Journal of Physics: Conference Series</em>, Vol. 331, No. 6, 2011.
      <a href="/doc/chep10_condor_scalability.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#chep10_scalability">[BibTeX Source for Citation]</a>
      </li>
      <li>
      D Bradley, I Sfiligoi, S Padhi, J Frey and T Tannenbaum,
      &quot;Scalability and interoperability within glideinWMS&quot;,
      <em>Journal of Physics: Conference Series</em>, Vol. 219, No. 6, 2010
      <a href="/doc/jphys10-scalability.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#jphys10-scalability">[BibTeX Source for Citation]</a>
      </li>
      <li>
      D Bradley, S Dasu, M Livny, A Mohapatra, T Tannenbaum and G Thain,
      &quot;Condor enhancements for a rapid-response adaptive computing environment for LHC&quot;,
      <em>Journal of Physics: Conference Series</em> Vol. 219, No. 6, 2010.
      <a href="/doc/chep09_condor_scalability.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#chep09_scalability">[BibTeX Source for Citation]</a>
      </li>
      </ul>
      <span id="experience"></span>
      <h3>Experience</h3>
      <ul>
      <li>
      Michael Litzkow and Miron Livny,
      &quot;Experience With The Condor Distributed Batch System&quot;,
      <em>IEEE Workshop on Experimental Distributed Systems</em>, Oct 1990, Huntsville, Al.
      <a href="/doc/experience.ps">[Postscript]</a>
      <a href="/doc/experience.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#condor-experience">[BibTeX Source for Citation]</a>
      </li>
      </ul>
      <span id="science"></span>
      <h3>Scientific Applications</h3>
      <ul>
      <li>
      Douglas Thain, John Bent, Andrea Arpaci-Dusseau, Remzi Arpaci-Dusseau and Miron Livny,
      &quot;Pipeline and Batch Sharing in Grid Workloads&quot;,
      in Proceedings of the Twelfth IEEE Symposium on High Performance Distributed Computing,
      Seattle, WA, 2003.
      <a href="/doc/profiling.ps">[Postscript]</a>
      <a href="/doc/profiling.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#thain-hpdc12-sharing">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Jim Basney, Rajesh Raman, and Miron Livny,
      &quot;High Throughput Monte Carlo&quot;,
      <em>Proceedings of the Ninth SIAM Conference on Parallel Processing for Scientific Computing</em>,
      March 22-24, 1999, San Antonio, Texas.
      <a href="/doc/htmc-siam9.ps">[Postscript]</a>
      <a href="/doc/htmc-siam9.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#ht-montecarlo">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Chungmin Chen, Kenneth Salem, and Miron Livny,
      &quot;The DBC: Processing Scientific Data Over the Internet&quot;,
      <em>16th International Conference on Distributed Computing Systems</em>,
      May 1996.
      <a href="/doc/dbc-dcs16.ps">[Postscript]</a>
      <a href="/doc/dbc-dcs16.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#dbc-dcs16">[BibTeX Source for Citation]</a>
      </li>
      </ul>
      <span id="scheduling"></span>
      <h3>Scheduling</h3>
      <ul>
      <li>
      Mark Silberstein, Dan Geiger, Assaf Schuster, and Miron Livny,
      &quot;Scheduling Mixed Workloads in Multi-grids: The Grid Execution Hierarchy&quot;,
      <em>Proceedings of the 15th IEEE Symposium on High Performance Distributed Computing (HPDC)</em>,
      city, state, month 2006.
      <a href="/doc/complexity-aware-grid1.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#hpdc15-silberstein">[BibTeX Source for Citation]</a>
      </li>
      <li> Derek Wright, &quot;Cheap cycles from the desktop to the dedicated
      cluster: combining opportunistic and dedicated scheduling with
      Condor&quot;, <em>Conference on Linux Clusters: The HPC Revolution</em>,
      June, 2001, Champaign - Urbana, IL.
      <a href="/doc/cheap-cycles.ps">[Postscript]</a>
      <a href="/doc/cheap-cycles.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#cheap%20cycles">[BibTeX Source for Citation]</a>
      <a href="/doc/cheap-cycles.ppt">[Power Point slides of talk presentation]</a>
      </li>
      <li>
      P. E. Krueger and Miron Livny,
      &quot;A Comparison of Preemptive and Non-Preemptive Load Distributing&quot;,
      <em>Proc. of the 8th International Conference on Distributed Computing Systems</em>,
      pp. 123-130, June 1988.
      <a href="/doc/icdcs1988-2.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#krueger-icdcs8">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Matt Mutka and Miron Livny,
      &quot;Scheduling Remote Processing Capacity In A Workstation-Processing Bank Computing System&quot;,
      <em>Proceedings of the 7th International Conference of Distributed Computing Systems</em>,
      pp. 2-9, September, 1987.
      <a href="/doc/mutka-livny-dcs.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#mutka-icdcs7">[BibTeX Source for Citation]</a>
      </li>
      <li>Alain Roy and Miron Livny, &quot;Condor and Preemptive Resume
      Scheduling&quot;, Published in <em>Grid Resource Management: State of the Art and
      Future Trends</em>, Fall 2003, pages 135-144, Fall 2003, Edited by Jarek
      Nabrzyski, Jennifer M. Schopf and Jan Weglarz, published by Kluwer
      Academic Publishers.
      <a href="/doc/condor_preemptive_scheduling_2003.pdf">[PDF]</a>
      </li>
      </ul>
      <span id="nmi"></span>
      <h3>NMI Build &amp; Test Laboratory</h3>
      <ul>
      <li>Andrew Pavlo, Peter Couvares, Rebekah Gietzel, Anatoly Karp, Ian D. Alderman, Miron Livny, and Charles Bacon,
      &quot;The NMI Build &amp; Test Laboratory: Continuous Integration Framework for Distributed Computing Software&quot;,
      <em>Proceedings of LISA &apos;06: Twentieth Systems Administration Conference</em>,
      Washington, DC, December 2006, pp. 263 - 273.
      <a href="/doc/nmi-lisa2006.ps">[Postscript]</a>
      <a href="/doc/nmi-lisa2006.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#nmi-lisa06">[BibTeX Source for Citation]</a>
      <a href="/doc/nmi-lisa2006-slides.pdf">[PDF of presentation slides]</a>
      </li>
      <li>A. Iosup, D.H.J. Epema, P. Couvares, A. Karp, and M. Livny,
      &quot;Build-and-Test Workloads for Grid Middleware: Problem, Analysis, and Applications&quot;,
      <em>Seventh IEEE International Symposium on Cluster Computing and the Grid (CCGRID)</em>,
      IEEE Computer Society, Pages 205-213, May 2007.
      <a href="/doc/aiosup06buildntest.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#nmi-ccgrid07">[BibTeX Source for Citation]</a>
      <a href="/doc/build-n-test_ccgrid07talk.pdf">[PDF of presentation slides]</a>
      </li>
      </ul>
      <span id="background"></span>
      <h3>Background Work</h3>
      <ul>
      <li>
      Miron Livny and Myron Melman,
      &quot;Load Balancing in Homogeneous Broadcast Distributed Systems&quot;,
      <em>Proceedings of Computer Network Performance Symposium</em>,
      April 13-14, 1982,
      College Park, Maryland.
      <a href="/doc/livny-melman.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#livny-melman-82">[BibTeX Source for Citation]</a>
      </li>
      </ul>
      <span id="miscellaneous"></span>
      <h3>Miscellaneous</h3>
      <ul>
      <li>Douglas Thain, Todd Tannenbaum, and Miron Livny, &quot;How to Measure a
      Large Open Source Distributed System&quot;, in <em>Concurrency and
      Computation: Practice and Experience</em>, to appear in 2006.
      </li>
      <li>Zach Miller, Todd Tannenbaum, and Ben Liblit, &quot;Enforcing Murphy&apos;s
      Law for Advance Identification of Run-time Failures&quot;, <em>Proceedings of
      USENIX 2012</em>.
      <a href="/doc/murphy-usenix2012.pdf">[PDF]</a>
      </li>
      </ul>
      <span id="dissertations"></span>
      <h3>PhD Dissertations from HTCondor team members at UW-Madison</h3>
      <ul>
      <li>
      Miron Livny
      <a href="/doc/livny-dissertation.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#livny-thesis">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Matt Mutka
      <a href="/doc/mutka-dissertation.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#mutka-thesis">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Jim Pruyne
      <a href="/doc/pruyne.dissert.pdf">[PDF]</a>
      <a href="/doc/pruyne.dissert.ps">[Postscript]</a>
      <a href="/doc/condor-bibtex.html#pruyne-thesis">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Rajesh Raman
      <a href="/doc/rajesh.dissert.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#raman-thesis">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Jim Basney
      <a href="/doc/jbasney-dissert-condensed.pdf">[PDF]</a>
      <a href="/doc/jbasney-dissert-condensed.ps">[Postscript]</a>
      <a href="/doc/condor-bibtex.html#basney-thesis">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Douglas Thain
      <a href="/doc/thain-dissertation.pdf">[PDF]</a>
      <a href="/doc/thain-dissertation.ps">[Postscript]</a>
      <a href="/doc/condor-bibtex.html#thain-thesis">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Tevfik Kosar
      <a href="/doc/kosar-dissertation.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#kosar-thesis">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Sechang Son
      <a href="/doc/sonny-dissertation.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#sonny-thesis">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Nicholas Coleman
      <a href="/doc/ncoleman-dissert.pdf">[PDF]</a>
      <a href="/doc/ncoleman-dissert.ps">[Postscript]</a>
      <a href="/doc/condor-bibtex.html#coleman-thesis">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Ian Alderman
      <a href="/doc/alderman_thesis.pdf">[PDF]</a>
      <a href="/doc/condor-bibtex.html#alderman-thesis">[BibTeX Source for Citation]</a>
      </li>
      <li>
      Joseph Meehean
      <a href="http://www.cs.wisc.edu/adsl/Publications/meehean-thesis11.pdf">[PDF]</a>
      <a href="http://www.cs.wisc.edu/adsl/Publications/meehean-thesis11.html">[Abstract]</a>
      </li>
      </ul>
    </div>
  );
}
