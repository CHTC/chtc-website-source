[toc]

# Data Storage Locations
The HTC system has two primary locations where users can store files: `/home` and `/staging`.

The mechanisms behind `/home` and `/staging` that manage data are different and are optimized to handle different file sizes. `/home` is more efficient at managing small files, while `/staging` is more efficient at managing larger files. It's important to place your files in the correct location, as it will improve the speed and efficiency at which your data is handled and will help maintain the stability of the HTC filesystem. 

[insert table]

# Understand your file sizes
To know whether a file should be placed in /home or in /staging, you will need to know it's file size (also known as the amount of "disk space" a file uses). There are many commands to print out your file sizes, but here are a few of our favorite: 

### Use `ls` with `-lh` flags
The command `ls` stands for "list" and, by default, lists the files in your current directory. The flag `-l` stands for "long" and `-h` stands for "human-readable". When the flags are combined and passed to the `ls` command, it prints out the long metadata associated with the files and converts values such as file sizes into human-readable formats (instead of a computer readable format).

```
NetID@submit$ ls -lh
```

### Use `du -h`
Similar to `ls -lh`, `du -h` prints out the "disk usage" of directories in a human-readable format. 

```
NetID@submit$ du -h
```


# Transferring data to jobs
The HTCondor submit file `transfer_input_files =` line should always be used to tell HTCondor what files to transfer to each job, regardless of if that file is origionating from your /home or /staging directory. However, the syntax you use to tell HTCondor to fetch files from /home and /staging and transfer to your running job will change depending on file size. 

0-500 MB
/home

500-10GB
osdf:///

10GB+ 
file:///


# Transfer data from job back to /home
Files edited or created durring your job will auto return to home. 

# Transfer data from job back to /staging




