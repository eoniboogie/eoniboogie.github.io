+++ date = '2026-10-22T09:13:35+09:00' draft = false title = 'Port forwarding' +++

## SSH

### remote port forwarding 

- forward port 80 and 14147

```sh
ssh -N -R 80:127.0.0.1:80 -R 14147:127.0.0.1:14147 kali@192.168.45.247
```

### local port forwarding 

```sh
ssh -N -L 8000:127.0.0.1:8000 dev@192.168.249.150
```

## chisel

## chisel

- Requirement: Need to install Chisel on both sides.

### remote port forwarding  

- kali

```sh
chisel server -p {port} --reverse
```

- target 

```sh
chisel client http://{kali_ip}:{port} R:127.0.0.1:{service_port}:127.0.0.1:{service_port}
```
