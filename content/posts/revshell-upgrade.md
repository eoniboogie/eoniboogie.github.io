+++
date = '2026-02-21T23:34:58+09:00'
draft = false
title = 'Stabilize a reverse shell'
tags = ["reverseshell"]
+++

After getting a reverse shell, we can stabilize it using commands below.

- `python3 -c 'import pty;pty.spawn("/bin/bash")'`
- `export TERM=xterm`
- `ctrl+z`
- `stty raw -echo; fg`
- `stty rows 38 columns 116`
