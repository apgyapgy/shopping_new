//app.js
var common = require('/js/common.js');
App({
  onLaunch: function () {
    //wx.setStorageSync("location","31.228522821982#121.56115068654");
    //this.authUserInfo();
  },
  onShow:function(){
    //this.authUserInfo();
  },
  getToken:function(_this,fn){//获取token
    var _appThis = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (res.networkType == 'none') {
          common.showModal("网络已断开，请联网后重试!", function () {
            if(_this.data.clickable != undefined && _this.data.clickable == false){
              _this.setData({
                clickable: true
              });
            }
          });
        } else {
          wx.login({
            success: ress => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (ress.code) {
                wx.request({
                  url: _appThis.globalData.baseUrl + 'wx_we/oauth',
                  data: {
                    code: ress.code
                  },
                  success: function (re) {
                    console.log("in shop page oauth:", re);
                    if (re.data.code == 200) {
                      _appThis.globalData.loginId = re.data.data.loginId;
                      _appThis.globalData.token = re.data.data.token;
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
      fail: function (res) {
        console.log("获取网络状态失败:", res);
      }
    });
  },
  qryUserCartNums: function (_this) {//获取购物车数量
    var _appThis = this;
    common.getAjax({
      url: 'wx_we/qryUserCartNums',
      params: {
        loginId: _appThis.globalData.loginId
      },
      token: _appThis.globalData.token,
      success: function (res) {
        if (res.data.code == 200) {
          var _tabbarArray = _this.data.tabbarArray;
          if (res.data.data.totalNumbers != _tabbarArray[1].shopCartNum) {
            _tabbarArray[1].shopCartNum = res.data.data.totalNumbers;
            _this.setData({
              tabbarArray: _tabbarArray
            });
          }
        } else if (res.data.code == 40101) {
          _appThis.getToken(_this, function () {
            _appThis.qryUserCartNums(_this);
          })
        } else {
          common.showModal(res.data.desc);
        }
      }
    });
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
    imgPre: 'https://staticds.fuiou.com',//生产
    location:{},
    src:3,
    baseUrl: 'https://chi.fuiou.com/',  //生产
    //baseUrl: 'https://dswx-test.fuiou.com/o2o/', //测试
    selectedHostId:''
  }
})