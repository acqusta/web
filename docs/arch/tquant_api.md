---
category: TQuant
order: 8
title: TQuantApi
---

TQuantApi是TQuant的的标准API，包含行情和交易接口。支持C++, Pyhon, Java, Scala, JavaScript等编程语言。支持 Windows, Linux, OSX三种平台，在Mac上也可以进行交易和研究。

源码开发在github上。[github源码](https://github.com/acqusta/tqapi)

## 行情接口

| 函数            | 功能                |
| ------------- | ----------------- |
| quote()       | 取最新行情             |
| bar()         | 取分钟K线，支持实时和历史K线 |
| daily_bar(）  | 取日线 |
| tick()        | 取tick数据，支持实时和历史数据 |
| subscribe()   | 订阅行情              |
| unsubscribe() | 取消订阅              |
| callback      | 回调通知 |

## 交易接口

| 函数                | 功能                |
| ----------------- | ----------------- |
| query_balance()   | 取资金信息             |
| query_orders()    | 取当日订单列表           |
| query_trades()    | 取当日成交列表           |
| query_positions() | 取当日持仓             |
| place_order()     | 下单                |
| cancel_order()    | 取消订单              |
| query()           | 通用查询接口，可以查询代码表等信息 |
| callback          | 回调函数 |

