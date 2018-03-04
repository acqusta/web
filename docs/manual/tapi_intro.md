---
category: 参考手册
order: 30
title: TradeApi-概述
---

TradeApi是TQuant平台的核心接口之一，设计目的是对常见的期货和股票交易接口进行封装。

## TradeApi 方法列表

| 函数           | 功能              |
| ------------- | ----------------- |
| query_account_status()  | 查询帐号连接情况 |
| query_balance()         | 查询资金使用情况 |
| query_positions(）      | 查询持仓 |
| query_orders()          | 查询订单 |
| query_trades()          | 查询成交 |
| place_order()           | 下单 |
| cancel_order()          | 取消订单 |
| query()                 | 通用查询接口 |


## 通用数据类型

参考DataApi。

## 帐号状态

```c++
    struct AccountInfo {
        string account_id;       // 帐号编号
        string broker;           // 交易商名称，如招商证券
        string account;          // 交易帐号
        string status;           // 连接状态，取值 Disconnected, Connected, Connecting
        string msg;              // 状态信息，如登录失败原因
        string account_type;     // 帐号类型，如 stock, ctp
    };
```

## 资金情况

```c++
    struct Balance {
        string account_id;       // 帐号编号
        string fund_account;     // 资金帐号
        double init_balance;     // 初始化资金
        double enable_balance;   // 可用资金
        double margin;           // 保证金
        double float_pnl;        // 浮动盈亏
        double close_pnl;        // 实现盈亏
    };
```

## 订单状态

| 值 | 含义 |
| -- | -- |
| "New" | 新提交的订单，到达柜台或者自己的系统，还没有进入交易所 |
| "Accepted" | 被交易所接收，在撮合交易中 |
| "Filled" | 全部成交 |
| "Rejected" | 被交易所拒绝 |
| "Cancelled" | 自己撤单 |

订单状态中没有部分成交状态，部分成交应该是Accepted同时fill_size大于0并且不等于entrust_size。

订单在 "Filled", "Rejected"和"Cancelled"状态中表示订单已经结束。

## 委托动作

| Action | 股票 | 期货 |
|--------|-----|------|
| Buy | 买 | 买入开多仓 |
| Short | - | 卖出开空仓 |
| Cover | - | 买入平空仓 |
| Sell | 卖 | 卖出平多仓 |
| CoverToday | - | 买入平今空仓 |
| CoverYesterday | - | 买入平昨空仓 |
| SellToday | - | 卖出平今多仓 |
| SellYesterday | - | 卖出平昨多仓 |

期货交易中，只有上期所区分平今和平昨。其他交易所中只有平仓指令(Cover和Sell),并且优先平今。

## 订单

```c++
    struct Order {
        string  account_id;       // 帐号编号
        string  code;             // 证券代码
        string  name;             // 证券名称
        string  entrust_no;       // 委托编号
        string  entrust_action;   // 委托动作
        double  entrust_price;    // 委托价格
        int64_t entrust_size;     // 委托数量，单位：股
        int32_t entrust_date;     // 委托日期
        int32_t entrust_time;     // 委托时间
        double  fill_price;       // 成交价格
        int64_t fill_size;        // 成交数量
        string  status;           // 订单状态：取值: OrderStatus
        string  status_msg;       // 状态消息
        int32_t order_id;         // 自定义订单编号
    };
```
字段说明

1. entrust_no是唯一编号。每个交易所的内部的编号唯一，但是跨市场不一定唯一，因此entrust_no由市场代码+交易所的维护编号组成，达到唯一效果。
1. 不一定有fill_price。ctp期货交易没有，股票有。可以通过用每个成交的成交价加权计算而得。
1. status_msg是柜台返回的状态说明，比如拒单原因，也不一定有。
1. entrust_size 是股，不是手

## 成交

```c++
    struct Trade {
        string  account_id;       // 帐号编号
        string  code;             // 证券代码
        string  name;             // 证券名称
        string  entrust_no;       // 委托编号
        string  entrust_action;   // 委托动作
        string  fill_no;          // 成交编号
        int64_t fill_size;        // 成交数量
        double  fill_price;       // 成交价格
        int32_t fill_date;        // 成交日期
        int32_t fill_time;        // 成交时间
    };
```

一个订单对于一个或多个成交。和委托编号一样，不同的交易所的成交编号可能重复！

## 持仓

```
    struct Position {
        string  account_id;       // 帐号编号
        string  code;             // 证券代码
        string  name;             // 证券名称
        int64_t current_size;     // 当前持仓
        int64_t enable_size;      // 可用（可交易）持仓
        int64_t init_size;        // 初始持仓
        int64_t today_size;       // 今日持仓
        int64_t frozen_size;      // 冻结持仓
        string  side;             // 持仓方向，股票的持仓方向为 Long, 期货分 Long, Short
        double  cost;             // 成本
        double  cost_price;       // 成本价格
        double  last_price;       // 最新价格
        double  float_pnl;        // 持仓盈亏
        double  close_pnl;        // 平仓盈亏
        double  margin;           // 保证金
        double  commission;       // 手续费
    };
```
字段说明：

1. Side取值是 "Long" 和 "Short"，股票只有"Long"。
1. 对于T+1的股票，enable_size指昨仓。T+0的股票和期货 enable_size==current_size。
1. current_size中包含昨仓和今仓。today_size是今仓。
1. 并不是每个字段都有值，取决于使用的交易接口。
