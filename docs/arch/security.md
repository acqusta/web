---
category: TQuant
order: 7
title: 用户策略安全
---

策略是交易员的核心机密。TQuant设计之初即把用户的代码安全放在第一位。用户代码安全方面的措施如下：

- 进程隔离

  用户程序通过TQuantApi与tqc服务交互，该API通过socket或者IPC与tqc服务器通讯，进程隔离。

- 所有与用户程序运行在同一进程的服务都在github上开放源码

 TQuantApi源码在github上，用户可以自己编译。
  tqs策略平台、进程内行情和交易模块源码开放。

- 本地服务方案

  云服务只做数据转发，不会记录用户的交易记录。如果仍有顾虑，可以选用本地服务层，不通过服务器转发，交易记录均在本地。

