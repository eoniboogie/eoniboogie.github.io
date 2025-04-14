---
layout: post
title: Hack The Box - Grandparents
subtitle: Hack the box Grandpa and Granny write-ups
category: writeup
thumbnail-img: /assets/img/writeup/HTB/granny/pwned.png
tags: [writeup, hackthebox, grandpa, granny, msfconsole, metaexploit, iis]
author: Hong
---

# Grandpa

## nmap

![nmap](/assets/img/writeup/HTB/granny/nmap.png)

We can see the web server is open.

It's using IIS 6.0 version.

Checked the web page but nothing can be found.

![web](/assets/img/writeup/HTB/granny/web.png)

## metasploit

This machine can be easily cleared by using msfconsole.

search if there are any exploits available.

`search iis 6.0`

Use the exploit for the iis one.

After logging in enumerated the directories and files.

![whoami](/assets/img/writeup/HTB/granny/whoami.png)

Found there's a vulnerablility in user privileges but there was no way to transfer tools.

So, I decided to use metasploit's local exploit suggester.

![suggester](/assets/img/writeup/HTB/granny/suggester.png)

The current session has to be backgrounded to use another session.

`background`

![webdav](/assets/img/writeup/HTB/granny/webdav.png)

Use the available vulnerability and set a session to the session that we connected before.

After running the exploit, it may say permission denied. Then you need to go back to the previous session and migrate to NT Authority process.

![migrate](/assets/img/writeup/HTB/granny/migrate.png)

Then, background it agian and go back to run the exploit.

If it goes successful, session 2 will be connected.

![root](/assets/img/writeup/HTB/granny/root.png)

# Granny

Granny is exactly same as grandpa machine.

I jsut used a different exploit from the results of local exploit suggester.

![popup](/assets/img/writeup/HTB/granny/popup.png)

Again, before run the exploit, go back to the session 1 and migrate to NT Authority porcess.

Then, come back to the exploit and set session to session 1 and run it.

You will get session 2 as administrator.

# Takeaways

- metasploit's local exploit suggester is quite useful.

- you can background a current shell and interact with msfconsole.

- It's important to migrate to appropriate process for resolvig permission issues.
