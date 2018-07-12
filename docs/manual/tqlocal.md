---
category: 教程
order: 1
title: tqlocal安装和配置
---

tqlocal是运行在用户电脑上的服务程序，给本机程序提供行情和交易服务。

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
└─tqlocal
    ├─bin
    ├─data
    │  ├─his
    │  └─rt
    ├─etc
    ├─tmp
    └─web
```
## 服务程序

| 程序名 | 功能 | 
| ----- | ---- |
| fh_ctp | ctp 行情 |
| fh_tdx | 通达信行情 |
| fh_sina | 新浪行情 |
| fh_relay | 行情转发服务 |
| tk_recv | 行情接收合并服务 |
| tkdb | tick 数据库维护工具 |
| tqc | TQuant 云服务客户端 |
| td_ctp | ctp交易服务 |


## 配置

### 行情

etc目录缺省有各服务的配置 ，无需修改及可以直接运行各行情服务。

### ctp交易

假设配置simnow的帐，复制配置文件样例 etc/td_ctp.conf.sample，命名为 etc/td_simnow.conf。修改文件里的broker, account, password.

```json
		"account_id": "simnow",
		"broker"	: "SimNow仿真第一套",
		"account"	: "000000",
		"password"	: "000000"
```

### etc/ctp_brokers.conf
 包含各期货公司的服务器配置信息，如果服务器不对或者缺少自己的期货公司，请自行添加。

## 运行

### 行情服务

在 d:\tquant\tqlocal\bin目录依次运行 fh_ctp, fh_tdx, fh_sina, tk_recv，如果需要转发行情，可以运行 fh_relay。

### 交易服务

在 d:\tquant\tqlocal\bin目录运行td_ctp，使用参数 "-f 配置文件".

```dos
d:\tquant\tqlocal\bin\td_ctp -f ..\etc\td_simnow.conf
```

## tqc

- [tqc安装和配置](/docs/manual/tqc)
