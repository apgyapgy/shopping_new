
        
## 用户下单优惠券显示 /api/coupon/ 已废弃
    1、请求参数
        | hostId             | string   |  not null  |终端号
        | goodsNo            | string   |  not null  |商品编号
        | openId             | string   |            |userId，收件宝app的userId或者wxopenid
        | src                | int      |  not null  |来源 0柜子二维码 1收件宝APP 2微信公众号
    2、返回字段 
        | couponNo           | string   |  not null  |优惠券编号
        | couponNm           | string   |  not null  |优惠券名称
        | couponDesc         | string   |  not null  |优惠券详细描述
        | couponLogo         | string   |  not null  |优惠券logo链接
        | couponAmt          | int      |  not null  |优惠券金额 分 500
        | couponAmtMin       | int      |  not null  |优惠券使用条件金额 分 1000
    
    3、返回
    {"code":200,
    "data":{"datas":[
        {"coupons":[
            {"couponAmt":500,"couponAmtMin":10,"couponDesc":"满100减50",
                "couponLogo":"https://static.fuiou.com/sys/kdy/20170322.jpg","couponNm":"满100减50","couponNo":"600004"},
            {"couponAmt":500,"couponAmtMin":10,"couponDesc":"满100减50",
                "couponLogo":"https://static.fuiou.com/sys/kdy/20170322.jpg","couponNm":"满100减50","couponNo":"600004"}],
        },
    "desc":"成功"} 

## 优惠券信息显示 /api/coupon/{couponNo}
    1、请求参数
        | couponNo           | string   |  not null  |优惠券编号 从url获取
        | openId             | string   |            |userId，收件宝app的userId或者wxopenid
        | src                | int      |  not null  |来源 0柜子二维码 1收件宝APP 2微信公众号
    2、返回字段 
        | userTp             | int      |  not null  |用户类型 0新用户 1老用户
        | userId             | string   |            |返回老用户手机号
        
        | couponNo           | string   |  not null  |优惠券编号
        | couponNm           | string   |  not null  |优惠券名称
        | couponDesc         | string   |  not null  |优惠券详细描述
        | couponLogo         | string   |  not null  |优惠券logo链接
        | couponAmt          | int      |  not null  |优惠券金额 分 500
        | couponAmtMin       | int      |  not null  |优惠券使用条件金额 分 1000
    
    3、返回
    {"code":200,"data":{"datas":[
        {
            "couponAmt":10,"couponAmtMin":100,"couponDesc":"无条件使用","couponGoods":"52001143,52001226",
            "couponLogo":"/sys/o2o2/2017/07/24/1500884851848","couponNm":"鸡蛋满减",
            "couponNo":"601207","couponNum":3,"couponNumDaily":10,"couponNumTotal":20,
            "couponSt":1,"couponTp":0,"crtTs":"2017-07-24 15:52:28.584831000",
            "dailyMax":5,"defaultTp":0,"expireDays":3,"expireDt":20170728,
            "firstTp":0,"id":1,"operator":"dengqy","remark":"ccc","startDt":20170724,"updTs":"2017-07-28 14:17:27.425043000"}],
        "userId":"13100000000","userTp":1},
    "desc":"成功"}

    
    
## 领取优惠券 /api/coupon/get
    1、请求参数    
        | couponNo           | string   |            |优惠券编号
        | hostId             | string   |  not null  |终端号 
        | openId             | string   |            |userId，收件宝app的userId或者wxopenid
        | src                | int      |  not null  |来源 0柜子二维码 1收件宝APP 2微信公众号
    2、返回
    {"code":200,"desc":"https://dswx-test.fuiou.com/o2o/70000030"}
    
    
    
    
    
## 优惠券查询 /wx_c/api/coupons
    1、请求参数
    	| openId             | string   |  not null  |openId
        | src                | int      |  not null  |来源 0柜子二维码 1收件宝APP 2微信公众号  3用户小程序  9台卡二维码(3期传3)
    2、返回
    	{"code":200,"data":{"datas":[{"couponAmt":1,"couponAmtMin":2,"couponDesc":"","couponLogo":"","couponLogoTeam":"","couponNm":"改善","couponNo":"60003729","couponSrcDesc":"商户公众号发放","couponStDesc":"已过期","couponTp":1,"expireDt":20170923,"mchAddr":"视3213","mchId":80001822,"mchLogo":"","mchMobile":"15555555555","mchNm":"哈赢得","startDt":20170920},{"couponAmt":1,"couponAmtMin":2,"couponDesc":"","couponLogo":"","couponLogoTeam":"","couponNm":"改善","couponNo":"60003729","couponSrcDesc":"商户公众号发放","couponStDesc":"已过期","couponTp":1,"expireDt":20170923,"mchAddr":"视3213","mchId":80001822,"mchLogo":"","mchMobile":"15555555555","mchNm":"哈赢得","startDt":20170920}]},"desc":"成功"}