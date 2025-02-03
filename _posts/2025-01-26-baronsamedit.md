---
layout: post
title: CVE-2021-3156 취약점 및 예시
subtitle: Baron Samedit - sudo 버전 취약점점
category: knowledge
thumbnail-img: /assets/img/knowledge/baron.webp
tags: [kernel, sudo, suid, baronsamedit,CVE-2021-3156]
author: Hong
---
sudo의 버전을 이용한 버퍼 오버플로우에 의한 권한 상승 취약점.

CVE-2021-3156은 sudo의 버전이 1.9.5p2 보다 낮을 경우 악용할 수 있다.

해당 취약점은 유명해서 또 다른 이름으로 Baron Samedit이라고도 불린다.
# sudo의 버전 확인
리눅스 시스템에 초기 진입에 성공했을 때 SUID의 리스트를 확인한다.

보통 sudo가 포함되어 있지만 보안 문제로 사용이 제한되어 있는 경우가 많다.

그렇다고 그냥 지나치지 말고 버전을 확인해본다.

```bash
$ sudo --version
Sudo version 1.8.31
Sudoers policy plugin version 1.8.31
Sudoers file grammar version 46
Sudoers I/O plugin version 1.8.31
```
위의 경우 버전이 1.8.31로 CVE-2021-3156에 해당되는 것을 알 수 있다.

# Poc를 다운로드, 실행
취약점을 이용하는 방법은 간단한데 poc소스 코드를 다운받아서 실행하면 끝이다.

https://github.com/mohinparamasivam/Sudo-1.8.31-Root-Exploit 여기서 깃을 클론해온다.

위의 리포지토리의 경우 gcc로 컴파일 할 필요가 있기 때문에 시스템에 gcc가 없으면 사용하기 어렵다.

https://github.com/worawit/CVE-2021-3156 여기의 경우 파이썬 파일로도 같은 기능을 하기 때문에 python이 설치되어 있으면 사용할 수 있다.

```bash
# 실행전
www-data@ip-172-20-3-199:/tmp/Sudo-1.8.31-Root-Exploit-main$ whoami
www-data

#실행 후
www-data@ip-172-20-3-199:/tmp/Sudo-1.8.31-Root-Exploit-main$ ./exploit 
whoami
root
```
위의 코드를 보면 실행 후 바로 root로 바뀌는 것을 알 수 있다.