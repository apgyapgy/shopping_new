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
    loginId:'',
    openId: '',
    latitude:'',
    longitude:'',
    imgPre:'https://static.fuiou.com/',//生产
    //imgPre: 'http://static.fuiou.god',//生产
    location:{},
    src:3,
    baseUrl: 'https://chi.fuiou.com/'  //生产
    //baseUrl: 'https://dswx-test.fuiou.com/o2o/' //测试
  }
})