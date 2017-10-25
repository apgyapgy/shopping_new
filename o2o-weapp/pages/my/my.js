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
    this.qryUserCartNums();
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { 
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { 
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
  },
  qryUserCartNums: function () {
    var _this = this;
    common.getAjax({
      url: 'wx_we/qryUserCartNums',
      params: {
        loginId: app.globalData.loginId
      },
      token: app.globalData.token,
      success: function (res) {
        if (res.data.code == 200) {
          console.log("qryUserCartNums:", res);
          var _tabbarArray = _this.data.tabbarArray;
          if (res.data.data.totalNumbers != _tabbarArray[1].shopCartNum) {
            _tabbarArray[1].shopCartNum = res.data.data.totalNumbers;
            _this.setData({
              tabbarArray: _tabbarArray
            });
          }
        } else if (res.data.code == 40101) {
          _this.getToken(function () {
            _this.qryUserCartNums();
          })
        } else {
          common.showModal(res.data.desc);
        }
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
                    console.log("in shop page oauth:", re);
                    if (re.data.code == 200) {
                      app.globalData.loginId = re.data.data.loginId;
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
  }
});