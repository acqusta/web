---
category: 参考手册
order: 10
title: DataApi-概述
---

DataApi是TQuant的核心接口之一。它包括行情查询、订阅和推送接口。支持C++、Python、Java/Scala和JavaScript。

DataApi具有如下特点：

- 同时支持股票和期货行情。
- 支持快照、分钟线、日线、tick数据。
- 支持实时行情订阅和推送。

目前TQuant不支持参考数据服务，因此DataApi没有相关的函数。

## DataApi 方法列表

| 函数           | 功能              |
| ------------- | ----------------- |
| quote()       | 取最新行情             |
| bar()         | 取分钟K线，支持实时和历史K线 |
| daily_bar(）  | 取日线 |
| tick()        | 取tick数据，支持实时和历史数据 |
| subscribe()   | 订阅行情 |
| unsubscribe() | 取消订阅 |
| callback      | 回调通知 |

每种语言的函数基本一致，数据结构一样。

## 通用数据类型

| 字段 | 类型 |格式 |
| ---- | ---- | --- |
| code | string | 股票代码的统一编码，按照WindCode格式编码，即：代码 + '.' + 交易所编号。例子： 000001.SH，IF1801.CFE。|
| 日期 date | int32 | 格式:yyymmdd 如 20170913 |
| 时间 time | int32 | 精度到毫秒, 格式 hhmmssSSS 例子：214901000 表示 21:49:01.000 |
| 价格 price | double | 单位：元 |
| 成交量 volume | int64 | 单位：股 |

交易所编号：
- SH 上交所
- SZ 深交所
- SHF 上期所
- DCE 大商所
- CFE 中金所
- CZC 郑商所

## 行情快照结构

快照结构适用于股票和期货。如果某个字段值为0(或0.0)，表示该字段没有值。目前只支持股票5档行情。

> recv_time是FeedHandler的接收时间，可以用来测试系统内部延时。


```cpp
struct MarketQuote {
    const char*     code;       // 代码
    int32_t         date;       // 产生的日期
    int32_t         time;       // 产生的时间
    int64_t         recv_time;  // 接收时间
    int32_t         trading_day; // 交易日
    double          open;       // 开盘价
    double          high;       // 最高价
    double          low;        // 最低价
    double          close;      // 收盘价
    double          last;       // 最新价
    double          high_limit; // 涨停价
    double          low_limit;  // 跌停价
    double          pre_close;  // 昨收价
    int64_t         volume;     // 成交量
    double          turnover;   // 成交额
    double          ask1;       // 卖一价
    double          ask2;
    double          ask3;
    double          ask4;
    double          ask5;
    double          bid1;       // 买一价
    double          bid2;
    double          bid3;
    double          bid4;
    double          bid5;
    int64_t         ask_vol1;   // 卖一量
    int64_t         ask_vol2;
    int64_t         ask_vol3;
    int64_t         ask_vol4;
    int64_t         ask_vol5;
    int64_t         bid_vol1;   // 买一量
    int64_t         bid_vol2;
    int64_t         bid_vol3;
    int64_t         bid_vol4;
    int64_t         bid_vol5;
    double          settle;     // 结算价
    double          pre_settle; // 昨结算价
    int64_t         oi;         // 持仓
    int64_t         pre_oi;     // 昨持仓
};
```

## Bar结构

Bar 是分钟线或其他周期的数据线。

分钟线生成规则:

- 每个bar的时间规则为该Bar结束后的时间，如 9:30:00 ~ 9:31:00)的分钟线的time时间值为 93100000。
- 如果某周期内没有成交，该bar的open、high、low、close取值为上个周期的close。volume和turnover取值为0.
- oi不是该周期内的持仓量变化。而是结束时的持仓量。

```cpp
struct Bar {
    const char*     code;         // 代码
    int32_t         date;         // 日期
    int32_t         time;         // 时间
    int32_t         trading_day;  // 交易日
    double          open;         // 该周期内第一笔成交价
    double          high;         // 该周期内最高价
    double          low;          // 该周期内最低价
    double          close;        // 该周期内收盘价
    int64_t         volume;       // 该周期内成交量
    double          turnover;     // 该周期内成交额
    int64_t         oi;           // 该周期结束时的持仓量
};
```


## DailyBar结构

DailyBar比Bar多结算价、昨收和昨结。

```cpp
struct Bar {
    const char*     code;         // 代码
    int32_t         date;         // 日期
    double          open;         // 开盘价
    double          high;         // 最高价
    double          low;          // 最低价
    double          close;        // 收盘价
    int64_t         volume;       // 成交量
    double          turnover;     // 成交额
    int64_t         oi;           // 持仓量
    double          settle;       // 结算价
    double          pre_close;    // 昨收价
    double          pre_settle;   // 昨结价
};
```