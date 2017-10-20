// pages/front/front.js
var app = getApp();
import common from '../../js/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onShow:function(){
    this.authUserInfo();
  },
  checkUserInfoAuth: function (fn) {
    //判断用户是否授权获取用户信息,未授权点任何位置跳转授权页面
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '到柜需要获取您的"用户信息"授权方能正常使用',
      showCancel: false,
      success: function (res) {
        setTimeout(function () {
          wx.openSetting({
            success: function (data) {
              if (data) {
                if (data.authSetting["scope.userInfo"] == true) {
                  if (fn) {
                    fn();
                  }
                } else {
                  app.globalData.userInfoAuth = false;
                  _this.checkUserInfoAuth(fn);
                }
              }
            },
            fail: function () {
              console.info("设置失败返回数据");
              app.globalData.userInfoAuth = false;
            }
          });
        }, 100);
      }
    });
  },
  checkLocationAuth: function (fun) {//判断是否授权地理位置
    var _this = this;
    //判断用户是否授权获取地理,未授权点任何位置跳转授权页面
    wx.showModal({
      title: '提示',
      content: '到柜需要获取您的"地理位置"授权方能正常使用',
      showCancel: false,
      success: function (res) {
        setTimeout(function () {
          wx.openSetting({
            success: function (data) {
              console.log("openSetting:", data);
              if (data) {
                //判断是否授权获取用户信息
                if (data.authSetting["scope.userInfo"] == true) {
                  if (app.globalData.userInfoAuth == false) {
                    app.globalData.userInfoAuth = true;
                  }
                } else {
                  if (app.globalData.userInfoAuth == true) {
                    app.globalData.userInfoAuth = false;
                  }
                }
                //判断是否授权地理位置
                if (data.authSetting["scope.userLocation"] == true) {
                  if (fun) {
                    fun();
                  }
                } else {
                  _this.checkLocationAuth(fun);
                }
              }
            },
            fail: function (res) {
              console.info("设置失败返回数据", res);
            }
          });
        }, 100);
      }
    });
  },
  authUserInfo: function () {
    var _this = this;
    wx.getUserInfo({
      success: function (res) {
        app.globalData.userInfoAuth = true;
        app.globalData.userInfo = res.userInfo;
        _this.getLocation();
      },
      fail: function (res) {
        console.log("获取用户信息失败:", res);
        app.globalData.userInfoAuth = false;
        if (res.errMsg == "getUserInfo:fail auth deny") {
          _this.checkUserInfoAuth(function () {
            _this.authUserInfo();
          }
          );
        }
      }
    });
  },
  getLocation: function () {
    var _this = this;
    var _location = wx.getStorageSync("location");
    if (_location) {
      var _loca = _location.split("#");
      app.globalData.latitude = _loca[0];
      app.globalData.longitude = _loca[1];
      this.checkOauth();
    } else {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          app.globalData.latitude = res.latitude;
          app.globalData.longitude = res.longitude;
          var _location = wx.getStorageSync("location");
          if (!_location) {//如果缓存中无定位，则缓存，否则不缓存
            var _loca = res.latitude + "#" + res.longitude;
            wx.setStorageSync("location", _loca);
          }
          _this.checkOauth();
        },
        fail: function (res) {
          _this.checkLocationAuth(function () {
            _this.getLocation();
          });
        }
      });
    }
  },
  checkOauth: function () {
    var _this = this;
    wx.login({
      success: ress => {
        console.log("login:", ress);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (ress.code) {
          wx.request({
            url: 'https://dswx-test.fuiou.com/o2o/wx_we/oauth',
            data: {
              code: ress.code,
              bmapLng: app.globalData.longitude,
              bmapLat: app.globalData.latitude
            },
            success: function (re) {
              console.log("app.js:oauth", re);
              if (re.data.code == 200) {
                app.globalData.loginId = re.data.data.loginId;
                app.globalData.hostId = re.data.data.hostId;
                app.globalData.token = re.data.data.token;
                wx.redirectTo({
                  url: '/pages/index/index'
                });
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
})