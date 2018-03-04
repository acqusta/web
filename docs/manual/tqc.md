---
category: 教程
order: 1
title: tqc安装和配置
---

tqc(TQuant Connector)是运行在用户电脑上的服务程序，给本机程序提供行情和交易服务。

## 安装

请从百度网盘上下载最新的文件。安装文件是7z打包的文件，解开即可以使用。Windows用户还需要安装VisualC++2015的64位运行库。

**微软官方下载**

[Visual C++ 2015 runtime](https://www.microsoft.com/en-us/download/details.aspx?id=48145)

建议安装目录
- Widnows 安装在d:\tquant
- Linux和Mac安装在 $HOME/opt/tquant目录，也可以安装在 /opt/tquant目录中。

Windows安装目录示意
```
d:\tquant
└─tqc
    ├─bin
    ├─data
    │  ├─his
    │  └─rt
    ├─etc
    ├─tmp
    └─web
```

## 配置

tqc主程序的配置文件是etc/tqc.conf，建议不要修改。如果端口冲突，请自行修改。

建议不要修改svr_port。

```json
{
    "portal_addr" : "http://svr1.acqusta.com:8080",
    "tksvr_addr"  : "tcp://svr1.acqusta.com:10013",
    "tdsvr_addr"  : "tcp://svr1.acqusta.com:10003",

    "svr_port": 10001, // 服务端口，如果冲突，请修改
    "svr_ip": "127.0.0.1",

    "http_port": 7080, // Web配置端口，如果冲突，请修改
    "http_ip": "127.0.0.1"
}
```

## 运行

tqc是个命令行程序，启动后在两个端口上启动服务：
- 端口7080上启动Web服务，用于配置
- 端口10001上启动TQuantApi服务

```
C:\tquant\tqc\bin>tqc
Could not create log file: File exists
COULD NOT CREATE LOGFILE '20180219'!
I0219 12:56:26.021052  4248 Start server at tcp://127.0.0.1:10001
I0219 12:56:26.036653  6188 create shmem shm_tqc_v1_tqc_10001
I0219 12:56:26.036653  4248 Start ipc server at ipc://tqc_10001
Could not create log file: File exists
COULD NOT CREATE LOGFILE '20180219'!
W0219 12:56:26.036653  4248 No mkt in tkcfg
I0219 12:56:26.036653  3300 create shmem shm_tqc_v1_tkrecv_1089380105
I0219 12:56:26.036653  4248 md_sina: Init md_sina
I0219 12:56:26.036653  4248 md_sina: Start md_sina
I0219 12:56:26.223841  2404 Start web server at tcp://127.0.0.1:7080
I0219 12:56:26.223841  2404 Set web home: C:\tquant\tqc\web
Could not create log file: File exists
COULD NOT CREATE LOGFILE '20180219'!
I0219 12:56:26.301836  5616 Create user session: user,S_user_245335638
I0219 12:56:26.317435   200 Login successfully
I0219 12:56:27.362576  4248 Please open browser to login
I0219 12:56:27.362576  4248 http://127.0.0.1:7080
```

## 登录

**登录页面**

请用**Chrome浏览器**打开[http://127.0.0.1:7080]，使用tqc的免费帐号登录。

如果没有帐号，请先在www.acqusta.com上免费注册一个帐号。tqc使用本地服务是免费的，只有订阅了tquant的数据服务才会收些网络流量费用。

<div class="pic-plus">
  <img width="600" src="tqc_login.png">
</div>

**首页**

登录成功后，首页显示用户的服务订阅情况，如果没有使用云服务，可以忽略这些信息。

<div class="pic-plus">
  <img width="600" src="tqc_home.png">
</div>

## 行情配置

### 订阅云行情

为方便用户使用，云服务提供实时行情和7天的历史数据。用户可以根据需要选择是否订阅。

图示为订阅100个代码的行情。

<div class="pic-plus">
  <img width="600" src="tqc_md.png">
</div>

注意：
> 1. 当日数据下载服务暂时不可用。
> 1. 云行情的股票行情是新浪网的Level1行情。
> 1. 期货主力合约包含了历史上所有的主力合约，如果用主力合约订阅的话，实际上是订阅了多个代码。

### 订阅本地行情

云行情和本地行情可以同时使用，tqc会智能合并行情。

**新浪股票行情**

tqc缺省启用了本地的新浪行情，无需配置可以直接订阅。使用方法请参考TQuantApi手册。

**ctp期货行情**

在Windows和Linux平台上可以订阅ctp的行情。请联系你的期货公司取得行情服务器地址和BrokerID。
以下以simnow为例示范如何配置。

修改了改配置文件，需要重新启动tqc。

配置文件 etc/md_ctp.conf

```json
{
  "ctp" : {
    "front_addr" : "tcp://180.168.146.187:10010", //修改为你的期货公司行情服务器地址
    "broker"     : "9999", // 修改为你的期货公司ID
    "username"   : "000000", // 可以不用修改
    "password"   : "000000"  // 可以不用修改
  },
  "recv_time" : [
    {
      "start" :  83000,
      "end"   : 153000,
      "weekday" : [1,2,3,4,5]
    },
    {
      "start" : 193000,
      "end"   : 240000,
      "weekday" : [1,2,3,4,5]
    },
    {
      "start" :      0,
      "end"   :  50000,
      "weekday" : [2,3,4,5,6]
    }
  ]
}

```

## 交易帐号配置

TQuant支持股票和期货的交易。在不同平台上，交易接口支持不一样。

| 平台 | 交易服务 |
| ---- | ------ |
| Windows | 云服务，本地ctp，本地股票外挂 |
| Linux | 云服务，本地ctp |
| Mac | 云服务 |

**请给每个交易帐号编个唯一的编号，用于下单时指定交易帐号。**

### ctp期货交易配置


<div class="pic-plus">
  <img width="600" src="tqc_ctp.png">
</div>

### 股票外挂交易配置

<div class="pic-plus">
  <img width="600" src="tqc_stk.png">
</div>


