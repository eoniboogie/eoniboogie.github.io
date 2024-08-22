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
