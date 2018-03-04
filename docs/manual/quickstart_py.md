---
category: 教程
order: 5
title: 快速入门-Python
------

本教程示范如何使用Python取行情和交易。

## 安装TQuantApi的Python库

先使用pip安装TQuanApi。TQuantApi依赖pandas，如果没有安装，请一并安装。

```shell
$ pip install tquant pandas
```

也可以从github上下载代码，自己编译安装。

```
$ python setup.py install
```

注意：

1. 为了提高性能，TQuantApi使用了C++扩展库。在Windows上编译需要安装Visual C++等编译工具，因此不建议Windows用户直接从源码安装。
1. TQuantApi目前只支持Python2.7。如果必须要使用Python3，请耐心等待新版本。

## 初始化
1. 引入tquant的package。
1. 创建TQuantApi实例tqapi。
1. 从tqapi中得到data_api和trade_api。

```python
import tquant as tq

tqapi = tq.TQuantApi('ipc://tqc_10001')
dapi = tqapi.data_api()
tapi = tqapi.trade_api()
```

tq.TQuantApi的第一个参数是服务器的地址，ipc://tqc_10001表示使用本机的IPC服务。如果想使用TCP服务的话，使用参数 tcp://127.0.0.1:10001。

> IPC通信比TCP快，在行情推送上有优势，缺点是只能在本机使用。

## 函数返回值

TQuantApi的函数都返回两个值，第一个值是函数执行成功的结果，第二个参数是执行失败的错误消息。通过判断第一个值是否为None可以知道是否成功。

```
ret_val, err_msg = api.func(...)
if ret_val is not None:
    # sucess
    do something
else:
    # error
    print err_msg
```

> 通过观察发现，策略研究员编写策略时经常不处理异常，如认为取行情函数肯定会返回行情、下单一定成功。
> 返回两个值可以提醒序员要处理错误，养成好的编程习惯。

## 取行情前先订阅代码

第一次使用行情前，记得先订阅，否则会因为tqc没有行情报错。代码格式如000001.SH, 000001.SZ, IF1801.CFE等。如果订阅成功，返回所有订阅的列表


> "交易代码 + '.' + 市场代码"格式可以多市场统一编码。


```python
r, msg = dapi.subscribe('600000.SH')
print "msg:", msg
print r
```
执行结果

    msg: None
    600000.SH

使用','连接多个代码，可以一次订阅多个代码。

```python
r, msg = dapi.subscribe('000001.SH,600000.SH')
print "msg:", msg
print r
```
执行结果

    msg: None
    000001.SH,600000.SH

可以通过空字符串参数查询当前订阅的代码列表。

```python
r, msg = dapi.subscribe('')
print "msg:", msg
print r
```
执行结果

    msg: None
    000001.SH,600000.SH

## 从本地缓存中取快照

dapi.quote从tqc的缓存中直接取行情，如果缓存中没有，则会返回错误"no data"。取行情函数的执行速度极快，在20微妙左右。

```python
q, msg = dapi.quote('000001.SH')
print "msg", msg
q
```

    msg None

    {'ask1': 3962.2,
     'ask2': 0.0,
     'ask3': 0.0,
     'ask4': 0.0,
     'ask5': 0.0,
     'ask_vol1': 1L,
     'ask_vol2': 0L,
     'ask_vol3': 0L,
     'ask_vol4': 0L,
     'ask_vol5': 0L,
     'bid1': 3960.0,
     'bid2': 0.0,
     'bid3': 0.0,
     'bid4': 0.0,
     'bid5': 0.0,
     'bid_vol1': 1L,
     'bid_vol2': 0L,
     'bid_vol3': 0L,
     'bid_vol4': 0L,
     'bid_vol5': 0L,
     'close': 3959.0,
     'code': 'IF1802.CFE',
     'date': 20180214L,
     'high': 3967.8,
     'high_limit': 4315.6,
     'last': 3959.0,
     'low': 3922.0,
     'low_limit': 3531.2,
     'oi': 5355L,
     'open': 3938.2,
     'pre_close': 3920.6,
     'pre_oi': 9339L,
     'pre_settle': 3923.4,
     'recv_time': 1518592961064737L,
     'settle': 3959.0,
     'time': 152239700L,
     'trading_day': 20180214L,
     'turnover': 7735012560.0,
     'volume': 6544L}

### 缓存还包括分钟线、tick

tqc向云服务或本地行情服务订阅了行情后，在开盘期间会不停收到快照。tqc会缓存在内存数据库中。如果盘中订阅行情，会把云服务器上的分钟线和tick完整的抓取下来存在缓存中，实现快速取行情数据。收盘后，缓存中的数据一直有效，直到交易日切换后清盘。

### 有可能就是没有行情！

