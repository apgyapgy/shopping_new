//获取应用实例
const app = getApp()
import common from "../../js/common.js";
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mobile:'',
    yzm:'',
    cutdownTime:0,
    timer: null,
    latitude: '',//纬度
    longitude: '',//经度
    isYzmSended:false, //判断验证码有没有发送
    netDisconnectFlag: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var _this = this;
    var _location = this.getStorageLocation();
    if (_location) {
      _location = _location.split("#");
      this.setData({
        latitude: _location[0],
        longitude: _location[1]
      });
    } else {
      this.setData({
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude
      });
    }
    if (app.globalData.userInfo) {
      //console.log('用户信息：' + JSON.stringify(app.globalData.userInfo));
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      })
    }
    if (wx.onNetworkStatusChange){
      wx.onNetworkStatusChange(function (res) {
        console.log("ent change:", res);
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getOpenId: function () {
    wx.request({
      url: 'wx_we/openid', //仅为示例，并非真实的接口地址
      data: {
        code: '',
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  sure:function(){//点击确认按钮
    if(!this.data.isYzmSended){
      common.showModal("请先获取验证码!");
      return;
    }
    var _mobile = this.data.mobile.trim();
    var _code = this.data.yzm.trim();
    if(!_mobile){
      common.showModal("请输入收件宝帐号或手机号");
      return;
    }else if(!_code){
      common.showModal("请输入验证码");
      return;
    }
    if(/\d{6}/.test(_code)){
      var _this = this;
      wx.login({
        success: res => {
          console.log(res);
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            this.loginBind(res.code);
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }else{
      common.showModal("验证码为6位数字");
    }
  },
  sendYzm:function(e){//发送验证码
    var _mobile = this.data.mobile.trim();
    if (!_mobile){
      common.showModal("请输入手机号");
      return;
    }
    var _this = this;
    if (/^1[34578]\d{9}$/.test(_mobile)){
      common.getAjax({
        url:'wx_we/api/oauth/sms',
        params:{
          mobile: _mobile
        },
        success:function(re){
          console.log("send mobile success:",re);
          if (re.data.code == 200) {
            if (_this.data.isYzmSended == false){
              _this.setData({
                cutdownTime:61,
                isYzmSended:true
              });
            }else{
              _this.setData({
                cutdownTime: 61
              });
            }
            _this.cutdown();
          }else{
            common.showModal(re.data.desc);
          }
        }
      });
    }else{
      common.showModal("请输入正确的手机号");
    }
  },
  setmobile:function(e){//保存手机号
    this.setData({
      mobile: e.detail.value
    });
  },
  enterCode: function (e) {//保存验证码
    this.setData({
      yzm:e.detail.value
    });
  }, 
  cutdown:function(){//倒计时
    var _this = this;
    _this.setData({
      timer:null
    });
    function down() {
      clearTimeout(_this.data.timer);
      _this.setData({
        cutdownTime: _this.data.cutdownTime-1
      });
      if (_this.data.cutdownTime > 0) {
        _this.setData({
          timer: setTimeout(function () {
            down();
          }, 1000)
        });
      } else {
        _this.setData({
          cutdownTime:0
        });
      }
    }
    down();
  },
  loginBind:function(__code){//登录绑定
    var _mobile = this.data.mobile.trim();
    var _code = this.data.yzm.trim();
    var _this = this;
    common.getAjax({
      url: 'wx_we/api/oauth/bind',
      params: {
        mobile: _mobile,
        smsCode: _code,
        code: __code,
        bmapLng: _this.data.longitude,
        bmapLat: _this.data.latitude 
      },
      success: function (re) {
        console.log("登录认证绑定success:", re);
        if (re.data.code == 200) {
          app.globalData.token = re.data.data.token;
          common.reLaunch('/pages/index/index');
        } else {
          common.showModal(re.data.desc);
        }
      },
      fail: function (re) {
        console.log("登录认证绑定 fail:", re);
      }
    });
  },
  getStorageLocation: function () {//从缓存中获取定位
    return wx.getStorageSync("location");
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.shareTitleText,
      path: '/pages/front/front',
      imageUrl: app.globalData.shareImgUrl
    }
  }
});
