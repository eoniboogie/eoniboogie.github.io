# Text manipulation

## Numbering the lines

`nl /etc/snort/snort.conf`

## Find and replace strings with sed

`sed s/mysql/MySQL/g /etc/snort/snort.conf > snort2.conf`
Change every mysql to MySQL.  
s for search, g for gloal (all occurrences).  
Change only the second mysql word.  
`sed s/mysql/MySQL/2 /etc/snort/snort.conf > snort2.conf`

## less instead of cat

- In less interface, you can find a term using slash (/). To go to the next word, type n.

## leafpad

memo text editor in linux.

# Analyzing and managing networks

## iwconfig

Display information on a wireless adapter (router).

## Change IP address

`ifconfig eth0 192.168.15.3`
The IP address changed to 192.168.15.3

## Assigning new IP addresses from the DHCP server

`dhclient eth0`
By doing this, the DHCP server assigns a new IP address without rebooting the system.

# Adding and removing software

## searching for a package

`apt-cache search snort`

## adding software

`apt-get install snort`

## removing software

`apt-get remove snort`

# Permission

## Granting ownership to an individual

`chown bob /tmp/bobsfile`
Granting bob ownership of bobsfile.

## Granting ownership to a group

`chgrp security newIDS`
Passing the security group ownership of newIDS.

## Checking permissions

```
-rw-r--r--    1     root     root         33685504       June 28 2018     hashcat.hcstat
-rw-r--r--    1     root     root         33685504       June 28 2018     hashcat.hctune
drwxr-xr-x    2     root     root         4096           Dec 5 10: 47     masks
drwxr-xr-x    2     root     root         4096           Dec 5 10: 47     OpenCL
```

- First letter: file type (d for directory, - for file)
- First column: the permissions of the owner, group, and the other users.
- Third column: the owner of the file.

## Chaging permission

```
chmod 711 hashcat.hcstat
chmod u+x, o+x hashcat.hcstat
```

## Umask

umas can remove permissions.

| New files | New directories |                        |
| :-------- | :-------------- | :--------------------- |
| 6 6 6     | 7 7 7           | Linux base permissions |
| 0 2 2     | 0 2 2           | umask                  |
| 6 4 4     | 7 5 5           | Resulting permissions  |

umask secures permissions. restricts the basic permissions.  
In kali, the umask is preconfigured to 022 (default it 644 for files and 755 for directories).  
umask can be edited from `/home/username/.profile` file.

## Granting temporary root permissoins with SUID

adding 4 in front of permissions.  
`chmod 4644 filename`
we can search for files set to SUID.  
![SUID](/assets/img/textbook/SUID.png)  
And files with sudo permissions will look like below.  
![SUID2](/assets/img/textbook/SUID2.png)  
It has an s in place of the x. It means the SUID bit is set.

## SGID

adding 2 in front of permissions.
`chmod 2644 filename`

# Process management

## Viewing processes

all processess and all users.  
`ps aux`

```
USER     PID      % CPU    % MEM         VSZ         RSS TTY         STAT START       TIME       COMMAND Root         1         0.0       0.4         202540     6396 ?        Ss       Apr24         0: 46    / sbin/ init Root         2         0.0       0.0                   0           0 ?        S         Apr24         0: 00    [ kthreadd] Root         3         0.0       0.0                   0           0 ?        S         Apr24         0: 26    [ ksoftirqd/ 0] --snip-- root     39706     0.0     0.2     36096     3204 pts/ 0         R + 15: 05     0: 00         ps aux
```

It can be used with grep command.

- top command shows the processes by it's size.

## Running processes in the background

Adding & at the end ot the command.
`leafpad newscript &`
`flameshot &`

## Moving a process to the foreground

`fg PID`
if you don't know the PID, you can find it with ps command.

## Scheduling processes

- at : run once at some point in the future
- crond : run regularly

```
at 7:20pm
at 7:20pm June 25
at noon
at tomorrow
at now + 5days
at 7:20am 09/30/2100
```

```
at 7:20am
at> /root/myscanningscript
```

myscanningscript will be executed at 7:20am

# Managing user environment variables

## Viewing environment vaiables

```
kali > env
XDG_VTNR = 7 SSHAGENT_PID = 922 XDG_SESSION_ID = 2 XDG_GREETER_DATA_DIR =/ var/ lib/ lightdm/ data/ root GLADE_PIXMAP_PATH =: echo TERM = xterm SHELL =/ bin/ bash --snip-- USER = root --snip-- PATH =/ usr/ local/ sbin :usr/ local/ bin:/ usr/ sbin:/ sbin/ bin --snip-- HOME =/ root --snip--
```

- Environment variables are always uppercase.
- HISTSIZE variable contains command history.  
  If you don't want to leave any command histoty, then set the HISTSIZE to 0. `kali > HISTSIZE=0`

## Making variable value changes permanent

- change in an environment variable will disapper when the terminal is closed.
- export will change a value permanently

```
kali > HISTSIZE=1000
kali > export HISTSIZE
```

## Changing your shell prompt

The default shell prompt takes the following format.  
`username@hostname:current_directory`  
for example: `root@kali:current_directory`  
The default shell prompt can be changed by setting the **PS1** varilable.

```
\u The name of the current user
\h The host name
\W The base name of the current working directory
```

For example

```
kali > PS1="World's Best Hacker:#"
World's Best Hacker:#
World's Best Hacker:#pwd
/home/eon
kali > export PS1
```

