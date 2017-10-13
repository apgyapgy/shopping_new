## 约定
    1、基本参数，从url参数获取
        | qrId               | string   |  not null  |商户二维码台卡编号
        | openId             | string   |            |_PO2OPAYOPENID_ 支付宝的userId或者wxopenid
        | payMode            | int      |  not null  |支付方式 0微信公众号支付 1微信APP支付 2微信小程序支付 4QQ支付 5QQJS支付 6支付宝生活号支付 8百度钱包 9京东支付
        | src                | int      |  not null  |来源 0台卡二维码
        
## 获取商户台卡、优惠券信息 /pay/api/mch
    1、请求参数
        | qrId               | string   |  not null  |商户二维码台卡编号
        | openId             | string   |            |_PO2OPAYOPENID_ 支付宝的userId或者wxopenid
        | src                | int      |  not null  |来源 0台卡二维码
        示例参考
        https://dswx-test.fuiou.com/o2o/pay/api/mch?qrId=88888888&src=2&openId=135_73_78_146_82_107_136_102_94_130_92_143_103_96_92_129_139_137_94_130_136_128_130_96_103_134_95_135_124_139_126_141_103_148_101_133_69_127_131_148_138_107_129_87_36_
    2、返回字段 
        | couponNo           | string   |  not null  |优惠券编号
        | couponNm           | string   |  not null  |优惠券名称
        | couponDesc         | string   |  not null  |优惠券详细描述
        | couponLogo         | string   |  not null  |优惠券logo链接
        | couponAmt          | int      |  not null  |优惠券金额 分 500
        | couponAmtMin       | int      |  not null  |优惠券使用条件金额 分 1000   
        
        | mchNm              | string   |  not null  |商户名称
        | qrLogo             | string   |  not null  |台卡logo 
    
    3、返回    
    {"code":500,"desc":"该商户收款二维码已冻结或未激活"}
    {"code":200,"data":{
        "coupons":[{
            "couponAmt":3,
            "couponAmtMin":0,"couponDesc":"","couponLogo":"","couponLogoTeam":"",
            "couponNm":"随机优惠券1",
            "couponNo":"603395","couponNum":97,"couponNumDaily":0,"couponNumTotal":102,"couponSt":1,"couponStDesc":"已上架","couponTp":1,"crtTs":"2017-09-06 18:47:35.701096000","dailyMax":0,"defaultTp":0,"expireDays":0,"expireDt":20171001,"firstTp":0,"mchId":80001342,"operator":"dengqy","remark":"","startDt":20170906,"updTs":"2017-09-07 15:50:15.183948000"}],
        "mch":{"insCd":"08A9999999","mchId":80001342,
            "mchNm":"小李探花","mchntCd":"0002900F0370588","qrId":88888888,
            "qrLogo":"2017/08/25/1503632589798ImageSelector_20170825_115027.JPEG","qrSt":1,"qrStDesc":"已激活使用"}},"desc":"成功"}

## 聚合支付下单 /pay/api/order
    1、请求参数
        | qrId               | string   |  not null  |商户二维码台卡编号
        | openId             | string   |            |_PO2OPAYOPENID_ 支付宝的userId或者wxopenid
        | payMode            | int      |  not null  |支付方式 
        | src                | int      |  not null  |来源  3用户小程序，9台卡二维码  
        | orderAmt           | int      |  not null  |订单实际金额 分 1000 
        | orderAmtOrg        | int      |  not null  |订单原始金额 分 1500 
        | couponAmt          | int      |  not null  |优惠券金额 分 500
        | couponNo           | string   |  not null  |优惠券编号
        | shopId	         | string   |  not null  |店铺编号
        | hostId	         | string   |  not null  |配送终端
    2、返回字段 
        
    
    3、返回

    
    
