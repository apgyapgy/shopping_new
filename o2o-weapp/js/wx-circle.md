## 约定
    1、基本参数，从url参数获取
        | openId             | string   |            |_PO2OOPENID_ wxopenid 从url获取
        | src                | int      |  not null  |来源 从url获取
        
## 获取用户所有优惠券 /wx_c/api/coupons
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_c/api/coupons?src=2&openId=137_93_75_131_124_128_128_78_113_140_148_108_78_148_141_114_92_104_147_146_101_73_134_110_103_96_81_141_77_75_107_98_144_69_131_132_134_137_103_99_111_146_129_87_36_
    2、返回字段 
        | couponNo           | string   |  not null  |优惠券编号
        | couponNm           | string   |  not null  |优惠券名称
        | couponDesc         | string   |  not null  |优惠券详细描述
        | couponLogo         | string   |  not null  |优惠券logo链接
        | couponStDesc       | string   |  not null  |优惠券状态
        | couponAmt          | int      |  not null  |优惠券金额 分 500
        | couponAmt          | int      |  not null  |优惠券金额 分 500
        | couponAmtMin       | int      |  not null  |优惠券使用条件金额 分 1000  
        
        | couponDt           | int      |  not null  |获取日期        
        | expireDt           | int      |  not null  |过期日期 
        
        | mchNm              | string   |  not null  |商户名称
        | mchMobile          | string   |  not null  |商户手机
        | mchAddr            | string   |  not null  |商户地址
    
    3、返回示例
    {"code":200,"data":{"datas":[{
        "couponAmt":5,"couponAmtMin":0,"couponDesc":"","couponDt":20170907,"couponLogSt":2,"couponLogo":"","couponLogoTeam":"",
        "couponNm":"随机优惠券422","couponNo":"603412","couponSrc":10,
        "couponSrcDesc":"商户公众号发放",
        "couponStDesc":"已过期","couponTp":0,
        "expireDt":20170907,"loginId":"",
        "mchAddr":"123","mchId":80001342,
        "mchMobile":"18211111111",
        "mchNm":"小李探花xx2",
        "unionId":"o76gRs8yc8JHydcyylAn0rTg7rBc"},{
        "couponAmt":5,"couponAmtMin":0,"couponDesc":"","couponDt":20170907,"couponLogSt":0,"couponLogo":"","couponLogoTeam":"","couponNm":"随机优惠券492","couponNo":"603416","couponSrc":10,"couponSrcDesc":"商户公众号发放","couponStDesc":"未使用","couponTp":1,"expireDt":20171001,"loginId":"","mchAddr":"123","mchId":80001342,"mchMobile":"18211111111","mchNm":"小李探花xx2",
        "unionId":"o76gRs8yc8JHydcyylAn0rTg7rBc"},{
        "couponAmt":3,"couponAmtMin":0,"couponDesc":"","couponDt":20170906,"couponLogSt":0,"couponLogo":"","couponLogoTeam":"","couponNm":"随机优惠券1","couponNo":"603395","couponSrc":10,"couponSrcDesc":"商户公众号发放","couponStDesc":"未使用","couponTp":1,"expireDt":20171001,"loginId":"","mchAddr":"123","mchId":80001342,"mchMobile":"18211111111","mchNm":"小李探花xx2",
        "unionId":"o76gRs8yc8JHydcyylAn0rTg7rBc"}]},
    "desc":"成功"}
