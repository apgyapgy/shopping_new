# o2o微信公众号web后端接口
    主要有商品展示、下单等
## 约定
    1、传输协议和格式 
        请求 HTTP POST(JSON Stream) UTF-8
        响应 JSON或者JSONP UTF-8
    2、基本参数
        not null 表示是必填或者一定返回
        string(32) 表示是字符串，最大32位
    2.1 请求参数        
        | serial      | string   |            |请求流水号
        | jsonp       | string   |            |针对jsonp，二选一，比如jsonp=cb
        | callback    | string   |            |针对jsonp，二选一，比如callback=cb
        | openId      | string   |            |微信openid，针对微信扫码,从url中截取，_PO2OWXOPENID_
        | src         | int      |  not null  |来源 从url中截取 0微信扫柜子二维码 1收件宝APP扫柜子二维码 2微信扫活动优惠券 3收件宝app取件后
        
        说明：
            a) 若请求参数中缺少必填字段，将返回{"code":40001,"desc":"参数为空"}
        
    2.2 返回参数
        | code        | int      |  not null  |返回码 
        | desc        | string   |  not null  |返回描述 
        | data        | object   |            |具体业务返回 
        | data.token  | string   |            |身份凭证：token或者sessionId 
        | data.serial | string   |            |返回的请求流水 
    3、测试、生产地址
        测试 https://dswx-test.fuiou.com/o2o
        生产 https://o2oapi.fuiou.com/
   
## 返回/错误码对照
    200,成功
    400,参数不合法
    40001,参数为空
    40301,验证码错误
    40302,验证码过期
    40310,md5校验错误
    40311,sha1校验错误
    40312,sha256校验错误
    40313,sha384校验错误
    40315,sha512校验错误
    40101,未登录或登录凭证(token/session)已过期
    40102,账号或密码错误
    500,系统异常
    503,系统异常

        
## 首页(商品展示)/api/
    1、请求参数
        | hostId             | string   |  not null  |终端号
        | openId             | string   |            |微信openid，针对微信扫码,从url中截取，_PO2OWXOPENID_
        | type               | int      |  not null  |类型 从url中截取 0所有 1仅预售
        | src                | int      |  not null  |来源 从url中截取 0柜子二维码 1收件宝APP 2微信公众号
    2、返回字段 
        | hostId             | string   |  not null  |终端号
        | userTp             | int      |  not null  |用户类型 0新用户 1老用户
        | userId             | string   |            |返回老用户手机号
        
        | goodsNo            | string   |  not null  |商品编号
        | goodsNm            | string   |  not null  |商品名称
        | goodsAmt           | int      |  not null  |商品单价 分 1000
        | goodsAmtStr        | string   |  not null  |商品单价 元 10.00
        | goodsNum           | int      |  not null  |商品剩余库存量  5
        | goodsImgLogo       | string   |  not null  |商品logo大图
        | goodsImgDetail     | string   |  not null  |商品图
        | goodsPackNum       | string   |  not null  |商品包装数量 个
        | goodsPackWeight    | string   |  not null  |商品包装重量 克 550g
        | goodsPackWeightJin | string   |  not null  |商品包装重量 斤 1.1
        
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
        "goodsAmt":990,"goodsAmtStr":"9.90","goodsImgLogo":"https://static.fuiou.com/sys/kdy/20170322.jpg",
        "goodsNm":"大别山土鸡蛋","goodsNo":"100000344","goodsNum":5,"goodsPackNum":12,
        "goodsPackWeight":550,"hostId":"70000030","mchId":0}],"userTp":1},
    "desc":"成功"}



## 新用户验证手机号--发送验证码/api/sms/{mobile}
    https://dswx-test.fuiou.com/o2o/api/sms/13011110000
    前端做下重发间隔限制，60秒
    1、请求参数
        | mobile             | string   |  not null  |手机号
    2、返回 
        {"code":200,"data":{},"desc":"成功"}

## 新用户验证手机号--提交验证 /api/sms/check/{mobile}/{code}/{wxOpenId}
    https://dswx-test.fuiou.com/o2o/api/sms/check/13011110000/495017/wx....
    1、请求参数
        | mobile             | string   |  not null  |手机号
        | code               | string   |  not null  |验证码
        | openId             | string   |            |微信openid，针对微信扫码
        | src                | int      |  not null  |来源 0柜子二维码 1收件宝APP 2微信公众号
    2、返回 
        "code":200,"data":{},"desc":"成功"}
        
        
## 下单 /api/order
    1、请求参数
        | openId             | string   |            |微信openid，或收件宝app的userId
        | src                | int      |  not null  |来源 0柜子二维码 1收件宝APP 2微信公众号        
        
        | hostId             | string   |  not null  |终端号
        | goodsNo            | string   |  not null  |商品编号
        | goodsNum           | int      |  not null  |商品数量
        
        | orderAmt           | int      |  not null  |订单总金额 分 1500
        | orderTp            | int      |  not null  |订单类型 0库存 1预售
        
        | couponNo           | string   |  not null  |优惠券编号
        | couponAmt          | int      |  not null  |优惠券金额 分 500
    2、返回字段 
        如果 code == 200 and tradeAmt == 0 则下单成功且支付成功，可以提示desc字段
        如果 code == 200 and tradeAmt > 0 则下单成功，需要调取微信支付
        
    
    3、返回
    /**/jQuery182035948268948189654_1499074727118({"code":200,"data":{
    "broadSuccess":true,"code":200,"desc":"成功","package":"Sign=WXPay","success":true,"tradeAmt":0},"desc":"成功"})
        
    /**/jQuery182014850313359090483_1499075200236({"code":200,"data":{
    "appid":"wx227f6ed52a0ea32c","broadSuccess":true,"code":200,"desc":"成功",
    "noncestr":"ZGWU6MI7RR4X7KZYpWGbGstAODhzHRDP","orderNo":"1116020170703173930310064857666","outOrderNo":"200002017070300001276-1",
    "package":"Sign=WXPay","partnerid":"1267944001",
    "prepayid":"wx20170703174646aeee8788c80492401117",
    "sign":"BAA2C7AE2E75B215EB7A796BC5125182","success":true,
    "timestamp":"1499074770","tradeAmt":80},"desc":"成功"})
    
    {"code":200,"data":{
        "appid":"wxc77630e19856c1fb","broadSuccess":true,"code":200,"desc":"成功",
        "noncestr":"hIqPgaXLK5gDoGwcTzLF22ixLv1lzZ7y",
        "orderNo":"1116020170718174319955238336851",
        "outOrderNo":"200102017071800000283-1",
        "package":"Sign=WXPay",
        "partnerid":"1377967302",
        "prepayid":"wx2017071817503876bff8bcf20593853204",
        "sign":"F49759314AA4FBDF287A3F1FC65A9879","success":true,
        "timestamp":"1500371000",
        "tradeAmt":12},
    "desc":"成功"}
    
## 取消支付，关闭订单 /api/order/close/{orderNo}
    1、请求参数
        | orderNo            | string   |  not null  |下单支付接口回的 outOrderNo
        | src                | int      |  not null  |来源 0柜子二维码 1收件宝APP 2微信公众号 