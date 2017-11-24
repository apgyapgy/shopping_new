// pages/my/my.js
var app = getApp();
import common from '../../js/common.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    concatShowFlag:false,//判断是否显示客服号码
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
        active: false
      }, {
        id: 4,
        cls: 'my',
        url: '/pages/my/my',
        src: '../../image/my.png',
        active_src: '../../image/my_active.png',
        text: '我的',
        active: true
      }
    ],
    userInfo:{},
    concatPhone:'95138', //客服电话
    netDisconnectFlag: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log("userInfo:", app.globalData); 
    this.setData({
      userInfo:app.globalData.userInfo
    });
    app.qryUserCartNums(_this);
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
  showConcat:function(){
    this.setData({
      concatShowFlag:true
    });
  },
  hideConcat:function(){
    this.setData({
      concatShowFlag:false
    });
  },
  concat:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.concatPhone //仅为示例，并非真实的电话号码
    });
  },
  toCoupon:function(){
    wx.navigateTo({
      url: '/pages/mycoupons/mycoupons'
    });
  }
});