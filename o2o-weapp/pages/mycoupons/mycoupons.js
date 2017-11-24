// pages/mycoupons/mycoupons.js
var app = getApp();
import common from '../../js/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab:0,
    couponsList:[],
    coupons:[],
    backTopIconShowFlag: false,
    scrollTop: 0, 
    netDisconnectFlag: false,
    noCouponFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    app.getToken(_this,function(){
      _this.getCoupons();
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
  mockLogin:function(){//模拟登录 
    var _this = this;
    common.getAjax({
      url: 'wx_we/oauth-test2',
      success: function (res) {
        if(res.data.code == 200){
          _this.getCoupons();
        }        
      }
    });
  },
  getCoupons:function(){
    var _this = this;
    common.getAjax({
      url: 'wx_c/api/coupons',
      params: {
        openId: '',
        src:app.globalData.src
      },
      token: app.globalData.token,
      success: function (res) {
        if (res.data.code == 200) {
          console.log("获取优惠券成功:",res);
          var _coupons = res.data.data.datas;
          for(var key in _coupons){
            var _expireDt = _coupons[key].expireDt + "";
            _expireDt = _expireDt.substring(0, 4) + '-' + _expireDt.substring(4, 6) + '-' + _expireDt.substring(6);
            _coupons[key].expireDt = _expireDt;
          }
          _this.setData({
            coupons: _coupons
          });
          _this.getShowCoupon();
        } else if (res.data.code == 40101) {
          app.getToken(_this,function () {
            _this.getCoupons();
          });
        }else{
          _this.setData({
            coupons:[],
            noCouponFlag:true
          });
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
                    if (re.data.code == 200) {
                      app.globalData.loginId = re.data.data.loginId;
                      app.globalData.hostId = re.data.data.hostId;
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
  getShowCoupon: function () {
    var _activeTab = this.data.activeTab;
    var _st = ['未使用', '已使用', '已过期'];
    var _list = [];
    var _activeText = _st[_activeTab];
    var _coupons = this.data.coupons;
    for(var key in _coupons){
      if (_coupons[key].couponStDesc == _activeText){
        _list.push(_coupons[key]);
      }
    }
    if(_list.length){
      this.setData({
        couponsList: _list,
        noCouponFlag:false
      });
    }else{
      this.setData({
        couponsList: _list,
        noCouponFlag:true
      });
    }
  },
  changeTab:function(e){
    var _index = e.target.dataset.index;
    this.setData({
      activeTab:_index,
      noCouponFlag:false
    });
    this.getShowCoupon();
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