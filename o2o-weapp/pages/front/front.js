// pages/front/front.js
var app = getApp();
import common from '../../js/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    netDisconnectFlag: false,
    isModalClosed:true
  },
  onLoad: function () {
    var _this = this;
    //this.authUserInfo();
    if (wx.onNetworkStatusChange){
      wx.onNetworkStatusChange(function (res) {
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
    var _reLaunch = wx.canIUse('reLaunch');
    var _this = this;
    if (_reLaunch) {
      this.authUserInfo();
    } else {
      if (_this.data.isModalClosed == true) {
        _this.setData({
          isModalClosed: false
        });
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        common.showModal('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。', function () {
          _this.setData({
            isModalClosed: true
          });
          wx.navigateBack();
        });
      }
    }
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
          });
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
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (res.networkType == 'none') {
          common.showModal("网络已断开，请联网后重试!");
        }else{
          wx.login({
            success: ress => {
              console.log("login:", ress);
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (ress.code) {
                wx.request({
                  url: common.baseUrl + 'wx_we/oauth',
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
                      setTimeout(function(){
                        common.reLaunch('/pages/index/index');
                      },1000);                      
                    } else if (re.data.code == 40110) {
                      setTimeout(function(){
                        common.reLaunch("/pages/login/login");
                      },1000);
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
  onShareAppMessage: function () {
    return {
      title: app.globalData.shareTitleText,
      path: '/pages/front/front',
      imageUrl: app.globalData.shareImgUrl
    }
  }
})