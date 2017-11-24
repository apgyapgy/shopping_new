// pages/order/order.js
var app = getApp();
import common from "../../js/common.js";
Page({
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
    orderSt: [0, 200, 201, 203],//0待支付  200待配送  201配送成功待取货 203已完成
    backTopIconShowFlag: false,
    scrollTop: 0,
    clickable:true,
    clickIdx:'',//立即付款与开箱的idx,用于获取订单信息
    payData: {},
    imgPre: app.globalData.imgPre,
    noOrderFlag:false,
    netDisconnectFlag: false
  },
  onLoad: function (options) {
    if(options.type){
      this.setData({
        activeTab:options.type
      });
    }
    var _this = this;
    app.getToken(_this,function(){
      _this.getOrders();
    });
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
          }, 2000);
        }
      });
    }
  },
  onShow:function(){
    app.qryUserCartNums(this);
  },
  changeTab: function (e) {
    var _index = e.target.dataset.index;
    this.setData({
      orderList:[],
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
    if (this.data.noOrderFlag == true){
      this.setData({
        noOrderFlag:false
      });
    }
    common.getAjax({
      url: 'api/orderQry',
      params: {
        needGoods:11,
        orderSt: _this.data.orderSt[_this.data.activeTab],
        orderSrc:3
      },
      token: app.globalData.token,
      success: function (res) {
        console.log("getOrders:",res);
        if(res.data.code == 200){
          if(res.data.data.datas.length){
            _this.setData({
              orderList: res.data.data.datas,
              noOrderFlag:false
            })
          }else{
            _this.setData({
              orderList:res.data.data.datas,
              noOrderFlag:true
            });
          }
        }else if(res.data.code == 40101){
          app.getToken(_this,function(){
            _this.getOrders();
          });
        }else{
          _this.setData({
            noOrderFlag:true
          })
          common.showModal(res.data.desc);
        }
      },
      complete: function () {
      }
    });
  },
  getToken: function (fn) {//如果用户token过期，重新获取token，并获取数据
    var _this = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (res.networkType == 'none') {
          common.showModal("网络已断开，请联网后重试!");
        } else {
          wx.login({
            success: ress => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (ress.code) {
                wx.request({
                  url: app.globalData.baseUrl + 'wx_we/oauth',
                  data: {
                    code: ress.code
                  },
                  success: function (re) {
                    console.log("in order page oauth:", re);
                    if (re.data.code == 200) {
                      app.globalData.token = re.data.data.token;
                      if (fn) {
                        fn();
                      }
                    } else if (re.data.code == 40110) {
                      wx.reLaunch({ url: "/pages/login/login" });
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
  pay:function(e){
    var _no = e.currentTarget.dataset.no;
    if(_no){
      this.payAgain(_no);
    }
  },
  payAgain: function (_no) {//点击去结算
    var _this = this;
    if(_no){
      common.getAjax({
        url: 'api/payAgain',
        params: {
          orderNo:_no
        },
        token: app.globalData.token,
        success: function (res) {
          console.log("payAgain:", res);
          if (res.data.code == 200) {
            _this.requestPayMent(res.data.data);
          } else if (res.data.code == 40101) {
            app.getToken(_this, function () {
              _this.payAgain(_no);
            });
          } else {
            common.showModal(res.data.desc);
          }
        }
      });
    }
  },
  requestPayMent: function (_data) {//发起微信支付
    var _this = this;
    console.log("payData:", this.data.payData);
    wx.requestPayment({
      'timeStamp': _data.timestamp,
      'nonceStr': _data.noncestr,
      'package': _data.package,
      'signType': 'MD5',
      'paySign': _data.paySign,
      'success': function (res) {
        if (res.errMsg == "requestPayment:ok") {
          //调用 支付成功
          common.showModal("支付成功!", function () {
            _this.setData({
              orderList: [],
              activeTab: 1
            });
            _this.getOrders();
          });
        }
      },
      'fail': function (res) {
        if (res.errMsg == "requestPayment:fail cancel") {
          //用户取消支付
          common.showModal("您已取消支付!", function () {
            _this.setData({
              orderList: [],
              activeTab: 0
            });
            _this.getOrders();
          });
        } else if (res.errMsg == "requestPayment:fail (detail message)") {
          //调用支付失败，其中 detail message 为后台返回的详细失败原因
          console.log("支付失败:", res);
          common.showModal("支付失败!", function () {
            _this.cancelPay();
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
  },
  showOrderIndo:function(e){
    if (this.data.activeTab == 0){
      return;
    }
    var _orderNo = e.currentTarget.dataset.no;
    if(_orderNo){
      wx.navigateTo({
        url: '/pages/orderinfo/orderinfo?no=' + _orderNo
      });
    }
  },
  jumpShop:function(e){
    var _mchId = e.currentTarget.dataset.mchid;
    var _shopId = e.currentTarget.dataset.shopid;
    if(_mchId && _shopId){
      wx.navigateTo({
        url: '/pages/shop/shop?shopId=' + _shopId + '&mchId=' + _mchId
      });
    }
  }
})