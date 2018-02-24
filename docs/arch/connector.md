---
category: TQuant
order: 5
title: 连接层
---

连接层负责连接云服务和本地服务，提供[TQuantApi](docs/arch/tquant_api)接口服务。

连接层的服务程序为tqc(TQuant Connector)。主要功能为：

- 缓存实时tick数据和历史数据
- 提供基于Web方式的配置方式，可以配置交易帐号、订阅云行情服务等
- 通过IPC给本机的用户程序提供服务
- 合并云行情和本地行情

用户程序通过IPC和tqc交互，API的源码开放，保障用户的策略代码安全。

## 各组件功能

- **Data Connector**
连接TickServer或者本地的TickDB，通过MPRPC Server 提供DataApi服务。

- **Trade Connector**
连接TradeServer或者本地的TradeNode，通过MPRPC Server 提供TradeApi服务。

- **RT Cache**
云服务器实时行情缓存，使用内存映射方式保存和访问数据，快速获取数据。

- **His Cache**
云服务器历史数据缓存，使用内存映射方式保存和访问数据，快速获取数据。

- **Http Server**
提供基于Web的管理控制台。

- **MPRPC Server**
提供API服务，包括DataApi、TradeApi等。支持远程socket访问或者本机IPC访问。


## MPRPC

MPRPC是自己实现的RPC框架，使用MsgPack打包数据，支持多种通讯协议，包括IPC、Socket、WebSocket和ZeroMQ。客户端支持C++、Java、Python和JavaScript。

使用IPC通讯协议，可以得到最小的低延时RPC调用，一次交互的时间约为0.02毫秒。与此比较，Socket方案在0.3毫秒左右。
