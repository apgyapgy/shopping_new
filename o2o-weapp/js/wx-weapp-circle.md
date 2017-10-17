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
            示例参考 https://dswx-test.fuiou.com/o2o/wx_we/queryShopGoods?loginId=15316117950&shopId=6000000689
        | loginId            | string   |  not null  |登录账号
        | shopId             | string   |  not null  |店铺id
    2、返回字段
    	
    3、返回示例   
    {"code":200,"data":{"cartInfo":{"orderNums":"100","totalAmt":"30000"},"list":[{"goodsAmt":500,"goodsAmtStr":"5.00","goodsImgDetail":"sys/o2o2/o2oGoods_177716307031831.jpg","goodsImgLogo":"sys/o2o2/o2oGoods_702013032731850.jpg","goodsNm":"鸡蛋","goodsNo":"52001143","goodsNum":0,"goodsNumTotal":0,"goodsPackNum":10,"goodsPackWeight":500,"goodsPackWeightJin":"1","goodsSt":1,"goodsTp":0,"mchId":80001828},{"goodsAmt":100,"goodsAmtStr":"1.00","goodsImgDetail":"o2oGoods_208349805425034.dll","goodsImgLogo":"sys/o2o2/o2oGoods_115513000141214.jpg","goodsNm":"鹅蛋","goodsNo":"52001226","goodsNum":0,"goodsNumTotal":0,"goodsPackNum":10,"goodsPackWeight":500,"goodsPackWeightJin":"1","goodsSt":1,"goodsTp":0,"mchId":80001828}],"shop":{"bmapLat":"31.228522821982","bmapLng":"121.56115068654","crtTs":"2017-09-27 14:21:40.061780000","distAmt":0,"distAmtMin":0,"distEndTs":"18:00","distRange":1500,"distStartTs":"17:30","id":15,"mchId":80001828,"operator":"F00000033973329","remark":"","shopAddr":"视3213","shopContract":"18516589920","shopId":6000000545,"shopLogo":"","shopNm":"视不会后悔","shopSt":1,"updTs":"2017-09-27 14:21:40.061780000"}},"desc":"成功"}
    


## 查询用户加入店铺的购物车所有商品 /wx_we/queryShopCart
    1、基本参数
           示例参考 https://dswx-test.fuiou.com/o2o/wx_we/queryShopCart?loginId=15555555555&shopId=6000000689
        | loginId            | string   |  not null  |登录账号
        | shopId             | string   |  not null  |店铺id
    2、返回字段
    	
    3、返回示例   
    	{"code":200,"data":{"cartInfo":{"orderNums":"10","totalAmt":"3400"},"list":[{"crtTs":"2017-09-27 17:14:22.433055000","goodsAmt":500,"goodsImgLogo":"sys/o2o2/o2oGoods_702013032731850.jpg","goodsNm":"鸡蛋","goodsNo":"52001143","loginId":"15555555555","mchId":80001828,"operator":"15555555555","orderAmt":4,"orderNum":6,"remark":"","shopId":6000000689,"updTs":"2017-10-11 16:33:32.488426000","userId":"15555555555"},{"crtTs":"2017-09-27 17:13:34.322088000","goodsAmt":100,"goodsImgLogo":"sys/o2o2/o2oGoods_115513000141214.jpg","goodsNm":"鹅蛋","goodsNo":"52001226","loginId":"15555555555","mchId":80001828,"operator":"15555555555","orderAmt":4,"orderNum":4,"remark":"","shopId":6000000689,"updTs":"2017-10-10 17:04:29.641020000","userId":"15555555555"}]},"desc":"成功"}
 
   
