//app.js
var common = require('js/common.js');
App({
  onLaunch: function () {
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
  },
  globalData: {
    userInfo: null,
    code:'',
    userInfoAuth:false,
    token:''
  }
})