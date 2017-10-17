// pages/order/order.js
var app = getApp();
import common from "../../js/common.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 0,
    orderList:[],
    tabbarArray: [//底部tabbar
      {
        id: 1,
        cls: 'home',
        url: '/pages/index/index',
        src: '../../image/home.png',
        active_src: '../../image/home_active.png',
        text: '首页',
        active: false
      },
      {
        id: 2,
        cls: 'car',
        url: '/pages/shoppingcat/shoppingcart',
        src: '../../image/car.png',
        active_src: '../../image/car_active.png',
        text: '购物车',
        shopCartNum: 0,
        active: false
      },
      {
        id: 3,
        cls: 'order',
        url: '/pages/order/order',
        src: '../../image/order.png',
        active_src: '../../image/order_active.png',
        text: '订单',
        active: true
      }, {
        id: 4,
        cls: 'my',
        url: '/pages/my/my',
        src: '../../image/my.png',
        active_src: '../../image/my_active.png',
        text: '我的',
        active: false
      }
    ],
    showPayModel:false,
    token:'',
    orderSt: [0, 200, 201, 203],//0待支付  200待配送  201配送成功待取货 203已完成
    backTopIconShowFlag: false,
    scrollTop: 0,
    clickable:true,
    clickIdx:'',//立即付款与开箱的idx,用于获取订单信息
    payData:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.getToken(function(){
      _this.getOrders();
    });
  },
  changeTab: function (e) {
    var _index = e.target.dataset.index;
    this.setData({
      activeTab: _index
    });
    this.getOrders();
  },
  openBox: function () {//开箱
    wx.scanCode({
      success: (res) => {
        console.log(res);
        var _result = res.result;
        wx.showModal({
          title: '扫码结果',
          content: _result,
          success: function (res) {
          }
        })
      },
      fail:res=>{
        console.log("扫码失败:",res);
      }
    })
  },
  showPayModel: function (e) {
    return;
    var _idx = e.currentTarget.dataset.idx;
    this.setData({
      showPayModel: true,
      clickIdx:_idx
    });
  },
  closePayModel: function () {
    this.setData({
      showPayModel: false
    });
  },
  getOrders:function(){
    var _this = this;
    common.getAjax({
      url: 'api/orderQry',
      params: {
        needGoods:11,
        orderSt: _this.data.orderSt[_this.data.activeTab],
        orderSrc:3
      },
      token: _this.data.token,
      success: function (res) {
        console.log("getOrders:",res);
        if(res.data.code == 200){
          _this.setData({
            orderList:res.data.data.datas
          });
        }else if(res.data.code == 40101){
          _this.getToken(function(){
            _this.getOrders();
          });
        }
      },
      complete: function () {
      }
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
              console.log("in order page oauth:", re);
              if (re.data.code == 200) {
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
  showModal: function (cont, fn) {
    //显示弹窗,cont为显示的内容,fn为点击确定按钮触发事件可为空
    wx.showModal({
      title: '提示',
      content: cont,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          if (fn) {
            fn();
          }
        }
      }
    });
  },
  topay: function (e) {//点击去结算
    var _this = this;
    if(this.data.clickable){
      this.setData({
        clickable:false
      });
      var _idx = this.data.clickIdx;
      //console.log("topay idx:",_idx,this.data.orderList[_idx]);
      var _order = this.data.orderList[_idx];
      var _goods = _order.orderGoods;
      var _orderGoods = [];
      for (var key in _goods) {
        var _arr = {
          goodsNo: _goods[key].goodsNo,
          orderNum: _goods[key].orderNum,
          mchId: _goods[key].mchId
        }
        _orderGoods.push(_arr);
      }
      var _params = {
        orderAmt: _order.orderAmt,
        src: 3,
        shopId: _order.shopId,
        orderTp: 1,
        payMode: 2,
        hostId: _order.orderAmt,
        couponNo: _order.couponNo,
        orderGoods: _orderGoods
      };
      console.log("topay params:",_params);
      _this.setData({
        clickable:true
      });
    }
    /*if (this.data.clickable) {
      this.getToken(function () {
        common.getAjax({
          url: 'api/order',
          params: _params,
          token: _this.data.token,
          success: function (res) {
            console.log("checkOrder.js order:", res);
            if (res.data.code == 200) {
              _this.requestPayMent(res.data.data);
            } else {
              _this.showModal(res.data.desc);
            }
          },
          complete: function () {
            _this.setData({
              clickable: true
            });
          }
        });
      });
    }*/
  },
  requestPayMent: function (_data) {//发起微信支付
    var _this = this;
    _this.setData({
      payData: _data
    });
    console.log("payData:", this.data.payData);
    wx.requestPayment({
      'timeStamp': _this.data.payData.timestamp,
      'nonceStr': _this.data.payData.noncestr,
      'package': _this.data.payData.package,
      'signType': 'MD5',
      'paySign': _this.data.payData.paySign,
      'success': function (res) {
        if (res.errMsg == "requestPayment:ok") {
          //调用 支付成功
          console.log("支付成功:", res);
          _this.showModal("支付成功，点击确定返回!", function (){
            wx.navigateBack()
          });
        }
      },
      'fail': function (res) {
        if (res.errMsg == "requestPayment:fail cancel") {
          //用户取消支付
          console.log("用户取消支付:", res);
          _this.showModal("您已取消支付!", function () {
            _this.setData({
              showPayModel:false
            });
            //wx.navigateBack();
          });
        } else if (res.errMsg == "requestPayment:fail (detail message)") {
          //调用支付失败，其中 detail message 为后台返回的详细失败原因
          console.log("支付失败:", res);
          _this.showModal("支付失败!",function(){
            _this.setData({
              showPayModel: false
            });
          });
        }
      }
    })
  },
  goTop: function () { //返回顶部
    this.setData({
      scrollTop: 0
    });
  },
  checkBackTop: function (e) {//检测并判断是否显示返回顶部按钮 
    if (e.detail.scrollTop > 500) {
      if (this.data.backTopIconShowFlag == false) {
        this.setData({
          backTopIconShowFlag: true
        });
      }
    } else {
      if (this.data.backTopIconShowFlag == true) {
        this.setData({
          backTopIconShowFlag: false
        });
      }
    }
  }
})