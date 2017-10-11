## 约定
    1、基本参数，从url参数获取
        | openId             | string   |            |_PO2OOPENID_ wxopenid 从url获取
        | src                | int      |  not null  |来源 从url获取
        
## 登录认证 /wx_we/oauth
    1、基本参数
    
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/home?bmapLng=116.3786889372559&bmapLat=39.90762965106183
    百度地图坐标转换参考http://developer.baidu.com/map/jsdemo.htm#a5_2
    http://lbsyun.baidu.com/index.php?title=wxjsapi/guide/getlocation
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/oauth?code=001dSXyy0Hnbpj1xe5zy09m7zy0dSXyL
        | code               | string   |  not null  |微信小程序授权code
        | bmapLng            | string   |  not null  |百度地图经度
        | bmapLat            | string   |  not null  |百度地图纬度
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
        | bmapLng            | string   |  not null  |百度地图经度
        | bmapLat            | string   |  not null  |百度地图纬度
    2、返回字段
    
    3、返回示例
    
## 首页 /wx_we/home
    1、基本参数
    2、返回字段
    
    3、返回示例
 
 

## 查询店铺商品与购物车信息 /wx_we/queryShopGoods
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/queryShopGoods?loginId=15555555555
    &shopId=6000000689
        | loginId            | string   |  not null  |登录账号
        | shopId             | string   |  not null  |店铺id
    2、返回字段
    	
    3、返回示例   
    {"code":200,"data":{"cartInfo":{"orderNums":"10","totalAmt":"3400"},"list":[{"goodsAmt":500,"goodsAmtStr":"5.00","goodsImgDetail":"sys/o2o2/o2oGoods_177716307031831.jpg","goodsImgLogo":"sys/o2o2/o2oGoods_702013032731850.jpg","goodsNm":"鸡蛋","goodsNo":"52001143","goodsNum":0,"goodsPackNum":10,"goodsPackWeight":500,"goodsPackWeightJin":"1","mchId":80001828},{"goodsAmt":100,"goodsAmtStr":"1.00","goodsImgDetail":"o2oGoods_208349805425034.dll","goodsImgLogo":"sys/o2o2/o2oGoods_115513000141214.jpg","goodsNm":"鹅蛋","goodsNo":"52001226","goodsNum":0,"goodsPackNum":10,"goodsPackWeight":500,"goodsPackWeightJin":"1","mchId":80001828}]},"desc":"成功"}
    


## 查询用户加入店铺的购物车所有商品 /wx_we/queryShopCart
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/queryShopCart?loginId=15555555555
    &shopId=6000000689
        | loginId            | string   |  not null  |登录账号
        | shopId             | string   |  not null  |店铺id
    2、返回字段
    	
    3、返回示例   
    	{"code":200,"data":{"list":[{"crtTs":"2017-09-27 17:14:22.433055000","goodsAmt":500,"goodsImgLogo":"sys/o2o2/o2oGoods_702013032731850.jpg","goodsNm":"鸡蛋","goodsNo":"52001143","loginId":"15555555555","mchId":80001828,"operator":"15555555555","orderAmt":4,"orderNum":3,"remark":"","shopId":6000000689,"updTs":"2017-10-10 17:04:51.410733000","userId":"15555555555"},{"crtTs":"2017-09-27 17:13:34.322088000","goodsAmt":100,"goodsImgLogo":"sys/o2o2/o2oGoods_115513000141214.jpg","goodsNm":"鹅蛋","goodsNo":"52001226","loginId":"15555555555","mchId":80001828,"operator":"15555555555","orderAmt":4,"orderNum":4,"remark":"","shopId":6000000689,"updTs":"2017-10-10 17:04:29.641020000","userId":"15555555555"}]},"desc":"成功"}
 
   
