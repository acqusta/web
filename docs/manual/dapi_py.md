---
category: 参考手册
order: 11
title: DataApi-Python
---

DataApi是个抽象的接口，用户需要从其他的接口中得到DataApi的实例。在不同的系统中，如回测平台、策略平台等，有不同的实现和创建方法，但是接口都会保持一致，方便用户平滑切换系统。


## TQuantApi创建DataApi

```Python
class TQuantApi:
    def __init__(self, addr): pass
    def data_api(source=None): pass
    def trade_api() : pass
```

通过data_api()的参数source可以选择使用云服务还是本地服务，缺省为云服务。

source 取值

- remote 云服务
- local  本地服务

例子：
```Python
import tquant as tq

tqapi = tq.TQuantApi('ipc://tqc_10001')
dapi_remote = tqapi.data_api()
dapi_remote2 = tqapi.data_api('remote')
dapi_local = tqapi.data_api('local')

```

注意：

1. 不管remote还是local，都是优先取本地的历史数据。当source是remote时，如果本地没有，则会从服务器上下载。
1. 由于智能合并算法，实盘quote行情是local和remote的合并行情，因此两种模式下quote函数和推送行情是一样的。
1. 实盘的分钟线、tick数据是区分 local 和 remote的。

## 接口原型

```python

class DataApi:
    def set_on_quote(self, func): pass
    def set_on_bar(self, func): pass
    def subscribe(self, codes) : pass
    def unsubscribe(self, codes): pass
    def quote(self, code): pass
    def bar(self, code, cycle="1m", trading_day=0, align=True): pass
    def daily_bar(self, code, price_adj="", align=True): pass
    def tick(self, code, trading_day=0): pass
```

## 取快照

```Python
def quote(self, code): pass
```

参数
- code    代码，只支持一个代码，例子: '000001.SH'。

返回值
- quote   dict类型, 字段参考 [《DataApi概述》](docs/manual/dapi_intro)。
- err_msg 错误原因，当 quote is None时有意义。

取当前交易日的最新快照。如果交易日切换后，没有收到行情，返回None, 错误原因为"no data"。

例子

```Python
q, msg = dapi.bar('000001.SH')
```

> DataApi中没有字段标志是否停盘，可以通过以下几种方法粗略判断。
>
> 1. 没有收到行情
> 1. 行情的时间一直停留在开盘前
> 1. 买、卖价和量为0，盘中停盘

## 取日内K线（bar）

```Python
def bar(self, code, cycle="1m", trading_day=0, align=True): pass
```

参数
- code    代码，只支持一个代码，字符串类型。例子: '000001.SH'。
- cycle   周期，字符串类型，目前只支持 1m - 1分钟线，计划支持15s, 30s等。
- trading_day 交易日，数字类型。当值是0时，表示当前交易日。例子：20180301。
- align   是否对齐，缺省对齐。

返回值
- bars   DataFrame类型, 字段参考 [《DataApi概述》](docs/manual/dapi_intro)。
- err_msg 错误原因，当 bars is None时有意义。

**对齐规则**

- 当align=False时，返回原始的bar数据，即直接由tick数据生成，只要有行情即生成bar，包括连续竞价、盘后时间等。
如果某段时间没有交易，则缺失该段时间的bar。
- 当align=True时，返回连续竞价期间的bar数据，如果某段时间没有交易，会用最近的交易价格补上。

**连续竞价时间**

| 品种 | 时间 |
| --- | ---- |
| 沪深股票、ETF | 9:30 ~ 11:30, 13:00 ~ 15:00 |
| 股指期货 | 9:30 ~ 11:30, 13:00 ~ 15:00 或者 9:15 ~ 11:30, 13:00 ~ 15:15 |
| 国债期货 | 9:15 ~ 11:30, 13:00 ~ 15:15 |
| 商品期货 | 21:00 ~ 02:00, 9:00 ~ 10:15 10:30~11:30, 13:30 ~ 15:00 |

注：

1. 股指期货的交易时间调整过，因此应在调整日期前返回老的，之后返回新的。目前还没有实现。
1. 商品期货的交易时间不一致，这里没有区分，返回统一的时间段。

## 取日线

```Python
def daily_bar(self, code, price_adj="", align=True): pass
```

参数
- code    代码，只支持一个代码，字符串类型。例子: '000001.SH'。
- price_adj 价格复权方式，缺省不复权，取值：
  - forward 前复权，最后一个价格不变。
  - back 后复权，第一个价格不变。
- align   是否对齐，缺省对齐。取值：
  - True  对齐，每个交易日都有一个bar，如果停盘，则以上个交易日的收盘价填充。
  - False 只有交易，才有bar。

返回值
- bars   DataFrame类型, 字段参考 [《DataApi概述》](docs/manual/dapi_intro)。
- err_msg 错误原因，当 bars is None时有意义。

> 除了OHLC字段外，DailyBar比Bar多前收、前结、结算价。


## 取tick

```Python
def tick(self, code, trading_day=0): pass
```

参数
- code    代码，只支持一个代码，字符串类型。例子: '000001.SH'。
- trading_day 交易日，数字类型。当值是0时，表示当前交易日。例子：20180301。

返回值
- ticks   DataFrame类型, 字段参考 [《DataApi概述》](docs/manual/dapi_intro)。
- err_msg 错误原因，当 ticks is None时有意义。

## 订阅行情

```Python
def subscribe(self, codes) : pass
```

参数
- codes    代码列表，支持字符串和数组两种格式。
  - 字符串类型，使用','隔开的多个代码，例子: '000001.SH,600000.SH'。
  - tuple或list  例子 ['000001.SH','600000.SH'] 或 ('000001.SH', '600000.SH')。

返回值
- codes 已经订阅的列表，用','隔开的字符串。
- err_msg 错误原因，当 codes is None时有意义。


本方法有两个功能：

1. 如果第一次订阅行情，向行情服务器（云服务或者本地行情服务器）订阅行情。
2. 向tqc服务注册推送服务。

使用时要注意，订阅服务器不检查代码是否合法，如果订阅 'abc.SH'也会成功！


## 取消订阅

```Python
def unsubscribe(self, codes): pass
```

参数
- codes    代码列表，支持字符串和数组两种格式。
  - 字符串类型，使用','隔开的多个代码，例子: '000001.SH,600000.SH'。
  - tuple或list  例子 ['000001.SH','600000.SH'] 或 ('000001.SH', '600000.SH')。

返回值
- codes 已经订阅的列表，用','隔开的字符串。
- err_msg 错误原因，当 codes is None时有意义。


和订阅方法类似，本方法也有两个功能：

1. 向行情服务器（云服务或者本地行情服务器）订阅行情。
2. 向行情服务器取消推送服务。

如果同时运行了多个客户端，某个客户端取消订阅会取消所有的客户端的订阅。建议只订阅不取消！

## 行情推送回调方法

```Python
def set_on_quote(self, func): pass
def set_on_bar(self, func): pass
```

推送数据包括快照和bar，要使用推送行情，可以设置行情推送回调函数，set_on_quote或set_on_bar。订阅行情后，
当服务器上接收到行情，会推送给客户端，回调函数会被调用。在回调函数中执行的时间要短，避免执行时间长的操作。

```Python

def on_quote(quote):
    print 'on_quote', quote

def on_bar(cycle, bar):
    print 'on_bar', cycle, bar

dapi.set_on_quote(on_quote)
dapi.set_on_bar(on_bar)

dapi.subscribe('000001.SH')

```