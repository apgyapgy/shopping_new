//app.js
var common = require('js/common.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          this.globalData.code = res.code;
          wx.request({
            url: 'https://dswx-test.fuiou.com/o2o/wx_we/oauth',
            data:{
              code:res.code
            },
            success:function(re){
              if(re.data.code == 200){
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

    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log("getSetting:",res);
        if (res.authSetting['scope.userInfo']) {
          this.globalData.userInfoAuth = true;
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          wx.authorize({
            scope:'scope.userInfo',
            success:function(re){
              this.globalData.userInfoAuth = true;
              console.log("authorize success:",re);
            },
            fail:function(re){
              this.globalData.userInfoAuth = false;
            }
          });
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    code:'',
    userInfoAuth:false
  }
})