- 在每天清盘到接收到第一笔行情之间会没有快照，其他时间都会取得最新（最后）的行情。
- 股票第一天停盘，交易所会推送一笔行情。停盘第二天起，将没有行情，直到复盘。


## 试下取分钟线

现在试试取分钟线函数dapi.bar。该函数返回DataFrame格式的数据，便于使用pandas处理。

```python
bars, msg = dapi.bar('000001.SH')
if bars is None:
    print "bar error", msg

bars[['date','time','code','open','high','low','close','turnover','volume']].head(5)
```

画下分钟线看是否正确


```python
%matplotlib inline
bars.plot(y=['close'],figsize=(15,4))
```

观察下时间戳，bar的时间戳是取某分钟结束的最后时刻，如9:30:00~9:31:00的分钟线时间戳是93100000。如果某个分钟没有成交，把上分钟的结束价格填入到该分钟的高开低收价格中。

该函数还可以用来取历史数据。

```python
bars, msg = dapi.bar('600000.SH', trading_day=20180214)
if bars is None:
    print "bar error", msg

bars[['date','time','code','open','high','low','close','turnover','volume']].head(5)
```

## 体验快速取tick

本方法是tquant的特色函数之一，从tqc的内存数据库中可以快速取实盘完整tick。如果你的算法使用tick计算策略因子，在开盘后启动或者程序重启，可以快速地获取完整tick重新计算。通过trading_day参数可以取历史数。

```python
ticks, msg = dapi.tick('600000.SH',trading_day=20180213)
print msg
ticks.head(5)
```

测试下速度

```python
import time
begin_time = time.time()
ticks, msg = dapi.tick('600000.SH',trading_day=20180213)
print "time       :", time.time() - begin_time
print "total ticks:",len(ticks)
ticks.head(5)
```

    time       : 0.0338218212128
    total ticks: 5661

使用专业版，用时还可以减半哦！

## 检查交易帐号是否连接正常

请先通过tqc设置交易帐号，设置方法参考《[tqc安装和配置](docs/manual/tqc)》。帐号状态中status等于"Connected"，表示连接正常，可以进行交易。

> TQuantApi的字符串都是utf8编码，因此这里broker可能不能显示中文。


```python
r, msg = tapi.account_status()
print msg
r
```

    None

    [{'account': '123456',
      'account_id': 'stk',
      'account_type': '',
      'broker': '某证券公司',
      'msg': '',
      'status': 'Connected'}]

## 查下资金

enable_balance是当前可用余额。

```python
bal, msg = tapi.query_balance('stk')
print msg
bal
```

    None

    {'account_id': 'glsc',
     'close_pnl': 0.0,
     'enable_balance': 57588.93,
     'float_pnl': 0.0,
     'fund_account': '',
     'init_balance': 0.0,
     'margin': 0.0}



## 查下持仓

current_size是当前数量，enable_size是可以交易数量。对于T+1的股票，enable_size对应于当前持仓中昨持仓。请注意，数量的单位是股，不是手。


```python
pos, msg = tapi.query_positions('stk')
print msg
pos
```

    None



## 下个订单试试

下单的参数包括account_id, code, size, price和action。size的单位是股，价格是元。

如果下单成功，返回委托号(entrust_no)或者自定义的订单编号(order_id)。对于股票交易，通常直接返回委托号。对于期货交易，由于下单的过程是异步的，会返回订单编号。详细说明请参考[《TradeApi-Python》](docs/manual/tapi_py#下单)。

action把股票和期货交易的操作结合统一，含义如下：

| Action | 股票 | 期货 |
|--------|-----|------|
| Buy | 买 | 买入开多仓 |
| Short | - | 卖出开空仓 |
| Cover | - | 买入平空仓 |
| Sell | 卖 | 卖出平多仓 |

其中 Cover, Sell又支持Tody和Yesterday组合，即 CoverToday,CoverYesterday,SellToday,SellYesterday。

这里用上证综指作为测试代码下单，用作测试。如果要测试实盘交易功能，请自行修改代码、价格和数量。


```python
r, msg = tapi.place_order('stk','000001.SH', size=100, price=100,action='Buy')
print "msg: ", msg
print r
```

    msg:  -1,(-51)[101015][证券代码表记录不存在]
    [exchange_type=1,stock_code=000001]

    None


## 查询刚才下的订单
如果刚才下单成功，query_orders的返回的订单列表中可以通过委托号或者订单编号查到。

```python
orders, msg = tapi.query_orders('glsc')
print msg
orders
```

    None


## 试下撤单功能

没有结束的订单可以通过cancel_order撤销。可以通过委托号和订单编号撤单，这里以委托号为例。


```python
r, msg = tapi.cancel_order('stk', '000001.SH', entrust_no='100000')
print msg
r
```

    -1,(-53)[250001][订单表记录不存在]
    [entrust_no=100000,branch_no_t=20,init_date=20180222,fund_account=20224069]


