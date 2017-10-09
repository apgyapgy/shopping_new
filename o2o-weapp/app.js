//app.js
var common = require('js/common.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var _this = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          this.globalData.code = res.code;
          console.log("login:",res);
          wx.request({
            url: 'https://dswx-test.fuiou.com/o2o/wx_we/oauth',
            data:{
              code:res.code
            },
            success:function(re){
              if(re.data.code == 200){
                _this.globalData.token = re.data.data.token;
                //wx.redirectTo({ url: "/pages/index/index"});
              }else if(re.data.code == 40101){
                wx.redirectTo({ url: "/pages/login/login"});
              }
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    this.authUserInfo();
  },
  authUserInfo:function(){
    var _this = this;
    wx.getUserInfo({
      success:function(res){
        console.log("获取用户信息成功:",res);
        _this.globalData.userInfoAuth = true;
      },
      fail: function (res) {
        console.log("获取用户信息失败:", res);
        _this.globalData.userInfoAuth = false;
      }
    });
    // 获取用户信息
    /*wx.getSetting({
      success: res => {
        //console.log("getSetting:", res);
        if (res.authSetting['scope.userInfo']) {
          console.log("app.js用户授权用户信息");
          _this.globalData.userInfoAuth = true;
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              _this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          console.log("app.js用户拒绝授权用户信息");
          _this.globalData.userInfoAuth = false;
          wx.authorize({
            scope: 'scope.userInfo',
            success: function (re) {
              _this.globalData.userInfoAuth = true;
              console.log("authorize success:", re);
            },
            fail: function (re) {
              console.log("授权用户信息失败");
              _this.globalData.userInfoAuth = false;
              wx.showModal({
                title: '提示',
                content: '到柜需要获取您的用户信息方能正常使用',
                showCancel:false,
                success: function (res) {
                  wx.openSetting({
                    success: function (data) {
                      if (data) {
                        if (data.authSetting["scope.userInfo"] == true) {
                          _this.globalData.userInfoAuth = true;
                          wx.getUserInfo({
                            withCredentials: false,
                            success: function (res) {
                              _this.globalData.userInfo = res.userInfo;
                            },
                            fail: function () {
                              console.info("3授权失败返回数据");
                            }
                          });
                        }
                      }
                    },
                    fail: function () {
                      console.info("设置失败返回数据");
                    }
                  });   
                }
              });              
            }
          });
        }
      }
    });*/
  },
  globalData: {
    userInfo: null,
    code:'',
    userInfoAuth:false,
    token:''
  }
})