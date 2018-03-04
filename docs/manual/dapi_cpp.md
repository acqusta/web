---
category: 参考手册
order: 12
title: DataApi-C++
---

DataApi的C++版本是其他语言版本的基础，Python和Java都是对其进行封装使用。接口和数据结构和其他语言基本一致。建议先看下python版本的文档。这里描述C++版本使用上的注意点。

## 编译

DataApi不提供C++版本的预编译库。请从github上下载最新源码，自行编译使用。

ubuntu 16.04编译过程

安装cmake, git

```shell
# apt-get install cmake git

```
下载代码编译
```
# git clone https://github.com/acqusta/tqapi.git
# cd tqapi
# mkdir build
# cd build
# cmake .. -DCMAKE_BUILD_TYPE=Release
# make install
```

## 初始化

```cpp

#include "tquant_api.h"

TQuantApi* api = TQuantApi::create("ipc://tqc_10001");
DataApi* dapi = api->data_api()
```

## 返回值处理方法

每个方法的返回值类型是CallResult<T_VALUE>。其中值是智能指针，可以重复使用，避免传递过程中内存复制。

例子:

```cpp

CallResult<MarketQuote> r = dapi.getQuote("000001.SH", "")
if (r.value) {
    // Success
    print(r.value)
} else {
    System.out.println("getQuote error: " + r.msg);
}

```
## 回调方法

```cpp
class MyCallback : public DataApi_Callback {
public:
    virtual void on_market_quote(shared_ptr<MarketQuote> q) override
    {
        cout << "onQuote: " << q->code << "," << q->date << "," << q->time << ","
             << q->open << "," << q->high << "," << q->low << "," << q->close << ","
             << q->volume << "," << q->turnover << "," << q->oi << endl;
    }

    virtual void on_bar(const char* cycle, shared_ptr<Bar> bar) override
    {
        cout << "on_bar: " << cycle<< "," << bar->code << "," << bar->date << "," << bar->time << ","
            << bar->open << "," << bar->high << "," << bar->low << "," << bar->close << ","
            << bar->volume << "," << bar->turnover << "," << bar->oi << endl;
    }
};

MyCallback callback;

dapi.setCallback(&callback);

```

## TickDataHolder

在tqc内部，code使用的C语言风格的字符串，没有使用C++的string。这种结构效率高但是不方便传值使用，在客户端这边使用TickDataHolder模板保存code字符串，这样可以方便使用。

## 接口原型

```cpp
namespace tquant {  namespace api {

    using namespace std;

    template<typename T>
    class TickDataHolder : public T {
        string _code;
    public:
        TickDataHolder(const T& t, const char* a_code) : T(t), _code(a_code) {
            this->code = _code.c_str();
        }

        TickDataHolder(const TickDataHolder<T>& t) {
            *this = t;
            if (t.code){
                this->_code = t.code;
                this->code = this->_code.c_str();
            }
        }
    };

#pragma pack(1)
    // keep same with tk_schema!
    struct RawMarketQuote{
        const char*     code;
#if defined(WIN32) && !defined(_WIN64)
        int32_t         _padding_1;
#endif
        int32_t         date;
        int32_t         time;
        int64_t         recv_time;
        int32_t         trading_day;
        double          open;
        double          high;
        double          low;
        double          close;
        double          last;
        double          high_limit;
        double          low_limit;
        double          pre_close;
        int64_t         volume;
        double          turnover;
        double          ask1;
        double          ask2;
        double          ask3;
        double          ask4;
        double          ask5;
        double          bid1;
        double          bid2;
        double          bid3;
        double          bid4;
        double          bid5;
        int64_t         ask_vol1;
        int64_t         ask_vol2;
        int64_t         ask_vol3;
        int64_t         ask_vol4;
        int64_t         ask_vol5;
        int64_t         bid_vol1;
        int64_t         bid_vol2;
        int64_t         bid_vol3;
        int64_t         bid_vol4;
        int64_t         bid_vol5;
        double          settle;
        double          pre_settle;
        int64_t         oi;
        int64_t         pre_oi;
    };

    typedef TickDataHolder<RawMarketQuote> MarketQuote;

    struct RawBar {
        const char*     code;
#if defined(WIN32) && !defined(_WIN64)
        int32_t         _padding_1;
#endif
        int32_t         date;
        int32_t         time;
        int32_t         trading_day;
        double          open;
        double          high;
        double          low;
        double          close;
        int64_t         volume;
        double          turnover;
        int64_t         oi;
    };

    typedef TickDataHolder<RawBar> Bar;

    struct RawDailyBar {
        const char*     code;
#if defined(WIN32) && !defined(_WIN64)
        int32_t         _padding_1;
#endif
        int32_t         date;
        double          open;
        double          high;
        double          low;
        double          close;
        int64_t         volume;
        double          turnover;
        int64_t         oi;
        double          settle;
        double          pre_close;
        double          pre_settle;
        double          _padding;
    };

    typedef TickDataHolder<RawDailyBar> DailyBar;

#pragma pack()

    class DataApi {
    protected:
        virtual ~DataApi() {}
    public:
        /**
        * 取某交易日的某个代码的 ticks
        *
        * 当tradingday为0，表示当前交易日
        *
        * @param code
        * @param trading_day
        * @return
        */
        virtual CallResult<vector<MarketQuote>> tick(const char* code, int trading_day) = 0;

        /**
        * 取某个代码的Bar
        *
        * 目前只支持分钟线
        *  当 cycle == "1m"时，返回trading_day的分钟线，trading_day=0表示当前交易日。
        *
        * @param code          证券代码
        * @param cycle         "1m""
        * @param trading_day   交易日
        * @param align         是否对齐
        * @return
        */
        virtual CallResult<vector<Bar>> bar(const char* code, const char* cycle, int trading_day, bool align) = 0;

        /**
        * 取某个代码的日线
        *
        *
        * @param code          证券代码
        * @param price_adj     价格复权，取值
        *                        back -- 后复权
        *                        forward -- 前复权
        * @param align         是否对齐
        * @return
        */
        virtual CallResult<vector<DailyBar>> daily_bar(const char* code, const char* price_adj, bool align) = 0;

        /**
        * 取当前的行情快照
        *
        * @param code
        * @return
        */
        virtual CallResult<MarketQuote> quote(const char* code) = 0;

        /**
        * 订阅行情
        *
        * codes为新增的订阅列表，返回所有已经订阅的代码,包括新增的列表。如果codes为空，可以返回已订阅列表。
        *
        * @param codes
        * @return 所有已经订阅的代码
        */
        virtual CallResult<vector<string>> subscribe(const vector<string>& codes) = 0;

        /**
        * 取消订阅
        *
        * codes为需要取消的列表，返回所有还在订阅的代码。
        * 如果需要取消所有订阅，先通过 subscribe 得到所有列表，然后使用unscribe取消

        * @param codes
        * @return
        */
        virtual CallResult<vector<string>> unsubscribe(const vector<string>& codes) = 0;

        /**
        * 设置推送行情的回调函数
        *
        * 当订阅的代码列表中有新的行情，会通过该callback通知用户。
        *
        * @param callback
        */
        virtual void set_callback(DataApi_Callback* callback) = 0;
    };

} }

```