// pages/pay/pay.js
var app = getApp();
import common from "../../js/common.js";
Page({
  data: {
    scrollTop: 0,
    couponShowFlag: false,//是否显示优惠券们
    couponsList:[//优惠券列表 
      {
        id:1,
        name:'富友商圈优惠券1',
        couponMin:10000,
        couponAmt:2000,
        endTime:'2017-12-30',
        select:false
      },
      {
        id: 2,
        name: '富友商圈优惠券2',
        couponMin: 5000,
        couponAmt: 1500,
        endTime: '2017-12-30',
        select: false
      },
      {
        id: 3,
        name: '富友商圈优惠券3',
        couponMin: 800,
        couponAmt: 2500,
        endTime: '2017-12-30',
        select: false
      }
    ],
    isPayAble:true,//判断是否可支付，用来决定去结算按钮状态 
    showPayModel:false,//是否显示支付信息弹窗 
    payPrice:0,//支付的价格，未减去优惠券价格
    couponPrice:0,//优惠券价格
    couponId:'',//已选 中的优惠券id
    options:[],//页面参数
    shop:[],//店铺信息
    goods:[],//订单商品
    token:'',
    popHopeTs:'',
    clickable:true,
    payData:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("checkOrder:",options);
    this.setData({
      options:options
    });
    if(options.shopId){
      this.getOrderInfo();
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
          goodsNo: _this.data.options.goodsNo
        },
        token: _this.data.token,
        success: function (res) {
          console.log("orderPage:", res);
          if(res.data.code == 200){
            
            _this.calculatePayPrice();
            if(res.data.data.coupons.length){
              _this.setData({
                shop: res.data.data.shopHost,
                goods: res.data.data.carts,
                payPrice:res.data.data.orderAmt,
                popHopeTs: res.data.data.popHopeTs
              });
              _this.checkAbleAndMaxCoupon(res.data.data.coupons);
            }else{
              _this.setData({
                couponsList:res.data.data.coupons,
                shop: res.data.data.shopHost,
                goods: res.data.data.carts,
                payPrice: res.data.data.orderAmt,
                popHopeTs: res.data.data.popHopeTs
              });
            }
          }else{
            wx.navigateBack({});
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
            couponPrice:0
          });
        }else{
          this.setData({
            couponPrice: _couponList[key].couponAmt
          });
        }
        _couponList[key]["select"] = !_couponList[key]["select"];
      }else{
        _couponList[key]["select"] = false;
      }
    }
    this.setData({
      couponsList:_couponList
    });
  },
  topay:function(){//点击去结算
    if(this.data.clickable){
      var _this = this;
      var _goods = this.data.goods;
      var _orderGoods = [];
      this.setData({
        clickable: false
      });
      for(var key in _goods){
        var _arr = {
          goodsNo: _goods[key].goodsNo,
          orderNum: _goods[key].orderNum
        }
        _orderGoods.push(_arr);
      }
      var _params = {
        orderAmt: _this.data.payPrice,
        src: 3,
        shopId: _this.data.options.shopId,
        orderTp: 1,
        payMode: 2,
        hostId: _this.data.shop.hostId,
        couponNo: _this.data.couponId,
        orderGoods: _orderGoods
      };
      this.getToken(function(){
        common.getAjax({
          url: 'api/order',
          params: _params,
          token:_this.data.token,
          success: function (res) {
            console.log("order success:", res)
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
  requestPayMent:function(){//发起微信支付
    var _this = this;
    wx.requestPayment({
      'timeStamp': _this.payData.timeStamp,
      'nonceStr': _this.payData.nonceStr,
      'package': _this.payData.package,
      'signType': 'MD5',
      'paySign': _this.payData.paySign,
      'success': function (res) {
        if (res.errMsg == "requestPayment:ok"){
          //调用 支付成功
          console.log("支付成功:",res);
        }
      },
      'fail': function (res) {
        if (res.errMsg == "requestPayment:fail cancel"){
          //用户取消支付
          console.log("用户取消支付:",res);
        } else if (res.errMsg == "requestPayment:fail (detail message)"){
          //调用支付失败，其中 detail message 为后台返回的详细失败原因
          console.log("支付失败:",res);
        }
      }
    })
  },
  showPayModel:function(){
    this.setData({
      showPayModel: true
    });
  },
  closePayModel:function(){
    this.setData({
      showPayModel:false
    });
  }, 
  getToken: function (fn) {//如果用户token过期，重新获取token，并获取数据
    var _this = this;
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
                _this.setData({
                  token: re.data.data.token
                });
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
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
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
          couponPrice:_maxPrice,
          couponId: this.data.couponsList[_maxKey].id,
          couponsList:_coupons
        });
      }else{
        _coupons[0].select = true;
        this.setData({
          couponPrice: _coupons[0].couponAmt,
          couponId: _coupons[0].id,
          couponsList: _coupons
        });
      }
    }
  }
})