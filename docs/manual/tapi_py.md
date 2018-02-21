---
category: 参考手册
order: 31
title: TradeApi-Python
---

TradeApi是个抽象的接口，用户需要从其他的接口中得到DataApi的实例。在不同的系统中，如回测平台、策略平台等，有不同的实现和创建方法，但是接口都会保持一致，方便用户平滑切换系统。

如从TQuantApi中得到TradeApi实例：

```Python
import tquant as tq

tqapi = tq.TQuantApi('ipc://tqc_10001')
dapi = tqapi.data_api()
tapi = tqapi.trade_api()

```
## 接口原型
```Python
class TradeApi:
    def set_on_order_status(self, callback): pass
    def set_on_order_trade(self, callback): pass
    def set_on_account_status(self, callback): pass
    def account_status(self): pass
    def query_balance(self, account_id): pass
    def query_trades(self, account_id): pass
    def query_orders(self, account_id): pass
    def query_positions(self, account_id): pass
    def place_order(self, account_id, code, price, size, action, order_id=0): pass
    def cancel_order(self, account_id, code, entrust_no="", order_id=0): pass
    def query(self, account_id, command, params=""): pass
```
除了设置回调函数外，其他的函数都返回两个值。

## 查询交易帐号连接状态
```Python
def account_status(self): pass
```
参数
 - 无

返回值
 - accounts AccountInfo的数组
 - err_msg 错误原因，当 accounts is None时有意义。

该方法用于检查交易帐号连接状态，返回值是一个数组。

例子
```
In [8]: accounts, msg = tapi.account_status()
In [9]: accounts
Out[9]:
[{'account': '123456',
  'account_id': 'stk',
  'account_type': '',
  'broker': '证券公司',
  'msg': '',
  'status': 'Connected'}]
```

## 查询资金
```
def query_balance(self, account_id): pass
```
参数
- account_id 帐号编号

返回值
- balance dict类型，字段参考[《TradeApi概述》](docs/manual/tapi_intro)的Balance结构。
- err_msg 错误原因，当 balance is None时有意义。

例子
```
In [34]: bal, _ = tapi.query_balance('stk')
In [35]: bal
Out[35]:
{'account_id': 'stk',
 'close_pnl': 0.0,
 'enable_balance': 57588.93,
 'float_pnl': 0.0,
 'fund_account': '',
 'init_balance': 0.0,
 'margin': 0.0}
```

## 查询持仓
```
def query_positions(self, account_id): pass
```
参数
- account_id 帐号编号

返回值
- positions DataFrame类型，字段参考[《TradeApi概述》](docs/manual/tapi_intro)的Position结构。
- err_msg 错误原因，当 positions is None时有意义。

例子
```shell
In [37]: positions,_ = tapi.query_positions('stk')
In [38]: positions
Out[38]:
  account_id  close_pnl       code  commission  cost  cost_price  \
0        stk        0.0  518880.SH         0.0   0.0       2.755
1        stk        0.0  600410.SH         0.0   0.0      10.458
2        stk        0.0  600900.SH         0.0   0.0      15.287
3        stk        0.0  601018.SH         0.0   0.0       5.454
4        stk        0.0  131990.SZ         0.0   0.0       0.000
5        stk        0.0  150210.SZ         0.0   0.0       0.762

   current_size  enable_size  float_pnl  frozen_size  init_size  last_price  \
0          5100         5100    -129.19            0          0       2.730
1          1400         1400   -1717.57            0          0       9.230
2           900          900     631.95            0          0      15.990
3          2500         2500    -782.54            0          0       5.140
4             0            0       0.00            0          0     100.000
5         10000        10000    1490.50            0          0       0.911

   margin   name  side  today_size
0     0.0  黄金ETF  Long           0
1     0.0   华胜天成  Long           0
2     0.0   长江电力  Long           0
3     0.0    宁波港  Long           0
4     0.0    标准券  Long           0
5     0.0   国企改B  Long           0

```