## 用户查询购物车  /wx_we/qryUserCart
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/qryUserCart?loginId=15555555555
    &cellCd=A2100224063
        | loginId            | string   |  not null  |登录账号
        | cellCd             | string   |  not null  |定位选择的小区code
    2、返回字段
    	
    3、返回示例   
    {"code":200,"data":{"list":[],"unSendList":[{"areaNm":"上海小区","cellCd":"A2100224063","crtTs":"2017-09-27 17:13:34.322088000","goodsAmt":100,"goodsImgLogo":"sys/o2o2/o2oGoods_115513000141214.jpg","goodsNm":"鹅蛋","goodsNo":"52001226","goodsSt":"0","hostId":"70000030","isExpire":"0","loginId":"15555555555","mchId":80001828,"operator":"15555555555","orderAmt":4,"orderNum":4,"remark":"","shopId":6000000689,"shopNm":"视不会后悔","updTs":"2017-10-10 17:04:29.641020000","userId":"15555555555"},{"areaNm":"上海小区","cellCd":"A2100224063","crtTs":"2017-09-27 17:14:22.433055000","goodsAmt":500,"goodsImgLogo":"sys/o2o2/o2oGoods_702013032731850.jpg","goodsNm":"鸡蛋","goodsNo":"52001143","goodsSt":"1","hostId":"70000030","isExpire":"1","loginId":"15555555555","mchId":80001828,"operator":"15555555555","orderAmt":4,"orderNum":4,"remark":"","shopId":6000000689,"shopNm":"视不会后悔","updTs":"2017-10-10 17:14:25.728756000","userId":"15555555555"}]},"desc":"成功"}
    
    
## 新增购物车 /wx_we/saveCart
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/saveCart?userId=15555555555
    &loginId=15555555555&mchId=80001828&shopId=6000000725&goodsNo=52001226
    &goodsAmt=100&orderNum=2&orderAmt=200&remark=哈哈&operator=15555555555
        | userId             | string   |  not null  |userId
        | loginId            | string   |  not null  |登录账号/手机号
        | mchId              | string   |  not null  |商户id
        | shopId             | string   |  not null  |店铺id
        | goodsNo			 | string   |  not null  |商品编号
        | goodsAmt           | int   	|  not null  |商品售卖单价(加入购物车时) 分
        | orderNum           | int   	|  not null  |订单数量
        | orderAmt           | string   |  not null  |订单总金额(分)
        | remark             | string   |  			 |备注
        | operator           | string   |  			 |操作人员
    2、返回字段
    	
    3、返回示例   
    {"code":200,"data":{},"desc":"成功"}
    
    
    
## 店铺购物车商品数量加减  /wx_we/updateOrderNum
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/updateOrderNum?loginId=15555555555
    &shopId=6000000689&goodsNo=52001226&type=0
        | loginId            | string   |  not null  |登录账号
        | shopId             | string   |  not null  |店铺id
        | goodsNo			 | string   |  not null  |商品编号
        | type	             | string   |  not null  |type为0时加，为1时减
    2、返回字段
    	
    3、返回示例      
	{"code":200,"data":{},"desc":"成功"}


    
## 用户清空某店铺购物车所有商品  /wx_we/clearCart
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/clearCart?loginId=15555555555
    &shopId=6000000689
        | loginId            | string   |  not null  |登录账号
        | shopId             | string   |  not null  |店铺id
    2、返回字段
    	
    3、返回示例     
	{"code":200,"data":{},"desc":"成功"}



    
## 用户一键清除购物车失效商品,逗号分隔商品编号  /wx_we/deleteExpireCart
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/deleteExpireCart?loginId=15555555555
    &goodsNoStr=52001226,52001143
        | loginId            | string   |  not null  |登录账号
        | goodsNoStr         | string   |  			 |商品编号，逗号分隔
    2、返回字段
    	
    3、返回示例     
	


     
## 清除某商户购物车单个商品  /wx_we/deleteCart
    1、基本参数
    示例参考 https://dswx-test.fuiou.com/o2o/wx_we/deleteCart?loginId=15555555555
    &shopId=6000000689&goodsNo=52001226
        | loginId            | string   |  not null  |登录账号
        | shopId             | string   |  not null  |店铺id
        | goodsNo	         | string   |  not null	 |商品编号
    2、返回字段
    	
    3、返回示例      
	{"code":200,"data":{},"desc":"成功"}





    
## 商品信息查询/api/user/goodsQry
	 1、请求参数
		 | shopId          	 | string(32)   |            |店铺id 必传
         | goodsSt	  		 | string(32)   |            |0待上架出售 1已上架销售中  2下架
     2、返回
   
     	 
     	 
## 跳转到支付界面/api/orderPage
	 1、请求参数
		 | shopId          	 | string(32)   |            |店铺id 
         | cellCd	  		 | string(32)   |            |定位小区编号openId
         | openId	  		 | string(32)   |            |微信openId
     2、返回
