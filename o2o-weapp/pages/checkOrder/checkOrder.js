// pages/pay/pay.js
var app = getApp();
import common from "../../js/common.js";
Page({
  data: {
    scrollTop: 0,
    couponShowFlag: false,//是否显示优惠券们
    couponsList: [],//优惠券列表 
    isPayAble:true,//判断是否可支付，用来决定去结算按钮状态 
    showPayModel:false,//是否显示支付信息弹窗 
    payPrice:0,//支付的价格，未减去优惠券价格
    couponAmt:0,//优惠券价格
    couponNo:'',//已选 中的优惠券id
    options:[],//页面参数
    shop:[],//店铺信息
    goods:[],//订单商品
    popHopeTs:'',
    clickable:true,
    payData: {},
    imgPre: app.globalData.imgPre,
    isOrderGetted:false,  //判断订单信息有没有获取 
    netDisconnectFlag: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("checkOrder:",options);
    var _this = this;
    this.setData({
      options:options
    });
    if(options.shopId){
      this.getOrderInfo();
    }
    if (wx.onNetworkStatusChange){
      wx.onNetworkStatusChange(function (res) {
        console.log("ent change:", res);
        if (res.networkType == 'none') {
          _this.setData({
            netDisconnectFlag: true
          });
          setTimeout(function () {
            _this.setData({
              netDisconnectFlag: false
            });
          },2000);
        }
      });
    }
    //this.checkAbleAndMaxCoupon();
  },
  getOrderInfo:function(){
    var _this = this;
    this.getToken(function () {
      common.getAjax({
        url: 'api/orderPage',
        params: {
          shopId: _this.data.options.shopId,
          cellCd: _this.data.options.cellCd,
          goodsNo: _this.data.options.goodsNo,
          mchId:_this.data.options.mchId
        },
        token: app.globalData.token,
        success: function (res) {
          console.log("checkOrder.js orderPage:", res);
          if(res.data.code == 200){
            _this.calculatePayPrice();
            if(res.data.data.coupons.length){
              _this.setData({
                shop: res.data.data.shopHost,
                goods: res.data.data.carts,
                payPrice:res.data.data.orderAmt,
                popHopeTs: res.data.data.popHopeTs,
                isOrderGetted:true
              });
              _this.checkAbleAndMaxCoupon(res.data.data.coupons);
            }else{
              _this.setData({
                couponsList:res.data.data.coupons,
                shop: res.data.data.shopHost,
                goods: res.data.data.carts,
                payPrice: res.data.data.orderAmt,
                popHopeTs: res.data.data.popHopeTs,
                isOrderGetted:true
              });
            }
          }else if(res.data.code == 40101){
            _this.getToken(function(){
              _this.getOrderInfo();
            });
          }else{
            common.showModal(res.data.desc,function(){
              wx.navigateBack({});
            });            
          }
        },
        complete: function () {
          _this.setData({
            clickable: true
          });
        }
      });
    });
  },
  calculatePayPrice:function(){//计算支付金额 
    var _list = this.data.goods;
    var _sum = 0;
    for(var key in _list){
      _sum+=_list[key].orderAmt;
    }
    this.setData({
      payPrice:_sum
    });
  },
  //显示、隐藏商家优惠券
  showCoupon:function(){
    if(this.data.couponsList.length){
      this.setData({
        couponShowFlag: true,
        isPayAble: false
      });
    }
  },
  hideCoupon:function(){
    this.setData({
      couponShowFlag:false,
      isPayAble:true
    });
  },
  closeCoupon:function(){
    if(this.data.couponShowFlag == true){
      this.hideCoupon();
    }
  },
  selectCoupon:function(e){//选择优惠券
    var _index = e.currentTarget.dataset.idx;
    var _couponList = this.data.couponsList;
    for(var key in _couponList){
      if(_index == key){
        if (_couponList[key]["select"] == true){
          this.setData({
            couponAmt:0,
            couponNo:''
          });
        }else{
          this.setData({
            couponAmt: _couponList[key].couponAmt,
            couponNo:_couponList[key].couponNo
          });
        }
        _couponList[key]["select"] = !_couponList[key]["select"];
      }else{
        _couponList[key]["select"] = false;
      }
    }
    this.setData({
      couponsList:_couponList,
      couponShowFlag: false,
      isPayAble: true
    });
  },
  topay:function(){//点击去结算
    var _this = this;
    if(this.data.clickable){
      var _goods = this.data.goods;
      var _orderGoods = [];
      this.setData({
        clickable: false
      });
      for(var key in _goods){
        var _arr = {
          goodsNo: _goods[key].goodsNo,
          orderNum: _goods[key].orderNum,
          mchId: _goods[key].mchId
        }
        _orderGoods.push(_arr);
      }
      var _params = {
        orderAmt: _this.data.payPrice - _this.data.couponAmt > 0 ? _this.data.payPrice - _this.data.couponAmt:0,
        src: 3,
        shopId: _this.data.options.shopId,
        orderTp: 1,
        payMode: 2,
        hostId: _this.data.shop.hostId,
        couponNo: _this.data.couponNo,
        orderGoods: _orderGoods
      };
      /*console.log("pay params:",_params);
      this.setData({
        clickable: true
      });
      return;*/
      this.getToken(function(){
        common.getAjax({
          url: 'api/order',
          params: _params,
          token: app.globalData.token,
          success: function (res) {
            console.log("checkOrder.js order:", res);
            if (res.data.code == 200) {
              if (_this.data.payPrice - _this.data.couponAmt >0){
                _this.requestPayMent(res.data.data);
              }else{
                common.showModal("支付成功!", function () {
                  wx.redirectTo({
                    url: '/pages/order/order?type=1',
                  });
                });
              }
            }else{
              common.showModal(res.data.desc);
            }
          },
          complete: function () {
            _this.setData({
              clickable: true
            });
          }
        });
      });
    }
  },
  requestPayMent:function(_data){//发起微信支付
    var _this = this;
    _this.setData({
      payData:_data
    });
    console.log("payData:",this.data.payData);
    wx.requestPayment({
      'timeStamp': _this.data.payData.timestamp,
      'nonceStr': _this.data.payData.noncestr,
      'package': _this.data.payData.package,
      'signType': 'MD5',
      'paySign': _this.data.payData.paySign,
      'success': function (res) {
        if (res.errMsg == "requestPayment:ok"){
          //调用 支付成功
          console.log("支付成功:",res);
          common.showModal("支付成功!",function(){
            //wx.navigateBack()
            wx.redirectTo({
              url: '/pages/order/order?type=1',
            });
          });
        }
      },
      'fail': function (res) {
        if (res.errMsg == "requestPayment:fail cancel"){
          //用户取消支付
          console.log("用户取消支付:",res);
          common.showModal("您已取消支付!",function(){
            _this.setData({
              showPayModel:false
            });
            //wx.navigateBack();
            /*wx.redirectTo({
              url: '/pages/order/order?type=0',
            });*/
          });
        } else if (res.errMsg == "requestPayment:fail (detail message)"){
          //调用支付失败，其中 detail message 为后台返回的详细失败原因
          console.log("支付失败:",res);
          common.showModal("支付失败!",function(){
            _this.setData({
              showPayModel: false
            });
          });
        }
      }
    })
  },
  showPayModel:function(){
    if (this.data.isOrderGetted && this.data.isPayAble){
      this.setData({
        showPayModel: true
      });
    }
  },
  closePayModel:function(){
    this.setData({
      showPayModel:false
    });
  }, 
  getToken: function (fn) {//如果用户token过期，重新获取token，并获取数据
    var _this = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (res.networkType == 'none') {
          common.showModal("网络已断开，请联网后重试!",function(){
            _this.setData({
              clickable:true
            });
          });
        } else {
          wx.login({
            success: ress => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (ress.code) {
                wx.request({
                  url: 'https://dswx-test.fuiou.com/o2o/wx_we/oauth',
                  data: {
                    code: ress.code
                  },
                  success: function (re) {
                    console.log("in shop page oauth:", re);
                    if (re.data.code == 200) {
                      app.globalData.loginId = re.data.data.loginId; 
                      app.globalData.token = re.data.data.token;
                      if (fn) {
                        fn();
                      }
                    } else if (re.data.code == 40110) {
                      wx.redirectTo({ url: "/pages/login/login" });
                    }
                  }
                });
              } else {
                console.log('获取用户登录态失败！' + ress.errMsg)
              }
            }
          });
        }
      },
      fail:function(res){
        console.log("获取网络状态失败:",res);
      }
    });
  },
  checkAbleAndMaxCoupon:function(couponsList){//选择最大的优惠券
    if(couponsList){
      var _coupons = couponsList;
    }else{
      var _coupons = this.data.couponsList;
    }
    if (_coupons){
      var _maxKey = -1;
      var _maxPrice=0;
      for (var key in _coupons) { 
        _coupons[key].select = false;
        if (_coupons[key].couponAmt > _maxPrice){
          _maxPrice = _coupons[key].couponAmt;
          _maxKey = key;
        }
        if (couponsList){
          var _expireDt = _coupons[key].expireDt + "";
          _expireDt = _expireDt.substring(0, 4) + '-' + _expireDt.substring(4, 6) + '-' + _expireDt.substring(6);
          _coupons[key].expireDt = _expireDt;
        }
      }
      if(_maxKey!=-1){
        _coupons[_maxKey].select=true;
        this.setData({
          couponAmt:_maxPrice,
          couponNo: _coupons[_maxKey].couponNo,
          couponsList:_coupons
        });
      }else{
        _coupons[0].select = true;
        this.setData({
          couponAmt: _coupons[0].couponAmt,
          couponNo: _coupons[0].couponNo,
          couponsList: _coupons
        });
      }
    }
  },
  preventDefault:function(){}
})