## 查询订单
```
def query_orders(self, account_id): pass
```
参数
- account_id 帐号编号

返回值
- orders DataFrame类型，字段参考[《TradeApi概述》](docs/manual/tapi_intro)的Order结构。
- err_msg 错误原因，当 orders is None时有意义。

例子
```shell
In [37]: orders,_ = tapi.query_orders('stk')
In [38]: orders
Out[38]:

```

## 查询成交
```
def query_trades(self, account_id): pass
```
参数
- account_id 帐号编号

返回值
- trades DataFrame类型，字段参考[《TradeApi概述》](docs/manual/tapi_intro)的Order结构。
- err_msg 错误原因，当 trades is None时有意义。

例子
```shell
In [37]: trades,_ = tapi.query_trades('stk')
In [38]: trades
Out[38]:

```

## 下单
```
def place_order(self, account_id, code, price, size, action, order_id=0): pass
```
参数
- account_id 字符串类型，帐号编号。
- code 代码，字符串类型，例子: 000001.SH。
- price 委托价格，double类型，单位：元。
- size 委托数量，32位或64位整数类型，单位：股。
- action 委托动作，字符串，例子: "Buy"。
- order_id 自定义订单编号，32位整数。

返回值
- order_info dict类型，包括 entrust_no和order_id或者其中之一。
- err_msg 错误原因，当 order_info is None时有意义。

**同步下单接口**

在股票交易接口中，提交订单给柜台后需要同步等待柜台的处理结果，处理结果中包含委托编号，这是个同步过程，因此order_info中可以包含entrust_no。

**异步下单接口**

对于ctp这种异步的交易接口，发送订单给柜台后，无需同步等待，柜台会通过异步消息告诉客户端处理结果。异步消息中包含委托编号和订单编号。请求和响应通过订单编号关联。TradeApi的异步过程和ctp的异步过程一样。客户端给tquant提交了下单请求后，会立即得到tquant自己的订单编号(order_id)。然后在订单状态通知中通过order_id得到下单结果。
当参数order_id是0时，表示由tquant进行编号，否则由客户端编号，此时客户端需要自己保证订单帮的唯一性。通常用户不用自己进行编号。


## 撤单
```
def cancel_order(self, account_id, code, entrust_no="", order_id=0): pass
```
参数
- account_id 字符串类型，帐号编号，不为空。
- code 代码，字符串类型，不为空，例子: 000001.SH。
- entrust_no 委托编号，字符串类型。
- order_id 订单编号，整数类型。

返回值
- result boolean类型，成功或者失败。
- err_msg 当 result is None 或者 == False时，包含错误原因。

可以通过order_id或者entrust_no来撤单。

例子
```

```

## 通用查询接口
```
def query(self, account_id, command, params=""): pass
```
参数
- account_id 字符串类型，帐号编号，不为空。
- command 字符串类型，查询命令
- params 字符串类型，查询参数
返回值
- result 字符串
- err_msg 当 result is None时，包含错误原因。

通用查询接口用于实现不能标准化的查询指令。如查询ctp交易接口中的代码表。

例子
```
txt, msg = tapi.query('simnow','ctp_codetable')

```

## 回调通知
```
def set_on_order_status(self, callback): pass
def set_on_order_trade(self, callback): pass
def set_on_account_status(self, callback): pass
```

TradeApi提供三个回调通知，订单状态、成交回报和交易帐号状态变化通知。
三个回调函数的参数类型分别是 Order, Trade, 以及AccountStatus。字段定义见[《TradeApi概述》](docs/manual/tapi_intro)。

例子：
```
def on_order_status(order):
    print "on_order", order

def on_order_trade(trade):
    print "on_trade", trade

def on_account_status(account):
    print "on_account", account

tapi.set_on_order_status   (on_order_status)
tapi.set_on_order_trade    (on_order_trade)
tapi.set_on_account_status (on_account_status)
```