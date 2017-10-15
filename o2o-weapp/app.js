//app.js
var common = require('js/common.js');
App({
  onLaunch: function () {
    //wx.setStorageSync("location","31.230286683682#121.55711567154");

    /*// 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var _this = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          _this.globalData.code = res.code;
          console.log("login:",res);
          wx.request({
            url: 'https://dswx-test.fuiou.com/o2o/wx_we/oauth',
            data:{
              code:res.code
            },
            success:function(re){
              console.log("oauth return :",re);
              if(re.data.code == 200){
                _this.globalData.token = re.data.data.token;
                //wx.redirectTo({ url: "/pages/index/index"});
              }else if(re.data.code == 40110){
                wx.redirectTo({ url: "/pages/login/login"});
              }
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      }
    });*/
    //this.authUserInfo();
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
        setTimeout(function(){
          wx.openSetting({
            success: function (data) {
              if (data) {
                if (data.authSetting["scope.userInfo"] == true) {
                  if (fn) {
                    fn();
                  }
                } else {
                  _this.globalData.userInfoAuth = false;
                  _this.checkUserInfoAuth(fn);
                }
              }
            },
            fail: function () {
              console.info("设置失败返回数据");
              _this.globalData.userInfoAuth = false;
            }
          });
        },100);
      }
    });
  },
  checkLocationAuth:function (fun) {//判断是否授权地理位置
    var _this = this;
    //判断用户是否授权获取地理,未授权点任何位置跳转授权页面
    wx.showModal({
      title: '提示',
      content: '到柜需要获取您的"地理位置"授权方能正常使用',
      showCancel: false,
      success: function (res) {
        setTimeout(function(){
          wx.openSetting({
            success: function (data) {
              console.log("openSetting:", data);
              if (data) {
                //判断是否授权获取用户信息
                if (data.authSetting["scope.userInfo"] == true) {
                  if (_this.globalData.userInfoAuth == false) {
                    _this.globalData.userInfoAuth = true;
                  }
                } else {
                  if (_this.globalData.userInfoAuth == true) {
                    _this.globalData.userInfoAuth = false;
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
        },100);
      }
    });
  },
  authUserInfo:function(){
    var _this = this;
    wx.getUserInfo({
      success:function(res){
        _this.globalData.userInfoAuth = true;
        _this.getLocation();
      },
      fail: function (res) {
        console.log("获取用户信息失败:", res);
        _this.globalData.userInfoAuth = false;
        if (res.errMsg == "getUserInfo:fail auth deny"){
          _this.checkUserInfoAuth(function(){
              _this.authUserInfo();
            }
          );
        }
      }
    });
  },
  getLocation:function(){
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        _this.globalData.latitude = res.latitude;
        _this.globalData.longitude = res.longitude;
        var _location = res.latitude + "#" + res.longitude;
        wx.setStorageSync("location", _location);
      },
      fail:function(res){
          _this.checkLocationAuth(function(){
            _this.getLocation();
          });
      }
    })
  },
  globalData: {
    userInfo: null,
    code:'',
    userInfoAuth:false,
    token:'',
    hostId: '',
    openId: '',
    latitude:'',
    longitude:'',
    imgPre:'https://static.fuiou.com/',
    location:{},
    src:3
  }
})