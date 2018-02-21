---
category: 参考手册
order: 33
title: TradeApi-C++
---

TradeApi的C++版本和Python版本接口类似，使用上的注意点请参考[DataApi的C++版本](docs/manual/dapi_cpp)的注意点。


```cpp
namespace tquant {  namespace api {
    // TradeApi
    struct AccountInfo {
        string account_id;       // 帐号编号
        string broker;           // 交易商名称，如招商证券
        string account;          // 交易帐号
        string status;           // 连接状态，取值 Disconnected, Connected, Connecting
        string msg;              // 状态信息，如登录失败原因
        string account_type;     // 帐号类型，如 stock, ctp
    };

    struct Balance {
        string account_id;       // 帐号编号
        string fund_account;     // 资金帐号
        double init_balance;     // 初始化资金
        double enable_balance;   // 可用资金
        double margin;           // 保证金
        double float_pnl;        // 浮动盈亏
        double close_pnl;        // 实现盈亏

        Balance() : init_balance(0.0), enable_balance(0.0), margin(0.0)
            , float_pnl(0.0), close_pnl(0.0)
        {}
    };

    //struct OrderStatus {
#define OS_New        "New"
#define OS_Accepted   "Accepted"
#define OS_Filled     "Filled"
#define OS_Rejected   "Rejected"
#define OS_Cancelled  "Cancelled"
    //}

    //class EntrustAction {
#define EA_Buy             "Buy"
#define EA_Short           "Sell"
#define EA_Cover           "Cover"
#define EA_Sell            "Sell"
#define EA_CoverToday      "CoverToday"
#define EA_CoverYesterday  "CoverYesterday"
#define EA_SellToday       "SellToday"
#define EA_SellYesterday   "SellYesterday"
    //}

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

        Order()
            : entrust_price(0.0), entrust_size(0), entrust_date(0), entrust_time(0)
            , fill_price(0.0), fill_size(0), order_id(0)
        {}
    };

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

        Trade() : fill_size(0), fill_price(0.0), fill_date(0), fill_time(0)
        {}
    };

    // Side {
#define SD_Long "Long"
#define D_Short "Short"
    //}

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

        Position()
            : current_size(0), enable_size(0), init_size(0), today_size(0), frozen_size(0)
            , cost(0.0), cost_price(0.0), last_price(0.0), float_pnl(0.0), close_pnl(0.0)
            , margin(0.0), commission(0.0)
        {
        }
    };

    struct OrderID {
        string  entrust_no;       // 订单委托号
        int32_t order_id;         // 自定义编号
    };

    class TradeApi_Callback{
    public:
        virtual void on_order_status  (shared_ptr<Order> order) = 0;
        virtual void on_order_trade   (shared_ptr<Trade> trade) = 0;
        virtual void on_account_status(shared_ptr<AccountInfo> account) = 0;
    };

    class TradeApi {
    protected:
        virtual ~TradeApi() {}
    public:
        TradeApi() { }

        /**
        * 查询帐号连接状态。
        *
        * @return
        */
        virtual CallResult<vector<AccountInfo>> query_account_status() = 0;

        /**
        * 查询某个帐号的资金使用情况
        *
        * @param account_id
        * @return
        */
        virtual CallResult<Balance> query_balance(const char* account_id) = 0;

        /**
        * 查询某个帐号的当天的订单
        *
        * @param account_id
        * @return
        */
        virtual CallResult<vector<Order>> query_orders(const char* account_id) = 0;

        /**
        * 查询某个帐号的当天的成交
        *
        * @param account_id
        * @return
        */
        virtual CallResult<vector<Trade>> query_trades(const char* account_id) = 0;

        /**
        * 查询某个帐号的当天的持仓
        *
        * @param account_id
        * @return
        */
        virtual CallResult<vector<Position>> query_positions(const char* account_id) = 0;

        /**
        * 下单
        *
        * 股票通道为同步下单模式，即必须下单成功必须返回委托号 entrust_no。
        *
        * CTP交易通道为异步下单模式，下单后立即返回自定义编号order_id。当交易所接受订单，生成委托号好，通过 Callback.on_order_status通知
        * 用户。用户可以通过order_id匹配。如果订单没有被接收，on_order_status回调函数中entrust_no为空，状态为Rejected。
        * 当参数order_id不为0，表示用户自己对订单编号，这时用户必须保证编号的唯一性。如果交易通道不支持order_id，该函数返回错误代码。
        *
        * @param account_id    帐号编号
        * @param code          证券代码
        * @param price         委托价格
        * @param size          委托数量
        * @param action        委托动作
        * @param order_id      自定义订单编号，不为0表示有值
        * @return OrderID      订单ID
        */
        virtual CallResult<OrderID> place_order(const char* account_id, const char* code, double price, int64_t size, const char* action, int order_id) = 0;

        /**
        * 根据订单号撤单
        *
        * security 不能为空
        *
        * @param account_id    帐号编号
        * @param code          证券代码
        * @param order_id      订单号
        * @return 是否成功
        */
        virtual CallResult<bool> cancel_order(const char* account_id, const char* code, int order_id) = 0;

        /**
        * 根据委托号撤单
        *
        * security 不能为空
        *
        * @param account_id    帐号编号
        * @param code          证券代码
        * @param entrust_no    委托编号
        * @return 是否成功
        */
        virtual CallResult<bool> cancel_order(const char* account_id, const char* code, const char* entrust_no) = 0;

        /**
        * 通用查询接口
        *
        * 用于查询交易通道特有的信息。如查询 CTP的代码表 command="ctp_codetable".
        * 返回字符串。
        *
        * @param account_id
        * @param command
        * @param params
        * @return
        */
        virtual CallResult<string> query(const char* account_id, const char* command, const char* params) = 0;
        /**
        * 设置 TradeApi.Callback
        *
        * @param callback
        */
        virtual void set_callback(TradeApi_Callback* callback) = 0;
    };
} }
```