```
kali > export PS1='C:\w> '
C:/tmp>
```

## Adding to the PATH variable

A terminal will search for any command in **$PATH**.  
If I installed a new tool called _newhackingtool_ into the _/root/newhackingtool_ directory, then I need to go to the directory to use the tool.  
However, if I add it to the $PATH, then I can use the tool from any directories.  
`kali > PATH=$PATH:/root/newhackingtool`  
original path + new path of the tool. Appending using ":". Don't forget to contain the original PATH.

- Adding too many path variables could slow down the terminal.

## Creating a user defined variable

```
kali > NEWVARIABLE="apple apple apple"
kali > echo $NEWVARIABLE
apple apple apple
kali > unset NEWVARIABLE
kali > echo $NEWVARIABLE
kali >
```

# Bash scripting

## shebang

You need to tell your operating system which interpreter to use.  
`#!`  
In the case of bash, `#! /bin/bash`

```
#! /bin/bash
# This is bash script. In this one, you prompt /
# the user for input, place the input in a variable, and /
# display the variable contents in a string.

echo "what is your name?"
read name
echo "what chapter are you on in linux basics for hackers?"
read chapter
echo "Welcome" $name "to chapter" $chapter "of linux basics for hackers!"
```

## /dev/null

/dev/null is simply a place to send output so that it disappears.

# Compressing and Archiving

## tar

- Archiving

```
kali > tar -cvf HackersArise.tar hackersarise1 hackersarise2 hackersarise3 hackersarise1 hackersarise2 hackersarise3
```

c: create, v: verbose, f: following file(s)

- See the contents list without extracting.

```
kali > tar -tvf HackersArise.tar
-rwxr-xr-x 1 root root               22311     Nov 27     2018 13: 00 hackersarise1. sh
-rwxr-xr-x 1 root root                 8791     Nov 27     2018 13: 00 hackersarise2. sh
-rwxr-xr-x 1 root root                 3992     Nov 27     2018 13: 00 hackersarise3. sh
```

- Extract the files.

```
kali > tar -xvf HackersArise.tar
hackersarise1. sh
hackersarise2. sh
hackersarise3. sh
```

## dd

- a bit by bit copy.
- deleted files are copied too.
- used in forensic.
- very slow.
  `dd if=inputfile of=outputfile`

```
kali > dd if =/ dev/ sdb of =/ root/ flashcopy
1257441 = 0 records in
1257440 + 0 records out
7643809280 bytes (7.6 GB) copied, 1220.729 s, 5.2 MB/s
```

# Filesystem and Storage Device Management

## dev directory (device)

```
brw-rw----    1     root root                 8,           0         May 16 12: 44       sda
brw-rw----    1     root root                 8,           1         May 16 12: 44       sda1
brw-rw----    1     root root                 8,           2         May 16 12: 44       sda2
brw-rw----    1     root root                 8,           5         May 16 12: 44       sda5
brw-rw----    1     root root                 8,           16       May 16 12: 44       sdb
brw-rw----    1     root root                 8,           17       May 16 12: 44       sdb1
```

- Device File Description
  | Disk | Meaning |
  | :--- | :--------------------- |
  | sda | First SATA hard drive |
  | sdb | Second SATA hard drive |
  | sdc | Third SATA hard drive |
  | sdd | Fourth SATA hard drive |

The SATA hard drive (500GB).
![sata](/assets/img/textbook/sata.jpg)

- Partition Description
  |Partition|Meaning|
  |:---|:---|
  |sda1|The first partition (1) on the first (a) SATA drive|
  |sda2|The second (2) partition on the first (a) drive|
  |sda3|The third (3) partition on the first (a) drive|
  |sda4|The fourth (4) partition on the first (a) drive|

- lists all the partitions of all the drives.
  ```
  kali > fdisk -l
  Device           Boot     Start               End       Sectors       Size     Id     Type
  /dev/ sdb1                       32     62498815     62498784     29.8G       7     HPFS/ NTFS/ exFAT
  ```
- HPFS: High Performance File System
- NTFS: New Technology File System (new)
- exFAT: Extended File Allocation Table (old)

These are not linux systems. They are macOS and Windows System. You can guess the OS type by observing the file types.

## listing block device information

```
kali > lsblk
Name             MAJ:MIN     RM     SIZE     RO     TYPE     MOUNTPOINT
fd0                   2: 0           1         4K       0     disk
sda1                 8: 0           0       20G       0     disk
|-sda1             8: 1           0 18.7G       0     part    /
|-sda2             8: 2           0         1K       0     part
|-sda5             8: 5           0     1.3G       0     part    [ SWAP]
sdb                   8: 16         1 29.8G       0     disk
|-sdb1             8.17         1 29.8G       0     disk    / media
sr0                   11: 0         1     2.7G       0     rom
```

## Mounting storage devices

`mount /dev/sdb1 /mnt`  
mount the new hard drive sdb1 at the /mnt directory.  
`mount /dev/sdc1 /media`  
mount the flash drive sdc1 at the /media directory.  
`umount /dev/sdb1`  
unmount /dev/sdb1. (no n in umount)

## Getting information on mounted disks

```
kali > df
Filesystem                     1K-Blocks             Used     Available Use%           Mounted on
rootfs                               19620732     17096196         1504788     92%          /
udev                                         10240                   0             10240       0%          /dev
--snip--
/dev/sdb1                         29823024     29712544           110480     99%          /media/USB3.0
```
