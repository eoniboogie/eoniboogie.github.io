---
layout: post
title: wifi hacking for beginners 요약
subtitle: wifi hacking for beginners의 내용 요약
category: textbook
thumbnail-img: /assets/img/knowledge/compiled.png
tags: [linux, macaddress, ifconfig]
author: Hong
---

# Mac address 변경하기

MAC 주소는 네트워크 인터페이스의 유니크한 주소로 사용자를 특정할 수 있다.

Mac address를 바꿔서 내 컴퓨터의 물리주소를 변경해 탐지되지 않도록 한다.

macchanger라는 툴도 있는데 우선선 수동으로 변경하는 방법에 대해 설명한다.

`ifconfig`로 네트워크 어댑터 확인.

`ifconfig wlan0 down`으로 일단 동작을 멈춘다.

`ifconfig wlan0 hw ether 00:11:22:33:44:55` 같은 식으로 원하는 값으로 변경.

`ifconfig wlan0 up`으로 다시 작동시킨다.

`ifconfig`로 다시 확인해보면 맥주소가 변경되어있는 것을 확인 할 수 있다.

이걸로 다른 네트워크에 침입했을 때 감지되더라도 다른 맥주소를 보여줌으로써 원래의 맥주소가 들키는 것을 피할 수 있다.

툴을 사용해서 변경할 때는 아래와 같이 한다.

`ifconfig wlan0 down` 먼저 네트워크를 다운시키는 건 같다.

`macchanger --random wlan0` 이렇게 하면 랜덤으로 맥 주소가 바뀐다.

![macchanger](/assets/img/textbook/macchanger.png)

이 상태로 시작하지 않으면 트랙 당하기 때문에 굉장히 위험하다.

원래의 맥주소로 되돌릴 때는 -p를 사용하면 된다.

# monitor mode

네트워크를 감지하기 위해 모니터 모드를 설정해야 한다.

handshake를 포착해얗 하는데 한 번 포착하고 나면 더이상 와이파이 범위내에 머물 필요는 없다.

```sh
ifconfig wlan0 down # 설정 전 다운
iwconfig wlan0 mode monitor # 모니터 모드 설정
ifconfig wlan0 up # 다시 업
iwconfig wlan0
wlan0     IEEE 802.11  Mode:Monitor  Tx-Power=20 dBm
          Retry short limit:7   RTS thr:off   Fragment thr:off
          Power Management:off # 모니터 모드 확인
```

# catch handshake

핸드쉐이크를 감지하기 위해 airodump-ng라는 툴을 사용한다.
