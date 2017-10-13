## 约定
    1、基本参数，从url参数获取
        | openId             | string   |            |_PO2OOPENID_ wxopenid 从url获取
        | src                | int      |  not null  |来源 从url获取
        
## 登录认证 /wx_we/oauth
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/oauth?code=001dSXyy0Hnbpj1xe5zy09m7zy0dSXyL
        | code               | string   |  not null  |微信小程序授权code
    2、返回字段
    
    3、返回示例
    
## 登录认证手机号发短信 /wx_we/api/oauth/sms
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/api/oauth/sms?mobile=13111111111
        | mobile             | string   |  not null  |手机号
    2、返回字段
    
    3、返回示例
    
## 登录认证绑定 /wx_we/api/oauth/bind
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/oauth?code=2
        | mobile             | string   |  not null  |手机号
        | smsCode            | string   |  not null  |短信验证码
        | code               | string   |  not null  |微信小程序授权code
    2、返回字段
    
    3、返回示例
    
## 首页 /wx_we/home
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/home?bmapLng=116.3786889372559&bmapLat=39.90762965106183
    百度地图坐标转换参考http://developer.baidu.com/map/jsdemo.htm#a5_2
    http://lbsyun.baidu.com/index.php?title=wxjsapi/guide/getlocation
        | bmapLng            | double   |  not null  |百度地图经度
        | bmapLat            | double   |  not null  |百度地图纬度
    2、返回字段
    
    3、返回示例
    {
    "code": 200,
    "data": {
        "banners": ["http://n3-q.mafengwo.net/s5/M00/8D/61/wKgB3FCgixKAVSKEACodGZ2qxEQ49.jpeg], 【广告图】
        "location": {  【定位】
            "areaNm": "上海小区",
            "bmapLat": "31.230286683682",
            "bmapLng": "121.55711567154",
            "cellCd": "A2100224063",
            "hostAddrShort": "唐镇齐爱路138号",
            "hostId": "70000030"
        },
        "shops": [{
            "bmapLat": "31.230286683682",    【纬度】
            "bmapLng": "121.55711567154",    【经度】
            "distAmt": 500,                  【配送费（分）】           
            "distAmtMin": 3000,              【起送费（分）】
            "distAmtMinYuan": "30",          【配送费（元）】
            "distAmtYuan": "5",              【起送费（元）】
            "distRange": 1800,
            "distance": 0,
            "mchId": 80001828,
            "shopAddr": "视3213",
            "shopId": 6000000725,
            "shopLogo": "",
            "shopNm": "视不会后悔"
        },
        {
            "bmapLat": "31.230286683682",
            "bmapLng": "121.55711567154",
            "distAmt": 0,
            "distAmtMin": 0,
            "distAmtMinYuan": "0",
            "distAmtYuan": "0",
            "distRange": 1500,
            "distance": 0,
            "mchId": 80001828,
            "shopAddr": "视3213",
            "shopId": 6000000689,
            "shopLogo": "",
            "shopNm": "视不会后悔"
        },
        {
            "bmapLat": "31.230286683682",
            "bmapLng": "121.55711567154",
            "distAmt": 0,
            "distAmtMin": 0,
            "distAmtMinYuan": "0",
            "distAmtYuan": "0",
            "distRange": 1500,
            "distance": 103,
            "mchId": 80001828,
            "shopAddr": "视3213",
            "shopId": 6000000545,
            "shopLogo": "",
            "shopNm": "视不会后悔"
        }]
    },
    "desc": "成功"
}
    
    
    