## 用户查询购物车  /wx_we/qryUserCart
    1、基本参数
           示例参考 https://dswx-test.fuiou.com/o2o/wx_we/qryUserCart?loginId=15316117950&hostId=70000030
        | loginId            | string   |  not null  |登录账号
        | cellCd             | string   |  not null  |定位选择的小区code
    2、返回字段
    	
    3、返回示例   
    {"code":200,"data":{"sendList":[{"areaNm":"上海小区","hostId":"70000030","list":[{"hostId":"70000030","list":[{"crtTs":"2017-10-12 22:45:08.711413000","goodsAmt":100,"goodsImgLogo":"sys/o2o2/o2oGoods_115513000141214.jpg","goodsNm":"鹅蛋","goodsNo":"52001226","goodsSt":"1","isExpire":"1","loginId":"15316117950","mchId":80001819,"operator":"15316117950","orderAmt":100,"orderNum":3,"remark":"","shopId":6000001740,"updTs":"2017-10-13 14:00:04.570331000","userId":"15316117950"}],"mchId":"80001819","shopId":"6000001740","shopNm":"clutter3213"},{"hostId":"70000030","list":[{"crtTs":"2017-10-13 16:32:03.111957000","goodsAmt":500,"goodsImgLogo":"sys/o2o2/o2oGoods_702013032731850.jpg","goodsNm":"鸡蛋","goodsNo":"52001143","goodsSt":"1","isExpire":"1","loginId":"15316117950","mchId":80001828,"operator":"15316117950","orderAmt":500,"orderNum":3,"remark":"","shopId":6000000545,"updTs":"2017-10-13 16:54:12.631260000","userId":"15316117950"},{"crtTs":"2017-10-13 16:57:53.810552000","goodsAmt":100,"goodsImgLogo":"sys/o2o2/o2oGoods_115513000141214.jpg","goodsNm":"鹅蛋","goodsNo":"52001226","goodsSt":"1","isExpire":"1","loginId":"15316117950","mchId":80001828,"operator":"15316117950","orderAmt":100,"orderNum":1,"remark":"","shopId":6000000545,"updTs":"2017-10-13 16:57:53.810552000","userId":"15316117950"}],"mchId":"80001828","shopId":"6000000545","shopNm":"视不会后悔"}]}],"unSendList":[{"areaNm":"富友508","hostId":"60255406","list":[{"hostId":"60255406","list":[{"crtTs":"2017-09-27 17:14:22.433055000","goodsAmt":500,"goodsImgLogo":"sys/o2o2/o2oGoods_702013032731850.jpg","goodsNm":"鸡蛋","goodsNo":"52001143","goodsSt":"1","isExpire":"1","loginId":"15316117950","mchId":80001828,"operator":"15555555555","orderAmt":4,"orderNum":6,"remark":"","shopId":6000000689,"updTs":"2017-10-11 16:33:32.488426000","userId":"15316117950"},{"crtTs":"2017-09-27 17:13:34.322088000","goodsAmt":100,"goodsImgLogo":"sys/o2o2/o2oGoods_115513000141214.jpg","goodsNm":"鹅蛋","goodsNo":"52001226","goodsSt":"1","isExpire":"1","loginId":"15316117950","mchId":80001828,"operator":"15555555555","orderAmt":4,"orderNum":4,"remark":"","shopId":6000000689,"updTs":"2017-10-10 17:04:29.641020000","userId":"15316117950"}],"mchId":"80001828","shopId":"6000000689","shopNm":"视不会后悔"}]}]},"desc":"成功"}
    
    
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
            示例参考  https://dswx-test.fuiou.com/o2o/wx_we/clearCart?loginId=15555555555&shopId=6000000689
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
	{"code":200,"data":{},"desc":"成功"}


     
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





    
## 商品信息查询/user/goodsQry（废弃）
	 1、请求参数
		 | shopId          	 | string(32)   |            |店铺id 必传
         | goodsSt	  		 | string(32)   |            |0待上架出售 1已上架销售中  2下架
     2、返回
     	 
     3、返回实例
     	{"code":200,"data":{"datas":[{"goodsAmt":1000,"goodsAmtStr":"10.00","goodsImgDetail":"test","goodsImgLogo":"test","goodsNm":"测5","goodsNo":"52004160","goodsNum":0,"goodsNumTotal":10,"goodsPackNum":0,"goodsPackWeight":0,"goodsPackWeightJin":"0","goodsSt":1,"goodsTp":1,"mchId":80001819},{"goodsAmt":1000,"goodsAmtStr":"10.00","goodsImgDetail":"test","goodsImgLogo":"test","goodsNm":"测5","goodsNo":"52004159","goodsNum":0,"goodsNumTotal":10,"goodsPackNum":0,"goodsPackWeight":0,"goodsPackWeightJin":"0","goodsSt":1,"goodsTp":1,"mchId":80001819},{"goodsAmt":1000,"goodsAmtStr":"10.00","goodsImgDetail":"test","goodsImgLogo":"test","goodsNm":"测5","goodsNo":"52004158","goodsNum":0,"goodsNumTotal":10,"goodsPackNum":0,"goodsPackWeight":0,"goodsPackWeightJin":"0","goodsSt":1,"goodsTp":1,"mchId":80001819}],"token":"B2E9A93808E9B12D8292AB84CA2DBBE1._8.46"},"desc":"成功"}
     	 
     	 
## 跳转到支付界面/api/orderPage
	 1、请求参数
		 | shopId          	 | string(32)   |            |店铺id 
         | cellCd	  		 | string(32)   |            |定位小区编号openId
         | goodsNo	  		 | string(32)   |            |购物车选中商品列表 如52001143,52001226
     2、返回
     
 
## 订单查询接口/api/orderQry
	 1、请求参数
	 	 | needGoods         | int          |  not null  | 查询订单是否需要同步查询出子订单 空-否 非空-是 
	 	 | orderSt           | int          |  not null  | 0待支付  200待配送  201配送成功待取货 203已完成
	 	 | orderSrc          | int          |  not null  | 3线上店铺
     2、返回
     	 
     
## 支付接口
	 ## 聚合支付下单 /api/order
     1、请求参数
        | orderAmt           | int      |  not null  |订单实际金额 分 1000
		| src           	 | int      |  not null  |来源  4用户小程序
     	| shopId             | string   |  not null  |店铺编号
     	| orderTp            | string   |  not null  |1线上预售
		| hostId	         | string   |  not null  |配送终端
		| couponNo           | string   |  not null  |优惠券编号
		| orderGoods         | string   |  not null  |子订单，以json数组的方式传递
		如：[{"mchId":"80001828","goodsNo":"0000001","orderNum":"1"},{"mchId":"80001828","goodsNo":"0000002","orderNum":"6"}]
			| mchId           	 | string   |  not null  |商户id
			| goodsNo            | string   |  not null  |商品编号
        	| orderNum           | int      |  not null  |商品数量


     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
