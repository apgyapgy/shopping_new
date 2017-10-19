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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.getToken(function(){
      _this.getCoupons();
    });
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
          _this.getToken(function () {
            _this.getCoupons();
          });
        }
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
              if (re.data.code == 200) {
                app.globalData.loginId = re.data.data.loginId;
                app.globalData.hostId = re.data.data.hostId;
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
    this.setData({
      couponsList:_list
    });
  },
  changeTab:function(e){
    var _index = e.target.dataset.index;
    this.setData({
      activeTab:_index
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