//app.js
var common = require('js/common.js');
App({
  onLaunch: function () {
    //wx.setStorageSync("location","31.228522821982#121.56115068654");
    //this.authUserInfo();
  },
  onShow:function(){
    //this.authUserInfo();
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